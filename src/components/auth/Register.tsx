import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Register: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    // Field validation functions
    const validateName = (name: string): boolean => {
        return name.length >= 2;
    };

    const validateEmail = (email: string): boolean => {
        // Basic email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string): boolean => {
        // Password must be at least 8 characters long
        return password.length >= 8;
    };

    const validateForm = (): boolean => {
        // Reset error message
        setError('');

        // Validate first name
        if (!validateName(firstName)) {
            setError('First name should be at least 2 characters long');
            return false;
        }

        // Validate last name
        if (!validateName(lastName)) {
            setError('Last name should be at least 2 characters long');
            return false;
        }

        // Validate email
        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return false;
        }

        // Validate password
        if (!validatePassword(password)) {
            setError('Password should be at least 8 characters long');
            return false;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        return true;
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

            // Redirect to login after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create account';
            setError(errorMessage);
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

                            {/* Alert Messages */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
                                    <p className="text-sm md:text-base">{error}</p>
                                </div>
                            )}

                            {successMessage && (
                                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg" role="alert">
                                    <p className="text-sm md:text-base">{successMessage}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* First Name Field */}
                                <div className="space-y-2">
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
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full px-4 py-3 border border-[#BD3A3A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BD3A3A] focus:border-transparent transition-all"
                                        placeholder="John"
                                        required
                                    />
                                </div>

                                {/* Last Name Field */}
                                <div className="space-y-2">
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
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full px-4 py-3 border border-[#BD3A3A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BD3A3A] focus:border-transparent transition-all"
                                        placeholder="Doe"
                                        required
                                    />
                                </div>

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
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-[#BD3A3A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BD3A3A] focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Password must be at least 8 characters long
                                    </p>
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-2">
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
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-[#BD3A3A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BD3A3A] focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#BD3A3A] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#a93434] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD3A3A] uppercase tracking-wide mt-6 disabled:bg-[#BD3A3A]/70 disabled:cursor-not-allowed"
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