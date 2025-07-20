import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
})

const Product = mongoose.model('Product', productSchema)
export default Product