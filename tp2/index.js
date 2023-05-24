import express from "express";
import http from "http";
import morgan from "morgan";
import winston from "winston";
import winstonElasticsearch from "winston-elasticsearch";
import { getAll, getFlops } from "./controlers.js";
import { ES_TRANSPORT_OPTS, MORGAN_JSON_FORMAT } from "./configs.js";

const PORT = 3000;
const app = express();

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
    esTransport,
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

// Routes
app.get("/", getAll);
app.get("/flops", getFlops);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
