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
    variants: [
        {
            size: { type: String, required: true },
            quantity: { type: Number, required: true, default: 0 },
        }
    ],
    dateAdded: {
        type: Date,
        default: Date.now
    },
})

const Product = mongoose.model('Product', productSchema)
export default Product