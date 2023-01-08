const{ expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
   return  ethers.utils.parseUnits(n.toString(),'ether')
}

describe('Token', ()=>{
let token, deployer, accounts, receiver

beforeEach(async () => {
    const Token = await ethers.getContractFactory('Token')
    token = await Token.deploy('Aryan Bhola','AB','1000000')
    accounts = await ethers.getSigners()
     deployer = accounts[0]
     receiver = accounts[1]
})

describe('Deployement',() => {

    const name = 'Aryan Bhola'
    const symbol = 'AB'
    const decimals = '18'
    const totalSupply = tokens('1000000')

    it('has correct name', async () => {
        expect( await token.name()).to.equal(name)
})
    it('has correct symbol', async () => {
        expect(await token.symbol()).to.equal(symbol)
})

    it('has correct decimals', async () => {
        expect(await token.decimals()).to.equal(decimals)
  })
  it('has correct total Supply', async () => {
    expect(await token.totalSupply()).to.equal(totalSupply)
})
it('assigns total supply to deployer', async () => {
    expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
})
})

describe('Sending Tokens', () => {
    let result , transaction
   describe('Success', ()=> {
    beforeEach(async () =>{
        // Transfer Tokens
     transaction = await token.connect(deployer).transfer(receiver.address,tokens(100))
     result  = await transaction.wait()
   })
   
   it('Transfers token balances', async () => {
     expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
     expect(await token.balanceOf(receiver.address)).to.equal(tokens(100))
    })  
 

   it('emits a transfer event',async ()=>{
       const event = result.events[0]
       const args = event.args
       expect(args._from).to.equal(deployer.address)
       expect(args._to).to.equal(receiver.address)
       expect(args._value).to.equal(tokens(100))
   })
   })

   describe('Failure', ()=>{
    it('rejects insufficient balances',async ()=>{
        const invalidAmount = tokens(10000000)
        await expect(token.connect(deployer).transfer(receiver.address,invalidAmount)).to.be.reverted
    })
    it('rejects invalid recipent', async ()=>{
        await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000', tokens(100))).to.be.reverted
    })
   })

})












  })
