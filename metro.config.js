const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];
config.resolver.assetExts = [...config.resolver.assetExts, 'db'];

module.exports = withNativeWind(config, { input: './global.css' });
