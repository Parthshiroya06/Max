const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer')
  },
  resolver: {
    // Exclude 'svg' from assetExts so it's handled by react-native-svg-transformer
    assetExts: getDefaultConfig(__dirname).resolver.assetExts.filter(ext => ext !== 'svg'),
    // Add 'svg' to sourceExts so it can be imported as a component
    sourceExts: [...getDefaultConfig(__dirname).resolver.sourceExts, 'svg']
  }
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
