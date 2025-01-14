import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getAllDeliveries, createDelivery, updateDelivery } from "../models/deliveries_model.js";
import createError from "http-errors";

// Função para listar entregas com status e data sem formatação extra
export async function listDeliveries(req, res) {
  try {
    const deliveries = await getAllDeliveries(); // Obtém todas as entregas do banco de dados

    // Retorna a resposta com o status e os dados diretamente
    res.status(200).json({
      status: 200,
      data: deliveries,
    });
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({
      status: 500,
      error: "Erro ao listar entregas",
    });
  }
}

// Função para criar uma nova entrega
export async function postNewDelivery(req, res) {
  const newDelivery = req.body;
  try {
    const createdDelivery = await createDelivery(newDelivery);
    res.status(200).json(createdDelivery);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ Error: "Falha na requisição" });
  }
}

// Calcula o diretório onde o arquivo atual está localizado
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para upload de imagem no VPS
export const uploadProductImage = async (req, res, next) => {
  const file = req.file;

  try {
    if (!file) {
      throw new Error("Nenhum arquivo enviado.");
    }

    // Define o diretório na raiz do projeto para armazenar as imagens
    const uploadDir = path.join(__dirname, "../../uploads");

    // Verifica se o diretório 'uploads' existe, se não, cria
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Define o caminho onde a imagem será salva
    const filePath = path.join(uploadDir, file.filename);

    // Move o arquivo para o diretório uploads
    fs.renameSync(file.path, filePath);

    // Retorna a URL pública do arquivo com o nome aleatório
    const imageUrl = `http://mikaeldavid.online/api/uploads/${file.filename}`;
    res.status(200).json({ url: imageUrl });
  } catch (error) {
    console.error("Erro ao salvar a imagem:", error);
    return next(createError(502, error.message));
  }
};

// Função para atualizar uma entrega
export async function updateNewDelivery(req, res) {
  const id = req.params.id;
  const filePath = path.join(__dirname, `../../uploads/${id}.png`);

  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("Arquivo não encontrado.");
    }

    const imageBuffer = fs.readFileSync(filePath);
    const destName = await extractedGeminiName(imageBuffer);

    const delivery = {
      destination: destName,
      trackingCode: "",
      creationDate: "",
      imgUrl: `http://mikaeldavid.online/uploads/${id}.png`,
      alt: "",
    };

    const updatedDelivery = await updateDelivery(id, delivery);
    res.status(200).json(updatedDelivery);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ Error: "Falha na Requisição" });
  }
};
