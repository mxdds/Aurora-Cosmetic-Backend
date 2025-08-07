import { Request, Response } from 'express';
import * as productService from '../service/product.service';
import {sendEmail} from "../utils/email.util";
import {getAdminEmails} from "../utils/user.util";
import productModel from "../model/product.model";


export const getAllProducts = async (req: Request, res: Response) => {
    try{
        const products = await productService.getAllProducts();
        console.log("Products retrieved successfully:", products);
        res.status(200).json(products);
    } catch (error) {
        console.log("Error retrieving products:", error);
        res.status(500).json({ message: "Error retrieving products", error });
    }

}

export const saveProduct = async (req: Request, res: Response) => {
    try{
        const{ name, price, currency, description, category, image} = req.body;

        if(!name || !price || !currency || !description || !category || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const id = await productService.generateUniqueId();

        const product = {id, name, price, currency, description, category, image};
        const savedProduct = await productService.saveProduct(product);

        const adminEmails = await getAdminEmails();

        await sendEmail(
            adminEmails.join(', '),
            "New Product Added",
            `A new product has been added:\n\nName: ${name}\nPrice: ${price} ${currency}\nDescription: ${description}\nCategory: ${category}\nImage URL: ${image}`
        );

        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Error saving product:", error);
        res.status(500).json({ message: "Error saving product", error });

        )
    };

    export const getProduct = async (req: Request, res: Response) => {
        const productId = parseInt(req.params.id)
        if(isNaN(productId)) {
            res.status(400).json({message: "Invalid product ID"});
        });
        return;
    }
    const product = await productService.getProductById(productId);
    if (!product) {
        res.status(404).json({message: "Product not found"});
        return;
    }
    res.status(200).json(product);

}
export const updateProduct = async (req: Request, res: Response) => {
 try {
     console.log("Request received at updateProduct endpoint");
     console.log("Update product request body:", req.body);

     const {id, ...updateData} = req.body;

     if (!/^PROD\d+$/.test(id)) {
         return res.status(400).json({error: "Invalid product ID format"});
     }
     const updatedProduct = await productService.updateProduct(id, updateData);

     if (!updatedProduct) {
         return res.status(404).json({message: "Product not found"});
     }

     const adminEmails = await getAdminEmails();

     await sendEmail(
         adminEmails.join(','),
         "Product Updated",
         `The product with ID ${id} has been updated:\n\n${JSON.stringify(updateData, null, 2)}`,
         `<p>The product with ID <strong>${id}</strong> has been updated:</p><pre>${JSON.stringify(updateData, null, 2)}</pre>`
     );

     res.status(200).json(updatedProduct);

    } catch (error) {
           console.error("Error updating product:", error);
              res.status(500).json({ message: "Error updating product", error });
 }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const productId = req.params.id;

    if(!productId){
        res.status(400).json({error: "Product ID is required"});
        return;
    }
    try{
        const deletedProduct = await productService.deleteProduct(productId);
        if(!deletedProduct){
            res.status(404).json({message: "Product not found"});
            return;
        }
        const adminEmails = await getAdminEmails();
        await sendEmail(
            adminEmails.join(', '),
            "Product Deleted",
            `The product with ID ${productId} has been deleted.`
            `<p>The product with ID <strong>${productId}</strong> has been deleted.</p>`
        );
        res.status(200).json({message: "Product deleted successfully"});
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Error deleting product", error });
    }
}