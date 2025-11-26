import React from 'react';
import type { CreateRootAccountState } from './CreateRootAccount.logic';

export type CreateRootAccountViewProps = {
    // state shape is defined in CreateRootAccount.logic but can be partial/undefined
    state: CreateRootAccountState;
    // form action can be either a string (url) or a server action handler — keep loose typing
    formAction: string | ((formData: FormData) => void | Promise<void>) | undefined;
    isPending: boolean;
};

export function CreateRootAccountView({ state, formAction, isPending }: CreateRootAccountViewProps) {
    return (
        <form action={formAction} className="space-y-4 p-4 border rounded-lg shadow-md max-w-md mx-auto" data-testid="create-root-accounts-form">
            <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                    Display Name
                </label>
                <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                />
                {state.errors?.displayName && (
                    <p className="text-red-500 text-xs mt-1">{state.errors.displayName[0]}</p>
                )}
            </div>

            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                </label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
                {isPending ? 'Creating...' : 'Create Account'}
            </button>

            {state?.message && (
                <p className={`text-sm mt-2 ${state.success ? 'text-green-600' : 'text-red-600'}`}>
                    {state.message}
                </p>
            )}
        </form>
    );
}

export default CreateRootAccountView;
