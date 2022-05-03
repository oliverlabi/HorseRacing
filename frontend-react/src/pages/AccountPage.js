import '../App.less';
import LoginForm from '../components/LoginForm';
import { useContext } from 'react';
import { Context } from "../store";
import { Button } from 'antd';
import { logoutUser } from '../store/actions';
import TopUpButton from '../components/TopUpButton';
import { useOutletContext } from 'react-router-dom';

const AccountPage = () => {
    const [state, dispatch] = useContext(Context);
    const [refresh, setRefresh] = useOutletContext();

    const increment = () => setRefresh((c) => c + 1);

    const logout = () => {
        dispatch(logoutUser());
        increment();
    }

    switch(state.auth.token){
        case null:
            return(
                <div>
                    <LoginForm/>
                </div>
            )
        default:
            return(
                <div>
                    <h1>Welcome, {state.auth.username}!</h1>
                    <h2>Top up balance: </h2>
                    <TopUpButton/>
                    <br/>
                    <Button type="default" htmlType="logout" onClick={() => logout()} style={{margin: 'auto'}}>Logout</Button>
                </div>
                
            )
    }
    
}

export default AccountPage;