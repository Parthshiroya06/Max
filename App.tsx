import React from 'react';

import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationScreen from './NavigationScreen/NavigationScrren';
import { UploadStatusProvider } from './ContextAPI/UploadStatusProvider';

Icon.loadFont();  // Load fonts when app starts

const App = () => {
  
  return (

    <UploadStatusProvider>
    <NavigationScreen />
</UploadStatusProvider>

    
  
    
  );
};

export default App;
