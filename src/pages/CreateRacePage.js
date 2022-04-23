import '../App.less';
import './CreateRacePage.css'
import moment from 'moment';
import { useState } from 'react';
import { Form, Input, Button, DatePicker, Select } from 'antd';

function CreateRacePage(){
    const [currentDate, setCurrentDate] = useState(moment());

    const onFinish = (values) => {
        console.log(values);
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
                    label="Name your race:"
                    name="raceName"
                    rules={[
                        {
                            required: true,
                            message: 'Fields must not be empty!',
                        }
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Description:"
                    name="raceName"
                    rules={[
                        {
                            required: true,
                            message: 'Fields must not be empty!',
                        }
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Start time:"
                    name="timeStart"
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
                        format="DD.MM.YYYY HH:mm" 
                        minuteStep={5}
                        onSelect={setCurrentDate}
                        disabledDate={disabledDate}
                        disabledHours={getDisabledHours}
                        disabledMinutes={getDisabledMinutes}
                    />
                </Form.Item>
                <Form.Item
                    label="Track:"
                    name="trackChoice"
                    
                    rules={[
                        {
                            required: true,
                            message: 'Fields must not be empty!',
                        }
                    ]}
                >
                    <Select placeholder="Choose a track">
                        <Select.Option value="500m-g">Gravel 500m</Select.Option>
                        <Select.Option value="1000m-g">Gravel 1km</Select.Option>
                        <Select.Option value="500m-g">Asphalt 500m</Select.Option>
                        <Select.Option value="500m-g">Asphalt 1km</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </div>
        
    );
}

export default CreateRacePage;