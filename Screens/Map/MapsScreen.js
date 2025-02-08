import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Share from 'react-native-share';
import Geolocation from '@react-native-community/geolocation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

MapboxGL.setAccessToken('your-mapbox-access-token');

const MapScreen = ({ navigation }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [offlineRegion, setOfflineRegion] = useState(null);
  const [route, setRoute] = useState(null);

  useEffect(() => {
    console.log('Component mounted');
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        console.log('Requesting location permission');
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Location permission is required.');
          return;
        }
      }
      console.log('Fetching current location');
      Geolocation.getCurrentPosition(
        (position) => {
          console.log('Current location:', position.coords);
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Location error:', error);
          Alert.alert('Error', 'Unable to fetch current location.');
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    };
    requestLocationPermission();
  }, []);

  const downloadOfflineRegion = async () => {
    console.log('Downloading offline region');
    const bounds = [
      [currentLocation.longitude - 0.1, currentLocation.latitude - 0.1],
      [currentLocation.longitude + 0.1, currentLocation.latitude + 0.1],
    ];
    try {
      const region = await MapboxGL.offlineManager.createPack({
        name: 'offline_map',
        styleURL: MapboxGL.StyleURL.Street,
        bounds,
        minZoom: 10,
        maxZoom: 16,
        metadata: { name: 'Offline Map' },
      });
      console.log('Offline region downloaded:', region);
      setOfflineRegion(region);
      Alert.alert('Offline Map', 'Map region downloaded for offline use.');
    } catch (error) {
      console.error('Offline map download error:', error);
      Alert.alert('Error', 'Failed to download offline map.');
    }
  };

  const searchLocationOffline = async () => {
    if (!searchQuery) return;
    console.log('Searching for location:', searchQuery);
    try {
      const results = await MapboxGL.offlineManager.geocode(searchQuery);
      if (results.length > 0) {
        console.log('Search results:', results[0]);
        setSelectedLocation({
          latitude: results[0].latitude,
          longitude: results[0].longitude,
        });
      } else {
        console.warn('No search results found');
        Alert.alert('No results', 'Try a different search term.');
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Search is unavailable offline.');
    }
  };

  const fetchOfflineDirections = async () => {
    if (!currentLocation || !selectedLocation) return;
    console.log('Fetching directions from', currentLocation, 'to', selectedLocation);
    try {
      const route = await MapboxGL.offlineManager.getDirections({
        profile: 'driving',
        waypoints: [
          [currentLocation.longitude, currentLocation.latitude],
          [selectedLocation.longitude, selectedLocation.latitude],
        ],
      });
      console.log('Directions fetched:', route);
      setRoute(route);
    } catch (error) {
      console.error('Directions error:', error);
      Alert.alert('Error', 'Could not fetch offline directions.');
    }
  };

  const handleSave = async () => {
    if (selectedLocation) {
      console.log('Saving location:', selectedLocation);
      try {
        await AsyncStorage.setItem(
          'savedLocation',
          JSON.stringify({ searchLocation: searchQuery, coordinates: selectedLocation })
        );
        Alert.alert('Success', 'Location saved successfully!');
        setSelectedLocation(null);
        setSearchQuery('');
      } catch (error) {
        console.error('Save location error:', error);
        Alert.alert('Error', 'Failed to save location.');
      }
    } else {
      console.warn('No location selected');
      Alert.alert('No location selected', 'Please select a location first.');
    }
  };

  const handleShare = async () => {
    if (!selectedLocation) {
      console.warn('No location selected for sharing');
      Alert.alert('No location selected', 'Please select a location first.');
      return;
    }
    const shareMessage = `📍 Location: ${searchQuery}\n🌍 Coordinates: ${selectedLocation.latitude}, ${selectedLocation.longitude}`;
    console.log('Sharing location:', shareMessage);
    try {
      await Share.open({ message: shareMessage });
    } catch (error) {
      console.error('Share error:', error);
    }
  };


  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera
          zoomLevel={12}
          centerCoordinate={
            currentLocation ? [currentLocation.longitude, currentLocation.latitude] : [0, 0]
          }
        />
        {currentLocation && (
          <MapboxGL.PointAnnotation
            id="currentLocation"
            coordinate={[currentLocation.longitude, currentLocation.latitude]}
          />
        )}
        {selectedLocation && (
          <MapboxGL.PointAnnotation
            id="selectedLocation"
            coordinate={[selectedLocation.longitude, selectedLocation.latitude]}
          />
        )}
        {route && (
          <MapboxGL.ShapeSource id="routeSource" shape={route.geometry}>
            <MapboxGL.LineLayer id="routeLayer" style={styles.route} />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter location name"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.iconButton} onPress={searchLocationOffline}>
          <FontAwesome name="search" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleSave}>
          <FontAwesome name="bookmark" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
          <FontAwesome name="share-alt" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.footerButtons}>
        <TouchableOpacity style={styles.downloadButton} onPress={downloadOfflineRegion}>
          <FontAwesome name="download" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.directionButton} onPress={fetchOfflineDirections}>
          <FontAwesome name="road" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  searchContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    borderColor: '#48938F',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
    color: 'black',
  },
  iconButton: { padding: 10 },
  footerButtons: {
    position: 'absolute',
    bottom: 30,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  downloadButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
  },
  directionButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 10,
  },
  route: {
    lineColor: 'blue',
    lineWidth: 4,
  },
});

export default MapScreen;
