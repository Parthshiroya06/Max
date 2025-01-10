import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name: '',
    profilePicture: '',
  });
  const [isEditing, setIsEditing] = useState(false); // Tracks edit mode
  const [tempName, setTempName] = useState(''); // Temp name for editing

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        const profilePicture = await AsyncStorage.getItem('profilePicture'); // URI for the picture
        setUserData({
          name: name || 'Your Name',
          profilePicture: profilePicture || null, // Fallback for missing data
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); // Clears all stored data
      navigation.replace('Login'); // Navigate to the Login screen
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const saveName = async () => {
    try {
      await AsyncStorage.setItem('userName', tempName);
      setUserData((prevData) => ({ ...prevData, name: tempName }));
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error('Error saving name:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image
        //   source={
        //     userData.profilePicture
        //       ? { uri: userData.profilePicture }
        //       : require('./assets/placeholder.png') // Placeholder image
        //   }
          style={styles.profilePicture}
        />
        <View style={styles.nameContainer}>
          {isEditing ? (
            <TextInput
              value={tempName}
              onChangeText={setTempName}
              style={styles.nameInput}
              onSubmitEditing={saveName}
              placeholder="Enter your name"
            />
          ) : (
            <Text style={styles.userName}>{userData.name}</Text>
          )}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              setTempName(userData.name); // Set current name in temp
              setIsEditing(true); // Enable edit mode
            }}
          >
            <Text style={styles.editText}>✏️</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  topSection: {
    alignItems: 'center',
    marginTop: height * 0.01, // Responsive margin from top based on screen height
  },
  profilePicture: {
    width: width * 0.4, // 40% of screen width
    height: width * 0.4, // 40% of screen width
    borderRadius: (width * 0.4) / 2, // Half of the width to make it circular
    borderWidth: 2,
    borderColor: '#007AFF',
    marginBottom: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginLeft:20
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    borderBottomWidth: 1,
    borderColor: '#007AFF',
    marginRight: 10,
    width: width * 0.6, // TextInput takes 60% of screen width
  },
  editButton: {
    marginLeft: 10,
  },
  editText: {
    fontSize: 18,
    color: '#007AFF',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 30,
    left: 60,
    right: 60,
    backgroundColor: 'black',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ProfileScreen;
