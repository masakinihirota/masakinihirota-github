export const registerUser = async (payload: { email: string }) => {
    if (!payload.email) return { ok: false }
    return { ok: true }
}
