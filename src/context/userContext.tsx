import React, { createContext, useState, useContext } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [nomeUsuario, setNomeUsuario] = useState('');

    return (
        <UserContext.Provider value={{ nomeUsuario, setNomeUsuario }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
