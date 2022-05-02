import { Button, Modal, Select, Form, Input, InputNumber } from "antd";
import { useContext, useState, useEffect } from "react";
import { Context } from "../store";
import './styles/RaceBoxGrid.css'
import moment from "moment";
import ConvertTrackName from "./ConvertTrackName";
import { useNavigate } from "react-router-dom";
import LoginPromptMessage from "./LoginPromptMessage";
import SuccessMessage from './SuccessMessage'
import ErrorMessage from './ErrorMessage'
import BackendUrl from './BackendUrl'
import CalculateWinner from "./CalculateWinner";
import { addBalance, updateBets } from "../store/actions";

const RaceBoxWithModal = () => {
    const [state, dispatch] = useContext(Context);

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
    const [isModalVisible, setIsModalVisible] = useState();
    const [currentStatus, setStatus] = useState('No result!');
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(state);
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
    }, [matches, state])

    const onClick = (index) => {
        if(state.auth.username == null){
            LoginPromptMessage();
            navigate('/');
        } else {
            setRaceBoxIndex(index);
            setIsModalVisible(true);
        }
    }

    const onFinish = (values, raceID) => {
        const betValues = {
            userName: state.auth.username,
            horse: values.horseChoice,
            amount: values.raceBet
        };

        const newActiveBet = {
            raceID: raceID,
            horse: values.horse,
            amount: values.amount,
            active: true,
        }

        var currentBets = state.auth.bets;

        currentBets.push(newActiveBet);

        console.log(currentBets);

        fetch(BackendUrl + 'api/race/createBet/' + raceID,{
            method: "PUT",
            body: JSON.stringify(betValues),
            headers: {"Content-Type":"application/json"}
        }).then((response) => {
            if(response.ok){
                SuccessMessage('Bet was successful!')
                dispatch(updateBets(currentBets));
            }
        }).catch(error => {
            ErrorMessage(error);
        });

        setIsModalVisible(false);
    }

    const onCancel = () => {
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

    const statusCheck = (index) => {
        const userName = {
            userName: state.auth.username
        };
        if(moment(state.races.data[index].startingTime).isBefore(moment())){
            fetch(BackendUrl + 'api/race/endBet/' + state.races.data[index].raceID,{
                method: "PUT",
                body: JSON.stringify(userName),
                headers: {"Content-Type":"application/json"}
            }).then((response) => {
                if(response.ok){
                    SuccessMessage('Bet has ended!')
                    console.log(response);
                }
            }).catch(error => {
                ErrorMessage(error);
            });
        } else {
            ErrorMessage('Race has not started!');
        }
    }

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
                        fontSize: '20px',
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

    const formCheck = () => {
        if(state.auth.bets != null && state.auth.bets.some(el => el.raceID === state.races.data[raceBoxIndex].raceID)){
            return(
                <>
                    <p>Status: <b>{currentStatus}</b></p>
                    <Button type='primary' shape='round' onClick={() => statusCheck(raceBoxIndex)}
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
                    onFinish={e => onFinish(e, state.races.data[raceBoxIndex].raceID)}
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
                        <InputNumber style={{width: '100%'}} min='0' max={state.auth.balance}/>
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

    return(
        <div>
            {state.races.data.map((race, index) => {
                return(
                    <div key={index} className='RaceBoxBg'>
                        <h2 className='RaceBoxTitle'>{race.raceName}</h2>
                        <p className='RaceBoxDescription'>{race.raceDescription}</p>
                        <div className='RaceBoxHorses'><b>Horse count:</b> {state.races.data[index].participatingHorses.length}</div>
                        <p className='RaceBoxStartingTime'><b>Start:</b> {moment(race.startingTime).format('HH:ss DD.MM.YY')}</p>
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
                <p>Start: {moment(state.races.data[raceBoxIndex].startingTime).format('hh:ss DD.MM.YYYY')}</p>
                {formCheck()}
            </Modal>
        </div>
    );
}

export default RaceBoxWithModal;