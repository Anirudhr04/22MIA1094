const express = require("express");

const router = express.Router();

const {
    getMaintenanceSchedule
} = require("../controllers/schedulerController");

router.get(
    "/schedule",
    getMaintenanceSchedule
);

module.exports = router;