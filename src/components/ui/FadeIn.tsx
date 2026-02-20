import { motion, type HTMLMotionProps } from 'framer-motion';

export function FadeIn({ children, className, delay = 0, ...props }: HTMLMotionProps<"div"> & { delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}
