import { RACE_ADD, RACE_REMOVE, RACE_UPDATE, USER_LOGIN, USER_LOGOUT, ADD_BALANCE, USER_BET } from "./actions";

const raceReducer = (state, action) => {
  switch(action.type){
    case RACE_ADD:
      return {
        ...state,
        data: state.data.concat(action.payload)
      };
    case RACE_REMOVE:
      return {
        ...state,
        data: state.data.filter(recipe => recipe.recipeID !== action.payload)
      }
    case RACE_UPDATE:
      const newData = [];
      return {
        ...state,
        data: newData.concat(action.payload)
      }
    default:
      return state;
  }
}

const authReducer = (state, action) => {
  switch(action.type){
    case USER_LOGIN:
      return {
        ...state,
        username: action.payload.username,
        token: action.payload.token,
        balance: action.payload.balance,
        bets: action.payload.bets
      }
    case USER_LOGOUT:
      return {
        ...state,
        username: null,
        token: null,
        balance: null,
        bets: null
      }
    case ADD_BALANCE:
      return {
        ...state,
        balance: action.payload
      }
    case USER_BET:
      const newData = [];
      return {
        ...state,
        bets: newData.concat(action.payload)
      }
    default:
      return state
  }
}

export { raceReducer, authReducer }