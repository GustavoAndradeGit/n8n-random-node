// Setup global para testes
import { jest } from '@jest/globals';

// Configurações globais de timeout
jest.setTimeout(30000);

// Mock console para testes mais limpos
global.console = {
...console,
log: jest.fn(),
debug: jest.fn(),
info: jest.fn(),
warn: jest.fn(),
error: jest.fn(),
};
