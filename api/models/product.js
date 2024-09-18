const mongoose = require("mongoose");


const videoSchema = mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: false }
});
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String , required: true , unique: true},
    instructor: {type: String , required: true , unique: true},
    price: {type: Number , required: true},
    productImage: {type: String , required: true },
    isfav:  {type: Boolean , required: false , default: false},
    url: {type: String , required: false},
    videos: [videoSchema]
    
})
productSchema.index({ name: 1 });

module.exports = mongoose.model("Product" , productSchema)