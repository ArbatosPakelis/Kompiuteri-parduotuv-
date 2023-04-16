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
                    <Route path='/detales' element={<PartsShow />} />
                    <Route path='/detales/:id' element={<PartRead />} />
                    <Route path='/detales/:id/redaguoti' element={<PartEdit />} />
                    <Route path='/detales/prideti' element={<PartCreate />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;