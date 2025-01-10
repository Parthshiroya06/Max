import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const {width, height} = Dimensions.get('window');

const CollectScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [allocatedProjects, setAllocatedProjects] = useState([]);
  const [uploadedNotes, setUploadedNotes] = useState([]);
  const [liveProjects, setLiveProjects] = useState([]);

  const fetchProjects = useCallback(async () => {
    try {
      const user = auth().currentUser;
      if (user && user.email) {
        const userProjectsRef = firestore()
          .collection('UserInformation')
          .doc(user.email)
          .collection('projects');

        const snapshot = await userProjectsRef.get();
        const projects = snapshot.docs.map(doc => doc.data());

        const currentDate = new Date();
        const live = projects.filter(
          project => new Date(project.fromDate) <= currentDate,
        );

        setLiveProjects(live);
      }
    } catch (error) {
      console.error('Error fetching live projects:', error);
    }
  }, []);

  const fetchAllocatedProjects = useCallback(async () => {
    try {
      const user = auth().currentUser;
      if (user && user.email) {
        const allocatedProjectsRef = firestore()
          .collection('UserInformation')
          .doc(user.email)
          .collection('Allocated Project');

        const snapshot = await allocatedProjectsRef.get();
        const projects = snapshot.docs.map(doc => doc.data());

        setAllocatedProjects(projects);
      }
    } catch (error) {
      console.error('Error fetching allocated projects:', error);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchAllocatedProjects();
  }, [fetchProjects, fetchAllocatedProjects]);

  useFocusEffect(
    useCallback(() => {
      fetchProjects();
      fetchAllocatedProjects();
    }, [fetchProjects, fetchAllocatedProjects]),
  );

  useEffect(() => {
    if (route.params?.uploadedNotes) {
      setUploadedNotes(route.params.uploadedNotes);
    }
  }, [route.params?.uploadedNotes]);

  const renderProject = ({item}) => (
    <TouchableOpacity
      style={[styles.projectItem, item.isUploaded && styles.disabled]}
      onPress={() =>
        navigation.navigate('ProjectDetails', {projectId: item.id})
      }>
      <View style={styles.projectDetails}>
        <Text style={styles.projectID}>{item.id}</Text>
        <Text style={styles.CityCountry}>
          {item.cityName || 'No city'}, {item.country || 'No country'}
        </Text>
        <Text style={styles.Date}>
          {item.fromDate && item.toDate
            ? `${new Date(item.fromDate).toLocaleDateString()} - ${new Date(
                item.toDate,
              ).toLocaleDateString()}`
            : 'No date range'}
        </Text>
      </View>
      <View style={styles.statusIcon}>
        {item.isUploaded ? (
          <Icon name="cloud-done" size={28} color="black" />
        ) : (
          <Icon name="pending-actions" size={28} color="black" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Home2')}
            style={styles.backIconContainer}>
            <Text style={styles.backIcon}>{'\u2039'}</Text>
          </TouchableOpacity>
          <Text style={styles.header}>My Projects</Text>
        </View>

        <FlatList
          data={allocatedProjects}
          renderItem={renderProject}
          keyExtractor={item => item.id}
          style={styles.projectList}
        />
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
    marginTop: height * 0.03,
    marginRight: width * 0.03,
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
    marginLeft: width * 0.03,
  },
  backIcon: {
    fontSize: 37,
    color: 'black',
    fontWeight: 'bold',
  },
  projectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.04,
    backgroundColor: '#ACCAC8',
    marginBottom: 27,
    borderRadius: 10,
    marginLeft: width * 0.03,
    marginRight: width * 0.03,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
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
    color: 'black',
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

export default CollectScreen;

