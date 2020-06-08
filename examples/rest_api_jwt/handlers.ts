import { Request } from "../../mod.ts";
import {
  createFruit,
  updateFruit,
  getFruits,
  deleteFruit,
} from "./services.ts";

export const getFruitHandler = async (req: Request) => {
  const result = await getFruits();
  req.send(result);
};

export const createFruitHandler = async (req: Request) => {
  if (!req.payload) return req.send("empty payload");
  const { name } = JSON.parse(req.payload);
  const result = await createFruit(name);
  req.send(result);
};

export const updateFruitHandler = async (req: Request) => {
  if (!req.payload) return req.send("empty payload");
  const { id, name } = JSON.parse(req.payload);
  const result = await updateFruit(id, name);
  req.send(result);
};

export const deleteFruitHandler = async (req: Request) => {
  if (!req.payload) return req.send("empty payload");
  const { id } = JSON.parse(req.payload);
  const result = await deleteFruit(id);
  req.send(result);
};
