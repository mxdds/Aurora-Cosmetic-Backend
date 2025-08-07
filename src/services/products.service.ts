import Product from "../model/product.model";
import {ProductDto} from "../dto/product.dto";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import Category from "../model/category.model";
import {generateUniqueId} from "./category.service";

export const getAllProducts = async () => {
    try {
        const products = await Product.find({id: {$regex: /^PROD/, $OPTIONS: 'i'}})
            .populate('category', 'name') // Populate category name
            .lean(); // Use lean for better performance
        return products.map(product => ({
            id: product.id || '',
            name: product.name || '',
            price: product.price || 0,
            currency: product.currency || '',
            image: product.image || '',
            description: product.description || '',
            category: (product.category as any)?.name || 'Unknown Category',
        }));
    } catch (error) {
        console.error("Error retrieving products:", error);
        throw error;
    }
};
export const saveProduct = async (product: { id:string; name: string; price: number; currency: string; description: string; image: string; category: string }) => {
 try {
     console.log("Saving product:", product);

     const existingProduct = await Product.findOne({ id: product.id }).lean();
     if (existingProduct) {
         throw new Error(`Product with id "${product.id}" already exists`);
     }

     const category = mongoose.isValidObjectId(product.category)
         ? await Category.findById(product.category).lean()
         : await Category.findOne({ name: product.category }).lean();

     if (!category) {
         throw new Error(`Category "${product.category}" not found`);
     }
     const savedProduct = await Product.create({
         ...product,
         category: category._id,
     });
     return savedProduct;
 } catch (error){
     console.error("Error saving product", error);
     throw error;
 }
};

export const getProductById = async (id: number): Promise<ProductDto | null> => {
    const product =await Product.findOne({ id })
        .populate("category","name")
        .lean();
    if (!product) return null;
    return {
        id: product.id || '',
        name: product.name,
        currency: product.currency,
        image: product.image,
        description: product.description || '',
        category: (product.category as any)?.name || '',

    };
};
export const updateProduct = async (productId: string, productData: Partial<ProductDto>) => {
    try {
        const category = mongoose.isValidObjectId(productData.category)
         ? productData.category
         : await Category.findOne({ name: productData.category }).lean();

        if (!category) || typeof category === "string") {
             throw new Error(`Category "${productData.category}"not found or invalid`);
        }
        const updatedProduct = await Product.findOneAndUpdate(
            { id: productId },
            { ...productData, category: category._id },
            { new:true }
        );
       if (!updateProduct) {
           throw new Error(`Product with id "${productId}" not found`);

       }
       return updatedProduct;

    } catch (error) {
        console.error("Error updating product:",error);
        throw error;
    }

export const deleteProduct = async (id: string): Promise<boolean> => {
        try{
            const result = await Product.deleteOne( { id });
            return result.deletedCount > 0;
        } catch (error){
            console.error("Error in deleteProduct service:", error);
            throw error;
        }
   };

export const validateProduct = (product: ProductDto): string | null => {
    if (!product.id || !product.name || !product.price || !product.currency || !product.image || !product.description) {
        return 'All fields are required';
    }
    return null;
};

export const  generateUniqueId = async (): Promise<string> => {

        const products = await Product.find({id: {$regex: /^PROD\d+$/}}).lean();

        let lastIdNumber = 0;

        if (products.length > 0) {
            const numericIds = products.map(product => {
                const numericPart = product.id.replace("PROD", "");
                return parseInt(numericPart, 10) || 0;
            });

            lastIdNumber = Math.max(...numericIds);

        }

        const newIdNumber = lastIdNumber + 1;

        const uniqueId =`PROD${newIdNumber}`;
        return uniqueId;
    };

export const deleteAllProducts = async (): Promise<void> => {
   try {
       const result = await Product.deleteMany({});
       console.log(`Deleted ${result.deletedCount} products from the database.`);
   } catch (error){
       console.error("Error deleting all products", error);
       throw error;
   }
}
