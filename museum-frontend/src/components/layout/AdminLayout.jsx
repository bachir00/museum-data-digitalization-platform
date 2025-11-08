import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
    HomeIcon, 
    BuildingOfficeIcon, 
    PhotoIcon, 
    ArrowRightOnRectangleIcon,
    UserIcon 
} from '@heroicons/react/24/outline';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
        { name: 'Salles', href: '/admin/rooms', icon: BuildingOfficeIcon },
        { name: 'Œuvres', href: '/admin/artworks', icon: PhotoIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform transition-transform duration-200 ease-in-out">
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-16 px-4 bg-gray-900 border-b border-gray-700">
                        <h1 className="text-xl font-bold text-yellow-400">Admin Musée</h1>
                    </div>

                    {/* User info */}
                    <div className="flex items-center px-4 py-3 bg-gray-700 border-b border-gray-600">
                        <UserIcon className="h-8 w-8 text-gray-300 mr-3" />
                        <div>
                            <p className="text-sm font-medium text-white">{user?.username}</p>
                            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-2 py-4 space-y-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                                        isActive
                                            ? 'bg-yellow-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    <item.icon
                                        className={`mr-3 h-5 w-5 ${
                                            isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                        }`}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout button */}
                    <div className="px-2 pb-4">
                        <button
                            onClick={handleLogout}
                            className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-red-700 hover:text-white transition-colors duration-150"
                        >
                            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
                            Déconnexion
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="pl-64">
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;