"use client";

import { Bell, Search, Settings, ChevronRight, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function TopNav() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-[#0a0a0a]/80 px-6 backdrop-blur w-full">
            {/* Mobile Menu Trigger (Hidden on Desktop for now, can be implemented later) */}
            <button className="md:hidden p-2 text-gray-400 hover:text-white">
                <Menu size={20} />
            </button>

            {/* Breadcrumbs */}
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
                <span className="hover:text-white transition-colors cursor-pointer">Admin</span>
                {segments.slice(1).map((segment, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <ChevronRight size={14} className="text-gray-600" />
                        <span className="capitalize font-medium text-white hover:text-[#8B5CF6] transition-colors cursor-pointer">
                            {segment}
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex-1" />

            {/* Global Search */}
            <div className="relative hidden md:block w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                <input
                    type="text"
                    placeholder="Global Search (Ctrl+K)"
                    className="h-9 w-full rounded-full border border-white/10 bg-white/5 pl-9 pr-4 text-xs text-white placeholder:text-gray-500 focus:border-[#8B5CF6] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 border-l border-white/10 pl-4">
                <button className="relative text-gray-400 hover:text-white transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#0a0a0a]"></span>
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                    <Settings size={20} />
                </button>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-2">
                    <div className="h-8 w-8 overflow-hidden rounded-full border border-white/10">
                        <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100"
                            alt="Admin"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="hidden md:block">
                        <p className="text-xs font-bold text-white">Admin User</p>
                        <p className="text-[10px] text-gray-500">Super Admin</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
