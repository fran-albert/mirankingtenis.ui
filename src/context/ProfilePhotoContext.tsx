"use client"
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
  const [profilePhoto, setProfilePhoto] = useState<string>('');

  useEffect(() => {
    // Intenta obtener una foto de perfil almacenada del localStorage solo cuando el componente se monta en el cliente
    const storedProfilePhoto = localStorage.getItem('profilePhoto') || '';
    setProfilePhoto(storedProfilePhoto);
  }, []);

  const updateProfilePhoto = (newPhoto: string) => {
    setProfilePhoto(newPhoto);
    // Asegúrate de actualizar localStorage solo en el lado del cliente
    if (typeof window !== 'undefined') {
      localStorage.setItem('profilePhoto', newPhoto);
    }
  };

  return (
    <ProfilePhotoContext.Provider value={{ profilePhoto, updateProfilePhoto }}>
      {children}
    </ProfilePhotoContext.Provider>
  );
};
