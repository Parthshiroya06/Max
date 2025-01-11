import React, { useState } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Dimensions } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const SignUpScreen = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    password: '',
    confirmPassword: '',
    photo: null,
  });

  const navigation = useNavigation();

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handlePhotoUpload = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };
  
    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.error('Image Picker Error: ', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
  
        // Upload to Cloudinary
        const data = new FormData();
        data.append('file', {
          uri,
          type: 'image/jpeg', // Adjust type based on your image
          name: 'profile_photo.jpg', // Set a name for the image
        });
        data.append('upload_preset', 'profile2'); // Replace with your Cloudinary upload preset
        data.append('cloud_name', 'dvockpszn'); // Replace with your Cloudinary cloud name
  
        try {
          const res = await fetch(`https://api.cloudinary.com/v1_1/dvockpszn/image/upload`, {
            method: 'POST',
            body: data,
          });
  
          const result = await res.json();
  
          if (result.secure_url) {
            setForm({ ...form, photo: result.secure_url });
            Alert.alert('Success', 'Photo uploaded successfully.');
          } else {
            Alert.alert('Upload Failed', 'Unable to upload photo.');
          }
        } catch (error) {
          console.error('Cloudinary Upload Error: ', error);
          Alert.alert('Error', 'Something went wrong during photo upload.');
        }
      }
    });
  };
  

  const handleSubmit = async () => {
    const {
      name,
      email,
      phone,
      institution,
      password,
      confirmPassword,
      photo,
    } = form;
  
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }
  
    try {
      // Check if a user with the same name already exists in Firestore
      const userQuery = await firestore()
        .collection('UserInformation')
        .where('name', '==', name)
        .get();
  
      if (!userQuery.empty) {
        // If there is a document with the same name, show an alert
        Alert.alert('Validation Error', 'This name already exists. Please choose another name.');
        return;
      }
  
      // Create the user with email and password
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
  
      // Set the user's displayName after successful creation
      await userCredential.user.updateProfile({
        displayName: name, // Set displayName to the user's name
      });
  
      // Send email verification
      await userCredential.user.sendEmailVerification();
  
      // Add user information to Firestore using email as the document ID
      await firestore().collection('UserInformation').doc(email).set({
        name,
        email,
        phone,
        institution,
        photo,
        createdAt: firestore.FieldValue.serverTimestamp(), // Timestamp for when the data is created
      });
  
      // Add user name to ALLUser collection
      await firestore().collection('ALLUserName').doc(email).set({
        name,
        email,
        createdAt: firestore.FieldValue.serverTimestamp(), // Timestamp for when the data is created
      });
  
      Alert.alert('Success', 'Sign-up successful! Please verify your email.');
      navigation.goBack();
    } catch (error) {
      console.error('Error during sign-up: ', error);
      Alert.alert('Error', error.message || 'Something went wrong during sign-up.');
    }
  };
  
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="gray"
        value={form.name}
        onChangeText={(text) => handleChange('name', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="gray"
        value={form.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="gray"
        value={form.phone}
        onChangeText={(text) => handleChange('phone', text)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Institution Name"
        placeholderTextColor="gray"
        value={form.institution}
        onChangeText={(text) => handleChange('institution', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="gray"
        value={form.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChangeText={(text) => handleChange('confirmPassword', text)}
        secureTextEntry
      />

      <TouchableOpacity style={styles.photoButton} onPress={handlePhotoUpload}>
        {form.photo && <Image source={{ uri: form.photo }} style={styles.photoPreview} />}
        <Text style={styles.photoButtonText}>
          {form.photo ? 'Change Photo' : 'Upload Photo'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: width * 0.05,
    backgroundColor: '#48938F',
  },
  header: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.02,
    color: 'black',
  },
  input: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    padding: height * 0.02,
    color: 'black',
    marginBottom: height * 0.02,
    fontSize: width * 0.04,
    backgroundColor: 'white',
  },
  photoButton: {
    padding: height * 0.02,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: height * 0.02,
    borderColor: 'black',
    borderWidth: 2,
    marginLeft: width * 0.06,
    marginRight: width * 0.06,
  },
  photoButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: width * 0.05,
  },
  photoPreview: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    alignSelf: 'center',
    marginBottom: height * 0.02,
  },
  submitButton: {
    padding: height * 0.02,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 2,
    marginLeft: width * 0.06,
    marginRight: width * 0.06,
  },
  submitButtonText: {
    color: 'black',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
