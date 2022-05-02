import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.less';
import CreateRacePage from './pages/CreateRacePage';
import RacesPage from './pages/RacesPage';
import AccountPage from './pages/AccountPage';
import PageLayout from './components/PageLayout';
import RegistrationForm from './components/RegistrationForm';
import TracksPage from './pages/TracksPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<PageLayout/>}>
            <Route index element={<AccountPage />} />
            <Route path='races' element={<RacesPage />} />
            <Route path='create-race' element={<CreateRacePage/>} />
            <Route path='prev-results' element={<ResultsPage/>} />
            <Route path='register' element={<RegistrationForm/>} />
            <Route path='tracks' element={<TracksPage/>} />
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
