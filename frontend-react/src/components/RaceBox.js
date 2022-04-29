import { Button, Modal, Select, Form, Input } from "antd";
import { useContext, useState, useEffect } from "react";
import { Context } from "../store";
import './styles/RaceBox.css'
import moment from "moment";
import ConvertTrackName from "./ConvertTrackName";
import { useNavigate } from "react-router-dom";
import LoginPromptMessage from "./LoginPromptMessage";

const RaceBox = () => {
    const [state, dispatch] = useContext(Context);
    const [betOrientation, setBetOrientation] = useState();
    const [betTextMargin, setBetTextMargin] = useState('auto');
    const [isModalVisible, setIsModalVisible] = useState();
    const [raceBoxIndex, setRaceBoxIndex] = useState(0);
    const [betBtnMinWidth, setBetBtnMinWidth] = useState('60px');
    const navigate = useNavigate();
    const [matches, setMatches] = useState(
        window.matchMedia(('(min-width: 700px)')).matches
    )

    useEffect(() => {
        window
        .matchMedia(('(min-width: 700px)'))
        .addEventListener('change', e => setMatches(e.matches));

        if(!matches){
            setBetOrientation('vertical-rl');
            setBetTextMargin('-10px');
            setBetBtnMinWidth('auto');
        } else if(matches) {
            setBetOrientation('horizontal-tb');
            setBetTextMargin('auto');
            setBetBtnMinWidth('60px');
        }

        console.log(state.races.data);
    }, [matches])

    function onClick(index){
        if(state.auth.username == null){
            LoginPromptMessage();
            navigate('/');
        } else {
            setRaceBoxIndex(index);
            setIsModalVisible(true);
        }
        
    }

    const onBet = () => {
        setIsModalVisible(false);
    }

    const onCancel = () => {
        setIsModalVisible(false);
    }

    return(
        <div>
            {state.races.data.map((race, index) => (
                <div key={index} className='RaceBoxBg'>
                    <h2 className='RaceBoxTitle'>{race.raceName}</h2>
                    <p className='RaceBoxDescription'>{race.raceDescription}</p>
                    <div className='RaceBoxHorses'><b>Horse count:</b> {state.races.data[index].participatingHorses.length}</div>
                    <p className='RaceBoxStartingTime'><b>Start:</b> {moment(race.startingTime).format('hh:ss DD.MM.YY')}</p>
                    <Button className='RaceBoxButton' type='primary' onClick={() => onClick(index)} 
                        style={{
                            borderRadius: '0 20px 20px 0', 
                            top: '-5px', 
                            right: '-4px', 
                            minHeight: '110%',
                            fontSize: '20px',
                            minWidth: betBtnMinWidth
                        }}
                    >
                        <p style={{writingMode: betOrientation, marginLeft: betTextMargin, marginTop: '10px'}}>BET</p>
                    </Button>
                </div>
            ))}
            <Modal title={state.races.data[raceBoxIndex].raceName} visible={isModalVisible} footer={null} onCancel={onCancel}
                style={{
                    textAlign: 'center',
                    borderRadius: '20px',
                }}
            >
                <p>{state.races.data[raceBoxIndex].raceDescription}</p>
                <p>Track: {ConvertTrackName(state.races.data[raceBoxIndex].raceTrack)}</p>
                <p>Start: {moment(state.races.data[raceBoxIndex].startingTime).format('hh:ss DD.MM.YYYY')}</p>
                <Form
                    wrapperCol={{
                        span: 14,
                    }}
                    labelCol={{
                        span: 6,
                    }}
                    id='bettingForm'
                >
                        <Form.Item
                            label='Horse: '
                            name='horseChoice'
                            rules={[
                                {
                                    required: true,
                                    message: 'You must choose a horse!',
                                }
                            ]}
                        >
                            <Select placeholder='Choose a horse' style={{fontWeight: '400'}}>
                                {state.races.data[raceBoxIndex].participatingHorses.map((item, index) => (
                                    <Select.Option key={item + index} value={item}>
                                        {'Name: ' + item + ', Color: ' + state.races.data[raceBoxIndex].horseColors[index]}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    <Form.Item
                        label='Amount: '
                        name='raceBet'
                        rules={[
                            {
                                required: true,
                                message: 'You must add an amount!',
                                
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item wrapperCol={matches && ({offset: 0}) || !matches && ({offset: 0})}>
                        <Button type='primary' htmlType='submit' shape='round' onClick={onBet}>
                            BET
                        </Button>
                </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default RaceBox;