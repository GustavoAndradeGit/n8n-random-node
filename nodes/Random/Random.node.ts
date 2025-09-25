import {
IExecuteFunctions,
INodeExecutionData,
INodeType,
INodeTypeDescription,
NodeOperationError,
} from 'n8n-workflow';

export class Random implements INodeType {
description: INodeTypeDescription = {
    displayName: 'Random',
    name: 'random',
    icon: 'file:random.svg',
    group: ['transform'],
    version: 1,
    description: 'Gera números aleatórios usando Random.org',
    defaults: {
        name: 'Random',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
        {
            displayName: 'Operation',
            name: 'operation',
            type: 'options',
            options: [
                {
                    name: 'True Random Number Generator',
                    value: 'generateRandomNumber',
                    description: 'Gerar número verdadeiramente aleatório',
                },
            ],
            default: 'generateRandomNumber',
        },
        {
            displayName: 'Valor Mínimo',
            name: 'min',
            type: 'number',
            required: true,
            default: 1,
            description: 'Valor mínimo para o número aleatório',
            displayOptions: {
                show: {
                    operation: ['generateRandomNumber'],
                },
            },
        },
        {
            displayName: 'Valor Máximo',
            name: 'max',
            type: 'number',
            required: true,
            default: 100,
            description: 'Valor máximo para o número aleatório',
            displayOptions: {
                show: {
                    operation: ['generateRandomNumber'],
                },
            },
        },
    ],
};

async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
        try {
            const min = this.getNodeParameter('min', i) as number;
            const max = this.getNodeParameter('max', i) as number;

            if (min > max) {
                throw new NodeOperationError(
                    this.getNode(),
                    `Valor mínimo (${min}) não pode ser maior que o máximo (${max})`,
                    { itemIndex: i }
                );
            }

            // Construir URL da API Random.org
            const url = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;

            // Fazer requisição
            const response = await this.helpers.httpRequest({
                method: 'GET',
                url: url,
                timeout: 10000,
                headers: {
                    'User-Agent': 'n8n-random-node/1.0.0',
                },
            });

            // Converter resposta para string, independente do tipo
            let responseText: string;
            if (typeof response === 'string') {
                responseText = response;
            } else if (typeof response === 'object' && response !== null) {
                responseText = JSON.stringify(response);
            } else {
                responseText = String(response);
            }

            // Extrair apenas números da resposta
            const numberMatch = responseText.match(/\d+/);
            if (!numberMatch) {
                throw new NodeOperationError(
                    this.getNode(),
                    `Não foi possível extrair número da resposta: ${responseText}`,
                    { itemIndex: i }
                );
            }

            const randomNumber = parseInt(numberMatch[0], 10);

            if (isNaN(randomNumber)) {
                throw new NodeOperationError(
                    this.getNode(),
                    `Número inválido extraído: ${numberMatch[0]}`,
                    { itemIndex: i }
                );
            }

            returnData.push({
                json: {
                    randomNumber,
                    min,
                    max,
                    source: 'random.org',
                    timestamp: new Date().toISOString(),
                    ...items[i].json,
                },
                pairedItem: {
                    item: i,
                },
            });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            
            if (this.continueOnFail()) {
                returnData.push({
                    json: {
                        error: errorMessage,
                        ...items[i].json,
                    },
                    pairedItem: {
                        item: i,
                    },
                });
                continue;
            }
            throw error;
        }
    }

    return [returnData];
}
}
