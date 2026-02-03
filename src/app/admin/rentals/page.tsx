"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, ArrowLeft, LayoutGrid, List as ListIcon, Calendar as CalendarIcon, FileText, AlertTriangle, CheckCircle2, Clock, Monitor as MonitorIcon, Plus, ChevronRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getAllRentals, updateRentalStatus } from "@/services/admin";
import { format } from "date-fns";
import { RentalCalendar } from "@/components/admin/RentalCalendar";
import { RentalStats } from "@/components/admin/RentalStats";
import { RentalFinancials } from "@/components/admin/RentalFinancials";
import { ConsoleStockManager } from "@/components/admin/ConsoleStockManager";
import { ReturnModal } from "@/components/admin/ReturnModal";
import { ManualBooking } from "@/components/admin/ManualBooking";

type ViewType = 'monitor' | 'ledger' | 'booking' | 'calendar';

export default function RentalsPage() {
    const [rentals, setRentals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState<ViewType>('monitor');
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [selectedRentalForReturn, setSelectedRentalForReturn] = useState<any>(null);

    const fetchRentals = async () => {
        setLoading(true);
        try {
            const data = await getAllRentals();
            setRentals(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRentals();
    }, []);

    const handleReturn = async (data: { damageCharges: number; lateFees: number; notes: string }) => {
        if (!selectedRentalForReturn) return;
        try {
            // In a real app, we'd also record the fees and notes
            await updateRentalStatus(selectedRentalForReturn.id, 'completed');
            setSelectedRentalForReturn(null);
            fetchRentals();
            alert("Rental Returned & Stock Released!");
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'active', label: 'Active' },
        { id: 'overdue', label: 'Overdue' },
        { id: 'completed', label: 'History' }
    ];

    const filteredRentals = rentals.filter(r => {
        const matchesTab = activeTab === 'all' || r.status === activeTab;
        const matchesSearch = r.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.product?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const activeRentals = rentals.filter(r => r.status === 'active' || r.status === 'overdue');

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-[#050505] text-white">

            {/* Unified Master Topbar */}
            <header className="z-30 bg-[#0a0a0a] border-b border-white/10 shadow-2xl">
                <div className="px-6 py-4 flex flex-col gap-4">
                    {/* Level 1: Identity and Controls */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-6">
                            <div>
                                <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none mb-1">Rental Master Control</h1>
                                <p className="text-[9px] text-gray-500 font-mono flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse"></span>
                                    LIVE DEPLOYMENT TERMINAL
                                </p>
                            </div>

                            {/* View Switcher Taps */}
                            <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex">
                                <button
                                    onClick={() => setActiveView('monitor')}
                                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeView === 'monitor' ? 'bg-[#06B6D4] text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'text-gray-500 hover:text-white'}`}
                                >
                                    <MonitorIcon size={12} /> Monitor
                                </button>
                                <button
                                    onClick={() => setActiveView('ledger')}
                                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeView === 'ledger' ? 'bg-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'text-gray-500 hover:text-white'}`}
                                >
                                    <ListIcon size={12} /> Ledger
                                </button>
                                <button
                                    onClick={() => setActiveView('booking')}
                                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeView === 'booking' ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'text-gray-500 hover:text-white'}`}
                                >
                                    <Plus size={12} /> New Booking
                                </button>
                                <button
                                    onClick={() => setActiveView('calendar')}
                                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeView === 'calendar' ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'text-gray-500 hover:text-white'}`}
                                >
                                    <CalendarIcon size={12} /> Calendar
                                </button>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex items-center gap-4">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                                <input
                                    placeholder="Filter ledger..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-white/20 transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Level 2: Real-time Metrics & Fleet Command */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex gap-8 items-center">
                            {/* Financial Summary */}
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Deployment Health</span>
                                <RentalFinancials variant="topbar" />
                            </div>

                            <div className="h-10 w-px bg-white/5"></div>

                            {/* Fleet Command */}
                            <div className="flex flex-col gap-1.5 flex-1 max-w-2xl">
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Fleet Command</span>
                                <ConsoleStockManager variant="topbar" />
                            </div>
                        </div>

                        {/* Quick Stats Summary */}
                        <div className="flex gap-4">
                            <div className="text-right">
                                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Active</p>
                                <p className="text-lg font-black text-[#06B6D4] leading-none">{activeRentals.length}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Value</p>
                                <p className="text-lg font-black text-green-500 leading-none">₹{activeRentals.reduce((sum, r) => sum + r.total_price, 0).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-6 relative">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="animate-spin text-[#06B6D4]" size={40} />
                            <p className="text-[10px] uppercase font-black tracking-widest text-[#06B6D4] animate-pulse">Syncing Encrypted Ledger...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {activeView === 'monitor' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {activeRentals.map(rental => (
                                    <div key={rental.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 hover:border-[#06B6D4]/50 transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#06B6D4]/5 blur-[40px] -z-10 group-hover:bg-[#06B6D4]/10 transition-colors"></div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-black overflow-hidden border border-white/10">
                                                    <img src={rental.product?.images?.[0]} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xs font-bold text-white group-hover:text-[#06B6D4] transition-colors truncate max-w-[120px]">{rental.product?.name}</h3>
                                                    <p className="text-[8px] text-gray-500 font-mono tracking-tighter uppercase">DEPLOYED: {rental.id.slice(0, 8)}</p>
                                                </div>
                                            </div>
                                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${rental.status === 'overdue' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20'} uppercase tracking-widest`}>
                                                {rental.status}
                                            </span>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-[9px] uppercase font-bold tracking-widest">
                                                <span className="text-gray-500">Customer</span>
                                                <span className="text-white truncate max-w-[100px]">{rental.user?.full_name}</span>
                                            </div>
                                            <div className="flex justify-between text-[9px] uppercase font-bold tracking-widest">
                                                <span className="text-gray-500">Expiring</span>
                                                <span className="text-orange-400">{format(new Date(rental.end_date), 'MMM dd')}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setSelectedRentalForReturn(rental)}
                                            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-2.5 text-[9px] font-black uppercase tracking-widest transition-all"
                                        >
                                            Process Return
                                        </button>
                                    </div>
                                ))}
                                {activeRentals.length === 0 && (
                                    <div className="col-span-full h-96 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-white/5 rounded-[2rem]">
                                        <div className="p-6 bg-white/5 rounded-full mb-4 border border-white/5">
                                            <MonitorIcon size={48} className="opacity-20" />
                                        </div>
                                        <p className="font-bold uppercase tracking-[0.3em] text-[10px]">Zero Active Deployments Detected</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeView === 'ledger' && (
                            <div className="animate-in fade-in duration-500">
                                <div className="flex gap-2 mb-6">
                                    {tabs.map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${activeTab === tab.id ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-[0_0_10px_rgba(139,92,246,0.2)]' : 'bg-black border-white/10 text-gray-500 hover:border-white/20'}`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                                    <table className="w-full text-left">
                                        <thead className="bg-[#050505] text-[9px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5">
                                            <tr>
                                                <th className="p-5 pl-8 text-white/40">Deployment Asset</th>
                                                <th className="p-5">Commander</th>
                                                <th className="p-5">Duration</th>
                                                <th className="p-5">Vitals</th>
                                                <th className="p-5 text-right pr-8">Allocation</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredRentals.map(rental => (
                                                <tr key={rental.id} className="hover:bg-white/[0.02] transition-colors group">
                                                    <td className="p-5 pl-8">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-8 h-8 rounded bg-black border border-white/10 flex-shrink-0">
                                                                <img src={rental.product?.images?.[0]} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                                                            </div>
                                                            <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">{rental.product?.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <div className="flex items-center gap-2">
                                                            <img src={rental.user?.avatar_url || 'https://via.placeholder.com/24'} className="w-5 h-5 rounded-full ring-1 ring-white/10" />
                                                            <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors">{rental.user?.full_name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="font-mono text-[9px] text-gray-500 uppercase">Window:</span>
                                                            <span className="font-mono text-[10px] text-orange-400/80">
                                                                {format(new Date(rental.start_date), 'dd MMM')} → {format(new Date(rental.end_date), 'dd MMM')}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-widest ${rental.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                                                            {rental.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-5 text-right pr-8">
                                                        <span className="font-mono font-bold text-green-500 text-sm">₹{rental.total_price.toLocaleString()}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeView === 'booking' && (activeView === 'booking' && (
                            <div className="h-full animate-in zoom-in-95 duration-300 max-w-6xl mx-auto">
                                <ManualBooking onSuccess={() => {
                                    setActiveView('monitor');
                                    fetchRentals();
                                }} />
                            </div>
                        ))}

                        {activeView === 'calendar' && (
                            <div className="animate-in fade-in duration-500 bg-[#0a0a0a] rounded-3xl border border-white/10 p-4">
                                <RentalCalendar rentals={rentals} />
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Modals */}
            {selectedRentalForReturn && (
                <ReturnModal
                    rental={selectedRentalForReturn}
                    onClose={() => setSelectedRentalForReturn(null)}
                    onConfirm={handleReturn}
                />
            )}
        </div>
    );
}

// Minimal placeholder icons if Activity is missing from lucide
function Activity({ size, className }: { size: number, className?: string }) {
    return <TrendingUp size={size} className={className} />;
}
