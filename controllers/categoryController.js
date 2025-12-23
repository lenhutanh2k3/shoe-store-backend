import Category from "../models/Category.js";

export const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find({ isDelete: false }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const createCategory = async (req, res) => {
  try {
    const name = req.body.name;
    console.log(req.body);
    const categoryExists = await Category.findOne({ name :req.body.name });
    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Tên danh mục này đã tồn tại, vui lòng chọn tên khác",
      });
    }
    const category = await Category.create(req.body);
    // 3. Trả về kết quả
    res.status(201).json({
      success: true,
      message: "Tạo danh mục thành công",
      data: category,
    });
  } catch (error) {
    console.log("🔥 LỖI CHI TIẾT:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const updateCategory = async (req, res) => {
  try {
    const dataUpdate = { ...req.body };
    if (dataUpdate.name) {
      dataUpdate.slug = dataUpdate.name.split(" ").join("-").toLowerCase();
    }
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      dataUpdate,
      { new: true }
    );
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục",
      });
    }
    res.status(200).json({
      success: true,
      message: "Cập nhật danh mục thành công",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isDelete: true, isActive: false, deleteAt: Date.now() },
      { new: true }
    );
    if (!category) {
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy danh mục để xóa",
      });
    }
    res.status(200).json({
      success: true,
      message: `Xóa danh mục ${category.name} thành công`,
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
