import { ObjectId } from "mongodb";
import "dotenv/config";
import connectToDatabase from "../config/db_config.js";

const conection = await connectToDatabase(process.env.STRING_CONEXAO);

export async function getAllDeliveries() {
  const db = conection.db("delivery-hub");
  const dbCollection = db.collection("deliveries");
  return dbCollection.find().toArray();
}

export async function createDelivery(newDelivery) {
    const db = conection.db("delivery-hub");
    const dbCollection = db.collection("deliveries");
    return dbCollection.insertOne(newDelivery);
}
export async function updateDelivery(newDelivery) {
    const db = conection.db("delivery-hub");
    const dbCollection = db.collection("deliveries");
    const objID = ObjectId.createFromHexString(id);
    return dbCollection.updateOne({_id: new ObjectId(objID)}, {$set:newDelivery});
}
