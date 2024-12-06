import fs from "fs";
import path from "path";
import { getAllDeliveries, createDelivery, updateDelivery } from "../models/deliveries_model.js";
import createError from "http-errors";

// Função para listar entregas
export async function listDeliveries(req, res) {
  try {
    const deliveries = await getAllDeliveries();
    res.status(200).json(deliveries);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ Error: "Erro ao listar entregas" });
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

// Função para upload de imagem no VPS
export const uploadProductImage = async (req, res, next) => {
  const file = req.file;

  try {
    if (!file) {
      throw new Error("Nenhum arquivo enviado.");
    }

    // Retorna a URL pública do arquivo com o nome aleatório
    const imageUrl = `http://localhost:3000/uploads/${file.filename}`;
    res.status(200).json({ url: imageUrl });
  } catch (error) {
    console.error("Erro ao salvar a imagem:", error);
    return next(createError(502, error.message));
  }
};

// Função para atualizar uma entrega
export async function updateNewDelivery(req, res) {
  const id = req.params.id;
  const filePath = path.join(__dirname, `../uploads/${id}.png`);

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
      imgUrl: `http://191.252.202.88/uploads/${id}.png`,
      alt: "",
    };

    const updatedDelivery = await updateDelivery(id, delivery);
    res.status(200).json(updatedDelivery);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ Error: "Falha na Requisição" });
  }
};