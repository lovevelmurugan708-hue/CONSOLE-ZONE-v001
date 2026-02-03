"use client";

import { useState } from "react";
import { Plus, Minus, Gamepad2, AlertCircle, RefreshCw, Bell, BellOff, Trash2, Pencil, X, Save, Upload, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StockItem {
    id: string;
    name: string;
    total: number;
    rented: number;
    image: string;
    label?: string;
    lowStockAlert?: boolean;
    maxControllers?: number;
    extraControllerEnabled?: boolean;
}

import { StockService } from "@/services/stock";

export function ConsoleStockManager({ variant = 'sidebar' }: { variant?: 'sidebar' | 'topbar' }) {
    // Real-time Stock Data from Service
    const stock = StockService.useStock();

    const updateRentals = (id: string, delta: number) => {
        StockService.updateUsage(id, delta);
    };

    const updateFleetSize = (id: string, delta: number) => {
        const item = stock.find(i => i.id === id);
        if (item) {
            const newTotal = Math.max(item.rented, item.total + delta);
            StockService.updateLimit(id, newTotal);
        }
    };

    const toggleAlert = (id: string, current: boolean) => {
        StockService.updateAlert(id, !current);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to remove this device from the fleet?")) {
            StockService.deleteStockItem(id);
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        total: 5,
        image: "https://images.unsplash.com/photo-1592840496011-a385fe93072c?q=80&w=150&auto=format&fit=crop",
        lowStockAlert: true,
        extraControllerEnabled: true,
        maxControllers: 4
    });

    const openAddModal = () => {
        setEditingId(null);
        setFormData({
            name: "",
            total: 5,
            image: "https://images.unsplash.com/photo-1592840496011-a385fe93072c?q=80&w=150&auto=format&fit=crop",
            lowStockAlert: true,
            extraControllerEnabled: true,
            maxControllers: 4
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item: StockItem) => {
        setEditingId(item.id);
        setFormData({
            name: item.name,
            total: item.total,
            image: item.image,
            lowStockAlert: !!item.lowStockAlert,
            extraControllerEnabled: item.extraControllerEnabled ?? true,
            maxControllers: item.maxControllers ?? 4
        });
        setIsModalOpen(true);
    };

    const handleSaveDevice = (e: React.FormEvent) => {
        e.preventDefault();

        const deviceData = {
            name: formData.name,
            label: formData.name,
            total: Number(formData.total),
            image: formData.image,
            lowStockAlert: formData.lowStockAlert,
            extraControllerEnabled: formData.extraControllerEnabled,
            maxControllers: Number(formData.maxControllers)
        };

        if (editingId) {
            StockService.updateItem(editingId, deviceData);
        } else {
            if (!formData.name) return;
            const id = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            StockService.addStockItem({
                id,
                rented: 0,
                ...deviceData
            });
        }

        setIsModalOpen(false);
    };

    if (variant === 'topbar') {
        return (
            <div className="flex gap-2 items-center overflow-x-auto no-scrollbar py-1">
                {stock.map((item) => {
                    const available = item.total - item.rented;
                    const utilization = Math.round((item.rented / item.total) * 100);
                    let statusColor = "#10B981";
                    if (utilization > 50) statusColor = "#F59E0B";
                    if (utilization > 85) statusColor = "#EF4444";

                    return (
                        <div key={item.id} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 shrink-0">
                            <div className="w-6 h-6 rounded bg-black overflow-hidden border border-white/5">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="text-[8px] text-gray-400 font-bold uppercase truncate max-w-[60px] leading-tight">{item.name}</p>
                                <div className="flex items-center gap-1 leading-none">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }}></span>
                                    <span className="text-[10px] font-black text-white">{available}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => openEditModal(item)}
                                className="ml-1 p-1 hover:bg-white/10 rounded transition-colors"
                            >
                                <Plus size={10} className="text-gray-500" />
                            </button>
                        </div>
                    );
                })}
                <button
                    onClick={openAddModal}
                    className="p-2 border border-dashed border-white/20 rounded-xl hover:bg-white/5 transition-all group shrink-0"
                >
                    <Plus size={16} className="text-gray-500 group-hover:text-white" />
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 relative overflow-hidden">
            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-xl font-black text-white uppercase mb-6 flex items-center gap-2">
                            {editingId ? <Pencil className="text-[#8B5CF6]" /> : <Plus className="text-[#8B5CF6]" />}
                            {editingId ? 'Edit Device Details' : 'Add New Fleet'}
                        </h3>

                        <form onSubmit={handleSaveDevice} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Device Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Steam Deck OLED"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#8B5CF6] outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Total Fleet Size</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#8B5CF6] outline-none font-mono"
                                        value={formData.total}
                                        onChange={e => setFormData({ ...formData, total: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="flex items-end">
                                    <div
                                        onClick={() => setFormData({ ...formData, lowStockAlert: !formData.lowStockAlert })}
                                        className={`w-full cursor-pointer border rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-all ${formData.lowStockAlert ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] text-[#8B5CF6]' : 'bg-black/50 border-white/10 text-gray-500'}`}
                                    >
                                        {formData.lowStockAlert ? <Bell size={18} /> : <BellOff size={18} />}
                                        <span className="text-xs font-bold uppercase">{formData.lowStockAlert ? 'Alerts ON' : 'Alerts OFF'}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Device Image</label>

                                <div className="space-y-3">
                                    {/* Image Preview Area */}
                                    <div className="relative group w-full h-40 bg-black/50 border-2 border-dashed border-white/10 rounded-xl overflow-hidden flex items-center justify-center transition-all hover:border-[#8B5CF6]/50">
                                        {formData.image ? (
                                            <>
                                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover opacity-80" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <p className="text-xs font-bold text-white uppercase">Change Image</p>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-gray-500">
                                                <ImageIcon size={24} />
                                                <span className="text-[10px] uppercase font-bold tracking-wider">No Image Selected</span>
                                            </div>
                                        )}

                                        {/* Hidden File Input covering the area */}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setFormData(prev => ({ ...prev, image: reader.result as string }));
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </div>

                                    {/* URL Fallback */}
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 text-xs">URL</span>
                                        </div>
                                        <input
                                            type="url"
                                            placeholder="or paste image address..."
                                            className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-gray-300 focus:border-[#8B5CF6] outline-none font-mono"
                                            value={formData.image.startsWith('data:') ? '' : formData.image}
                                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Controller Configuration */}
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
                                <label className="text-xs font-bold text-gray-400 uppercase block">Controller Settings</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/10">
                                        <span className="text-xs text-gray-300">Allow Extras</span>
                                        <div
                                            onClick={() => setFormData({ ...formData, extraControllerEnabled: !formData.extraControllerEnabled })}
                                            className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${formData.extraControllerEnabled ? 'bg-[#8B5CF6]' : 'bg-gray-700'}`}
                                        >
                                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.extraControllerEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                                        </div>
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Max Qty"
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#8B5CF6] outline-none font-mono text-sm"
                                            value={formData.maxControllers}
                                            onChange={e => setFormData({ ...formData, maxControllers: parseInt(e.target.value) })}
                                            disabled={!formData.extraControllerEnabled}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold uppercase py-4 rounded-xl mt-4 transition-all shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                {editingId ? 'Save Changes' : 'Confirm Addition'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {/* Header */}
            <div className="flex flex-col gap-4 mb-6 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                        <Gamepad2 size={18} className="text-[#8B5CF6]" />
                    </div>
                    <div>
                        <h3 className="text-white font-black uppercase tracking-tight text-sm">Fleet Command</h3>
                        <p className="text-gray-500 text-[9px] tracking-wide uppercase font-bold">Live Inventory</p>
                    </div>
                </div>

                <button
                    onClick={openAddModal}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase text-white transition-all group"
                >
                    <Plus size={14} className="group-hover:text-[#8B5CF6] transition-colors" />
                    New Device
                </button>
            </div>

            {/* List View */}
            <div className="space-y-4 relative z-10">
                {stock.map((item) => {
                    const available = item.total - item.rented;
                    const utilization = Math.round((item.rented / item.total) * 100);

                    // Status Color Logic
                    let statusColor = "#10B981"; // Green
                    if (utilization > 50) statusColor = "#F59E0B"; // Yellow
                    if (utilization > 85) statusColor = "#EF4444"; // Red

                    return (
                        <div key={item.id} className="group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-xl p-3 transition-all duration-300">
                            <div className="flex flex-col gap-3">
                                {/* 1. Identity & Actions */}
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-black overflow-hidden border border-white/10 shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-white text-xs truncate">{item.name}</div>
                                            <div className="text-[9px] text-gray-500 flex items-center gap-1 mt-0.5">
                                                <span
                                                    className="w-1 h-1 rounded-full animate-pulse"
                                                    style={{ backgroundColor: statusColor, boxShadow: `0 0 5px ${statusColor}` }}
                                                ></span>
                                                {available} Available
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal(item)} className="p-1.5 text-gray-500 hover:text-white transition-colors"><Pencil size={12} /></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                                    </div>
                                </div>

                                {/* 2. Utilization & Manual Controls */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-500">
                                        <span>Utilization</span>
                                        <span style={{ color: statusColor }}>{utilization}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: statusColor }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${utilization}%` }}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between pt-1">
                                        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-white/5">
                                            <button
                                                onClick={() => updateRentals(item.id, -1)}
                                                className="w-6 h-6 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded text-xs text-gray-400 hover:text-white transition-colors"
                                            >-</button>
                                            <span className="text-[10px] font-mono font-bold text-white px-1">{item.rented}/{item.total}</span>
                                            <button
                                                onClick={() => updateRentals(item.id, 1)}
                                                className="w-6 h-6 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded text-xs text-gray-400 hover:text-white transition-colors"
                                                disabled={item.rented >= item.total}
                                            >+</button>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => toggleAlert(item.id, !!item.lowStockAlert)}
                                                className={`w-6 h-6 flex items-center justify-center rounded transition-all ${item.lowStockAlert ? 'text-[#8B5CF6]' : 'text-gray-600'}`}
                                            >
                                                {item.lowStockAlert ? <Bell size={12} /> : <BellOff size={12} />}
                                            </button>
                                            <div className="flex items-center gap-1 ml-1">
                                                <button onClick={() => updateFleetSize(item.id, -1)} disabled={item.total <= item.rented} className="w-5 h-5 flex items-center justify-center rounded bg-white/5 text-gray-500 hover:text-white disabled:opacity-10"><Minus size={10} /></button>
                                                <button onClick={() => updateFleetSize(item.id, 1)} className="w-5 h-5 flex items-center justify-center rounded bg-white/5 text-gray-500 hover:text-white"><Plus size={10} /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
