import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join PeerLearn and start learning together</p>
        </div>

        <div className="space-y-4">
          <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-600 mb-4">Sign up functionality coming soon!</p>
            <p className="text-sm text-gray-500">
              This is a demo page. Full authentication will be implemented with Supabase.
            </p>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-indigo-600 hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-gray-600 hover:text-indigo-600 text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
