import React, { useState , useEffect , route} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView , Platform, PermissionsAndroid, Alert , Image} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchCamera} from 'react-native-image-picker';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import Dialog from 'react-native-dialog'; 
import {useRoute } from '@react-navigation/native';
import { useUploadStatus } from './UploadStatusProvider';

const CollectScreen = () => {
  const [selectedHabitats, setSelectedHabitats] = useState([]);
  const [selectedSubstrates, setSelectedSubstrates] = useState([]);
  const [selectedWaterTypes, setSelectedWaterTypes] = useState([]);
  const [selectedGeology, setSelectedGeology] = useState([]);
  const [coordinates, setCoordinates] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubstrateExpanded, setIsSubstrateExpanded] = useState(false);
  const [isWaterExpanded, setIsWaterExpanded] = useState(false);
  const [isGeologyExpanded, setIsGeologyExpanded] = useState(false);
  const habitats = ["Pond", "Lake", "Ditch", "Creek", "River", "Spring", "Cave", "Artificial Habitat"];
  const substrates = ["Rock", "Sand", "Vegetation", "Plastic", "Man-made"];
  const waterTypes = ["Fresh", "Brackish", "Marine", "Fast flow", "Medium", "Stagnant", "High turbidity", "Medium turbidity", "Clear"];
  const geologyTypes = ["Limestone" , "Other sediments" , "Sandstone" , "Igneous rock" ,"Alluvial" ]
  const [abundance, setAbundance] = useState(0); // State for abundance slider
  const [images, setImages] = useState([]); // storing vial image 
  const [customImageName, setCustomImageName] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [imagess, setImagess] = useState([]); // storing Habitat image 
  const [customImageNames, setCustomImageNames] = useState('');
  const [dialogVisibles, setDialogVisibles] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const [expandedBox, setExpandedBox] = useState(null);
 
  // New fields for Locality Designation, Landmark, Vials, Morphs, Observation, Temperature, Hardness, pH
  const [localityDesignation, setLocalityDesignation] = useState('');
  const [landmarkNearby, setLandmarkNearby] = useState('');
  const [numOfVials, setNumOfVials] = useState('');
  const [morphs, setMorphs] = useState('');
  const [observation, setObservation] = useState('');
  const [temperature, setTemperature] = useState('');
  const [hardness, setHardness] = useState('');
  const [pH, setPH] = useState('');
  const [additional, setAdditional] = useState('');
  //const { uploadedNotes, setUploadedNotes } = useUploadStatus();
  const [uploadedNotes, setUploadedNotes] = useState([]);
  


  useEffect(() => {
    if (route.params?.note) {
      loadNoteData(route.params.note);
    }
  }, [route.params?.note]);

  // Function to load existing note data
  const loadNoteData = (note) => {
    setSelectedHabitats(note.selectedHabitats || []);
    setSelectedSubstrates(note.selectedSubstrates || []);
    setSelectedWaterTypes(note.selectedWaterTypes || []);
    setSelectedGeology(note.selectedGeology || []);
    setCoordinates(note.coordinates || null);
    setAbundance(note.abundance || 0);
    setImages(note.images || []);
    setImagess(note.imagess || []);
    setLocalityDesignation(note.localityDesignation || '');
    setLandmarkNearby(note.landmarkNearby || '');
    setNumOfVials(note.numOfVials || '');
    setMorphs(note.morphs || '');
    setObservation(note.observation || '');
    setAdditional(note.additional || '');
    setTemperature(note.temperature || '');
    setHardness(note.hardness || '');
    setPH(note.pH || '');
  };

  useEffect(() => {
    const loadExistingNote = async () => {
      const existingNotes = await AsyncStorage.getItem('notes');
      let notes = existingNotes ? JSON.parse(existingNotes) : [];
  
      if (route.params?.note) {
        loadNoteData(route.params.note);
      } else if (notes.length > 0) {
        loadNoteData(notes[notes.length - 1]); // Load the last note if no specific note to edit
      }
    };
  
    loadExistingNote();
  }, [route.params?.note]);
  

  const toggleHabitat = (habitat) => {
    if (selectedHabitats.includes(habitat)) {
      setSelectedHabitats(selectedHabitats.filter((item) => item !== habitat));
    } else {
      setSelectedHabitats([...selectedHabitats, habitat]);
    }
  };


  const toggleSubstrate = (substrates) => {
    if (selectedSubstrates.includes(substrates)) {
      setSelectedSubstrates(selectedSubstrates.filter((item) => item !== substrates));
    } else {
      setSelectedSubstrates([...selectedSubstrates, substrates]);
    }
  };


  const toggleWater = (waterTypes) => {
    if (selectedWaterTypes.includes(waterTypes)) {
      setSelectedWaterTypes(selectedWaterTypes.filter((item) => item !== waterTypes));
    } else {
      setSelectedWaterTypes([...selectedWaterTypes, waterTypes]);
    }
  };


  const toggleGeology = (geologyTypes) => {
    if (selectedGeology.includes(geologyTypes)) {
      setSelectedGeology(selectedGeology.filter((item) => item !== geologyTypes));
    } else {
      setSelectedGeology([...selectedGeology, geologyTypes]);
    }
  };

  // Function to toggle expand/collapse of the selected box
  const toggleExpand = (box) => {
    setExpandedBox(expandedBox === box ? null : box);  // Close if already open, open new box
  };


  const collectGPSCoordinates = async () => {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('Permission Denied', 'Location access is required to collect GPS coordinates.');
            return;
          }
        }
    

        Geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            setCoordinates({ latitude, longitude });
          },
          error => {
            Alert.alert('Error', `Failed to get location: ${error.message}`);
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      };


       // Function to validate form fields
  const validateForm = () => {
    // Example of required fields check
    if (!coordinates) {
      Alert.alert('Validation Error', 'Please capture GPS coordinates.');
      return false;
    }
    if (!localityDesignation || !landmarkNearby) {
      Alert.alert('Validation Error', 'Please enter locality designation and landmark.');
      return false;
    }
    if (!numOfVials || !morphs) {
      Alert.alert('Validation Error', 'Please specify the number of vials and morphs.');
      return false;
    }
    if (!temperature || !hardness || !pH) {
      Alert.alert('Validation Error', 'Please enter temperature, hardness, and pH.');
      return false;
    }
    if (selectedHabitats.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one habitat.');
      return false;
    }
    if (selectedSubstrates.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one substrate.');
      return false;
    }
    if (images.length === 0) {
      Alert.alert('Validation Error', 'Please add at least one vial picture.');
      return false;
    }
    // Add other field validations as needed

    return true; // All validations passed
  };



  const teamMembers = ['Sam Turner', 'Elizabeth Schmidt', 'David Schulz']; // Team names
    
  // Function to generate random ID
  const generateSerialID = (() => {
    let currentID = 0;
    return () => {
      currentID = (currentID % 5) + 1; // Cycles from 1 to 5
      return currentID;
    };
  })();

      // Function to add a new note
      const handleSubmit = async () => {
        // Validate the form first
        if (!validateForm()) {
          return; // Stop execution if validation fails
        }
    
        // Generate random notes names and userName if this is a new note
        const randomDate = `Note0${generateSerialID()}`;
        const randomUserName = `Edited by ${teamMembers[Math.floor(Math.random() * teamMembers.length)]}`;
    
        // Create the new note object from the form data
  const newNote = {
    id: route.params?.note?.id || generateSerialID(),
    date: randomDate,
    userName: randomUserName,
    selectedHabitats: selectedHabitats || [],  // Default to empty array
    selectedSubstrates: selectedSubstrates || [],
    selectedWaterTypes: selectedWaterTypes || [],
    selectedGeology: selectedGeology || [],
    coordinates: coordinates || null,  // Default to null if undefined
    abundance: abundance || 0,
    images: images || [],
    imagess: imagess || [],
    localityDesignation: localityDesignation || '',
    landmarkNearby: landmarkNearby || '',
    numOfVials: numOfVials || '',
    morphs: morphs || '',
    observation: observation || '',
    temperature: temperature || '',
    hardness: hardness || '',
    pH: pH || '',
    additional: additional || ''
  };
        try {

          setUploadedNotes([...uploadedNotes || [], newNote]);
          // Retrieve the existing notes from AsyncStorage
          const existingNotes = await AsyncStorage.getItem('notes');
          let notes = existingNotes ? JSON.parse(existingNotes) : [];
    
          // If we're editing an existing note, find and replace it
          if (route.params?.note) {
            // const updatedNotes = notes.map(existingNote =>
            //   existingNote.date === route.params.note.date ? newNote : existingNote
            // );
            // await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
            notes = notes.map(note => (note.id === newNote.id ? newNote : note));
          } else {
            // If this is a new note, add it to the array
            notes.push(newNote);
            //await AsyncStorage.setItem('notes', JSON.stringify(notes));
          }
           
          await AsyncStorage.setItem('notes', JSON.stringify(notes));
          // Navigate back to the ProjectDetails screen with the new or updated note
          navigation.navigate('ProjectDetails', { newNote });
        } catch (error) {
          console.error('Error saving note to AsyncStorage:', error);
        }
      };
       
        const openCameravial = async () => {
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
              // Assuming you want to store the first image only
              const newImage = { uri: result.assets[0].uri }; // Get the URI from the result
              setImages([...images, newImage]); // Update images state
              setDialogVisible(true);
            }
          } catch (error) {
            console.error('Error opening camera: ', error);
            Alert.alert('Error', 'Failed to open camera');
          }
        };
        
    
        const handlevialSaveImage = () => {
          if (customImageName.trim() === '') {
            Alert.alert('Error', 'Please enter a valid name for the image.');
            return;
          }
        
          const lastImage = images[images.length - 1]; // Get last image captured
          const updatedImage = { uri: lastImage.uri, name: customImageName }; // Create new image object with name
        
          // Update images state without duplicating the last image
          const updatedImages = [...images];
          updatedImages[updatedImages.length - 1] = updatedImage; // Replace last image with updated image
        
          setImages(updatedImages); // Update images state
          setCustomImageName('');
          setDialogVisible(false);
        };
        


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
            // Assuming you want to store the first image only
            const newImages = { uri: result.assets[0].uri }; // Get the URI from the result
            setImagess([...imagess, newImages]); // Update images state
            setDialogVisibles(true);
          }
        } catch (error) {
          console.error('Error opening camera: ', error);
          Alert.alert('Error', 'Failed to open camera');
        }
      };

      
    const handleHabitatSaveImage = () => {
      if (customImageNames.trim() === '') {
        Alert.alert('Error', 'Please enter a valid name for the image.');
        return;
      }
    
      const lastImages = imagess[imagess.length - 1]; // Get last image captured
      const updatedImages = { uri: lastImages.uri, name: customImageNames}; // Create new image object with name
    
      // Update images state without duplicating the last image
      const updatedImagess = [...imagess];
      updatedImagess[updatedImagess.length - 1] = updatedImages; // Replace last image with updated image
    
      setImagess(updatedImagess); // Update images state
      setCustomImageNames('');
      setDialogVisibles(false);
    };
      

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => console.log('Back pressed')} style={styles.backIconContainer}>
            <Text style={styles.backIcon}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Sampling Field Notes</Text>
        </View>

        {/* Location Section */}
        <Text style={styles.sectionHeader}>Location</Text>
        <View style={styles.separator} />
        <TextInput style={styles.input} placeholder="Locality Designation" value={localityDesignation} onChangeText={setLocalityDesignation} />
        <TextInput style={styles.input} placeholder="Landmark Nearby" value={landmarkNearby} onChangeText={setLandmarkNearby}  />

        {coordinates && (
  <View style={styles.coordinatesContainer}>
    <Text style={styles.coordinatesText}>
      Latitude: <Text style={styles.coordinatesValue}>{coordinates.latitude.toFixed(5)}</Text>
    </Text>
    <Text style={styles.coordinatesText}>
      Longitude: <Text style={styles.coordinatesValue}>{coordinates.longitude.toFixed(5)}</Text>
    </Text>
  </View>
)}


        <TouchableOpacity style={styles.button} onPress={collectGPSCoordinates}>
          <Text style={styles.buttonText}>Capture coordinates</Text>
        </TouchableOpacity>
        
        {/* Planarians Section */}
        <Text style={styles.sectionHeader}>Planarians</Text>
        <View style={styles.separator} />
        <TextInput style={styles.input} placeholder="No. of Vials" keyboardType="numeric" value={numOfVials} onChangeText={setNumOfVials}/>
        <TextInput style={styles.input} placeholder="Morphs" value={morphs} onChangeText={setMorphs}/>

        <Text style={styles.label}>Abundance</Text>
        <View style={styles.sliderContainer}>
  <Slider
    style={styles.slider}
    minimumValue={0}
    maximumValue={100}
    step={1}
    value={abundance}
    onValueChange={(value) => setAbundance(value)}
    minimumTrackTintColor="#2E6C6A" // Dark green color for the filled part of the track
    maximumTrackTintColor="#E0F2F1" // Light teal color for the unfilled part of the track
    thumbTintColor="#4EA8A5" // Color for the thumb
  />
