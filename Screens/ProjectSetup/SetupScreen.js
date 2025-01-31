// import React, { useEffect, useState, useCallback } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
// import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useUploadStatus } from '../../ContextAPI/UploadStatusProvider';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';

// const { width, height } = Dimensions.get('window');

// const SetupScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const [projects, setProjects] = useState([]);
//   const { getProjectStatus } = useUploadStatus();
//   const [uploadedNotes, setUploadedNotes] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Helper function to format dates
//   const formatDate = (dateString) => {
//     const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
//     return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString));
//   };

//   // Load projects from Firebase or AsyncStorage
//   const loadProjects = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const user = auth().currentUser;
//       if (user && user.email) {
//         const userProjectsRef = firestore()
//           .collection('UserInformation')
//           .doc(user.email)
//           .collection('Project Created');

//         const snapshot = await userProjectsRef.get();
//         if (snapshot.empty) {
//           throw new Error('No projects found in Firebase');
//         }

//         const firebaseProjects = snapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         const projectsWithStatus = firebaseProjects.map(project => ({
//           ...project,
//           isUploaded: getProjectStatus(project.id),
//         }));
//         setProjects(projectsWithStatus);

//         await AsyncStorage.setItem('projects', JSON.stringify(projectsWithStatus));
//       } else {
//         throw new Error('User is not logged in');
//       }
//     } catch (error) {
//       console.log('Error fetching projects from Firebase, fallback to AsyncStorage:', error);
//       setError(error.message);
//       loadProjectsFromAsyncStorage();
//     } finally {
//       setLoading(false);
//     }
//   }, [getProjectStatus]);

//   // Load projects from AsyncStorage
//   const loadProjectsFromAsyncStorage = async () => {
//     try {
//       const storedProjects = await AsyncStorage.getItem('projects');
//       if (storedProjects) {
//         const parsedProjects = JSON.parse(storedProjects);
//         const projectsWithStatus = parsedProjects.map(project => ({
//           ...project,
//           isUploaded: getProjectStatus(project.id),
//         }));
//         setProjects(projectsWithStatus);
//       }
//     } catch (error) {
//       console.error('Error loading projects from AsyncStorage:', error);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       loadProjects();
//     }, [loadProjects]),
//   );

//   useEffect(() => {
//     if (route.params?.uploadedNotes) {
//       setUploadedNotes(route.params.uploadedNotes);
//     }
//   }, [route.params?.uploadedNotes]);

//   const renderProject = ({ item }) => (
//     <TouchableOpacity
//       style={[styles.projectItem, !item.isUploaded && styles.disabled]}
//       onPress={
//         item.isUploaded
//           ? () => navigation.navigate('ProjectDetails', { projectId: item.id })
//           : null
//       }>
//       <View style={styles.projectDetails}>
//         <Text style={styles.projectID}>{item.id}</Text>
//         <Text style={styles.CityCountry}>
//           {item.cityName || 'No city'},{' '}
//           {item.country || 'No country'}
//         </Text>
//         <Text style={styles.Date}>
//           {item.fromDate && item.toDate
//             ? `${formatDate(item.fromDate)} - ${formatDate(item.toDate)}`
//             : 'No date range'}
//         </Text>
//       </View>
//       <View style={styles.statusIcon}>
//         {item.isUploaded ? (
//           <Icon name="cloud-done" size={28} color="black" />
//         ) : (
//           <Icon name="pending-actions" size={28} color="black" />
//         )}
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <ScrollView contentContainerStyle={styles.scrollViewContent}>
//       <View style={styles.container}>
//         <View style={styles.headerContainer}>
//           <TouchableOpacity
//             onPress={() => navigation.navigate('Home')}
//             style={styles.backIconContainer}>
//             <Text style={styles.backIcon}>{'\u2039'}</Text>
//           </TouchableOpacity>
//           <Text style={styles.header}>All Projects</Text>
//         </View>

//         {loading ? (
//           <ActivityIndicator size="large" color="black" />
//         ) : error ? (
//           <View style={styles.errorContainer}>
//             <Text style={styles.errorText}>{error}</Text>
//             <TouchableOpacity onPress={loadProjects} style={styles.retryButton}>
//               <Text style={styles.retryButtonText}>Retry</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <FlatList
//             data={projects}
//             renderItem={renderProject}
//             ListEmptyComponent={
//               <Text style={styles.emptyComponent}>No projects available</Text>
//             }
//             keyExtractor={item => item.id.toString()}
//           />
//         )}

