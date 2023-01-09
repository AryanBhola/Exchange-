const{ expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
   return  ethers.utils.parseUnits(n.toString(),'ether')
}

describe('Token', ()=>{
let token, deployer, accounts, receiver, exchange

beforeEach(async () => {
    const Token = await ethers.getContractFactory('Token')
    token = await Token.deploy('Aryan Bhola','AB','1000000')
    accounts = await ethers.getSigners()
     deployer = accounts[0]
     receiver = accounts[1]
     exchange = accounts[2]
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
describe('Approving Tokens' , () => {
    let amount, transaction, result
    beforeEach( async () =>{
            amount = tokens(100)
            transaction = await token.connect(deployer).approve(exchange.address,tokens(100))
            result  = await transaction.wait()
    })
    describe('Success', () => {
        it('allocates an allowance for delegated token spending', async () =>{
                expect(await token.allowance(deployer.address,exchange.address)).to.equal(amount)
        })
        it('emits a approval event',async ()=>{
            const event = result.events[0]
            expect(event.event).to.equal('Approval')
            const args = event.args
            expect(args.owner).to.equal(deployer.address)
            expect(args.spender).to.equal(exchange.address)
            expect(args.value).to.equal(amount)
        })
    })
    describe('Failure', ()=>{
           it('rejects invalid spenders', async ()=>{
            await expect(token.connect(deployer).approve('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
           })
    })
})

describe('Delegated Token Transfers', ()=>{
    let amount, transaction, result
    beforeEach( async () =>{
        amount = tokens(100)
        transaction = await token.connect(deployer).approve(exchange.address,amount)
        result  = await transaction.wait()
})
describe('Success', ()=>{
    beforeEach( async () =>{        
        transaction = await token.connect(exchange).transferFrom(deployer.address,receiver.address,amount)
        result  = await transaction.wait()
})
it('transfers token balances', async ()=>{
    expect(await token.balanceOf(deployer.address)).to.equal(ethers.utils.parseUnits("999900","ether"))
    expect(await token.balanceOf(receiver.address)).to.equal(amount)

})
it('resets the allowance', async ()=>{
    expect(await token.allowance(deployer.address, exchange.address)).to.equal(0)
})
it('emits a Transfer event', async () => {
    const event = result.events[0]
    expect(event.event).to.equal('Transfer')
    const args = event.args
    expect(args._from).to.equal(deployer.address)
    expect(args._to).to.equal(receiver.address)
    expect(args._value).to.equal(amount)
  })
})
describe('Failure', async () => {
    // Attempt to transfer too many tokens
    const invalidAmount = tokens(100000000) // 100 Million, greater than total supply
    await expect(token.connect(exchange).transferFrom(deployer.address, receiver.address, invalidAmount)).to.be.reverted
  })
})

 })
