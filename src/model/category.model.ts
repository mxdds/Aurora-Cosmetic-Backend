import mongoose from "mongoose";
const CategoryModel = new mongoose.Schema({

        "id": {
            type: String,
            required: true,
            unique: true, // unique key constraint
            index: true,
            trim:true// for better performance
        },
        "name": {
            type: String,
            required: true,
            trim: true,
            lowercase:true// remove extra spaces
        },
        "description": {
            type: String,
            required: true, // like not null
            trim: true, // remove extra spaces
        },
        "image": {
            type: String,
            required:true,
            trim: true
            // remove extra spaces
        }

    }
);

const Category = mongoose.model('Category', CategoryModel);
export default Category;