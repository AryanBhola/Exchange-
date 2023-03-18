import React from "react";
import { useSelector } from "react-redux";
import sort from '../assets/sort.svg'
import { orderBookSelector } from "../store/selectors";

const OrderBook = () => {

const symbols = useSelector(state => state.tokens.symbols)
const orderbook = useSelector(orderBookSelector)
    return (
      <div className="component exchange__orderbook">
        <div className='component__header flex-between'>
          <h2>Order Book</h2>
        </div>
  
        <div className="flex">
        {!orderbook || orderbook.sellOrders.length ===0? (<p className="flex-center">No Sell Orders</p>) : (
          <table className='exchange__orderbook--sell'>
            <caption>Selling</caption>
            <thead>
              <tr>
                <th>{symbols && symbols[0]}<img src={sort} alt="Sort"/></th>
                <th>{symbols && symbols[0]}/{symbols && symbols[1]}<img src={sort} alt="Sort"/></th>
                <th>{symbols && symbols[1]}<img src={sort} alt="Sort"/></th>
              </tr>
            </thead>
            <tbody>
              {orderbook && orderbook.sellOrders.map((order, index) =>{
                return( 
                <tr key = {index}>
                  <td>{order.token0Amount}</td>
                  <td style ={{ color: `${order.orderTypeClass}`}}>{order.tokenPrice}</td>
                  <td>{order.token1Amount}</td>
                </tr>)
              })

              }
             
            </tbody>
          </table>
        )}
          <div className='divider'></div>
          {!orderbook || orderbook.buyOrders.length ===0? (<p className="flex-center">No Buy Orders</p>) : (
          <table className='exchange__orderbook--buy'>
             <caption>Buying</caption>
            <thead>
              <tr>
                <th>{symbols && symbols[0]}<img src={sort} alt="Sort"/></th>
                <th>{symbols && symbols[0]}/{symbols && symbols[1]}<img src={sort} alt="Sort"/></th>
                <th>{symbols && symbols[1]}<img src={sort} alt="Sort"/></th>
              </tr>
              
            </thead>
            <tbody>
              {orderbook && orderbook.buyOrders.map((order, index) =>{
                return( 
                <tr key = {index}>
                  <td>{order.token0Amount}</td>
                  <td style ={{ color: `${order.orderTypeClass}`}}>{order.tokenPrice}</td>
                  <td>{order.token1Amount}</td>
                </tr>)
              })

              }
             
            </tbody>
          </table>
          )}
        </div>
      </div>
    );
  }
  
  export default OrderBook;