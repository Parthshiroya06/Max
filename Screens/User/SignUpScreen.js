import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import SQLite from 'react-native-sqlite-storage';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // Import the useNavigation hook

const { width, height } = Dimensions.get('window');

// Initialize SQLite database
const db = SQLite.openDatabase(
  {
    name: 'UserDatabase.db',
    location: 'default',
  },
  () => {
    console.log('Database connected successfully.');
  },
  (error) => {
    console.log('Database connection failed: ', error);
  }
);

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

  const navigation = useNavigation();  // Access navigation

  // Initialize database and table
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          email TEXT,
          phone TEXT,
          institution TEXT,
          researchChair TEXT,
          position TEXT,
          researchArea TEXT,
          password TEXT,
          photo TEXT
        );`,
        [],
        () => {
          console.log('Users table created or already exists.');
        },
        (tx, error) => {
          console.error('Error creating table: ', error);
        }
      );
    });
  }, []);

  const logTableContent = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Users',
        [],
        (tx, results) => {
          const rows = results.rows;
          const columns = Object.keys(rows.item(0)); // Get column names from the first row
          let table = '';

          // Create header row
          table += columns.join(' | ') + '\n';
          table += '-'.repeat(table.length) + '\n'; // Divider

          // Loop through the rows and add each row to the table string
          for (let i = 0; i < rows.length; i++) {
            const row = rows.item(i);
            table += columns.map((column) => row[column]).join(' | ') + '\n';
          }

          console.log(table); // Log the table in the console
        },
        (tx, error) => {
          console.error('Failed to fetch table content: ', error);
        }
      );
    });
  };

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

  const handleSubmit = () => {
    const { name, email, phone, institution, researchChair, position, researchArea, password, confirmPassword, photo } = form;

    // Validate required fields
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    // Validate password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Invalid Password',
        'Password must be at least 8 characters long, contain uppercase, lowercase, a number, and a special character.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }

    if (!photo) {
      Alert.alert('Validation Error', 'Please upload a photo.');
      return;
    }

    // Check if name or email already exists
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM Users WHERE name = ? OR email = ?`,
        [name, email],
        (tx, results) => {
          if (results.rows.length > 0) {
            const existingUser = results.rows.item(0);
            if (existingUser.name === name) {
              Alert.alert('Name Taken', 'This name is already taken. Please choose a different name.');
            } else if (existingUser.email === email) {
              Alert.alert('Email Exists', 'This email is already registered. Please use a different email.');
            }
          } else {
            // Proceed with inserting the data
            db.transaction((tx) => {
              tx.executeSql(
                `INSERT INTO Users
                  (name, email, phone, institution, researchChair, position, researchArea, password, photo)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  name,
                  email,
                  phone,
                  institution,
                  researchChair,
                  position,
                  researchArea,
                  password,
                  photo,
                ],
                (tx, result) => {
                  Alert.alert('Success', 'Data saved successfully!');
                  setForm({
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

                  // Log table content after submission
                  console.log('Table Content After Submission:');
                  logTableContent();

                  // Navigate back to the previous screen (Login Screen)
                  navigation.goBack();
                },
                (tx, error) => {
                  console.error('Failed to insert data: ', error);
                  Alert.alert('Database Error', 'Failed to save data. Please try again.');
                }
              );
            });
          }
        },
        (tx, error) => {
          console.error('Failed to check name and email: ', error);
          Alert.alert('Database Error', 'Failed to check name and email. Please try again.');
        }
      );
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor={'gray'}
        value={form.name}
        onChangeText={(text) => handleChange('name', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={'gray'}
        value={form.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor={'gray'}
        value={form.phone}
        onChangeText={(text) => {
          if (text.length <= 10) {
            handleChange('phone', text); // Only update if text length is 10 or less
          }
        }}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Institution Name"
        placeholderTextColor={'gray'}
        value={form.institution}
        onChangeText={(text) => handleChange('institution', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Research Chair"
        placeholderTextColor={'gray'}
        value={form.researchChair}
        onChangeText={(text) => handleChange('researchChair', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Position"
        placeholderTextColor={'gray'}
        value={form.position}
        onChangeText={(text) => handleChange('position', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Research Area"
        placeholderTextColor={'gray'}
        value={form.researchArea}
        onChangeText={(text) => handleChange('researchArea', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={'gray'}
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
