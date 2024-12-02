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

const HabitatPicture = ({ route }) => {
  const { projectId, serial } = route.params;
  const [imagess, setImagess] = useState([]);
  const [showImage, setShowImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dialogVisibles, setDialogVisibles] = useState(false);
  const [customImageNames, setCustomImageNames] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const projectData = await AsyncStorage.getItem(projectId);
        if (projectData) {
          const parsedData = JSON.parse(projectData);
          const note = parsedData.find((n) => n.Serial === serial);
          if (note && note.imagess) {
            setImagess(note.imagess);
          }
        }
      } catch (error) {
        console.error('Error fetching image data:', error);
      }
    };

    fetchImageData();
  }, [projectId, serial]);

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
  

  const handleImagePress = (image) => {
    setSelectedImage(image);
    setShowImage(true);
  };

  const handleBackPress = () => {
    setShowImage(false);
    setSelectedImage(null);
  };

  const openCameraHabitat = async () => {
    const options = { mediaType: 'photo', quality: 1 };
    try {
      const result = await launchCamera(options);
      if (result.assets && result.assets.length > 0) {
        const newImage = { uri: result.assets[0].uri };
        setImagess([...imagess, newImage]);
        setDialogVisibles(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open camera.');
    }
  };

  const handleHabitatSaveImage = async () => {
    if (!customImageNames.trim()) {
      Alert.alert('Error', 'Please enter a valid name for the image.');
      return;
    }
  
    try {
      // Update the last image in the list with the custom name
      const lastImage = imagess[imagess.length - 1];
      const updatedImage = { ...lastImage, name: customImageNames };
      const updatedImagess = [...imagess];
      updatedImagess[imagess.length - 1] = updatedImage;
  
      // Save updated image list to AsyncStorage
      setImagess(updatedImagess);
      await saveImagesToStorage(updatedImagess);
  
      // Clear dialog inputs and close dialog
      setCustomImageNames('');
      setDialogVisibles(false);
    } catch (error) {
      console.error('Error saving custom image name:', error);
    }
  };
  

  const handleDeleteImage = (uri) => {
    const updatedImages = imagess.filter((img) => img.uri !== uri);
    setImagess(updatedImages);
    saveImagesToStorage();
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
            <TouchableOpacity onPress={() => navigation.navigate('CollectScreen')}>
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
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 30,
    marginLeft: 25,
  },
  backText2: {
    fontSize: 37,
    marginRight: 95,
    color: 'black',
    fontWeight: 'bold',
  },
  noteEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B9D1D0',
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
    width: width * 0.85,
    alignSelf: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  iconContainer2: {
    marginLeft: 'auto',
  },
  noteInfo: {
    justifyContent: 'center',
    flex: 1,
  },
  imageName: {
    fontSize: 16,
    color: '#333',
  },
  imageSize: {
    fontSize: 14,
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
    fontSize: 24,
    color: 'black',
    marginTop: height * 0.05,
  },
  listContent: {
    paddingBottom: 20,
  },
  captureButton: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4B9E9E',
    paddingVertical: 13,
    paddingHorizontal: 90,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'black',
  },
  captureButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default HabitatPicture;
