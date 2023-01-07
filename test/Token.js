const{ expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
   return  ethers.utils.parseUnits(n.toString(),'ether')
}

describe('Token', ()=>{
let token

beforeEach(async () => {
    const Token = await ethers.getContractFactory('Token')
    token = await Token.deploy('Aryan Bhola','AB','1000000')
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
})



 
})
