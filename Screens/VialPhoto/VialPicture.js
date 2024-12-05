import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

// Define the VialPicture component
const VialPicture = ({route}) => {
  const {projectId, serial, note: initialNote} = route.params; // Extract route parameters
  const [note, setNote] = useState(initialNote || null); // State to store the note if not passed initially
  const [images, setImages] = useState([]); // To store all images
  const [showImage, setShowImage] = useState(false); // State to toggle visibility
  const [selectedImage, setSelectedImage] = useState(null); // Track selected image for full view
  const navigation = useNavigation();

  // Fetch image data on component mount or when dependencies change
  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const projectData = await AsyncStorage.getItem(projectId); // Retrieve project data from storage
        if (projectData) {
          const parsedData = JSON.parse(projectData);  // Parse the project data
          const fetchedNote = parsedData.find(n => n.Serial === serial); // Find the specific note by serial
          if (fetchedNote) {
            setNote(fetchedNote); // Set note if not already available
            setImages(fetchedNote.images); // Set all images from the note
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

  // Handle image press to show image preview
  const handleImagePress = image => {
    setSelectedImage(image);
    setShowImage(true);
  };

  // Handle back press to close image preview
  const handleBackPress = () => {
    setShowImage(false);
    setSelectedImage(null);
  };

  // Handle deleting an image
  const handleDeleteImage = async (imageUri) => {
  try {
    console.log('Deleting image with URI:', imageUri);  

    // Remove selected image from the 'images' array
    const updatedImages = images.filter(image => image.uri !== imageUri); // Remove the image from the list
    console.log('Updated images array after deletion:', updatedImages);

    // Update the images state
    setImages(updatedImages);

    // If note is already set, update the note object as well
    if (note) {
      setNote(prevNote => ({
        ...prevNote,
        images: updatedImages,  // Update the images in the note
      }));
    }

    // Fetch the project data from AsyncStorage
    const projectData = await AsyncStorage.getItem(projectId);
    if (projectData) {
      const parsedData = JSON.parse(projectData);

      // Find the note in the project data
      const noteIndex = parsedData.findIndex(n => n.Serial === serial);

      if (noteIndex > -1) {
        // Update the images in the note
        parsedData[noteIndex].images = updatedImages;
       
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
          <Image
            source={{uri: selectedImage.uri}}
            style={styles.imagePreview}
            resizeMode="contain"
          />
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
            <Text style={styles.header}>Vial Picture</Text>
          </View>

          <FlatList
            data={images}
            keyExtractor={(item, index) => `${item.uri}-${index}`}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.noteEntry}
                onPress={() => handleImagePress(item)}
              >
                <View style={styles.iconContainer}>
                  <FontAwesome name="file-picture-o" size={34} color="black" />
                </View>
                <View style={styles.noteInfo}>
                  <Text style={styles.imageName}>
                    {item.name || 'Unnamed'}.jpeg
                  </Text>
                  <Text style={styles.imageSize}>{item.sizeMB || '0'}MB</Text>
                </View>
                <TouchableOpacity
                  style={styles.iconContainer2}
                  onPress={() => handleDeleteImage(item.uri)}
                >
                  <Icon name="delete" size={32} color="black" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
          />
        </>
      )}
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
    marginRight: width * 0.26,
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

export default VialPicture;
