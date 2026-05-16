const {
    generateSchedule
} = require("../services/schedulerService");

const Log = require("../../../logging_middleware/logger");

async function getMaintenanceSchedule(req, res) {

    try {

        await Log(
            "backend",
            "info",
            "controller",
            "Schedule generation started"
        );

        const result = await generateSchedule();

        await Log(
            "backend",
            "info",
            "controller",
            "Schedule generated successfully"
        );

        res.status(200).json(result);

    } catch (error) {

        await Log(
            "backend",
            "error",
            "controller",
            error.message
        );

        res.status(500).json({
            error: error.message
        });

    }
}

module.exports = {
    getMaintenanceSchedule
};