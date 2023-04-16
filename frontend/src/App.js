import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import PartsShow from './components/PartsShow';
import PartRead from './components/PartRead';
import PartEdit from './components/PartEdit';
import PartCreate from './components/PartCreate';
import NavBar from './components/NavBar';

function App() {

    return (
        <Router>
            <div className="main">
                <NavBar />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/dalys' element={<PartsShow />} />
                    <Route path='/dalys/:id' element={<PartRead />} />
                    <Route path='/dalys/:id/redaguoti' element={<PartEdit />} />
                    <Route path='/dalys/sukurti' element={<PartCreate />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;