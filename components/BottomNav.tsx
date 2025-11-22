"use client";

import React from "react";
import { MessageSquare, Activity, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { motion } from "framer-motion";

export const BottomNav: React.FC = () => {
    const pathname = usePathname();

    const tabs = [
        { name: "Home", href: "/", icon: MessageSquare },
        { name: "Insights", href: "/insights", icon: Activity },
        // { name: "Profile", href: "/profile", icon: User }, // Commented out until profile is ready
    ];

    return (
        <motion.nav
            className="absolute bottom-0 left-0 w-full bg-sam-dark/80 backdrop-blur-xl border-t border-white/10 py-2 px-6 shadow-2xl flex justify-around items-center z-50 pb-safe"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
        >
            {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                const Icon = tab.icon;
                return (
                    <Link
                        key={tab.name}
                        href={tab.href}
                        className={clsx(
                            "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200",
                            isActive ? "text-primary" : "text-gray-400 hover:text-gray-200"
                        )}
                    >
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[10px] font-medium">{tab.name}</span>
                    </Link>
                );
            })}
        </motion.nav>
    );
};
