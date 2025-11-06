module.exports = {
  devServer: (devServerConfig) => {
    // Ensure dev server accepts all hosts to avoid empty allowedHosts entries
    devServerConfig.allowedHosts = 'all';
    return devServerConfig;
  },
};