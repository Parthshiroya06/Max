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

const VialPictureUplaoded = ({route}) => {
  const {projectId, serial} = route.params; // Receive projectId and serial from route params
  const [images, setImages] = useState([]); // To store all images
  const [showImage, setShowImage] = useState(false); // State to toggle visibility
  const [selectedImage, setSelectedImage] = useState(null); // Track selected image for full view
  const navigation = useNavigation();

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        console.log('serial:', serial);
        console.log('projectId:', projectId);

        const projectData = await AsyncStorage.getItem(projectId);
        if (projectData) {
          const parsedData = JSON.parse(projectData);
          console.log('parsedData:', parsedData);

          const note = parsedData.find(n => n.Serial === serial); // Find the specific note by serial
          console.log('note:', note);

          if (note && note.images) {
            setImages(note.images); // Set all images from the note
          }
        }
      } catch (error) {
        console.error('Error fetching image data:', error);
      }
    };

    fetchImageData();
  }, [projectId, serial]);

  const handleImagePress = image => {
    setSelectedImage(image);
    setShowImage(true);
  };

  const handleBackPress = () => {
    setShowImage(false);
    setSelectedImage(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Show image when `showImage` is true */}
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
          {/* Header shown only with FlatList */}
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Project')}>
              <Text style={styles.backText2}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Vial Picture</Text>
          </View>

          {/* List of images */}
          <FlatList
            data={images}
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
    fontSize: 22,
    fontWeight: 'bold',
    // marginBottom: 30,
    textAlign: 'center',
    color: 'black',
  },
  headerContainer: {
    flexDirection: 'row', // Display items in a row
    alignItems: 'center', // Align items vertically in the center
    padding: 10, // Optional: Add padding for better spacing
    marginBottom: 30,
    marginLeft: 25,
  },
  backText2: {
    fontSize: 37, // Adjust size of the back icon
    marginRight: 95, // Add some space between the back icon and the text
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
    width: width * 0.85, // 90% of the screen width
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
    flex: 1, // Allow text to take up remaining space
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
    width: width * 0.99, // 90% of the screen width
    height: height * 0.65, // 60% of the screen height
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
});

export default VialPictureUplaoded ;
