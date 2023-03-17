//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;
    //token-user-amount
    mapping(address => mapping(address => uint256)) public tokens;
    //Order Mapping
    mapping(uint256 => _Order) public orders;
    uint256 public orderCount;
    mapping (uint256 => bool) public orderCancelled;
    mapping (uint256 => bool) public orderFilled;


event Deposit(address token, address user, uint256 amount, uint256 balance);
event Withdraw(address token,address user,uint256 amount,uint256 balance);
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

function withdrawToken(address _token, uint256 _amount) public{
   // Ensuring user has enough tokens to wtihdraw
   require(tokens[_token][msg.sender] >= _amount);

   // Transfer to user
    Token(_token).transfer(msg.sender, _amount);

    //Update User balance
    tokens[_token][msg.sender] -= _amount;

    //Emit event 
    emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);

}
function balanceOf(address _token, address _user) public view returns (uint256){
        return tokens[_token][_user];
    }



//Make and cancel Orders
/*
token give(token they want to spend)
token get(token they want to get) */
struct _Order {
        // Attributes of an order
        uint256 id; // Unique identifier for order
        address user; // User who made order
        address tokenGet; // Address of the token they receive
        uint256 amountGet; // Amount they receive
        address tokenGive; // Address of token they give
        uint256 amountGive; // Amount they give
        uint256 timestamp; // When order was created
    }
event Order(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
event Cancel(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );    
event Trade(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        address creator,
        uint256 timestamp
    );    

function makeOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) public {
        // Prevent orders if tokens aren't on exchange
        require(balanceOf(_tokenGive, msg.sender) >= _amountGive);

        // Instantiate a new order
        orderCount = orderCount + 1;
        orders[orderCount] = _Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );

        // Emit event
        emit Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
}



function cancelOrder(uint256 _id) public {

    _Order storage _order = orders[_id];

    //order should exist
    require(_order.id == _id);

    // Ensure the caller of the fucntion is the owner of the order
    require(address(_order.user) == msg.sender);

    orderCancelled[_id] = true;

    emit Cancel(
        _order.id,
        msg.sender,
        _order.tokenGet,
        _order.amountGet,
        _order.tokenGive,
        _order.amountGive,
        block.timestamp
    );
}

//-------Executing Orders--------

function fillOrder(uint256 _id) public {
    /*
        1. Must be valid orderId
        2. Order can't be Filled
        3. Order can't be Cancelled
    */
    require(_id>0 && _id <= orderCount,"Order does not exist");
    require(!orderFilled[_id],"no");
   require(!orderCancelled[_id]);

    //fetch order
    _Order storage _order = orders[_id];

    //Swapping Tokens
    _trade(
        _order.id,
        _order.user,
        _order.tokenGet,
        _order.amountGet,
        _order.tokenGive,
        _order.amountGive
    );
    orderFilled[_order.id] = true;

}
function _trade(uint256 _orderId, address _user, address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) internal{
// Fee is paid by the person who filled the order(msg.msg.sender)
// Fee is deducted from _amountGet
uint256 _feeAmount = (_amountGet * feePercent) / 100;

// Trade is changing the balance of each person on the exchange
tokens[_tokenGet][msg.sender] -= _amountGet + _feeAmount;
tokens[_tokenGet][_user] += _amountGet;

//Charge Fees
tokens[_tokenGet][feeAccount] += _feeAmount;

tokens[_tokenGive][_user] -= _amountGive;
tokens[_tokenGive][msg.sender] += _amountGive;


emit Trade(
        _orderId,
        msg.sender,
        _tokenGet,
        _amountGet,
        _tokenGive,
        _amountGive,
        _user,
        block.timestamp
    );  

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
