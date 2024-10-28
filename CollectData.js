import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, Alert, Platform, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const CollectData = () => {
  const [locality, setLocality] = useState('');
  const [landmark, setLandmark] = useState('');
  const [selectedHabitat, setSelectedHabitat] = useState([]);
  const [selectedSubstrate, setSelectedSubstrate] = useState([]);
  const [selectedWater, setSelectedWater] = useState([]);
  const [selectedGeology, setSelectedGeology] = useState([]);
  const [coordinates, setCoordinates] = useState(null);
  const [currentSection, setCurrentSection] = useState('Habitat');

  const screenWidth = Dimensions.get('window').width;

  const habitatOptions = ['Pond', 'Lake', 'Ditch', 'Creek (<3 m width)', 'River (>3m width)', 'Spring', 'Cave', 'Artificial habitat'];
  const substrateOptions = ['Rocks', 'Sand', 'Vegetation', 'Plastic man-made', 'Other'];
  const waterOptions = ['Fresh', 'Brackish', 'Marine', 'Fast flow', 'Medium', 'Stagnant', 'High turbidity', 'Medium turbidity', 'Clear'];
  const geologyOptions = ['Limestone', 'Other sediments', 'Sandstone', 'Igneous rock', 'Alluvial'];

  const handleOptionSelection = (option, selectedOptions, setSelectedOptions) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(item => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleNextSection = () => {
    if (currentSection === 'Habitat') {
      setCurrentSection('Substrate');
    } else if (currentSection === 'Substrate') {
      setCurrentSection('Water');
    } else if (currentSection === 'Water') {
      setCurrentSection('Geology');
    }
  };

  const handleSubmit = () => {
    if (!coordinates || !locality || !selectedGeology.length) {
      Alert.alert("Error", "Please fill in all required fields and collect GPS coordinates.");
    } else {
      Alert.alert("Success", "Data Submitted!");
      // Here you can send the data to your backend or handle it as needed
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

  return (
    <ScrollView contentContainerStyle={[styles.container, { padding: screenWidth * 0.04 }]}>
      <Text style={[styles.projectId, { fontSize: screenWidth * 0.05 }]}>Project ID: BIOLOGY123</Text>

      <View style={styles.gpsContainer}>
        <TouchableOpacity style={styles.touchable} onPress={collectGPSCoordinates}>
          <Text style={styles.touchableText}>Collect GPS Coordinates</Text>
        </TouchableOpacity>
        {coordinates && (
          <Text style={styles.coordinatesText}>
            {coordinates.latitude.toFixed(6)},{coordinates.longitude.toFixed(6)}
          </Text>
        )}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter Locality (e.g., Forest, River)"
        value={locality}
        textAlign="center"
        onChangeText={(text) => setLocality(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Landmark (e.g., Tree, Mountain)"
        value={landmark}
        textAlign="center"
        onChangeText={(text) => setLandmark(text)}
      />

      <Text style={styles.sectionTitle}>{currentSection}:</Text>
      {(currentSection === 'Habitat' ? habitatOptions : currentSection === 'Substrate' ? substrateOptions : currentSection === 'Water' ? waterOptions : geologyOptions).map((option, index) => (
        <TouchableOpacity key={index} style={styles.checkBoxContainer} onPress={() => handleOptionSelection(option, currentSection === 'Habitat' ? selectedHabitat : currentSection === 'Substrate' ? selectedSubstrate : currentSection === 'Water' ? selectedWater : selectedGeology, currentSection === 'Habitat' ? setSelectedHabitat : currentSection === 'Substrate' ? setSelectedSubstrate : currentSection === 'Water' ? setSelectedWater : setSelectedGeology)}>
          <Text>{option}</Text>
          <CheckBox
            value={currentSection === 'Habitat' ? selectedHabitat.includes(option) : currentSection === 'Substrate' ? selectedSubstrate.includes(option) : currentSection === 'Water' ? selectedWater.includes(option) : selectedGeology.includes(option)}
            onValueChange={() => handleOptionSelection(option, currentSection === 'Habitat' ? selectedHabitat : currentSection === 'Substrate' ? selectedSubstrate : currentSection === 'Water' ? selectedWater : selectedGeology, currentSection === 'Habitat' ? setSelectedHabitat : currentSection === 'Substrate' ? setSelectedSubstrate : currentSection === 'Water' ? setSelectedWater : setSelectedGeology)}
          />
        </TouchableOpacity>
      ))}

      {currentSection !== 'Geology' && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNextSection}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      )}

      {currentSection === 'Geology' && (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#e8f5e9',
  },
  projectId: {
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2e7d32',
  },
  gpsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  touchable: {
    backgroundColor: '#388e3c',
    padding: Dimensions.get('window').width * 0.03,
    borderRadius: 10,
    alignItems: 'center',
  },
  touchableText: {
    color: '#fff',
    fontSize: Dimensions.get('window').width * 0.04,
    fontWeight: '600',
  },
  coordinatesText: {
    fontSize: Dimensions.get('window').width * 0.04,
    color: '#388e3c',
    marginLeft: 10,
  },
  input: {
    height: 45,
    borderColor: '#81c784',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: Dimensions.get('window').width * 0.045,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#2e7d32',
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  nextButton: {
    marginTop: 30,
    backgroundColor: '#388e3c',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitButton: {
    marginTop: 30,
    backgroundColor: '#388e3c',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CollectData;