</View>

          <Text style={styles.sliderValue}>{abundance}</Text>

        <Text style={styles.label}>Observations</Text>
        <TextInput style={[styles.input, styles.observationsInput]} placeholder="E.g. Blastemas, eggs, etc ..." multiline numberOfLines={4} value={observation} onChangeText={setObservation} />

        {/* Pictures Section */}
        <Text style={styles.sectionHeader}>Pictures</Text>
        <View style={styles.separator} />
        <Text style={styles.label}>Vial pictures</Text>

       {/* Conditionally render camera icon or image preview */}
{images.length === 0 ? (
  <TouchableOpacity style={styles.pictureContainer} onPress={openCameravial}>
    <Text style={styles.placeholderText}>No Photos added</Text>
    <Text style={styles.cameraIcon}>📷</Text>
  </TouchableOpacity>
) : (
  <TouchableOpacity
  style={styles.habitatPicturesContainer}
  onPress={() => {
    const randomSize = (Math.random() * (9 - 3) + 3).toFixed(1);  // Generates a random number between 3 and 9 with one decimal place
    navigation.navigate('VialPicture', { 
      selectedImage: images[0], 
      imageName: images[0].name,  // Replace with the actual image name if available
      imageSizeMB: randomSize  // Randomly generated image size
    });
  }}
  
  
>
  {/* Display the image(s) */}
  {images.map((image, index) => (
    <Image key={index} source={image} style={styles.imageIcon} />
  ))}
</TouchableOpacity>

)}


 {/* Dialog for Custom Image Name for vial Image*/}
 <Dialog.Container visible={dialogVisible}>
          <Dialog.Title>Save Image</Dialog.Title>
          <Dialog.Description>
            Enter a name for the photo you just captured:
          </Dialog.Description>
          <Dialog.Input
            value={customImageName}
            onChangeText={setCustomImageName}
            placeholder="Image name"
          />
          <Dialog.Button label="Cancel" onPress={() => setDialogVisible(false)} />
          <Dialog.Button label="Save" onPress={handlevialSaveImage} />
        </Dialog.Container>


        <Text style={styles.label}>Habitat pictures </Text>
        {/* Conditionally render camera icon or image preview */}
{imagess.length <= 2 ? (
  <TouchableOpacity style={styles.pictureContainer} onPress={openCameraHabitat}>
    <Text style={styles.placeholderText}>No Photos added</Text>
    <Text style={styles.cameraIcon}>📷</Text>
  </TouchableOpacity>
) : (
  <TouchableOpacity
  style={styles.habitatPicturesContainer}
  onPress={() => {
     // Generate a random size for each image, with two decimal places
     const randomSizes = imagess.map(() => (Math.random() * (9 - 3) + 3).toFixed(1));  
    navigation.navigate('HabitatPicture', { 
      selectedImages: imagess, 
      imageNames: imagess.map(image => image.name || 'Unnamed'),  // Replace with the actual image name if available
      imageSizeMBs: randomSizes  // Randomly generated image size
    });
  }}
  
  
>
  {/* Display the image(s) */}
  {imagess.map((imagess, index) => (
    <Image key={index} source={imagess} style={styles.imageIcon} />
  ))}
</TouchableOpacity>

)}


 {/* Dialog for Custom Image Name for Habitat Image*/}
 <Dialog.Container visible={dialogVisibles}>
          <Dialog.Title>Save Image</Dialog.Title>
          <Dialog.Description>
           Enter a name for the photo you just captured:
          </Dialog.Description>
          <Dialog.Input
            value={customImageNames}
            onChangeText={setCustomImageNames}
            placeholder="Image name"
          />
          <Dialog.Button label="Cancel" onPress={() => setDialogVisibles(false)} />
          <Dialog.Button label="Save" onPress={handleHabitatSaveImage} />
        </Dialog.Container>



               {/* Habitat Description Section */}
        <Text style={styles.sectionHeader}>Habitats</Text>
        <View style={styles.separator} />
        <Text style={styles.sectionHeader}>Habitat Description</Text>
        <View style={styles.habitatContainer}>
          <View style={styles.habitatDescriptionBox}>
            <View style={styles.selectedHabitatsContainer}>
              <View style={styles.selectedHabitatsWrapper}>
                {selectedHabitats.map((habitat, index) => (
                  <Text key={index} style={styles.habitatTag}>{habitat}</Text>
                ))}
                {selectedHabitats.length > 4 && !isExpanded && (
                  <Text style={styles.additionalText}>+{selectedHabitats.length - 4}</Text>
                )}
              </View>
              <TouchableOpacity onPress={() => toggleExpand('habitats')}>
              <Icon name={expandedBox === 'habitats' ? "expand-less" : "expand-more"} size={29} color="black" />
              </TouchableOpacity>
            </View>
            {expandedBox === 'habitats' && (
              <View style={styles.habitatList}>
                {habitats.map((habitat, index) => (
                  <View key={index} style={styles.habitatCheckboxContainer}>
                    <CheckBox
                      value={selectedHabitats.includes(habitat)}
                      onValueChange={() => toggleHabitat(habitat)}
                      style={styles.checkbox}
                    />
                    <Text style={styles.habitatText}>{habitat}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>


         {/* Substrate Section */}
        <Text style={styles.sectionHeader}>Substrate</Text>
        <View style={styles.habitatContainer}>
          <View style={styles.habitatDescriptionBox}>
            <View style={styles.selectedHabitatsContainer}>
              <View style={styles.selectedHabitatsWrapper}>
                {selectedSubstrates.map((substrates, index) => (
                  <Text key={index} style={styles.habitatTag}>{substrates}</Text>
                ))}
                {selectedSubstrates.length > 4 && !isSubstrateExpanded && (
                  <Text style={styles.additionalText}>+{selectedSubstrates.length - 4}</Text>
                )}
              </View>
              <TouchableOpacity onPress={() => toggleExpand('substrates')}>
              <Icon name={expandedBox === 'substrates' ? "expand-less" : "expand-more"} size={29} color="black" />
              </TouchableOpacity>
            </View>
            {expandedBox === 'substrates' && (
              <View style={styles.habitatList}>
                {substrates.map((substrates, index) => (
                  <View key={index} style={styles.habitatCheckboxContainer}>
                    <CheckBox
                      value={selectedSubstrates.includes(substrates)}
                      onValueChange={() => toggleSubstrate(substrates)}
                      style={styles.checkbox}
                    />
                    <Text style={styles.habitatText}>{substrates}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>


         {/* Water Section */}
<Text style={styles.sectionHeader}>Water</Text>
        <View style={styles.habitatContainer}>
          <View style={styles.habitatDescriptionBox}>
            <View style={styles.selectedHabitatsContainer}>
              <View style={styles.selectedHabitatsWrapper}>
                {selectedWaterTypes.map((waterTypes, index) => (
                  <Text key={index} style={styles.habitatTag}>{waterTypes}</Text>
                ))}
                {selectedWaterTypes.length > 4 && !isWaterExpanded && (
                  <Text style={styles.additionalText}>+{selectedWaterTypes.length - 4}</Text>
                )}
              </View>
              <TouchableOpacity onPress={() => toggleExpand('waterTypes')}>
              <Icon name={expandedBox === 'WaterTypes' ? "expand-less" : "expand-more"} size={29} color="black" />
              </TouchableOpacity>
            </View>
            {expandedBox === 'waterTypes' && (
          <View style={styles.habitatList}>
            {waterTypes.map((waterTypes, index) => (
              <View key={index} style={styles.habitatCheckboxContainer}>
                <CheckBox
                  value={selectedWaterTypes.includes(waterTypes)}
                  onValueChange={() => toggleWater(waterTypes)}
                  style={styles.checkbox}
                />
                <Text style={styles.habitatText}>{waterTypes}</Text>
              </View>
                ))}
              </View>
            )}
          </View>
        </View>


           {/* Geology Section */}
           <Text style={styles.sectionHeader}>Geology</Text>
        <View style={styles.habitatContainer}>
          <View style={styles.habitatDescriptionBox}>
            <View style={styles.selectedHabitatsContainer}>
              <View style={styles.selectedHabitatsWrapper}>
                {selectedGeology.map((geologyTypes, index) => (
                  <Text key={index} style={styles.habitatTag}>{geologyTypes}</Text>
                ))}
                {selectedGeology.length > 4 && !isGeologyExpanded && (
                  <Text style={styles.additionalText}>+{selectedGeology.length - 4}</Text>
                )}
              </View>
              <TouchableOpacity onPress={() => toggleExpand('geologyTypes')}>
              <Icon name={expandedBox === 'geologyTypes' ? "expand-less" : "expand-more"} size={29} color="black" />
              </TouchableOpacity>
            </View>
            {expandedBox === 'geologyTypes' && (
          <View style={styles.habitatList}>
            {geologyTypes.map((geologyTypes, index) => (
              <View key={index} style={styles.habitatCheckboxContainer}>
                <CheckBox
                  value={selectedGeology.includes(geologyTypes)}
                  onValueChange={() => toggleGeology(geologyTypes)}
                  style={styles.checkbox}
                />
                <Text style={styles.habitatText}>{geologyTypes}</Text>
              </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <TextInput style={styles.input} placeholder="Temperature" keyboardType="numeric" value={temperature} onChangeText={setTemperature}/>
        <View style={styles.measurementContainer}>
  <TextInput
    style={styles.measurementBox}
    placeholder="Hardness"
    keyboardType="numeric"
    value={hardness}
     onChangeText={setHardness} 
  />
  <TextInput
    style={styles.measurementBox}
    placeholder="pH"
    keyboardType="numeric"
    value={pH} 
    onChangeText={setPH}
  />
</View>

<Text style={styles.label}>Additional Notes</Text>
<TextInput style={[styles.input, styles.observationsInput]} placeholder="E.g. Blastemas, eggs, etc ..." multiline numberOfLines={6} value={additional} onChangeText={setAdditional}/>

<TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ACCAC8',
  },
  scrollViewContent: {
    padding: 20,
    flexGrow: 1,
    paddingBottom: 100,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  backIconContainer: {
    position: 'absolute',
    left: 0,
    marginLeft: 9,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'Playfair Display',
  },
  backIcon: {
    fontSize: 45,
    fontWeight: 'bold',
    color: 'black',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 28,
    color: '#000000',
    marginLeft: 5,
    fontFamily: 'Playfair Display',
  },
  separator: {
    height: 2,
    backgroundColor: '#000000',
    marginVertical: 10,
  },
  label: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 15,
    fontWeight: 'bold',
    marginLeft: 5,
    marginTop: 15,
  },
  input: {
    height: 67,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    padding: 17,
    marginTop: 15,
    backgroundColor: '#FFF',
  },
  coordinatesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28, // adjust if needed to fit nicely above the button
    marginBottom:-6
  },
  coordinatesText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginHorizontal: 6, // reduce space between Latitude and Longitude
  },
  coordinatesValue: {
    color: 'gray', // color for the actual coordinates
  },
  
  observationsInput: {
    height: 125,
    textAlignVertical: 'top',
    marginTop:2
  },
  button: {
    width: 346,
    height: 55,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    backgroundColor: 'black',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pictureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 75,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#FFF',
  },
  placeholderText: {
    fontSize: 16,
    color: 'black',
    marginLeft: 18,
  },
  cameraIcon: {
    fontSize: 30,
    color: 'black',
    marginRight: 10,
    marginBottom: 7,
  },
  habitatPicturesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#FFF',
  },
  imagePlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#E0E0E0',
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  additionalText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
  },
  habitatContainer: {
    marginTop: 5,
  },
  habitatDescriptionBox: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    padding: 17,
    backgroundColor: '#FFF',
    marginTop:5
  },
  selectedHabitatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedHabitatsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    maxWidth: '80%', // Ensure it doesn't overflow
  },
  habitatTag: {
    backgroundColor: 'black',
    color: '#FFF',
    borderRadius: 15,
    padding: 6,
    marginRight: 7,
    marginBottom: 5,
    
  },
  toggleText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  habitatList: {
    marginTop: 10,
  },
  habitatCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkbox: {
    marginRight: 10,
  },
  habitatText: {
    fontSize: 17,
    color:'black'
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  measurementContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  measurementBox: {
    width: '48%',
    height: 67,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15, 
    fontSize: 16,
    backgroundColor: '#FFF',
    
  },

  sliderContainer: {
    height: 70, 
    justifyContent: 'center',
    backgroundColor: '#E0F2F1', 
    borderRadius: 10,
    overflow: 'hidden',
  },
  slider: {
    height: 90, 
  },
  
  sliderValue: {
    fontSize: 16,
    color: 'black',
    textAlign: 'right',
    marginRight: 10, 
    marginTop: -25,  
},

imageIcon: {
  width: 40, 
  height: 40, 
  borderRadius: 5,
  margin: 12, 
  marginTop : -2,
  marginBottom:-2,
  marginLeft:0
},

  
});

export default CollectScreen; 