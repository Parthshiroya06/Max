import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

// Get device dimensions
const { width, height } = Dimensions.get('window');

// Function to scale font sizes
const scaleFont = (size) => {
  const scale = width / 320; // Based on iPhone 5's width
  return Math.round(size * scale);
};

const SetupScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Work in Progress</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Light background color for the screen
    paddingHorizontal: width * 0.05, // 5% of screen width for horizontal padding
  },
  text: {
    fontSize: scaleFont(24), // Responsive font size
    fontWeight: 'bold',
    color: '#333', // Darker color for the text
  },
});

export default SetupScreen;
