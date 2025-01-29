// import React, { useState, useCallback } from 'react'; 
//  import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Dimensions } from 'react-native';
//  import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
//  import Icon from 'react-native-vector-icons/MaterialIcons';
//  import { useUploadStatus } from '../../ContextAPI/UploadStatusProvider';
//  import firestore from '@react-native-firebase/firestore';
//  import auth from '@react-native-firebase/auth'; // Import Firebase auth
//  import AsyncStorage from '@react-native-async-storage/async-storage';
 
//  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
 
//  const ProjectDetails = () => {
//    const navigation = useNavigation();
//    const route = useRoute();
//    const { projects, updateProjectUploadStatus, uploadedNotes, setUploadedNotes } = useUploadStatus();
//    const { projectId } = route.params;
//    const [project, setProject] = useState(null);
//    const [showFullDescription, setShowFullDescription] = useState(false);
 
//    const toggleDescription = () => {
//      setShowFullDescription(!showFullDescription);
//    };
 
//    const getUserEmail = () => {
//      const user = auth().currentUser;
//      return user ? user.email : null;
//    };

//    const loadProjectDetails = async () => {
//      try {
//        console.log('Loading project details...');
//        const userEmail = getUserEmail();
//        if (!userEmail) {
//          console.error('No logged-in user email found.');
//          return;
//        }
//        console.log('User email:', userEmail);
   
//        // Firestore reference for the project
//        const projectRef = firestore()
//          .collection('UserInformation')
//          .doc(userEmail)
//          .collection('Allocated Project')
//          .doc(projectId);
   
//        // Try to fetch the project details from Firestore
//        const projectDoc = await projectRef.get();
//        if (projectDoc.exists) {
//          const projectData = projectDoc.data();
//          console.log('Fetched project data:', projectData);
//          setProject(projectData);
//        } else {
//          console.error('Project not found in Firestore for the given ID.');
//        }
   
//        // Fetch notes from Firestore
//        const notesSnapshot = await projectRef.collection('Uploaded Note').get();
//        if (!notesSnapshot.empty) {
//          const notes = notesSnapshot.docs.map(doc => doc.data());
//          console.log('Fetched notes from Firestore:', notes);
//          setUploadedNotes(notes);
   
//          // Sync fetched notes with AsyncStorage
//          await AsyncStorage.setItem(projectId, JSON.stringify(notes));
//          console.log('Notes synced with AsyncStorage.');
//        } else {
//          console.log('No notes found in Firestore. Fetching from AsyncStorage...');
   
//          // Fetch notes from AsyncStorage if Firestore has no notes
//          const storedNotes = await AsyncStorage.getItem(projectId);
//          const notes = storedNotes ? JSON.parse(storedNotes) : [];
//          console.log('Fetched notes from AsyncStorage:', notes);
//          setUploadedNotes(notes);
//        }
//      } catch (error) {
//        console.error('Error loading project details:', error);
//      }
//    };
   

  
 
//    // Reload project details whenever the screen comes into focus
//    useFocusEffect(
//      useCallback(() => {
//        loadProjectDetails();
//      }, [projectId])
//    );
 
//    const handleNotePress = note => {
//     const { projectName } = project;
//      if (project.isUploaded) {
//        navigation.navigate('UploadedNoteScreen', {
//          note,
//          noteSerial: note.Serial,
//          projectId,
//        });
//      } else {
//      // const formattedNoteSerial2 = parseInt(note.Serial.replace(/[^\d]/g, ''), 10);
//      const formattedNoteSerial2 = note.Serial.replace(/[^\d]/g, '').slice(-1);
//       console.log('serial2:',formattedNoteSerial2)
//        navigation.navigate('CollectScreen', {
//          note,
//          projectId,
//          country: project.country,
//          noteSerial2: formattedNoteSerial2,
//          projectName
//        });
//      }
//    };
 
//    const handleAddNotesPress = () => {
//     const { projectName } = project;
//      const noteSerial = uploadedNotes.length + 1;
//      navigation.navigate('CollectScreen', {
//        projectId,
//        noteSerial,
//        country: project.country,
//        projectName
       
//      });
//      console.log(`Project Name: ${projectName}`);
//    };
 
//    const handleUploadNotesPress = async () => {
//      const userEmail = getUserEmail();
//      if (!userEmail) {
//        console.error('No logged-in user email found.');
//        return;
//      }
   
//      try {
//        // Update local state to mark notes as uploaded
//        const updatedNotes = uploadedNotes.map(note => ({ ...note, isUploaded: true }));
//        setUploadedNotes(updatedNotes);
   
//        // Firestore reference for the project
//        const projectRef = firestore()
//          .collection('UserInformation')
//          .doc(userEmail)
//          .collection('Allocated Project')
//          .doc(projectId);
   
//        // Upload notes to Firestore
//        const batch = firestore().batch();
//        updatedNotes.forEach(note => {
//          const noteRef = projectRef.collection('Uploaded Note').doc(note.Serial.toString());
//          batch.set(noteRef, note); // Upload note data using Serial as document ID
//        });
   
//        await batch.commit(); // Commit all Firestore operations
//        console.log('Notes uploaded to Firestore successfully.');
   
//        // Update project upload status locally and in Firestore
//        await projectRef.update({ isUploaded: true });
//        updateProjectUploadStatus(projectId, true);
   
//        // Sync with AsyncStorage
//        const updatedProjects = projects.map(proj =>
//          proj.id === projectId ? { ...proj, isUploaded: true } : proj
//        );
//        await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));
//        await AsyncStorage.setItem(projectId, JSON.stringify(updatedNotes));
   
