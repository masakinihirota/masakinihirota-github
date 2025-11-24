// Pure logic for CreateRootAccount component — no side-effects here
export const initialState = {
    success: false,
    message: '',
    errors: {},
};

/**
 * transformFormData - simple helper to read form values into a typed object
 */
export function transformFormData(formData: FormData) {
    return {
        displayName: String(formData.get('displayName') ?? ''),
        location: formData.get('location') ? String(formData.get('location')) : undefined,
    };
}

export type CreateRootAccountState = typeof initialState;
