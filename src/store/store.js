import {createStore, applyMiddleware, combineReducers } from "redux";
import thunk from 'redux-thunk';
import { composeWithDevTools } from "redux-devtools-extension";


//Import Reducers
import { provider, tokens } from './reducers.js'

const reducer = combineReducers({
    provider,
    tokens
})

const initialState = {}

const midddleware = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...midddleware)))

export default store 