//        setProject(prev => ({ ...prev, isUploaded: true }));
//        console.log('Local and Firestore upload status updated.');
//      } catch (error) {
//        console.error('Error uploading notes:', error);
//      }
//    };
   
 
//    const formatDate = dateString => {
//      const date = new Date(dateString);
//      return date.toLocaleDateString('en-US', {
//        year: 'numeric',
//        month: 'short',
//        day: 'numeric',
//      });
//    };
 
//    if (!project) {
//      return (
//        <View style={styles.container}>
//          <Text style={styles.loadingText}>Loading Project Details...</Text>
//        </View>
//      );
//    }
 
 
//    return (
//      <ScrollView style={styles.container}>
//        <View style={styles.headerContainer}>
//          <TouchableOpacity onPress={() => navigation.navigate('Home2')} style={styles.backIconContainer}>
//            <Text style={styles.backIcon}>{'\u2039'}</Text>
//          </TouchableOpacity>
//          <Text style={styles.projectId}>{project.projectName}</Text>
//        </View>
 
//        <View style={styles.locationSection}>
//          <Text style={styles.location}>
//            {project.cityName}, {project.country}
//          </Text>
//          <Text style={styles.dateRange}>
//            {formatDate(project.fromDate)} - {formatDate(project.toDate)}
//          </Text>
//        </View>
 
//        <View style={styles.teamSection}>
//          <Text style={styles.teamLabel}>Team</Text>
//          <Text style={styles.teamMembers}>
//            {Array.isArray(project.habitats) ? project.habitats.join(' , ') : project.habitats}
//          </Text>
//        </View>
 
//        <View style={styles.descriptionSection}>
//          <Text style={styles.teamLabel}>Description:</Text>
//          <Text style={styles.teamMembers}>
//            {showFullDescription ? project.description : `${project.description.substring(0, 100)}`}
//            <Text style={styles.toggleText} onPress={toggleDescription}>
//              {showFullDescription ? '   ......less' : '  .....more'}
//            </Text>
//          </Text>
//        </View>
 
//        <View style={styles.fieldNotesSection}>
//          <Text style={styles.fieldNotesLabel}>Field Notes</Text>
//          {(uploadedNotes || []).length > 0 ? (
//            <FlatList
//              data={uploadedNotes}
//              renderItem={({ item }) => (
//                <TouchableOpacity
//                  style={styles.noteEntry}
//                  onPress={() => handleNotePress(item)}>
//                  <View style={styles.noteInfo}>
//                    <Text style={styles.noteDate}>{item.Serial}</Text>
//                    <Text style={styles.noteUser}>{item.createdBy}</Text>
//                  </View>
//                  <Icon
//                    name={project.isUploaded ? 'cloud-done' : 'edit'}
//                    style={styles.noteIcon}
//                  />
//                </TouchableOpacity>
//              )}
//              keyExtractor={item => `${item.Serial}`}
//            />
//          ) : (
//            <>
//              <Text style={styles.noNotesMessage}>No field notes available.</Text>
//              <Text style={styles.noNotesSubtext}>Create your first note to get started!</Text>
//            </>
//          )}
//        </View>
 
//        <View style={styles.buttonContainer}>
//          {!project.isUploaded && (
//            <>
//              <TouchableOpacity
//                style={(uploadedNotes || []).length > 0 ? styles.uploadButton : styles.addButton}
//                onPress={(uploadedNotes || []).length > 0 ? handleUploadNotesPress : handleAddNotesPress}>
//                <Text style={(uploadedNotes || []).length > 0 ? styles.uploadButtonText : styles.addButtonText}>
//                  {(uploadedNotes || []).length > 0 ? 'Upload' : 'Add Notes'}
//                </Text>
//              </TouchableOpacity>
 
//              {(uploadedNotes || []).length > 0 && (
//                <TouchableOpacity style={styles.addButton2} onPress={handleAddNotesPress}>
//                  <Text style={styles.addButtonText2}>Add Notes</Text>
//                </TouchableOpacity>
//              )}
//            </>
//          )}
//        </View>
//      </ScrollView>
//    );
//  };
 
