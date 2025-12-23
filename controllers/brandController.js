import Brand from "../models/Brand.js";
import redisClient from "../config/redis.js";

const CACHE_KEY_ALL = "brands:all";
export const getAllBrand = async (req, res) => {
  try {
    const cacheBrands = await redisClient.get(CACHE_KEY_ALL);
    if (cacheBrands) {
      return res.status(200).json({
        success: true,
        source: "redis",
        count: JSON.parse(cacheBrands.length),
        data: JSON.parse(cacheBrands),
      });
    }
    const brand = await Brand.find({ isDelete: false }).sort({ createdAt: -1 });
    await redisClient.set(CACHE_KEY_ALL, JSON.stringify(brand), {
      EX: 3600,
    });
    res.status(200).json({
      success: true,
      source: "mongodb",
      count: brand.length,
      data: brand || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const createBrand = async (req, res) => {
  try {
    const name = req.body.name;
    const brandExists = await Brand.findOne({ name });
    if (brandExists) {
      return res.status(400).json({
        success: false,
        message: "Tên thương hiệu này đã tồn tại, vui lòng chọn tên khác",
      });
    }
    const brand = await Brand.create(req.body);
    await redisClient.del(CACHE_KEY_ALL);
    res.status(201).json({
      success: true,
      message: "Tạo thương hiệu thành công",
      data: brand,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const dataUpdate = { ...req.body };
    if (dataUpdate.name) {
      dataUpdate.slug = dataUpdate.name.split(" ").join("-").toLowerCase();
    }
    const brand = await Brand.findByIdAndUpdate(req.params.id, dataUpdate, {
      new: true,
    });
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thương hiệu",
      });
    }
    await redisClient.del(CACHE_KEY_ALL);
    res.status(200).json({
      success: true,
      message: `Cập nhật thương hiệu ${brand.name} thành công`,
      data: brand,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { isDelete: true, isActive: false, deleteAt: Date.now() },
      { new: true }
    );
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thương hiệu",
      });
    }
    await redisClient.del(CACHE_KEY_ALL);
    res.status(200).json({
      success: true,
      message: `Xóa thương hiệu ${brand.name} thành công`,
      data: brand,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
