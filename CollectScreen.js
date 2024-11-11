// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useUploadStatus } from './UploadStatusProvider';

// const CollectScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { width } = Dimensions.get('window');
  
//   // Correctly destructuring the values from useUploadStatus
//   const { isUploaded, setIsUploaded } = useUploadStatus(); 
//   const [uploadedNotes, setUploadedNotes] = useState([]);

//   const projectDetails = {
//     id: '#projectid01',
//     timeFrame: '25th Oct - 25th Nov',
//     country: 'India',
//     city: 'Bhopal',
//   };

//   useEffect(() => {
//     if (route.params?.uploadedNotes) {
//       setUploadedNotes(route.params.uploadedNotes);
//     }
//   }, [route.params?.uploadedNotes]);

//   return (
//     <View style={styles.container}>
//       <Text style={[styles.projectDetails, { fontSize: width > 400 ? 24 : 20 }]}>Projects</Text>

//       <TouchableOpacity
//         style={[styles.middleSection, isUploaded && styles.disabled]}
//         onPress={() => navigation.navigate('ProjectDetails', { uploadedNotes })} 
//       >
//         <View style={styles.projectInfoContainer}>
//           <Text style={[styles.projectInfo, { fontSize: width > 400 ? 18 : 16 }]}>{projectDetails.id}</Text>
//           <Text style={[styles.projectInfo, { fontSize: width > 400 ? 18 : 16 }]}>
//             <Text style={styles.boldText}>{projectDetails.city}, {projectDetails.country}</Text>
//           </Text>
//           <Text style={[styles.projectInfo, { fontSize: width > 400 ? 18 : 16 }]}>{projectDetails.timeFrame}</Text>

//           <View style={styles.statusIcon}>
//             {isUploaded ? (
//               <Icon name="cloud-done" size={28} color="black" />
//             ) : (
//               <Icon name="pending-actions" size={28} color="black" />
//             )}
//           </View>
//         </View>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     paddingHorizontal: '5%',
//   },
//   projectDetails: {
//     fontWeight: 'bold',
//     color: 'black',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   middleSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     width: '100%',
//     borderWidth: 1,
//     borderColor: 'white',
//     marginTop: 20,
//     borderRadius: 10,
//     backgroundColor: '#ACCAC8',
//     padding: '4%',
//   },
//   projectInfoContainer: {
//     flex: 1,
//     width: '90%',
//     paddingHorizontal: 15,
//     height: 110,
//   },
//   projectInfo: {
//     marginBottom: 0,
//     color: '#000000',
//     marginTop: 12,
//   },
//   boldText: {
//     fontWeight: 'bold',
//   },
//   statusIcon: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     fontSize: 24,
//     color: 'black',
//   },
// });

// export default CollectScreen;





import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Dimensions } from 'react-native';
import { useNavigation , useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUploadStatus } from './UploadStatusProvider';

const { width, height } = Dimensions.get('window');

const CollectScreen = () => {
  const navigation = useNavigation();
  const [projects, setProjects] = useState([]);

    //Correctly destructuring the values from useUploadStatus
  const { isUploaded, setIsUploaded } = useUploadStatus(); 
  const [uploadedNotes, setUploadedNotes] = useState([]);
  const route = useRoute();


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



  useEffect(() => {
    if (route.params?.uploadedNotes) {
      setUploadedNotes(route.params.uploadedNotes);
    }
  }, [route.params?.uploadedNotes]);



  const renderProject = ({ item }) => (
    <TouchableOpacity 
      style={[styles.projectItem, isUploaded && styles.disabled]}
      onPress={() => navigation.navigate('ProjectDetails', { uploadedNotes })}
    >
      <View style={styles.projectDetails}>
        <Text style={styles.projectID}>{item.id}</Text>
        <Text style={styles.CityCountry}>{item.substrates.join(', ')}, {item.waterTypes.join(', ')}</Text>
        <Text style={styles.Date}>
          {item.fromDate && item.toDate ? `${new Date(item.fromDate).toLocaleDateString()} - ${new Date(item.toDate).toLocaleDateString()}` : 'No date range'}
        </Text>
      </View>
      <View style={styles.statusIcon}>
        {isUploaded ? (
          <Icon name="cloud-done" size={28} color="black" />
        ) : (
          <Icon name="pending-actions" size={28} color="black" />
        )}
      </View>
    </TouchableOpacity>
  );

  
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Home2')} style={styles.backIconContainer}>
            <Text style={styles.backIcon}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Projects</Text>
        </View>


        {/*  This FlatList renders the list of projects. */}
        <FlatList
          data={projects}
          renderItem={renderProject}
          ListEmptyComponent={<Text style={styles.emptyComponent}>No projects available</Text>}
          keyExtractor={(item) => item.id.toString()}
        />
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
    marginTop:height * 0.03,
    marginRight:width * 0.03
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
    marginLeft:width * 0.03
  },
  backIcon: {
    fontSize: 37,
    color: 'black',
    fontWeight: 'bold'
  },
  projectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.04,
    backgroundColor: '#ACCAC8',
    marginBottom: 27,
    borderRadius: 10,
    marginLeft:width * 0.03,
    marginRight:width * 0.03,
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
    fontWeight: 'bold',
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
    color:"black"
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
});

export default CollectScreen;

