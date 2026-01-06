import { Router } from "express";
import {
  getProfile,
  registerWithGoogle,
  updateProfile,
  userLogout,
} from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  addAddress,
  getAddresses,
  updateAddress,
} from "../controllers/address.controller.js";

const authRouter = Router();

authRouter.post("/google", registerWithGoogle);
authRouter.get("/profile", isAuthenticated, getProfile);
authRouter.put("/profile/update", isAuthenticated, updateProfile);
authRouter.post("/logout", isAuthenticated, userLogout);
authRouter.get("/address", isAuthenticated, getAddresses);
authRouter.post("/address", isAuthenticated, addAddress);
authRouter.put("/address/:addressId", isAuthenticated, updateAddress);
export default authRouter;
