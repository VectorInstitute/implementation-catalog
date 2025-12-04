import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect('/login');
  }

  return <>{children}</>;
}
