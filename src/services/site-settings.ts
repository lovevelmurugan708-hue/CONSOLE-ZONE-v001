export interface PageSEO {
    title: string;
    description: string;
    keywords: string;
}

export interface SiteSettings {
    siteTitle: string;
    siteDescription: string;
    holidayMode: boolean;
    maintenanceMode: boolean;
    announcement: string;
    seo: Record<string, PageSEO>;
}

const DEFAULT_SETTINGS: SiteSettings = {
    siteTitle: "Console Zone",
    siteDescription: "Premium Gaming Rental Platform",
    holidayMode: false,
    maintenanceMode: false,
    announcement: "",
    seo: {
        'home': {
            title: "Console Zone | Rent PS5, Xbox & Gaming Gear",
            description: "Premium gaming rentals delivered to your doorstep. Experience the latest consoles without the commitment.",
            keywords: "ps5 rental, xbox rental, gaming console, rent games"
        },
        'rentals': {
            title: "Rent Consoles | PS5, Xbox Series X, PS4",
            description: "Browse our fleet of calibrated gaming consoles. Flexible daily, weekly, and monthly plans.",
            keywords: "ps5 rent price, xbox series x rental, gaming laptop rent"
        },
        'buy': {
            title: "Buy Gaming Gear | New & Pre-Owned",
            description: "Shop certified pre-owned consoles and new gaming accessories. Best prices guaranteed.",
            keywords: "buy ps5, used ps5, second hand gaming console"
        },
        'sell': {
            title: "Sell Your Console | Instant Cash Quote",
            description: "Get the best price for your old gaming gear. Instant quotes and doorstep pickup.",
            keywords: "sell ps5, sell xbox, cash for consoles"
        },
        'services': {
            title: "Repair & Mod | Expert Console Services",
            description: "Professional repair services for controllers, consoles, and gaming hardware.",
            keywords: "ps5 repair, controller stick drift fix, console cleaning"
        }
    }
};

export const getSiteSettings = (): SiteSettings => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    const saved = localStorage.getItem('site_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
};

export const saveSiteSettings = (settings: SiteSettings) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('site_settings', JSON.stringify(settings));
};

export const resetSiteSettings = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('site_settings');
};
