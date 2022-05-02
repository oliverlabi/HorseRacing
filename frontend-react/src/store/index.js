import { createContext, useReducer } from "react";
import { raceReducer, authReducer } from "./reducer";
import combineReducers from "react-combine-reducers"

const initialRaces = {
    data: []
}

const initialAuth = {
    username: null,
    token: null,
    balance: null,
    bets: null
}

const [combinedReducer, initialState] = combineReducers({
    races: [raceReducer, initialRaces],
    auth: [authReducer, initialAuth]
})

export const Context = createContext(initialState)

function Store({ children }){
    const [state, dispatch] = useReducer(combinedReducer, initialState)

    return (
        <Context.Provider value={[ state, dispatch ]}>
        { children }
        </Context.Provider>
    )
}

export default Store