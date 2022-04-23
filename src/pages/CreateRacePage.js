import '../App.less';
import './CreateRacePage.css'
import { Form, Input, Button } from 'antd';

const onFinish = (values) => {
    console.log(values);
}

function createRacePage(){
    return(
        <div className='sub-background'>
            <h1>Create a race</h1>
            <Form
                onFinish={onFinish}
                
            >
                <Form.Item
                    label="Name your race:"
                    name="raceName"
                    rules={[
                        {
                            required: true,
                            message: 'Filed must not be empty!',
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
                            message: 'Filed must not be empty!',
                        }
                    ]}
                >
                    <Input/>
                </Form.Item>
            </Form>
        </div>
        
    );
}

export default createRacePage;