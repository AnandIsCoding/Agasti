import chalk from "chalk";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import connectToDb from "./configs/database.config.js";
import { ALLOWED_ORIGINS, NODE_ENV } from "./configs/server.config.js";
import { SERVER_PORT } from "./configs/server.config.js";
import authRouter from "./routes/auth.route.js";
import connectToCloudinary from "./configs/cloudinary.config.js";
import categoryRouter from "./routes/category.route.js";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";
import adminRouter from "./routes/admin.route.js";
import reviewRouter from "./routes/review.route.js";

const app = express();

//Cloudinary configuration

connectToCloudinary()
  .then(() =>
    console.log(chalk.bgYellow("Connected to Cloudinary successfully ✅ ✅ ")),
  )
  .catch((error) =>
    console.error(
      chalk.bgRed("�� Error in connecting to Cloudinary :" + error.message),
    ),
  );

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server, Postman, mobile apps
      if (!origin) return callback(null, true);

      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// middlewares
app.use(express.json());
app.use(cookieParser());
if (NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

// database connection
connectToDb()
  .then(() => {
    console.log(
      chalk.bgMagenta("Connected to MongoDB Database successfully ✅ ✅ "),
    );
    app.listen(SERVER_PORT, () => {
      console.log(
        chalk.bgGreenBright(
          `🚀 Server is listening at http://localhost:${SERVER_PORT}`,
        ),
      );
    });
  })
  .catch((error) => {
    console.error(
      chalk.bgRed(
        "❌Error in connecting to MongoDB Database :" + error.message,
      ),
    );
    process.exit(1); // exit the process with an error status code 1
  });

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Now Start Building controllers" });
});

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/review", reviewRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});
