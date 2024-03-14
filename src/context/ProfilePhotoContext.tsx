"use client";
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface ProfilePhotoContextType {
  profilePhoto: string;
  updateProfilePhoto: (newPhoto: string) => void;
}

const ProfilePhotoContext = createContext<ProfilePhotoContextType | undefined>(undefined);

export const useProfilePhoto = () => {
  const context = useContext(ProfilePhotoContext);
  if (context === undefined) {
    throw new Error('useProfilePhoto must be used within a ProfilePhotoProvider');
  }
  return context;
};

export const ProfilePhotoProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // Intenta obtener una foto de perfil almacenada del localStorage al inicializar
  const [profilePhoto, setProfilePhoto] = useState<string>(() => {
    // Usar '' como valor predeterminado si no hay nada en localStorage
    return localStorage.getItem('profilePhoto') || '';
  });

  const updateProfilePhoto = (newPhoto: string) => {
    setProfilePhoto(newPhoto);
    // Actualiza localStorage cada vez que se actualiza la foto de perfil
    localStorage.setItem('profilePhoto', newPhoto);
  };

  // Opcional: Limpia el localStorage cuando el usuario cierra sesión o se desmonta el componente
  useEffect(() => {
    return () => {
      // Podrías llamar a localStorage.removeItem('profilePhoto') aquí si deseas limpiar al desmontar
      // O manejarlo en tu lógica de cierre de sesión
    };
  }, []);

  return (
    <ProfilePhotoContext.Provider value={{ profilePhoto, updateProfilePhoto }}>
      {children}
    </ProfilePhotoContext.Provider>
  );
};
