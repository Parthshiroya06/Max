import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView , Platform, PermissionsAndroid, Alert} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchCamera} from 'react-native-image-picker';

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
  const [images, setImages] = useState([]); // State to hold captured images

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
       
      const openCamera = async () => {
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
          } else if (result.assets) {
            setImages([...images, ...result.assets.map(asset => asset.uri)]);
          }
        } catch (error) {
          console.error('Error opening camera: ', error);
          Alert.alert('Error', 'Failed to open camera');
        }
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
        <TextInput style={styles.input} placeholder="Locality Designation" />
        <TextInput style={styles.input} placeholder="Landmark Nearby" />

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
        <TextInput style={styles.input} placeholder="No. of Vials" keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Morphs" />
        <Text style={styles.label}>Observations</Text>
        <TextInput style={[styles.input, styles.observationsInput]} placeholder="E.g. Blastemas, eggs, etc ..." multiline numberOfLines={4} />

        {/* Pictures Section */}
        <Text style={styles.sectionHeader}>Pictures</Text>
        <View style={styles.separator} />
        <Text style={styles.label}>Vial pictures</Text>
        <TouchableOpacity style={styles.pictureContainer}onPress={openCamera}>
          <Text style={styles.placeholderText}>No Photos added</Text>
          <Text style={styles.cameraIcon}>📷</Text>
        </TouchableOpacity>
        <Text style={styles.label}>Habitat pictures</Text>
        <View style={styles.habitatPicturesContainer}>
          <View style={styles.imagePlaceholder}></View>
          <View style={styles.imagePlaceholder}></View>
          <View style={styles.imagePlaceholder}></View>
          <Text style={styles.additionalText}>+2</Text>
        </View>
          

        <Text style={styles.sectionHeader}>Habitats</Text>
        <View style={styles.separator} />


        {/* Habitat Description Section */}
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
              <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                <Icon name={isExpanded ? "expand-less" : "expand-more"} size={24} color="black" />
              </TouchableOpacity>
            </View>
            {isExpanded && (
              <View style={styles.habitatList}>
                {habitats.map((habitat, index) => (
                  <View key={index} style={styles.habitatCheckboxContainer}>
                    <CheckBox
                      value={selectedHabitats.includes(habitat)}
                      onValueChange={() => toggleHabitat(habitat)}
                      style={styles.checkbox}
                    />
                    <Text style={styles.habitatText}>
                      {habitat}
                    </Text>
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
              <TouchableOpacity onPress={() => setIsSubstrateExpanded(!isSubstrateExpanded)}>
                <Icon name={isSubstrateExpanded ? 'expand-less' : 'expand-more'} size={24} color="black" />
              </TouchableOpacity>
            </View>
            {isSubstrateExpanded && (
              <View style={styles.habitatList}>
                {substrates.map((substrates, index) => (
                  <View key={index} style={styles.habitatCheckboxContainer}>
                    <CheckBox
                      value={selectedSubstrates.includes(substrates)}
                      onValueChange={() => toggleSubstrate(substrates)}
                      style={styles.checkbox}
                    />
                    <Text style={styles.habitatText}>
                      {substrates}
                    </Text>
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
              <TouchableOpacity onPress={() => setIsWaterExpanded(!isWaterExpanded)}>
                <Icon name={isWaterExpanded ? 'expand-less' : 'expand-more'} size={24} color="black" />
              </TouchableOpacity>
            </View>
            {isWaterExpanded && (
              <View style={styles.habitatList}>
                {waterTypes.map((waterTypes, index) => (
                  <View key={index} style={styles.habitatCheckboxContainer}>
                    <CheckBox
                      value={selectedWaterTypes.includes(waterTypes)}
                      onValueChange={() => toggleWater(waterTypes)}
                      style={styles.checkbox}
                    />
                    <Text style={styles.habitatText}>
                      {waterTypes}
                    </Text>
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
              <TouchableOpacity onPress={() => setIsGeologyExpanded(!isGeologyExpanded)}>
                <Icon name={isGeologyExpanded ? 'expand-less' : 'expand-more'} size={24} color="black" />
              </TouchableOpacity>
            </View>
            {isGeologyExpanded && (
              <View style={styles.habitatList}>
                {geologyTypes.map((geologyTypes, index) => (
                  <View key={index} style={styles.habitatCheckboxContainer}>
                    <CheckBox
                      value={selectedGeology.includes(geologyTypes)}
                      onValueChange={() => toggleGeology(geologyTypes)}
                      style={styles.checkbox}
                    />
                    <Text style={styles.habitatText}>
                      {geologyTypes}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <TextInput style={styles.input} placeholder="Temperature" />
        <View style={styles.measurementContainer}>
  <TextInput
    style={styles.measurementBox}
    placeholder="Hardness"
    keyboardType="numeric"
  />
  <TextInput
    style={styles.measurementBox}
    placeholder="pH"
    keyboardType="numeric"
  />
</View>

<Text style={styles.label}>Additional Notes</Text>
<TextInput style={[styles.input, styles.observationsInput]} placeholder="E.g. Blastemas, eggs, etc ..." multiline numberOfLines={4} />

<TouchableOpacity style={styles.button} onPress={() => console.log('Find coordinates pressed')}>
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
    paddingHorizontal: 15, // Padding for text inside the box
    fontSize: 16,
    backgroundColor: '#FFF',
    
  },
  
});

export default CollectScreen;
