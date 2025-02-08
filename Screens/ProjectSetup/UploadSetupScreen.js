// import React, { useState, useCallback } from 'react'; 
//  import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Dimensions } from 'react-native';
//  import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
//  import Icon from 'react-native-vector-icons/MaterialIcons';
//  import { useUploadStatus } from '../../ContextAPI/UploadStatusProvider';
//  import firestore from '@react-native-firebase/firestore';
//  import auth from '@react-native-firebase/auth'; // Import Firebase auth
//  import AsyncStorage from '@react-native-async-storage/async-storage';
  
//  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
 
//  const UploadSetupScreen  = () => {
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
//         console.log('Loading project details...');
//         const userEmail = getUserEmail();
//         if (!userEmail) {
//             console.error('No logged-in user email found.');
//             return;
//         }

//         // Fetch project details
//         const projectRef = firestore()
//             .collection('UserInformation')
//             .doc(userEmail)
//             .collection('Allocated Project')
//             .doc(projectId);

//         const projectDoc = await projectRef.get();

//         if (!projectDoc.exists) {
//             console.error('Project not found in Firestore for the given ID.');
//             return;
//         }

//         const projectData = projectDoc.data();  // Ensure this is only accessed if projectDoc.exists
//         console.log('Fetched project data:', projectData);
//         setProject(projectData);

//         // Ensure projectData has projectName before accessing it
//         if (!projectData?.projectName) {
//             console.error('projectName is missing in Firestore document.');
//             return;
//         }

//         const projectName = projectData.projectName;
//         console.log('Project Name:', projectName);

//         // Fetch notes from Firestore
//         const notesDocRef = firestore().collection('NotesUploaded').doc(projectName);
//         const notesDoc = await notesDocRef.get();
//         let firestoreNotes = [];

//         if (notesDoc.exists) {
//             const data = notesDoc.data();
//             firestoreNotes = data?.notes || []; // Ensure data.notes is present
//             console.log('Fetched notes from Firestore:', firestoreNotes);
//         } else {
//             console.log('No notes found in Firestore.');
//         }

//         // Fetch notes from AsyncStorage
//         const storedNotes = await AsyncStorage.getItem(projectId);
//         let asyncStorageNotes = storedNotes ? JSON.parse(storedNotes) : [];
//         console.log('Fetched notes from AsyncStorage:', asyncStorageNotes);

//         // Ensure all notes have `isUploaded: false` if not present
//         const allNotes = [...firestoreNotes, ...asyncStorageNotes].map(note => ({
//             ...note,
//             isUploaded: note.isUploaded ?? false, // Ensure `isUploaded` is set correctly
//         }));

//         // Filter unique notes using Serial as a unique key
//         const uniqueNotes = allNotes.filter((note, index, self) =>
//             index === self.findIndex((n) => n.Serial === note.Serial)
//         );

//         console.log('Unique notes:', uniqueNotes);

//         // Set state
//         setUploadedNotes(uniqueNotes);
//         await AsyncStorage.setItem(projectId, JSON.stringify(uniqueNotes));
//         console.log('Unique notes synced with AsyncStorage.');

//     } catch (error) {
//         console.error('Error loading project details:', error);
//     }
// };

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
//            data={uploadedNotes}
//            renderItem={({ item }) => (
//                <TouchableOpacity
//                    style={styles.noteEntry}
//                    onPress={() => handleNotePress(item)}>
//                    <View style={styles.noteInfo}>
//                        <Text style={styles.noteDate}>{item.Serial}</Text>
//                        <Text style={styles.noteUser}>{item.createdBy}</Text>
//                    </View>
//                    <Icon
//                        name={item.isUploaded ? 'cloud-done' : 'edit'}
//                        style={styles.noteIcon}
//                    />
//                </TouchableOpacity>
//            )}
//            keyExtractor={item => `${item.Serial}`}
//        />
       
//          ) : (
//            <>
//              <Text style={styles.noNotesMessage}>No field notes available.</Text>
            
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
 
//  export default UploadSetupScreen;






import React, { useState, useCallback } from 'react'; 
 import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Dimensions } from 'react-native';
 import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
 import Icon from 'react-native-vector-icons/MaterialIcons';
 import { useUploadStatus } from '../../ContextAPI/UploadStatusProvider';
 import firestore from '@react-native-firebase/firestore';
 import auth from '@react-native-firebase/auth'; // Import Firebase auth
 import AsyncStorage from '@react-native-async-storage/async-storage';
  
 const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
 
 const UploadSetupScreen  = () => {
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
  
      // Fetch project details
      const projectRef = firestore()
        .collection('UserInformation')
        .doc(userEmail)
        .collection('Project Created')
        .doc(projectId);
  
      const projectDoc = await projectRef.get();
  
      if (!projectDoc.exists) {
        console.error('Project not found in Firestore for the given ID.');
        return;
      }
  
      const projectData = projectDoc.data();  // Ensure this is only accessed if projectDoc.exists
      console.log('Fetched project data:', projectData);
      setProject(projectData);
  
      // Ensure projectData has projectName before accessing it
      if (!projectData?.projectName) {
        console.error('projectName is missing in Firestore document.');
        return;
      }
  
      const projectName = projectData.projectName;
      console.log('Project Name:', projectName);
  
      // Fetch notes from Firestore
      const notesDocRef = firestore().collection('NotesUploaded').doc(projectName);
      const notesDoc = await notesDocRef.get();
      let firestoreNotes = [];
  
      if (notesDoc.exists) {
        const data = notesDoc.data();
        firestoreNotes = data?.notes || []; // Ensure data.notes is present
        console.log('Fetched all notes from Firestore:', firestoreNotes);
      } else {
        console.log('No notes found in Firestore.');
      }
  
      // Set state with all the Firestore notes
      setUploadedNotes(firestoreNotes);
  
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
    const { projectName , createdBy} = project;
     if (project.isUploaded) {
       navigation.navigate('MangerView', {
         note,
         noteSerial: note.Serial,
         projectId,
         projectName,
         createdBy
       });
     } else {
     // const formattedNoteSerial2 = parseInt(note.Serial.replace(/[^\d]/g, ''), 10);
     const formattedNoteSerial2 = note.Serial.replace(/[^\d]/g, '').slice(-1);
      console.log('serial2:',formattedNoteSerial2)
       navigation.navigate('MangerView', {
         note,
         //projectId,
         //country: project.country,
         //noteSerial2: formattedNoteSerial2,
         noteSerial: note.Serial,
         projectId,
         projectName,
         createdBy
         //projectName
       });
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
            
           </>
         )}
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
     marginLeft: screenWidth * 0.09,
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
 
 export default UploadSetupScreen;




