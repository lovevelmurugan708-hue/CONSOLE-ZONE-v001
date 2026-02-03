"use client";

import { useState, useRef } from "react";
import { Upload, User, MapPin, Phone, ShieldCheck, FileCheck, Scan, CheckCircle2, ChevronRight, AlertCircle, Fingerprint, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function KYCPage() {
    const [submitted, setSubmitted] = useState(false);
    const [activeField, setActiveField] = useState<string | null>(null);

    // Form states
    const [address, setAddress] = useState("");
    const [isLocating, setIsLocating] = useState(false);

    // File states
    const [idFile, setIdFile] = useState<File | null>(null);
    const [selfieFile, setSelfieFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate submission
        setTimeout(() => setSubmitted(true), 2000);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: (f: File | null) => void) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const detectLocation = () => {
        setIsLocating(true);
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();

                    if (data && data.display_name) {
                        setAddress(data.display_name);
                    }
                } catch (error) {
                    console.error("Error fetching address:", error);
                    alert("Failed to fetch address details.");
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert("Unable to retrieve your location. Please check your permissions.");
                setIsLocating(false);
            }
        );
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(57,255,20,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,20,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-[#0a0a0a] border border-[#39ff14]/30 rounded-2xl p-8 text-center relative z-10 box-glow-green"
                >
                    <div className="w-24 h-24 bg-[#39ff14]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#39ff14] relative">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-[#39ff14]/20 rounded-full"
                        />
                        <ShieldCheck size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2 tracking-tight">IDENTITY VERIFIED</h2>
                    <p className="text-gray-400 mb-8">
                        Your documents have been securely transmitted to our encrypted vault. Verification usually takes less than <span className="text-[#39ff14]">2 hours</span>.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full py-4 bg-[#39ff14] text-black font-bold rounded-xl hover:bg-[#2ecc12] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(57,255,20,0.3)]"
                    >
                        RETURN TO HUB <ChevronRight size={18} />
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030303] flex flex-col lg:flex-row text-white pt-[60px] lg:pt-0 overflow-hidden">

            {/* LEFT COLUMN: VISUALS (Sticky on Desktop) */}
            <div className="lg:w-5/12 relative hidden lg:flex flex-col justify-center p-12 overflow-hidden border-r border-white/5 bg-[#050505]">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#A855F7]/10 via-transparent to-transparent opacity-50" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#A855F7]/5 rounded-full blur-[100px]" />

                <div className="relative z-10">
                    <div className="mb-12 inline-block">
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39ff14] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#39ff14]"></span>
                            </span>
                            <span className="text-xs font-mono text-[#39ff14] tracking-wider">SECURE CONNECTION ESTABLISHED</span>
                        </div>
                    </div>

                    <h1 className="text-6xl font-black mb-6 leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 uppercase tracking-tighter">CITIZEN</span><br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#FFFFFF]">VERIFICATION</span>
                    </h1>

                    <p className="text-lg text-gray-400 mb-12 max-w-md leading-relaxed">
                        To ensure the safety of our premium console fleet, we require a one-time identity verification. Your data is encrypted with military-grade protocols.
                    </p>

                    <div className="grid gap-6 max-w-sm">
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-[#A855F7]/30 transition-colors">
                            <div className="p-3 bg-[#A855F7]/20 rounded-lg text-[#A855F7]">
                                <Scan size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold uppercase tracking-tight">AI-Powered Check</h3>
                                <p className="text-xs text-gray-400 font-mono">Instant document analysis</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-[#39ff14]/30 transition-colors">
                            <div className="p-3 bg-[#39ff14]/20 rounded-lg text-[#39ff14]">
                                <Fingerprint size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold uppercase tracking-tight">Biometric Match</h3>
                                <p className="text-xs text-gray-400 font-mono">Face liveness detection</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/2 right-[-100px] w-64 h-64 border border-white/5 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                    <div className="w-48 h-48 border border-white/10 rounded-full border-t-[#A855F7]" />
                </div>
            </div>

            {/* RIGHT COLUMN: FORM (Scrollable) */}
            <div className="lg:w-7/12 relative h-full lg:h-screen lg:overflow-y-auto bg-[#030303]">
                <div className="min-h-full p-6 md:p-12 lg:p-24 max-w-3xl mx-auto flex flex-col justify-center">

                    {/* Mobile Header */}
                    <div className="lg:hidden mb-12">
                        <h1 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#FFFFFF] uppercase tracking-tighter">KYC PORTAL</h1>
                        <p className="text-gray-400 font-mono text-sm">Complete verification to unlock rentals.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Section 1: Identity */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-[#A855F7] flex items-center justify-center text-white font-black">1</div>
                                <h2 className="text-xl font-black tracking-widest uppercase italic">Personal Identity</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="group">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-[#A855F7] transition-colors">Full Legal Name</label>
                                    <div className={`relative bg-[#0A0A0A] border rounded-xl overflow-hidden transition-all duration-300 ${activeField === 'name' ? 'border-[#A855F7] shadow-[0_0_20px_rgba(168,85,247,0.1)]' : 'border-white/10'}`}>
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                            <User size={18} />
                                        </div>
                                        <input
                                            required
                                            type="text"
                                            placeholder="John Doe"
                                            onFocus={() => setActiveField('name')}
                                            onBlur={() => setActiveField(null)}
                                            className="w-full bg-transparent p-4 pl-12 text-white outline-none placeholder:text-gray-700"
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-[#A855F7] transition-colors">Mobile Number</label>
                                    <div className={`relative bg-[#0A0A0A] border rounded-xl overflow-hidden transition-all duration-300 ${activeField === 'phone' ? 'border-[#A855F7] shadow-[0_0_20px_rgba(168,85,247,0.1)]' : 'border-white/10'}`}>
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                            <Phone size={18} />
                                        </div>
                                        <input
                                            required
                                            type="tel"
                                            placeholder="+91"
                                            onFocus={() => setActiveField('phone')}
                                            onBlur={() => setActiveField(null)}
                                            className="w-full bg-transparent p-4 pl-12 text-white outline-none placeholder:text-gray-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="group">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 group-focus-within:text-[#A855F7] transition-colors">Residential Address</label>
                                    <button
                                        type="button"
                                        onClick={detectLocation}
                                        disabled={isLocating}
                                        className="text-xs font-black text-[#A855F7] hover:text-[#A855F7]/80 flex items-center gap-1 disabled:opacity-50 uppercase tracking-widest"
                                    >
                                        {isLocating ? <Loader2 size={12} className="animate-spin" /> : <MapPin size={12} />}
                                        {isLocating ? "Locating..." : "Use Current Location"}
                                    </button>
                                </div>
                                <div className={`relative bg-[#0A0A0A] border rounded-xl overflow-hidden transition-all duration-300 ${activeField === 'address' ? 'border-[#A855F7] shadow-[0_0_20px_rgba(168,85,247,0.1)]' : 'border-white/10'}`}>
                                    <div className="absolute left-4 top-4 text-gray-500">
                                        <MapPin size={18} />
                                    </div>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="Full delivery address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        onFocus={() => setActiveField('address')}
                                        onBlur={() => setActiveField(null)}
                                        className="w-full bg-transparent p-4 pl-12 text-white outline-none placeholder:text-gray-700 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        {/* Section 2: Documents */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-[#A855F7] flex items-center justify-center text-white font-black">2</div>
                                <h2 className="text-xl font-black tracking-widest uppercase italic">Document Upload</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* ID Card Upload */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Government ID</label>
                                    <div className={`relative group cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-all ${idFile ? 'border-[#39ff14] bg-[#39ff14]/5' : 'border-white/10 hover:border-[#A855F7] hover:bg-white/5'}`}>
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, setIdFile)} accept="image/*,.pdf" />

                                        {idFile ? (
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 bg-[#39ff14]/20 rounded-full flex items-center justify-center text-[#39ff14] mb-2">
                                                    <CheckCircle2 size={24} />
                                                </div>
                                                <p className="text-sm font-bold text-white truncate max-w-full px-4 font-mono">{idFile.name}</p>
                                                <p className="text-xs text-[#39ff14] mt-1 font-black uppercase tracking-widest">Authenticated</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 bg-[#A855F7]/10 rounded-full flex items-center justify-center text-[#A855F7] mb-3 group-hover:scale-110 transition-transform">
                                                    <FileCheck size={24} />
                                                </div>
                                                <p className="text-gray-300 font-black text-xs uppercase tracking-widest">Upload Aadhar / Voter ID</p>
                                                <p className="text-[10px] text-gray-500 mt-2 font-mono">PDF, JPG up to 5MB</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Selfie Upload */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Live Selfie</label>
                                    <div className={`relative group cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-all ${selfieFile ? 'border-[#39ff14] bg-[#39ff14]/5' : 'border-white/10 hover:border-[#A855F7] hover:bg-white/5'}`}>
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, setSelfieFile)} accept="image/*" />

                                        {selfieFile ? (
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 bg-[#39ff14]/20 rounded-full flex items-center justify-center text-[#39ff14] mb-2">
                                                    <CheckCircle2 size={24} />
                                                </div>
                                                <p className="text-sm font-bold text-white truncate max-w-full px-4 font-mono">{selfieFile.name}</p>
                                                <p className="text-xs text-[#39ff14] mt-1 font-black uppercase tracking-widest">Authenticated</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 bg-[#A855F7]/10 rounded-full flex items-center justify-center text-[#A855F7] mb-3 group-hover:scale-110 transition-transform">
                                                    <User size={24} />
                                                </div>
                                                <p className="text-gray-300 font-black text-xs uppercase tracking-widest">Upload Selfie with ID</p>
                                                <p className="text-[10px] text-gray-500 mt-2 font-mono">Face clearly visible</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#39ff14]/5 border border-[#39ff14]/10 rounded-lg p-4 flex items-start gap-3">
                                <AlertCircle size={18} className="text-[#39ff14] mt-0.5" />
                                <div className="text-xs text-gray-400 font-mono">
                                    <span className="text-[#39ff14] font-black uppercase tracking-widest block mb-1">Privacy Guarantee</span>
                                    Your ID is only used for verification and is automatically deleted from our servers 30 days after your rental period ends.
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-5 bg-[#A855F7] text-white font-black text-lg rounded-xl shadow-[0_4px_30px_rgba(168,85,247,0.3)] hover:shadow-[0_4px_40px_rgba(168,85,247,0.5)] transition-all transform hover:-translate-y-1 relative overflow-hidden group uppercase tracking-[0.2em]"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Initiate Verification <Scan size={20} />
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                    </form>

                    <p className="text-center text-[10px] text-gray-600 mt-6 uppercase tracking-widest">
                        Combating Fraud • Securing Assets • Trusting Gamers
                    </p>
                </div>
            </div>
        </div>
    );
}
