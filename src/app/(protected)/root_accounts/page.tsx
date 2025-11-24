import { redirect } from 'next/navigation'

// Deprecated path -> perform a permanent redirect to the new kebab-case URL
export default function LegacyRootAccountsRedirect() {
	redirect('/root-accounts')
}
