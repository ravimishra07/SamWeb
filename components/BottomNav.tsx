"use client";

import React from 'react';
import { MessageSquare, Activity, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export const BottomNav: React.FC = () => {
    const pathname = usePathname();

    const tabs = [
        { name: 'Log Viewer', href: '/', icon: MessageSquare },
        { name: 'Insights', href: '/insights', icon: Activity },
        { name: 'Profile', href: '/profile', icon: User },
    ];

    return (
        <nav className="flex items-center justify-around bg-sam-gray/90 backdrop-blur-md border-t border-white/5 py-3 px-2 pb-safe">
            {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                const Icon = tab.icon;
                return (
                    <Link
                        key={tab.name}
                        href={tab.href}
                        className={clsx(
                            "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200",
                            isActive ? "text-sam-blue-DEFAULT" : "text-gray-500 hover:text-gray-300"
                        )}
                    >
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[10px] font-medium">{tab.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
};
