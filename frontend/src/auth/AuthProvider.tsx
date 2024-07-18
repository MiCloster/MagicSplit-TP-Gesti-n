import React, { useContext, createContext, useState, useEffect } from "react";

// Define la interfaz para el usuario
interface User {
    status: boolean;
    token: string;
    id: any;
    email: any;
    name: any;
}

// Define la interfaz para el contexto de autenticación
interface AuthContextType {
    isAuthenticated: boolean;
    getToken: () => string;
    saveUser: (userData: User) => void;
    signOut: () => void;
    handleUpdateUserBalance: () => void;
    getUserId: () => any;
    getUserEmail: () => any;
    getUserName: () => any;
    getUserBalance: () => any;
    isUserDataLoaded: boolean;
}

// Crea el contexto de autenticación
const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    getToken: () => "",
    saveUser: () => {},
    signOut: () => {},
    handleUpdateUserBalance: () => {},
    getUserId: () => {},
    getUserEmail: () => {},
    getUserName: () => {},
    getUserBalance: () => {},
    isUserDataLoaded: false,
});

// Componente proveedor de autenticación
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [isUserDataLoaded, setIsUserDataLoaded] = useState(false); // Nuevo estado para controlar la carga de datos del usuario
    const [balanceTotal, setBalanceTotal] = useState(0);
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(JSON.parse(storedToken));
            setIsAuthenticated(true);
            fetchUserInfo(JSON.parse(storedToken));
            fetchBalance(JSON.parse(storedToken));
        }
    }, [token]);

    async function fetchUserInfo(token: string) {
        try {
            const response = await fetch("https://magicsplitapi-production.up.railway.app/api/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchBalance(token:string) {
        fetch(`https://magicsplitapi-production.up.railway.app/api/user/balance`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          })
          .then(response => response.json())
          .then(data => {
            setBalanceTotal(data.balance)
            setIsUserDataLoaded(true);
          })
          .catch(error => console.error('Error fetching data:', error));
    }

    function getToken() {
        return token;
    }

    function saveUser(userData: User) {
        setToken(userData.token);
        localStorage.setItem("token", JSON.stringify(userData.token));
        setIsAuthenticated(userData.status);
        fetchUserInfo(userData.token); // Obtener la información del usuario después de iniciar sesión
    }

    function getUserId() {
        return user?.id;
    }

    function getUserEmail() {
        return user?.email;
    }

    function getUserName() {
        return user?.name;
    }

    function getUserBalance() {
        return balanceTotal;
    }

    function signOut() {
        setIsAuthenticated(false);
        setToken("");
        setUser(null);
        setIsUserDataLoaded(false); // Reiniciar el estado de carga de datos del usuario al cerrar sesión
        localStorage.removeItem("token");
    }

    function handleUpdateUserBalance(){
        fetchBalance(token);
    }

    const value = {
        isAuthenticated,
        getToken,
        saveUser,
        signOut,
        handleUpdateUserBalance,
        user,
        getUserId,
        getUserEmail,
        getUserName,
        getUserBalance,
        isUserDataLoaded,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);
