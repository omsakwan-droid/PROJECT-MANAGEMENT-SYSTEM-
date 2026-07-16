import express from "express";
import cors from "cors";


const app = express();
//BASIC CONFIGURATIONS
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

//CORS CONFIGURATION
app.use(cors({
    origin: process.env.CORS_ORIGIN ?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]

})
);

// importing healthcheck route

import healthcheckRoute from "./routes/healthcheck.routes.js";
app.use("/api/v1/healthcheck", healthcheckRoute);


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/instagram", (req, res) => {
    res.send("Instagram route");
});


export default app;
