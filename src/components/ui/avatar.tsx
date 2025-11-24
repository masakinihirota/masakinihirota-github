import React from 'react';

export const Avatar: React.FC<React.PropsWithChildren<any>> = ({ children, className }) => (
    <div data-testid="avatar" className={className}>{children}</div>
);

export const AvatarImage: React.FC<{ src?: string; alt?: string }> = ({ src, alt }) => (
    <img src={src} alt={alt} data-testid="avatar-image" />
);

export const AvatarFallback: React.FC<React.PropsWithChildren<any>> = ({ children }) => (
    <div data-testid="avatar-fallback">{children}</div>
);

export default Avatar;
