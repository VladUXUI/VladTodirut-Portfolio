import { SeverityNumber } from "@opentelemetry/api-logs";
import { posthogLogProvider } from "../../instrumentation";

const logger = posthogLogProvider?.getLogger("posthog-portfolio-logs");

export function logLlmsTxtRequested() {
  logger?.emit({
    body: "llms_txt_requested",
    severityNumber: SeverityNumber.INFO,
    attributes: {
      route: "/llms.txt",
    },
  });
}

export function logLlmsTxtGenerated() {
  logger?.emit({
    body: "llms_txt_generated",
    severityNumber: SeverityNumber.INFO,
    attributes: {
      route: "/llms.txt",
    },
  });
}

export async function flushPosthogLogs() {
  await posthogLogProvider?.forceFlush();
}
