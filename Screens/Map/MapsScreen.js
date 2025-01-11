import React, { useRef, useState } from 'react';
import { View, StyleSheet, TextInput, Text, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapScreen = () => {
  const mapRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const [latitudeInput, setLatitudeInput] = useState('');
  const [longitudeInput, setLongitudeInput] = useState('');

  const handleSearch = () => {
    const latitude = parseFloat(latitudeInput);
    const longitude = parseFloat(longitudeInput);

    if (isNaN(latitude) || isNaN(longitude)) {
      Alert.alert("Invalid Input", "Please enter valid latitude and longitude values.");
      return;
    }

    const newLocation = { latitude, longitude };
    setSelectedLocation(newLocation);

    // Animate the map to the new location
    mapRef.current.animateToRegion({
      ...newLocation,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Show a marker for the selected location */}
        <Marker
          coordinate={selectedLocation}
          title="Selected Location"
        />
      </MapView>

      {/* Search Container */}
      <View style={styles.searchContainer}>
        <Text style={styles.label}>Lat:</Text>
        <TextInput
          style={styles.input}
          placeholder="Latitude"
          keyboardType="numeric"
          value={latitudeInput}
          onChangeText={setLatitudeInput}
        />
        <Text style={styles.label}>Lon:</Text>
        <TextInput
          style={styles.input}
          placeholder="Longitude"
          keyboardType="numeric"
          value={longitudeInput}
          onChangeText={setLongitudeInput}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    marginHorizontal: 5,
  },
  input: {
    width: 80,
    height: 40,
    paddingHorizontal: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    fontSize: 16,
  },
});

export default MapScreen;


