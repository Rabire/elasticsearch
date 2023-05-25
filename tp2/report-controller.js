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

export const search = async (req, res) => {
  const { keyword } = req.query;

  const response = await client.search({
    index: "reports",
    body: {
      query: {
        match: {
          Reports: {
            query: keyword,
            operator: "or",
            analyzer: "custom_analyzer",
          },
        },
      },
    },
  });

  return res.status(200).json(response);
};
