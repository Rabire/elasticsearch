export const NODE_URL = "https://localhost:9200";
export const USER = "elastic";
export const PASSWORD = "zkUFj8+jyb=W=B=PpXrq";

export const MORGAN_JSON_FORMAT = {
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

export const ES_TRANSPORT_OPTS = {
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
