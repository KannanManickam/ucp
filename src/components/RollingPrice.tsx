import { motion, useSpring, useTransform } from "framer-motion";
import React, { useEffect } from "react";

export function RollingPrice({ value, className }: { value: number; className?: string }) {
    // spring config for smooth "ticker" feel
    const spring = useSpring(value, { stiffness: 50, damping: 15 });

    // Transform number to currency string
    const display = useTransform(spring, (current) => `$${current.toFixed(2)}`);

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return <motion.span className={className}>{display}</motion.span>;
}
