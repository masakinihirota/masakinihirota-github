export const attemptLogin = async (credentials: { id: string; pw: string }) => {
    // placeholder - integrate real auth (supabase/next-auth) later
    if (credentials.id && credentials.pw) return { ok: true }
    return { ok: false }
}
