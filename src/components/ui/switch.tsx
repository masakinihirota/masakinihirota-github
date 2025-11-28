import React from 'react'

export const Switch: React.FC<{ defaultChecked?: boolean }> = ({ defaultChecked = false }) => (
    <input type="checkbox" defaultChecked={defaultChecked} data-testid="switch" />
)

export default Switch
