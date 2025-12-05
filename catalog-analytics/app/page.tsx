import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import AnalyticsContent from './analytics-content';

export default async function Home() {
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect('/login');
  }

  return <AnalyticsContent />;
}
