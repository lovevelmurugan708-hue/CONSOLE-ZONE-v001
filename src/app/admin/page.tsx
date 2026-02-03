"use client";

import { motion } from "framer-motion";
import {
    LayoutDashboard,
    ShoppingBag,
    Palette,
    Globe,
    Users,
    Tag,
    Settings,
    ArrowRight,
    Search,
    Wrench,
    ShieldCheck
} from "lucide-react";
import Link from "next/link";

const ADMIN_MODULES = [
    {
        title: "Trade-In Center",
        description: "Manage sell requests and trade-in values.",
        icon: <Tag size={24} />,
        href: "/admin/buy",
        color: "bg-green-500/10 text-green-500 border-green-500/20"
    },
    {
        title: "Appearance Editor",
        description: "Customize site visuals, colors, and layout.",
        icon: <Palette size={24} />,
        href: "/admin/appearance",
        color: "bg-purple-500/10 text-purple-500 border-purple-500/20"
    },
    {
        title: "Brand & SEO",
        description: "Update site identity, metadata, and footer.",
        icon: <Globe size={24} />,
        href: "/admin/brand",
        color: "bg-pink-500/10 text-pink-500 border-pink-500/20"
    },
    {
        title: "Services Manager",
        description: "Update service offerings and pricing.",
        icon: <Wrench size={24} />,
        href: "/admin/services", // Check if this exists
        color: "bg-orange-500/10 text-orange-500 border-orange-500/20"
    },
    {
        title: "User Management",
        description: "View registered users and permissions.",
        icon: <Users size={24} />,
        href: "/admin/users",
        color: "bg-teal-500/10 text-teal-500 border-teal-500/20"
    }
];

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header */}
                <header className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="text-[#A855F7]" size={32} />
                            <h1 className="text-3xl font-black uppercase italic tracking-tighter">
                                Mission Control
                            </h1>
                        </div>
                        <p className="text-gray-500 font-mono text-sm uppercase tracking-widest pl-11">
                            System Status: <span className="text-green-500">Online</span>
                        </p>
                    </div>
                </header>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ADMIN_MODULES.map((module, idx) => (
                        <Link href={module.href} key={idx}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="h-full bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 flex flex-col gap-4 hover:border-[#A855F7]/30 hover:bg-[#A855F7]/5 transition-all group cursor-pointer"
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${module.color}`}>
                                    {module.icon}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold uppercase tracking-tight group-hover:text-[#A855F7] transition-colors">
                                        {module.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {module.description}
                                    </p>
                                </div>
                                <div className="mt-auto pt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-600 group-hover:text-white transition-colors">
                                    <span>Access Module</span>
                                    <ArrowRight size={14} />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Quick Info */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-white/10 flex items-center justify-between">
                    <div>
                        <h4 className="text-lg font-bold uppercase italic mb-1">Need to verify the live site?</h4>
                        <p className="text-gray-400 text-sm">Check how your changes look on the public frontend.</p>
                    </div>
                    <Link href="/" target="_blank" className="bg-white text-black px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[#A855F7] hover:text-white transition-colors">
                        Open Live Site
                    </Link>
                </div>
            </div>
        </div>
    );
}
