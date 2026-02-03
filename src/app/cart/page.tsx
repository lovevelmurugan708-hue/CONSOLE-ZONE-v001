"use client";

import { useCart } from "@/context/cart-context";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { handleCheckout } from "@/components/CheckoutHandler";
import Link from "next/link";
import { formatCurrency } from "@/utils/format";
import { VisualsService, VisualSettings } from "@/services/visuals";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CartPage() {
    const { cart, removeItem, updateQuantity, totalPrice } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [settings, setSettings] = useState<VisualSettings | null>(null);

    useEffect(() => {
        const loadSettings = async () => {
            const data = await VisualsService.getSettings();
            setSettings(data);
        };
        loadSettings();

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => setIsScriptLoaded(true);
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    // Resolve Background Settings
    const bgEffect = settings?.layouts?.cart?.background ?? settings?.backgroundEffects;
    const opacity = (bgEffect?.imageOpacity ?? 100) / 100;
    const darkness = (bgEffect?.overlayDarkness ?? 30) / 100;
    const blur = bgEffect?.blurIntensity ?? 1;

    const onCheckout = async () => {
        if (!isScriptLoaded) {
            alert("Payment SDK is loading, please try again in a moment.");
            return;
        }

        setIsLoading(true);
        try {
            const orderData = await handleCheckout(totalPrice);

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Console Zone",
                description: "Gaming Gear Order",
                order_id: orderData.id,
                handler: function (response: any) {
                    console.log("Payment Success:", response);
                    alert("Payment Successful! Order ID: " + response.razorpay_order_id);
                    // Optionally clear cart or redirect
                },
                prefill: {
                    name: "Customer",
                    email: "customer@consolezone.com",
                },
                theme: {
                    color: "#A855F7",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Failed to initialize checkout.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Dynamic Background */}
            {settings && (
                <div className="fixed inset-0 z-0">
                    {/* Background Image Layer */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
                        style={{
                            backgroundImage: `url(${settings.pageBackgrounds?.home?.[0] || '/images/backgrounds/bg-1.jpg'})`, // Fallback to first home bg or add cart specific later? 
                            // Using main background for consistency if cart bg not defined
                            opacity: opacity
                        }}
                    />

                    {/* Dark Overlay Layer */}
                    <div
                        className="absolute inset-0 bg-black transition-all duration-700"
                        style={{ opacity: darkness }}
                    />

                    {/* Blur Layer */}
                    <div
                        className="absolute inset-0 backdrop-blur-[var(--blur)] transition-all duration-700 pointer-events-none"
                        style={{ '--blur': `${blur}px` } as any}
                    />
                </div>
            )}

            {/* Fallback Background if settings loading */}
            {!settings && <div className="absolute inset-0 bg-[#050505] z-0" />}

            <div className="max-w-7xl mx-auto relative z-10">
                <h1 className="text-4xl font-black text-white mb-8 tracking-tight">Your Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence mode="popLayout">
                            {cart.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center"
                                >
                                    <ShoppingBag size={64} className="text-gray-600 mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
                                    <p className="text-gray-400 mb-6">Looks like you haven't added any gear yet.</p>
                                    <Link
                                        href="/buy"
                                        className="inline-flex items-center justify-center px-6 py-3 bg-[#A855F7] hover:bg-[#9333ea] text-white font-bold rounded-xl transition-all"
                                    >
                                        Start Browsing
                                    </Link>
                                </motion.div>
                            ) : (
                                cart.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex gap-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 group hover:bg-white/10 transition-colors"
                                    >
                                        <div className="w-32 h-32 bg-black/40 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-bold text-white mb-1">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-[#A855F7] font-medium">Verified Asset</p>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center gap-4 bg-black/40 rounded-xl px-2 py-1.5 border border-white/5">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-2 text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="text-white font-bold w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-2 text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-gray-400 text-sm">Total Price</p>
                                                    <span className="text-2xl font-bold text-white">
                                                        {formatCurrency(item.price * item.quantity)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    {cart.length > 0 && (
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-24"
                            >
                                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="text-white font-medium">{formatCurrency(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-400">
                                        <span>Taxes (Included)</span>
                                        <span className="text-green-400 font-medium">18% GST</span>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-400">
                                        <span>Shipping</span>
                                        <span className="text-[#A855F7] font-medium">Free</span>
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-4 mb-8">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-white">Total Amount</span>
                                        <span className="text-3xl font-bold text-white">
                                            {formatCurrency(totalPrice)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={onCheckout}
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-[#A855F7] to-[#8B5CF6] hover:brightness-110 text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={24} className="animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Procced to Checkout
                                            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-gray-500 text-xs mt-4">
                                    Secure payment powered by Razorpay
                                </p>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
