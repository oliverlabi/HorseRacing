import { useContext } from "react"
import { Context } from "../store";
import {Form, Input, Button} from 'antd';
import { Link, useOutletContext } from 'react-router-dom';
import { loginUser } from "../store/actions";
import BackendUrl from './BackendUrl';
import SuccessMessage from "./messages/SuccessMessage";
import ErrorMessage from "./messages/ErrorMessage";


function Login(){
    const [state, dispatch] = useContext(Context)
    const [refresh, setRefresh] = useOutletContext();

    const increment = () => setRefresh((c) => c + 1);

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
                ErrorMessage("Invalid credentials!");
            }
        })
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
            increment();
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