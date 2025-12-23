import category_router from "./categoryRoutes.js";
const router =(app)=>
{
    app.use("/api/categories",category_router);
}
export default router;