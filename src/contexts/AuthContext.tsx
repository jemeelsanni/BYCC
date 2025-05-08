/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, createContext, useContext } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../api/auth';
import { jwtDecode } from "jwt-decode";
import { AuthContextType, DecodedToken, LoginResponse, User } from '@/types';

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: false,
    login: async () => { },
    logout: () => { },
    register: async () => Promise.resolve(),
    isAuthenticated: false,
    isAdmin: false,
    savedLocation: null,
    saveLocation: () => { },
    loginWithRedirect: () => { }
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [savedLocation, setSavedLocation] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded = jwtDecode<DecodedToken>(token);
                    const currentTime = Date.now() / 1000;

                    if (decoded.exp > currentTime) {
                        // Token is valid
                        const userData = await getCurrentUser() as User;
                        setUser(userData);
                        setIsAuthenticated(true);

                        // Set admin status
                        setIsAdmin(decoded.isAdmin === true);
                    } else {
                        // Token expired
                        localStorage.removeItem('token');
                        setIsAuthenticated(false);
                    }
                } catch (error) {
                    console.error('Failed to load user:', error);
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        try {
            const response = await apiLogin(email, password) as LoginResponse;

            // Store token
            localStorage.setItem('token', response.token);

            // Set user
            setUser(response.user);
            setIsAuthenticated(true);

            // Decode token to check role
            const decoded = jwtDecode<DecodedToken>(response.token);
            setIsAdmin(decoded.isAdmin === true);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAdmin(false);
        setIsAuthenticated(false);
    };

    const saveLocation = (path: string) => {
        setSavedLocation(path);
    };

    const loginWithRedirect = () => {
        // Save current location and redirect to login
        if (window.location.pathname !== '/login') {
            saveLocation(window.location.pathname);
            window.location.href = '/login';
        }
    };

    const register = async (firstName: string, lastName: string, email: string, password: string): Promise<void> => {
        try {
            await apiRegister({
                firstName,
                lastName,
                email,
                password
            });
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            register,
            isAuthenticated,
            isAdmin,
            savedLocation,
            saveLocation,
            loginWithRedirect
        }}>
            {children}
        </AuthContext.Provider>
    );
};