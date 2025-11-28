import { describe, it, expect } from 'vitest'
import { formatNotificationTitle } from './Notifications.logic'

describe('Notifications.logic', () => {
    it('formats notification text', () => {
        expect(formatNotificationTitle({ id: 'n', text: 'Hello' })).toBe('通知: Hello')
    })
})
