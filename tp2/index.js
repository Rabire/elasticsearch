import express from "express";
import { Client } from "@elastic/elasticsearch";
import fs from "fs";
import http from "http";
import morgan from "morgan";
import winston from "winston";
import userAgentParser from "ua-parser-js";
import winstonElasticsearch from "winston-elasticsearch";

const PORT = 3000;
const app = express();

const NODE_URL = "https://localhost:9200";
const USER = "elastic";
const PASSWORD = "zkUFj8+jyb=W=B=PpXrq";

const MORGAN_JSON_FORMAT = {
  method: ":method",
  url: ":url",
  http_version: ":http-version",
  remote_addr: ":remote-addr",
  remote_addr_forwarded: ":req[x-forwarded-for]", //Get a specific header
  response_time: ":response-time",
  status: ":status",
  content_length: ":res[content-length]",
  timestamp: ":date[iso]",
  user_agent: ":user-agent",
};

const ES_TRANSPORT_OPTS = {
  level: "info",
  indexPrefix: "logging-api",
  indexSuffixPattern: "YYYY-MM-DD",
  clientOpts: {
    node: NODE_URL,
    maxRetries: 5,
    requestTimeout: 10000,
    sniffOnStart: false,
    auth: {
      username: USER,
      password: PASSWORD,
    },
  },
  source: process.env.LOG_SOURCE || "api",
};

const client = new Client({
  node: NODE_URL,
  auth: { username: USER, password: PASSWORD },
  tls: {
    ca: fs.readFileSync("./http_ca.crt"),
    rejectUnauthorized: false,
  },
});

const esTransport = new winstonElasticsearch.ElasticsearchTransport(
  ES_TRANSPORT_OPTS
);

const morganJSONFormat = () => JSON.stringify(MORGAN_JSON_FORMAT);

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "info",
      json: true,
    }),
    esTransport, //Add es transport
  ],
});

app.use(
  morgan(morganJSONFormat(), {
    stream: {
      write: (message) => {
        const data = JSON.parse(message);
        parseUserAgent(data);
        sanitizeUrl(data);
        return logger.info("accesslog", data);
      },
    },
  })
);

function parseUserAgent(data) {
  if (data.user_agent) {
    const ua = userAgentParser(data.user_agent);
    if (ua.browser) {
      data.user_agent_browser_name = ua.browser.name;
      data.user_agent_browser_version = ua.browser.major || ua.browser.version;
    }
    if (ua.os) {
      data.user_agent_os_name = ua.os.name;
      data.user_agent_os_version = ua.os.version;
    }
  }
}

function sanitizeUrl(data) {
  if (!data.url) {
    return;
  }
  const regex = /\/[0-9]+/g;
  const urlWithoutParameter = data.url.replace(regex, "/:id");
  data.url_sanitized = urlWithoutParameter;
}

app.get("/", async (req, res) => {
  const movies = await client.search({
    index: "movies",
  });
  res.status(200).json(movies);
});

app.get("/flops", async (req, res) => {
  const movies = await client.search({
    index: "movies",
    query: {
      match: { Verdict: "Flop" },
    },
  });
  res.status(200).json(movies);
});

// app.get("/logs", (req, res) => {
//   // logger.info("Hi there !");
//   res.status(200).json({});
// });

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
