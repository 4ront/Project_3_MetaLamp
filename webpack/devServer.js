module.exports = () => {
  return {
    static: ["./dist"],
    compress: true,
    client: {
      logging: "info"
    },
    port: 4327,
    open: ["/start.html"],
    hot: true
  };
};
