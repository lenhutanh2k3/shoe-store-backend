import category_router from "./categoryRoutes.js";
import router_brand from "./brandRoutes.js";
const router =(app)=>
{
    app.use("/api/categories",category_router);
    app.use("/api/brand",router_brand);
}
export default router;