import mongoose, { Schema }from 'mongoose';

const ProductModel = new mongoose.Schema({
    "id":{
        required: true,
        type:String,
        unique:true,
        index:true
    },
    "name":{
        required: true,
        type:String,
    },
    "price":{
        required: true,
        type:Number
    },
    "currency": {
        required: true,
        type: String
    },
    "image": {
        required: true,
        type: String
    },
    "description": {
        type: String
    },
    "category": {
        type: Schema.Types.ObjectId,
        ref: "Category", // Reference to the Category model
        required: true // Ensure that a product must belong to a category
    }
});


const Product = mongoose.model("Product", ProductModel);
export default Product;