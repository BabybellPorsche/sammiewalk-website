import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { hoverConfig, tapConfig, borderRadius } from '../../lib/styleguide';

interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
    children: ReactNode;
    icon?: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass';
    size?: 'default' | 'sm' | 'lg';
    className?: string;
}

export default function AnimatedButton({
    children,
    icon,
    variant = 'primary',
    size = 'default',
    className = '',
    ...props
}: AnimatedButtonProps) {

    let sizeStyles = "";
    switch (size) {
        case 'default':
            sizeStyles = "px-5 py-3 text-sm";
            break;
        case 'sm':
            sizeStyles = "px-4 py-2 text-xs";
            break;
        case 'lg':
            sizeStyles = "px-6 py-3.5 text-base";
            break;
    }

    let baseStyles = `group relative flex items-center justify-center gap-2 ${sizeStyles} ${borderRadius.interactive} font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 `;

    switch (variant) {
        case 'primary':
            baseStyles += "bg-primary text-primary-foreground shadow hover:bg-primary/90";
            break;
        case 'secondary':
            baseStyles += "bg-card border border-border/20 text-foreground shadow-sm hover:bg-muted";
            break;
        case 'danger':
            baseStyles += "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90";
            break;
        case 'ghost':
            baseStyles += "text-muted-foreground hover:bg-muted hover:text-foreground";
            break;
        case 'glass':
            baseStyles += "bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-sm hover:bg-white/20";
            break;
    }

    return (
        <motion.button
            whileHover="hover"
            whileTap={tapConfig.sharp}
            className={`${baseStyles} ${className}`}
            {...props}
        >
            {icon && (
                <motion.div
                    variants={{
                        hover: hoverConfig.iconWiggle,
                        tap: { scale: 0.95 }
                    }}
                    className="relative z-10 flex items-center justify-center"
                >
                    {icon}
                </motion.div>
            )}
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
}
