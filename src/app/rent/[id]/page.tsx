"use client";


import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, AlertCircle, Info, Gamepad2, Monitor, Tv, Wifi } from "lucide-react";
import BookingForm from "@/components/BookingForm";
import JoystickLoader from "@/components/ui/JoystickLoader";
import { CONSOLE_IMAGES } from "@/constants/images";

import { PRODUCTS } from "@/constants/products";
import { getCatalogSettings } from "@/services/catalog-settings";

// Fetch product from centralized data
const getProduct = (id: string) => {
    const staticProduct = PRODUCTS[id] || PRODUCTS["default"];
    const catalog = getCatalogSettings();

    // Override prices if available in dynamic settings
    if (id === 'ps5' || id === 'ps4' || id === 'xbox') {
        const key = id as 'ps5' | 'ps4' | 'xbox';
        return {
            ...staticProduct,
            price: catalog[key].daily.price,
            weeklyPrice: catalog[key].weekly.price,
            monthlyPrice: catalog[key].monthly.price
        };
    }

    return staticProduct;
};

export default function RentPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const unwrappedParams = use(params);
    const unwrappedSearchParams = use(searchParams);
    const id = unwrappedParams.id;
    const plan = typeof unwrappedSearchParams.plan === 'string' ? unwrappedSearchParams.plan : 'DAILY';
    const product = getProduct(id);

    const [loading, setLoading] = useState(true);
    const [kycStatus, setKycStatus] = useState({ aadhar: true }); // Mock Status
    const [mainImage, setMainImage] = useState(product.image);

    useEffect(() => {
        setMainImage(product.image);
    }, [product]);

    useEffect(() => {
        // Simulate checking availability
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Back Link */}
            <Link href="/rental" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#8B5CF6] mb-8 transition-colors">
                <ArrowLeft size={18} /> Back to Catalog
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                {/* Left Column: Product Visuals & Details */}
                <div className="lg:col-span-7 space-y-8">
                    {/* Main Image Stage */}
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden aspect-video flex items-center justify-center relative group">
                        <div className="absolute inset-0 bg-transparent opacity-50" />
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-4">
                        {product.thumbs.map((thumb: string, i: number) => (
                            <div
                                key={i}
                                onClick={() => setMainImage(thumb)}
                                className={`w-24 h-24 bg-[#0a0a0a] border rounded-xl overflow-hidden cursor-pointer transition-colors ${mainImage === thumb ? 'border-[#8B5CF6] ring-1 ring-[#8B5CF6]' : 'border-white/10 hover:border-[#8B5CF6]'}`}
                            >
                                <img src={thumb} alt={`View ${i}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>

                    {/* Details Section */}
                    <div className="pt-8 border-t border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-6">Device Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            {product.features.map((feature: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-xl">
                                    <CheckCircle size={18} className="text-[#10B981]" />
                                    <span className="text-gray-300">{feature}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-gray-400 leading-relaxed">{product.description}</p>
                    </div>
                </div>

                {/* Right Column: Booking Panel */}
                <div className="lg:col-span-5">
                    <div className="sticky top-24 space-y-6">

                        {/* Loading State or Booking Form */}
                        {loading ? (
                            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center min-h-[500px]">
                                <JoystickLoader />
                                <p className="text-gray-400 mt-4 text-sm">Checking availability...</p>
                            </div>
                        ) : (
                            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-1 overflow-hidden shadow-2xl relative">
                                {/* Header Strip */}
                                <div className="bg-[#101010] p-4 flex justify-between items-center border-b border-white/5">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Booking Panel</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                                        <span className="text-[#10B981] text-xs font-bold">In Stock</span>
                                    </div>
                                </div>

                                <div className="p-1">
                                    {/* We pass a simplified product object to the form */}
                                    <BookingForm product={{ ...product, rate: product.price, weeklyRate: product.weeklyPrice, monthlyRate: product.monthlyPrice, id: id }} initialPlan={plan} />
                                </div>

                                {/* KYC Status Footer */}
                                <div className="bg-[#101010] p-6 border-t border-white/5">
                                    <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">KYC Requirement</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400 text-sm flex items-center gap-2">
                                                <Info size={14} /> ID Proof (Aadhaar)
                                            </span>
                                            {kycStatus.aadhar ? (
                                                <span className="text-[#10B981] text-xs font-bold flex items-center gap-1"><CheckCircle size={14} /> VERIFIED</span>
                                            ) : (
                                                <span className="text-gray-500 text-xs text-right">Pending Upload</span>
                                            )}
                                        </div>


                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Support Box */}
                        <div className="bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-xl p-4 flex items-start gap-4">
                            <div className="bg-[#8B5CF6]/20 p-2 rounded-lg text-[#8B5CF6]">
                                <Wifi size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">Need Help?</h4>
                                <p className="text-xs text-gray-400 mt-1">Chat with our gaming experts if you are unsure which console fits your weekend plans.</p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
