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




// import React, { useState, useRef } from 'react';
// import { View, StyleSheet, TextInput, Text, Button, Alert } from 'react-native';
// import MapView from 'react-native-maps';
// // import Mappls, { Marker } from 'mappls-react-native-sdk';  // Import Mappls SDK 
// import Mappls from 'mappls-react-native-sdk';

// const MapScreen = () => {
//   const mapRef = useRef(null);
//   const [locationInput, setLocationInput] = useState('');
//   const [selectedLocation, setSelectedLocation] = useState({
//     latitude: 28.6139,  // Default: New Delhi coordinates
//     longitude: 77.2090,
//   });

//   const handleSearch = async () => {
//     const location = locationInput.trim();

//     if (!location) {
//       Alert.alert('Input Error', 'Please enter a location name.');
//       return;
//     }

//     try {
//       // Initialize Mappls Geocode API
//       const geocodeResponse = await Mappls.Geocode.geocode({
//         query: location,  // The location you want to search for
//       });

//       if (geocodeResponse && geocodeResponse.results && geocodeResponse.results.length > 0) {
//         const { lat, lon } = geocodeResponse.results[0];  // Get first result's coordinates
//         const newLocation = { latitude: lat, longitude: lon };

//         setSelectedLocation(newLocation);

//         // Animate the map to the new location
//         mapRef.current.animateToRegion(
//           {
//             ...newLocation,
//             latitudeDelta: 0.0922,
//             longitudeDelta: 0.0421,
//           },
//           1000
//         );

//         Alert.alert('Location Found', `Location: ${location} has been found.`);
//       } else {
//         Alert.alert('Location Not Found', `No results found for ${location}.`);
//       }
//     } catch (error) {
//       console.error('Geocoding API Error:', error);
//       Alert.alert('Error', `Failed to fetch location: ${error.message}`);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <MapView
//         ref={mapRef}
//         style={styles.map}
//         initialRegion={{
//           latitude: selectedLocation.latitude,
//           longitude: selectedLocation.longitude,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         }}
//       >
//         {/* Show a marker for the selected location */}
//         <Marker coordinate={selectedLocation} title="Selected Location" />
//       </MapView>

//       {/* Search Container */}
//       <View style={styles.searchContainer}>
//         <Text style={styles.label}>Location:</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter Location"
//           value={locationInput}
//           onChangeText={setLocationInput}
//         />
//         <Button title="Search" onPress={handleSearch} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     position: 'absolute',
//     top: 20,
//     left: 10,
//     right: 10,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 10,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
//   label: {
//     fontSize: 16,
//     marginHorizontal: 5,
//   },
//   input: {
//     width: 200,
//     height: 40,
//     paddingHorizontal: 8,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     marginRight: 10,
//     fontSize: 16,
//   },
// });

// export default MapScreen;
