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
        { name: "Log Viewer", href: "/", icon: MessageSquare },
        { name: "Insights", href: "/insights", icon: Activity },
        { name: "Profile", href: "/profile", icon: User },
    ];

    return (
        <motion.nav
            className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/10 backdrop-blur-lg border-t border-white/5 rounded-xl py-3 px-2 shadow-xl"
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
