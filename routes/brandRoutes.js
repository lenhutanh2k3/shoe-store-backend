import {
  createBrandSchema,
  updateBrandSchema,
} from "../validations/brandValidation.js";
import validate from "../middleware/validateMiddleware.js";
import express from "express";
import {
  getAllBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController.js";

const brand_router = express.Router();

brand_router.get("/", getAllBrand);
brand_router.post("/", validate(createBrandSchema), createBrand);
brand_router.put("/:id", validate(updateBrandSchema), updateBrand);
brand_router.put("/:id/delete", deleteBrand);

export default brand_router;
