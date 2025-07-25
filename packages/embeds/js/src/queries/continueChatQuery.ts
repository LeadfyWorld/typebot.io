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
  sessionId,
}: {
  apiHost?: string;
  message?: Message;
  sessionId: string;
}) => {
  try {
    const data = await ky
      .post(
        `${
          isNotEmpty(apiHost) ? apiHost : guessApiHost()
        }/api/v1/sessions/${sessionId}/continueChat`,
        {
          json: {
            message,
            conversationId: gaGlobal.vid,
          },
          timeout: false,
        },
      )
      .json<ContinueChatResponse>();

    return { data };
  } catch (error) {
    return { error };
  }
};

export const setChatLeadQuery = async ({
  apiHost,
  sessionId,
  leadInfo,
}: {
  apiHost?: string;
  sessionId: string;
  leadInfo: {
    name: string;
    email: string;
    phone: string;
  };
}) => {
  try {
    const data = await ky
      .post(
        `${
          isNotEmpty(apiHost) ? apiHost : guessApiHost()
        }/api/v1/sessions/${sessionId}/setLead`,
        {
          json: {
            conversationId: gaGlobal.vid,
            leadInfo,
          },
          timeout: false,
        },
      )
      .json<{
        id: number;
        data: {
          name: string;
          email: string;
          phone: string;
        };
        conversation_id: string;
      }>();

    return {
      data: {
        id: data.id,
        leadInfo: {
          name: data.data.name,
          email: data.data.email,
          phone: data.data.phone,
        },
        conversationId: data.conversation_id,
      },
    };
  } catch (error) {
    return { error };
  }
};
