import * as categoryService from '../service/category.service';
import { Request, Response } from 'express';
import { sendEmail} from "../utils/email.util";
import {getAdminEmails} from "../utils/user.util";

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error retrieving categories:", error);
        res.status(500).json({ message: 'Failed to fetch categories', error });
    }
}
export const saveCategory = async (req: Request, res: Response) => {
    try{
        const { name, description, image } = req.body;
        if(!name || !description || !image) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const id = await categoryService.generateUniqueId();
        const category = { id, name, description, image};
        const savedCategory = await categoryService.saveCategory(category);
        const adminEmails = await getAdminEmails();
        await sendEmail(
            adminEmails.join(','),
            "New Category Added",
            `A new category has been added: ${name}. Description: ${description}. Image: ${image}.`,
            `<p>A new category has been added: <strong>${name}</strong>.</p>
                  <p>Description: ${description}</p><p>Image: <img src="${image}" alt="${name}"></p>`
        );
        res.status(201).json(savedCategory);
    } catch (error){
        console.error("Error saving category:", error);
        res.status(500).json({ message: 'Failed to save category', error });
    }
};

export const getCategoryById = async (req: Request, res: Response) => {
    const categoryId = req.params.id;
    if(isNaN(Number(categoryId))) {
        res.status(400).json({
            error:'Invalid category ID'
        });
        return;
    }
   try {
        const category = await categoryService.getCategoryById(categoryId);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        res.status(200).json(category);
    } catch (error) {
        console.log("Error retrieving category:", error);
        res.status(500).json({ message: 'Failed to fetch category', error });
    }
}

export const updateCategory = async (req: Request, res: Response) => {
  try{
      const { id, name, description, image } = req.body;
        if(!id || !name || !description ) {
            return res.status(400).json({ message: 'All fields are required' });

        }
        const updatedData: any ={ name, description};
        if (image) {
            updatedData.image = image;
        }

        const updatedCategory = await categoryService.updateCategory(id, updatedData);
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });

        }

        const adminEmails = await getAdminEmails();
        await sendEmail(
            adminEmails.join(','),
            "Category Updated",
            `Category with ID ${id} has been updated. New Name: ${name}. New Description: ${description}.`,
            `<p>Category with ID <strong>${id}</strong> has been updated.</p>
             <p>New Name: ${name}</p><p>New Description: ${description}</p><p>Image: <img src="${image}" alt="${name}"></p>`
        );
        res.status(200).json(updatedCategory);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: 'Failed to update category', error });
  }

};

export const deleteCategory = async (req: Request, res: Response) => {
    const categoryId = req.params.id;


    if(!categoryId) {
          res.status(400).json({ error:"Category ID is required" });
          return;
    }
    try{
        const deletedCategory = await categoryService.deleteCategory(categoryId);
        if (!deletedCategory) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }

        const adminEmails = await getAdminEmails();
        await sendEmail(
            adminEmails.join(','),
            "Category Deleted",
            `Category with ID ${categoryId} has been deleted.`,
            `<p>Category with ID <strong>${categoryId}</strong> has been deleted.</p>`
        );
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ message: 'Failed to delete category', error });
    }
}
