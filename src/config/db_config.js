import { MongoClient } from "mongodb"; // Importa o cliente do MongoDB para conexão ao banco de dados.

// Função para conectar ao banco de dados.
export default async function ConnectToDatabase(connectionString) {
  let mongoClient; // Variável para armazenar a instância do cliente do MongoDB.

  try {
    // Inicializa o cliente do MongoDB com a string de conexão fornecida.
    mongoClient = new MongoClient(connectionString);

    console.log("Conectando ao cluster do banco de dados..."); // Log informativo sobre o início da conexão.

    await mongoClient.connect(); // Estabelece a conexão com o MongoDB.

    console.log("Conectado ao MongoDB Atlas com sucesso!"); // Log informativo em caso de sucesso.

    return mongoClient; // Retorna o cliente conectado.
  } catch (erro) {
    // Captura e trata qualquer erro que ocorra durante a conexão.
    console.error("Falha na conexão com o banco!", erro); // Log do erro.
    process.exit(); // Encerra o processo em caso de falha crítica.
  }
}
