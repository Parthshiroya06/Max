import React, { useEffect, useState } from 'react'; 
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth().currentUser;

        if (currentUser) {
          // Fetch user data from Firestore
          const userDoc = await firestore().collection('UserInformation').doc(currentUser.email).get();

          if (userDoc.exists) {
            const { name, photo } = userDoc.data();
            setUserData({ name, photo });
          } else {
            console.error('User data not found in Firestore.');
            Alert.alert('Error', 'User data could not be retrieved.');
          }
        }
      } catch (error) {
        console.error('Error fetching user data from Firestore:', error);
        Alert.alert('Error', 'Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); // Clears all stored data
      await auth().signOut(); // Logs out the current user
      navigation.replace('Login'); // Navigate to the Login screen
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Logout failed.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const user = auth().currentUser;
  
      // Deleting data from Firebase collections
      if (user) {
        const userRef = firestore().collection('UserInformation').doc(user.uid);
        const allUserNamesRef = firestore().collection('ALLUserName').doc(user.uid);
  
        // Delete user data from both collections
        await userRef.delete();
        await allUserNamesRef.delete();
      }
  
      // Clearing local storage and logging out
      await AsyncStorage.clear(); // Clears all stored data
      await auth().signOut(); // Logs out the current user
  
      // Navigate to the Login screen
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during account deletion:', error);
      Alert.alert('Error', 'Account deletion failed.');
    }
  };
  
  
  

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: handleDeleteAccount, style: 'destructive' },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
      <Image
         source={{ uri: userData?.photo }}
         style={styles.profilePicture}
      />

        <Text style={styles.userName}>{userData?.name || 'Your Name'}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={confirmDeleteAccount}>
        <Text style={styles.deleteText}>Delete Account</Text>
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
    marginTop: height * 0.01,
  },
  profilePicture: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: (width * 0.4) / 2,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 80,
    left: 60,
    right: 60,
    backgroundColor: 'black',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  deleteButton: {
    position: 'absolute',
    bottom: 30,
    left: 60,
    right: 60,
    backgroundColor: 'black',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default ProfileScreen;
