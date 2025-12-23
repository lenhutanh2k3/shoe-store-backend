import Category from "../models/Category.js";
import redisClient from "../config/redis.js";

const CACHE_KEY_ALL = "categories:all";
export const getAllCategory = async (req, res) => {
  try {
    //cache
    const cacheCategories = await redisClient.get(CACHE_KEY_ALL);
    if (cacheCategories) {
      return res.status(200).json({
        success: true,
        source: "redis",
        count: JSON.parse(cacheCategories.length),
        data: JSON.parse(cacheCategories),
      });
    }
    const categories = await Category.find({ isDelete: false }).sort({
      createdAt: -1,
    });
    await redisClient.set(CACHE_KEY_ALL, JSON.stringify(categories), {
      EX: 3600,
    });
    res.status(200).json({
      success: true,
      source: "mongodb",
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
    const categoryExists = await Category.findOne({ name: req.body.name });
    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Tên danh mục này đã tồn tại, vui lòng chọn tên khác",
      });
    }
    const category = await Category.create(req.body);
    await redisClient.del(CACHE_KEY_ALL);
    // 3. Trả về kết quả
    res.status(201).json({
      success: true,
      message: `Tạo danh mục ${category.name} thành công`,
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
    await redisClient.del(CACHE_KEY_ALL);
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
    await redisClient.del(CACHE_KEY_ALL);
    res.status(200).json({
      success: true,
      message: `Xóa danh mục ${category.name} thành công`,
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
