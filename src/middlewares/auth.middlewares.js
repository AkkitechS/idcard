import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/async_handler.js";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.models.js";

const verifyJWT = asyncHandler( async (req, res, next) => {
    try {
        console.log(req.body);
        const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "");
    
        if(!token) throw new ApiError(401, "Unauthorized request");
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken");
        
        if(!admin) throw new ApiError(401, "Invalid access token");
    
        req.admin = admin;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
} );

export default verifyJWT;