export const achievementsSummary = (items: { id: string; name: string }[]) => items.map(i => i.name).join(', ')
