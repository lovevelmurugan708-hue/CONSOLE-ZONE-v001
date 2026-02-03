"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, User, Mail, ShieldCheck, Gamepad2, History } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
                return;
            }
            setUser(session.user);
            setLoading(false);
        };
        getUser();
    }, [router, supabase.auth]);

    const handleSignOut = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#A855F7]" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-12 px-4 font-display">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#A855F7]/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0A0A0A] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
                >
                    {/* Header/Cover */}
                    <div className="h-48 bg-gradient-to-r from-[#A855F7] to-[#601cc9] relative">
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
                        <div className="absolute bottom-0 left-0 w-full p-8 flex items-end translate-y-1/2">
                            <div className="w-32 h-32 rounded-3xl bg-[#0A0A0A] border-4 border-[#0A0A0A] overflow-hidden shadow-2xl">
                                {user?.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center">
                                        <User size={48} className="text-gray-700" />
                                    </div>
                                )}
                            </div>
                            <div className="ml-6 mb-2">
                                <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                                    {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <ShieldCheck size={14} className="text-[#A855F7]" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Verified Operative</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="pt-24 p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Account Details */}
                            <div className="space-y-6">
                                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#A855F7] mb-4">Account Intelligence</h2>

                                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Mail size={18} className="text-gray-500" />
                                            <div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-600">Email Link</div>
                                                <div className="text-sm text-white font-medium">{user?.email}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck size={18} className="text-gray-500" />
                                            <div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-600">Status</div>
                                                <div className="text-sm text-green-500 font-bold uppercase tracking-wider">Active</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSignOut}
                                    className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 transition-all group"
                                >
                                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                                    <span>Terminate Session</span>
                                </button>
                            </div>

                            {/* Activity */}
                            <div className="space-y-6">
                                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#A855F7] mb-4">Mission Logs</h2>

                                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[200px]">
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                                        <History size={24} className="text-gray-700" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400 font-medium">No active missions found.</div>
                                        <div className="text-[10px] text-gray-600 uppercase tracking-widest mt-2">Start your first deployment</div>
                                    </div>
                                    <Link href="/rental" className="pt-2">
                                        <button className="px-6 py-2 bg-[#A855F7]/20 hover:bg-[#A855F7]/30 border border-[#A855F7]/30 text-[#A855F7] text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all">
                                            Browse Gear
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Secret Stats */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { label: "Missions", value: "0", icon: Gamepad2 },
                        { label: "Achievements", value: "Level 1", icon: ShieldCheck },
                        { label: "Credit", value: "₹0", icon: User },
                        { label: "Rank", value: "Recruit", icon: ShieldCheck },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 text-center"
                        >
                            <stat.icon size={20} className="mx-auto text-gray-700 mb-3" />
                            <div className="text-xl font-black text-white italic tracking-tighter uppercase">{stat.value}</div>
                            <div className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em] mt-1">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
