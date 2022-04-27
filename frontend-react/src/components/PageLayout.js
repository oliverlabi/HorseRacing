import { useState, useEffect, useContext } from 'react';
import { Menu, Layout } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Context } from '../store';

const { Content, Footer, Sider } = Layout;

const PageLayout = () => {
    const [state, dispatch] = useContext(Context);
    const location = useLocation()
    const navigation = useNavigate();
    const [accountBtn, setAccountBtn] = useState('');
    const [hideMeter, setHiddenMeter] = useState('none');
    const [siderWidth, setSiderWidth] = useState('40vw');
    const [siderKey, setSiderKey] = useState(0);
    const [balanceMeter, setBalanceMeter] = useState('horizontal-tb');
    const [matches, setMatches] = useState(
        window.matchMedia(('(min-width: 1200px)')).matches
    )
    const [balance, setBalance] = useState(state.auth.balance);

    const siderLinks = [
        { key: '1', label: 'Races', path: '/races' },
        { key: '2', label: 'Create a race', path: '/create-race' },
        { key: '3', label: 'Tracks', path: '/tracks' },
        { key: '4', label: 'Betting odds', path: '/betting-odds'},
        { key: '5', label: 'Previous race results', path: '/prev-results' },
        { key: '6', label: accountBtn, path: '/'},
    ];

    const [selectedKey, setSelectedKey] =
        useState(
            siderLinks.find(
                _link => location.pathname.startsWith(
                    _link.path
                )
            ).key
        );

    const onClickMenu = (link) => {
        const clicked = siderLinks.find(_link => _link.key === link.key)
        navigation(clicked.path)
    }

    const menuFunctions = (link) => {
        if(!matches){
            setSiderKey(key => key + 1);
        }
        onClickMenu(link);
    }

    useEffect(() => {
        window
        .matchMedia(('(min-width: 1200px)'))
        .addEventListener('change', e => setMatches(e.matches));

        setSelectedKey(siderLinks.find(_link => location.pathname.startsWith(_link.path)).key);
        setBalance(state.auth.balance);

        if(!matches){
            setSiderWidth('calc(100vw - 32px)');
            setBalanceMeter('vertical-rl');
            
        } else if(matches) {
            setSiderWidth('40vw');
            setBalanceMeter('horizontal-tb');
            
        }

        if(state.auth.token != null){
            setAccountBtn('My account');
            setHiddenMeter('block');
        } else {
            setAccountBtn('Login');
            setHiddenMeter('none');
        }
    }, [state, matches, location, balance]);

    return(
        <Layout style={{
                height: '100vh', 
                textAlign: 'center', 
                justifyContent: 'center', 
                alignItems: 'center', 
                fontWeight: '500',
            }}>
            <Sider
                key={siderKey}
                breakpoint='xl'
                collapsedWidth='0'
                width={siderWidth}
                style={{
                        left: 0, 
                        top: 0, 
                        bottom: 0,
                        backgroundColor: '#ffffff', 
                        height: '100vh', 
                        paddingTop: '5vh',
                        marginRight: '40px',
                    }}>
                <div className='Sider-title' 
                    style={{
                        color: '#990AE3',
                        height: '32px',
                        marginBottom: '200px',
                        fontSize: '40px',
                        marginTop: '0',
                        fontStyle: 'italic',
                    }}
                >Horse race betting</div>
                <Menu
                    mode='inline'
                    style={{
                        textAlign: 'center', 
                        fontSize: '20px',
                    }}
                    onClick={menuFunctions}
                    selectedKeys={[selectedKey]}
                >
                    {siderLinks.map((link) => (
                        <Menu.Item key={link.key}>{link.label}</Menu.Item>
                    ))}
                </Menu>    
                
                <Footer style={{ 
                        fontWeight: '250', 
                        backgroundColor: '#ffffff',
                        color: '#990AE3',
                    }}>
                    Homework assignment
                    <br/>
                    Oliver Labi
                </Footer>
            </Sider>
            <Layout>
                <Content>
                    <Content
                        ><div>
                        {matches && (
                        <div className='purpleBar'
                            style={{
                                width: '36px', 
                                height: '100vh', 
                                backgroundColor: '#990AE3', 
                                position: 'fixed', 
                                top: 0, 
                                left: 0,
                                marginLeft: -40,
                                display: 'none',
                            }}/>)}
                        {!matches && (
                        <div className='purpleBar'
                            style={{
                                width: '36px', 
                                height: '100vh', 
                                backgroundColor: '#990AE3', 
                                position: 'fixed', 
                                top: 0, 
                                marginLeft: -40,
                                display: 'flex',
                            }}/>)}
                        </div>
                    </Content>
                    <div className='site-layout-background'>
                        <div className='sub-background'>
                            <Outlet/>
                        </div>
                        <div className='balance-meter'><h3
                            style={{
                                position: 'fixed',
                                bottom: 0,
                                marginLeft: '-35px',
                                writingMode: balanceMeter,
                                display: hideMeter
                            }}
                        >
                            Balance: {balance} c</h3></div>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}

export default PageLayout;