//  const styles = StyleSheet.create({
//    container: {
//      flex: 1,
//      backgroundColor: '#B6D4D2',
//      padding: screenWidth * 0.05,
//    },
//    projectId: {
//      fontSize: screenWidth * 0.06,
//      fontWeight: 'bold',
//      color: 'black',
//    },
//    locationSection: {
//      marginBottom: screenHeight * 0.015,
//    },
//    location: {
//      fontSize: screenWidth * 0.05,
//      fontWeight: 'bold',
//      color: 'black',
//      marginLeft: screenWidth * 0.05,
//      marginTop: screenHeight * 0.04,
//    },
//    dateRange: {
//      fontSize: screenWidth * 0.04,
//      color: 'black',
//      marginLeft: screenWidth * 0.05,
//      fontWeight: 'bold',
//      marginTop: screenHeight * 0.01,
//    },
//    teamSection: {
//      marginBottom: screenHeight * 0.02,
//    },
//    teamLabel: {
//      fontSize: screenWidth * 0.05,
//      fontWeight: 'bold',
//      color: 'black',
//      marginLeft: screenWidth * 0.05,
//      marginTop: screenHeight * 0.02,
//    },
//    teamMembers: {
//      fontSize: screenWidth * 0.04,
//      color: 'black',
//      marginLeft: screenWidth * 0.05,
//      marginTop: screenHeight * 0.01,
//    },
//    fieldNotesSection: {
//      marginBottom: screenHeight * 0.04,
//      marginTop: screenHeight * 0.03,
//    },
//    fieldNotesLabel: {
//      fontSize: screenWidth * 0.05,
//      fontWeight: 'bold',
//      color: 'black',
//      marginLeft: screenWidth * 0.05,
//      marginBottom: screenHeight * 0.02,
//    },
//    noNotesMessage: {
//      fontSize: screenWidth * 0.04,
//      color: 'black',
//      marginTop: screenHeight * 0.15,
//      textAlign: 'center',
//      fontWeight: 'bold',
//    },
//    noNotesSubtext: {
//      fontSize: screenWidth * 0.045,
//      color: 'black',
//      textAlign: 'center',
//      marginTop: screenHeight * 0.005,
//    },
//    buttonContainer: {
//      flexDirection: 'row',
//      justifyContent: 'space-between',
//      alignItems: 'center',
//      marginLeft: screenWidth * 0.05,
//      marginRight: screenWidth * 0.05,
//    },
//    addButton: {
//      backgroundColor: '#48938F',
//      paddingVertical: screenHeight * 0.018,
//      alignItems: 'center',
//      marginTop: screenHeight * 0.12,
//      paddingHorizontal: screenWidth * 0.25,
//      justifyContent: 'center',
//      borderRadius: 7,
//      borderWidth: 2,
//      marginLeft: screenWidth * 0.013,
//      borderColor: 'black',
//      marginBottom: screenHeight * 0.05
//    },
//    addButtonText: {
//      fontSize: screenWidth * 0.058,
//      fontWeight: 'bold',
//      color: 'black',
//    },
//    addButton2: {
//      backgroundColor: '#48938F',
//      paddingVertical: screenHeight * 0.018,
//      alignItems: 'center',
//      paddingHorizontal: screenWidth * 0.05,
//      borderRadius: 7,
//      borderWidth: 2,
//      borderColor: 'black',
//      marginBottom: screenHeight * 0.04,
//    },
//    addButtonText2: {
//      fontSize: screenWidth * 0.05,
//      fontWeight: 'bold',
//      color: 'black',
//    },
//    uploadButton: {
//      backgroundColor: '#48938F',
//      paddingVertical: screenHeight * 0.015,
//      alignItems: 'center',
//      paddingHorizontal: screenWidth * 0.08,
//      borderRadius: 7,
//      borderWidth: 2,
//      borderColor: 'black',
//      marginBottom: screenHeight * 0.04,
//    },
//    uploadButtonText: {
//      fontSize: screenWidth * 0.055,
//      fontWeight: 'bold',
//      color: 'black',
//    },
//    noteEntry: {
//      flexDirection: 'row',
//      alignItems: 'center',
//      backgroundColor: '#48938F',
//      padding: screenHeight * 0.02,
//      borderRadius: 10,
//      marginVertical: screenHeight * 0.005,
//      marginLeft: screenWidth * 0.045,
//      marginRight: screenWidth * 0.045,
//    },
//    iconContainer: {
//      width: screenWidth * 0.08,
//      justifyContent: 'center',
//      alignItems: 'center',
//    },
//    noteInfo: {
//      flex: 1,
//      paddingLeft: screenWidth * 0.04,
//    },
//    noteDate: {
//      fontSize: screenWidth * 0.04,
//      fontWeight: 'bold',
//      paddingBottom: screenHeight * 0.005,
//      color: 'black',
//    },
//    noteUser: {
//      fontSize: screenWidth * 0.035,
//      color: 'black',
//    },
//    noteIcon: {
//      fontSize: screenWidth * 0.08,
//      fontWeight: 'bold',
//      color: 'black',
//    },
//    loadingText: {
//      fontSize: 18,
//      textAlign: 'center',
//      color: 'gray',
//    },
//    toggleText: {
//      color: 'blue',
//      fontSize: 16,
//    },
//    headerContainer: {
//      flexDirection: 'row',
//      alignItems: 'center',
//      justifyContent: 'flex-start',
//      marginBottom: screenHeight * 0.02,
//    },
//    backIconContainer: {
//      marginRight: screenWidth * 0.17,
//      marginLeft: screenWidth * 0.058,
//      marginBottom: screenHeight * 0.01,
//    },
//    backIcon: {
//      fontSize: screenWidth * 0.10,
//      fontWeight: 'bold',
//      color: 'black',
//    },
//  });
 
//  export default ProjectDetails;









// import React, { useState, useCallback } from 'react'; 
//  import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Dimensions } from 'react-native';
//  import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
//  import Icon from 'react-native-vector-icons/MaterialIcons';
//  import { useUploadStatus } from '../../ContextAPI/UploadStatusProvider';
//  import firestore from '@react-native-firebase/firestore';
//  import auth from '@react-native-firebase/auth'; // Import Firebase auth
//  import AsyncStorage from '@react-native-async-storage/async-storage';
  
//  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
 
//  const ProjectDetails = () => {
//    const navigation = useNavigation();
//    const route = useRoute();
//    const { projects, updateProjectUploadStatus, uploadedNotes, setUploadedNotes } = useUploadStatus();
//    const { projectId } = route.params;
//    const [project, setProject] = useState(null);
//    const [showFullDescription, setShowFullDescription] = useState(false);
//    const [notes, setNotes] = useState([]);
 
//    const toggleDescription = () => {
//      setShowFullDescription(!showFullDescription);
//    };
 
//    const getUserEmail = () => {
//      const user = auth().currentUser;
//      return user ? user.email : null;
//    };

   

//    const loadProjectDetails = async () => {
//     try {
//       console.log('Loading project details...');
//       const userEmail = getUserEmail();
//       if (!userEmail) {
//         console.error('No logged-in user email found.');
//         return;
//       }
  
//       // Firestore reference for the project
//       const projectRef = firestore()
//         .collection('UserInformation')
//         .doc(userEmail)
//         .collection('Allocated Project')
//         .doc(projectId);
  
