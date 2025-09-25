import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Random } from '../nodes/Random/Random.node';
import { 
IExecuteFunctions, 
INodeExecutionData,
NodeOperationError 
} from 'n8n-workflow';

const createMockExecuteFunctions = (
inputData: INodeExecutionData[] = [{ json: {} }],
parameters: Record<string, any> = {}
): IExecuteFunctions => {
const defaultParams: Record<string, any> = {
  operation: 'generateRandomNumber',
  min: 1,
  max: 100
};

return {
  getInputData: jest.fn(() => inputData),
  getNodeParameter: jest.fn((name: string, index: number) => {
    return parameters[name] ?? defaultParams[name];
  }),
  getNode: jest.fn(() => ({ name: 'Random Test Node' })),
  helpers: {
    httpRequest: jest.fn() as jest.MockedFunction<any>
  },
  continueOnFail: jest.fn(() => false)
} as any;
};

describe('Random Node', () => {
let randomNode: Random;

beforeEach(() => {
  randomNode = new Random();
  jest.clearAllMocks();
});

describe('Node Description', () => {
  it('should have correct basic properties', () => {
    const { description } = randomNode;
    
    expect(description.displayName).toBe('Random');
    expect(description.name).toBe('random');
    expect(description.version).toBe(1);
    expect(description.group).toContain('transform');
  });

  it('should have correct input/output configuration', () => {
    const { description } = randomNode;
    
    expect(description.inputs).toEqual(['main']);
    expect(description.outputs).toEqual(['main']);
  });

  it('should have required properties defined', () => {
    const { description } = randomNode;
    
    expect(description.properties).toBeDefined();
    expect(description.properties.length).toBeGreaterThan(0);
    
    // Verificar se tem os campos essenciais
    const propertyNames = description.properties.map((p: any) => p.name);
    expect(propertyNames).toContain('operation');
    expect(propertyNames).toContain('min');
    expect(propertyNames).toContain('max');
  });
});

describe('Parameter Validation', () => {
  it('should validate min/max parameters correctly', () => {
    const { description } = randomNode;
    const minProperty = description.properties.find((p: any) => p.name === 'min');
    const maxProperty = description.properties.find((p: any) => p.name === 'max');
    
    expect(minProperty).toBeDefined();
    expect(maxProperty).toBeDefined();
    expect(minProperty?.required).toBe(true);
    expect(maxProperty?.required).toBe(true);
  });
});

describe('Execute Method', () => {
  it('should execute successfully with valid parameters', async () => {
    const mockContext = createMockExecuteFunctions(
      [{ json: { testData: 'test' } }],
      { min: 1, max: 100 }
    );

    // Mock da resposta da API Random.org
    (mockContext.helpers.httpRequest as any).mockResolvedValue('42');

    const result = await randomNode.execute.call(mockContext);

    expect(result).toBeDefined();
    expect(result[0]).toBeDefined();
    expect(result[0][0]).toBeDefined();
    expect(result[0][0].json).toMatchObject({
      randomNumber: 42,
      min: 1,
      max: 100,
      source: 'random.org',
      testData: 'test' // Dados preservados da entrada
    });
  });

  it('should throw error when min > max', async () => {
    const mockContext = createMockExecuteFunctions(
      [{ json: {} }],
      { min: 100, max: 1 }
    );

    await expect(randomNode.execute.call(mockContext))
      .rejects
      .toThrow(NodeOperationError);
  });

  it('should handle API response correctly', async () => {
    const mockContext = createMockExecuteFunctions(
      [{ json: {} }],
      { min: 1, max: 6 }
    );

    // Mock diferentes tipos de resposta
    (mockContext.helpers.httpRequest as any).mockResolvedValue('  3  \n');

    const result = await randomNode.execute.call(mockContext);

    expect(result[0][0].json.randomNumber).toBe(3);
  });

  it('should handle invalid API response', async () => {
    const mockContext = createMockExecuteFunctions();

    // Mock resposta inválida
    (mockContext.helpers.httpRequest as any).mockResolvedValue('invalid');

    await expect(randomNode.execute.call(mockContext))
      .rejects
      .toThrow(NodeOperationError);
  });

  it('should handle network errors', async () => {
    const mockContext = createMockExecuteFunctions();

    // Mock erro de rede
    (mockContext.helpers.httpRequest as any).mockRejectedValue(
      new Error('Network error')
    );

    await expect(randomNode.execute.call(mockContext))
      .rejects
      .toThrow('Network error');
  });

  it('should continue on fail when configured', async () => {
    const mockContext = createMockExecuteFunctions(
      [{ json: { id: 1 } }],
      { min: 100, max: 1 } // Parâmetros inválidos
    );

    // Configurar para continuar em caso de erro
    (mockContext.continueOnFail as any).mockReturnValue(true);

    const result = await randomNode.execute.call(mockContext);

    expect(result[0][0].json).toMatchObject({
      error: expect.stringContaining('não pode ser maior'),
      id: 1 // Dados preservados
    });
  });

  it('should process multiple input items', async () => {
    const mockContext = createMockExecuteFunctions([
      { json: { batch: 1 } },
      { json: { batch: 2 } }
    ]);

    // Mock respostas diferentes para cada item
    (mockContext.helpers.httpRequest as any)
      .mockResolvedValueOnce('10')
      .mockResolvedValueOnce('20');

    const result = await randomNode.execute.call(mockContext);

    expect(result[0]).toHaveLength(2);
    expect(result[0][0].json.randomNumber).toBe(10);
    expect(result[0][1].json.randomNumber).toBe(20);
    expect(result[0][0].json.batch).toBe(1);
    expect(result[0][1].json.batch).toBe(2);
  });
});

describe('Random.org API Integration', () => {
  it('should construct correct API URL', async () => {
    const mockContext = createMockExecuteFunctions(
      [{ json: {} }],
      { min: 5, max: 15 }
    );

    (mockContext.helpers.httpRequest as any).mockResolvedValue('10');

    await randomNode.execute.call(mockContext);

    expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://www.random.org/integers/?num=1&min=5&max=15&col=1&base=10&format=plain&rnd=new',
      timeout: 10000,
      headers: {
        'User-Agent': 'n8n-random-node/1.0.0'
      }
    });
  });

  it('should handle different number ranges', async () => {
    const testCases = [
      { min: -10, max: 10, expected: 0 },
      { min: 1000, max: 9999, expected: 5000 },
      { min: 1, max: 1, expected: 1 }
    ];

    for (const testCase of testCases) {
      const mockContext = createMockExecuteFunctions(
        [{ json: {} }],
        { min: testCase.min, max: testCase.max }
      );

      (mockContext.helpers.httpRequest as any).mockResolvedValue(
        testCase.expected.toString()
      );

      const result = await randomNode.execute.call(mockContext);

      expect(result[0][0].json.randomNumber).toBe(testCase.expected);
      expect(result[0][0].json.min).toBe(testCase.min);
      expect(result[0][0].json.max).toBe(testCase.max);
    }
  });
});

describe('Data Structure', () => {
  it('should return correct data structure', async () => {
    const mockContext = createMockExecuteFunctions();
    (mockContext.helpers.httpRequest as any).mockResolvedValue('42');

    const result = await randomNode.execute.call(mockContext);
    const output = result[0][0];

    // Verificar estrutura de dados
    expect(output).toHaveProperty('json');
    expect(output).toHaveProperty('pairedItem');
    expect(output.pairedItem).toEqual({ item: 0 });

    // Verificar campos obrigatórios
    const requiredFields = ['randomNumber', 'min', 'max', 'source', 'timestamp'];
    requiredFields.forEach(field => {
      expect(output.json).toHaveProperty(field);
    });

    // Verificar tipos
    expect(typeof output.json.randomNumber).toBe('number');
    expect(typeof output.json.min).toBe('number');
    expect(typeof output.json.max).toBe('number');
    expect(typeof output.json.source).toBe('string');
    expect(typeof output.json.timestamp).toBe('string');
    expect(output.json.source).toBe('random.org');
  });
});
});
