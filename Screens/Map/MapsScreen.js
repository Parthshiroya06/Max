// import React, { useRef, useState , useEffect} from 'react';
// import { View, StyleSheet, TextInput, Button, Alert, Text, TouchableOpacity } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
// import axios from 'axios';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Geolocation from 'react-native-geolocation-service';

// const MapScreen = ({ navigation }) => {
//   const mapRef = useRef(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showDirections, setShowDirections] = useState(false);

//   const GOOGLE_MAPS_API_KEY = 'AIzaSyAG71oZoh5EI4bfro8Kct2wySMflLwOR6k';

//   // Assuming a fixed current location
//   const currentLocation = {
//     latitude: 25.4167,  
//     longitude: 85.1667,
//   };

  
  
  

//   const handleSearch = async () => {
//     if (!searchQuery.trim()) {
//       Alert.alert('Invalid Input', 'Please enter a valid location.');
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `https://maps.googleapis.com/maps/api/geocode/json`,
//         {
//           params: {
//             address: searchQuery,
//             key: GOOGLE_MAPS_API_KEY,
//           },
//         }
//       );

//       if (response.data.status === 'OK') {
//         const { lat, lng } = response.data.results[0].geometry.location;
//         const newLocation = { latitude: lat, longitude: lng };
//         setSelectedLocation(newLocation);
//         setShowDirections(false);  // Reset directions when searching for a new place

//         mapRef.current.animateToRegion(
//           {
//             ...newLocation,
//             latitudeDelta: 0.0922,
//             longitudeDelta: 0.0421,
//           },
//           1000
//         );
//       } else {
//         Alert.alert('Error', 'Location not found. Please try again.');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'An error occurred while searching for the location.');
//     }
//   };

//   const handleShowDirections = () => {
//     if (selectedLocation) {
//       setShowDirections(true);
//       mapRef.current.fitToCoordinates([currentLocation, selectedLocation], {
//         edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
//         animated: true,
//       });
//     } else {
//       Alert.alert('No location selected', 'Please search and select a location first.');
//     }
//   };
//   const handleSave = () => {
//     if (selectedLocation) {
//       navigation.navigate('SaveLocationScreen', { location: searchQuery, coordinates: selectedLocation });
//     } else {
//       Alert.alert('No location selected', 'Please search and select a location first.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <MapView
//         ref={mapRef}
//         style={styles.map}
//         initialRegion={{
//           latitude: currentLocation.latitude,
//           longitude: currentLocation.longitude,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         }}
//       >
//         <Marker coordinate={currentLocation} title="Current Location" />
//         {selectedLocation && <Marker coordinate={selectedLocation} title={searchQuery} />}

//         {selectedLocation && showDirections && (
//           <MapViewDirections
//             origin={currentLocation}
//             destination={selectedLocation}
//             apikey={GOOGLE_MAPS_API_KEY}
//             strokeWidth={5}
//             strokeColor="blue"
//             optimizeWaypoints={true}
//             onError={(errorMessage) => {
//               Alert.alert('Directions Error', errorMessage);
//             }}
//           />
//         )}
//       </MapView>

//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search for a location"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//         <Button title="Search" onPress={handleSearch} />
//       </View>

//       {selectedLocation && (
//         <View style={styles.locationInfo}>
//           <Text style={styles.locationTitle}>{searchQuery}</Text>
//           <View style={styles.buttonContainer}>
//             <TouchableOpacity style={styles.directionsButton} onPress={handleShowDirections}>
//               <FontAwesome name="location-arrow" size={20} color="#fff" />
//               <Text style={styles.buttonText}> Directions</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
//               <FontAwesome name="bookmark" size={20} color="#000" />
//               <Text style={styles.buttonText}> Save</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   map: { flex: 1 },
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
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     paddingHorizontal: 8,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     marginRight: 10,
//     fontSize: 16,
//   },
//   locationInfo: {
//     position: 'absolute',
//     bottom: 20,
//     left: 10,
//     right: 10,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     elevation: 5,
//   },
//   locationTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
//   directionsButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#2D9CDB',
//     padding: 10,
//     borderRadius: 5,
//   },
//   saveButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#000',
//     padding: 10,
//     borderRadius: 5,
//   },
//   buttonText: {
//     marginLeft: 5,
//     fontSize: 16,
//   },
// });

// export default MapScreen;



