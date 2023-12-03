// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
// NB : on le remplace avec celui qui nous permet d'utiliser le natiwind : const config = getDefaultConfig(__dirname, { isCSSEnabled: true })
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// celui qui nous permet d'utiliser le natiwind
// const config = getDefaultConfig(__dirname, { isCSSEnabled: true });

// NB : on le remplace avec celui qui nous permet d'utiliser le natiwind : module.exports = withNativeWind(config, { input: './your-css-file.css' })
module.exports = config;

// celui qui nous permet d'utiliser le natiwind
// module.exports = withNativeWind(config, { input: "./global.css" });
