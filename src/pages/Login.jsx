import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [mobileOrEmail, setMobileOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const from = location.state?.from?.pathname || '/';

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!mobileOrEmail || !password) {
            setError('Please enter both mobile and password.');
            return;
        }

        try {
            setLoading(true);

            const loginPayload = {
                id: 0,
                username: null,
                fullname: null,
                password: password,
                firstName: null,
                lastName: null,
                createdDate: new Date().toISOString(),
                isActive: 1,
                mobileNo: mobileOrEmail,
                type: null,
                result: 0,
                otp: null,
                natureOfBusiness: null,
                emailId: null,
                isGSTIN: null,
                gstNumber: null,
                shippingAddress: null,
                cityName: null,
                companyName: null,
                showAddress: null,
                stateId: 0,
                cityId: 0,
                userType: 0
            };

            const response = await api.post('/VerifyOTP', loginPayload);

            // Check for success based on typical API patterns in this project (status_code 100 or result 1)
            if (response.data && (response.data.status_code === 100 || response.data.result === 1)) {
                login(response.data);
                navigate(from, { replace: true });
            } else {
                setError(response.data?.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error("Login Error", err);
            setError(err.response?.data?.message || 'An error occurred during login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 transition-all">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
                    <p className="text-sm text-gray-500 mt-2">Login or sign up to continue</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm text-center font-medium shadow-sm flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="MobileOrEmail" className="block text-sm font-semibold text-gray-700 mb-2">Mobile or Email</label>
                        <input
                            type="text"
                            id="MobileOrEmail"
                            value={mobileOrEmail}
                            onChange={(e) => setMobileOrEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-punya-orange focus:border-punya-orange outline-none transition-shadow text-gray-800 bg-gray-50 focus:bg-white"
                            placeholder="Enter your mobile or email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password / OTP</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-punya-orange focus:border-punya-orange outline-none transition-shadow text-gray-800 bg-gray-50 focus:bg-white"
                            placeholder="Enter password or OTP"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-punya-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-punya-orange transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </span>
                        ) : 'Send / Login'}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-punya-orange font-bold hover:underline">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
