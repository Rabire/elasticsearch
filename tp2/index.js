import express from "express";
import http from "http";
import morgan from "morgan";
import winston from "winston";
import winstonElasticsearch from "winston-elasticsearch";
import { getAll, getFlops } from "./films-controller.js";
import { search, insertComment } from "./report-controller.js";
import { ES_TRANSPORT_OPTS, MORGAN_JSON_FORMAT } from "./configs.js";
import { parseUserAgent, sanitizeUrl } from "./logger-utils.js";

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

logger.on("error", (error) => {
  console.error("Error in logger caught", error);
});
esTransport.on("error", (error) => {
  console.error("Error in logger caught", error);
});

// Routes
app.get("/films/", getAll);
app.get("/films/flops", getFlops);

app.get("/reports/search", search);
app.post("/report", insertComment);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
