//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;
    //token-user-amount
    mapping(address => mapping(address => uint256)) public tokens;

event Deposit(address token, address user, uint256 amount, uint256 balance);
    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

function depositToken(address _token,uint256 _amount) public{
    
    // Transfer tokens to exchange and updating user balance
    require(Token(_token).transferFrom(msg.sender,address(this),_amount));

    tokens[_token][msg.sender] += _amount;
    emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
}




}

// What the exchnage needs to do?
/*
Deposit Tokens
Withdraw Toakens
Check Balances
Make Orders
Cancel Orders
Fill orders
Charge Fees and send to deployer(owner of exchange)
Track Fee Account
 */
