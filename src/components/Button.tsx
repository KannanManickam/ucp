import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                {
                    'bg-white text-black hover:bg-white/90 shadow-sm': variant === 'primary',
                    'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
                    'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground': variant === 'outline',
                    'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
                    'h-8 px-3 text-xs': size === 'sm',
                    'h-9 px-4 py-2': size === 'md',
                    'h-10 px-8': size === 'lg',
                },
                className
            )}
            {...props}
        />
    );
}
