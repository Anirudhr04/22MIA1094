const axios = require("axios");

const Log = require("../../../logging_middleware/logger");
const getAccessToken = require("../../../logging_middleware/auth");

async function fetchDepots() {

    try {

        await Log(
            "backend",
            "info",
            "service",
            "Fetching depots"
        );

        const token = (await getAccessToken()).trim();

        const response = await axios.get(
            "http://4.224.186.213/evaluation-service/depots",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;

    } catch (error) {

        await Log(
            "backend",
            "error",
            "service",
            "Failed to fetch depots"
        );

        throw error;

    }
}

async function fetchVehicles(depotId) {

    try {

        await Log(
            "backend",
            "info",
            "service",
            `Fetching vehicles for depot ${depotId}`
        );

        const token = (await getAccessToken()).trim();

        const response = await axios.get(
            `http://4.224.186.213/evaluation-service/vehicles?depotID=${depotId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;

    } catch (error) {

        await Log(
            "backend",
            "error",
            "service",
            `Failed to fetch vehicles for depot ${depotId}`
        );

        throw error;

    }
}

function optimizeTasks(tasks, maxHours) {

    const n = tasks.length;

    const dp = Array(n + 1)
        .fill()
        .map(() => Array(maxHours + 1).fill(0));

    for (let i = 1; i <= n; i++) {

        const duration = tasks[i - 1].Duration;
        const impact = tasks[i - 1].Impact;

        for (let hours = 0; hours <= maxHours; hours++) {

            if (duration <= hours) {

                dp[i][hours] = Math.max(
                    dp[i - 1][hours],
                    impact + dp[i - 1][hours - duration]
                );

            } else {

                dp[i][hours] = dp[i - 1][hours];

            }
        }
    }

    let selectedTasks = [];

    let hours = maxHours;

    for (let i = n; i > 0; i--) {

        if (dp[i][hours] !== dp[i - 1][hours]) {

            selectedTasks.push(tasks[i - 1]);

            hours -= tasks[i - 1].Duration;

        }
    }

    return {
        totalImpact: dp[n][maxHours],
        selectedTasks: selectedTasks.reverse()
    };
}

async function generateSchedule() {

    try {

        const depotsData = await fetchDepots();

        const depots = depotsData.depots;

        const result = [];

        for (const depot of depots) {

            const vehicles = await fetchVehicles(depot.ID);

            const tasks = vehicles.vehicles.filter(task => {

                return !(
                    task.Impact <= 2 &&
                    task.Duration >= 6
                );

            });

            const optimizedResult = optimizeTasks(
                tasks,
                depot.MechanicHours
            );

            const totalHoursUsed = optimizedResult.selectedTasks.reduce(
                (sum, task) => sum + task.Duration,
                0
            );

            await Log(
                "backend",
                "info",
                "service",
                `Optimization completed for depot ${depot.ID}`
            );

            result.push({
                depotID: depot.ID,
                mechanicHoursAvailable: depot.MechanicHours,
                totalHoursUsed: totalHoursUsed,
                totalImpact: optimizedResult.totalImpact,
                totalTasksSelected: optimizedResult.selectedTasks.length,
                selectedTasks: optimizedResult.selectedTasks.sort(
                    (a, b) => b.Impact - a.Impact
                )
            });

        }

        return result;

    } catch (error) {

        await Log(
            "backend",
            "error",
            "service",
            error.message
        );

        throw error;

    }
}

module.exports = {
    generateSchedule
};