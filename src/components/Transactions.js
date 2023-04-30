import React from "react";
import { useRef, useState } from "react";
import { useSelector} from "react-redux";
import sort from '../assets/sort.svg'
import { myOpenOrdersSelector } from "../store/selectors"; 
import Banner from "./PriceCHart/banner";
import { myFilledOrdersSelector } from "../store/selectors";
const Transactions = () => {
    const [showMyOrder, setShowMyOrders] = useState(true)
    const symbols = useSelector(state => state.tokens.symbols)
    const myOrders = useSelector(myOpenOrdersSelector)
    const myFilledOrders = useSelector(myFilledOrdersSelector)

    const tabHandler = (e) =>{
        if(e.target.className !== orderRef.current.className){
            e.target.className = 'tab tab--active'
            orderRef.current.className = 'tab'
            setShowMyOrders(false)
        }
        else{
            e.target.className = 'tab tab--active'
            tradeRef.current.className = 'tab'
            setShowMyOrders(true)
        }
    }

    const tradeRef = useRef(null)
    const orderRef = useRef(null)

    return (
      <div className="component exchange__transactions">
        {showMyOrder ? (
        <div>
          <div className='component__header flex-between'>
            <h2>My Orders</h2>
  
            <div className='tabs'>
              <button onClick = {tabHandler} ref = {orderRef}className='tab tab--active'>Orders</button>
              <button onClick = {tabHandler} rer = {tradeRef}className='tab'>Trades</button>
            </div>
          </div>
          {!myOrders || myOrders.length === 0 ? (
          <Banner text='No Open Orders'/>
        ):( <table>
            <thead>
              <tr>
                  <th>Time<img src={sort} alt="Sort" /></th>
                  <th>{symbols && symbols[0]}<img src={sort} alt="Sort" /></th>
                  <th>{symbols && symbols[0]}/{symbols && symbols[1]}<img src={sort} alt="Sort" /></th>
              </tr>
            </thead>
            <tbody>
              {myOrders && myOrders.map((order,index) =>{
                  return(
              <tr key={index}>
                  <td>{order.token0Amount}</td>
                  <td style={{ color: `${order.orderTypeClass}`}}>{order.tokenPrice}</td>
                  <td></td>
              </tr>
                  )
              })}
              

            </tbody>
          </table>
          )}
           
  
        </div>
        ):(
        <div>
          <div className='component__header flex-between'> 
            <h2>My Transactions</h2>
  
            <div className='tabs'>
            <button onClick = {tabHandler} ref = {orderRef} className='tab tab--active'>Orders</button>
            <button onClick = {tabHandler} ref = {tradeRef}className='tab'>Trades</button>
            </div>
          </div>
  
          <table>
            <thead>
              <tr>
              <th>Time<img src={sort} alt="Sort" /></th>
                  <th>{symbols && symbols[0]}<img src={sort} alt="Sort" /></th>
                  <th>{symbols && symbols[0]}/{symbols && symbols[1]}<img src={sort} alt="Sort" /></th>
              </tr>
            </thead>
            <tbody>
  {myFilledOrders && myFilledOrders.map((order,index) =>{return(
    <tr key={index}>
    <td>{order.formattedTimestamp}</td>
    <td style={{ color: `${order.orderClass}` }}>{order.orderSign}{order.token0Amount}</td>
    <td>{order.tokenPrice}</td>
     </tr>
  )})}
              
  
            </tbody>
          </table>
  
        </div>
        )}
        
  
        
      </div>
    )
  }
  
  export default Transactions;