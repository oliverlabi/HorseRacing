import '../App.less'
import { useState, useContext, useEffect } from 'react';
import { Context } from "../store";
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, DatePicker, Select, message, Col, Row } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import BackendUrl from '../components/BackendUrl';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import moment from 'moment';

const CreateRacePage = () => {
    const [state] = useContext(Context);
    const [currentDate, setCurrentDate] = useState(moment());
    const [matches, setMatches] = useState(
        window.matchMedia(('(min-width: 1200px)')).matches
    )
    const { TextArea } = Input;
    const COLORS = ['Red', 'Blue', 'Green', 'Yellow', 'White', 'Black'];
    const [selectedColors, setSelectedColors] = useState([]);
    const filteredOptions = COLORS.filter(o => !selectedColors.includes(o));

    const navigate = useNavigate();

    useEffect(() => {
        window
        .matchMedia(('(min-width: 1200px)'))
        .addEventListener('change', e => setMatches(e.matches));

        if(state.auth.username == null) {
            navigate('/')
        }
    }, [matches]);

    const onFinish = (values) => {
        var horseNamesArray = [];
        var horseColorsArray = [];

        for(var i=0; i<values.participatingHorses.length; i++){
            horseNamesArray.push(values.participatingHorses[i].horse)
            horseColorsArray.push(values.participatingHorses[i].color)
        }

        var formattedTime = moment(values.startingTime).format('YYYY/MM/DD hh:mm')

        console.log(formattedTime);
        const raceCreationAttempt = {
            raceName: values.raceName,
            raceDescription: values.raceDescription,
            raceTrack: values.raceTrack,
            startingTime: formattedTime,
            participatingHorses: horseNamesArray,
            horseColors: horseColorsArray,
            userName: state.auth.username,
        }

        console.log(JSON.stringify(raceCreationAttempt));

        return fetch(BackendUrl + "api/race/create",{
            method: "POST",
            body: JSON.stringify(raceCreationAttempt),
            headers: {"Content-Type":"application/json"}
        }).then((response) => {
            if(response.ok){
                SuccessMessage("Race successfully created!")
                return navigate("/")
            } else {
                throw new Error("Error posting the race!")
            }
        }).catch(error => {
            ErrorMessage(error);
        });   
    }

    const handleDropdownRemoval = (currentChoice) => {
        setSelectedColors(currentColors => currentColors.concat(currentChoice));
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
        <div>
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
                            message: 'Fields must not be empty!',
                            
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
                            message: 'Fields must not be empty!',
                            
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
                            message: 'Fields must not be empty!',
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
                    label='Starting time:'
                    name='startingTime'
                    rules={[
                        {
                            required: true,
                            message: 'Fields must not be empty!',
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
                <h2>Participating horses</h2>
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
                        if (names.length > 6) {
                            return Promise.reject(new Error('Maximum 6 horses!'));
                        }
                        },
                    },
                    ]}
                >
                    {(fields, { add, remove }, { errors }) => ( 
                    <div style={{paddingLeft: '10px'}} >
                        {fields.map(field => (
                        <Col>
                        <Form.Item
                            required={true}
                            key={field.key}
                        >   
                        <>
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
                                ]}
                                noStyle
                            >
                                <Input placeholder="Input horse name"/>
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
                                            onChange={handleDropdownRemoval}
                                            style={{fontWeight: '400'}}
                                        >
                                            {filteredOptions.map(item => (
                                                <Select.Option key={item} value={item}>
                                                {item}
                                            </Select.Option>
                                            ))}
                                        </Select>
                                </Form.Item>
                            {fields.length > 1 ? (
                            <MinusCircleOutlined
                                style={{paddingLeft: '5px'}}
                                className="dynamic-delete-button"
                                onClick={() => remove(field.name)}
                            />
                            ) : null}
                        </>
                        </Form.Item>
                        
                        </Col>
                        ))}
                        
                        
                        
                        {fields.length < 6 ? (
                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                icon={<PlusOutlined />}
                            >
                                Add a horse
                            </Button>
                            <Form.ErrorList errors={errors} />
                        </Form.Item>
                        ) : null}
                        
                        
                    </div>
                    )}
                </Form.List>
                <Form.Item wrapperCol={matches && ({offset: 0}) || !matches && ({offset: 0})}>
                    <Button type='primary' htmlType='submit' shape='round'>
                        Create
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );


    
}

export default CreateRacePage;