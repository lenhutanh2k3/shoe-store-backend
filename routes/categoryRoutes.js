import {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/categoryValidation.js";
import express from "express";
import validate from "../middleware/validateMiddleware.js";
const category_router = express.Router();

category_router.get("/", getAllCategory);
category_router.post("/", validate(createCategorySchema), createCategory);
category_router.put("/:id", validate(updateCategorySchema), updateCategory);
category_router.put("/:id/delete", deleteCategory);

export default category_router;
