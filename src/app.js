import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
// app is taking all the prop of express

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// cors is used for resource sharing between backend and frontend
// Middlewares are used to check condition in between request and response
// app.use is use for implementing middlewares
// cookieParser is a middleware used for getting cookie from web browser

app.use(express.json({ limit: "16kb" }));
// used for taking json file
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// used for taking url
app.use(express.static("public"));
// used for taking file/pdf
app.use(cookieParser());

// importing routes
import userRouter from "./routes/user.routes.js";

// Routes declaration
app.use("/api/v1/users", userRouter);
//  http://localhost:8000/api/v1/users/register
export default app;
