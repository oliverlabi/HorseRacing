import '../App.less';
import LoginForm from '../components/LoginForm';
import { useContext } from 'react';
import { Context } from "../store";
import { Button } from 'antd';
import { logoutUser } from '../store/actions';

function AccountPage(){
    const [state, dispatch] = useContext(Context);
    console.log(state);

    function logout(){
        dispatch(logoutUser());
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
                    <span>
                        <Button type="default" htmlType="logout" onClick={() => logout()} style={{marginLeft: "10px", marginBottom: "10px"}}>Logout</Button>
                    </span>
                </div>
                
            )
    }
    
}

export default AccountPage;