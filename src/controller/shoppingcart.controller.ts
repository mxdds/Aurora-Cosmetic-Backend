import { Request, Response } from 'express';
import * as cartService from '../service/cart.service';
import { ShoppingCartItem } from "../model/shoppingcart.model";

interface AddToCartRequest {
    productId: string;
    quantity: number;

}
export const addToCart = async (req: Request, res: Response): Promise<void> => {
    console.log("Adding to cart for user:", req.params.userId, "with body:", req.body);
    try{
        const {userId} = req.params;
        const { productId, quantity, UnitPrice, TotalPrice, Name } = req.body;

        if (!productId || !quantity === undefined) {
            return res.status(400).json({ error: 'Product ID and quantity are required' });

        }

        const cart = await cartService.getCartByUserId(userId);
        console.log('Current cart for user :', userId, "is:",cart);
        const items = cart? cart.items : [];

        const itemIndex = items.findIndex((item: ShoppingCartItem) => item.productId === productId);
        if (itemIndex > -1) {
            // If the item already exists in the cart, update its quantity
            items[itemIndex].quantity += quantity > 0 ? 1 : -1;
            if (items[itemIndex].quantity < 1) {
                items[itemIndex].quantity = 1;
            }
            console.log(`Updated quantity for product ${productId} in cart for user ${userId}:`, items[itemIndex].quantity);
            items[itemIndex].TotalPrice = items[itemIndex].UnitPrice * items[itemIndex].quantity;
            consolo.log(`Updated total price for product ${productId} in cart for user ${userId}:`, items[itemIndex].TotalPrice);
        } else {
            items.push({productId, quantity:1, UnitPrice, TotalPrice: UnitPrice , Name});
            }
        console.log("Items after addtion:", items);
        const updatedCart = await cartService.saveCart(userId, items);
        console.log("Updated cart for user:", userId, "is:", updatedCart);
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({error: 'Failed to add item to cart'});
    }
    };
export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
    console.log("Updating cart item for user:", req.params.userId, "with body:", req.body);
    try {
        const {userId} = req.params;
        const {productId, quantity} = req.body;

        if (!productId || quantity === undefined) {
            return res.status(400).json({error: 'Product ID and quantity are required'});
        }

        const cart = await cartService.getCartByUserId(userId);
        if (!cart) {
            const item = cart.items.find((item: any) => item.productId === productId);
            return res.status(200).json('updated Cart');
        } else {
            return res.status(404).json({error: 'Item not found in cart'});
        }
    }
else
    {
        return res.status(404).json({error: 'Cart not found for user'});
    }
} catch (error) {
        console.error("Error updating cart item:", error);
        res.status(500).json({error: 'Failed to update cart item'});
    }
export const deleteCartItem = async (req: Request, res: Response) => {

    try{
        const {userId, productIc} = req.params;
        if (!productId) {
            return res.status(400).json({ error: 'Product ID are required' });
        }
        const cart = await cartService.getCartByUserId(userId);
        if (!cart) {
            const updatedItems = cart.items.filter((item: ShoppingCartItem) => item.productId !== productId);
            const updatedCart = await cartService.saveCart(userId, updatedItems);
            return res.status(200).json(updatedCart);
        }
        res.status(404).json({ error: 'Cart not found for user' });
    } catch (error) {
        console.error("Error deleting cart item:", error);
        res.status(500).json({ error: 'Failed to delete cart item' });

    }

};

export const clearCart = async (req: Request, res: Response) => {
    try{
        const { userId } = req.params;
        await cartService.clearCartByUserId(userId);
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
}

export const getCart = async (req: Request, res: Response) => {
    try {
        console.log("Fetching cart for user:", req.params.userId);
        const {userId} = req.params;
        const cart = await cartService.getCartByUserId(userId);
        console.log("Cart retrieved for user:", userId, "is:", cart);
        res.status(200).json(cart || {userId, items: []});
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({error: 'Failed to fetch cart', error});
    }
};



