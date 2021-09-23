const jsonFileOutput = require("./src/tokens/config/json");
const sassFileOutput = require("./src/tokens/config/sass");

module.exports = {
  "source": [
    "src/tokens/**/*.json"
  ],
  "platforms": {
    "src/sass/core": {
      transformGroup: 'scss',
      buildPath: 'src/sass/core/',
      files: [
        {
          destination: 'variables-combined.scss',
          format: 'scss/map-deep'
        }
      ]
    },
    "tokens/sass": {
      transformGroup: 'scss',
      buildPath: 'tokens/sass/',
      files: sassFileOutput
    },
    "tokens/json": {
      transforms: ['attribute/cti', 'name/cti/kebab'],
      buildPath: 'tokens/json/',
      files: jsonFileOutput
    },
    "tokens/css": {
      buildPath: 'tokens/css/',
      files: [{
        destination: 'variables.css',
        format: 'css/variables'
      }],
      transforms: ['name/cti/kebab']
    }
  }
}