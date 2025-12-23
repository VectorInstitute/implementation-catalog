import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface CIStatusRequest {
  repositories: string[]; // Array of repo_ids like "VectorInstitute/cyclops"
}

interface CIStatus {
  repo_id: string;
  state: 'success' | 'failure' | 'pending' | 'error' | 'unknown';
  total_checks: number;
  updated_at: string;
  details?: string;
}

function isValidRepoId(repo_id: string): boolean {
  // Expect GitHub-style "owner/repo" with safe characters only
  const trimmed = repo_id.trim();
  const repoPattern = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
  return repoPattern.test(trimmed);
}

export async function POST(request: Request) {
  try {
    const { repositories }: CIStatusRequest = await request.json();

    if (!Array.isArray(repositories)) {
      return NextResponse.json(
        { error: 'Invalid request: "repositories" must be an array of strings' },
        { status: 400 }
      );
    }

    const token = process.env.GH_TOKEN || process.env.CATALOG_GITHUB_TOKEN || process.env.GITHUB_TOKEN || process.env.METRICS_GITHUB_TOKEN;

    if (!token) {
      // Return unknown status for all repos if token is not configured
      const statusMap = repositories.reduce((acc, repo_id) => {
        acc[repo_id] = {
          repo_id,
          state: 'unknown' as const,
          total_checks: 0,
          updated_at: new Date().toISOString(),
          details: 'GitHub token not configured',
        };
        return acc;
      }, {} as Record<string, CIStatus>);

      return NextResponse.json(statusMap);
    }

    // Fetch CI status for all repos in parallel
    const statusPromises = repositories.map(async (repo_id) => {
      // Validate repo_id before using it in an outbound request
      const repoIdStr = String(repo_id).trim();
      if (!isValidRepoId(repoIdStr)) {
        return {
          repo_id: repoIdStr,
          state: 'unknown' as const,
          total_checks: 0,
          updated_at: new Date().toISOString(),
          details: 'Invalid repository identifier',
        };
      }

      try {
        // First, get the latest commit SHA on main branch
        const branchResponse = await fetch(
          `https://api.github.com/repos/${repoIdStr}/branches/main`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/vnd.github+json',
              'X-GitHub-Api-Version': '2022-11-28',
            },
          }
        );

        if (!branchResponse.ok) {
          if (branchResponse.status === 404) {
            return {
              repo_id,
              state: 'unknown' as const,
              total_checks: 0,
              updated_at: new Date().toISOString(),
              details: 'Main branch not found',
            };
          }
          throw new Error(`GitHub API error: ${branchResponse.status}`);
        }

        const branchData = await branchResponse.json();
        const latestCommitSha = branchData.commit.sha;

        // Now get check runs for this specific commit
        const checksResponse = await fetch(
          `https://api.github.com/repos/${repoIdStr}/commits/${latestCommitSha}/check-runs`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/vnd.github+json',
              'X-GitHub-Api-Version': '2022-11-28',
            },
          }
        );

        if (!checksResponse.ok) {
          throw new Error(`GitHub API error: ${checksResponse.status}`);
        }

        const data = await checksResponse.json();
        const checkRuns = data.check_runs || [];

        if (checkRuns.length === 0) {
          return {
            repo_id,
            state: 'unknown' as const,
            total_checks: 0,
            updated_at: new Date().toISOString(),
            details: 'No CI configured',
          };
        }

        // Check if any workflow runs failed
        // Status: completed, in_progress, queued, waiting, requested, pending
        // Conclusion (when completed): success, failure, neutral, cancelled, skipped, timed_out, action_required, startup_failure, stale
        let hasFailure = false;
        let hasPending = false;
        let mostRecentUpdate = '';

        for (const check of checkRuns) {
          // Skip Dependabot checks - they mark as "failure" for dependency conflicts which aren't CI failures
          if (check.app?.slug === 'dependabot' || check.name === 'Dependabot') {
            continue;
          }

          // If the check hasn't completed yet, mark as pending
          if (check.status !== 'completed') {
            hasPending = true;
          }
          // If completed, check the conclusion
          else if (check.conclusion === 'failure' ||
                   check.conclusion === 'timed_out' ||
                   check.conclusion === 'action_required' ||
                   check.conclusion === 'startup_failure') {
            hasFailure = true;
          }

          // Track most recent update
          const updateTime = check.completed_at || check.started_at;
          if (updateTime && (!mostRecentUpdate || updateTime > mostRecentUpdate)) {
            mostRecentUpdate = updateTime;
          }
        }

        // Determine overall state based on the checks
        let state: 'success' | 'failure' | 'pending' | 'error' | 'unknown';
        if (hasFailure) {
          state = 'failure';
        } else if (hasPending) {
          state = 'pending';
        } else {
          // All checks completed without failure
          state = 'success';
        }

        return {
          repo_id,
          state,
          total_checks: checkRuns.length,
          updated_at: mostRecentUpdate || new Date().toISOString(),
          details: `${checkRuns.length} check(s)`,
        };
      } catch (error) {
        console.error(`Error fetching CI status for ${repo_id}:`, error);
        return {
          repo_id,
          state: 'unknown' as const,
          total_checks: 0,
          updated_at: new Date().toISOString(),
          details: 'Error fetching status',
        };
      }
    });

    const results = await Promise.all(statusPromises);

    // Convert array to object keyed by repo_id for easy lookup
    const statusMap = results.reduce((acc, status) => {
      acc[status.repo_id] = status;
      return acc;
    }, {} as Record<string, CIStatus>);

    return NextResponse.json(statusMap);
  } catch (error) {
    console.error('CI status API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CI statuses' },
      { status: 500 }
    );
  }
}
