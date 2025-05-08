import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

type ErrorState = {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
};

const Register: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<ErrorState>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const validateForm = (): boolean => {
        const newErrors: ErrorState = {};
        let isValid = true;

        // Validate first name
        if (!firstName.trim()) {
            newErrors.firstName = 'First name is required';
            isValid = false;
        } else if (firstName.trim().length < 2) {
            newErrors.firstName = 'First name should be at least 2 characters';
            isValid = false;
        }

        // Validate last name
        if (!lastName.trim()) {
            newErrors.lastName = 'Last name is required';
            isValid = false;
        } else if (lastName.trim().length < 2) {
            newErrors.lastName = 'Last name should be at least 2 characters';
            isValid = false;
        }

        // Validate email
        if (!email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        // Validate password
        if (!password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
            isValid = false;
        }

        // Validate confirm password
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
            isValid = false;
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const clearFieldError = (field: keyof ErrorState) => {
        if (errors[field]) {
            setErrors({ ...errors, [field]: undefined });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            await register(firstName, lastName, email, password);
            setSuccessMessage('Account created successfully! Redirecting to login...');

            // Clear form
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setErrors({});

            // Redirect to login after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: unknown) {
            // Handle specific registration errors
            if (err instanceof Error) {
                const errorMessage = err.message.toLowerCase();

                if (errorMessage.includes('email already in use') || errorMessage.includes('already exists')) {
                    setErrors({ email: 'This email is already registered' });
                } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
                    setErrors({ general: 'Network error. Please check your connection and try again.' });
                } else if (errorMessage.includes('weak password')) {
                    setErrors({ password: 'Password is too weak. Please choose a stronger password.' });
                } else {
                    setErrors({ general: err.message });
                }
            } else {
                setErrors({ general: 'Failed to create account. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-12 md:py-16 lg:py-24">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
                        {/* Register Form */}
                        <div className="p-6 md:p-8 lg:p-10">
                            <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 manrope-font">
                                Create an Account
                            </h1>

                            {/* Success Message */}
                            {successMessage && (
                                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-start" role="alert">
                                    <svg className="w-5 h-5 inline mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>{successMessage}</span>
                                </div>
                            )}

                            {/* General Error Message */}
                            {errors.general && (
                                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start" role="alert">
                                    <svg className="w-5 h-5 inline mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>{errors.general}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* First Name Field */}
                                <div className="space-y-1">
                                    <label
                                        htmlFor="firstName"
                                        className="block text-sm md:text-base font-medium text-gray-700 manrope-font"
                                    >
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        value={firstName}
                                        onChange={(e) => {
                                            setFirstName(e.target.value);
                                            clearFieldError('firstName');
                                        }}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.firstName
                                                ? 'border-red-500 focus:ring-red-500 bg-red-50'
                                                : 'border-[#BD3A3A] focus:ring-[#BD3A3A] focus:border-transparent'
                                            }`}
                                        placeholder="John"
                                        required
                                    />
                                    {errors.firstName && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                                            </svg>
                                            {errors.firstName}
                                        </p>
                                    )}
                                </div>

                                {/* Last Name Field */}
                                <div className="space-y-1">
                                    <label
                                        htmlFor="lastName"
                                        className="block text-sm md:text-base font-medium text-gray-700 manrope-font"
                                    >
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        value={lastName}
                                        onChange={(e) => {
                                            setLastName(e.target.value);
                                            clearFieldError('lastName');
                                        }}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.lastName
                                                ? 'border-red-500 focus:ring-red-500 bg-red-50'
                                                : 'border-[#BD3A3A] focus:ring-[#BD3A3A] focus:border-transparent'
                                            }`}
                                        placeholder="Doe"
                                        required
                                    />
                                    {errors.lastName && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                                            </svg>
                                            {errors.lastName}
                                        </p>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div className="space-y-1">
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
                                            clearFieldError('email');
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
                                <div className="space-y-1">
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
                                            clearFieldError('password');
                                        }}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.password
                                                ? 'border-red-500 focus:ring-red-500 bg-red-50'
                                                : 'border-[#BD3A3A] focus:ring-[#BD3A3A] focus:border-transparent'
                                            }`}
                                        placeholder="••••••••"
                                        required
                                    />
                                    {errors.password ? (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                                            </svg>
                                            {errors.password}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Password must be at least 8 characters long
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-1">
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm md:text-base font-medium text-gray-700 manrope-font"
                                    >
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            clearFieldError('confirmPassword');
                                        }}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword
                                                ? 'border-red-500 focus:ring-red-500 bg-red-50'
                                                : 'border-[#BD3A3A] focus:ring-[#BD3A3A] focus:border-transparent'
                                            }`}
                                        placeholder="••••••••"
                                        required
                                    />
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                                            </svg>
                                            {errors.confirmPassword}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full font-bold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD3A3A] uppercase tracking-wide mt-6 ${loading
                                            ? 'bg-[#d78080] cursor-not-allowed text-white'
                                            : 'bg-[#BD3A3A] text-white hover:bg-[#a93434]'
                                        }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating Account...
                                        </span>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Divider for Desktop */}
                        <div className="hidden lg:block pt-36 lg:absolute lg:left-1/2 lg:inset-y-0">
                            <div className="h-[70%] w-px bg-gray-200"></div>
                        </div>

                        {/* Login Section */}
                        <div className="p-6 md:p-8 lg:p-10 flex flex-col">
                            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 manrope-font">
                                Already have an account?
                            </h2>

                            <div className="text-center mb-6">
                                <p className="text-sm md:text-base text-gray-600">
                                    If you already have an account, please log in <br className="hidden md:block" />
                                    to access your profile and order history.
                                </p>
                            </div>

                            <div className="mt-auto">
                                <Link
                                    to="/login"
                                    className="block w-full text-center bg-[#BD3A3A] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#a93434] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD3A3A] uppercase tracking-wide"
                                >
                                    Login to your account
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;