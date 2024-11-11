import React from 'react';

import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationScreen from './NavigationScrren';
import { UploadStatusProvider } from './UploadStatusProvider';
//import { UploadStatusProvider } from './path-to-context/UploadStatusContext';

Icon.loadFont();  // Load fonts when app starts

const App = () => {
  
  return (

    <UploadStatusProvider>
    <NavigationScreen />
</UploadStatusProvider>

    
  
    
  );
};

export default App;
