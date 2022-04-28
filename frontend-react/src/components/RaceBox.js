import { Button } from "antd";
import { useContext, useState, useEffect } from "react";
import { Context } from "../store";
import './styles/RaceBox.css'
import moment from "moment";

const RaceBox = () => {
    const [state, dispatch] = useContext(Context);
    const [betOrientation, setBetOrientation] = useState();
    const [betMargin, setBetMargin] = useState();
    const [matches, setMatches] = useState(
        window.matchMedia(('(min-width: 700px)')).matches
    )

    useEffect(() => {
        window
        .matchMedia(('(min-width: 700px)'))
        .addEventListener('change', e => setMatches(e.matches));

        if(!matches){
            setBetOrientation('vertical-rl');
            setBetMargin('-15px');
        } else if(matches) {
            setBetOrientation('horizontal-tb');
            setBetMargin('auto');
        }
    }, [matches])

    return(
        <div>
            {state.races.data.map((race, index) => (
                <div key={index} className='RaceBoxBg'>
                    <h2 className='RaceBoxTitle'>{race.raceName}</h2>
                    <p className='RaceBoxDescription'>{race.raceDescription}</p>
                    <div className='RaceBoxHorses'><b>Horse count:</b> {state.races.data[index].participatingHorses.length}</div>
                    <p className='RaceBoxStartingTime'><b>Start:</b> {moment(race.startingTime).format('hh:ss DD.MM.YY')}</p>
                    <Button className='RaceBoxButton' type='primary' 
                        style={{
                            borderRadius: '0 20px 20px 0', 
                            top: '-5px', 
                            right: '-4px', 
                            minHeight: '110%',
                            fontSize: '20px',
                        }}
                    >
                        <p style={{writingMode: betOrientation, marginLeft: betMargin, marginTop: '10px'}}>BET</p>
                    </Button>
                </div>
            ))}
        </div>
    );
}

export default RaceBox;