//       // Fetch the project details from Firestore
//       const projectDoc = await projectRef.get();
//       if (projectDoc.exists) {
//         const projectData = projectDoc.data();
//         console.log('Fetched project data:', projectData);
//         setProject(projectData);
//       } else {
//         console.error('Project not found in Firestore for the given ID.');
//       }
  
//       // Fetch notes from Firestore
//       const notesSnapshot = await projectRef.collection('Uploaded Note').get();
//       let firestoreNotes = [];
//       if (!notesSnapshot.empty) {
//         firestoreNotes = notesSnapshot.docs.map(doc => doc.data());
//         console.log('Fetched notes from Firestore:', firestoreNotes);
//       } else {
//         console.log('No notes found in Firestore.');
//       }
  
//       // Fetch notes from AsyncStorage
//       const storedNotes = await AsyncStorage.getItem(projectId);
//       let asyncStorageNotes = storedNotes ? JSON.parse(storedNotes) : [];
//       console.log('Fetched notes from AsyncStorage:', asyncStorageNotes);
  
//       // Merge both Firestore and AsyncStorage notes
//       const allNotes = [...firestoreNotes, ...asyncStorageNotes];
  
//       // Filter unique notes by ID
//       const uniqueNotes = allNotes.filter((note, index, self) =>
//         index === self.findIndex((n) => n.id === note.id)
//       );
  
//       console.log('Unique notes:', uniqueNotes);
  
//       // Set the unique notes to the state
//       setUploadedNotes(uniqueNotes);
  
//       // Optionally, sync the unique notes with AsyncStorage if needed
//       await AsyncStorage.setItem(projectId, JSON.stringify(uniqueNotes));
//       console.log('Unique notes synced with AsyncStorage.');
      
//     } catch (error) {
//       console.error('Error loading project details:', error);
//     }
//   };
  
   

  
 
//    // Reload project details whenever the screen comes into focus
//    useFocusEffect(
//      useCallback(() => {
//        loadProjectDetails();
//      }, [projectId])
//    );
 
//    const handleNotePress = note => {
//     const { projectName } = project;
//      if (project.isUploaded) {
//        navigation.navigate('UploadedNoteScreen', {
//          note,
//          noteSerial: note.Serial,
//          projectId,
//        });
//      } else {
//      // const formattedNoteSerial2 = parseInt(note.Serial.replace(/[^\d]/g, ''), 10);
//      const formattedNoteSerial2 = note.Serial.replace(/[^\d]/g, '').slice(-1);
//       console.log('serial2:',formattedNoteSerial2)
//        navigation.navigate('CollectScreen', {
//          note,
//          projectId,
//          country: project.country,
//          noteSerial2: formattedNoteSerial2,
//          projectName
//        });
//      }
//    };
 
//    const handleAddNotesPress = async () => {
//     const { projectName } = project;
//     const noteSerial = uploadedNotes.length + 1;

//     // Navigate to CollectScreen to add the note
//     navigation.navigate('CollectScreen', {
//         projectId,
//         noteSerial,
//         country: project.country,
//         projectName
//     });

//     // Reload project details after navigating back
//     setTimeout(() => {
//         loadProjectDetails();
//     }, 1000);  // Delay to allow note creation
// };

// const handleUploadNotesPress = async () => {
//   const userEmail = getUserEmail();
//   if (!userEmail) {
//       console.error('No logged-in user email found.');
//       return;
//   }

//   try {
//       console.log('Uploading notes...');
      
//       // Separate uploaded and unuploaded notes
//       const unuploadedNotes = uploadedNotes.filter(note => !note.isUploaded);

//       if (unuploadedNotes.length === 0) {
//         console.log('All notes are already uploaded.');
//         return;
//       }

//       // Firestore batch
//       const projectRef = firestore()
//           .collection('UserInformation')
//           .doc(userEmail)
//           .collection('Allocated Project')
//           .doc(projectId);
      
//       const batch = firestore().batch();
//       unuploadedNotes.forEach(note => {
//           const noteRef = projectRef.collection('Uploaded Note').doc(note.Serial.toString());
//           batch.set(noteRef, { ...note, isUploaded: true });
//       });

//       await batch.commit();
//       console.log('Notes uploaded successfully.');

//       // Update project as uploaded
//       await projectRef.update({ isUploaded: true });
//       updateProjectUploadStatus(projectId, true);

//       // Update local storage
//       const updatedNotes = uploadedNotes.map(note => ({ ...note, isUploaded: true }));
//       setUploadedNotes(updatedNotes);
//       await AsyncStorage.setItem(projectId, JSON.stringify(updatedNotes));

//       console.log('AsyncStorage updated with uploaded notes.');

//   } catch (error) {
//       console.error('Error uploading notes:', error);
//   }
// };

   
 
//    const formatDate = dateString => {
//      const date = new Date(dateString);
//      return date.toLocaleDateString('en-US', {
//        year: 'numeric',
//        month: 'short',
//        day: 'numeric',
//      });
//    };
 
//    if (!project) {
//      return (
//        <View style={styles.container}>
//          <Text style={styles.loadingText}>Loading Project Details...</Text>
//        </View>
//      );
//    }
 
 
//    return (
//      <ScrollView style={styles.container}>
//        <View style={styles.headerContainer}>
//          <TouchableOpacity onPress={() => navigation.navigate('Home2')} style={styles.backIconContainer}>
//            <Text style={styles.backIcon}>{'\u2039'}</Text>
//          </TouchableOpacity>
//          <Text style={styles.projectId}>{project.projectName}</Text>
//        </View>
 
