import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { borderRadius } from '../../lib/styleguide';

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

    let baseStyles = `group relative flex items-center justify-center gap-2 ${sizeStyles} ${borderRadius.interactive} font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 `;

    switch (variant) {
        case 'primary':
            baseStyles += "bg-primary text-primary-foreground hover:bg-primary/90";
            break;
        case 'secondary':
            baseStyles += "bg-card border border-border/20 text-foreground hover:bg-muted";
            break;
        case 'danger':
            baseStyles += "bg-destructive text-destructive-foreground hover:bg-destructive/90";
            break;
        case 'ghost':
            baseStyles += "text-muted-foreground hover:bg-muted hover:text-foreground";
            break;
        case 'glass':
            baseStyles += "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 hover:border-white/40";
            break;
    }

    return (
        <motion.button
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            variants={{
                idle: { y: 0 },
                hover: { y: 0 },
                tap: { opacity: 0.8 }
            }}
            className={`${baseStyles} ${className}`}
            {...props}
        >
            {icon && (
                <motion.div
                    variants={{
                        hover: { x: 2 },
                        tap: { opacity: 0.8 }
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
