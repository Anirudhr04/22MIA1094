const Log=require("./logger");
async function testLogger(){
    await Log(
        "backend",
        "info",
        "handler",
        "Logger working successfully"
    );
}
testLogger();