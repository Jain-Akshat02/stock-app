import mongoose from "mongoose";

const stockSchema = mongoose.Schema({
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    variants:[
        {
            size: { type: String, required: true },
            mrp: { type: Number, required: true },
        }
    ],
    quantity: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String
    },
    status: {
        type: String,
        required: false
    }
});

const Stock = mongoose.model('Stock', stockSchema);
export default Stock;