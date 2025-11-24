import { redirect } from 'next/navigation'

export default function LegacyCreateRootAccountRedirect() {
    redirect('/root-accounts/create')
}
