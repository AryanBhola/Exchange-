const { ethers } = require("hardhat")

async function main() {
    // Fetch contract to deploy
    const Token = await ethers.getContractFactory("Token")
    const Exchange = await ethers.getContractFactory("Exchange")

    //FEtch accounts
    const accounts = await ethers.getSigners()


    // Deploy contract
    const AB = await Token.deploy('Aryan Bhola','AB','1000000')
    await AB.deployed()
    console.log(`AB Deployed to: ${AB.address}`)
  
    const mETH = await Token.deploy('mETH','mETH','1000000')
    await mETH.deployed()
    console.log(`mETH Deployed to: ${mETH.address}`)
  
    const mDAI = await Token.deploy('mDAI','mDAI','1000000')
    await mDAI.deployed()
    console.log(`mDAI Deployed to: ${mDAI.address}`)

    const exchange = await Exchange.deploy(accounts[1].address, 10)
    await exchange.deployed()
    console.log(`Excahnge Deployed to: ${exchange.address}`)
}
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  