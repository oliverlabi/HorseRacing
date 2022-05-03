import BackendUrl from "./BackendUrl";
import moment from "moment";
import { useContext } from "react";
import { Context } from "../store";
import { updateRace } from "../store/actions";
import CalculateWinner from "./CalculateWinner";
import ErrorMessage from "./messages/ErrorMessage";

const GetRacesAPI = () => {
    const [state, dispatch] = useContext(Context);

    async function getRaces(){
        fetch(BackendUrl + 'api/race/all')
            .then(response => {
                if(response.ok){
                    return response.json();
                } else {
                    throw new Error('Error fetching races!');
                }
            })
            .then(data => {
                var tempArray = [];
                for(var i = 0; i < data.length; i++){
                    if(checkIfActiveBet(data[i], i) || moment().isBefore(moment(data[i].startingTime))){
                        tempArray.push(data[i]);
                    }
                }
                
                dispatch(updateRace(tempArray));
                
            })
            .catch(error => {
                ErrorMessage(error.toString());
        });
    }

    const checkIfActiveBet = (data) => {
        if(state.auth.bets != undefined && moment().isAfter(moment(data.startingTime))){
            if(data.winningHorse == undefined){
                CalculateWinner(data.raceID, data.participatingHorses);
            }
            const filteredBet = state.auth.bets.filter(el => el.raceID == data.raceID && el.active == true);
            if(filteredBet.length != 0){
                return true;
            }
        }
        return false;
    }

    getRaces();
}

export default GetRacesAPI;