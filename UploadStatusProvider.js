// import React, { createContext, useState, useContext , useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';


// // Create a context
// const UploadStatusContext = createContext();

// // Create a provider component
// export const UploadStatusProvider = ({ children }) => {
//   const [isUploaded, setIsUploaded] = useState(false);
//   const [uploadedNotes, setUploadedNotes] = useState([]); // Add uploaded notes state
//   const [projects, setProjects] = useState([]);


//   // Load projects from AsyncStorage when the app starts
//   useEffect(() => {
//     const loadProjects = async () => {
//       try {
//         const storedProjects = await AsyncStorage.getItem('projects');
//         if (storedProjects) {
//           setProjects(JSON.parse(storedProjects));
//         }
//       } catch (error) {
//         console.error('Error loading projects from AsyncStorage:', error);
//       }
//     };

//     loadProjects();
//   }, []);

//   // Save projects to AsyncStorage whenever they change
//   useEffect(() => {
//     const saveProjects = async () => {
//       try {
//         await AsyncStorage.setItem('projects', JSON.stringify(projects));
//       } catch (error) {
//         console.error('Error saving projects to AsyncStorage:', error);
//       }
//     };

//     saveProjects();
//   }, [projects]);

  
//   const addProject = (newProject) => {
//     console.log("Adding new project:", newProject); // Log the new project data
//     setProjects((prevProjects) => {
//       const updatedProjects = [...prevProjects, newProject];
//       console.log("Updated projects:", updatedProjects); // Log the updated projects array
//       return updatedProjects;
//     });
//   };

//   const updateProjectUploadStatus = (projectId, isUploaded) => {
//     setProjects((prevProjects) => {
//       const updatedProjects = prevProjects.map(project => 
//         project.id === projectId ? { ...project, isUploaded } : project
//       );
//       return updatedProjects;
//     });
//   };

//   useEffect(() => {
//     console.log("Current projects in context:", projects); // Log current projects whenever they change
//   }, [projects]);


//   return (
//     <UploadStatusContext.Provider 
//     value={{ 
//       isUploaded, 
//       setIsUploaded, 
//       uploadedNotes, 
//       setUploadedNotes,
//       projects, 
//       addProject,
//       setProjects,
//       updateProjectUploadStatus, 
//         }}>
//       {children}
//     </UploadStatusContext.Provider>
//   );
// };

// // Custom hook to use the upload status context
// export const useUploadStatus = () => {
//   const context = useContext(UploadStatusContext);
  
//   // Ensure the context is not undefined
//   if (context === undefined) {
//     throw new Error('useUploadStatus must be used within an UploadStatusProvider');
//   }

//   return context;
// };




import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a context
const UploadStatusContext = createContext();

// Create a provider component
export const UploadStatusProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [uploadedNotes, setUploadedNotes] = useState([]); // Add uploaded notes state

  // Load projects from AsyncStorage when the app starts
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const storedProjects = await AsyncStorage.getItem('projects');
        if (storedProjects) {
          setProjects(JSON.parse(storedProjects));
        }
      } catch (error) {
        console.error('Error loading projects from AsyncStorage:', error);
      }
    };

    loadProjects();
  }, []);

  // Save projects to AsyncStorage whenever they change
  useEffect(() => {
    const saveProjects = async () => {
      try {
        await AsyncStorage.setItem('projects', JSON.stringify(projects));
      } catch (error) {
        console.error('Error saving projects to AsyncStorage:', error);
      }
    };

    saveProjects();
  }, [projects]);

  // Add a new project to the list of projects
  const addProject = (newProject) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

  // Update the upload status of a specific project
  const updateProjectUploadStatus = (projectId, isUploaded) => {
    setProjects((prevProjects) => {
      const updatedProjects = prevProjects.map((project) =>
        project.id === projectId ? { ...project, isUploaded } : project
      );
      return updatedProjects;
    });
  };

  // Retrieve the upload status for a specific project by its ID
  const getProjectStatus = (projectId) => {
    const project = projects.find((project) => project.id === projectId);
    return project ? project.isUploaded : false;
  };

  return (
    <UploadStatusContext.Provider 
      value={{ 
        projects,
        addProject,
        updateProjectUploadStatus,
        getProjectStatus,
        uploadedNotes, 
        setUploadedNotes,
      }}
    >
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
