import express from "express";
import  { getCart, addToCart, updateCartItem, deleteCartItem, clearCart } from "../controller/shoppingcart.controller";

const router = express.Router();

router.get("/:userId/get", getCart);
router.post("/:userId/save", addToCart);
router.put("/:userId/update", updateCartItem);
router.delete("/:userId/:productId/delete", deleteCartItem);
router.delete("/:userId/clear", clearCart);

export default router;