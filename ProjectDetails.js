import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUploadStatus } from './UploadStatusProvider';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const NoteEntry = ({ date, userName, onPress, isUploaded }) => (
    <TouchableOpacity style={styles.noteEntry} onPress={onPress}>
        <View style={styles.iconContainer}>
            <Text style={styles.noteIcon}>📝</Text>
        </View>

        <View style={styles.noteInfo}>
            <Text style={styles.noteDate}>{date}</Text>
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
    const navigation = useNavigation();
    const route = useRoute();
    const { isUploaded, setIsUploaded,  uploadedNotes, setUploadedNotes } = useUploadStatus(); // Access the context


    //const [isUploaded, setIsUploaded] = useState(false);
    //const [fieldNotes, setFieldNotes] = useState([]);

    useEffect(() => {
        if (route.params?.newNote) {
            setUploadedNotes(prevNotes => {
                // Prevent duplicates
                const existingNote = prevNotes.find(note => note.id === route.params.newNote.id);
                return existingNote ? prevNotes : [...prevNotes, route.params.newNote];
            });
        }

        if (route.params?.isUploaded !== undefined) {
            setIsUploaded(route.params.isUploaded);
        }
    }, [route.params]);

    const handleNotePress = (isUploaded, note) => {
        navigation.navigate('CollectScreen', { note });
    };

    const handleAddNotesPress = () => {
        navigation.navigate('CollectScreen');
    };

    const handleUploadNotesPress = () => {
        setIsUploaded(true);
        //navigation.navigate('Project', { isUploaded: true });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.projectId}>#projectId01</Text>

            <View style={styles.locationSection}>
                <Text style={styles.location}>Bangkok, Thailand</Text>
                <Text style={styles.dateRange}>25th Oct - 09th Nov</Text>
            </View>

            <View style={styles.teamSection}>
                <Text style={styles.teamLabel}>Team:</Text>
                <Text style={styles.teamMembers}>Sam Turner, Elizabeth Schmidt, David Schulz</Text>
            </View>

            <View style={styles.teamSection}>
                <Text style={styles.teamLabel}>Description:</Text>
                <Text style={styles.teamMembers}>The Thailand Rainforest Expedition 2024 month-long study focused on documenting...</Text>
            </View>

            <View style={styles.fieldNotesSection}>
                <Text style={styles.fieldNotesLabel}>Field Notes</Text>
                {(uploadedNotes || []).length > 0 ? (
                    <FlatList
                        data={uploadedNotes}
                        renderItem={({ item }) => (
                            <NoteEntry
                                date={item.date}
                                userName={item.userName}
                                onPress={() => handleNotePress(item)}
                                isUploaded={isUploaded}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                ) : (
                    <>
                        <Text style={styles.noNotesMessage}>No field notes available.</Text>
                        <Text style={styles.noNotesSubtext}>Create your first note to get started!</Text>
                    </>
                )}
            </View>

            <View style={styles.buttonContainer}>
                {!isUploaded && (
                    <>
                        <TouchableOpacity
                            style={(uploadedNotes || []).length > 0 ? styles.uploadButton : styles.addButton}
                            onPress={(uploadedNotes || []).length > 0 ? handleUploadNotesPress : handleAddNotesPress}
                        >
                            <Text style={(uploadedNotes || []).length > 0 ? styles.uploadButtonText : styles.addButtonText}>
                                {(uploadedNotes || []).length > 0 ? 'Upload' : 'Add Notes'}
                            </Text>
                        </TouchableOpacity>

                        {(uploadedNotes || []).length > 0 && (
                            <TouchableOpacity style={styles.addButton2} onPress={handleAddNotesPress}>
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
        color: "black",
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
        textAlign: "center",
        fontWeight: 'bold',
    },
    noNotesSubtext: {
        fontSize: screenWidth * 0.045,
        color: 'black',
        textAlign: "center",
        marginTop: screenHeight * 0.005,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addButton: {
        backgroundColor: '#48938F',
        paddingVertical: screenHeight * 0.015,
        alignItems: 'center',
        marginTop: screenHeight * 0.12,
        paddingHorizontal: screenWidth * 0.25,
        justifyContent: 'center',
        borderRadius: 7,
        borderWidth: 2,
        marginLeft:screenWidth * 0.07,
        borderColor: 'black',
    },
    addButtonText: {
        fontSize: screenWidth * 0.055,
        fontWeight: 'bold',
        color: 'black',
    },
    addButton2: {
        backgroundColor: '#48938F',
        paddingVertical: screenHeight * 0.017,
        alignItems: 'center',
        paddingHorizontal: screenWidth * 0.09,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: 'black',
        marginBottom:screenHeight * 0.04
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
        paddingHorizontal: screenWidth * 0.12,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: 'black',
        marginBottom:screenHeight * 0.04
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
        marginLeft:screenWidth * 0.045,
        marginRight:screenWidth * 0.045
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
});

export default ProjectDetails;