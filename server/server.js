require("dotenv").config(); 

const app = require("./src/app");
const connectDB = require("./src/config/database");

connectDB();

const PORT = process.env.PORT || 8301;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
