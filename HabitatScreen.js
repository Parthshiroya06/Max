import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const HabitatPicture = ({ route }) => {
    const { selectedImages, imageNames, imageSizeMBs, onDelete  } = route.params; // Assuming selectedImages is an array
    const [showImages, setShowImages] = useState(false); // State to toggle visibility
    const [currentImage, setCurrentImage] = useState(null); // State for selected image to view in full size
    const [images, setImages] = useState(selectedImages); // State to manage images dynamically

    const handlePress = (image) => {
        setCurrentImage(image); // Set the image to display in full size
        setShowImages(true); // Show image preview
    };

    const handleBackPress = () => {
        setShowImages(false); // Go back to the previous state (show content)
        setCurrentImage(null); // Reset current image
    };

    const handleDelete = (index) => {
        // Delete the image at the specified index
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages); // Update the state to reflect the deleted image
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <Text style={styles.header}>Habitat Picture</Text>

            {/* Show image when `showImage` is true */}
            {showImages ? (
                <View style={styles.imagePreviewContainer}>
                    <Image source={currentImage} style={styles.imagePreview} />
                    <TouchableOpacity onPress={handleBackPress}>
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.imageListContainer}>
                    {images.map((image, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.noteEntry}
                            onPress={() => handlePress(image)}
                        >
                            <View style={styles.iconContainer}>
                                <FontAwesome name="file-picture-o" size={34} color="black" />
                            </View>

                            <View style={styles.noteInfo}>
                                <Text style={styles.imageName}>{imageNames[index] || 'Unnamed'}.jpeg</Text>
                                <Text style={styles.imageSize}>{imageSizeMBs[index] || '0'} MB</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.iconContainer}
                                onPress={() => handleDelete(index)}
                            >
                                <Icon name="delete" size={32} color="black" marginRight={-10}/>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </View>
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
    imageListContainer: {
        width: '100%',
        paddingHorizontal: 10,
        marginTop: 20,
    },
    noteEntry: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#B9D1D0',
        padding: 16,
        borderRadius: 8,
        marginBottom: 10, // Space between each image entry
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
        color: 'black',
        marginBottom: 20,
        marginTop: 12,
        fontWeight:'bold'
    },
});

export default HabitatPicture;
