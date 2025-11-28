'use client';

import { useActionState } from 'react';
import { createRootAccountAction } from './CreateRootAccount.fetch';
import { initialState } from './CreateRootAccount.logic';
import { CreateRootAccountView } from './CreateRootAccount.view';

/**
 * Container component — keeps data wiring and side effects (useActionState) here
 * while pure UI lives in CreateRootAccount.view.tsx
 */
export function CreateRootAccount() {
    const [state, formAction, isPending] = useActionState(createRootAccountAction, initialState);

    return <CreateRootAccountView state={state} formAction={formAction} isPending={isPending} />;
}

export default CreateRootAccount;
