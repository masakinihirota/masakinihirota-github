import React from 'react'

export const Button: React.FC<React.PropsWithChildren<{ variant?: string; size?: string; className?: string; disabled?: boolean }>> = ({ children, className }) => (
  <button className={className} data-testid="button">{children}</button>
)

export default Button
