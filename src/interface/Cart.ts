
export interface AdđToCartRequest {
    productId: string,
    variantId: string,
    sizeId: string,
    quantity: number
}

export interface UpdateQuantityCartRequest {
    cartItemId: string,
    option: string
}

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    color: string;
    images: string;
    size: string;
    price: number;
    quantity: number;
    totalItemPrice: number;
    variantId: string;
    sizeId: string;
}

export interface Cart {
    user: string;
    items: CartItem[];
    totalCartPrice: number
}