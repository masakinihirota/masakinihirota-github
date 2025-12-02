import { redirect } from 'next/navigation'
import { getRootAccount } from '@/actions/root-account'
import { InitialSetupForm } from '@/components/onboarding/initial-setup-form'

export default async function OnboardingPage() {
  const rootAccount = await getRootAccount()

  if (rootAccount) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            初期設定
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            VNSの世界へようこそ。いくつか質問に答えてください。
          </p>
        </div>
        <InitialSetupForm />
      </div>
    </div>
  )
}
