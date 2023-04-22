const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
require("./config/db")
const PORT = 3003;

//Required Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//App routes
app.use("/api/users");
app.use("/api/posts");
app.use("/api/categories");

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
