
const { withAndroidManifest } = require('@expo/config-plugins');

const withCleartextTraffic = (config) => {
  return withAndroidManifest(config, (config) => {
    const application =
      config.modResults.manifest.application?.[0];

    if (!application) {
      throw new Error('Android application element not found');
    }

    application.$ = application.$ || {};

    application.$['android:usesCleartextTraffic'] = 'true';

    return config;
  });
};

module.exports = withCleartextTraffic;
