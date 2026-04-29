module.exports = {
  rootDir: '.',
  testEnvironment: 'node',
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/tests/e2e/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  collectCoverageFrom: [
    'lib/validations/authValidation.ts',
    'lib/validations/requestValidation.ts',
    'services/auth/authService.ts',
    'app/api/auth/uloge/route.ts',
    'app/api/admin/users/route.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 98,
      lines: 98,
      statements: 98,
    },
  },
};
