module.exports = {
  "globals": {
    "describe": true,
    "it": true,
    "React": false,
    "beforeEach": true
  },
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
    "sourceType": "module"
  },
  "plugins": [
    "flowtype",
    "react",
    "mocha"
  ],
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single",
      { "avoidEscape": true },
    ],
    "semi": [
      "error",
      "never"
    ],
    "no-unused-vars": [
      "error",
      { "varsIgnorePattern": "_" },
    ]
  }
};
