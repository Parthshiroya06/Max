import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import icons
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
          const userDoc = await firestore()
            .collection('UserInformation')
            .doc(currentUser.email)
            .get();

          if (userDoc.exists) {
            const { name, photo, phone, institution } = userDoc.data();
            setUserData({ name, photo, phone, institution });
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
      await AsyncStorage.clear();
      await auth().signOut();
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Logout failed.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const user = auth().currentUser;

      if (user) {
        const userRef = firestore().collection('UserInformation').doc(user.uid);
        const allUserNamesRef = firestore().collection('ALLUserName').doc(user.uid);

        await userRef.delete();
        await allUserNamesRef.delete();
      }

      await AsyncStorage.clear();
      await auth().signOut();
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

      <View style={[styles.infoSection, styles.phoneSection]}>
        <Icon name="call-outline" size={20} color="black" style={styles.icon} />
        <Text style={[styles.phoneText, { fontWeight: 'bold' }]}>{userData?.phone || 'Your Phone Number'}</Text>
      </View>

      <View style={[styles.separator, { marginVertical: 5 }]} />

      <View style={styles.infoSection}>
        <Icon name="school-outline" size={20} color="black" style={styles.icon} />
        <Text style={[styles.institutionText, { fontWeight: 'bold' }]}>{userData?.institution || 'Your Institution'}</Text>
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
    backgroundColor: '#F4F6F9', // Slightly lighter gray for a cleaner look
    padding: 30,
    //justifyContent: 'center',
  },
  topSection: {
    alignItems: 'center',
    marginTop: height * 0.02, // Adjusted to shift the top section up
    marginBottom: height * 0.02, // Reduced margin-bottom to bring it up
  },
  profilePicture: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: (width * 0.4) / 2,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: '#E1E1E1', // Fallback color in case of missing image
    marginBottom: 15, // Reduced margin-bottom for closer alignment
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    transform: [{ scale: 1 }],
    transition: 'transform 0.3s ease',
  },
  profilePictureHovered: {
    transform: [{ scale: 1.05 }],
  },
  userName: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    marginTop: height * 0.02, // Adjusted margin-top to move the name up
    marginBottom: 5, // Reduced margin-bottom
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10, // Reduced vertical margin to bring sections closer
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    marginRight: 20,
  },
  phoneText: {
    fontSize: 18,
    color: '#555',
    fontWeight: '500',
  },
  institutionText: {
    fontSize: 18,
    color: '#555',
    fontWeight: '500',
  },
  separator: {
    height: 3,
    backgroundColor: '#D3D3D3',
    fontWeight: "bold",
    marginLeft: 6,
    marginVertical: 8, // Reduced vertical margin for a tighter layout
  },
  logoutButton: {
    position: 'absolute',
    bottom: 80, // Raised logout button
    left: 40,
    right: 40,
    backgroundColor: '#A0B6B0',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  deleteButton: {
    position: 'absolute',
    bottom: 10, // Raised delete button
    left: 40,
    right: 40,
    backgroundColor: '#FF3B30',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  deleteText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6F9',
  },
});


export default ProfileScreen;