//        <View style={styles.locationSection}>
//          <Text style={styles.location}>
//            {project.cityName}, {project.country}
//          </Text>
//          <Text style={styles.dateRange}>
//            {formatDate(project.fromDate)} - {formatDate(project.toDate)}
//          </Text>
//        </View>
 
//        <View style={styles.teamSection}>
//          <Text style={styles.teamLabel}>Team</Text>
//          <Text style={styles.teamMembers}>
//            {Array.isArray(project.habitats) ? project.habitats.join(' , ') : project.habitats}
//          </Text>
//        </View>
 
//        <View style={styles.descriptionSection}>
//          <Text style={styles.teamLabel}>Description:</Text>
//          <Text style={styles.teamMembers}>
//            {showFullDescription ? project.description : `${project.description.substring(0, 100)}`}
//            <Text style={styles.toggleText} onPress={toggleDescription}>
//              {showFullDescription ? '   ......less' : '  .....more'}
//            </Text>
//          </Text>
//        </View>
 
//        <View style={styles.fieldNotesSection}>
//          <Text style={styles.fieldNotesLabel}>Field Notes</Text>
//          {(uploadedNotes || []).length > 0 ? (
//            <FlatList
//              data={uploadedNotes}
//              renderItem={({ item }) => (
//                <TouchableOpacity
//                  style={styles.noteEntry}
//                  onPress={() => handleNotePress(item)}>
//                  <View style={styles.noteInfo}>
//                    <Text style={styles.noteDate}>{item.Serial}</Text>
//                    <Text style={styles.noteUser}>{item.createdBy}</Text>
//                  </View>
//                  <Icon
//                    name={project.isUploaded ? 'cloud-done' : 'edit'}
//                    style={styles.noteIcon}
//                  />
//                </TouchableOpacity>
//              )}
//              keyExtractor={item => `${item.Serial}`}
//            />
//          ) : (
//            <>
//              <Text style={styles.noNotesMessage}>No field notes available.</Text>
//              <Text style={styles.noNotesSubtext}>Create your first note to get started!</Text>
//            </>
//          )}
//        </View>
 
//        <View style={styles.buttonContainer}>
//   <TouchableOpacity
//     style={styles.uploadButton}
//     onPress={handleUploadNotesPress}>
//     <Text style={styles.uploadButtonText}>Upload</Text>
//   </TouchableOpacity>

//   <TouchableOpacity style={styles.addButton2} onPress={handleAddNotesPress}>
//     <Text style={styles.addButtonText2}>Add Notes</Text>
//   </TouchableOpacity>
// </View>

//      </ScrollView>
//    );
//  };
//  const styles = StyleSheet.create({
//    container: {
//      flex: 1,
//      backgroundColor: '#B6D4D2',
//      padding: screenWidth * 0.05,
//    },
//    projectId: {
//      fontSize: screenWidth * 0.06,
//      fontWeight: 'bold',
//      color: 'black',
//    },
//    locationSection: {
//      marginBottom: screenHeight * 0.015,
//    },
//    location: {
//      fontSize: screenWidth * 0.05,
//      fontWeight: 'bold',
//      color: 'black',
//      marginLeft: screenWidth * 0.05,
//      marginTop: screenHeight * 0.04,
//    },
//    dateRange: {
//      fontSize: screenWidth * 0.04,
//      color: 'black',
//      marginLeft: screenWidth * 0.05,
//      fontWeight: 'bold',
//      marginTop: screenHeight * 0.01,
//    },
//    teamSection: {
//      marginBottom: screenHeight * 0.02,
//    },
//    teamLabel: {
//      fontSize: screenWidth * 0.05,
//      fontWeight: 'bold',
//      color: 'black',
//      marginLeft: screenWidth * 0.05,
//      marginTop: screenHeight * 0.02,
//    },
//    teamMembers: {
//      fontSize: screenWidth * 0.04,
//      color: 'black',
//      marginLeft: screenWidth * 0.05,
//      marginTop: screenHeight * 0.01,
//    },
//    fieldNotesSection: {
//      marginBottom: screenHeight * 0.04,
//      marginTop: screenHeight * 0.03,
//    },
//    fieldNotesLabel: {
//      fontSize: screenWidth * 0.05,
//      fontWeight: 'bold',
//      color: 'black',
//      marginLeft: screenWidth * 0.05,
//      marginBottom: screenHeight * 0.02,
//    },
//    noNotesMessage: {
//      fontSize: screenWidth * 0.04,
//      color: 'black',
//      marginTop: screenHeight * 0.15,
//      textAlign: 'center',
//      fontWeight: 'bold',
//    },
//    noNotesSubtext: {
//      fontSize: screenWidth * 0.045,
//      color: 'black',
//      textAlign: 'center',
//      marginTop: screenHeight * 0.005,
//    },
//    buttonContainer: {
//      flexDirection: 'row',
//      justifyContent: 'space-between',
//      alignItems: 'center',
//      marginLeft: screenWidth * 0.05,
//      marginRight: screenWidth * 0.05,
//    },
//    addButton: {
//      backgroundColor: '#48938F',
//      paddingVertical: screenHeight * 0.018,
//      alignItems: 'center',
//      marginTop: screenHeight * 0.12,
//      paddingHorizontal: screenWidth * 0.25,
//      justifyContent: 'center',
//      borderRadius: 7,
//      borderWidth: 2,
//      marginLeft: screenWidth * 0.013,
//      borderColor: 'black',
//      marginBottom: screenHeight * 0.05
//    },
//    addButtonText: {
//      fontSize: screenWidth * 0.058,
//      fontWeight: 'bold',
//      color: 'black',
//    },
//    addButton2: {
//      backgroundColor: '#48938F',
//      paddingVertical: screenHeight * 0.018,
//      alignItems: 'center',
//      paddingHorizontal: screenWidth * 0.05,
//      borderRadius: 7,
//      borderWidth: 2,
//      borderColor: 'black',
//      marginBottom: screenHeight * 0.04,
//    },
//    addButtonText2: {
//      fontSize: screenWidth * 0.05,
//      fontWeight: 'bold',
//      color: 'black',
//    },
//    uploadButton: {
//      backgroundColor: '#48938F',
//      paddingVertical: screenHeight * 0.015,
//      alignItems: 'center',
//      paddingHorizontal: screenWidth * 0.08,
//      borderRadius: 7,
//      borderWidth: 2,
//      borderColor: 'black',
//      marginBottom: screenHeight * 0.04,
//    },
//    uploadButtonText: {
//      fontSize: screenWidth * 0.055,
//      fontWeight: 'bold',
//      color: 'black',
//    },
//    noteEntry: {
//      flexDirection: 'row',
//      alignItems: 'center',
//      backgroundColor: '#48938F',
//      padding: screenHeight * 0.02,
//      borderRadius: 10,
//      marginVertical: screenHeight * 0.005,
//      marginLeft: screenWidth * 0.045,
//      marginRight: screenWidth * 0.045,
//    },
//    iconContainer: {
//      width: screenWidth * 0.08,
//      justifyContent: 'center',
//      alignItems: 'center',
//    },
//    noteInfo: {
//      flex: 1,
//      paddingLeft: screenWidth * 0.04,
//    },
//    noteDate: {
//      fontSize: screenWidth * 0.04,
//      fontWeight: 'bold',
//      paddingBottom: screenHeight * 0.005,
//      color: 'black',
//    },
//    noteUser: {
//      fontSize: screenWidth * 0.035,
//      color: 'black',
//    },
//    noteIcon: {
//      fontSize: screenWidth * 0.08,
//      fontWeight: 'bold',
//      color: 'black',
//    },
//    loadingText: {
//      fontSize: 18,
//      textAlign: 'center',
//      color: 'gray',
//    },
//    toggleText: {
//      color: 'blue',
//      fontSize: 16,
//    },
//    headerContainer: {
//      flexDirection: 'row',
//      alignItems: 'center',
//      justifyContent: 'flex-start',
//      marginBottom: screenHeight * 0.02,
//    },
//    backIconContainer: {
//      marginRight: screenWidth * 0.17,
//      marginLeft: screenWidth * 0.058,
//      marginBottom: screenHeight * 0.01,
//    },
//    backIcon: {
//      fontSize: screenWidth * 0.10,
//      fontWeight: 'bold',
//      color: 'black',
//    },
//  });
 
