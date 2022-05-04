import '../App.less';
import { useContext, useEffect, useState } from 'react';
import { Context } from '../store';
import RaceBoxWithModal from '../components/RaceBoxWithModal';
import { Link } from 'react-router-dom';
import BackendUrl from "../components/BackendUrl";
import moment from "moment";
import { updateRace } from "../store/actions";
import CalculateWinner from "../components/CalculateWinner";
import ErrorMessage from "../components/messages/ErrorMessage";
import SuccessMessage from '../components/messages/SuccessMessage';

const RacesPage = ({stateChanger}) => {
    const [state, dispatch] = useContext(Context);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        getRaces();
        //stateChanger(e => e + 1);
    }, [refresh])

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
                for(var i = data.length - 1; i > -1 ; i--){
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

    const checkEmptyState = () => {
        if(state.races.data.length == 0){
            return (<p>No races as of now. <Link to='/create-race'>Create one now!</Link></p>)
        } else {
            return(
                <div>
                    <RaceBoxWithModal stateChanger={setRefresh}></RaceBoxWithModal>
                </div>
            )
        }
    }

    const onRefreshClick = () => {
        setRefresh(e => e + 1)
        SuccessMessage('Refreshed!');
    }

    return(
        <div>
            <h1>Races <p onClick={() => onRefreshClick()}style={{fontSize: 'small', color: '#990AE3', cursor: 'pointer'}}>Refresh</p></h1>
            {checkEmptyState()}
        </div> 
    );
}

export default RacesPage;