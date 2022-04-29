import '../App.less';
import { useState, useEffect, useContext } from 'react';
import { Context } from '../store';
import { updateRace } from '../store/actions';
import BackendUrl from '../components/BackendUrl'
import ErrorMessage from '../components/ErrorMessage'
import RaceBox from '../components/RaceBox';
import { Link } from 'react-router-dom';

const RacesPage = () => {
    const [state, dispatch] = useContext(Context);
    const [races, setRaces] = useState([]);

    useEffect(() => {
        getRaces();
    }, [])

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
                dispatch(updateRace(data));
                setRaces(data);
            })
            .catch(error => {
                ErrorMessage(error.toString());
        });
    }

    const checkEmptyState = () => {
        if(state.races.data.length == 0){
            return (<p>No races as of now. <Link to='/create-race'>Create one now!</Link></p>)
        } else {
            return(
                <div>
                    <RaceBox></RaceBox>
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