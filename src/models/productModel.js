import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false
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
            quantity: { type: Number, required: true, default: 0 },
        }
    ],
    dateAdded: {
        type: Date,
        default: Date.now
    },
    sku: {
        type: String,
        required: false,
        unique: false
    },
})

const Product = mongoose.model('Product', productSchema)
export default Product