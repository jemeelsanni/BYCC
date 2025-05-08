import React, { useState } from 'react';
import Checkbox from '../ui/Checkbox';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

type ErrorState = {
    email?: string;
    password?: string;
    general?: string;
};

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<ErrorState>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, savedLocation } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors: ErrorState = {};
        let valid = true;

        // Email validation
        if (!email) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
            valid = false;
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required';
            valid = false;
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setErrors({});

        try {
            await login(email, password);
            navigate(savedLocation || '/', { replace: true });
        } catch (err: unknown) {
            // Handle specific error types
            if (err instanceof Error) {
                const errorMessage = err.message.toLowerCase();

                if (errorMessage.includes('user not found') || errorMessage.includes('no user')) {
                    setErrors({ email: 'No account found with this email' });
                } else if (errorMessage.includes('wrong password') || errorMessage.includes('incorrect password')) {
                    setErrors({ password: 'Incorrect password' });
                } else if (errorMessage.includes('too many attempts') || errorMessage.includes('temporarily disabled')) {
                    setErrors({ general: 'Too many failed attempts. Try again later.' });
                } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
                    setErrors({ general: 'Network error. Check your connection and try again.' });
                } else {
                    setErrors({ general: err.message });
                }
            } else {
                setErrors({ general: 'An unexpected error occurred. Please try again.' });
            }
        } finally {
            setIsSubmitting(false);
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
                                {/* General Error Message */}
                                {errors.general && (
                                    <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg flex items-start" role="alert">
                                        <svg className="w-5 h-5 inline mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                                        </svg>
                                        <span>{errors.general}</span>
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
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (errors.email) {
                                                setErrors({ ...errors, email: undefined });
                                            }
                                        }}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.email
                                                ? 'border-red-500 focus:ring-red-500 bg-red-50'
                                                : 'border-[#BD3A3A] focus:ring-[#BD3A3A] focus:border-transparent'
                                            }`}
                                        placeholder="your@email.com"
                                        required
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                                            </svg>
                                            {errors.email}
                                        </p>
                                    )}
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
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (errors.password) {
                                                setErrors({ ...errors, password: undefined });
                                            }
                                        }}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.password
                                                ? 'border-red-500 focus:ring-red-500 bg-red-50'
                                                : 'border-[#BD3A3A] focus:ring-[#BD3A3A] focus:border-transparent'
                                            }`}
                                        placeholder="••••••••"
                                        required
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                                            </svg>
                                            {errors.password}
                                        </p>
                                    )}
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
                                    disabled={isSubmitting}
                                    className={`w-full font-bold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD3A3A] uppercase tracking-wide
                                    ${isSubmitting
                                            ? 'bg-[#d78080] cursor-not-allowed text-white'
                                            : 'bg-[#BD3A3A] text-white hover:bg-[#a93434]'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </div>
                                    ) : 'Login'}
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