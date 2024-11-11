import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const SetupScreen = () => {
  const navigation = useNavigation();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const storedProjects = await AsyncStorage.getItem('projects');
        if (storedProjects) {
          setProjects(JSON.parse(storedProjects));
        }
      } catch (error) {
        console.error('Error loading projects from AsyncStorage:', error);
      }
    };

    loadProjects();
  }, []);



  const renderProject = ({ item }) => (
    <TouchableOpacity style={styles.projectItem}>
      <View style={styles.projectDetails}>
        <Text style={styles.projectID}>{item.id}</Text>
        <Text style={styles.CityCountry}>{item.substrates.join(', ')}, {item.waterTypes.join(', ')}</Text>
        <Text style={styles.Date}>
          {item.fromDate && item.toDate ? `${new Date(item.fromDate).toLocaleDateString()} - ${new Date(item.toDate).toLocaleDateString()}` : 'No date range'}
        </Text>
      </View>
      <View style={styles.statusIcon}>
        <Icon name="pending-actions" size={28} color="black" />
      </View>
    </TouchableOpacity>
  );


  
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Home2')} style={styles.backIconContainer}>
            <Text style={styles.backIcon}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Projects</Text>
        </View>


        {/*  This FlatList renders the list of projects. */}
        <FlatList
          data={projects}
          renderItem={renderProject}
          ListEmptyComponent={<Text style={styles.emptyComponent}>No projects available</Text>}
          keyExtractor={(item) => item.id.toString()}
        />

        {/* Button to Create New Project */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SetupDetail')}>
        <View style={styles.buttonContent}>
            <Text style={styles.plusSign}>+</Text>
            <Text style={styles.buttonText}>Create project</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: width * 0.05,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.05,
    marginTop:height * 0.03,
    marginRight:width * 0.03
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    flex: 1, 
  },
  backIconContainer: {
    paddingRight: 8,
    marginLeft:width * 0.03
  },
  backIcon: {
    fontSize: 37,
    color: 'black',
    fontWeight: 'bold'
  },
  projectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.04,
    backgroundColor: '#ACCAC8',
    marginBottom: 27,
    borderRadius: 10,
    marginLeft:width * 0.03,
    marginRight:width * 0.03,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 9, 
    elevation: 9, 
  },
    projectDetails: {
    flex: 1,
  },
    projectID: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
  },
  CityCountry: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: height * 0.02,
  },
  Date: {
    color: 'black',
    fontSize: 14,
    marginTop: height * 0.02,
  },
  statusIcon: {
    position: 'absolute',
    top: height * 0.04,
    right: width * 0.05,
  },
  button: {
    backgroundColor: '#48938F',
    paddingVertical: height * 0.016,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: height * 0.3,
    marginRight:width * 0.03,
    marginLeft:width * 0.03,
    borderWidth:2,
    borderColor:"black"
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusSign: {
    color: 'black',
    fontSize: 28,
    marginRight: 9,
    fontWeight:"bold"
  },
  buttonText: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
  },
  scrollViewContent: {
    paddingBottom: height * 0.05,
  },
  emptyComponent: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
    marginTop: height * 0.3,
  },
});

export default SetupScreen;
