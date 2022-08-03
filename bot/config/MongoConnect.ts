import { MongoClient } from "mongodb";
import { CONFIG } from "./Config";
const uri = CONFIG.mongo as string;
export const client = new MongoClient(uri).db("test");


