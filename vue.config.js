module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/hr" : "/",
  devServer: {
    proxy: "http://localhost:8081",
  },
};
