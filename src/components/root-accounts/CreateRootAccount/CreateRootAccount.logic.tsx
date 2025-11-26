// Pure logic for CreateRootAccount component — no side-effects here
export type CreateRootAccountState = {
    success: boolean;
    message: string;
    errors?: {
        displayName?: string[];
        location?: string[];
        [key: string]: string[] | undefined;
    };
};

export const initialState: CreateRootAccountState = {
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
