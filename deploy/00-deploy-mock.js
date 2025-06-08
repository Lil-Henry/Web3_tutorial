
const { DECIMAL, INITIAL_ANSWER, developmentChains, CONFIRMATIONS } = require("../helper-hardhat-config");

module.exports = async({getNamedAccounts, deployments}) => {

    if(developmentChains.includes(network.name)){
        const { deploy } = deployments;
        const { firstAccount } = await getNamedAccounts();

        await deploy("MockV3Aggregator", {
            from: firstAccount,
            args: [DECIMAL, INITIAL_ANSWER],
            log: true,
            waitConfirmations: CONFIRMATIONS,
        });
    }else{
        console.log("environment is not local, MockV3Aggregator deployment skipped");
    }
}


module.exports.tags = ["all", "mocks"];