import * as Onboarding from '@/components/onboarding';

export const metadata = { title: 'オンボーディング — masakinihirota' };

export default function OnboardingPagePublic() {
    // Keep the same UI/behavior as the existing protected onboarding page.
    return (
        <div>
            <Onboarding.Onboarding />
        </div>
    );
}
