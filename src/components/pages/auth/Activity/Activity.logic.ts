export const summarizeActivity = (events: { id: string; title: string }[]) => events.map(e => e.title).slice(0, 3)
