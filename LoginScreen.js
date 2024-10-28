import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Function to scale font sizes
const scaleFont = (size) => {
  const scale = width / 320; // Based on iPhone 5's width
  return Math.round(size * scale);
};

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'logo4' }} // Ensure this is a valid image URL
        style={styles.image}
      />
      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.emojiText}>🆘</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    paddingHorizontal: width * 0.05, // 5% of screen width
  },
  image: {
    width: width * 0.4, // 40% of screen width
    height: width * 0.4, // Maintain aspect ratio
    resizeMode: 'contain',
    marginBottom: height * 0.02, // 2% of screen height
    borderRadius: 30,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the emoji horizontally
    alignItems: 'center', // Center the emoji vertically
    marginBottom: height * 0.02, // 2% of screen height
  },
  socialButton: {
    backgroundColor: 'red',
    padding: height * 0.02, // Adjusted for responsive padding
    borderRadius: 30,
    alignItems: 'center', // Center the emoji in the button
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: scaleFont(20), // Scale emoji size
  },
});

export default LoginScreen;
