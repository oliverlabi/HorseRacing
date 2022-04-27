export const RACE_ADD = "RACE_ADD"
export const RACE_REMOVE = "RACE_REMOVE"
export const RACE_UPDATE = "RACE_UPDATE"
export const USER_LOGIN = "USER_LOGIN"
export const USER_LOGOUT = "USER_LOGOUT"
export const ADD_BALANCE = "ADD_BALANCE"

export const addRace = race => ({
    type: RACE_ADD,
    payload: race
})

export const removeRace = id => ({
    type: RACE_REMOVE,
    payload: id
})

export const updateRace = race => ({
    type: RACE_UPDATE,
    payload: race
})

export const loginUser = data => ({
    type: USER_LOGIN,
    payload: data
})

export const logoutUser = data => ({
    type: USER_LOGOUT
})

export const addBalance = data => ({
    type: ADD_BALANCE,
    payload: data
})