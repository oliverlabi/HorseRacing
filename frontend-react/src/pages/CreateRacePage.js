import '../App.less'
import { useState, useContext, useEffect, useRef } from 'react';
import { Context } from "../store";
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, DatePicker, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import BackendUrl from '../components/BackendUrl';
import ErrorMessage from '../components/messages/ErrorMessage';
import SuccessMessage from '../components/messages/SuccessMessage';
import moment from 'moment';
import LoginPromptMessage from '../components/messages/LoginPromptMessage';

const CreateRacePage = () => {
    const [state] = useContext(Context);
    const [currentDate, setCurrentDate] = useState(moment());
    const [dynamicBtnMarginLeft, setDynamicBtnMarginLeft] = useState('37.5%')
    const [matches, setMatches] = useState(
        window.matchMedia(('(min-width: 576px)')).matches
    )
    const { TextArea } = Input;
    const COLORS = ['Red', 'Blue', 'Green', 'Orange', 'Gray', 'Black'];
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedIndexes, setSelectedIndexes] = useState([]);
    const filteredOptions = COLORS.filter(o => !selectedColors.includes(o));
    const [dynamicButtonStatus, setDynamicButtonStatus] = useState(false);
    const [horseCount, setHorseCount] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        if(state.auth.username == null) {
            LoginPromptMessage();
            navigate('/')
        }
        window
        .matchMedia(('(min-width: 576px)'))
        .addEventListener('change', e => setMatches(e.matches));
        if(!matches){
            setDynamicBtnMarginLeft('auto')
        } else {
            setDynamicBtnMarginLeft('37.5%')
        }

        if(selectedColors.length == horseCount){
            setDynamicButtonStatus(false);
        } else {
            setDynamicButtonStatus(true);
        }


    }, [matches, selectedColors, horseCount]);

    const onFinish = (values) => {
        var horseNamesArray = [];
        var horseColorsArray = [];

        for(var i=0; i<values.participatingHorses.length; i++){
            horseNamesArray.push(values.participatingHorses[i].horse)
            horseColorsArray.push(values.participatingHorses[i].color)
        }

        var formattedTime = moment(values.startingTime).format('YYYY/MM/DD HH:mm')

        const raceCreationAttempt = {
            raceName: values.raceName,
            raceDescription: values.raceDescription,
            raceTrack: values.raceTrack,
            startingTime: formattedTime,
            participatingHorses: horseNamesArray,
            horseColors: horseColorsArray,
            userName: state.auth.username,
        }


        return fetch(BackendUrl + "api/race/create",{
            method: "POST",
            body: JSON.stringify(raceCreationAttempt),
            headers: {"Content-Type":"application/json"}
        }).then((response) => {
            if(response.ok){
                SuccessMessage("Race successfully created!")
                return navigate("/races")
            } else {
                throw new Error("Error posting the race!")
            }
        }).catch(error => {
            ErrorMessage(error);
        });   
    }

    const handleDynamicFieldRemoval = (fieldName, removeFn) => {
        setSelectedColors(currentColors => currentColors.filter((x, index, arr) => {
            return index!==fieldName;
        }));
        setHorseCount(horse => horse - 1);
        removeFn(fieldName);
    }

    const handleDynamicDropdownColorRemoval = (currentChoice, arr) => {
        if(selectedIndexes[arr.index] == undefined){
            setSelectedIndexes(currentIndex => currentIndex.concat(arr.index));
            setSelectedColors(currentColors => currentColors.concat(currentChoice));
        } else {
            setSelectedColors(currentColors => currentColors.filter(word => word != selectedColors[arr.index]));
            setSelectedColors(currentColors => addToIndex(currentColors, arr.index, currentChoice));
        }
    }

    const addToIndex = (array, index, newItem) => {
        return [
            ...array.slice(0, index),
            newItem,
            ...array.slice(index)
        ];
    }

    const handleDynamicOnClick = (addFn) => {
        setHorseCount(horse => horse + 1);
        addFn();
    }
    
    const getDisabledHours = () => {
        var hours = [];
        if(currentDate.date() === moment().date()){
            for(var i = 0; i < moment().hour(); i++){
                hours.push(i);
            }
        }
        return hours;
    }

    const getDisabledMinutes = (selectedHour) => {
        var minutes = [];
        if (selectedHour === moment().hour() && currentDate.date() === moment().date()){
            for(var i =0; i < moment().minute(); i++){
                minutes.push(i);
            }
        }
        return minutes;
    }

    const disabledDate = (current) => {
        return current < moment().startOf('day');
    }

    return(
        <div style={{minWidth: '100%'}}>
            <h1>Create a race</h1>
            <br/>
            <Form
                onFinish={onFinish}
                wrapperCol={{
                    span: 10,
                }}
                labelCol={{
                    span: 10,
                }}
            >
                <Form.Item
                    label='Name your race:'
                    name='raceName'
                    rules={[
                        {
                            required: true,
                            message: 'Field must not be empty!',
                            
                        },
                        {
                            maxLength: 25,
                            message: 'Name can not be longer than 25 letters!'
                        }
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label='Description:'
                    name='raceDescription'
                    rules={[
                        {
                            required: true,
                            message: 'Field must not be empty!',
                            
                        },
                        {
                            maxLength: 50,
                            message: 'Description can not be longer than 50 letters!'
                        }
                    ]}
                >
                    <TextArea rows={3}/>
                </Form.Item>
                <Form.Item
                    label='Race track:'
                    name='raceTrack'
                    
                    rules={[
                        {
                            required: true,
                            message: 'Field must not be empty!',
                        }
                    ]}
                >
                    <Select placeholder='Choose a track' style={{fontWeight: '400'}}>
                        <Select.Option value="500m-g">Gravel 500m</Select.Option>
                        <Select.Option value="1000m-g">Gravel 1km</Select.Option>
                        <Select.Option value="500m-a">Asphalt 500m</Select.Option>
                        <Select.Option value="1000m-a">Asphalt 1km</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label='Starting time: '
                    name='startingTime'
                    rules={[
                        {
                            required: true,
                            message: 'Field must not be empty!',
                        }
                    ]}
                >
                    <DatePicker 
                        showTime
                        showNow={false}
                        format='DD.MM.YYYY HH:mm'
                        minuteStep={5}
                        onSelect={setCurrentDate}
                        disabledDate={disabledDate}
                        disabledHours={getDisabledHours}
                        disabledMinutes={getDisabledMinutes}
                    />
                </Form.Item>
                <h2 style={{marginBottom:'24px'}}>Participating horses</h2>
                <Form.List
                    name="participatingHorses"
                    rules={[
                    {
                        validator: async (_, names) => {
                        if (!names || names.length < 2) {
                            return Promise.reject(new Error('Minimum 2 horses!'));
                        }
                        },
                    },
                    {
                        validator: async (_, names) => {
                        if (names && names.length > 6) {
                            return Promise.reject(new Error('Maximum 6 horses!'));
                        }
                        },
                    },
                    ]}
                >
                    {(fields, { add, remove }, { errors }) => ( 
                    <div>
                        {fields.map((field, index) => (
                        <Form.Item style={{display: 'flex', justifyContent: 'center', alignContent: 'flex-start', marginBottom: '12px'}}
                            required={true}
                            key={field.key}
                        >
                            <Form.Item
                                {...field}
                                name={[field.name, 'horse']}
                                fieldKey={[field.fieldKey, 'horse']}
                                validateTrigger={['onChange', 'onBlur']}
                                rules={[
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: "Please input a name or delete this field!",
                                    },
                                    {
                                        max: 20,
                                        message: 'Maximum horse name length is 14 characters',
                                    }
                                ]}
                                noStyle
                            >
                                <Input placeholder="Input horse name" style={{width: '60%'}}/>
                            </Form.Item>

                            <Form.Item
                                validateTrigger={['onChange', 'onBlur']}
                                name={[field.name, 'color']}
                                fieldKey={[field.fieldKey, 'color']}
                                rules={[
                                    {
                                    required: true,
                                    whitespace: true,
                                    message: "Please choose a color or delete this field!",
                                    },
                                ]}
                                noStyle
                            >
                                    <Select 
                                        placeholder='Color' 
                                        value={selectedColors}
                                        onChange={(e, arr) => handleDynamicDropdownColorRemoval(e, arr, index)}
                                        style={{fontWeight: '400', width: '30%'}}
                                    >
                                        {filteredOptions.map((item) => (
                                            <Select.Option key={item} value={item} index={index}>
                                                {item}
                                            </Select.Option>
                                            
                                        ))}
                                    </Select>
                            </Form.Item>                    
                            {fields.length > 1? (
                            <MinusCircleOutlined
                                style={{paddingLeft: '5px', width: '10%'}}
                                className="dynamic-delete-button"
                                onClick={() => handleDynamicFieldRemoval(field.name, remove)}
                            />
                            ) : null}
                        </Form.Item>
                        ))}

                        {fields.length < 6 ? (
                        <Form.Item style={{marginLeft: dynamicBtnMarginLeft}}>
                            <Button
                                type="dashed"
                                onClick={() => handleDynamicOnClick(add)}
                                icon={<PlusOutlined />}
                                disabled={dynamicButtonStatus}
                            >
                                Add a horse
                            </Button>
                            <Form.ErrorList errors={errors}/>
                        </Form.Item>
                        ) : null}

                    </div>
                    )}
                </Form.List>
                <Form.Item wrapperCol={{offset: 0}}>
                    <Button type='primary' htmlType='submit' shape='round'>
                        Create
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );


    
}

export default CreateRacePage;