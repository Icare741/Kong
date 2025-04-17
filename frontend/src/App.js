import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { authService } from './services/authService';

function App() {
    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        return !!token;
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/dashboard"
                        element={
                            isAuthenticated() ? (
                                <Dashboard />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                    <Route
                        path="/"
                        element={
                            isAuthenticated() ? (
                                <Navigate to="/dashboard" />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App; 