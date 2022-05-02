export const RACE_ADD = "RACE_ADD"
export const RACE_REMOVE = "RACE_REMOVE"
export const RACE_UPDATE = "RACE_UPDATE"
export const USER_LOGIN = "USER_LOGIN"
export const USER_LOGOUT = "USER_LOGOUT"
export const USER_BET = "USER_BET"
export const ADD_BALANCE = "ADD_BALANCE"

export const addRace = data => ({
    type: RACE_ADD,
    payload: data
})

export const removeRace = id => ({
    type: RACE_REMOVE,
    payload: id
})

export const updateRace = data => ({
    type: RACE_UPDATE,
    payload: data
})

export const loginUser = data => ({
    type: USER_LOGIN,
    payload: data
})

export const updateBets = data => ({
    type: USER_BET,
    payload: data
})

export const logoutUser = () => ({
    type: USER_LOGOUT
})

export const addBalance = data => ({
    type: ADD_BALANCE,
    payload: data
})