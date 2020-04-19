module.exports = {
    extends: 'eslint:recommended',
    env: {
        es6: true,
        jest: true
    },
    globals: {
        'ts-jest': {
            diagnostics: false
        }
    },
    overrides: [
        Object.assign(
            {
                files: ['**/*.test.js'],
                env: {jest: true},
                plugins: ['jest'],
            },
            require('eslint-plugin-jest').configs.recommended
        )
    ]

};