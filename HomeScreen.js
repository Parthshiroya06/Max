import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Work in Progress</Text>
    </View>
  );
};

// Get device dimensions
const { width } = Dimensions.get('window');
const scale = width / 375; // Base width for scaling (e.g., iPhone 6/7/8 width)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Light background color for the screen
  },
  text: {
    fontSize: 24 * scale, // Responsive font size
    fontWeight: 'bold',
    color: '#333', // Darker color for the text
  },
});

export default HomeScreen;
