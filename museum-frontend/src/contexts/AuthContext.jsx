import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Fonction pour vérifier si l'utilisateur est connecté
    const checkAuth = async () => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            try {
                // prend l'url de l'API depuis les variables d'environnement
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/me`, {
                    headers: {
                        'Authorization': `Bearer ${savedToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    setToken(savedToken);
                } else {
                    // Token invalide
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            } catch (error) {
                console.error('Erreur lors de la vérification de l\'authentification:', error);
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            }
        }
        setLoading(false);
    };

    // Fonction de connexion
    const login = async (username, password) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.access_token);
                setToken(data.access_token);
                setUser(data.user);
                return { success: true };
            } else {
                return { success: false, message: data.msg || 'Erreur de connexion' };
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            return { success: false, message: 'Erreur de connexion au serveur' };
        }
    };

    // Fonction de déconnexion
    const logout = async () => {
        try {
            if (token) {
                await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        } finally {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        }
    };

    // Fonction pour faire des requêtes authentifiées
    const authenticatedFetch = async (url, options = {}) => {
        const currentToken = localStorage.getItem('token');
        
        if (!currentToken) {
            throw new Error('No authentication token');
        }

        const config = {
            ...options,
            headers: {
                'Authorization': `Bearer ${currentToken}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        const response = await fetch(url, config);

        if (response.status === 401) {
            // Token expiré ou invalide
            logout();
            throw new Error('Authentication expired');
        }

        return response;
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        authenticatedFetch,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};