import { getRoomName } from "@/contexts/BotWSContext";
import type { ClientSideActionContext } from "@/types";
import { getPartyKitHost } from "@/utils/getPartyKitHost";
import type { LogInSession } from "@typebot.io/logs/schemas";
import PartySocket from "partysocket";

type Props = {
  resultId?: string;
  sessionId: string;
  context: ClientSideActionContext;
  partySocket: PartySocket;
};

export const listenForWebhook = ({
  sessionId,
  resultId,
  context,
  partySocket,
}: Props) => {
  const ws = new PartySocket({
    host: getPartyKitHost(context.wsHost),
    room: getRoomName({ sessionId, resultId }),
  });
  return new Promise<{
    replyToSend: string | undefined;
    logs?: LogInSession[];
  }>((resolve) => {
    ws.addEventListener("message", (event) => {
      ws.close();
      resolve({ replyToSend: event.data });
    });

    ws.addEventListener("error", (error) => {
      resolve({
        logs: [
          {
            status: "error",
            description: "Websocket returned an error",
            details: JSON.stringify(error, null, 2),
          },
        ],
        replyToSend: undefined,
      });
    });
  });
};
