import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Virtual/AuthProvider'; // Use the hook instead of AuthContext
import logo from '../compnents/Images/logo.png';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth(); // Using useAuth hook
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_BACKEND_URL;

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.post(`${baseUrl}/login/`, { username, password });
            const { access, refresh, user } = response.data;
    
            // Store tokens in localStorage
            localStorage.setItem('token', access);
            localStorage.setItem('refresh', refresh);
    
            // User object for AuthContext
            const userObj = { username: user.username, email: user.email };
    
            // Login via context (useAuth hook)
            login(access, userObj);
    
            // Redirect to home
            navigate('/home', { state: { user: userObj } });
        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid Credentials');
        } finally {
            setIsLoading(false);
        }
    };
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="container d-flex align-items-center justify-content-center vh-100 bg-light">
            <div
                className="card shadow-lg border-0"
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    borderRadius: '15px',
                    overflow: 'hidden',
                }}
            >
                <div
                    className="card-header text-center text-white"
                    style={{
                        background: 'linear-gradient(45deg, #00bcd4, #00838f)',
                    }}
                >
                    <img
                        src={logo}
                        alt="Business Logo"
                        className={`img-fluid mb-3 rounded-circle ${isLoading ? 'spinning' : ''}`}
                        style={{
                            maxWidth: '70px',
                            border: '3px solid white',
                            transition: 'transform 0.8s ease',
                        }}
                    />
                    <h5 className="mb-0">School Management System</h5>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="username" className="form-label">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="form-control"
                                placeholder="Enter your username"
                            />
                        </div>
                        <div className="mb-4 position-relative">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="form-control"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={togglePasswordVisibility}
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>
                        {error && <div className="alert alert-danger text-center">{error}</div>}
                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={isLoading}
                            style={{
                                background: 'linear-gradient(45deg, #00bcd4, #00838f)',
                                border: 'none',
                                fontWeight: 'bold',
                                fontSize: '16px',
                            
                            }}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
                <div className="card-footer text-center bg-light">
                    <Link to="/forgot-password" className="text-primary">
                        Forgot password?
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
