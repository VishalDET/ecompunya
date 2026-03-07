import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

const Profile = () => {
    const { user, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        fullname: user?.WebUserName || user?.fullname || '',
        emailId: user?.Email || user?.emailId || '',
        mobileNo: user?.MobileNo || user?.mobileNo || '',
        companyName: user?.CompanyName || user?.companyName || '',
        gstNumber: user?.GSTNumber || user?.gstNumber || '',
        shippingAddress: user?.ShippingAddress || user?.shippingAddress || '',
        city: user?.CityName || user?.cityName || '',
        state: user?.StateName || user?.stateName || '',
        pincode: user?.Pincode || user?.pincode || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Mapping to the expected API schema
            const updatePayload = {
                id: user.Id || user.id || 0,
                fullname: formData.fullname,
                emailId: formData.emailId,
                mobileNo: formData.mobileNo,
                companyName: formData.companyName,
                gstNumber: formData.gstNumber,
                shippingAddress: formData.shippingAddress,
                cityName: formData.city,
                stateName: formData.state,
                pincode: parseInt(formData.pincode) || 0,
                // These might be needed depending on the backend
                isGSTIN: !!formData.gstNumber,
                isActive: 1,
                modifiedDate: new Date().toISOString()
            };

            const response = await api.post('/UpdateProfile', updatePayload);

            if (response.data && (response.data.status_code === 100 || response.data.result === 1)) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                // Update the local auth context with new data
                login({ ...user, ...updatePayload, WebUserName: updatePayload.fullname });
            } else {
                setMessage({ type: 'error', text: response.data?.message || 'Failed to update profile.' });
            }
        } catch (error) {
            console.error("Profile Update Error", error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'An error occurred while updating profile.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Update your personal information and contact details.</p>
            </div>

            {message.text && (
                <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border ${message.type === 'success'
                        ? 'bg-green-50 text-green-700 border-green-100'
                        : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                    <span className="material-icons-outlined text-lg">
                        {message.type === 'success' ? 'check_circle' : 'error_outline'}
                    </span>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                        <input
                            required
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-punya-orange focus:border-punya-orange outline-none transition-all outline-none"
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Email Address *</label>
                        <input
                            required
                            type="email"
                            name="emailId"
                            value={formData.emailId}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-punya-orange focus:border-punya-orange outline-none transition-all outline-none"
                            placeholder="Email address"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Mobile Number *</label>
                        <input
                            required
                            type="tel"
                            name="mobileNo"
                            value={formData.mobileNo}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-punya-orange focus:border-punya-orange outline-none transition-all outline-none"
                            placeholder="10-digit mobile number"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Company / Shop Name</label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-punya-orange focus:border-punya-orange outline-none transition-all outline-none"
                            placeholder="Enter shop name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">GST Number</label>
                        <input
                            type="text"
                            name="gstNumber"
                            value={formData.gstNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-punya-orange focus:border-punya-orange outline-none transition-all outline-none uppercase"
                            placeholder="Enter GSTIN (optional)"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Pincode</label>
                        <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-punya-orange focus:border-punya-orange outline-none transition-all outline-none"
                            placeholder="6-digit pincode"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-punya-orange focus:border-punya-orange outline-none transition-all outline-none"
                            placeholder="Enter city"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">State</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-punya-orange focus:border-punya-orange outline-none transition-all outline-none"
                            placeholder="Enter state"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Full Address</label>
                    <textarea
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-punya-orange focus:border-punya-orange outline-none transition-all outline-none resize-none"
                        placeholder="Detailed address with landmarks"
                    />
                </div>

                <div className="pt-4 border-t border-gray-50 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-4 bg-punya-dark hover:bg-black text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        Save Profile Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
