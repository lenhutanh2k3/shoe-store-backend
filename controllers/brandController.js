import Brand from "../models/Brand.js";

export const getAllBrand = async (req, res) => {
  try {
    const brand = await Brand.find({ isDelete: false }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
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

    res.status(200).json({
      success: true,
      message: `Cập nhật thương hiệu ${brand.name} thành công`,
      data: brand});
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
    res.status(200).json({
      success: true,
      message: `Xóa thương hiệu ${brand.name} thành công`,
      data: brand,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
