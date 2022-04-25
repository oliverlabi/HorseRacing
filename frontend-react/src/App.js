import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.less';
import CreateRacePage from './pages/CreateRacePage';
import RacesPage from './pages/RacesPage';
import AccountPage from './pages/AccountPage';
import PageLayout from './components/PageLayout';
import RegistrationForm from './components/RegistrationForm';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<PageLayout/>}>
            <Route index element={<RacesPage />} />
            <Route path='create-race' element={<CreateRacePage/>} />
            <Route path='account' element={<AccountPage/>} />
            <Route path='account/register' element={<RegistrationForm/>} />
            <Route
                path='*'
                element={<Navigate to='/' replace />}
            />
          </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
