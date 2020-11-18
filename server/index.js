const express = require('express')
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const errorHandler = require("./middleware/error");

const app = express()

// Load env vars
dotenv.config({ path: "./config/config.env" });

const port = process.env.PORT | 5000
const apiLink = "/api/v4/"

// Route files
const readings = require("./routes/readings");

// // Rate limiting
const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 10 mins
    max: 500,
    message:
        "Too many accounts created from this IP, please try again after an hour"
});
app.use(limiter);

// Body parser
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// // Set security headers
app.use(helmet());

// // Prevent XSS attacks
app.use(xss());

// // Prevent http param pollution
app.use(hpp());

app.use(cors());

// Mount routers
app.use(apiLink + 'readings', readings);

//error handling 
app.use(errorHandler);


try {
    app.use(express.static(process.env.STATIC_DIR));
} catch (e) {
    console.log("Missing env file, be sure to copy .env.example to .env");
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})