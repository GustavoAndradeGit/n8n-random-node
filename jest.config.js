module.exports = {
preset: 'ts-jest',
testEnvironment: 'node',
testMatch: [
  '**/tests/**/*.test.ts',
  '**/tests/**/*.spec.ts'
],
moduleFileExtensions: ['ts', 'js'],
transform: {
  '^.+\\.ts$': 'ts-jest'
},
collectCoverageFrom: [
  'nodes/**/*.ts',
  '!nodes/**/*.d.ts'
]
};
