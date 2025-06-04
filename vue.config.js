module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/badge-system" : "/",
  devServer: {
    proxy: "https://192.168.10.230",
  },
};
