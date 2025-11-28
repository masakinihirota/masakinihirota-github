import { redirect } from 'next/navigation'

export default function LegacyProtectedRedirect() {
    // Keep compatibility for any code/links that previously used `/protected`.
    // The real dashboard page lives at `/dashboard` under the (protected) group.
    redirect('/dashboard')
}
