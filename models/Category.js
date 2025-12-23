import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vui lòng nhập tên danh mục"],
      unique: true,
      trim: true,
      maxLength: [50, "Tên danh mục không được quá 50 ký tự"],
    },
    slug: {
      type: String,
      lowercase: true, 
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: false,
      maxLength: [500, "Mô tả không được quá 500 ký tự"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    // SỬA: Thêm trường này để Controller lưu được ngày xóa
    deleteAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
  }
);

categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name.split(" ").join("-").toLowerCase();
  }
});

const Category = mongoose.model("Category", categorySchema);
export default Category;