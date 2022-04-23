import { Menu, Layout } from 'antd';
import { Link, Outlet } from 'react-router-dom';

const { Content, Footer, Sider } = Layout;

function PageLayout(){
    return(
        <Layout style={{
                height: '100vh', 
                textAlign: 'center', 
                justifyContent: 'center', 
                alignItems: 'center', 
                fontWeight: '500',
            }}>
            <Sider
                breakpoint='lg'
                collapsedWidth='0'
                width='40vw'
                style={{
                        left: 0, 
                        top: 0, 
                        bottom: 0, 
                        backgroundColor: '#ffffff', 
                        height: '100vh', 
                        paddingTop: '5vh',
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
                >
                    <Menu.Item key='1'><Link to='/races'>Races</Link></Menu.Item>
                    <Menu.Item key='2'><Link to='/create-race'>Create a race</Link></Menu.Item>
                    <Menu.Item key='3'><Link to='/horses'>Horses</Link></Menu.Item>
                    <Menu.Item key='4'><Link to='/tracks'>Tracks</Link></Menu.Item>
                    <Menu.Item key='5'><Link to='/betting-odds'>Betting odds</Link></Menu.Item>
                    <Menu.Item key='6'><Link to='/prev-results'>Previous results</Link></Menu.Item>
                    
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
                <div className='site-layout-background' 
                    style={{
                        height: '100%', 
                        textAlign: 'center',
                    }}>
                    <Outlet/>
                </div>
                </Content>
            </Layout>
        </Layout>
    );
}

export default PageLayout;