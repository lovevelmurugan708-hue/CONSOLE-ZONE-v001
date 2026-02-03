"use client";

import { useEffect, useState } from "react";
import { FileText, Search, Download, Eye, ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";
import { getAllTransactions, Transaction } from "@/services/admin";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export default function InvoicesPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getAllTransactions();
                setTransactions(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const filtered = transactions.filter(t =>
        t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 min-h-screen text-white">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <ArrowLeft size={20} className="text-gray-400" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter">Invoices</h1>
                        <p className="text-gray-400">Manage and print transaction records</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[#0a0a0a] border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:border-[#8B5CF6] outline-none transition-colors w-64"
                        />
                    </div>
                    <button className="bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-all">
                        <Download size={16} />
                        EXPORT CSV
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="animate-spin text-[#8B5CF6]" size={32} />
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-[#050505] text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5">
                            <tr>
                                <th className="p-4 pl-6">Invoice ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right pr-6">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500 text-sm">No transactions found.</td>
                                </tr>
                            ) : filtered.map((tx) => (
                                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4 pl-6 font-mono text-xs text-gray-400">
                                        #{tx.id.slice(0, 8)}
                                    </td>
                                    <td className="p-4">
                                        <span className="font-bold text-white block">{tx.customerName}</span>
                                        <span className="text-xs text-gray-500">{tx.customerEmail}</span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-400">
                                        {format(new Date(tx.date), 'MMM dd, yyyy')}
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider border ${tx.type === 'RENTAL'
                                                ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            }`}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono font-bold text-white">
                                        ₹{tx.amount.toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        <span className="text-[10px] bg-white/5 text-gray-300 px-2 py-1 rounded border border-white/10 uppercase font-bold">
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right pr-6">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/admin/invoices/${tx.id}`}
                                                className="p-2 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-lg hover:bg-[#8B5CF6] hover:text-white transition-all"
                                                title="View Invoice"
                                            >
                                                <Printer size={16} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
