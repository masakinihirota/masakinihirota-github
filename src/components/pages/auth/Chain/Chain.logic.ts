export const chainSummary = (items: Array<{ id: string; title: string }>) => items.map(i => i.title).join(' › ')
