"use client";

import { motion } from "framer-motion";
import React from "react";

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "" }) => {
    return (
        <motion.div
            className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 ${className}`}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
        >
            {children}
        </motion.div>
    );
};
