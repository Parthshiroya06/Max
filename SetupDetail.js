import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert , Platform } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { Dimensions } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons'; // or another icon set
import { useUploadStatus } from './UploadStatusProvider';


const { width, height } = Dimensions.get('window');


const SetupDetail = () => {
  const [selectedHabitats, setSelectedHabitats] = useState([]);
  const [selectedSubstrates, setSelectedSubstrates] = useState([]);
  const [selectedWaterTypes, setSelectedWaterTypes] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [expandedBox, setExpandedBox] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState({ isVisible: false, field: '' });
  const [description, setDescription] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation();
  const habitats = ["Ankit", "Raj", "Ayush", "Anuj"];
  const substrates = ["India", "United State", "Germany", "Russia", "France"];
  const waterTypes = ["Patna", "Indore", "Delhi", "Pune", "Bhopal", "Mumbai", "Nagpur"];
  const { isUploaded, setIsUploaded, uploadedNotes, setUploadedNotes } = useUploadStatus(); // Use context


  const toggleHabitat = (habitat) => {
    if (selectedHabitats.includes(habitat)) {
      setSelectedHabitats(selectedHabitats.filter((item) => item !== habitat));
    } else {
      setSelectedHabitats([...selectedHabitats, habitat]);
    }
  };

  const toggleSubstrate = (substrate) => {
    if (selectedSubstrates.includes(substrate)) {
      setSelectedSubstrates([]); // Deselect if already selected
    } else {
      setSelectedSubstrates([substrate]); // Allow only one selection
    }
  };

  const toggleWater = (waterType) => {
    if (selectedWaterTypes.includes(waterType)) {
      setSelectedWaterTypes([]); // Deselect if already selected
    } else {
      setSelectedWaterTypes([waterType]); // Allow only one selection
    }
  };
  

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Generate Project ID
  const generateProjectId = () => {
    const countryCode = selectedSubstrates.length > 0 ? selectedSubstrates[0].substring(0, 3).toUpperCase() : '';
    const datePart = fromDate ? fromDate.toISOString().slice(8, 10) + fromDate.toISOString().slice(5, 7) + fromDate.toISOString().slice(2, 4) : '';
    const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${countryCode}${datePart}${randomPart}`;
  };


  const handleDateChange = (event, selectedDate) => {
    if (event.type === "set") { 
      if (showDatePicker.field === 'from') {
        setFromDate(selectedDate);
      } else if (showDatePicker.field === 'to') {
        setToDate(selectedDate);
      }
    }
    setShowDatePicker({ isVisible: false, field: '' });
  };

  const showDatePickerHandler = (field) => {
    setShowDatePicker({ isVisible: true, field });
  };

  const handleSubmit = async () => {

    if (selectedHabitats.length === 0 || selectedSubstrates.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one habitat and substrate.');
      return;
    }

    if (fromDate && toDate && fromDate > toDate) {
      Alert.alert('Date Error', 'From date cannot be later than To date.');
      return;
    }
 
    // Generate and set Project ID
    const generatedId = generateProjectId();
    setProjectId(generatedId);


    const newProject = {
      id: generatedId,
      projectName,
      habitats: selectedHabitats,
      substrates: selectedSubstrates,
      waterTypes: selectedWaterTypes,
      fromDate: fromDate ? fromDate.toISOString() : null,
      toDate: toDate ? toDate.toISOString() : null,
      description,
    };

    // Save the new project to AsyncStorage
    try {
      const storedProjects = await AsyncStorage.getItem('projects');
      const projects = storedProjects ? JSON.parse(storedProjects) : [];
      projects.push(newProject);
      await AsyncStorage.setItem('projects', JSON.stringify(projects));
      Alert.alert('Success', 'Project created successfully!');
      navigation.navigate('SetupScreen2', { newProject });
    } catch (error) {
      console.error('Error saving project to AsyncStorage:', error);
    }
  };
  

  // Function to toggle expand/collapse of the selected box
  const toggleExpand = (box) => {
    setExpandedBox(expandedBox === box ? null : box);  // Close if already open, open new box
  };

  // Function to check if all required fields are filled
  const isFormValid = () => {
    return (
      projectName &&
      selectedHabitats.length > 0 &&
      selectedSubstrates.length > 0 &&
      selectedWaterTypes.length > 0 &&
      fromDate &&
      toDate &&
      description
    );
  };
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('SetupScreen')} style={styles.backIconContainer}>
            <Text style={styles.backIcon}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Setup Project</Text>
        </View>




        <TextInput
          style={styles.input}
          placeholder="Project Name"
          placeholderTextColor="gray"
          value={projectName}
          onChangeText={(text) => setProjectName(text)}
        />

        <View style={styles.habitatContainer}>
  <View style={styles.habitatDescriptionBox}>
    <View style={styles.selectedHabitatsContainer}>
      <View style={styles.selectedHabitatsWrapper}>
        {selectedHabitats.length === 0 ? (
          <Text style={styles.placeholderText}>Select Team</Text>
        ) : (
          selectedHabitats.map((habitat, index) => (
            <Text key={index} style={styles.habitatTag}>{habitat}</Text>
          ))
        )}
        {selectedHabitats.length > 4 && !isExpanded && (
          <Text style={styles.additionalText}>+{selectedHabitats.length - 4}</Text>
        )}
      </View>
      <TouchableOpacity onPress={() => toggleExpand('habitats')}>
      <Icon name={expandedBox === 'habitats' ? "expand-less" : "expand-more"} size={29} color="black" />
      </TouchableOpacity>
    </View>
    {expandedBox === 'habitats' && (
              <View style={styles.habitatList}>
                {habitats.map((habitat, index) => (
                  <View key={index} style={styles.habitatCheckboxContainer}>
                    <CheckBox
                      value={selectedHabitats.includes(habitat)}
                      onValueChange={() => toggleHabitat(habitat)}
                      style={styles.checkbox}
                    />
                    <Text style={styles.habitatText}>{habitat}</Text>
                  </View>
        ))}
      </View>
    )}
  </View>
</View>


<Text style={styles.label}>Destination</Text>
<View style={styles.habitatContainer}>
  <View style={styles.habitatDescriptionBox}>
    <View style={styles.selectedHabitatsContainer}>
      <View style={styles.selectedHabitatsWrapper}>
        {selectedSubstrates.length === 0 ? (
          <Text style={styles.placeholderText}>Country</Text>
        ) : (
          selectedSubstrates.map((substrate, index) => (
            <Text key={index} style={styles.habitatTag}>{substrate}</Text>
          ))
        )}
        {selectedSubstrates.length > 4 && !isSubstrateExpanded && (
          <Text style={styles.additionalText}>+{selectedSubstrates.length - 4}</Text>
        )}
      </View>
      <TouchableOpacity onPress={() => toggleExpand('substrates')}>
      <Icon name={expandedBox === 'substrates' ? "expand-less" : "expand-more"} size={29} color="black" />
      </TouchableOpacity>
    </View>
    {expandedBox === 'substrates' && (
              <View style={styles.habitatList}>
                {substrates.map((substrates, index) => (
                  <View key={index} style={styles.habitatCheckboxContainer}>
                    <CheckBox
                      value={selectedSubstrates.includes(substrates)}
                      onValueChange={() => toggleSubstrate(substrates)}
                      style={styles.checkbox}
                    />
                    <Text style={styles.habitatText}>{substrates}</Text>
                  </View>
        ))}
      </View>
    )}
  </View>
</View>




<View style={styles.habitatContainer}>
  <View style={styles.habitatDescriptionBox}>
    <View style={styles.selectedHabitatsContainer}>
      <View style={styles.selectedHabitatsWrapper}>
        {selectedWaterTypes.length === 0 ? (
          <Text style={styles.placeholderText}>City</Text>
        ) : (
          selectedWaterTypes.map((waterType, index) => (
            <Text key={index} style={styles.habitatTag}>{waterType}</Text>
          ))
        )}
        {selectedWaterTypes.length > 4 && !isWaterExpanded && (
          <Text style={styles.additionalText}>+{selectedWaterTypes.length - 4}</Text>
        )}
      </View>
      <TouchableOpacity onPress={() => toggleExpand('waterTypes')}>
      <Icon name={expandedBox === 'WaterTypes' ? "expand-less" : "expand-more"} size={29} color="black" />
      </TouchableOpacity>
    </View>

  
         {expandedBox === 'waterTypes' && (
          <View style={styles.habitatList}>
            {waterTypes.map((waterTypes, index) => (
              <View key={index} style={styles.habitatCheckboxContainer}>
                <CheckBox
                  value={selectedWaterTypes.includes(waterTypes)}
                  onValueChange={() => toggleWater(waterTypes)}
                  style={styles.checkbox}
                />
                <Text style={styles.habitatText}>{waterTypes}</Text>
              </View>
        ))}
      </View>
    )}
    
  </View>
</View>
  

  {/* Select Start Date */}
  <Text style={styles.label}>Dates</Text>
  <TouchableOpacity onPress={() => showDatePickerHandler('from')}>
  <View style={styles.dateBoxContainer}>
          <TextInput
            style={styles.dateBox}
            placeholder="Select Start Date"
            placeholderTextColor="gray"
            value={fromDate ? fromDate.toLocaleDateString() : ''}
            editable={false}
          />
           <Icons name="calendar-today" size={20} color="gray" style={styles.calendarIcon} />
           </View>
        </TouchableOpacity>

        {/* Select End Date */}
        <TouchableOpacity onPress={() => showDatePickerHandler('to')}>
        <View style={styles.dateBoxContainer}>
        <TextInput
          style={styles.dateBox}
          placeholder="Select End Date"
          placeholderTextColor="gray"
          value={toDate ? toDate.toLocaleDateString() : ''}
          editable={false}
        />
         <Icons name="calendar-today" size={20} color="gray" style={styles.calendarIcon} />
      </View>
        </TouchableOpacity>

        {showDatePicker.isVisible && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="calendar"
            onChange={handleDateChange}
          />
        )}
 
 <Text style={styles.label}>Description</Text>
<TextInput
          style={styles.input2}
          value={description}
          onChangeText={(text) => setDescription(text)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline
          
        />

 {/* Conditionally render the Submit Button */}
 {isFormValid() && (
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
          >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity> 
        )}
        
      </ScrollView>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ACCAC8',
    
  },
  scrollViewContent: {
    padding: 20,
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  backIconContainer: {
    position: 'absolute',
    left: 0,
    marginLeft: 9,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'Playfair Display',
  },
  backIcon: {
    fontSize: 45,
    fontWeight: 'bold',
    color: 'black',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 28,
    color: '#000000',
    marginLeft: 5,
    fontFamily: 'Playfair Display',
  },
  habitatContainer: {
    marginTop: 20,
    
  },
  input: {
    height: 72,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    padding: 25,
    marginTop: 15,
    color:'black',
    backgroundColor: '#FFF',
    fontSize:16
  },
  input2: {
    height: 200,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    fontSize:18,
    padding: 17,
    marginTop: 15,
    backgroundColor: '#FFF',
    textAlignVertical: 'top',
    
  },
  observationsInput: {
    height: 125,
    textAlignVertical: 'top',
    marginTop:2
  },
  habitatDescriptionBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 21,
    marginBottom: 5,
    borderColor: '#000000',
    borderWidth: 1,
  },
  selectedHabitatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedHabitatsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  habitatTag: {
    backgroundColor: 'black',
    color: '#FFF',
    padding: 9,
    borderRadius: 12,
    margin: 2,
    fontSize: 12,
  },
  additionalText: {
    fontSize: 12,
    color: '#808080',
  },
  habitatList: {
    marginTop: 10,
  },
  habitatCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    marginRight: 10,
  },
  habitatText: {
    fontSize: 16,
    color:"black"
  },
  measurementContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  measurementBox: {
    padding: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    borderColor: '#000000',
    paddingHorizontal:40,
    backgroundColor: '#fff', // Ensures contrast with placeholder text
    color: '#000', // Ensures date text is visible
  },
  placeholderText: {
    fontSize: 16,
    color: 'gray',
    margin: 2,
  },
  button: {
    width: 328,
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    marginTop:35,
    backgroundColor: '#48938F',
    marginLeft:15
  },
  buttonText: {
    color: 'black',
    fontSize: 21,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 2,
    fontWeight: 'bold',
    marginLeft: 5,
    marginTop: 17,
  },
  dateBox: {
    height: 74,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    padding: 28,
    marginTop: 15,
    color: 'black',
    backgroundColor: '#FFF',
    fontSize:16
  },
  dateBoxWrapper: {
    position: 'relative', 
  },
  calendarIcon: {
    position: 'absolute', 
    right: 20, 
    top: '50%', 
    transform: [{ translateY: -10 }], 
    fontSize:33,
    color:"black"

  },
});

export default SetupDetail;
