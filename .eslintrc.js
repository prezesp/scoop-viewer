module.exports = {
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true,
            "modules": true,
            "experimentalObjectRestSpread": true
        }
    },
    "plugins": [
        "react"
    ],
    "extends": ["eslint:recommended", "plugin:react/recommended"],
    "rules": {
        "indent": ["error", 4],
        "semi": [2, "always"],
        "quotes": [2, "single"],
        "space-before-function-paren": ["error", "never"],
    },
    "settings": {
        "react": {
            "pragma": "React",
            "version": "15.4.2"
        }
    },
    "env": {
        "browser": true,
        "node": true
    }
};