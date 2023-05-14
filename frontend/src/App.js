import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import PartsShow from './components/PartsShow';
import PartRead from './components/PartRead';
import PartReviews from './components/PartReviews';
import PartEdit from './components/PartEdit';
import PartCreate from './components/PartCreate';
import NavBar from './components/NavBar';
import ComputerSetList from './components/ComputerSetList';
import ComputerSetForm from './components/ComputerSetForm';
import ComputerSetNewForm from './components/ComputerSetNewForm';
function App() {

    return (
        <Router>
            <div className="main">
                <NavBar />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/detales' element={<PartsShow />} />
                    <Route path='/detales/:id' element={<PartRead />} />
                    <Route path='/detales/:id/atsiliepimai' element={<PartReviews />} />
                    <Route path='/detales/:id/redaguoti' element={<PartEdit />} />
                    <Route path='/detales/prideti' element={<PartCreate />} />
                    <Route path='/rinkiniai' element={<ComputerSetList />} />
                    <Route path='/rinkiniai/:id' element={<ComputerSetForm />} />
                    <Route path='/rinkiniai/new' element={<ComputerSetNewForm/>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;