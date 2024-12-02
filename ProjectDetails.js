import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useUploadStatus} from './UploadStatusProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

// Functional component for rendering each note entry
const NoteEntry = ({Serial, userName, onPress, isUploaded}) => (
  <TouchableOpacity style={styles.noteEntry} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Text style={styles.noteIcon}>📝</Text>
    </View>

    <View style={styles.noteInfo}>
      <Text style={styles.noteDate}>{Serial}</Text>
      <Text style={styles.noteUser}>{userName}</Text>
    </View>
    <View style={styles.iconContainer}>
      {isUploaded ? (
        <Icon name="cloud-done" size={26} color="black" />
      ) : (
        <Icon name="pending-actions" size={26} color="black" />
      )}
    </View>
  </TouchableOpacity>
);

const ProjectDetails = () => {
  const navigation = useNavigation(); // Hook to handle navigation
  const route = useRoute(); // Hook to access route parameters
  const {projects, updateProjectUploadStatus, uploadedNotes, setUploadedNotes} =
    useUploadStatus(); // Access the context
  const {projectId} = route.params; // Extract projectId from route params
  const [project, setProject] = useState(null); // State to store project details
  const [showFullDescription, setShowFullDescription] = useState(false); // State to toggle full description visibility

  // Function to toggle description visibility
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  // useFocusEffect hook to load project notes whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const loadProjectDetails = async () => {
        try {
          const storedProjects = await AsyncStorage.getItem('projects');
          if (storedProjects) {
            const projects = JSON.parse(storedProjects);
            const projectDetails = projects.find(p => p.id === projectId); // Find the project with the given projectId
            setProject(projectDetails); // Update the project state
          }

          const storedNotes = await AsyncStorage.getItem(projectId); // Fetch notes for the specific project
          const notes = storedNotes ? JSON.parse(storedNotes) : [];
          setUploadedNotes(notes); // Update the notes state
        } catch (error) {
          console.error('Error loading project details:', error);
        }
      };

      loadProjectDetails();
    }, [projectId]), // Reload whenever projectId changes or screen comes into focus
  );
  
  // Effect to handle new notes passed through route params
  useEffect(() => {
    if (route.params?.newNote) {
      setUploadedNotes(prevNotes => {
        // Prevent duplicates
        const existingNote = prevNotes.find(
          note => note.id === route.params.newNote.id,
        );
        return existingNote ? prevNotes : [...prevNotes, route.params.newNote];
      });
    }
  }, [route.params]);

  // Function to handle note press
  const handleNotePress = note => {
    if (project.isUploaded) {
      navigation.navigate('UploadedNoteScreen', {
        note,
        noteSerial: note.Serial,
        projectId,
      });
    } else {
      navigation.navigate('CollectScreen', {
        note,
        noteSerial: note.Serial,
        projectId,
      });
    }
  };
 
  // Function to handle add notes press
  const handleAddNotesPress = () => {
    navigation.navigate('CollectScreen', {
      projectId,
    });
  };

  // Use navigation.setOptions for the callback
  useEffect(() => {
    navigation.setOptions({
      onNewNoteAdded: newNote => setUploadedNotes([...uploadedNotes, newNote]),
    });
  }, []);

  // Function to handle upload notes press
  const handleUploadNotesPress = async () => {
    // Update the specific project’s isUploaded status and save it to AsyncStorage
    updateProjectUploadStatus(projectId, true);

    // Update the state to reflect the changes immediately
    setUploadedNotes(prevNotes => {
      return prevNotes.map(note => ({
        ...note,
        isUploaded: true, // Mark each note as uploaded
      }));
    });

    try {
      // Persist changes to AsyncStorage for projects
      const updatedProjects = projects.map(project =>
        project.id === projectId ? {...project, isUploaded: true} : project,
      );

      // Immediately update AsyncStorage for projects
      await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));

      // Update the notes in AsyncStorage as well
      await AsyncStorage.setItem(projectId, JSON.stringify(uploadedNotes));

      // Reload the project details by setting the project state again
      const storedProjects = await AsyncStorage.getItem('projects');
      if (storedProjects) {
        const projectsList = JSON.parse(storedProjects);
        const updatedProject = projectsList.find(p => p.id === projectId);
        setProject(updatedProject); // Re-fetch and update the project details
      }

      console.log('Notes uploaded successfully');
    } catch (error) {
      console.error('Error updating upload status:', error);
    }
  };

  // Function to format date
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', // Abbreviated month name
      day: 'numeric',
    });
  };

  if (!project) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading Project Details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.projectId}>{project.id}</Text>

      <View style={styles.locationSection}>
        <Text style={styles.location}>
          {project.waterTypes} , {project.country}
        </Text>
        <Text style={styles.dateRange}>
          {formatDate(project.fromDate)} - {formatDate(project.toDate)}
        </Text>
      </View>

      <View style={styles.teamSection}>
        <Text style={styles.teamLabel}>Team</Text>
        <Text style={styles.teamMembers}>
          {Array.isArray(project.habitats)
            ? project.habitats.join(' , ')
            : project.habitats}
        </Text>
      </View>

      <View style={styles.descriptionSection}>
        <Text style={styles.teamLabel}>Description:</Text>
        <Text style={styles.teamMembers}>
          {showFullDescription
            ? project.description
            : `${project.description.substring(0, 100)}`}
          <Text style={styles.toggleText} onPress={toggleDescription}>
            {showFullDescription ? '   ......less' : '  .....more'}
          </Text>
        </Text>
      </View>

      <View style={styles.fieldNotesSection}>
        <Text style={styles.fieldNotesLabel}>Field Notes</Text>
        {(uploadedNotes || []).length > 0 ? (
          <FlatList
            data={uploadedNotes}
            renderItem={({item}) => (
              <NoteEntry
                Serial={item.Serial}
                userName={item.userName}
                onPress={() => handleNotePress(item)}
                isUploaded={project.isUploaded}
              />
            )}
            keyExtractor={item => item.id}
          />
        ) : (
          <>
            <Text style={styles.noNotesMessage}>No field notes available.</Text>
            <Text style={styles.noNotesSubtext}>
              Create your first note to get started!
            </Text>
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {!project.isUploaded && (
          <>
            <TouchableOpacity
              style={
                (uploadedNotes || []).length > 0
                  ? styles.uploadButton
                  : styles.addButton
              }
              onPress={
                (uploadedNotes || []).length > 0
                  ? handleUploadNotesPress
                  : handleAddNotesPress
              }>
              <Text
                style={
                  (uploadedNotes || []).length > 0
                    ? styles.uploadButtonText
                    : styles.addButtonText
                }>
                {(uploadedNotes || []).length > 0 ? 'Upload' : 'Add Notes'}
              </Text>
            </TouchableOpacity>

            {(uploadedNotes || []).length > 0 && (
              <TouchableOpacity
                style={styles.addButton2}
                onPress={handleAddNotesPress}>
                <Text style={styles.addButtonText2}>Add Notes</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B6D4D2',
    padding: screenWidth * 0.05,
  },
  projectId: {
    fontSize: screenWidth * 0.06,
    fontWeight: 'bold',
    marginBottom: screenHeight * 0.02,
    color: 'black',
    textAlign: 'center',
  },
  locationSection: {
    marginBottom: screenHeight * 0.015,
  },
  location: {
    fontSize: screenWidth * 0.05,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: screenWidth * 0.05,
    marginTop: screenHeight * 0.04,
  },
  dateRange: {
    fontSize: screenWidth * 0.04,
    color: 'black',
    marginLeft: screenWidth * 0.05,
    fontWeight: 'bold',
    marginTop: screenHeight * 0.01,
  },
  teamSection: {
    marginBottom: screenHeight * 0.02,
  },
  teamLabel: {
    fontSize: screenWidth * 0.05,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: screenWidth * 0.05,
    marginTop: screenHeight * 0.02,
  },
  teamMembers: {
    fontSize: screenWidth * 0.04,
    color: 'black',
    marginLeft: screenWidth * 0.05,
    marginTop: screenHeight * 0.01,
  },
  fieldNotesSection: {
    marginBottom: screenHeight * 0.04,
    marginTop: screenHeight * 0.03,
  },
  fieldNotesLabel: {
    fontSize: screenWidth * 0.05,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: screenWidth * 0.05,
    marginBottom: screenHeight * 0.02,
  },
  noNotesMessage: {
    fontSize: screenWidth * 0.04,
    color: 'black',
    marginTop: screenHeight * 0.15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  noNotesSubtext: {
    fontSize: screenWidth * 0.045,
    color: 'black',
    textAlign: 'center',
    marginTop: screenHeight * 0.005,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: screenWidth * 0.05,
    marginRight: screenWidth * 0.05,
  },
  addButton: {
    backgroundColor: '#48938F',
    paddingVertical: screenHeight * 0.018,
    alignItems: 'center',
    marginTop: screenHeight * 0.12,
    paddingHorizontal: screenWidth * 0.25,
    justifyContent: 'center',
    borderRadius: 7,
    borderWidth: 2,
    marginLeft: screenWidth * 0.013,
    borderColor: 'black',
  },
  addButtonText: {
    fontSize: screenWidth * 0.058,
    fontWeight: 'bold',
    color: 'black',
  },
  addButton2: {
    backgroundColor: '#48938F',
    paddingVertical: screenHeight * 0.018,
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.05,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'black',
    marginBottom: screenHeight * 0.04,
  },
  addButtonText2: {
    fontSize: screenWidth * 0.05,
    fontWeight: 'bold',
    color: 'black',
  },
  uploadButton: {
    backgroundColor: '#48938F',
    paddingVertical: screenHeight * 0.015,
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.08,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'black',
    marginBottom: screenHeight * 0.04,
  },
  uploadButtonText: {
    fontSize: screenWidth * 0.055,
    fontWeight: 'bold',
    color: 'black',
  },
  noteEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#48938F',
    padding: screenHeight * 0.02,
    borderRadius: 10,
    marginVertical: screenHeight * 0.005,
    marginLeft: screenWidth * 0.045,
    marginRight: screenWidth * 0.045,
  },
  iconContainer: {
    width: screenWidth * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteInfo: {
    flex: 1,
    paddingLeft: screenWidth * 0.04,
  },
  noteDate: {
    fontSize: screenWidth * 0.04,
    fontWeight: 'bold',
    paddingBottom: screenHeight * 0.005,
    color: 'black',
  },
  noteUser: {
    fontSize: screenWidth * 0.035,
    color: 'black',
  },
  noteIcon: {
    fontSize: screenWidth * 0.08,
    fontWeight: 'bold',
    color: 'black',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'gray',
  },
  toggleText: {
    color: 'blue',
    fontSize: 16,
  },
});

export default ProjectDetails;
