import * as RootAccounts from '@/components/root-accounts';

export const metadata = { title: 'ルートアカウント作成 — masakinihirota' };

export default function CreateRootAccountPage() {
    return (
        <div>
            <RootAccounts.CreateRootAccount />
        </div>
    );
}
