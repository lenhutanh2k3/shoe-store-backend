import mongoose from "mongoose";


const brandSchema = new mongoose.Schema({
    name :{
        type:String,
        required: [true, "Vui lòng nhập tên thương hiệu"],
        trim: true,
        unique: true,
    },
    slug:{
        type: String,
        lowercase: true,
        unique: true,
        index: true,
    },
    description:{
        type:String,
        maxLength:[500, "Mô tả không được quá 500 ký tự"]
    },
    isActive:{
        type: Boolean,
        default: true,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    deleteAt: {
      type: Date,
      default: null,
    }
},{timestamps:true});
brandSchema.pre("save", async function () {
  if (this.isModified("name")) {
    this.slug = this.name.split(" ").join("-").toLowerCase();
  }
});
const Brand = mongoose.model("Brand", brandSchema);
export default Brand;