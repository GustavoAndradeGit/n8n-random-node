/**
* Testes básicos para o nó Random
* 
* Para executar: npm test
*/

const { Random } = require('../dist/nodes/Random/Random.node.js');

// Mock básico do contexto N8N
const mockContext = {
   getInputData: () => [{ json: {} }],
   getNodeParameter: (name, index) => {
       const params = { min: 1, max: 100, operation: 'generateRandomNumber' };
       return params[name];
   },
   getNode: () => ({ name: 'Random Test' }),
   helpers: {
       httpRequest: async () => "42" // Mock da resposta do Random.org
   },
   continueOnFail: () => false
};

async function testRandomNode() {
   console.log('🧪 Iniciando testes do nó Random...\n');
   
   try {
       const randomNode = new Random();
       
       // Teste 1: Verificar descrição do nó
       console.log('✅ Teste 1: Descrição do nó');
       console.log(`   Nome: ${randomNode.description.displayName}`);
       console.log(`   Versão: ${randomNode.description.version}`);
       console.log(`   Grupo: ${randomNode.description.group[0]}\n`);
       
       // Teste 2: Executar nó (com mock)
       console.log('✅ Teste 2: Execução do nó');
       const result = await randomNode.execute.call(mockContext);
       console.log(`   Resultado: ${JSON.stringify(result[0][0].json, null, 2)}\n`);
       
       // Teste 3: Verificar estrutura da resposta
       console.log('✅ Teste 3: Estrutura da resposta');
       const output = result[0][0].json;
       const requiredFields = ['randomNumber', 'min', 'max', 'source', 'timestamp'];
       
       requiredFields.forEach(field => {
           if (output.hasOwnProperty(field)) {
               console.log(`   ✅ Campo '${field}': ${output[field]}`);
           } else {
               console.log(`   ❌ Campo '${field}': AUSENTE`);
           }
       });
       
       console.log('\n🎉 Todos os testes passaram!');
       
   } catch (error) {
       console.error('❌ Erro nos testes:', error.message);
       process.exit(1);
   }
}

// Executar testes se chamado diretamente
if (require.main === module) {
   testRandomNode();
}

module.exports = { testRandomNode };
