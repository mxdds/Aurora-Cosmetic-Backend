import { Router } from 'express';
import {deleteProduct, getAllProducts, getProduct, saveProduct, updateProduct} from "../controller/product.controller";
import {authorizeRoles} from "../middleware/auth.middleware";
import multer from "multer";
import {deleteAllProducts} from "../services/products.service";
const productRouter:Router = Router();

const storage = multer.diskStorage({});
const upload = multer({ storage });

productRouter.get("/all", getAllProducts)
productRouter.post("/save", authorizeRoles("admin"), upload.single("image"), saveProduct);
productRouter.get("/:id", getProduct);
productRouter.put("/update/:id", authorizeRoles("admin"), updateProduct);
productRouter.delete("/delete/:id", authorizeRoles("admin"), deleteProduct);
productRouter.delete("/delete-all", authorizeRoles('admin'), async (req, res) => {
    try {
        await deleteAllProducts();
        res.status(200).json({ message: "All products deleted successfully." });
    } catch (error) {
        console.error("Error deleting all products:", error);
        res.status(500).json({ message: "Error deleting all products", error });
    }
});
export default productRouter;

