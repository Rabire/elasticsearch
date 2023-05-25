import { Client } from "@elastic/elasticsearch";
import fs from "fs";
import { NODE_URL, USER, PASSWORD } from "./configs.js";

const client = new Client({
  node: NODE_URL,
  auth: { username: USER, password: PASSWORD },
  tls: {
    ca: fs.readFileSync("./http_ca.crt"),
    rejectUnauthorized: false,
  },
});

export const getAll = async (req, res) => {
  const movies = await client.search({
    index: "movies",
  });

  return res.status(200).json(movies);
};

export const getFlops = async (req, res) => {
  const movies = await client.search({
    index: "movies",
    query: {
      match: { Verdict: "Flop" },
    },
  });

  return res.status(200).json(movies);
};
