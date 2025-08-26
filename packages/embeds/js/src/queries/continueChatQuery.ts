import { guessApiHost } from "@/utils/guessApiHost";
import type {
  ContinueChatResponse,
  Message,
} from "@typebot.io/chat-api/schemas";
import { isNotEmpty } from "@typebot.io/lib/utils";
import ky from "ky";

export const continueChatQuery = async ({
  apiHost,
  message,
  virtualAssistantId,
  sessionId,
}: {
  apiHost?: string;
  message?: Message;
  virtualAssistantId: string;
  sessionId: string;
}) => {
  try {
    const data = await ky
      .post(
        `${
          isNotEmpty(apiHost) ? apiHost : guessApiHost()
        }/api/virtual-assistants/${virtualAssistantId}/continue-chat`,
        {
          json: {
            message,
            session_id: sessionId,
          },
          timeout: false,
        },
      )
      .json<ContinueChatResponse>();

    return { data };
  } catch (error) {
    const typeError = error as Error;

    return { error: typeError };
  }
};
