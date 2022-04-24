import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.less';
import CreateRacePage from './pages/CreateRacePage';
import RacesPage from './pages/RacesPage';
import PageLayout from './components/PageLayout';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<PageLayout/>}>
            <Route index element={<RacesPage />} />
            <Route path='create-race' element={<CreateRacePage/>} />
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
