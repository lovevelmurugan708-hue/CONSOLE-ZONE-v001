export type Role = 'customer' | 'admin' | 'seller';
export type ProductCategory = 'PS5' | 'Xbox' | 'PS4' | 'VR' | 'Handheld' | 'Accessory' | 'Game';
export type ProductType = 'rent' | 'buy' | 'trade-in';
export type ProductStatus = 'available' | 'rented' | 'maintenance' | 'sold' | 'hidden';
export type RentalStatus = 'pending' | 'active' | 'completed' | 'overdue' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'failed';
export type KYCStatus = 'pending' | 'approved' | 'rejected';
export type DeliveryStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Profile {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    role: Role;
    phone?: string;
    kyc_status: KYCStatus;
    wallet_balance: number;
    created_at: string;
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    category: ProductCategory;
    type: ProductType;
    status: ProductStatus;
    price: number; // Daily rate for rent, Full price for buy
    stock: number;
    stock_warning_level?: number;
    images?: string[];
    image?: string;
    features?: string[];
    specs?: Record<string, string>;
    seller_id?: string;
    created_at: string;
}

export interface Rental {
    id: string;
    user_id: string;
    product_id: string;
    start_date: string;
    end_date: string;
    total_price: number;
    status: RentalStatus;
    payment_status: PaymentStatus;
    payment_method?: 'cash' | 'card' | 'upi';
    deposit_amount: number;
    damage_reported: boolean;
    notes?: string;
    created_at: string;
    // Joins
    product?: Product;
    user?: Profile;
}

export interface Order {
    id: string;
    user_id: string;
    total_amount: number;
    payment_status: PaymentStatus;
    delivery_status: DeliveryStatus;
    shipping_address?: string;
    created_at: string;
    // Joins
    items?: OrderItem[];
    user?: Profile;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    price_at_purchase: number;
    product?: Product;
}

export interface KYCDocument {
    id: string;
    user_id: string;
    document_type: string;
    document_url: string;
    status: KYCStatus;
    admin_notes?: string;
    uploaded_at: string;
}

export interface AdminLog {
    id: string;
    admin_id: string;
    action: string;
    target_resource: string;
    target_id?: string;
    details?: string;
    created_at: string;
}

export interface ServiceItem {
    id: string;
    name: string;
    category: 'Repair' | 'Maintenance' | 'Modification' | 'Other';
    price: number;
    duration: string;
    status: 'Active' | 'Inactive';
    description?: string;
    created_at?: string;
}

export interface SaleItem {
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
    total: number;
}

export interface SaleRecord {
    id: string;
    items: SaleItem[];
    total_amount: number;
    payment_method: 'cash' | 'card' | 'upi';
    status: 'completed' | 'refunded';
    date: string;
    timestamp: number;
}
