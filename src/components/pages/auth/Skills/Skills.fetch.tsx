// Data fetching or hooks for Skills component
// Keep IO isolated here so page components stay focused on layout
export const getSkills = async (_userId: string) => {
    // placeholder: replace with actual fetch using fetch()/supabase client
    return Promise.resolve([
        { id: 's1', name: 'Writing', level: 5 },
        { id: 's2', name: 'Design', level: 3 },
    ])
}
