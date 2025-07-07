import * as React from "react";
import { formatMessage } from "./formatMessage";

type AgentBlock = {
  agent_name?: string;
  output?: string;
};

export function cleanAgentOutput(raw: string): JSX.Element[] {
  if (!raw) return [];

  let line = raw.trim();
  if (line.startsWith("data:")) {
    line = line.slice(5).trim();
  }
  if (
    !line ||
    line === "data:" ||
    line === "data" ||
    line === "data: STREAM_END" ||
    line.startsWith(": ping") ||
    line === "ping"
  ) {
    return [];
  }

  let agent: AgentBlock | null = null;

  try {
    agent = JSON.parse(line);
  } catch {
    if (line.includes("agent_name")) {
      try {
        const maybeAgent = JSON.parse(line.match(/{.*}/)?.[0] || "{}");
        if (maybeAgent.agent_name) {
          agent = { agent_name: maybeAgent.agent_name };
        }
      } catch {
        // ignore
      }
    }
  }

  if (agent && agent.agent_name && agent.output) {
    return [
      <div className="mb-1 text-base font-bold text-blue-700">
        {agent.agent_name}
      </div>,
      ...formatMessage(agent.output),
    ];
  }
  return [];

}
