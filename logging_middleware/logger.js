const axios = require("axios");
const getAccessToken = require("./auth");
require("dotenv").config({
    path: __dirname + "/.env"
});
async function Log(stack, level, packageName, message) {

    try {

        const token = (await getAccessToken()).trim();

        console.log("Generated Token:", token);

        const response = await axios.post(
            "http://4.224.186.213/evaluation-service/logs",
            {
                stack: stack,
                level: level,
                package: packageName,
                message: message
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Log created successfully");

        return response.data;

    } catch (error) {

        console.log(
            "Logging Error:",
            error.response?.data || error.message
        );

    }
}

module.exports = Log;