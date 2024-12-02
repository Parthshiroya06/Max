import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');

// Function to scale font sizes based on screen width
const scaleFont = size => {
  const scale = width / 320;
  return Math.round(size * scale);
};

// LoginScreen component
const LoginScreen = ({navigation}) => {

   // Function to handle login button press
  const handleLogin = () => {
    navigation.navigate('MainTabs'); 
  };

  return (
    <View style={styles.container}>
      <Image
        source={{uri: 'logo4'}} // Ensure this is a valid image URL
        style={styles.image}
      />
      <Text style={styles.welcomeText}>Welcome!</Text>
      <Text style={styles.instituteText}>Max Planck Institute</Text>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: width * 0.05, 
  },
  image: {
    width: width * 0.8, 
    height: width * 0.8, 
    resizeMode: 'contain',
    marginBottom: height * 0.02, 
    borderRadius: 30,
    backgroundColor: 'white',
    marginLeft: width * 0.03,
  },
  emojiText: {
    fontSize: scaleFont(20), 
  },
  welcomeText: {
    fontSize: scaleFont(29), 
    fontWeight: 'bold',
    color: 'black',
    marginTop: height * 0.03, 
    marginLeft: 10,
  },
  instituteText: {
    fontSize: scaleFont(18), 
    color: 'black',
    fontWeight: 'bold',
    marginTop: height * 0.005, 
  },
  loginButton: {
    marginTop: height * 0.05, 
    backgroundColor: '#48938F', 
    paddingVertical: height * 0.015, 
    paddingHorizontal: width * 0.09, 
    alignItems: 'center', 
    borderWidth: 1,
    borderColor: 'black',
  },
  loginButtonText: {
    fontSize: scaleFont(18), 
    color: 'black',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