//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => navigation.navigate('SetupDetail')}>
//           <View style={styles.buttonContent}>
//             <Text style={styles.plusSign}>+</Text>
//             <Text style={styles.buttonText}>Create project</Text>
//           </View>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: width * 0.05,
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: height * 0.05,
//     marginTop: height * 0.03,
//     marginRight: width * 0.03,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'black',
//     textAlign: 'center',
//     flex: 1,
//   },
//   backIconContainer: {
//     paddingRight: 8,
//     marginLeft: width * 0.03,
//   },
//   backIcon: {
//     fontSize: 37,
//     color: 'black',
//     fontWeight: 'bold',
//   },
//   projectItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: width * 0.05,
//     paddingVertical: height * 0.04,
//     backgroundColor: '#ACCAC8',
//     marginBottom: 27,
//     borderRadius: 10,
//     marginLeft: width * 0.03,
//     marginRight: width * 0.03,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 9,
//     elevation: 9,
//   },
//   projectDetails: {
//     flex: 1,
//   },
//   projectID: {
//     color: 'black',
//     fontSize: 15,
//   },
//   CityCountry: {
//     color: 'black',
//     fontSize: 15,
//     fontWeight: 'bold',
//     marginTop: height * 0.02,
//   },
//   Date: {
//     color: 'black',
//     fontSize: 14,
//     marginTop: height * 0.02,
//   },
//   statusIcon: {
//     position: 'absolute',
//     top: height * 0.04,
//     right: width * 0.05,
//     color: 'black',
//   },
//   scrollViewContent: {
//     paddingBottom: height * 0.05,
//   },
//   emptyComponent: {
//     textAlign: 'center',
//     color: 'gray',
//     fontSize: 16,
//     marginTop: height * 0.3,
//   },
//   button: {
//     backgroundColor: '#48938F',
//     paddingVertical: height * 0.016,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: height * 0.3,
//     marginRight: width * 0.03,
//     marginLeft: width * 0.03,
//     borderWidth: 2,
//     borderColor: 'black',
//   },
//   buttonContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   plusSign: {
//     color: 'black',
//     fontSize: 28,
//     marginRight: 9,
//     fontWeight: 'bold',
//   },
//   buttonText: {
//     color: 'black',
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   errorContainer: {
//     alignItems: 'center',
//     marginTop: height * 0.3,
//   },
//   errorText: {
//     fontSize: 18,
//     color: 'red',
//   },
//   retryButton: {
//     backgroundColor: '#48938F',
//     marginTop: 10,
//     paddingVertical: height * 0.01,
//     borderRadius: 5,
//   },
//   retryButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });

// export default SetupScreen;











import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUploadStatus } from '../../ContextAPI/UploadStatusProvider';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const { width, height } = Dimensions.get('window');

const SetupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [projects, setProjects] = useState([]);
  const { getProjectStatus } = useUploadStatus();
  const [uploadedNotes, setUploadedNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to format dates
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString));
  };

  // Load projects from Firebase or AsyncStorage
  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = auth().currentUser;
      if (user && user.email) {
        const userProjectsRef = firestore()
          .collection('UserInformation')
          .doc(user.email)
          .collection('Project Created');
  
        const snapshot = await userProjectsRef.get();
        if (snapshot.empty) {
          throw new Error('No projects found in Firebase');
        }
  
        const firebaseProjects = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          isUploaded: true, // Always setting isUploaded to true
        }));
  
        setProjects(firebaseProjects);
        await AsyncStorage.setItem('projects', JSON.stringify(firebaseProjects));
      } else {
        throw new Error('User is not logged in');
      }
    } catch (error) {
      console.log('Error fetching projects from Firebase, fallback to AsyncStorage:', error);
      setError(error.message);
      loadProjectsFromAsyncStorage();
    } finally {
      setLoading(false);
    }
  }, []);
  
  const loadProjectsFromAsyncStorage = async () => {
    try {
      const storedProjects = await AsyncStorage.getItem('projects');
      if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects).map(project => ({
          ...project,
          isUploaded: true, // Always setting isUploaded to true
        }));
        setProjects(parsedProjects);
      }
    } catch (error) {
      console.error('Error loading projects from AsyncStorage:', error);
    }
  };
  

  useFocusEffect(
    useCallback(() => {
      loadProjects();
    }, [loadProjects]),
  );

  useEffect(() => {
    if (route.params?.uploadedNotes) {
      setUploadedNotes(route.params.uploadedNotes);
    }
  }, [route.params?.uploadedNotes]);

  const renderProject = ({ item }) => (
    <TouchableOpacity
      style={[styles.projectItem, !item.isUploaded && styles.disabled]}
      onPress={
        item.isUploaded
          ? () => navigation.navigate('UploadSetupScreen', { projectId: item.id })
          : null
      }>
      <View style={styles.projectDetails}>
        <Text style={styles.projectID}>{item.projectName}</Text>
        <Text style={styles.CityCountry}>
          {item.cityName || 'No city'},{' '}
          {item.country || 'No country'}
        </Text>
        <Text style={styles.Date}>
          {item.fromDate && item.toDate
            ? `${formatDate(item.fromDate)} - ${formatDate(item.toDate)}`
            : 'No date range'}
        </Text>
      </View>
      <View style={styles.iconContainer}>
        {item.isUploaded ? (
          <Icon name="cloud-done" size={28} color="black" />
        ) : (
          <Icon name="pending-actions" size={28} color="black" style={{ marginBottom: 35 }} />
        )}
        <TouchableOpacity onPress={() => deleteProject(item.id)}>
          <Icon name="delete" size={28} color="black" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  
  const deleteProject = async (projectId) => {
    try {
      const user = auth().currentUser;
      if (user && user.email) {
        await firestore()
          .collection('UserInformation')
          .doc(user.email)
          .collection('Project Created')
          .doc(projectId)
          .delete();
  
        const updatedProjects = projects.filter(project => project.id !== projectId);
        setProjects(updatedProjects);
        await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };
  
  

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={styles.backIconContainer}>
            <Text style={styles.backIcon}>{'\u2039'}</Text>
          </TouchableOpacity>
          <Text style={styles.header}>All Projects</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="black" />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={loadProjects} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={projects}
            renderItem={renderProject}
            ListEmptyComponent={
              <Text style={styles.emptyComponent}>No projects available</Text>
            }
            keyExtractor={item => item.id.toString()}
          />
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SetupDetail')}>
          <View style={styles.buttonContent}>
            <Text style={styles.plusSign}>+</Text>
            <Text style={styles.buttonText}>Create project</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: width * 0.05,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.05,
    marginTop: height * 0.03,
    marginRight: width * 0.03,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    flex: 1,
  },
  backIconContainer: {
    paddingRight: 8,
    marginLeft: width * 0.03,
  },
  backIcon: {
    fontSize: 37,
    color: 'black',
    fontWeight: 'bold',
  },
  projectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.04,
    backgroundColor: '#ACCAC8',
    marginBottom: 27,
    borderRadius: 10,
    marginLeft: width * 0.03,
    marginRight: width * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 9,
    elevation: 9,
  },
  projectDetails: {
    flex: 1,
  },
  projectID: {
    color: 'black',
    fontSize: 15,
  },
  CityCountry: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: height * 0.02,
  },
  Date: {
    color: 'black',
    fontSize: 14,
    marginTop: height * 0.02,
  },
  statusIcon: {
    position: 'absolute',
    top: height * 0.04,
    right: width * 0.05,
    color: 'black',
  
  },
  scrollViewContent: {
    paddingBottom: height * 0.05,
  },
  emptyComponent: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
    marginTop: height * 0.3,
  },
  button: {
    backgroundColor: '#48938F',
    paddingVertical: height * 0.016,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: height * 0.3,
    marginRight: width * 0.03,
    marginLeft: width * 0.03,
    borderWidth: 2,
    borderColor: 'black',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusSign: {
    color: 'black',
    fontSize: 28,
    marginRight: 9,
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: height * 0.3,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  retryButton: {
    backgroundColor: '#48938F',
    marginTop: 10,
    paddingVertical: height * 0.01,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SetupScreen;
