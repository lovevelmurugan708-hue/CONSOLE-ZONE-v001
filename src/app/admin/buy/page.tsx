"use client";

import { useState, useEffect } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct, Product, ProductCategory } from "@/services/products";
import { Plus, Search, Edit2, Trash2, Save, X, ShoppingBag, Package, DollarSign, Image as ImageIcon, Tag } from "lucide-react";
import Link from 'next/link';

export default function BuyAdmin() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Edit/Create State
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
    const [isSaving, setIsSaving] = useState(false);

    const loadProducts = async () => {
        setIsLoading(true);
        try {
            // Specifically load Trade-In items only
            const data = await getProducts('trade-in', undefined, true);
            setProducts(data);
        } catch (error) {
            console.error("Failed to load products", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleCreate = () => {
        setCurrentProduct({
            name: "",
            description: "",
            price: 0,
            category: "PS5",
            stock: 1,
            images: [],
            type: 'trade-in',
            status: 'available'
        });
        setIsEditing(true);
    };

    const handleEdit = (product: Product) => {
        setCurrentProduct({ ...product });
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
        try {
            await deleteProduct(id);
            await loadProducts();
        } catch (error) {
            alert("Failed to delete product");
        }
    };

    const handleSave = async () => {
        if (!currentProduct.name || !currentProduct.price) {
            alert("Name and Price are required!");
            return;
        }

        setIsSaving(true);
        try {
            const payload = { ...currentProduct, type: 'trade-in' } as Partial<Product>;

            if (currentProduct.id) {
                await updateProduct(currentProduct.id, payload);
            } else {
                await createProduct(payload as Product);
            }
            await loadProducts();
            setIsEditing(false);
        } catch (error) {
            console.error("Save failed", error);
            alert("Failed to save product");
        } finally {
            setIsSaving(false);
        }
    };

    const toggleStatus = async (product: Product) => {
        try {
            const newStatus = product.status === 'hidden' ? 'available' : 'hidden';
            await updateProduct(product.id, { status: newStatus });
            loadProducts();
        } catch (e) {
            console.error(e);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading Trade-In Center...</div>;

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#A855F7] selection:text-white">
            {/* Header */}
            <header className="h-16 border-b border-white/10 bg-[#0A0A0A] flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="h-6 w-[1px] bg-white/10" />
                    <h1 className="text-lg font-black uppercase tracking-tight italic flex items-center gap-2">
                        TRADE-IN <span className="text-[#06B6D4]">CENTER</span>
                    </h1>
                </div>

                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-lg hover:scale-105 active:scale-95 bg-[#06B6D4] text-black shadow-[#06B6D4]/20"
                >
                    <Plus size={16} />
                    Add Trade-In Item
                </button>
            </header>

            <div className="max-w-7xl mx-auto p-8">
                {/* Search Bar */}
                <div className="mb-8 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search trade-in items..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-700 outline-none transition-all focus:border-[#06B6D4]"
                    />
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <div key={product.id} className={`group bg-[#0A0A0A] border ${product.status === 'hidden' ? 'border-red-900/30 opacity-60' : 'border-white/5'} rounded-2xl overflow-hidden transition-all flex flex-col hover:border-opacity-50 hover:border-[#06B6D4]`}>
                            <div className="relative aspect-square bg-black/50">
                                <img
                                    src={product.images?.[0] || "/images/products/ps5.png"}
                                    alt={product.name}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:scale-110 transition-transform"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    {/* Visibility Toggle for Trade-In or Store */}
                                    <button
                                        onClick={() => toggleStatus(product)}
                                        className={`p-2 text-white rounded-lg shadow-lg hover:scale-110 transition-transform ${product.status === 'hidden' ? 'bg-green-600' : 'bg-gray-600'}`}
                                        title={product.status === 'hidden' ? "Show" : "Hide"}
                                    >
                                        {product.status === 'hidden' ? <Save size={14} /> : <X size={14} />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="p-2 bg-red-600 text-white rounded-lg shadow-lg hover:scale-110 transition-transform"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold uppercase tracking-widest text-white border border-white/10">
                                    {product.category}
                                </div>
                                {product.status === 'hidden' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                                        <span className="text-red-500 font-black uppercase tracking-widest border border-red-500 px-3 py-1 rounded">HIDDEN</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="text-lg font-bold uppercase italic leading-tight mb-1">{product.name}</h3>
                                <p className="text-gray-500 text-xs line-clamp-2 mb-4 flex-1">{product.description}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <span className="text-xl font-black text-[#06B6D4]">₹{product.price.toLocaleString()}</span>
                                    <span className="text-[10px] bg-[#06B6D4]/20 text-[#06B6D4] px-2 py-0.5 rounded uppercase font-bold">Trade-In Value</span>
                                </div>
                            </div>
                        </div>
                    ))}
// ... (rest of file)

                    {filteredProducts.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center p-20 opacity-50">
                            <Package size={48} className="text-gray-600 mb-4" />
                            <p className="text-gray-500 font-bold uppercase tracking-widest">No products found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0f0f0f]">
                            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                {currentProduct.id ? <Edit2 size={14} className="text-[#06B6D4]" /> : <Plus size={14} className="text-[#06B6D4]" />}
                                {currentProduct.id ? "Edit Trade-In Item" : "New Trade-In Item"}
                            </h2>
                            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Product Name</label>
                                    <input
                                        value={currentProduct.name}
                                        onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#06B6D4] outline-none font-bold"
                                        placeholder="e.g. PlayStation 5 Digital Edition"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price (₹)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                                        <input
                                            type="number"
                                            value={currentProduct.price}
                                            onChange={e => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
                                            className="w-full bg-black border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-[#06B6D4] outline-none font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stock Level</label>
                                    <input
                                        type="number"
                                        value={currentProduct.stock}
                                        onChange={e => setCurrentProduct({ ...currentProduct, stock: Number(e.target.value) })}
                                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#06B6D4] outline-none font-mono"
                                    />
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {['PS5', 'Xbox', 'Handheld', 'Game', 'Accessory'].map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setCurrentProduct({ ...currentProduct, category: cat as ProductCategory })}
                                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all ${currentProduct.category === cat
                                                    ? 'bg-[#06B6D4] text-black border-[#06B6D4]'
                                                    : 'bg-transparent text-gray-500 border-white/10 hover:border-white/30'
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Image URL</label>
                                    <div className="relative">
                                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                                        <input
                                            value={currentProduct.images?.[0] || ""}
                                            onChange={e => setCurrentProduct({ ...currentProduct, images: [e.target.value] })}
                                            className="w-full bg-black border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-[#06B6D4] outline-none text-xs"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
                                    <textarea
                                        rows={4}
                                        value={currentProduct.description}
                                        onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#06B6D4] outline-none resize-none text-sm"
                                        placeholder="Detailed product info..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/10 bg-[#0f0f0f] flex justify-end gap-4">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 bg-[#06B6D4] hover:bg-[#0891B2] text-black px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                {isSaving ? "Saving..." : "Save Item"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
