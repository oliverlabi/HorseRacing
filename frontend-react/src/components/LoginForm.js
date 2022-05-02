import { useContext } from "react"
import { Context } from "../store";
import {Form, Input, Button} from 'antd';
import { Link } from 'react-router-dom';
import { loginUser } from "../store/actions";
import BackendUrl from './BackendUrl';
import SuccessMessage from "./SuccessMessage";
import ErrorMessage from "./ErrorMessage";


function Login(){
    const [state, dispatch] = useContext(Context)
    
    const onFinish = (values) => {
        const loginAttempt = {
            userName: values.userName,
            password: values.password,
        };
        fetch(BackendUrl + 'api/auth/login/',{
            method: "POST",
            body: JSON.stringify(loginAttempt),
            headers: {"Content-Type":"application/json"}
        }).then((response) => {
            if(response.ok){
                fetchUserData(loginAttempt);
            } else {
                throw new Error("Invalid credentials!");
            }
        }).catch(error => {
            ErrorMessage(error);
        });
    }

    const fetchUserData = (loginAttempt) => {
        fetch(BackendUrl + 'api/auth/' + loginAttempt.userName)
        .then(response => {
            return response.json();
        })
        .then(data => {
            const loginState = {
                username: loginAttempt.userName,
                token: data.password,
                balance: data.balance,
                bets: data.bets

            }
            dispatch(loginUser(loginState));
            SuccessMessage('Successful login!');
        }).catch(error => {
            ErrorMessage(error);
        });
    }

    return(
        <div>
            <h1>Login</h1>
            <Form
                name="basic"
                initialValues={{remember: true,}}
                autoComplete="off"
                onFinish={onFinish}
                wrapperCol={{
                    span: 16,
                }}
                labelCol={{
                    span: 8,
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
                ]}
            >
                <Input.Password/>
            </Form.Item>
            <Form.Item wrapperCol={{}}>
                <Button type="primary" htmlType="login" shape="round">
                Login
                </Button>
            </Form.Item>
            </Form>
            <Link to="register">Create a new account</Link>
        </div>
    );
}

export default Login;