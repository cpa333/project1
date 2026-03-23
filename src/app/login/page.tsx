import { login, signup } from './actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mt-20 mx-auto">
      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <h1 className="text-3xl font-bold text-center mb-6">Welcome Back</h1>
        
        <label className="text-md font-medium text-gray-700" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          name="email"
          placeholder="you@example.com"
          required
        />
        
        <label className="text-md font-medium text-gray-700" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        
        <button
          formAction={login}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-4 py-2 mb-2 transition-colors"
        >
          Sign In
        </button>
        
        <button
          formAction={signup}
          className="border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 rounded-md px-4 py-2 transition-colors"
        >
          Sign Up
        </button>
        
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-red-50 text-red-600 text-center text-sm font-medium rounded-md border border-red-200">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}
