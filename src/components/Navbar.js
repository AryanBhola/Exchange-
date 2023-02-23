import React from 'react';
import logo2 from '../assets/logo2.jpg'
import { useSelector,useDispatch } from 'react-redux';
import Blockies from 'react-blockies';
import {loadAccount} from '../store/interactions';
import eth from '../assets/eth.svg'
import config from '../config.json';
const Navbar = () => {
    let provider = useSelector(state => state.provider.connection)
    const dispatch = useDispatch()
    const chainId = useSelector(state => state.provider.chainId)
    let a = useSelector(state => state.provider.account)
    let balance = useSelector(state => state.provider.balance)
    const connectHandler = async () =>{
        // Load account
        await loadAccount(provider, dispatch)
    }
    const networkHandler = async (e) => {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: e.target.value }],
      })
    }


    return(
      <div className='exchange__header grid'>
        <div className='exchange__header--brand flex'>
          <img src={logo2} className="logo" alt="DApp Logo"></img>
          <h1>DApp Token Exchange</h1>
        </div>
  
        <div className='exchange__header--networks flex'>
          <img src={eth} alt="ETH Logo" className='Eth Logo' />
  
          {chainId && (
            <select name="networks" id="networks" value={config[chainId] ? `0x${chainId.toString(16)}` : `0`} onChange={networkHandler}>
              <option value="0" disabled>Select Network</option>
              <option value="0x7A69">Localhost</option>
              <option value="0x5">Goerli</option>
                          </select>
          )}
  
        </div>
  
        <div className='exchange__header--account flex'>
          {balance ? (
            <p><small>My Balance</small>{Number(balance).toFixed(4)}</p>
          ) : (
            <p><small>My Balance</small>0 ETH</p>
          )}
          {a ? (
            <a
              href={config[chainId] ? `${config[chainId].explorerURL}/address/${a}` : `#`}
              target='_blank'
              rel='noreferrer'
            >
              {a.slice(0,5) + '...' + a.slice(38,42)}
              <Blockies
                seed={a}
                size={10}
                scale={3}
                color="#2187D0"
                bgColor="#F1F2F9"
                spotColor="#767F92"
                className="identicon"
              />
            </a>
          ) : (
            <button className="button" onClick={connectHandler}>Connect</button>
          )}
        </div>
      </div>
    )
  }
  
  
  export default Navbar;