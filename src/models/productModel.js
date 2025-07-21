import mongoose from "mongoose";

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
    mrp: {
        type: Number,
        required: false,
    },
    variants: [
        {
            size: { type: String, required: true },
            mrp: { type: Number, required: true },
        }
    ],
    dateAdded: {
        type: Date,
        default: Date.now
    },
    sku: {
        type: String,
        required: true,
        unique: true
    },
})

const Product = mongoose.model('Product', productSchema)
export default Product