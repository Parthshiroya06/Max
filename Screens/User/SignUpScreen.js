// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
// import { launchImageLibrary } from 'react-native-image-picker';
// import { Dimensions } from 'react-native';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import { useNavigation } from '@react-navigation/native';

// const { width, height } = Dimensions.get('window');

// const SignUpScreen = () => {
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     institution: '',
//     researchChair: '',
//     position: '',
//     researchArea: '',
//     password: '',
//     confirmPassword: '',
//     photo: null,
//   });

//   const navigation = useNavigation();

//   const handleChange = (key, value) => {
//     setForm({ ...form, [key]: value });
//   };

//   const handlePhotoUpload = () => {
//     const options = {
//       mediaType: 'photo',
//       maxWidth: 300,
//       maxHeight: 300,
//       quality: 1,
//     };

//     launchImageLibrary(options, (response) => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.errorMessage) {
//         console.error('Image Picker Error: ', response.errorMessage);
//       } else {
//         const uri = response.assets[0].uri;
//         setForm({ ...form, photo: uri });
//       }
//     });
//   };

//   const handleSubmit = async () => {
//     const { name, email, phone, institution, researchChair, position, researchArea, password, confirmPassword, photo } = form;

//     if (!name || !email || !phone || !password || !confirmPassword) {
//       Alert.alert('Validation Error', 'Please fill in all required fields.');
//       return;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert('Validation Error', 'Passwords do not match.');
//       return;
//     }

//     try {
//       const userCredential = await auth().createUserWithEmailAndPassword(email, password);

//       // Send email verification
//       await userCredential.user.sendEmailVerification();

//       // Add user to Firestore
//       await firestore().collection('Users').doc(userCredential.user.uid).set({
//         name,
//         email,
//         phone,
//         institution,
//         researchChair,
//         position,
//         researchArea,
//         photo,
//       });

//       Alert.alert('Success', 'Sign-up successful! Please verify your email.');
//       navigation.goBack();
//     } catch (error) {
//       console.error('Error during sign-up: ', error);
//       Alert.alert('Error', error.message || 'Something went wrong during sign-up.');
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.header}>Sign Up</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Name"
//         placeholderTextColor="gray"
//         value={form.name}
//         onChangeText={(text) => handleChange('name', text)}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         placeholderTextColor="gray"
//         value={form.email}
//         onChangeText={(text) => handleChange('email', text)}
//         keyboardType="email-address"
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Phone Number"
//         placeholderTextColor="gray"
//         value={form.phone}
//         onChangeText={(text) => handleChange('phone', text)}
//         keyboardType="numeric"
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Institution Name"
//         placeholderTextColor="gray"
//         value={form.institution}
//         onChangeText={(text) => handleChange('institution', text)}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Research Chair"
//         placeholderTextColor="gray"
//         value={form.researchChair}
//         onChangeText={(text) => handleChange('researchChair', text)}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Position"
//         placeholderTextColor="gray"
//         value={form.position}
//         onChangeText={(text) => handleChange('position', text)}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Research Area"
//         placeholderTextColor="gray"
//         value={form.researchArea}
//         onChangeText={(text) => handleChange('researchArea', text)}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         placeholderTextColor="gray"
//         value={form.password}
//         onChangeText={(text) => handleChange('password', text)}
//         secureTextEntry
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Confirm Password"
//         value={form.confirmPassword}
//         onChangeText={(text) => handleChange('confirmPassword', text)}
//         secureTextEntry
//       />

//       <TouchableOpacity style={styles.photoButton} onPress={handlePhotoUpload}>
//         {form.photo && <Image source={{ uri: form.photo }} style={styles.photoPreview} />}
//         <Text style={styles.photoButtonText}>
//           {form.photo ? 'Change Photo' : 'Upload Photo'}
//         </Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//         <Text style={styles.submitButtonText}>Sign Up</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }; `1b `

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: width * 0.05,
//     backgroundColor: '#48938F',
//   },
//   header: {
//     fontSize: width * 0.07,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: height * 0.02,
//     color: 'black',
//   },
//   input: {
//     borderWidth: 2,
//     borderColor: 'black',
//     borderRadius: 10,
//     padding: height * 0.02,
//     color: 'black',
//     marginBottom: height * 0.02,
//     fontSize: width * 0.04,
//     backgroundColor: 'white',
//   },
//   photoButton: {
//     padding: height * 0.02,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: height * 0.02,
//     borderColor: 'black',
//     borderWidth: 2,
//     marginLeft: width * 0.06,
//     marginRight: width * 0.06,
//   },
//   photoButtonText: {
//     color: 'black',
//     fontWeight: 'bold',
//     fontSize: width * 0.05,
//   },
//   photoPreview: {
//     width: width * 0.3,
//     height: width * 0.3,
//     borderRadius: width * 0.15,
//     alignSelf: 'center',
//     marginBottom: height * 0.02,
//   },
//   submitButton: {
//     padding: height * 0.02,
//     borderRadius: 10,
//     alignItems: 'center',
//     borderColor: 'black',
//     borderWidth: 2,
//     marginLeft: width * 0.06,
//     marginRight: width * 0.06,
//   },
//   submitButtonText: {
//     color: 'black',
//     fontSize: width * 0.05,
//     fontWeight: 'bold',
//   },
// });

// export default SignUpScreen;








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
    researchChair: '',
    position: '',
    researchArea: '',
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

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.error('Image Picker Error: ', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setForm({ ...form, photo: uri });
      }
    });
  };

  const handleSubmit = async () => {
    const {
      name,
      email,
      phone,
      institution,
      researchChair,
      position,
      researchArea,
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
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);

      // Send email verification
      await userCredential.user.sendEmailVerification();

      // Add user information to Firestore using email as the document ID
      await firestore().collection('UserInformation').doc(email).set({
        name,
        email,
        phone,
        institution,
        researchChair,
        position,
        researchArea,
        photo,
        createdAt: firestore.FieldValue.serverTimestamp(), // Timestamp for when the data is created
      });

        // Add user name to ALLUser collection
    await firestore().collection('ALLUserName').doc(email).set({
      name,
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
        placeholder="Research Chair"
        placeholderTextColor="gray"
        value={form.researchChair}
        onChangeText={(text) => handleChange('researchChair', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Position"
        placeholderTextColor="gray"
        value={form.position}
        onChangeText={(text) => handleChange('position', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Research Area"
        placeholderTextColor="gray"
        value={form.researchArea}
        onChangeText={(text) => handleChange('researchArea', text)}
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

