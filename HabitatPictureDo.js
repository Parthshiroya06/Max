// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';

// const HabitatPictureDo = ({ route }) => {
//     const { projectId, noteSerialNumber } = route.params || {}; // Retrieve project ID and note serial from navigation params
//     const [images, setImages] = useState([]);
//     const [imageNames, setImageNames] = useState([]);
//     const [imageSizeMBs, setImageSizeMBs] = useState([]);

//     useEffect(() => {
//         const fetchImages = async () => {
//             try {
//                 // Fetch data from AsyncStorage using project ID and note serial number
//                 const key = `${projectId}_notes_${noteSerialNumber}`;
//                 const storedImages = await AsyncStorage.getItem(`${key}_images`);
//                 const storedNames = await AsyncStorage.getItem(`${key}_names`);
//                 const storedSizes = await AsyncStorage.getItem(`${key}_sizes`);

//                 if (storedImages && storedNames && storedSizes) {
//                     setImages(JSON.parse(storedImages));
//                     setImageNames(JSON.parse(storedNames));
//                     setImageSizeMBs(JSON.parse(storedSizes));
//                 }
//             } catch (error) {
//                 console.error('Error fetching data from AsyncStorage:', error);
//             }
//         };

//         fetchImages();
//     }, [projectId, noteSerialNumber]);

//     const handleDelete = async (index) => {
//         try {
//             // Delete the selected image
//             const updatedImages = [...images];
//             const updatedNames = [...imageNames];
//             const updatedSizes = [...imageSizeMBs];

//             updatedImages.splice(index, 1);
//             updatedNames.splice(index, 1);
//             updatedSizes.splice(index, 1);

//             setImages(updatedImages);
//             setImageNames(updatedNames);
//             setImageSizeMBs(updatedSizes);

//             // Update AsyncStorage
//             const key = `${projectId}_notes_${noteSerialNumber}`;
//             await AsyncStorage.setItem(`${key}_images`, JSON.stringify(updatedImages));
//             await AsyncStorage.setItem(`${key}_names`, JSON.stringify(updatedNames));
//             await AsyncStorage.setItem(`${key}_sizes`, JSON.stringify(updatedSizes));
//         } catch (error) {
//             console.error('Error deleting image from AsyncStorage:', error);
//         }
//     };

//     const renderItem = ({ item, index }) => (
//         <View style={styles.itemContainer}>
//             <FontAwesome name="file-picture-o" size={34} color="black" />
//             <View style={styles.itemText}>
//                 <Text style={styles.imageName}>{imageNames[index] || 'Unnamed'}.jpeg</Text>
//                 <Text style={styles.imageSize}>{imageSizeMBs[index] || '0'} MB</Text>
//             </View>
//             <TouchableOpacity onPress={() => handleDelete(index)}>
//                 <Icon name="delete" size={30} color="black" />
//             </TouchableOpacity>
//         </View>
//     );

//     return (
//         <View style={styles.container}>
//             <Text style={styles.header}>Habitat Pictures</Text>
//             {images.length > 0 ? (
//                 <FlatList
//                     data={images}
//                     keyExtractor={(item, index) => index.toString()}
//                     renderItem={renderItem}
//                     contentContainerStyle={styles.list}
//                 />
//             ) : (
//                 <Text style={styles.noImagesText}>No images found</Text>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         padding: 20,
//     },
//     header: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 20,
//         textAlign: 'center',
//         color: 'black',
//     },
//     list: {
//         marginTop: 10,
//     },
//     itemContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#B9D1D0',
//         padding: 15,
//         borderRadius: 8,
//         marginBottom: 10,
//     },
//     itemText: {
//         flex: 1,
//         marginLeft: 15,
//     },
//     imageName: {
//         fontSize: 16,
//         color: '#333',
//     },
//     imageSize: {
//         fontSize: 14,
//         color: '#777',
//         marginTop: 4,
//     },
//     noImagesText: {
//         textAlign: 'center',
//         marginTop: 50,
//         fontSize: 18,
//         color: 'gray',
//     },
// });

// export default HabitatPictureDo;

