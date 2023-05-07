const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser")
const passport = require("passport");
require("./config/passport")(passport);
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const postRoutes = require("./routes/postRoutes");
require("./config/db");
const PORT = 3003;

//Required Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser())
app.use(cors());

//App routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
