import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const CollectScreen = () => {
  const navigation = useNavigation(); // Access the navigation object

  const { width, height } = Dimensions.get('window'); // Get device width and height for responsive design

  // Sample project details
  const projectDetails = {
    id: '123456',
    timeFrame: '23 Oct to 25 Nov',
    country: 'India',
    city: 'Bhopal',
  };

  const handleStartPress = () => {
    // Navigate to CollectDataScreen
    navigation.navigate('CollectDataScreen');
  };

  return (
    <View style={[styles.container, { padding: width * 0.05 }]}>
      {/* Project Details Section - Centered */}
      <Text style={[styles.projectDetails, { fontSize: width * 0.07 }]}>Project Details</Text>

      {/* Middle Section with Project ID, Time Frame, and Start Button */}
      <View style={[styles.middleSection, { padding: width * 0.04 }]}>
        <View style={styles.projectInfoContainer}>
          <Text style={[styles.projectInfo, { fontSize: width * 0.05 }]}>
            Project ID: {projectDetails.id}
          </Text>
          <Text style={[styles.projectInfo, { fontSize: width * 0.05 }]}>
            Duration: {projectDetails.timeFrame}
          </Text>
          <Text style={[styles.projectInfo, { fontSize: width * 0.05 }]}>
            Country: {projectDetails.country}
          </Text>
          <Text style={[styles.projectInfo, { fontSize: width * 0.05 }]}>
            City: {projectDetails.city}
          </Text>
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={[
            styles.startButton,
            { paddingVertical: height * 0.02, paddingHorizontal: width * 0.1 },
          ]}
          onPress={handleStartPress}
        >
          <Text style={[styles.startButtonText, { fontSize: width * 0.045 }]}>Start</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F4F6F6',
  },
  projectDetails: {
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
    textAlign: 'center',
  },
  middleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderWidth: 1,
    borderColor: '#81C784',
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
  },
  projectInfoContainer: {
    flex: 1,
  },
  projectInfo: {
    marginBottom: 5,
    color: '#1B5E20',
  },
  startButton: {
    backgroundColor: '#388E3C',
    borderRadius: 5,
    marginLeft: 10,
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CollectScreen;
