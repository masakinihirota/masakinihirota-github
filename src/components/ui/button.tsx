import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: string;
    size?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, className, variant, size, ...props }) => (
    <button className={className} data-testid="button" {...props}>{children}</button>
)

export default Button
