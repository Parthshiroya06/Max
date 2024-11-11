import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const VialPicture = ({ route }) => {
    const { selectedImage, imageName = 'Unnamed', imageSizeMB = '0', onPress, onDelete } = route.params;
    const [showImage, setShowImage] = useState(false);  // State to toggle visibility

    const handlePress = () => {
        setShowImage(true);  // Show image and hide the rest
    };

    const handleBackPress = () => {
        setShowImage(false);  // Go back to the previous state (show content)
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <Text style={styles.header}>Vial Picture</Text>

            {/* Show image when `showImage` is true */}
            {showImage ? (
                <View style={styles.imagePreviewContainer}>
                    <Image source={selectedImage} style={styles.imagePreview} />
                    <TouchableOpacity onPress={handleBackPress}>
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity style={styles.noteEntry} onPress={handlePress}>
                    <View style={styles.iconContainer}>
                        <FontAwesome name="file-picture-o" size={34} color="black" />
                    </View>

                    <View style={styles.noteInfo}>
                        <Text style={styles.imageName}>{imageName}.jpeg</Text>
                        <Text style={styles.imageSize}>{imageSizeMB} MB</Text>
                    </View>

                    <TouchableOpacity style={styles.iconContainer} onPress={onDelete}>
                        <Icon name="delete" size={32} color="black" />
                    </TouchableOpacity>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingTop: 40, // Adjusts header spacing at the top
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'black',
    },
    noteEntry: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#B9D1D0',
        padding: 16,
        borderRadius: 8,
        marginTop: 20,
        width: '90%',
    },
    iconContainer: {
        marginRight: 15,
    },
    noteInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    imageName: {
        fontSize: 16,
        color: '#333',
    },
    imageSize: {
        fontSize: 14,
        color: '#777',
        marginTop: 4,
    },
    imagePreview: {
        width: 400,
        height: 500,
        resizeMode: 'contain',
        marginTop: 20,
    },
    imagePreviewContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    backText: {
        fontSize: 22,
        color: '#007bff',
        marginBottom: 20,
        marginTop:12
    },
});

export default VialPicture;
