import React from 'react'

export const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
    <div className={className} data-testid="card">{children}</div>
)

export const CardHeader: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
    <div className={className} data-testid="card-header">{children}</div>
)

export const CardTitle: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
    <h3 className={className} data-testid="card-title">{children}</h3>
)

export const CardDescription: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
    <div className={className} data-testid="card-desc">{children}</div>
)

export const CardContent: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
    <div className={className} data-testid="card-content">{children}</div>
)

export default Card
