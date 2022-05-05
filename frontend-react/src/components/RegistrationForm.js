import { Link, useNavigate } from 'react-router-dom';
import {Form, Input, Button } from 'antd';
import BackendUrl from './BackendUrl';
import SuccessMessage from './messages/SuccessMessage';
import ErrorMessage from './messages/ErrorMessage';

const RegistrationForm = () => {
    const navigate = useNavigate();

    const onFinish = (values) => {
        if(values.password != values.passwordConfirmation){
            ErrorMessage('Passwords must match!')
        } else {
            fetch(BackendUrl + 'api/auth/signup', {
                method: "POST",
                body: JSON.stringify(values),
                headers: {"Content-Type":"application/json"}
            }).then(response => {
                if(response.ok){
                    SuccessMessage("Account successfully created!");
                    return navigate("/account");
                } else {
                    throw new Error('Error creating an account!')
                }
            }).catch(error => {
                ErrorMessage(error);
            });
        }
        

    }

    return(
        <div>
            <h1>Create an account</h1>
            <Form
            name="basic"
            initialValues={{remember: true,}}
            autoComplete="off"
            onFinish={onFinish}
            wrapperCol={{
                span: 14,
            }}
            labelCol={{
                span: 10,
            }}
        >
                <Form.Item
                    name="userName"
                    label="Username: "
                    rules={[
                    {
                        required: true,
                        message: 'Please input your username!',
                    },
                    {
                        min: 5,
                        message: 'Minimum length is 5!',
                    },
                    {
                        pattern: new RegExp(/^[a-zA-Z0-9]*$/),
                        message: 'Invalid type of username!'
                    },
                    {
                        max: 30,
                        message: 'Username can not be longer than 30 letters!'
                    }
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Password: "
                    name="password"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                    {
                        min: 6,
                        message: 'Minimum length is 6 characters!',
                    },
                    ]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item
                    label="Confirm password: "
                    name="passwordConfirmation"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                    {
                        min: 6,
                        message: 'Minimum length is 6 characters!',
                    },
                    ]}
                >
                    <Input.Password/>
                </Form.Item>
                    <Form.Item wrapperCol={{}}>
                    <Button type="primary" htmlType="login" shape="round">
                    Create
                    </Button>
                </Form.Item>
            </Form>
            <p>Already have an account?<Link to="/"> Log in</Link></p>
        </div>
    )
    
}

export default RegistrationForm;