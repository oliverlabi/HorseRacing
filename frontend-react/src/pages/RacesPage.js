import '../App.less';
import { useState, useEffect, useContext } from 'react';
import { Context } from '../store';
import { updateRace } from '../store/actions';
import BackendUrl from '../components/BackendUrl'
import ErrorMessage from '../components/ErrorMessage'
import RaceBoxWithModal from '../components/RaceBoxWithModal';
import { Link } from 'react-router-dom';
import moment from 'moment';

const RacesPage = () => {
    const [state, dispatch] = useContext(Context);

    useEffect(() => {
        getRaces();
    }, [RaceBoxWithModal])

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
                    <RaceBoxWithModal></RaceBoxWithModal>
                </div>
            )
        }
    }

    return(
        <div>
            <h1>Races</h1>
            {checkEmptyState()}
        </div> 
    );
}

export default RacesPage;