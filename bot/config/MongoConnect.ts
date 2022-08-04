import { MongoClient } from "mongodb";
import { CONFIG } from "./Config";
const uri = CONFIG.MONGO_URI as string;
export const client = new MongoClient(uri).db("test");


