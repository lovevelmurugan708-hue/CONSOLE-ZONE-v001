"use client";

import { Wrench, CheckCircle, AlertOctagon, RotateCcw, PenTool, User } from "lucide-react";

export default function MaintenanceAdmin() {
    const maintenanceItems = [
        {
            id: "M-102",
            product: "PS5 DualSense #4",
            issue: "Stick Drift",
            reportedBy: "Rahul K.",
            date: "Jan 28, 2024",
            status: "In Repair",
            estimatedFix: "Jan 31",
            priority: "High"
        },
        {
            id: "M-104",
            product: "Xbox Series X HDMI Port",
            issue: "No Signal",
            reportedBy: "Internal QC",
            date: "Jan 25, 2024",
            status: "Diagnostics",
            estimatedFix: "Unknown",
            priority: "Critical"
        },
        {
            id: "M-105",
            product: "Nintendo Switch Joycon",
            issue: "Button Stuck",
            reportedBy: "User Return",
            date: "Jan 29, 2024",
            status: "Pending",
            estimatedFix: "Feb 02",
            priority: "Low"
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                    <Wrench className="text-[#F59E0B]" size={32} />
                    Maintenance Bay
                </h1>
                <p className="text-gray-400">Track repairs, cleaning, and quality control</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Status Columns */}
                {['Pending', 'In Repair', 'Ready for QC'].map((column, colIndex) => (
                    <div key={colIndex} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                            <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest">{column}</h3>
                            <span className="bg-white/5 text-xs font-bold px-2 py-1 rounded text-gray-500">
                                {maintenanceItems.filter(i =>
                                    (colIndex === 0 && i.status === 'Pending') ||
                                    (colIndex === 1 && (i.status === 'In Repair' || i.status === 'Diagnostics')) ||
                                    (colIndex === 2 && i.status === 'Ready')
                                ).length}
                            </span>
                        </div>

                        <div className="space-y-3 flex-1">
                            {maintenanceItems
                                .filter(i =>
                                    (colIndex === 0 && i.status === 'Pending') ||
                                    (colIndex === 1 && (i.status === 'In Repair' || i.status === 'Diagnostics')) ||
                                    (colIndex === 2 && i.status === 'Ready')
                                )
                                .map((item, i) => (
                                    <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${item.priority === 'Critical' ? 'bg-red-500 text-black' :
                                                item.priority === 'High' ? 'bg-orange-500 text-black' :
                                                    'bg-blue-500 text-black'
                                                }`}>{item.priority}</span>
                                            <span className="text-[10px] font-mono text-gray-500">{item.id}</span>
                                        </div>
                                        <h4 className="font-bold text-white text-sm mb-1">{item.product}</h4>
                                        <p className="text-gray-400 text-xs mb-3">Issue: {item.issue}</p>

                                        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                                                <User size={12} />
                                            </div>
                                            <span className="text-[10px] text-gray-500">{item.reportedBy}</span>
                                        </div>
                                    </div>
                                ))}
                            {/* Empty state visual */}
                            {maintenanceItems.filter(i =>
                                (colIndex === 0 && i.status === 'Pending') ||
                                (colIndex === 1 && (i.status === 'In Repair' || i.status === 'Diagnostics')) ||
                                (colIndex === 2 && i.status === 'Ready')
                            ).length === 0 && (
                                    <div className="h-32 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center text-gray-600 text-xs font-bold uppercase tracking-widest">
                                        No Items
                                    </div>
                                )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
