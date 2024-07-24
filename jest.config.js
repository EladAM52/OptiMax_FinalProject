module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  moduleFileExtensions: ["js", "jsx"],
  transformIgnorePatterns: [
    "/node_modules/(?!@sendgrid/.*|axios/.*)" // Add other ES modules using dependencies here
  ],
  moduleNameMapper: {
    axios: 'axios/dist/node/axios.cjs',
},
};
