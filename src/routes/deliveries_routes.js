import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import crypto from "crypto";
import fs from "fs"; // Importando o módulo File System
import { fileURLToPath } from "url"; // Import necessário para usar __dirname em ES Modules
import { uploadProductImage, listDeliveries, postNewDelivery, updateNewDelivery } from "../controller/deliveries_controller.js";

// Configuração de CORS
const corsOptions = {
  origin: "http://localhost:3000", // Permite requisições do frontend local
  optionsSuccessStatus: 200,
};

// Resolução de `__dirname` em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para a pasta 'uploads' na raiz do projeto
const uploadsPath = path.join(process.cwd(), "uploads");

// Verifica se a pasta existe, e cria caso não exista
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// Configuração de armazenamento do Multer com renomeação
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath); // Salva os arquivos na pasta raiz/uploads
  },
  filename: (req, file, cb) => {
    // Gera um nome aleatório para o arquivo
    const randomName = crypto.randomBytes(8).toString("hex");
    const fileExtension = path.extname(file.originalname); // Mantém a extensão original do arquivo
    cb(null, `${randomName}${fileExtension}`); // Ex.: 9f8d7c6a2b1d4e5f.png
  },
});

const upload = multer({ storage });

// Configuração das rotas
const routes = (app) => {
  app.use(express.json()); // Middleware para parsear JSON
  app.use(cors(corsOptions)); // Middleware para habilitar CORS

  // Expondo a pasta uploads como estática
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // Rotas
  app.get("/api/packages", listDeliveries);
  app.post("/api/packages", postNewDelivery);
  app.post("/api/upload", upload.single("image"), uploadProductImage);
  app.put("/api/upload/:id", updateNewDelivery);
};

export default routes;