import React, { useRef, useState , useEffect} from 'react';
import { View, StyleSheet, TextInput, Button, Alert, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Share from 'react-native-share';

const MapScreen = ({ navigation }) => {
  const mapRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDirections, setShowDirections] = useState(false);
  const [locationDetails, setLocationDetails] = useState({ city: '', country: '' });


  const GOOGLE_MAPS_API_KEY = 'AIzaSyAG71oZoh5EI4bfro8Kct2wySMflLwOR6k';

  // Assuming a fixed current location
  const currentLocation = {
    latitude: 25.4167,  
    longitude: 85.1667,
  };

  useEffect(() => {
    const loadSavedLocation = async () => {
      try {
        const savedData = await AsyncStorage.getItem('savedLocation');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setSelectedLocation(parsedData.coordinates);
          setSearchQuery(parsedData.name);
        }
      } catch (error) {
        console.error('Error loading saved location:', error);
      }
    };
  
    loadSavedLocation();
  }, []);
  
  
  
  

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Invalid Input', 'Please enter a valid location.');
      return;
    }
  
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        { params: { address: searchQuery, key: GOOGLE_MAPS_API_KEY } }
      );
  
      if (response.data.status === 'OK') {
        const { lat, lng } = response.data.results[0].geometry.location;
        const newLocation = { latitude: lat, longitude: lng };
  
        // Extract city and country from the API response
        let city = '';
        let country = '';
        const addressComponents = response.data.results[0].address_components;
  
        addressComponents.forEach(component => {
          if (component.types.includes('locality')) {
            city = component.long_name;
          }
          if (component.types.includes('country')) {
            country = component.long_name;
          }
        });
  
        setSelectedLocation(newLocation);
        setLocationDetails({ city, country });
        setShowDirections(false);
  
        mapRef.current.animateToRegion(
          { ...newLocation, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
          1000
        );
      } else {
        Alert.alert('Error', 'Location not found.');
      }
    } catch (error) {
      Alert.alert('No Internet', 'Using saved location.');
      const savedData = await AsyncStorage.getItem('savedLocation');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setSelectedLocation(parsedData.coordinates);
        setSearchQuery(parsedData.name);
      }
    }
  };

  const handleShowDirections = () => {
    if (selectedLocation) {
      setShowDirections(true);
      mapRef.current.fitToCoordinates([currentLocation, selectedLocation], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    } else {
      Alert.alert('No location selected', 'Please search and select a location first.');
    }
  };
  const handleSave = async () => {
    if (selectedLocation) {
      const locationData = {
        name: searchQuery,
        coordinates: selectedLocation,
      };
  
      try {
        await AsyncStorage.setItem('savedLocation', JSON.stringify(locationData));
        Alert.alert('Success', 'Location saved successfully!');
      } catch (error) {
        Alert.alert('Error', 'Failed to save location.');
      }
    } else {
      Alert.alert('No location selected', 'Please search and select a location first.');
    }
  };

  const handleShare = async () => {
    if (!selectedLocation) {
      Alert.alert('No location selected', 'Please search for a location first.');
      return;
    }
  
    const googleMapsLink = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.latitude},${currentLocation.longitude}&destination=${selectedLocation.latitude},${selectedLocation.longitude}&travelmode=driving`;
  
    const shareMessage = `📍 *Location:* ${searchQuery} 
  🌍 *City:* ${locationDetails.city} 
  🏳️ *Country:* ${locationDetails.country} 
  🛣️ *Get Directions:* ${googleMapsLink}`;
  
    try {
      await Share.open({
        message: shareMessage,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={currentLocation} title="Current Location" />
        {selectedLocation && <Marker coordinate={selectedLocation} title={searchQuery} />}

        {selectedLocation && showDirections && (
          <MapViewDirections
            origin={currentLocation}
            destination={selectedLocation}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={5}
            strokeColor="blue"
            optimizeWaypoints={true}
            onError={(errorMessage) => {
              Alert.alert('Directions Error', errorMessage);
            }}
          />
        )}
      </MapView>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a location"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>

      {selectedLocation && (
  <View style={styles.locationInfo}>
    <Text style={styles.locationTitle}>{searchQuery}</Text>
    {locationDetails.city || locationDetails.country ? (
      <Text style={styles.locationSubText}>
        {locationDetails.city && `${locationDetails.city}, `}
        {locationDetails.country}
      </Text>
    ) : null}

    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.directionsButton} onPress={handleShowDirections}>
        <FontAwesome name="location-arrow" size={20} color="#fff" />
        <Text style={styles.buttonText}> Directions</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <FontAwesome name="bookmark" size={20} color="#000" />
        <Text style={styles.buttonText}> Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
    <FontAwesome name="share-alt" size={22} color="#000" />
  </TouchableOpacity>
    </View>
  </View>
)}

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
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
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    borderColor: '#48938F',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    fontSize: 16,
  },
  locationInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 15,
    elevation: 5,
  },
  locationTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color:"black",
    marginLeft:10
  },
  locationSubText: {
    fontSize: 17,
    color:"black",
    marginLeft:10
  },
  buttonContainer: {
    flexDirection: 'row',
     justifyContent: 'space-between',
    marginTop: 30,
    
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#48938F',
    padding: 12,
    borderRadius: 10,
    marginLeft:10
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    borderRadius: 10,
    marginRight:10
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 18,
    fontWeight:'bold',
    color:"black"
  },
  shareButton: {
    position: 'absolute',
    right: 10,
    top: -85,
    padding: 10,
  },
  
});

export default MapScreen;
