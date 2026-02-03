"use client";
// Rebuild trigger: 2

import Link from "next/link";
import { LayoutDashboard, Users, Box, QrCode, FileCheck, LogOut, TrendingUp, Monitor, Gamepad2, Image, ShoppingBag, Tag, Wrench, History as HistoryIcon, Settings, Zap } from "lucide-react";
import { usePathname } from "next/navigation";

import { TopNav } from "@/components/admin/TopNav";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAppearancePage = pathname === "/admin/appearance";


    return (
        <div className="flex min-h-screen bg-[#050505]">
            {/* Sidebar */}
            {!isAppearancePage && (
                <aside className="w-64 border-r border-white/10 bg-[#0a0a0a] flex flex-col fixed h-full z-40">
                    <div className="h-16 flex items-center px-6 border-b border-white/10">
                        <span className="text-xl font-black bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] bg-clip-text text-transparent">
                            ADMIN PANEL
                        </span>
                    </div>

                    <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                        {/* COMMERCE */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 px-4">Commerce</h4>
                            <div className="space-y-1">
                                <Link href="/admin/rentals" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${pathname === "/admin/rentals" ? "bg-[#8B5CF6]/20 text-[#8B5CF6] font-bold border border-[#8B5CF6]/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                                    <FileCheck size={18} /> Rental
                                </Link>
                                <Link href="/admin/buy" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${pathname === "/admin/buy" ? "bg-[#8B5CF6]/20 text-[#8B5CF6] font-bold border border-[#8B5CF6]/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                                    <Tag size={18} /> Trade-In
                                </Link>
                                <Link href="/admin/selling" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${pathname === "/admin/selling" ? "bg-[#8B5CF6]/20 text-[#8B5CF6] font-bold border border-[#8B5CF6]/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                                    <ShoppingBag size={18} /> Sell
                                </Link>
                                <Link href="/admin/services" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${pathname === "/admin/services" ? "bg-[#8B5CF6]/20 text-[#8B5CF6] font-bold border border-[#8B5CF6]/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                                    <Wrench size={18} /> Services
                                </Link>
                            </div>
                        </div>

                        {/* MANAGEMENT */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 px-4">Management</h4>
                            <div className="space-y-1">
                                <Link href="/admin/rentals/settings" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${pathname === "/admin/rentals/settings" ? "bg-[#8B5CF6]/20 text-[#8B5CF6] font-bold border border-[#8B5CF6]/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                                    <Gamepad2 size={18} /> Catalog
                                </Link>
                                <Link href="/admin/users" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${pathname === "/admin/users" ? "bg-[#8B5CF6]/20 text-[#8B5CF6] font-bold border border-[#8B5CF6]/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                                    <Users size={18} /> Users
                                </Link>
                                <Link href="/admin/maintenance" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${pathname === "/admin/maintenance" ? "bg-[#8B5CF6]/20 text-[#8B5CF6] font-bold border border-[#8B5CF6]/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                                    <Monitor size={18} /> Maintenance
                                </Link>
                                <Link href="/admin/qr" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${pathname === "/admin/qr" ? "bg-[#8B5CF6]/20 text-[#8B5CF6] font-bold border border-[#8B5CF6]/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                                    <QrCode size={18} /> QR Scanner
                                </Link>
                                <Link href="/admin/appearance" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${pathname === "/admin/appearance" ? "bg-[#8B5CF6]/20 text-[#8B5CF6] font-bold border border-[#8B5CF6]/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                                    <Image size={18} /> Site Visuals
                                </Link>
                                <Link href="/admin/tools" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${pathname === "/admin/tools" ? "bg-[#8B5CF6]/20 text-[#8B5CF6] font-bold border border-[#8B5CF6]/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                                    <Zap size={18} /> Site Controls
                                </Link>
                            </div>
                        </div>
                    </nav>

                    <div className="p-4 border-t border-white/10">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                        >
                            <LogOut size={20} />
                            Exit Admin
                        </Link>
                    </div>
                </aside>
            )}


            {/* Main Content */}
            <main className={`flex-1 ${isAppearancePage ? 'ml-0' : 'ml-64'} flex flex-col h-screen overflow-hidden`}>
                {!isAppearancePage && <TopNav />}
                <div className={`flex-1 ${isAppearancePage ? 'p-0' : 'p-8'} overflow-y-auto`}>
                    <div className={`${isAppearancePage ? 'max-w-none' : 'max-w-7xl mx-auto'}`}>
                        {children}
                    </div>
                </div>
            </main>

        </div>
    );
}
