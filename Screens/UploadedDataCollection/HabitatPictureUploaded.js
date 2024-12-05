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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

// Define the HabitatPictureUploaded component
const HabitatPictureUploaded = ({route}) => {
  const {projectId, serial} = route.params; // Receive projectId and serial from route params
  const [imagess, setImagess] = useState([]); // State to store all images
  const [showImage, setShowImage] = useState(false); // State to toggle image preview visibility
  const [selectedImage, setSelectedImage] = useState(null); // State to track selected image for full view
  const navigation = useNavigation();

  // Fetch image data on component mount or when dependencies change
  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const projectData = await AsyncStorage.getItem(projectId); // Retrieve project data from storage
        if (projectData) {
          const parsedData = JSON.parse(projectData); // Parse the project data
          const note = parsedData.find(n => n.Serial === serial); // Find the specific note by serial
          if (note && note.imagess) {
            setImagess(note.imagess); // Set all images from the note
          }
        }
      } catch (error) {
        console.error('Error fetching image data:', error);
      }
    };

    fetchImageData(); // Call the function to fetch image data
  }, [projectId, serial]);

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
            <TouchableOpacity onPress={() => navigation.navigate('Project')}>
              <Text style={styles.backText2}>{'\u2039'}</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Habitat Picture</Text>
          </View>
          <FlatList
            data={imagess}
            keyExtractor={(item, index) => `${item.uri}-${index}`}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.noteEntry}
                onPress={() => handleImagePress(item)}>
                <View style={styles.iconContainer}>
                  <FontAwesome name="file-picture-o" size={34} color="black" />
                </View>
                <View style={styles.noteInfo}>
                  <Text style={styles.imageName}>
                    {item.name || 'Unnamed'}.jpeg
                  </Text>
                  <Text style={styles.imageSize}>{item.sizeMB || '0'}MB</Text>
                </View>
              </TouchableOpacity>
            )}
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
    fontWeight: 'bold',
    marginTop: height * 0.05,
  },
  listContent: {
    paddingBottom: height * 0.02,
  },
});

export default HabitatPictureUploaded;
