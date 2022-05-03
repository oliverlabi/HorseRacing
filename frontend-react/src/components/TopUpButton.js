import './styles/TopUpButton.css';
import BackendUrl from './BackendUrl';
import { useContext } from 'react';
import { Context } from '../store';
import ErrorMessage from './messages/ErrorMessage'
import BalanceMessage from './messages/BalanceMessage';
import { addBalance } from '../store/actions';
import { useOutletContext } from 'react-router-dom';

const TopUpButton = () => {
    const [state, dispatch] = useContext(Context);
    const [refresh, setRefresh] = useOutletContext();

    const increment = () => setRefresh((c) => c + 1);

    const setBalance = () => {
        const balanceModification = {
            operator: 0
        }
        fetch(BackendUrl + 'api/auth/modifyBalance/' + state.auth.username,{
            method: 'PUT',
            body: JSON.stringify(balanceModification),
            headers: {"Content-Type":"application/json"}
        }).then((response) => {
            if(response.ok){
                dispatch(addBalance(state.auth.balance + 1));
                BalanceMessage('+1');
                increment();
            } else {
                throw new Error('Error topping up balance!');
            }
        }).catch(error => {
            ErrorMessage(error);
        });
    }

    return (
        <div className='circle' onContextMenu={(e)=> e.preventDefault()} onClick={setBalance}>
            <p
                style={{
                    color: 'white', 
                    paddingTop: '30px',
                    userSelect: 'none',
                    fontSize: '25px'
                }}
            > +1 c
            </p>
        </div>
    )
}

export default TopUpButton;