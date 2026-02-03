
import { useState, useEffect } from 'react';

export interface StockItem {
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

const STOCK_KEY = 'CONSOLE_STOCK_DATA';

// Default data if nothing is in local storage
const DEFAULT_STOCK: StockItem[] = [
    {
        id: 'ps5-disc',
        name: 'PS5 Disc Edition',
        total: 12,
        rented: 8,
        image: '/assets/products/ps5-console.png',
        label: 'PS5 Disc',
        lowStockAlert: true,
        maxControllers: 4,
        extraControllerEnabled: true
    },
    {
        id: 'ps5-digital',
        name: 'PS5 Digital Edition',
        total: 8,
        rented: 3,
        image: '/assets/products/ps5-digital.png',
        label: 'PS5 Digital',
        lowStockAlert: true,
        maxControllers: 4,
        extraControllerEnabled: true
    },
    {
        id: 'xbox-series-x',
        name: 'Xbox Series X',
        total: 6,
        rented: 2,
        image: '/assets/products/xbox-series-x.png',
        label: 'Series X',
        lowStockAlert: true,
        maxControllers: 4,
        extraControllerEnabled: true
    },
    {
        id: 'ps4-slim',
        name: 'PS4 Slim',
        total: 15,
        rented: 12,
        image: '/assets/products/ps4-console.png',
        label: 'PS4 Slim',
        lowStockAlert: false,
        maxControllers: 4,
        extraControllerEnabled: true
    }
];

let listeners: (() => void)[] = [];

function emitChange() {
    for (const listener of listeners) {
        listener();
    }
}

export const StockService = {
    useStock: () => {
        const [stock, setStock] = useState<StockItem[]>([]);

        useEffect(() => {
            const loadStock = () => {
                const stored = localStorage.getItem(STOCK_KEY);
                if (stored) {
                    try {
                        setStock(JSON.parse(stored));
                    } catch (e) {
                        setStock(DEFAULT_STOCK);
                    }
                } else {
                    setStock(DEFAULT_STOCK);
                    // Avoid hydration mismatch by waiting for mount to save defaults
                }
            };

            loadStock();
            const listener = () => loadStock();
            listeners.push(listener);
            window.addEventListener('storage', listener);

            return () => {
                listeners = listeners.filter(l => l !== listener);
                window.removeEventListener('storage', listener);
            };
        }, []);

        return stock.length > 0 ? stock : DEFAULT_STOCK;
    },

    getItems: (): StockItem[] => {
        if (typeof window === 'undefined') return DEFAULT_STOCK;
        const stored = localStorage.getItem(STOCK_KEY);
        return stored ? JSON.parse(stored) : DEFAULT_STOCK;
    },

    saveItems: (items: StockItem[]) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STOCK_KEY, JSON.stringify(items));
        emitChange();
    },

    updateUsage: (id: string, delta: number) => {
        const items = StockService.getItems();
        const item = items.find(i => i.id === id);
        if (item) {
            item.rented = Math.max(0, Math.min(item.total, item.rented + delta));
            StockService.saveItems(items);
        }
    },

    updateLimit: (id: string, newTotal: number) => {
        const items = StockService.getItems();
        const item = items.find(i => i.id === id);
        if (item) {
            item.total = Math.max(0, newTotal);
            // Ensure rented doesn't exceed total
            if (item.rented > item.total) item.rented = item.total;
            StockService.saveItems(items);
        }
    },

    updateAlert: (id: string, enabled: boolean) => {
        const items = StockService.getItems();
        const item = items.find(i => i.id === id);
        if (item) {
            item.lowStockAlert = enabled;
            StockService.saveItems(items);
        }
    },

    deleteStockItem: (id: string) => {
        const items = StockService.getItems().filter(i => i.id !== id);
        StockService.saveItems(items);
    },

    addStockItem: (item: StockItem) => {
        const items = StockService.getItems();
        items.push(item);
        StockService.saveItems(items);
    },

    updateItem: (id: string, data: Partial<StockItem>) => {
        const items = StockService.getItems();
        const index = items.findIndex(i => i.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...data };
            StockService.saveItems(items);
        }
    }
};
