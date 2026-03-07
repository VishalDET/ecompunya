import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Account = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Redirect to login if not authenticated
    React.useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) return null;

    const menuItems = [
        { path: '/account', label: 'Dashboard', icon: 'dashboard' },
        { path: '/account/profile', label: 'Profile Settings', icon: 'person' },
        { path: '/account/orders', label: 'My Orders', icon: 'shopping_bag' },
        { path: '/wishlist', label: 'My Wishlist', icon: 'favorite' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 bg-punya-dark text-white">
                                <h2 className="text-xl font-bold truncate">Hi, {user.WebUserName || user.fullname}</h2>
                                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Active Member</p>
                            </div>

                            <nav className="p-4 space-y-1">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive(item.path)
                                                ? 'bg-orange-50 text-punya-orange shadow-sm'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <span className="material-icons-outlined text-xl">{item.icon}</span>
                                        {item.label}
                                    </Link>
                                ))}

                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all duration-200 mt-4"
                                >
                                    <span className="material-icons-outlined text-xl">logout</span>
                                    Logout
                                </button>
                            </nav>
                        </div>

                        {/* Support Card */}
                        <div className="mt-6 bg-gradient-to-br from-orange-400 to-punya-orange p-6 rounded-2xl text-white shadow-lg overflow-hidden relative">
                            <div className="relative z-10">
                                <h3 className="font-bold text-lg mb-2">Need help?</h3>
                                <p className="text-sm opacity-90 mb-4">Our support team is available 24/7 for you.</p>
                                <Link to="/contact" className="inline-block bg-white text-punya-orange px-4 py-2 rounded-lg text-xs font-bold shadow-sm">
                                    Contact Support
                                </Link>
                            </div>
                            <span className="material-icons-outlined absolute -bottom-4 -right-4 text-8xl opacity-10 rotate-12">support_agent</span>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 min-h-[600px]">
                            {location.pathname === '/account' ? (
                                <div>
                                    <div className="mb-8">
                                        <h1 className="text-2xl font-bold text-gray-900">Account Dashboard</h1>
                                        <p className="text-sm text-gray-500 mt-1">Manage your profile, view orders, and more.</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[
                                            { label: 'Total Orders', value: '0', icon: 'shopping_bag', color: 'bg-blue-50 text-blue-600', link: '/account/orders' },
                                            { label: 'Wishlist Items', value: '0', icon: 'favorite', color: 'bg-red-50 text-red-600', link: '/wishlist' },
                                            { label: 'Account Created', value: new Date(user.CreatedDate || Date.now()).toLocaleDateString(), icon: 'event', color: 'bg-green-50 text-green-600', link: '/account/profile' },
                                        ].map((stat, i) => (
                                            <Link key={i} to={stat.link} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                                                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                                                    <span className="material-icons-outlined text-2xl">{stat.icon}</span>
                                                </div>
                                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="mt-10 pt-8 border-t border-gray-50">
                                        <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activities</h2>
                                        <div className="bg-gray-50 rounded-2xl p-10 text-center">
                                            <span className="material-icons-outlined text-4xl text-gray-300 mb-3">history</span>
                                            <p className="text-gray-500 text-sm">No recent activities found.</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Outlet />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
