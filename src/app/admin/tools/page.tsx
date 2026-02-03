"use client";

import { useState, useEffect } from "react";
import {
    Globe,
    Lock,
    Zap,
    Percent,
    Tag,
    AlertTriangle,
    Type,
    Image as ImageIcon,
    Save,
    Megaphone,
    Search,
    Download,
    RefreshCw,
    Trash2,
    Gamepad2,
    LucideIcon,
    Info,
    DollarSign,
    Truck
} from "lucide-react";
import { motion } from "framer-motion";
import { getControllerSettings, saveControllerSettings, resetControllerSettings, type ControllerSettings } from '@/services/controller-settings';
import { getCatalogSettings, saveCatalogSettings, resetCatalogSettings, type CatalogSettings } from '@/services/catalog-settings';
import { getMarketplaceSettings, saveMarketplaceSettings, resetMarketplaceSettings, type MarketplaceSettings } from '@/services/marketplace-settings';
import { getSiteSettings, saveSiteSettings, resetSiteSettings, type SiteSettings } from '@/services/site-settings';
import { getBusinessSettings, saveBusinessSettings, resetBusinessSettings, type BusinessSettings } from '@/services/business-settings';

export default function AdminToolsPage() {
    const [activeTab, setActiveTab] = useState("rentals");

    // Controller Settings State
    const [controllerSettings, setControllerSettings] = useState<ControllerSettings>(getControllerSettings());

    const handleResetControllerSettings = () => {
        if (confirm('Reset controller settings to defaults?')) {
            resetControllerSettings();
            setControllerSettings(getControllerSettings());
            alert('Controller settings reset to defaults!');
        }
    };

    // Catalog Settings State
    const [catalogSettings, setCatalogSettings] = useState(getCatalogSettings());

    const handleResetCatalogSettings = () => {
        if (confirm('Reset catalog configuration to defaults?')) {
            resetCatalogSettings();
            setCatalogSettings(getCatalogSettings());
            alert('Settings reset to defaults!');
        }
    };

    // Marketplace Settings State
    const [marketplaceSettings, setMarketplaceSettings] = useState<MarketplaceSettings>(getMarketplaceSettings());

    // Site Settings State
    const [siteSettings, setSiteSettings] = useState<SiteSettings>(getSiteSettings());

    // Business Settings State
    const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(getBusinessSettings());

    // SEO Settings State
    const [selectedSeoPage, setSelectedSeoPage] = useState('home');

    // Save All Settings
    const handleSaveSettings = () => {
        try {
            saveControllerSettings(controllerSettings);
            saveCatalogSettings(catalogSettings);
            saveMarketplaceSettings(marketplaceSettings);
            saveMarketplaceSettings(marketplaceSettings);
            saveSiteSettings(siteSettings);
            saveBusinessSettings(businessSettings);

            // Show success animation/toast
            const btn = document.getElementById('save-settings-btn');
            if (btn) {
                const originalText = btn.innerText;
                btn.innerText = 'All Saved!';
                btn.classList.add('bg-green-500', 'text-white');
                btn.classList.remove('bg-white', 'text-black');
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.classList.remove('bg-green-500', 'text-white');
                    btn.classList.add('bg-white', 'text-black');
                }, 2000);
            }
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('Error saving settings. Check console.');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 pb-32">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black italic tracking-tighter uppercase">Site <span className="text-[#3B82F6]">Controls</span></h1>
                        <p className="text-gray-400 text-sm mt-1">Master configuration for the Console Zone ecosystem.</p>
                    </div>
                    <button
                        id="save-settings-btn"
                        onClick={handleSaveSettings}
                        className="px-6 py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:bg-[#3B82F6] hover:text-white transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
                    >
                        <Save size={20} />
                        Save Master Config
                    </button>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-3 space-y-2">
                        <NavButton id="rentals" icon={Gamepad2} label="Rental Engine" active={activeTab} onClick={setActiveTab} />
                        <NavButton id="business" icon={DollarSign} label="Business & Logistics" active={activeTab} onClick={setActiveTab} />
                        <NavButton id="selling" icon={Tag} label="Trade-In Policy" active={activeTab} onClick={setActiveTab} />
                        <NavButton id="content" icon={Type} label="Brand & SEO" active={activeTab} onClick={setActiveTab} />
                        <NavButton id="system" icon={Zap} label="Launch Control" active={activeTab} onClick={setActiveTab} />
                        <NavButton id="security" icon={Lock} label="Admin Security" active={activeTab} onClick={setActiveTab} />
                    </div>

                    {/* Tools Area */}
                    <div className="lg:col-span-9 space-y-6">

                        {/* RENTAL MANAGEMENT TAB */}
                        {activeTab === 'rentals' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                {/* Controller Pricing Settings */}
                                <ControlSection title="Add-on Controllers" icon={<Gamepad2 className="text-[#3B82F6]" size={20} />}>
                                    <div className="space-y-6">
                                        {/* Max Quantity */}
                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block tracking-widest">Max Selection Capacity</label>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    value={controllerSettings.maxQuantity}
                                                    onChange={(e) => setControllerSettings({ ...controllerSettings, maxQuantity: Number(e.target.value) })}
                                                    className="w-24 bg-white/5 border border-white/10 rounded-xl p-3 text-white text-center font-bold outline-none focus:border-[#3B82F6]"
                                                />
                                                <p className="text-xs text-gray-400">Inventory limit for extra controllers per order</p>

                                                <button onClick={handleResetControllerSettings} className="ml-auto text-[10px] text-gray-500 hover:text-white uppercase font-bold flex items-center gap-1">
                                                    <RefreshCw size={12} /> Reset
                                                </button>
                                            </div>
                                        </div>

                                        {/* Pricing Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* PS4 Pricing */}
                                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                                <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div> PS4 Dualshock
                                                </h4>
                                                <div className="space-y-3">
                                                    {['DAILY', 'WEEKLY', 'MONTHLY'].map((plan) => (
                                                        <div key={plan} className="flex items-center justify-between gap-4">
                                                            <label className="text-[9px] text-gray-500 uppercase font-bold">{plan}</label>
                                                            <div className="flex items-center bg-black/50 border border-white/5 rounded-lg pr-3">
                                                                <input
                                                                    type="number"
                                                                    value={controllerSettings.pricing.ps4[plan as keyof typeof controllerSettings.pricing.ps4]}
                                                                    onChange={(e) => setControllerSettings({
                                                                        ...controllerSettings,
                                                                        pricing: {
                                                                            ...controllerSettings.pricing,
                                                                            ps4: { ...controllerSettings.pricing.ps4, [plan]: Number(e.target.value) }
                                                                        }
                                                                    })}
                                                                    className="w-20 bg-transparent p-2 text-white text-right text-sm outline-none"
                                                                />
                                                                <span className="text-[10px] text-gray-600 font-bold">INR</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* PS5 Pricing */}
                                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                                <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div> PS5 DualSense
                                                </h4>
                                                <div className="space-y-3">
                                                    {['DAILY', 'WEEKLY', 'MONTHLY'].map((plan) => (
                                                        <div key={plan} className="flex items-center justify-between gap-4">
                                                            <label className="text-[9px] text-gray-500 uppercase font-bold">{plan}</label>
                                                            <div className="flex items-center bg-black/50 border border-white/5 rounded-lg pr-3">
                                                                <input
                                                                    type="number"
                                                                    value={controllerSettings.pricing.ps5[plan as keyof typeof controllerSettings.pricing.ps5]}
                                                                    onChange={(e) => setControllerSettings({
                                                                        ...controllerSettings,
                                                                        pricing: {
                                                                            ...controllerSettings.pricing,
                                                                            ps5: { ...controllerSettings.pricing.ps5, [plan]: Number(e.target.value) }
                                                                        }
                                                                    })}
                                                                    className="w-20 bg-transparent p-2 text-white text-right text-sm outline-none"
                                                                />
                                                                <span className="text-[10px] text-gray-600 font-bold">INR</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ControlSection>

                                {/* Catalog Configuration */}
                                <ControlSection title="Subscription Tiers" icon={<Percent className="text-[#3B82F6]" size={20} />}>
                                    <div className="space-y-6">
                                        {(['ps5', 'ps4', 'xbox'] as const).map(console => (
                                            <div key={console} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                                                <h4 className="text-white font-black text-sm uppercase tracking-tighter mb-6 flex justify-between items-center">
                                                    <span>{console} BASE ENGINE</span>
                                                    <div className="px-2 py-0.5 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] text-[8px] font-black tracking-widest">CALIBRATED</div>
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    {['daily', 'weekly', 'monthly'].map((plan) => (
                                                        <div key={plan} className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{plan}</label>
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-xs font-mono">₹</span>
                                                                    <input
                                                                        type="number"
                                                                        value={catalogSettings[console][plan as keyof typeof catalogSettings[typeof console]].price}
                                                                        onChange={(e) => setCatalogSettings({
                                                                            ...catalogSettings,
                                                                            [console]: {
                                                                                ...catalogSettings[console],
                                                                                [plan]: {
                                                                                    ...catalogSettings[console][plan as keyof typeof catalogSettings[typeof console]],
                                                                                    price: Number(e.target.value)
                                                                                }
                                                                            }
                                                                        })}
                                                                        className="w-16 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs font-bold outline-none"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <textarea
                                                                placeholder="Bullet points (one per line)"
                                                                rows={3}
                                                                value={catalogSettings[console][plan as keyof typeof catalogSettings[typeof console]].features.join('\n')}
                                                                onChange={(e) => setCatalogSettings({
                                                                    ...catalogSettings,
                                                                    [console]: {
                                                                        ...catalogSettings[console],
                                                                        [plan]: {
                                                                            ...catalogSettings[console][plan as keyof typeof catalogSettings[typeof console]],
                                                                            features: e.target.value.split('\n')
                                                                        }
                                                                    }
                                                                })}
                                                                className="w-full bg-black/50 border border-white/5 rounded-xl p-3 text-white text-[10px] outline-none focus:border-[#3B82F6] font-mono leading-relaxed"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ControlSection>
                            </motion.div>
                        )}

                        {/* BUSINESS & LOGISTICS TAB */}
                        {activeTab === 'business' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <ControlSection title="Logistics & Delivery" icon={<Truck className="text-[#3B82F6]" size={20} />}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block tracking-widest">Base Delivery Fee</label>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="number"
                                                    value={businessSettings.logistics.deliveryFee}
                                                    onChange={(e) => setBusinessSettings({
                                                        ...businessSettings,
                                                        logistics: { ...businessSettings.logistics, deliveryFee: Number(e.target.value) }
                                                    })}
                                                    className="w-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white font-black text-xl outline-none focus:border-[#3B82F6]"
                                                />
                                                <span className="text-xs font-bold text-gray-500">INR</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block tracking-widest">Free Delivery Threshold</label>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="number"
                                                    value={businessSettings.logistics.freeDeliveryThreshold}
                                                    onChange={(e) => setBusinessSettings({
                                                        ...businessSettings,
                                                        logistics: { ...businessSettings.logistics, freeDeliveryThreshold: Number(e.target.value) }
                                                    })}
                                                    className="w-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white font-black text-xl outline-none focus:border-[#3B82F6]"
                                                />
                                                <span className="text-xs font-bold text-gray-500">INR Cart Value</span>
                                            </div>
                                        </div>
                                    </div>
                                </ControlSection>

                                <ControlSection title="Taxes & Fees" icon={<DollarSign className="text-[#3B82F6]" size={20} />}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block tracking-widest">GST / Tax Rate</label>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="number"
                                                    value={businessSettings.finance.taxRate}
                                                    onChange={(e) => setBusinessSettings({
                                                        ...businessSettings,
                                                        finance: { ...businessSettings.finance, taxRate: Number(e.target.value) }
                                                    })}
                                                    className="w-24 bg-white/5 border border-white/10 rounded-xl p-4 text-white font-black text-xl outline-none focus:border-[#3B82F6]"
                                                />
                                                <span className="text-xs font-bold text-gray-500">%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block tracking-widest">Platform Fee</label>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="number"
                                                    value={businessSettings.finance.platformFee}
                                                    onChange={(e) => setBusinessSettings({
                                                        ...businessSettings,
                                                        finance: { ...businessSettings.finance, platformFee: Number(e.target.value) }
                                                    })}
                                                    className="w-24 bg-white/5 border border-white/10 rounded-xl p-4 text-white font-black text-xl outline-none focus:border-[#3B82F6]"
                                                />
                                                <span className="text-xs font-bold text-gray-500">INR / Order</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block tracking-widest">Late Fee</label>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="number"
                                                    value={businessSettings.finance.lateFeePerDay}
                                                    onChange={(e) => setBusinessSettings({
                                                        ...businessSettings,
                                                        finance: { ...businessSettings.finance, lateFeePerDay: Number(e.target.value) }
                                                    })}
                                                    className="w-24 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-white font-black text-xl outline-none focus:border-red-500"
                                                />
                                                <span className="text-xs font-bold text-gray-500">INR / Day</span>
                                            </div>
                                        </div>
                                    </div>
                                </ControlSection>
                            </motion.div>
                        )}
                        {activeTab === 'selling' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <ControlSection title="Buy-Back Algorithms" icon={<Tag className="text-[#3B82F6]" size={20} />}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Payout Multipliers</h4>

                                            <div>
                                                <label className="text-[10px] text-white uppercase font-bold mb-2 block">Cash Payout Ratio</label>
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="number"
                                                        step="0.05"
                                                        value={marketplaceSettings.tradeInRate}
                                                        onChange={(e) => setMarketplaceSettings({ ...marketplaceSettings, tradeInRate: Number(e.target.value) })}
                                                        className="w-24 bg-white/5 border border-white/10 rounded-xl p-4 text-white font-black text-xl outline-none focus:border-[#3B82F6]"
                                                    />
                                                    <div>
                                                        <p className="text-xs text-white font-bold">{Math.round(marketplaceSettings.tradeInRate * 100)}% Conversion</p>
                                                        <p className="text-[10px] text-gray-500">Of current retail value</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[10px] text-white uppercase font-bold mb-2 block">Wallet Credit Bonus</label>
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="number"
                                                        step="0.05"
                                                        value={marketplaceSettings.creditBonus}
                                                        onChange={(e) => setMarketplaceSettings({ ...marketplaceSettings, creditBonus: Number(e.target.value) })}
                                                        className="w-24 bg-white/5 border border-white/10 rounded-xl p-4 text-white font-black text-xl outline-none focus:border-[#3B82F6]"
                                                    />
                                                    <div>
                                                        <p className="text-xs text-white font-bold">+{Math.round(marketplaceSettings.creditBonus * 100)}% Incentive</p>
                                                        <p className="text-[10px] text-gray-500">For choosing in-store wallet</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Processing Timelines (Hours)</h4>
                                            <div className="grid grid-cols-2 gap-6">
                                                {Object.entries(marketplaceSettings.payoutTiers).map(([key, value]) => (
                                                    <div key={key}>
                                                        <label className="text-[10px] text-white uppercase font-bold mb-2 block">{key}</label>
                                                        <input
                                                            type="number"
                                                            value={value}
                                                            onChange={(e) => setMarketplaceSettings({
                                                                ...marketplaceSettings,
                                                                payoutTiers: { ...marketplaceSettings.payoutTiers, [key]: Number(e.target.value) }
                                                            })}
                                                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white font-mono outline-none focus:border-[#3B82F6]"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-gray-500 font-mono mt-8 p-3 bg-black/50 rounded-lg">
                                                SITE_UI_REF: Payout estimations will sync globally across user dashboards.
                                            </p>
                                        </div>
                                    </div>
                                </ControlSection>
                            </motion.div>
                        )}

                        {/* CONTENT & SEO TAB */}
                        {activeTab === 'content' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <ControlSection title="SEO & Brand Identity" icon={<Type className="text-[#3B82F6]" size={20} />}>
                                    <div className="space-y-8">
                                        {/* Page Selector */}
                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-4 block">Select Page Configuration</label>
                                            <div className="flex gap-2 bg-white/5 p-1 rounded-xl w-fit">
                                                {Object.keys(siteSettings.seo || {}).map(pageKey => (
                                                    <button
                                                        key={pageKey}
                                                        onClick={() => setSelectedSeoPage(pageKey)}
                                                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${selectedSeoPage === pageKey ? 'bg-[#3B82F6] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                                    >
                                                        {pageKey}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* SEO Inputs */}
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                                            <h4 className="text-white font-bold text-xs uppercase tracking-widest border-b border-white/10 pb-4 mb-4 flex items-center gap-2">
                                                <Globe size={14} className="text-[#3B82F6]" />
                                                Editing: <span className="text-[#3B82F6]">{selectedSeoPage} Properties</span>
                                            </h4>

                                            <div className="space-y-4">
                                                <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Page Title (&lt;title&gt;)</label>
                                                <input
                                                    value={siteSettings.seo?.[selectedSeoPage]?.title || ''}
                                                    onChange={(e) => setSiteSettings({
                                                        ...siteSettings,
                                                        seo: {
                                                            ...siteSettings.seo,
                                                            [selectedSeoPage]: { ...siteSettings.seo[selectedSeoPage], title: e.target.value }
                                                        }
                                                    })}
                                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white font-bold outline-none focus:border-[#3B82F6]"
                                                    placeholder="Meta Title..."
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Meta Description</label>
                                                <textarea
                                                    value={siteSettings.seo?.[selectedSeoPage]?.description || ''}
                                                    onChange={(e) => setSiteSettings({
                                                        ...siteSettings,
                                                        seo: {
                                                            ...siteSettings.seo,
                                                            [selectedSeoPage]: { ...siteSettings.seo[selectedSeoPage], description: e.target.value }
                                                        }
                                                    })}
                                                    rows={3}
                                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#3B82F6] resize-none"
                                                    placeholder="Search engine summary..."
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Keywords</label>
                                                <input
                                                    value={siteSettings.seo?.[selectedSeoPage]?.keywords || ''}
                                                    onChange={(e) => setSiteSettings({
                                                        ...siteSettings,
                                                        seo: {
                                                            ...siteSettings.seo,
                                                            [selectedSeoPage]: { ...siteSettings.seo[selectedSeoPage], keywords: e.target.value }
                                                        }
                                                    })}
                                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-gray-400 font-mono text-xs outline-none focus:border-[#3B82F6]"
                                                    placeholder="comma, separated, tags"
                                                />
                                                <p className="text-[10px] text-gray-600 font-bold">Recommended: 5-8 highly relevant keywords.</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
                                            <div className="space-y-4">
                                                <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Platform Title (Global)</label>
                                                <input
                                                    value={siteSettings.siteTitle}
                                                    onChange={(e) => setSiteSettings({ ...siteSettings, siteTitle: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-[#3B82F6]"
                                                    placeholder="e.g. Console Zone"
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Platform Tagline (Global)</label>
                                                <input
                                                    value={siteSettings.siteDescription}
                                                    onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-[#3B82F6]"
                                                    placeholder="e.g. Premium Gaming Rentals"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Global Announcement Banner</label>
                                            <textarea
                                                value={siteSettings.announcement}
                                                onChange={(e) => setSiteSettings({ ...siteSettings, announcement: e.target.value })}
                                                rows={3}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-[#3B82F6] resize-none"
                                                placeholder="Message to display at the top of every page..."
                                            />
                                        </div>
                                    </div>
                                </ControlSection>
                            </motion.div>
                        )}

                        {/* SYSTEM & LAUNCH CONTROL TAB */}
                        {activeTab === 'system' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <ControlSection title="Global Toggles" icon={<Zap className="text-orange-400" size={20} />}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Holiday Mode */}
                                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-between">
                                            <div>
                                                <h4 className="text-white font-black text-sm uppercase tracking-tighter">Holiday Mode</h4>
                                                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-bold">Pause all rental requests</p>
                                            </div>
                                            <button
                                                onClick={() => setSiteSettings({ ...siteSettings, holidayMode: !siteSettings.holidayMode })}
                                                className={`w-14 h-8 rounded-full transition-all flex items-center p-1 ${siteSettings.holidayMode ? 'bg-orange-500' : 'bg-gray-800'}`}
                                            >
                                                <div className={`w-6 h-6 rounded-full bg-white transform transition-transform ${siteSettings.holidayMode ? 'translate-x-6' : 'translate-x-0'}`} />
                                            </button>
                                        </div>

                                        {/* Maintenance Mode */}
                                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-between">
                                            <div>
                                                <h4 className="text-white font-black text-sm uppercase tracking-tighter">Maintenance Mode</h4>
                                                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-bold">Lock storefront for public</p>
                                            </div>
                                            <button
                                                onClick={() => setSiteSettings({ ...siteSettings, maintenanceMode: !siteSettings.maintenanceMode })}
                                                className={`w-14 h-8 rounded-full transition-all flex items-center p-1 ${siteSettings.maintenanceMode ? 'bg-red-500' : 'bg-gray-800'}`}
                                            >
                                                <div className={`w-6 h-6 rounded-full bg-white transform transition-transform ${siteSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
                                            </button>
                                        </div>
                                    </div>
                                </ControlSection>

                                <ControlSection title="Advanced Ops" icon={<RefreshCw className="text-gray-500" size={20} />}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="p-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                        >
                                            Flush Server Cache
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Factory reset all SITE SETTINGS?')) {
                                                    resetSiteSettings();
                                                    setSiteSettings(getSiteSettings());
                                                }
                                            }}
                                            className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/20 transition-all"
                                        >
                                            Hard Reset Controls
                                        </button>
                                    </div>
                                </ControlSection>
                            </motion.div>
                        )}

                        {/* SECURITY TAB */}
                        {activeTab === 'security' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <div className="bg-[#1a1a1a] border-2 border-dashed border-white/10 rounded-3xl py-20 flex flex-col items-center justify-center text-center">
                                    <Lock size={48} className="text-gray-600 mb-6" />
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Core Security Protocols</h3>
                                    <p className="text-xs text-gray-500 max-w-xs mt-4 uppercase tracking-widest font-bold leading-relaxed">
                                        Access control list management and biometric override systems are currently managed via primary server terminal.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper Components

function NavButton({ id, icon: Icon, label, active, onClick }: { id: string, icon: LucideIcon, label: string, active: string, onClick: (id: string) => void }) {
    return (
        <button
            onClick={() => onClick(id)}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${active === id
                ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
        >
            <Icon size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
        </button>
    );
}

function ControlSection({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                {icon} {title}
            </h3>
            {children}
        </div>
    );
}
