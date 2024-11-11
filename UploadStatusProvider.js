import React, { createContext, useState, useContext } from 'react';

// Create a context
const UploadStatusContext = createContext();

// Create a provider component
export const UploadStatusProvider = ({ children }) => {
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadedNotes, setUploadedNotes] = useState([]); // Add uploaded notes state


  return (
    <UploadStatusContext.Provider 
    value={{ 
      isUploaded, 
      setIsUploaded, 
      uploadedNotes, 
      setUploadedNotes,
        }}>
      {children}
    </UploadStatusContext.Provider>
  );
};

// Custom hook to use the upload status context
export const useUploadStatus = () => {
  const context = useContext(UploadStatusContext);
  
  // Ensure the context is not undefined
  if (context === undefined) {
    throw new Error('useUploadStatus must be used within an UploadStatusProvider');
  }

  return context;
};
