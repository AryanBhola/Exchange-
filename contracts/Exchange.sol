//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
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
