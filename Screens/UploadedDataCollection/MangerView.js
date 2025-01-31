// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   Dimensions,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { firestore } from 'firebase';  // Import Firestore
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const MangerView = ({route}) => {
//   const {projectId, noteSerial} = route.params;   // Extract projectId and noteSerial from route params
//   const [data, setData] = useState(null);    // State to store fetched data
//   const [loading, setLoading] = useState(true);   // State to handle loading indicator
//   const navigation = useNavigation();
  
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch project data from Firestore
//         const projectRef = firestore().collection('NotesUploaded').doc(projectId);
//         const projectDoc = await projectRef.get();
        
//         if (!projectDoc.exists) {
//           console.error(`No project found with ProjectName: ${projectId}`);
//           setLoading(false);
//           return;
//         }

//         // Fetch all notes data inside the project document
//         const notesCollection = projectRef.collection('Notes'); // assuming notes are in a sub-collection
//         const notesSnapshot = await notesCollection
//           .where('Serial', '==', noteSerial)  // Filter by Serial
//           .where('createdBy', '==', 'User1')  // Filter by createdBy (you may want to pass this from the route params)
//           .get();
        
//         if (notesSnapshot.empty) {
//           console.error(`No notes found with Serial: ${noteSerial}`);
//           setLoading(false);
//           return;
//         }

//         // Extract note data
//         const noteData = notesSnapshot.docs.map(doc => doc.data());

//         if (noteData.length === 0) {
//           console.error('No notes data found.');
//           setLoading(false);
//           return;
//         }

//         // Set the fetched data
//         setData(noteData[0]); // Assuming the note is unique
//       } catch (error) {
//         console.error('Error fetching data from Firestore:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [projectId, noteSerial]);   // Dependence array to refetch data when projectID or noteSerial changes

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#000" />
//       </View>
//     );
//   }

//   if (!data) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>No data found for this note.</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.row}>
//         <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.touchable}>
//           <Text style={styles.symbol}>{'\u2039'}</Text>
//         </TouchableOpacity>
//         <Text style={styles.date}>{data.Serial || 'N/A'}</Text>
//       </View>

//       {/* Location Section */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Location</Text>
//         <View style={styles.line} />
//         <Text style={styles.label}>Locality Designation:</Text>
//         <Text style={styles.value}>{data.localityDesignation || 'N/A'}</Text>

//         <Text style={styles.label}>Landmark Nearby:</Text>
//         <Text style={styles.value}>{data.landmarkNearby || 'N/A'}</Text>

//         <Text style={styles.label}>Latitude:</Text>
//         <Text style={styles.value}>{data.coordinates?.latitude || 'N/A'}</Text>
//         <Text style={styles.label}>Longitude:</Text>
//         <Text style={styles.value}>{data.coordinates?.longitude || 'N/A'}</Text>
//       </View>

//       {/* Planarians Section */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Planarians</Text>
//         <View style={styles.line} />
//         <Text style={styles.label}>
//           No. of vials :{' '}
//           <Text style={styles.value}>{data.numOfVials || 'N/A'}</Text>
//         </Text>
//         <Text style={styles.label}>
//           Morphs : <Text style={styles.value}>{data.morphs || 'N/A'}</Text>
//         </Text>
//         <Text style={styles.label}>
//           Abundance :{' '}
//           <Text style={styles.value}>{data.abundance || 'N/A'}</Text>
//         </Text>
//         <Text style={styles.label}>
//           Observations :{' '}
//           <Text style={styles.value}>{data.observation || 'N/A'}</Text>
//         </Text>
//       </View>

//       {/* Pictures Section */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Pictures</Text>
//         <View style={styles.line} />
//         <Text style={styles.label}>Vial picture</Text>
//         <TouchableOpacity
//           style={styles.habitatPicturesContainer}
//           onPress={() => {
//            const noteNumber = route.params?.note
//                ? route.params.note.Serial // If editing, keep the same Serial
//                : `Note 0${data.length + 1}`; // New note gets the next number
       
//            // Check if projectId exists before navigating
//            if (projectId) {
//              navigation.navigate('VialPictureUploaded', { 
//                projectId: projectId,        // Pass the project ID
//                serial: noteNumber,   
//              });
//            } else {
//              console.error('Project ID is not defined!');
//            }
//          }}
//         >       
//           <Image
//             style={styles.image}
//             source={{uri: data.images?.[0]?.uri || './placeholder.jpg'}}
//           />
//         </TouchableOpacity>

//         <Text style={styles.label}>Habitat pictures</Text>
//         <TouchableOpacity
//           style={styles.habitatPicturesContainer}
//           onPress={() => {
//            const noteNumber = route.params?.note
//                ? route.params.note.Serial // If editing, keep the same Serial
//                : `Note 0${data.length + 1}`; // New note gets the next number
       
//            // Check if projectId exists before navigating
//            if (projectId) {
//              navigation.navigate('HabitaPictureUploaded', { 
//                projectId: projectId,        // Pass the project ID
//                serial: noteNumber,   
//              });
//            } else {
//              console.error('Project ID is not defined!');
//            }
//          }}
//         >       
//           {data.imagess?.map((image, index) => (
//             <Image
//               key={index}
//               style={styles.image}
//               source={{uri: image.uri || './placeholder.jpg'}}
//             />
//           ))}
//         </TouchableOpacity>
//       </View>

//       {/* Habitats Section */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Habitats</Text>
//         <View style={styles.line} />
//         <Text style={styles.label}>Habitat Description</Text>
//         <View style={styles.tagsRow}>
//           {data.selectedHabitats?.map((item, index) => (
//             <Text key={index} style={styles.tag}>
//               {item}
//             </Text>
//           ))}
//         </View>
//         <Text style={styles.label}>Substrate</Text>
//         <View style={styles.tagsRow}>
//           {data.selectedSubstrates?.map((item, index) => (
//             <Text key={index} style={styles.tag}>
//               {item}
//             </Text>
//           ))}
//         </View>
//         <Text style={styles.label}>Water</Text>
//         <View style={styles.tagsRow}>
//           {data.selectedWaterTypes?.map((item, index) => (
//             <Text key={index} style={styles.tag}>
//               {item}
//             </Text>
//           ))}
//         </View>
//         <Text style={styles.label}>Geology</Text>
//         <View style={styles.tagsRow}>
//           {data.selectedGeology?.map((item, index) => (
//             <Text key={index} style={styles.tag}>
//               {item}
//             </Text>
//           ))}
//         </View>
//         <Text style={styles.label}>
//           Temperature :{' '}
//           <Text style={styles.value}>{data.temperature || 'N/A'} °C</Text>
//         </Text>
//         <Text style={styles.label}>
//           Hardness : <Text style={styles.value}>{data.hardness || 'N/A'}</Text>
//         </Text>
//         <Text style={styles.label}>
//           pH : <Text style={styles.value}>{data.pH || 'N/A'}</Text>
//         </Text>
//         <Text style={styles.label}>
//           Additional Notes :{' '}
//           <Text style={styles.value}>{data.additional || 'None'}</Text>
//         </Text>
//       </View>
//     </ScrollView>
//   );
// };

// const {width, height} = Dimensions.get('window');

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#D0E3DD',
//     padding: width * 0.04,
//   },
//   date: {
//     fontSize: width * 0.05,
//     fontWeight: 'bold',
//     color: '#000',
//     marginTop: width * 0.02,
//   },
//   section: {
//     marginBottom: height * 0.01,
//     marginTop: height * 0.04,
//     marginLeft: width * 0.02,
//   },
//   sectionTitle: {
//     fontSize: width * 0.045,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   line: {
//     height: 1,
//     backgroundColor: 'black',
//     marginVertical: 8,
//   },
//   label: {
//     fontSize: width * 0.043,
//     color: 'black',
//     marginBottom: height * 0.01,
//     fontWeight: 'bold',
//     marginTop: height * 0.02,
//   },
//   value: {
//     fontSize: width * 0.041,
//     color: 'black',
//     fontWeight: 'normal',
//   },
//   imageContainer: {
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   imageRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   image: {
//     width: width * 0.1,
//     height: width * 0.1,
//     marginRight: width * 0.05,
//     borderRadius: width * 0.02,
//   },
//   moreImages: {
//     width: 50,
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 5,
//   },
//   moreText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   tagsRow: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginVertical: 8,
//   },
//   tag: {
//     backgroundColor: '#000',
//     color: '#FFF',
//     fontSize: 14,
//     fontWeight: '500',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 15,
//     marginRight: 10,
//     marginBottom: 10,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#FF0000',
//   },
//   habitatPicturesContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     borderColor: 'black',
//     borderWidth: 1,
//     borderRadius: 10,
//     backgroundColor: '#D0E3DD',
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   symbol: {
//     fontSize: width * 0.1,
//     fontWeight: 'bold',
//     color: '#000',
//     marginRight: width * 0.04,
//     marginLeft: width * 0.02,
//   },
// });

// export default MangerView;








import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const MangerView = ({route}) => {
  const {projectId, noteSerial , projectName , createdBy} = route.params;   // Extract projectId and noteSerial from route params
  const [data, setData] = useState(null);    // State to store fetched data
  const [loading, setLoading] = useState(true);   // State to handle loading indicator
  const navigation = useNavigation();


useEffect(() => {
  const fetchNote = async () => {
    try {
      const projectRef = firestore().collection('NotesUploaded').doc(projectName);
      const projectDoc = await projectRef.get();

      if (!projectDoc.exists) {
        console.error(`No project found with ID: ${projectName}`);
        setLoading(false);
        return;
      }

      const projectData = projectDoc.data();
      console.log('Fetched project data:', projectData); // Log the fetched project data
      if (!projectData.notes || !Array.isArray(projectData.notes)) {
        console.error('No notes array found.');
        setLoading(false);
        return;
      }

      // Find the note with the matching Serial
      const selectedNote = projectData.notes.find(note => note.Serial === noteSerial);
      console.log('Selected note:', selectedNote); // Log the selected note
      
      if (!selectedNote) {
        console.error(`No note found with Serial: ${noteSerial}`);
        setLoading(false);
        return;
      }

      setData(selectedNote); // Corrected from setNoteData to setData
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchNote();
}, [projectId, noteSerial]);


  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.touchable}>
          <Text style={styles.symbol}>{'\u2039'}</Text>
        </TouchableOpacity>
        <Text style={styles.date}>{data?.Serial || 'N/A'}</Text>
      </View>

      {/* Location Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.line} />
        <Text style={styles.label}>Locality Designation:</Text>
        <Text style={styles.value}>{data?.localityDesignation || 'N/A'}</Text>

        <Text style={styles.label}>Landmark Nearby:</Text>
        <Text style={styles.value}>{data?.landmarkNearby || 'N/A'}</Text>

        <Text style={styles.label}>Latitude:</Text>
        <Text style={styles.value}>{data?.coordinates?.latitude || 'N/A'}</Text>
        <Text style={styles.label}>Longitude:</Text>
        <Text style={styles.value}>{data?.coordinates?.longitude || 'N/A'}</Text>
      </View>

      {/* Planarians Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Planarians</Text>
        <View style={styles.line} />
        <Text style={styles.label}>
          No. of vials :{' '}
          <Text style={styles.value}>{data?.numOfVials || 'N/A'}</Text>
        </Text>
        <Text style={styles.label}>
          Morphs : <Text style={styles.value}>{data?.morphs || 'N/A'}</Text>
        </Text>
        <Text style={styles.label}>
          Abundance :{' '}
          <Text style={styles.value}>{data?.abundance || 'N/A'}</Text>
        </Text>
        <Text style={styles.label}>
          Observations :{' '}
          <Text style={styles.value}>{data?.observation || 'N/A'}</Text>
        </Text>
      </View>

      {/* Pictures Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pictures</Text>
        <View style={styles.line} />
        <Text style={styles.label}>Vial picture</Text>
        <TouchableOpacity
          style={styles.habitatPicturesContainer}
          onPress={() => {
           const noteNumber = route.params?.note
               ? route.params.note.Serial // If editing, keep the same Serial
               : `Note 0${data.length + 1}`; // New note gets the next number
       
           // Check if projectId exists before navigating
           if (projectId) {
             navigation.navigate('VialPictureUploaded', { 
               projectId: projectId,        // Pass the project ID
               serial: noteNumber,   
             });
           } else {
             console.error('Project ID is not defined!');
           }
         }}
        >       
          <Image
            style={styles.image}
            source={{uri: data?.images?.[0]?.uri || './placeholder.jpg'}}
          />
        </TouchableOpacity>

        <Text style={styles.label}>Habitat pictures</Text>
        <TouchableOpacity
          style={styles.habitatPicturesContainer}
          onPress={() => {
           const noteNumber = route.params?.note
               ? route.params.note.Serial // If editing, keep the same Serial
               : `Note 0${data.length + 1}`; // New note gets the next number
       
           // Check if projectId exists before navigating
           if (projectId) {
             navigation.navigate('HabitaPictureUploaded', { 
               projectId: projectId,        // Pass the project ID
               serial: noteNumber,   
             });
           } else {
             console.error('Project ID is not defined!');
           }
         }}
        >       
          {data?.imagess?.map((image, index) => (
            <Image
              key={index}
              style={styles.image}
              source={{uri: image.uri || './placeholder.jpg'}}
            />
          ))}
        </TouchableOpacity>
      </View>

      {/* Habitats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Habitats</Text>
        <View style={styles.line} />
        <Text style={styles.label}>Habitat Description</Text>
        <View style={styles.tagsRow}>
          {data?.selectedHabitats?.map((item, index) => (
            <Text key={index} style={styles.tag}>
              {item}
            </Text>
          ))}
        </View>
        <Text style={styles.label}>Substrate</Text>
        <View style={styles.tagsRow}>
          {data?.selectedSubstrates?.map((item, index) => (
            <Text key={index} style={styles.tag}>
              {item}
            </Text>
          ))}
        </View>
        <Text style={styles.label}>Water</Text>
        <View style={styles.tagsRow}>
          {data?.selectedWaterTypes?.map((item, index) => (
            <Text key={index} style={styles.tag}>
              {item}
            </Text>
          ))}
        </View>
        <Text style={styles.label}>Geology</Text>
        <View style={styles.tagsRow}>
          {data?.selectedGeology?.map((item, index) => (
            <Text key={index} style={styles.tag}>
              {item}
            </Text>
          ))}
        </View>
        <Text style={styles.label}>
          Temperature :{' '}
          <Text style={styles.value}>{data?.temperature || 'N/A'} °C</Text>
        </Text>
        <Text style={styles.label}>
          Hardness : <Text style={styles.value}>{data?.hardness || 'N/A'}</Text>
        </Text>
        <Text style={styles.label}>
          pH : <Text style={styles.value}>{data?.pH || 'N/A'}</Text>
        </Text>
        <Text style={styles.label}>
          Additional Notes :{' '}
          <Text style={styles.value}>{data?.additional || 'None'}</Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D0E3DD',
    padding: width * 0.04,
  },
  date: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#000',
    marginTop: width * 0.02,
  },
  section: {
    marginBottom: height * 0.01,
    marginTop: height * 0.04,
    marginLeft: width * 0.02,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#000',
  },
  line: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 8,
  },
  label: {
    fontSize: width * 0.043,
    color: 'black',
    marginBottom: height * 0.01,
    fontWeight: 'bold',
    marginTop: height * 0.02,
  },
  value: {
    fontSize: width * 0.041,
    color: 'black',
    fontWeight: 'normal',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: width * 0.1,
    height: width * 0.1,
    marginRight: width * 0.05,
    borderRadius: width * 0.02,
  },
  moreImages: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  moreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  tag: {
    backgroundColor: '#000',
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
  },
  habitatPicturesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#D0E3DD',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbol: {
    fontSize: width * 0.1,
    fontWeight: 'bold',
    color: '#000',
    marginRight: width * 0.04,
    marginLeft: width * 0.02,
  },
});

export default MangerView;
