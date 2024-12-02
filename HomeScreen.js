import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  PixelRatio,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Svg, Circle} from 'react-native-svg';

// DonutChart component renders a circular chart showing progress of different statuses
const DonutChart = () => {
  const size = 115; 
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const uploadedProgress = 0.74; 
  const pendingProgress = 0.14; 
  const notStartedProgress = 0.12; 


  return (
    <Svg width={size} height={size}>
      
      {/* Background Circle - for the base layer */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#E0E0E0"
        strokeWidth={strokeWidth}
        fill="none"
      />
      
      {/* Uploaded Segment - colored to represent uploaded progress */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#48938F"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${
          uploadedProgress * circumference
        }, ${circumference}`}
        strokeDashoffset={0}
        rotation={-90}
        origin={`${size / 2}, ${size / 2}`}
      />
      
      {/* Pending Segment - colored to represent pending progress */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#ACCAC8"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${pendingProgress * circumference}, ${circumference}`}
        strokeDashoffset={-uploadedProgress * circumference}
        rotation={-90}
        origin={`${size / 2}, ${size / 2}`}
      />
      
      {/* Not Started Segment - colored to represent not started progress */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#EEEEEE"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${
          notStartedProgress * circumference
        }, ${circumference}`}
        strokeDashoffset={-(uploadedProgress + pendingProgress) * circumference}
        rotation={-90}
        origin={`${size / 2}, ${size / 2}`}
      />
    </Svg>
  );
};

const HomeScreen = ({navigation}) => {
  const [liveProjects, setLiveProjects] = useState([]); // State for live projects
  const [upcomingProjects, setUpcomingProjects] = useState([]); // State for upcoming projects
  
  // useEffect fetches project data and filters it into live and upcoming projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await AsyncStorage.getItem('projects'); // Replace 'projects' with your AsyncStorage key
        const projects = data ? JSON.parse(data) : [];

        const currentDate = new Date();

        // Filter projects that are currently live
        const live = projects.filter(
          project => new Date(project.fromDate) <= currentDate,
        );

         // Filter projects that are yet to start
        const upcoming = projects.filter(
          project => new Date(project.fromDate) > currentDate,
        );

        setLiveProjects(live);  // Update live projects state
        setUpcomingProjects(upcoming);  // Update upcoming projects state
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);
 
  // Renders individual project items
  const renderProject = ({item}) => (
    <TouchableOpacity
      style={styles.projectItem}
      onPress={() =>
        navigation.navigate('ProjectDetails', {projectId: item.id})
      }>

        {/* Displays project details */}
      <View style={styles.projectDetails}>
        <Text style={styles.projectID}>{item.id}</Text>
        <Text style={styles.CityCountry}>
          {item.waterTypes.join(', ') || 'No water types'} ,{' '}
          {item.country || 'No country'}
        </Text>
        <Text style={styles.Date}>
          {item.fromDate && item.toDate
            ? `${new Date(item.fromDate).toLocaleDateString()} - ${new Date(
                item.toDate,
              ).toLocaleDateString()}`
            : 'No date range'}
        </Text>
      </View>

      {/* Displays project status icon */}
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
    <ScrollView style={styles.container}>

      {/* Header Section */}
      <View style={styles.header}>
        <Image source={{uri: 'logo5'}} style={styles.logo} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.instituteName}>Max Planck Institute</Text>
          <Text style={styles.instituteDesc}>
            For multidisciplinary Sciences
          </Text>
        </View>
      </View>

      {/* Total Projects Section */}
      <View style={styles.totalProjects}>
        <Text style={styles.totalTitle}>Total Projects</Text>
        <View style={styles.projectContent}>
          <View style={styles.donutChart}>
            <DonutChart />
            <Text style={styles.totalCount}>43</Text>
          </View>

           {/* Status Legends */}
          <View style={styles.statusLegend}>
            <View style={styles.statusRow}>
              <View
                style={[styles.statusColorBox, {backgroundColor: '#48938F'}]}
              />
              <Text style={styles.statusText}>
                <Text style={{fontWeight: 'bold', fontSize: 15}}>32</Text>{' '}
                Uploaded
              </Text>
            </View>

            <View style={styles.statusRow}>
              <View
                style={[styles.statusColorBox, {backgroundColor: '#ACCAC8'}]}
              />
              <Text style={styles.statusText}>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>6</Text>{' '}
                Pending
              </Text>
            </View>

            <View style={styles.statusRow}>
              <View
                style={[styles.statusColorBox, {backgroundColor: '#EEEEEE'}]}
              />
              <Text style={styles.statusText}>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>5</Text> Total
                uploaded
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Live Projects Section */}
      <Text style={styles.sectionTitle}>Live Projects</Text>
      <FlatList
        data={liveProjects}
        renderItem={renderProject}
        keyExtractor={item => item.id}
        style={styles.projectList}
      />

      {/* Upcoming Projects Section */}
      <Text style={styles.sectionTitle}>Upcoming Projects</Text>
      <FlatList
        data={upcomingProjects}
        renderItem={renderProject}
        keyExtractor={item => item.id}
        style={styles.projectList}
      />
    </ScrollView>
  );
};

const {width, height} = Dimensions.get('window');

// Helper function to scale font size based on device pixel ratio
const scaleFont = size => size * PixelRatio.getFontScale();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: width * 0.04, 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.07, 
    marginTop: height * 0.02,
  },
  logo: {
    width: width * 0.12, 
    height: width * 0.12, 
    marginRight: width * 0.06,
    marginLeft: width * 0.03,
  },
  instituteName: {
    fontSize: scaleFont(22),
    fontWeight: 'bold',
    color: '#333',
  },
  headerTextContainer: {
    flex: 1,
  },
  instituteDesc: {
    fontSize: scaleFont(14),
    color: 'black',
  },
  totalProjects: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: width * 0.05,
    marginBottom: height * 0.02,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'black',
    height: height * 0.25,
    marginHorizontal: width * 0.02,
    marginLeft: width * 0.04,
  },
  totalTitle: {
    fontSize: scaleFont(20),
    fontWeight: 'bold',
    marginBottom: height * 0.01,
    color: 'black',
    marginLeft: width * 0.02,
  },
  projectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: width * 0.02,
  },
  donutChart: {
    position: 'relative',
    width: width * 0.3,
    height: width * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.05,
    marginTop: height * 0.01,
  },
  totalCount: {
    position: 'absolute',
    fontSize: scaleFont(24),
    fontWeight: 'bold',
    color: 'black',
  },
  statusLegend: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01,
    marginLeft: width * 0.06,
    marginTop: height * 0.017,
  },
  statusColorBox: {
    width: width * 0.05,
    height: width * 0.03,
    marginRight: width * 0.02,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  statusText: {
    fontSize: 15,
    color: 'black',
  },
  sectionTitle: {
    fontSize: scaleFont(20),
    fontWeight: 'bold',
    marginBottom: height * 0.026,
    color: 'black',
    marginLeft: width * 0.04,
    marginTop: height * 0.012,
  },
  projectList: {
    marginBottom: 8,
    marginLeft: width * 0.04,
    marginRight: width * 0.036,
  },
  projectItem: {
    flexDirection: 'row',
    padding: width * 0.06,
    alignItems: 'center',
    backgroundColor: '#ACCAC8',
    borderRadius: 10,
    marginBottom: height * 0.015,
    height: height * 0.15, 
  },
  projectDetails: {
    flex: 1,
  },
  projectID: {
    fontSize: scaleFont(16),
    color: 'black',
    marginBottom: height * 0.008,
  },
  CityCountry: {
    fontSize: scaleFont(16),
    color: 'black',
    fontWeight: 'bold',
    marginBottom: height * 0.008,
  },
  Date: {
    fontSize: scaleFont(16),
    color: 'black',
  },
  statusIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * -0.06,
  },
});

export default HomeScreen;
