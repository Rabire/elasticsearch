import express from "express";
import { Client } from "@elastic/elasticsearch";
import fs from "fs";

const PORT = 3000;
const app = express();

const client = new Client({
  node: "https://localhost:9200",
  auth: {
    username: "elastic",
    password: "zkUFj8+jyb=W=B=PpXrq",
  },
  tls: {
    ca: fs.readFileSync("./http_ca.crt"),
    rejectUnauthorized: false,
  },
});

app.get("/", async (req, res) => {
  const movies = await client.search({
    index: "movies",
  });
  res.send(movies);
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
