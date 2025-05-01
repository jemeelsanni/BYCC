import React, { useState } from 'react';
import Checkbox from '../ui/Checkbox';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, savedLocation } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await login(email, password);
            navigate(savedLocation || '/', { replace: true });
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to login';
            setError(errorMessage);
        }
    };

    return (
        <section className="py-12 md:py-16 lg:py-24">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
                        {/* Login Form */}
                        <div className="p-6 md:p-8 lg:p-10">
                            <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 manrope-font">
                                Login
                            </h1>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Error Message */}
                                {error && (
                                    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                                        {error}
                                    </div>
                                )}

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm md:text-base font-medium text-gray-700 manrope-font"
                                    >
                                        E-mail
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 border border-[#BD3A3A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BD3A3A] focus:border-transparent transition-all"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm md:text-base font-medium text-gray-700 manrope-font"
                                    >
                                        Password
                                    </label>
                                    <input
                                        type="password" /* Changed from text to password for security */
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-[#BD3A3A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BD3A3A] focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
                                    <Checkbox label="Remember me" />
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm md:text-base text-gray-700 hover:text-[#BD3A3A] transition-colors"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>

                                {/* Login Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-[#BD3A3A] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#a93434] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD3A3A] uppercase tracking-wide"
                                >
                                    Login
                                </button>
                            </form>
                        </div>

                        {/* Divider for Desktop */}
                        <div className="hidden lg:block lg:absolute lg:left-1/2 pt-72 lg:inset-y-8">
                            <div className="h-[65%] w-px bg-gray-200"></div>
                        </div>

                        {/* Create Account Section */}
                        <div className="p-6 md:p-8 lg:p-10 flex flex-col">
                            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 manrope-font">
                                Create an account
                            </h2>

                            <div className="text-center mb-8">
                                <p className="text-sm md:text-base text-gray-600">
                                    Create your customer account in just a few clicks! <br className="hidden md:block" />
                                    You can register using your e-mail address
                                </p>
                            </div>

                            <div className="mt-auto">
                                <Link
                                    to="/register"
                                    className="block w-full text-center bg-[#BD3A3A] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#a93434] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD3A3A] uppercase tracking-wide"
                                >
                                    Create an account via e-mail
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;