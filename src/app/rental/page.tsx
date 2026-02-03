"use client";

import Link from "next/link";
import { Gamepad2, Check, Star, Monitor, ChevronDown, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/utils/format";
import { CONSOLE_IMAGES } from "@/constants/images";
import { getCatalogSettings } from "@/services/catalog-settings";
import { VisualsService, VisualSettings } from "@/services/visuals";
import { useEffect } from "react";
import { BuilderRenderer } from "@/components/Builder/BuilderRenderer";
import { usePageSEO } from "@/hooks/use-seo";

export default function RentalPage() {
    usePageSEO('rentals');
    const [activeTab, setActiveTab] = useState<'ps5' | 'ps4' | 'xbox'>('ps5');
    const [visualSettings, setVisualSettings] = useState<VisualSettings | null>(null);
    const [currentBgIndex, setCurrentBgIndex] = useState(0);

    useEffect(() => {
        const load = async () => {
            const settings = await VisualsService.getSettings();
            setVisualSettings(settings);
        };
        load();
    }, []);

    const activeConsoleBgs = (visualSettings?.consoleBackgrounds?.[activeTab] || []);
    const backgrounds = activeConsoleBgs.length > 0
        ? activeConsoleBgs
        : [activeTab === 'ps5' ? CONSOLE_IMAGES.ps5.hero : activeTab === 'ps4' ? CONSOLE_IMAGES.ps4.hero : CONSOLE_IMAGES.xbox.hero];

    useEffect(() => {
        setCurrentBgIndex(0); // Reset index when tab changes
    }, [activeTab]);

    useEffect(() => {
        if (backgrounds.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentBgIndex(prev => (prev + 1) % backgrounds.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [backgrounds]);

    // Load catalog settings safely (client-side)
    const catalog = getCatalogSettings();

    const plans = {
        ps5: [
            {
                duration: "Day",
                price: formatCurrency(catalog.ps5.daily.price),
                features: catalog.ps5.daily.features,
                extraController: formatCurrency(299),
                color: "bg-[#1a1a1a]",
                recommended: false
            },
            {
                duration: "Week",
                price: formatCurrency(catalog.ps5.weekly.price),
                features: catalog.ps5.weekly.features,
                extraController: formatCurrency(799),
                color: "bg-[#A855F7]",
                recommended: true
            },
            {
                duration: "Month",
                price: formatCurrency(catalog.ps5.monthly.price),
                features: catalog.ps5.monthly.features,
                extraController: formatCurrency(1499),
                color: "bg-[#1a1a1a]",
                recommended: false
            }
        ],
        ps4: [
            {
                duration: "Day",
                price: formatCurrency(catalog.ps4.daily.price),
                features: catalog.ps4.daily.features,
                extraController: formatCurrency(149),
                color: "bg-[#1a1a1a]",
                recommended: false
            },
            {
                duration: "Week",
                price: formatCurrency(catalog.ps4.weekly.price),
                features: catalog.ps4.weekly.features,
                extraController: formatCurrency(399),
                color: "bg-[#A855F7]",
                recommended: true
            },
            {
                duration: "Month",
                price: formatCurrency(catalog.ps4.monthly.price),
                features: catalog.ps4.monthly.features,
                extraController: formatCurrency(999),
                color: "bg-[#1a1a1a]",
                recommended: false
            }
        ],
        xbox: [
            {
                duration: "Day",
                price: formatCurrency(catalog.xbox.daily.price),
                features: catalog.xbox.daily.features,
                extraController: formatCurrency(199),
                color: "bg-[#1a1a1a]",
                recommended: false
            },
            {
                duration: "Week",
                price: formatCurrency(catalog.xbox.weekly.price),
                features: catalog.xbox.weekly.features,
                extraController: formatCurrency(799),
                color: "bg-[#10B981]",
                recommended: true
            },
            {
                duration: "Month",
                price: formatCurrency(catalog.xbox.monthly.price),
                features: catalog.xbox.monthly.features,
                extraController: formatCurrency(1499),
                color: "bg-[#1a1a1a]",
                recommended: false
            }
        ]
    };

    const gamesList = [
        "GTA V", "Red Dead Redemption 2", "PUBG: Battlegrounds", "Tomb Raider Collection", "Uncharted 4",
        "Uncharted Lost Legacy", "God of War", "God of War Ragnarok", "God of War 3", "Spider-Man Miles Morales",
        "Marvel's Spider-Man 2", "Mortal Kombat 11", "Tekken 6", "It Takes Two", "A Way Out", "WWE 2K23", "WWE 2K24",
        "FIFA 23", "FIFA 24", "Assassin's Creed Collection", "Batman Arkham Knight", "Days Gone", "Devil May Cry 5",
        "The Evil Within", "Resident Evil 4", "Resident Evil Village", "The Last of Us Remastered Part 1", "Death Stranding",
        "Detroit: Become Human", "F1 22", "F1 23", "Far Cry 3,4,5,6", "Ghost of Tsushima", "Horizon Zero Dawn",
        "Infamous Second Son", "Just Cause 4", "Kena: Bridge of Spirits", "Marvel's Guardians of the Galaxy",
        "Need for Speed Payback", "Watch Dogs 1 & 2", "Watch Dogs Legion", "Call of Duty: Black Ops Cold War",
        "Ratchet & Clank: Rift Apart", "Need for Speed Unbound", "Batman Gotham Knights", "Outlast 2", "Dead Island 2",
        "The Callisto Protocol"
    ];

    return (
        <div className="min-h-screen relative">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${activeTab}-${currentBgIndex}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: ((visualSettings?.layouts?.['rental']?.background ?? visualSettings?.backgroundEffects)?.imageOpacity ?? 60) / 100 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${backgrounds[currentBgIndex]})` }}
                    />
                </AnimatePresence>
                <div
                    className="absolute inset-0 bg-gradient-to-b from-black via-black to-[#0a0a0a]"
                    style={{ opacity: ((visualSettings?.layouts?.['rental']?.background ?? visualSettings?.backgroundEffects)?.overlayDarkness ?? (visualSettings?.globalLighting ?? 80)) / 100 }}
                />
                <div
                    className="absolute inset-0"
                    style={{ backdropFilter: `blur(${((visualSettings?.layouts?.['rental']?.background ?? visualSettings?.backgroundEffects)?.blurIntensity ?? 2)}px)` }}
                />
            </div>

            <div className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Builder Engine Canvas */}
                {(visualSettings?.layouts?.rental?.layers?.length || 0) > 0 ? (
                    <BuilderRenderer
                        elements={visualSettings!.layouts.rental.layers}
                        globalDesign={visualSettings!.globalDesign}
                    />
                ) : (
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter italic">
                            {visualSettings?.pageContent?.rental_title?.split(' ').slice(0, -1).join(' ') || "CHOOSE YOUR"} <span className="text-[#A855F7] drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">{visualSettings?.pageContent?.rental_title?.split(' ').slice(-1) || "MISSION"}</span>
                        </h1>
                        <p className="text-gray-400 font-mono text-sm mb-10 uppercase tracking-[0.2em]">
                            {visualSettings?.pageContent?.rental_subtitle || "Select from our elite fleet of current-gen and classic consoles"}
                        </p>
                        <div className="inline-flex bg-black/40 backdrop-blur-md p-1 rounded-2xl border border-white/10">
                            <button
                                onClick={() => setActiveTab('ps5')}
                                className={`px-10 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all ${activeTab === 'ps5' ? 'bg-[#A855F7] text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                PlayStation 5
                            </button>
                            <button
                                onClick={() => setActiveTab('ps4')}
                                className={`px-10 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all ${activeTab === 'ps4' ? 'bg-[#A855F7] text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                PlayStation 4
                            </button>
                            <button
                                onClick={() => setActiveTab('xbox')}
                                className={`px-10 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all ${activeTab === 'xbox' ? 'bg-[#A855F7] text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                Xbox Series X
                            </button>
                        </div>
                    </div>
                )}



                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    <AnimatePresence mode="wait">
                        {plans[activeTab].map((plan, index) => (
                            <motion.div
                                key={plan.duration}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`group relative bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden hover:border-[#A855F7]/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col ${plan.recommended ? 'ring-2 ring-[#A855F7] shadow-[0_0_40px_rgba(168,85,247,0.2)]' : ''}`}
                            >
                                {plan.recommended && (
                                    <div className="absolute top-0 inset-x-0 h-1.5 bg-[#A855F7] shadow-[0_0_15px_rgba(168,85,247,0.8)] z-20" />
                                )}

                                <div className={`p-10 ${plan.color} text-white text-center relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
                                    {/* Blob removed */}

                                    <h3 className="font-display text-2xl font-black uppercase tracking-widest relative z-10">{plan.duration}</h3>
                                    <div className="mt-4 relative z-10 flex items-center justify-center gap-1">
                                        <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                                    </div>
                                    {plan.recommended && (
                                        <span className="absolute top-4 right-4 bg-white text-black text-[10px] font-black px-3 py-1 rounded-full uppercase z-10 shadow-lg">Best Value</span>
                                    )}
                                </div>

                                <div className="p-8 flex-1 flex flex-col bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
                                    <ul className="space-y-4 mb-10 flex-1">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3 text-gray-300 group/item">
                                                <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.recommended ? 'bg-[#06B6D4]/10 text-[#06B6D4]' : 'bg-[#8B5CF6]/10 text-[#8B5CF6]'}`}>
                                                    <Check size={12} strokeWidth={4} />
                                                </div>
                                                <span className="text-sm font-medium group-hover/item:text-white transition-colors">{feature}</span>
                                            </li>
                                        ))}
                                        <li className="flex items-center gap-3 text-gray-500 pt-6 border-t border-white/5">
                                            <GameController size={18} className="shrink-0 opacity-50" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Extra Controller: <span className="text-white">{plan.extraController}</span></span>
                                        </li>
                                    </ul>

                                    <div className="space-y-4 pt-4">
                                        <Link href={activeTab === 'ps5'
                                            ? `/rent/ps5?plan=${plan.duration === 'Day' ? 'DAILY' : plan.duration === 'Week' ? 'WEEKLY' : plan.duration === 'Month' ? 'MONTHLY' : 'DAILY'}`
                                            : activeTab === 'ps4' ? `/rent/ps4?plan=${plan.duration === 'Day' ? 'DAILY' : plan.duration === 'Week' ? 'WEEKLY' : plan.duration === 'Month' ? 'MONTHLY' : 'DAILY'}`
                                                : `/rent/xbox?plan=${plan.duration === 'Day' ? 'DAILY' : plan.duration === 'Week' ? 'WEEKLY' : plan.duration === 'Month' ? 'MONTHLY' : 'DAILY'}`} className={`group/btn relative overflow-hidden block w-full text-center py-5 rounded-2xl font-black text-lg transition-all ${plan.recommended
                                                    ? 'bg-[#A855F7] text-white shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.6)]'
                                                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-[#A855F7]/50'
                                                    }`}>
                                            <span className="relative z-10 flex items-center justify-center gap-2 tracking-widest uppercase">
                                                RENT NOW <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </span>
                                        </Link>


                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Games List */}
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">INCLUDED GAMES LIBRARY</h2>
                        <p className="text-gray-400">All rentals come with access to our massive library of top-tier titles.</p>
                    </div>

                    <div className="bg-[#0a0a0a] border border-[#8B5CF6]/30 rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[#8B5CF6]/5 rounded-3xl" />
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                            {gamesList.map((game, i) => (
                                <div key={i} className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                                    <span className="text-sm font-medium">{game}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 text-center">
                            <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-xs text-gray-400 uppercase tracking-widest">And many more...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function GameController({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <line x1="6" x2="10" y1="12" y2="12" />
            <line x1="8" x2="8" y1="10" y2="14" />
            <line x1="15" x2="15.01" y1="13" y2="13" />
            <line x1="18" x2="18.01" y1="11" y2="11" />
            <rect x="2" y="6" width="20" height="12" rx="2" />
        </svg>
    );
}
