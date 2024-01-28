import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}));

app.use(express.json({limit : "20kb"}));
app.use(express.urlencoded({extended : true, limit : "20kb"}));
app.use(express.static("public"));
app.use(cookieParser());

// Route import

import adminRouter from "./routes/admin.routes.js";

// admin router

app.use("/api/v1/shrent/services/admin", adminRouter);

export { app };