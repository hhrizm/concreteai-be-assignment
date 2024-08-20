require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const swaggerDocs = require("./swagger/swagger");
const supertokens = require("./config/supertokens");
const cors = require("cors");
const {middleware, errorHandler} = require("supertokens-node/framework/express");
const bodyParser = require('body-parser');


const app = express();

// Middleware
// app.use(cors({
//     origin: "http://127.0.0.1:3000",
//     allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
//     // credentials: true,
// }));
app.use(cors());
app.use(middleware());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);

// Swagger Documentation
swaggerDocs(app);

// Middleware after route
app.use(errorHandler());

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
