import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        customerName: '',
        shopName: '',
        mobileNumber: '',
        state: '',
        district: '',
        pincode: '',
        city: '',
        address: '',
        gstNumber: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('../AddCustomer', formData);
            if (response.data && response.data.status_code === 100) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(response.data?.message || 'Signup failed. Please try again.');
            }
        } catch (err) {
            console.error("Signup Error", err);
            setError('An error occurred during signup. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center border border-green-100">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-icons-outlined text-4xl text-green-500">check_circle</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Signup Successful!</h2>
                    <p className="text-gray-500">Redirecting you to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
                    <p className="text-sm text-gray-500 mt-2">Join Punya Ethnic Wear today</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-8 text-sm flex items-center gap-3">
                        <span className="material-icons-outlined text-xl text-red-500">error_outline</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-1">
                        <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                        <input
                            required
                            type="text"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className="space-y-2 col-span-1">
                        <label className="text-sm font-semibold text-gray-700">Shop Name</label>
                        <input
                            type="text"
                            name="shopName"
                            value={formData.shopName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            placeholder="Enter shop name"
                        />
                    </div>

                    <div className="space-y-2 col-span-1">
                        <label className="text-sm font-semibold text-gray-700">Mobile Number *</label>
                        <input
                            required
                            type="tel"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            placeholder="10-digit mobile number"
                        />
                    </div>

                    <div className="space-y-2 col-span-1">
                        <label className="text-sm font-semibold text-gray-700">GST Number</label>
                        <input
                            type="text"
                            name="gstNumber"
                            value={formData.gstNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            placeholder="Enter GSTIN"
                        />
                    </div>

                    <div className="space-y-2 col-span-1">
                        <label className="text-sm font-semibold text-gray-700">State *</label>
                        <input
                            required
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            placeholder="e.g. Maharashtra"
                        />
                    </div>

                    <div className="space-y-2 col-span-1">
                        <label className="text-sm font-semibold text-gray-700">District *</label>
                        <input
                            required
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            placeholder="e.g. Mumbai"
                        />
                    </div>

                    <div className="space-y-2 col-span-1">
                        <label className="text-sm font-semibold text-gray-700">City *</label>
                        <input
                            required
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            placeholder="Enter city"
                        />
                    </div>

                    <div className="space-y-2 col-span-1">
                        <label className="text-sm font-semibold text-gray-700">Pincode *</label>
                        <input
                            required
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            placeholder="6-digit pincode"
                        />
                    </div>

                    <div className="space-y-2 col-span-2">
                        <label className="text-sm font-semibold text-gray-700">Address *</label>
                        <textarea
                            required
                            name="address"
                            rows="3"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                            placeholder="Full postal address"
                        />
                    </div>

                    <div className="col-span-2 mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                        >
                            {loading ? (
                                <span className="flex items-center gap-3">
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : 'Create Account'}
                        </button>

                        <p className="text-center mt-6 text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary font-bold hover:underline">
                                Log in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
