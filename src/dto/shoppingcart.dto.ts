export interface ShoppingCartDto {
    userId: string;
    items: {
        productId: string;
        quantity: number;
    }[];
}