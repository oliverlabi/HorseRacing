import { Link, useNavigate } from 'react-router-dom';
import {Form, Input, Button, message} from 'antd';
import BackendUrl from './BackendUrl';

function RegistrationForm(){
    const navigate = useNavigate();

    const onFinish = (values) => {
        fetch(BackendUrl + 'api/auth/signup', {
                method: "POST",
                body: JSON.stringify(values),
                headers: {"Content-Type":"application/json"}
            }).then(response => {
                if(response.ok){
                    let successEvent = "Account successfully created!"
                    displaySuccess(successEvent);
                    return navigate("/account");
                } else {
                    throw new Error("Error signing up!");
                }
            }).catch(error => {
                displayError(error);
            });

        const displayError = (error) => {
            message.error(error.toString());
        }

        const displaySuccess = (success) => {
            message.success(success);
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
                span: 9,
            }}
            labelCol={{
                span: 9,
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
                    {
                        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                        message: "Password must contain atleast: 1 lowercase letter, 1 uppercase letter, 1 number"
                    }
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
                    {
                        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                        message: "Password must contain atleast: 1 lowercase letter, 1 uppercase letter, 1 number"
                    }
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
            <p>Already have an account?<Link to="/account"> Log in</Link></p>
        </div>
    )
    
}

export default RegistrationForm;