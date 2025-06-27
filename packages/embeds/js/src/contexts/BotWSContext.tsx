import PartySocket from "partysocket";
import { createContext, useContext } from "solid-js";

export const BotWSContext = createContext<PartySocket>();

export const useBotWS = () => useContext(BotWSContext);

export const getRoomName = ({
  sessionId,
  resultId,
}: {
  sessionId: string;
  resultId?: string;
}) => {
  if (resultId) {
    return `${resultId}/webhooks`;
  }

  const [typebotId, userId] = sessionId.split("-");

  return `${userId}/${typebotId}/webhooks`;
};
