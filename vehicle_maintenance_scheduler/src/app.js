const express = require("express");
const cors = require("cors");
const app = express();
const schedulerRoutes = require("./routes/schedulerRoutes");
app.use(cors());
app.use(express.json());
app.use("/api", schedulerRoutes);

app.get("/", (req, res) => {

    res.json({
        message: "Vehicle Maintenance Scheduler API Running"
    });

});

const PORT = 3000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});