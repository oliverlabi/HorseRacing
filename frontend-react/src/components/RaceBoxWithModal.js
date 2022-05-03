import { Button, Modal, Select, Form, Input, InputNumber } from "antd";
import { useContext, useState, useEffect } from "react";
import { Context } from "../store";
import './styles/RaceBoxGrid.css'
import moment from "moment";
import ConvertTrackName from "./ConvertTrackName";
import { useNavigate, useOutletContext } from "react-router-dom";
import LoginPromptMessage from "./messages/LoginPromptMessage";
import SuccessMessage from './messages/SuccessMessage'
import ErrorMessage from './messages/ErrorMessage'
import BackendUrl from './BackendUrl'
import CalculateWinner from "./CalculateWinner";
import { addBalance, updateBets } from "../store/actions";

const RaceBoxWithModal = ({stateChanger}) => {
    const [state, dispatch] = useContext(Context);
    const [refresh, setRefresh] = useOutletContext();

    const increment = () => setRefresh((c) => c + 1);
    //style
    const [betOrientation, setBetOrientation] = useState();
    const [betTextMargin, setBetTextMargin] = useState('auto');
    const [checkTextMargin, setCheckTextMargin] = useState('auto');
    const [betBtnMinWidth, setBetBtnMinWidth] = useState('60px');
    const [matches, setMatches] = useState(
        window.matchMedia(('(min-width: 700px)')).matches
    )
    //

    const [raceBoxIndex, setRaceBoxIndex] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentStatus, setStatus] = useState('No result!');
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        window
        .matchMedia(('(min-width: 700px)'))
        .addEventListener('change', e => setMatches(e.matches));

        if(!matches){
            setBetOrientation('vertical-rl');
            setBetTextMargin('-10px');
            setCheckTextMargin('-10px');
            setBetBtnMinWidth('auto');
        } else if(matches) {
            setBetOrientation('horizontal-tb');
            setBetTextMargin('auto');
            setCheckTextMargin('-12.5px');
            setBetBtnMinWidth('60px');
        }
    }, [matches])

    const onClick = (index) => { //on racebox Bet button click
        if(state.auth.username == null){
            LoginPromptMessage();
            navigate('/');
        } else {
            setRaceBoxIndex(index);
            setIsModalVisible(true);
        }
    }

    const onBet = (values, raceID) => { //on modal Bet button click
        const raceIndex = state.races.data.findIndex(e => e.raceID == raceID);
        if(moment(state.races.data[raceIndex].startingTime).isAfter(moment())){
            const betValues = {
                userName: state.auth.username,
                horse: values.horseChoice,
                amount: values.raceBet
            };
    
            const newActiveBet = {
                raceID: raceID,
                horse: values.horseChoice,
                amount: values.raceBet,
                active: true,
            }
    
            var currentBets = state.auth.bets;
            currentBets.push(newActiveBet);
    
            fetch(BackendUrl + 'api/race/createBet/' + raceID,{
                method: "PUT",
                body: JSON.stringify(betValues),
                headers: {"Content-Type":"application/json"}
            }).then((response) => {
                if(response.ok){
                    SuccessMessage('Bet was successful!')
                    dispatch(updateBets(currentBets));
                    dispatch(addBalance(state.auth.balance - values.raceBet));
                    increment();
                }
            }).catch(error => {
                ErrorMessage(error);
            });
        } else {
            ErrorMessage('Betting has already ended for this race!');
            stateChanger(e => e + 1);
        }
        
        setIsModalVisible(false);
    }

    const onCancel = () => { //on modal Cancel button click
        form.resetFields();
        setIsModalVisible(false);
    }

    const modalTitle = (state) => {
        return (
            <>
                <p>{state.races.data[raceBoxIndex].raceName}</p>
                <p style={{fontSize: 'small', marginTop: '-10px', marginBottom: '-10px', fontWeight: 'normal'}}>Created by: {state.races.data[raceBoxIndex].createdBy}</p>
            </>
        )
    }

    const onCheck = (index) => { //on modal Check button click
        const values = {
            userName: state.auth.username,
            horseCount: state.races.data[index].participatingHorses.length
        };

        const currentBets = state.auth.bets;
        const betIndex = state.auth.bets.findIndex(x => x.raceID === state.races.data[index].raceID);

        const currentBet = {
            raceID: state.races.data[index].raceID,
            horse: state.auth.bets[betIndex].horse,
            amount: state.auth.bets[betIndex].amount,
            active: false,
        }

        var filteredBets = currentBets.filter((item, index) => index !== betIndex);
        filteredBets.push(currentBet);

        if(moment(state.races.data[index].startingTime).isBefore(moment())){
            if(state.races.data[index].winningHorse == undefined){
                CalculateWinner(state.races.data[index].raceID, state.races.data[index].participatingHorses)
            }
            fetch(BackendUrl + 'api/race/endBet/' + state.races.data[index].raceID,{
                method: "PUT",
                body: JSON.stringify(values),
                headers: {"Content-Type":"application/json"}
            }).then((response) => {
                if(response.ok){
                    return response.json();
                }
            }).then((data) => {
                setIsModalVisible(false);
                const prevBalance = state.auth.balance;
                if(data <= prevBalance){
                    ErrorMessage('You lost!');
                } else {
                    SuccessMessage('You win!');
                }
                dispatch(addBalance(data));
                dispatch(updateBets(filteredBets));
                stateChanger(e => e + 1);
                increment();
            }).catch(error => {
                ErrorMessage(error);
            });
        } else {
            ErrorMessage('Race has not started yet!');
        }
    }

    //Style changes on click
    const buttonCheck = (race, index) => {
        if(state.auth.bets != null && state.auth.bets.some(el => el.raceID === race.raceID)){
            return(
                <Button className='RaceBoxButton' type='primary' onClick={() => onClick(index)} 
                    style={{
                        backgroundColor: '#16703c',
                        border: 'none',
                        borderRadius: '0 20px 20px 0', 
                        top: '-5px', 
                        right: '-4px', 
                        minHeight: '110%',
                        fontSize: '18px',
                        minWidth: betBtnMinWidth
                    }}
                >
                    <p style={{writingMode: betOrientation, marginLeft: checkTextMargin, marginTop: '10px'}}>CHECK</p>
                </Button>
            )
        } else {
            return(
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
            )
        }
    }

    const modalCheck = () => {
        if(state.auth.bets != null && state.auth.bets.some(el => el.raceID === state.races.data[raceBoxIndex].raceID)){
            return(
                <>
                    <p>Click button to check to see if you have won or not!</p>
                    <Button type='primary' shape='round' onClick={() => onCheck(raceBoxIndex)}
                        style={{
                            backgroundColor: '#16703c',
                            border: 'none'
                        }}
                    >
                        CHECK
                    </Button>
                </>
            )
        } else {
            return(
                <Form
                    form={form}
                    wrapperCol={{
                        span: 14,
                    }}
                    labelCol={{
                        span: 6,
                    }}
                    id='bettingForm'
                    onFinish={e => onBet(e, state.races.data[raceBoxIndex].raceID)}
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
                        type='number'
                        rules={[
                            {
                                required: true,
                                message: 'You must add an amount!',
                                
                            },
                        ]}
                    >
                        <InputNumber style={{width: '100%'}} min='1' max={state.auth.balance}/>
                    </Form.Item>
                    <Form.Item wrapperCol={matches && ({offset: 0}) || !matches && ({offset: 0})}>
                        <Button type='primary' htmlType='submit' shape='round'>
                            BET
                        </Button>
                    </Form.Item>
                </Form>
            );
        }
    }
    //

    return(
        <div>
            {state.races.data.map((race, index) => {
                return(
                    <div key={index} className='RaceBoxBg'>
                        <h2 className='RaceBoxTitle'>{race.raceName}</h2>
                        <p className='RaceBoxDescription'>{race.raceDescription}</p>
                        <div className='RaceBoxHorses'><b>Horse count:</b> {state.races.data[index].participatingHorses.length}</div>
                        <p className='RaceBoxStartingTime'><b>Start:</b> {moment(race.startingTime).format('HH:mm DD.MM.YY')}</p>
                        {buttonCheck(race, index)}
                    </div>
                )
            })}
            <Modal title={modalTitle(state)} visible={isModalVisible} footer={null} onCancel={onCancel}
                style={{
                    textAlign: 'center',
                }}
            >
                <p>{state.races.data[raceBoxIndex].raceDescription}</p>
                <p>Track: {ConvertTrackName(state.races.data[raceBoxIndex].raceTrack)}</p>
                <p>Start: {moment(state.races.data[raceBoxIndex].startingTime).format('HH:mm DD.MM.YYYY')}</p>
                {modalCheck()}
            </Modal>
        </div>
    );
}

export default RaceBoxWithModal;