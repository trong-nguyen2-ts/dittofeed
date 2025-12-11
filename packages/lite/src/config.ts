import { Static, Type } from "@sinclair/typebox";
import { loadConfig, setConfigOnEnv } from "backend-lib/src/config/loader";
import { BoolStr, NodeEnv } from "backend-lib/src/types";
import { Overwrite } from "utility-types";

const RawConfigProps = {
  nodeEnv: Type.Optional(NodeEnv),
  serviceName: Type.Optional(Type.String()),
  port: Type.Optional(
    Type.String({
      format: "naturalNumber",
    }),
  ),
  host: Type.Optional(Type.String()),
  // TS custom: mode allows more flexibility (api, worker, or all)
  mode: Type.Optional(Type.String({ default: "all" })),
  // Upstream: enableWorker flag for backward compatibility
  enableWorker: Type.Optional(BoolStr),
};

// Structure of application config.
const RawConfig = Type.Object(RawConfigProps);

type RawConfig = Static<typeof RawConfig>;

export type Config = Overwrite<
  RawConfig,
  {
    nodeEnv: string;
    serviceName: string;
    host: string;
    port: number;
    mode: string;
    enableWorker: boolean;
  }
>;
function parseRawConfig(raw: RawConfig): Config {
  const nodeEnv = raw.nodeEnv ?? "development";
  const port = Number(raw.port);

  // Default mode is "all", but can be overridden by enableWorker flag
  let mode = raw.mode ?? "all";
  let enableWorker = raw.enableWorker !== "false";

  // If enableWorker is explicitly set to false, adjust mode
  if (raw.enableWorker === "false" && !raw.mode) {
    mode = "api";
    enableWorker = false;
  }

  return {
    ...raw,
    serviceName: raw.serviceName ?? "dittofeed-lite",
    nodeEnv,
    host: raw.host ?? (nodeEnv === "development" ? "localhost" : "0.0.0.0"),
    port: Number.isNaN(port) ? 3000 : port,
    mode,
    enableWorker,
  };
}

// Singleton configuration object used by application.
let CONFIG: Config | null = null;

export default function config(): Config {
  if (!CONFIG) {
    CONFIG = loadConfig({
      schema: RawConfig,
      transform: parseRawConfig,
      keys: Object.keys(RawConfigProps),
    });
    setConfigOnEnv(CONFIG);
  }
  return CONFIG;
}
