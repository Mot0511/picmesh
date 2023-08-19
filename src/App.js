import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Reg from "./pages/reg";
import cl from "./App.module.css";

const App = () => {
    return (
        <div className={cl.container}>
            <BrowserRouter>
                <Routes>
                    <Route path={'/'} element={<Home />}/>
                    <Route path={'/login'} element={<Login />}/>
                    <Route path={'/signup'} element={<Reg />}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;