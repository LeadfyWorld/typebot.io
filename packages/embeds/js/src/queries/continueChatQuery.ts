import { guessApiHost } from "@/utils/guessApiHost";
import type {
  ContinueChatResponse,
  Message,
} from "@typebot.io/chat-api/schemas";
import { isNotEmpty } from "@typebot.io/lib/utils";
import ky from "ky";

declare global {
  interface Window {
    gaGlobal?: {
      vid?: string;
      [key: string]: any;
    };
  }
}

export const continueChatQuery = async ({
  apiHost,
  message,
  sessionId,
  virtualAssistantId,
}: {
  apiHost?: string;
  message?: Message;
  virtualAssistantId?: string | null;
  sessionId: string;
}) => {
  try {
    const data = await ky
      .post(
        `${
          isNotEmpty(apiHost) ? apiHost : guessApiHost()
        }/api/sessions/${virtualAssistantId}/continueChat`,
        {
          json: {
            message,
            conversationId: window.gaGlobal?.vid,
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
