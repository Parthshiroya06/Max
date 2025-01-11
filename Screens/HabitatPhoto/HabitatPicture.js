import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { launchCamera } from 'react-native-image-picker';
import Dialog from 'react-native-dialog';

const { width, height } = Dimensions.get('window');


// Define the HabitatPicture component
const HabitatPicture = ({ route }) => {
  const { projectId, serial ,  note: initialNote } = route.params;
  const [imagess, setImagess] = useState([]);
  const [showImage, setShowImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dialogVisibles, setDialogVisibles] = useState(false);
  const [customImageNames, setCustomImageNames] = useState('');
  const navigation = useNavigation();
  const [note, setNote] = useState(initialNote || null); // State to store the note if not passed initially


  const [localityNumber, setLocalityNumber] = useState("01"); // Example for locality number
    const [countryName, setCountryName] = useState(route.params?.countryName || "AUS"); 


  // Fetch image data on component mount or when dependencies change
  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const projectData = await AsyncStorage.getItem(projectId); // Retrieve project data from storage
        if (projectData) {
          const parsedData = JSON.parse(projectData); // Parse the project data


          const fetchedNote = parsedData.find(n => n.Serial === serial); // Find the specific note by serial
          if (fetchedNote) {
            setNote(fetchedNote); // Set note if not already available
            setImagess(fetchedNote.imagess); // Set all images from the note

            
            
          } else {
            console.error('Note not found for serial:', serial);
          }
        }
      } catch (error) {
        console.error('Error fetching image data:', error);
      }
    };

    if (!initialNote) {
      fetchImageData(); // Fetch image data if initialNote is not provided
    }
  }, [projectId, serial, initialNote]);

  // Save updated images to storage
  const saveImagesToStorage = async (updatedImagess) => {
    try {
      const projectData = await AsyncStorage.getItem(projectId);
      if (projectData) {
        const parsedData = JSON.parse(projectData);
        const noteIndex = parsedData.findIndex((n) => n.Serial === serial);

        
        if (noteIndex !== -1) {
          parsedData[noteIndex].imagess = updatedImagess;
          await AsyncStorage.setItem(projectId, JSON.stringify(parsedData));

        }
      }
    } catch (error) {
      console.error('Error saving images:', error);
    }
  };
  
  // Handle image press to show image preview
  const handleImagePress = (image) => {
    setSelectedImage(image);
    setShowImage(true);
  };

  // Handle back press to close image preview
  const handleBackPress = () => {
    setShowImage(false);
    setSelectedImage(null);
  };

  // Open camera to capture a habitat picture
  const openCameraHabitat = async () => {
          const options = {
            mediaType: 'photo',
            cameraType: 'back',
            quality: 1,
          };
        
          try {
            const result = await launchCamera(options);
            if (result.didCancel) {
              console.log('User cancelled camera');
            } else if (result.errorCode) {
              console.error('Camera error: ', result.errorCode);
              Alert.alert('Camera Error', result.errorMessage);
            } else if (result.assets && result.assets.length > 0) {
              const asset = result.assets[0];
              const sizeInMB = (asset.fileSize / (1024 * 1024)).toFixed(2); // Convert fileSize to MB
        
              // Generate the image name automatically
              const year = new Date().getFullYear().toString().slice(-2); // Last 2 digits of the year
              const expedition = 'E1';
              const habitatCount = imagess.length + 1; // Increment for each habitat image
              const generatedImageName = `${countryName.slice(0, 3).toUpperCase()}${year}${expedition}_L${localityNumber}_H${habitatCount}`;
        
              const newImage = {
                uri: asset.uri,
                name: generatedImageName,
                sizeMB: sizeInMB,
              };
        
              // Add the new image to the imagess state
              setImagess([...imagess, newImage]);
              console.log('Image saved with name:', generatedImageName);
            }
          } catch (error) {
            console.error('Error opening camera: ', error);
            Alert.alert('Error', 'Failed to open camera');
          }
        };
        

  // Handle saving the custom image name
  const handleHabitatSaveImage = async () => {
    if (!customImageNames.trim()) {
      Alert.alert('Error', 'Please enter a valid name for the image.');
      return;
    }
  
    try {
      // Update the last image in the list with the custom name
      const lastImage = imagess[imagess.length - 1]; // Get the last image in the list
      const updatedImage = { ...lastImage, name: customImageNames }; // Update the last image with the custom name
      const updatedImagess = [...imagess]; // Update the images state
      updatedImagess[imagess.length - 1] = updatedImage; // Update the images state
  
      // Save updated image list to AsyncStorage
      setImagess(updatedImagess);
      await saveImagesToStorage(updatedImagess);
  
      // Log the saved image and updated images list
      console.log('Custom image saved:', updatedImage); // Set the updated images state
      console.log('Updated images list:', updatedImagess);  // Save updated images to storage

      if (note) {
        setNote(prevNote => ({
          ...prevNote,
          imagess: updatedImagess,  // Update the images in the note
        }));
      }
  
      // Clear dialog inputs and close dialog
      setCustomImageNames('');
      setDialogVisibles(false);
    } catch (error) {
      console.error('Error saving custom image name:', error);
    }
  };
  
  // Handle deleting an image
  const handleDeleteImage = async (imageUri) => {
    try {
      console.log('Deleting image with URI:', imageUri);
  
      // Remove selected image from the 'images' array
      const updatedImagess = imagess.filter(image => image.uri !== imageUri);
      console.log('Updated images array after deletion:', updatedImagess);
  
      // Update the images state
      setImagess(updatedImagess);
  
      // If note is already set, update the note object as well
      if (note) {
        setNote(prevNote => ({
          ...prevNote,
          imagess: updatedImagess,  // Update the images in the note
        }));
      }
  
      // Fetch the project data from AsyncStorage
      const projectData = await AsyncStorage.getItem(projectId); // Retrieve project data from storage
      if (projectData) {
        const parsedData = JSON.parse(projectData); // Parse the project data
  
        // Find the note in the project data
        const noteIndex = parsedData.findIndex(n => n.Serial === serial);
  
        if (noteIndex > -1) {
          // Update the images in the note
          parsedData[noteIndex].imagess = updatedImagess;
         
          // Save the updated project data to AsyncStorage
          await AsyncStorage.setItem(projectId, JSON.stringify(parsedData));  
          console.log('Successfully saved updated project data to AsyncStorage.');
    
        } else {
          console.error('Note not found in project data.');
        }
      } else {
        console.error('Project data not found in AsyncStorage.');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      {showImage && selectedImage ? (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} resizeMode="contain" />
          <TouchableOpacity onPress={handleBackPress}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.headerContainer}>
            <TouchableOpacity 
             onPress={() => {
              navigation.navigate('CollectScreen' , {
                 note,  // Pass the updated note
                projectId,
            });
            }}
            >
              <Text style={styles.backText2}>{'\u2039'}</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Habitat Picture</Text>
          </View>
          <FlatList
            data={imagess}
            keyExtractor={(item, index) => `${item.uri}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.noteEntry} onPress={() => handleImagePress(item)}>
                <View style={styles.iconContainer}>
                  <FontAwesome name="file-picture-o" size={34} color="black" />
                </View>
                <View style={styles.noteInfo}>
                  <Text style={styles.imageName}>{item.name || 'Unnamed'}.jpeg</Text>
                  <Text style={styles.imageSize}>{item.sizeMB || '0'}MB</Text>
                </View>
                <TouchableOpacity style={styles.iconContainer2} onPress={() => handleDeleteImage(item.uri)}>
                  <Icon name="delete" size={32} color="black" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.captureButton} onPress={openCameraHabitat}>
            <FontAwesome name="camera" size={20} color="black" />
            <Text style={styles.captureButtonText}>Capture</Text>
          </TouchableOpacity>
        </>
      )}

      <Dialog.Container visible={dialogVisibles}>
        <Dialog.Title>Save Image</Dialog.Title>
        <Dialog.Description>Enter a name for the photo you just captured:</Dialog.Description>
        <Dialog.Input value={customImageNames} onChangeText={setCustomImageNames} placeholder="Image name" />
        <Dialog.Button label="Cancel" onPress={() => setDialogVisibles(false)} />
        <Dialog.Button label="Save" onPress={handleHabitatSaveImage} />
      </Dialog.Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  header: {
    fontSize: width * 0.052,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  headerContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: width * 0.03,
    marginBottom: height * 0.03,
    marginLeft: width * 0.05,
  },
  backText2: {
    fontSize: width * 0.09,
    marginRight: width * 0.25,
    marginBottom: height * 0.001,
    color: 'black',
    fontWeight: 'bold',
  },
  noteEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B9D1D0',
    padding: width * 0.04,
    borderRadius: 8,
    marginVertical: height * 0.01,
    width: width * 0.85,
    alignSelf: 'center',
  },
  iconContainer: {
    marginRight: width * 0.03,
  },
  iconContainer2: {
    marginLeft: 'auto',
  },
  noteInfo: {
    justifyContent: 'center',
    flex: 1, 
  },
  imageName: {
    fontSize: width * 0.04,
    color: '#333',
  },
  imageSize: {
    fontSize: width * 0.035,
    color: '#777',
    marginTop: 4,
  },
  imagePreview: {
    width: width * 0.99, 
    height: height * 0.65, 
    borderWidth: 3,
    borderColor: 'black',
    marginTop: height * 0.15,
  },
  imagePreviewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: width * 0.05,
    color: 'black',
    fontWeight:"bold",
    marginTop: height * 0.05,
  },
  listContent: {
   paddingBottom: height * 0.02,
  },
});

export default HabitatPicture;













