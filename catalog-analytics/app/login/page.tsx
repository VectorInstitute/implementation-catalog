import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      {/* Vector Brand Header Accent */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-vector-magenta via-vector-violet to-vector-cobalt"></div>

      <div className="card p-8 max-w-md w-full text-center animate-fade-in">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-vector-magenta via-vector-violet to-vector-cobalt bg-clip-text text-transparent mb-4">
          Catalog Analytics
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Sign in with your Vector Institute Google account to access the analytics dashboard.
        </p>

        <Link href="/api/auth/login">
          <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-300 dark:border-slate-600 rounded-xl hover:border-vector-magenta dark:hover:border-vector-violet hover:shadow-lg hover:shadow-vector-magenta/20 transition-all duration-200 font-semibold">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>
        </Link>

        <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-semibold">Note:</span> Only Vector Institute email accounts (@vectorinstitute.ai) are allowed to access this dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
