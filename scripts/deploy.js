const hre = require("hardhat");

async function main() {
    const crowdfundFactory = await hre.ethers.getContractFactory("Crowdfund");
    const crowdfund = await crowdfundFactory.deploy();
    await crowdfund.waitForDeployment();
    const address = await crowdfund.getAddress();
    console.log("Crowdfund deployed to:", address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});