//  export default ProjectDetails;





import React, { useState, useCallback } from 'react'; 
 import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Dimensions } from 'react-native';
 import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
 import Icon from 'react-native-vector-icons/MaterialIcons';
 import { useUploadStatus } from '../../ContextAPI/UploadStatusProvider';
 import firestore from '@react-native-firebase/firestore';
 import auth from '@react-native-firebase/auth'; // Import Firebase auth
 import AsyncStorage from '@react-native-async-storage/async-storage';
  
 const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
 
 const ProjectDetails = () => {
   const navigation = useNavigation();
   const route = useRoute();
   const { projects, updateProjectUploadStatus, uploadedNotes, setUploadedNotes } = useUploadStatus();
   const { projectId } = route.params;
   const [project, setProject] = useState(null);
   const [showFullDescription, setShowFullDescription] = useState(false);
   const [notes, setNotes] = useState([]);
 
   const toggleDescription = () => {
     setShowFullDescription(!showFullDescription);
   };
 
   const getUserEmail = () => {
     const user = auth().currentUser;
     return user ? user.email : null;
   };

   

   const loadProjectDetails = async () => {
    try {
        console.log('Loading project details...');
        const userEmail = getUserEmail();
        if (!userEmail) {
            console.error('No logged-in user email found.');
            return;
        }

        const projectRef = firestore()
            .collection('UserInformation')
            .doc(userEmail)
            .collection('Allocated Project')
            .doc(projectId);

        const projectDoc = await projectRef.get();
        if (projectDoc.exists) {
            const projectData = projectDoc.data();
            console.log('Fetched project data:', projectData);
            setProject(projectData);
        } else {
            console.error('Project not found in Firestore for the given ID.');
        }

        // Fetch notes from Firestore
        const notesSnapshot = await projectRef.collection('Uploaded Note').get();
        let firestoreNotes = [];
        if (!notesSnapshot.empty) {
            firestoreNotes = notesSnapshot.docs.map(doc => doc.data());
            console.log('Fetched notes from Firestore:', firestoreNotes);
        } else {
            console.log('No notes found in Firestore.');
        }

        // Fetch notes from AsyncStorage
        const storedNotes = await AsyncStorage.getItem(projectId);
        let asyncStorageNotes = storedNotes ? JSON.parse(storedNotes) : [];
        console.log('Fetched notes from AsyncStorage:', asyncStorageNotes);

        // Ensure new notes have `isUploaded: false`
        const allNotes = [...firestoreNotes, ...asyncStorageNotes].map(note => ({
            ...note,
            isUploaded: note.isUploaded || false,  // Ensure unuploaded notes are marked correctly
        }));

        // Filter unique notes
        const uniqueNotes = allNotes.filter((note, index, self) =>
            index === self.findIndex((n) => n.id === note.id)
        );

        console.log('Unique notes:', uniqueNotes);

        // Set state
        setUploadedNotes(uniqueNotes);
        await AsyncStorage.setItem(projectId, JSON.stringify(uniqueNotes));
        console.log('Unique notes synced with AsyncStorage.');

    } catch (error) {
        console.error('Error loading project details:', error);
    }
};

  
   

  
 
   // Reload project details whenever the screen comes into focus
   useFocusEffect(
     useCallback(() => {
       loadProjectDetails();
     }, [projectId])
   );
 
   const handleNotePress = note => {
    const { projectName } = project;
     if (project.isUploaded) {
       navigation.navigate('UploadedNoteScreen', {
         note,
         noteSerial: note.Serial,
         projectId,
       });
     } else {
     // const formattedNoteSerial2 = parseInt(note.Serial.replace(/[^\d]/g, ''), 10);
     const formattedNoteSerial2 = note.Serial.replace(/[^\d]/g, '').slice(-1);
      console.log('serial2:',formattedNoteSerial2)
       navigation.navigate('CollectScreen', {
         note,
         projectId,
         country: project.country,
         noteSerial2: formattedNoteSerial2,
         projectName
       });
     }
   };
 
   const handleAddNotesPress = async () => {
    const { projectName } = project;
    const noteSerial = uploadedNotes.length + 1;

    // Navigate to CollectScreen to add the note
    navigation.navigate('CollectScreen', {
        projectId,
        noteSerial,
        country: project.country,
        projectName
    });

    // Reload project details after navigating back
    setTimeout(() => {
        loadProjectDetails();
    }, 1000);  // Delay to allow note creation
};

const handleUploadNotesPress = async () => {
  const userEmail = getUserEmail();
  if (!userEmail) {
      console.error('No logged-in user email found.');
      return;
  }

  try {
      console.log('Uploading notes...');
      
      // Separate unuploaded notes
      const unuploadedNotes = uploadedNotes.filter(note => !note.isUploaded);

      if (unuploadedNotes.length === 0) {
          console.log('All notes are already uploaded.');
          return;
      }

      // Firestore batch update
      const projectRef = firestore()
          .collection('UserInformation')
          .doc(userEmail)
          .collection('Allocated Project')
          .doc(projectId);
      
      const batch = firestore().batch();
      unuploadedNotes.forEach(note => {
          const noteRef = projectRef.collection('Uploaded Note').doc(note.Serial.toString());
          batch.set(noteRef, { ...note, isUploaded: true });
      });

      await batch.commit();
      console.log('Notes uploaded successfully.');

      // Update project as uploaded if **all** notes are uploaded
      const allNotesUploaded = uploadedNotes.every(note => note.isUploaded || unuploadedNotes.includes(note));
      if (allNotesUploaded) {
          await projectRef.update({ isUploaded: true });
          updateProjectUploadStatus(projectId, true);
      }

      // Update only uploaded notes, keeping new ones unchanged
      const updatedNotes = uploadedNotes.map(note => 
          unuploadedNotes.some(unNote => unNote.Serial === note.Serial) 
              ? { ...note, isUploaded: true } 
              : note
      );

      setUploadedNotes(updatedNotes);
      await AsyncStorage.setItem(projectId, JSON.stringify(updatedNotes));

      console.log('AsyncStorage updated with uploaded notes.');

  } catch (error) {
      console.error('Error uploading notes:', error);
  }
};

   
 
   const formatDate = dateString => {
     const date = new Date(dateString);
     return date.toLocaleDateString('en-US', {
       year: 'numeric',
       month: 'short',
       day: 'numeric',
     });
   };
 
   if (!project) {
     return (
       <View style={styles.container}>
         <Text style={styles.loadingText}>Loading Project Details...</Text>
       </View>
     );
   }
 
 
   return (
     <ScrollView style={styles.container}>
       <View style={styles.headerContainer}>
         <TouchableOpacity onPress={() => navigation.navigate('Home2')} style={styles.backIconContainer}>
           <Text style={styles.backIcon}>{'\u2039'}</Text>
         </TouchableOpacity>
         <Text style={styles.projectId}>{project.projectName}</Text>
       </View>
 
       <View style={styles.locationSection}>
         <Text style={styles.location}>
           {project.cityName}, {project.country}
         </Text>
         <Text style={styles.dateRange}>
           {formatDate(project.fromDate)} - {formatDate(project.toDate)}
         </Text>
       </View>
 
       <View style={styles.teamSection}>
         <Text style={styles.teamLabel}>Team</Text>
         <Text style={styles.teamMembers}>
           {Array.isArray(project.habitats) ? project.habitats.join(' , ') : project.habitats}
         </Text>
       </View>
 
       <View style={styles.descriptionSection}>
         <Text style={styles.teamLabel}>Description:</Text>
         <Text style={styles.teamMembers}>
           {showFullDescription ? project.description : `${project.description.substring(0, 100)}`}
           <Text style={styles.toggleText} onPress={toggleDescription}>
             {showFullDescription ? '   ......less' : '  .....more'}
           </Text>
         </Text>
       </View>
 
       <View style={styles.fieldNotesSection}>
         <Text style={styles.fieldNotesLabel}>Field Notes</Text>
         {(uploadedNotes || []).length > 0 ? (
           <FlatList
           data={uploadedNotes}
           renderItem={({ item }) => (
               <TouchableOpacity
                   style={styles.noteEntry}
                   onPress={() => handleNotePress(item)}>
                   <View style={styles.noteInfo}>
                       <Text style={styles.noteDate}>{item.Serial}</Text>
                       <Text style={styles.noteUser}>{item.createdBy}</Text>
                   </View>
                   <Icon
                       name={item.isUploaded ? 'cloud-done' : 'edit'}
                       style={styles.noteIcon}
                   />
               </TouchableOpacity>
           )}
           keyExtractor={item => `${item.Serial}`}
       />
       
         ) : (
           <>
             <Text style={styles.noNotesMessage}>No field notes available.</Text>
             <Text style={styles.noNotesSubtext}>Create your first note to get started!</Text>
           </>
         )}
       </View>
 
       <View style={styles.buttonContainer}>
  <TouchableOpacity
    style={styles.uploadButton}
    onPress={handleUploadNotesPress}>
    <Text style={styles.uploadButtonText}>Upload</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.addButton2} onPress={handleAddNotesPress}>
    <Text style={styles.addButtonText2}>Add Notes</Text>
  </TouchableOpacity>
</View>

     </ScrollView>
   );
 };
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#B6D4D2',
     padding: screenWidth * 0.05,
   },
   projectId: {
     fontSize: screenWidth * 0.06,
     fontWeight: 'bold',
     color: 'black',
   },
   locationSection: {
     marginBottom: screenHeight * 0.015,
   },
   location: {
     fontSize: screenWidth * 0.05,
     fontWeight: 'bold',
     color: 'black',
     marginLeft: screenWidth * 0.05,
     marginTop: screenHeight * 0.04,
   },
   dateRange: {
     fontSize: screenWidth * 0.04,
     color: 'black',
     marginLeft: screenWidth * 0.05,
     fontWeight: 'bold',
     marginTop: screenHeight * 0.01,
   },
   teamSection: {
     marginBottom: screenHeight * 0.02,
   },
   teamLabel: {
     fontSize: screenWidth * 0.05,
     fontWeight: 'bold',
     color: 'black',
     marginLeft: screenWidth * 0.05,
     marginTop: screenHeight * 0.02,
   },
   teamMembers: {
     fontSize: screenWidth * 0.04,
     color: 'black',
     marginLeft: screenWidth * 0.05,
     marginTop: screenHeight * 0.01,
   },
   fieldNotesSection: {
     marginBottom: screenHeight * 0.04,
     marginTop: screenHeight * 0.03,
   },
   fieldNotesLabel: {
     fontSize: screenWidth * 0.05,
     fontWeight: 'bold',
     color: 'black',
     marginLeft: screenWidth * 0.05,
     marginBottom: screenHeight * 0.02,
   },
   noNotesMessage: {
     fontSize: screenWidth * 0.04,
     color: 'black',
     marginTop: screenHeight * 0.15,
     textAlign: 'center',
     fontWeight: 'bold',
   },
   noNotesSubtext: {
     fontSize: screenWidth * 0.045,
     color: 'black',
     textAlign: 'center',
     marginTop: screenHeight * 0.005,
   },
   buttonContainer: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     marginLeft: screenWidth * 0.05,
     marginRight: screenWidth * 0.05,
   },
   addButton: {
     backgroundColor: '#48938F',
     paddingVertical: screenHeight * 0.018,
     alignItems: 'center',
     marginTop: screenHeight * 0.12,
     paddingHorizontal: screenWidth * 0.25,
     justifyContent: 'center',
     borderRadius: 7,
     borderWidth: 2,
     marginLeft: screenWidth * 0.013,
     borderColor: 'black',
     marginBottom: screenHeight * 0.05
   },
   addButtonText: {
     fontSize: screenWidth * 0.058,
     fontWeight: 'bold',
     color: 'black',
   },
   addButton2: {
     backgroundColor: '#48938F',
     paddingVertical: screenHeight * 0.018,
     alignItems: 'center',
     paddingHorizontal: screenWidth * 0.05,
     borderRadius: 7,
     borderWidth: 2,
     borderColor: 'black',
     marginBottom: screenHeight * 0.04,
   },
   addButtonText2: {
     fontSize: screenWidth * 0.05,
     fontWeight: 'bold',
     color: 'black',
   },
   uploadButton: {
     backgroundColor: '#48938F',
     paddingVertical: screenHeight * 0.015,
     alignItems: 'center',
     paddingHorizontal: screenWidth * 0.08,
     borderRadius: 7,
     borderWidth: 2,
     borderColor: 'black',
     marginBottom: screenHeight * 0.04,
   },
   uploadButtonText: {
     fontSize: screenWidth * 0.055,
     fontWeight: 'bold',
     color: 'black',
   },
   noteEntry: {
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: '#48938F',
     padding: screenHeight * 0.02,
     borderRadius: 10,
     marginVertical: screenHeight * 0.005,
     marginLeft: screenWidth * 0.045,
     marginRight: screenWidth * 0.045,
   },
   iconContainer: {
     width: screenWidth * 0.08,
     justifyContent: 'center',
     alignItems: 'center',
   },
   noteInfo: {
     flex: 1,
     paddingLeft: screenWidth * 0.04,
   },
   noteDate: {
     fontSize: screenWidth * 0.04,
     fontWeight: 'bold',
     paddingBottom: screenHeight * 0.005,
     color: 'black',
   },
   noteUser: {
     fontSize: screenWidth * 0.035,
     color: 'black',
   },
   noteIcon: {
     fontSize: screenWidth * 0.08,
     fontWeight: 'bold',
     color: 'black',
   },
   loadingText: {
     fontSize: 18,
     textAlign: 'center',
     color: 'gray',
   },
   toggleText: {
     color: 'blue',
     fontSize: 16,
   },
   headerContainer: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'flex-start',
     marginBottom: screenHeight * 0.02,
   },
   backIconContainer: {
     marginRight: screenWidth * 0.17,
     marginLeft: screenWidth * 0.058,
     marginBottom: screenHeight * 0.01,
   },
   backIcon: {
     fontSize: screenWidth * 0.10,
     fontWeight: 'bold',
     color: 'black',
   },
 });
 
 export default ProjectDetails;




