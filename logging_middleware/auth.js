const axios=require("axios");
require("dotenv").config({
    path: __dirname + "/.env"
});
async function getAccessToken(){
    try{
        const response=await axios.post(
            "http://4.224.186.213/evaluation-service/auth",
            {
                email: "anirudh.r2022@vitstudent.ac.in",
                name: "anirudh r",
                rollNo: "22mia1094",
                accessCode: "SfFuWg",
                clientID: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET      
            }
        );
        return response.data.access_token;
    }
    catch (error) {

        console.log(
            "Auth Error:",
            error.response?.data || error.message
        );

    }
}
module.exports=getAccessToken;