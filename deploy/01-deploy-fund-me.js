// function deployFunction(){
//     console.log("Deploying FundMe contract...");
// }

const { network } = require("hardhat");
const { developmentChains, networkConfig, LOCK_TIME, CONFIRMATIONS} = require("../helper-hardhat-config");

// module.exports.default = deployFunction;
// module.exports = async(hre) => {
//     const getNamedAccounts = await hre.getNamedAccounts();
//     const deployments = await hre.deployments;
//     console.log("Deploying FundMe contract...");
// }

module.exports = async({getNamedAccounts, deployments}) => {
    const { firstAccount } = await getNamedAccounts();
    const { deploy } = deployments;

    let dataFeedAddr;
    let confirmations;
    if(developmentChains.includes(network.name)){
        const mockV3Aggregator = await deployments.get("MockV3Aggregator");
        dataFeedAddr = mockV3Aggregator.address;
        confirmations = 0;
    }else{
        dataFeedAddr = networkConfig[network.config.chainId].ethUsdDataFeed;
        confirmations = CONFIRMATIONS;
    }

    

    const fundMe = await deploy("FundMe", {
        from: firstAccount,
        args: [LOCK_TIME, dataFeedAddr], // constructor arguments
        log: true,
        waitConfirmations: confirmations, 
    });
    // remove deployment directory or add --reset flag if you want to redeploy the contract


    if(hre.network.config.chainId == 11155111  && process.env.ETHERSCAN_API_KEY){
        await hre.run("verify:verify", {
            address: fundMe.address,
            constructorArguments: fundMe.args,
        });
    }else{
        console.log("network is not sepolia,    Verification skipped");
    }

} 

module.exports.tags = ["all", "fundmd"];