// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, PermissionsAndroid, Platform, Alert, ActivityIndicator } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';

// const  = () => {
//   const [location, setLocation] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const requestLocationPermission = async () => {
//       try {
//         if (Platform.OS === 'android') {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//             {
//               title: 'Location Permission',
//               message: 'This app needs access to your location to show it on the map.',
//               buttonPositive: 'OK',
//             }
//           );

//           if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             getLocation();
//           } else {
//             Alert.alert('Permission Denied', 'Location access is required to show your position on the map.');
//           }
//         } else {
//           getLocation();
//         }
//       } catch (err) {
//         console.warn(err);
//       }
//     };

//     const getLocation = () => {
//       navigator.geolocation.getCurrentPosition(
//         position => {
//           const { latitude, longitude } = position.coords;
//           setLocation({ latitude, longitude });
//           setLoading(false);
//         },
//         error => {
//           Alert.alert('Error', `Failed to get location: ${error.message}`);
//           setLoading(false);
//         },
//         { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
//       );
//     };

//     requestLocationPermission();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text>Fetching your location...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {location ? (
//         <MapView
//           style={styles.map}
//           initialRegion={{
//             latitude: location.latitude,
//             longitude: location.longitude,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//           }}
//         >
//           <Marker coordinate={location} title="You are here!" />
//         </MapView>
//       ) : (
//         <Text style={styles.errorText}>Location not available</Text>
//       )}
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
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     textAlign: 'center',
//     marginTop: 20,
//     fontSize: 16,
//     color: 'red',
//   },
// });

// export default MapScreen;
