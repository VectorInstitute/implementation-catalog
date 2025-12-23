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
      // Validate repo_id before using it in an outbound request
      if (typeof repo_id !== 'string' || !isValidRepoId(repo_id)) {
        return {
          repo_id: String(repo_id),
          state: 'unknown' as const,
          total_checks: 0,
          updated_at: new Date().toISOString(),
          details: 'Invalid repository identifier',
        };
      }

    }

    // Fetch CI status for all repos in parallel
    const statusPromises = repositories.map(async (repo_id) => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${repo_id.trim()}/commits/main/status`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            // No CI configured or branch doesn't exist
            return {
              repo_id,
              state: 'unknown' as const,
              total_checks: 0,
              updated_at: new Date().toISOString(),
              details: 'No CI configured or main branch not found',
            };
          }
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();

        // Treat "pending" with 0 checks as "no CI configured"
        const actualState = (data.state === 'pending' && data.total_count === 0)
          ? 'unknown'
          : data.state || 'unknown';

        return {
          repo_id,
          state: actualState,
          total_checks: data.total_count || 0,
          updated_at: data.updated_at || new Date().toISOString(),
          details: actualState === 'unknown' && data.total_count === 0
            ? 'No CI configured'
            : `${data.total_count} check(s)`,
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
