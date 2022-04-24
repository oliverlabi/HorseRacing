import '../App.less';
import './CreateRacePage.css'
import moment from 'moment';
import { useState } from 'react';
import { Form, Input, Button, DatePicker, Select, Checkbox, Col, Row, message } from 'antd';

function CreateRacePage(){
    const [currentDate, setCurrentDate] = useState(moment());
    const { TextArea } = Input;

    const onFinish = (values) => {
        console.log(values);
        checkCheckboxCount(values.horsesGroup);
    }

    function checkCheckboxCount(array){
        if(array.length < 2){
            message.error('You must choose at least two horses!');
        } else if (array.length > 6) {
            message.error('Error 32521');
        } else {
            console.log('yup!');
        }
    }

    function getDisabledHours(){
        var hours = [];
        if(currentDate.date() === moment().date()){
            for(var i = 0; i < moment().hour(); i++){
                hours.push(i);
            }
        }
        return hours;
    }

    function getDisabledMinutes(selectedHour){
        var minutes = [];
        if (selectedHour === moment().hour() && currentDate.date() === moment().date()){
            for(var i =0; i < moment().minute(); i++){
                minutes.push(i);
            }
        }
        return minutes;
    }

    function disabledDate(current){
        return current < moment().startOf('day');
    }

    const buttonLayout = {
        wrapperCol: {span: 14, offset: 5},
    }

    return(
        <div className='sub-background'>
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
                    name='trackChoice'
                    
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
                    name='timeStart'
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
                <Form.Item name="horsesGroup" label="Participating horses:"
                    rules={[
                        {
                            required: true,
                            message: 'Must check at least 2 boxes!'
                        }
                    ]}
                >
                    <Checkbox.Group style={{ lineHeight: '32px' }}>
                    <Row>
                        <Col span={8}>
                        <Checkbox value='redHorse' style={{ color: 'red' }}>
                            #11
                        </Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value='blueHorse' style={{ color: 'blue' }}>
                            #97
                        </Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value='yellowHorse' style={{ color: '#948f04' }}>
                            #22
                        </Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value='greenHorse' style={{ color: 'green' }}>
                            #50
                        </Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value='purpleHorse' style={{ color: 'purple' }}>
                            #74
                        </Checkbox>
                        </Col>
                        <Col span={8}>
                        <Checkbox value='orangeHorse' style={{ color: 'orange' }}>
                            #90
                        </Checkbox>
                        </Col>
                    </Row>
                    </Checkbox.Group>
                </Form.Item>
                <Form.Item {...buttonLayout}>
                        <Button type='primary' htmlType='submit' shape='round' >
                            Create
                        </Button>
                    </Form.Item>
            </Form>
        </div>
        
    );
}

export default CreateRacePage;