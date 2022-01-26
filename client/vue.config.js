module.exports = {
  devServer: {
    host: "0.0.0.0",
    port: "8002", //name of port
    public: "0.0.0.0:8002",
    disableHostCheck: true,
    noInfo: true,
  },
  "transpileDependencies": [
    "vuetify"
  ]
}