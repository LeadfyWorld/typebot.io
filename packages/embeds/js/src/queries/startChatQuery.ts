import {
  getPaymentInProgressInStorage,
  removePaymentInProgressFromStorage,
} from "@/features/blocks/inputs/payment/helpers/paymentInProgressStorage";
import type { BotContext } from "@/types";
import { guessApiHost } from "@/utils/guessApiHost";
import type {
  ContinueChatResponse,
  StartChatInput,
  StartChatResponse,
  StartFrom,
  StartPreviewChatInput,
} from "@typebot.io/chat-api/schemas";
import { isNotDefined, isNotEmpty } from "@typebot.io/lib/utils";
import ky from "ky";

declare global {
  interface Window {
    gaGlobal?: {
      vid?: string;
      [key: string]: any;
    };
  }
}

type Props = {
  typebot: string | any;
  stripeRedirectStatus?: string;
  apiHost?: string;
  startFrom?: StartFrom;
  isPreview: boolean;
  prefilledVariables?: Record<string, unknown>;
  resultId?: string;
  sessionId?: string;
};

export async function startChatQuery({
  typebot,
  isPreview,
  apiHost,
  prefilledVariables,
  resultId,
  stripeRedirectStatus,
  startFrom,
  sessionId,
}: Props) {
  if (isNotDefined(typebot))
    throw new Error("Typebot ID is required to get initial messages");

  const paymentInProgressStateStr =
    getPaymentInProgressInStorage() ?? undefined;

  const paymentInProgressState = paymentInProgressStateStr
    ? (JSON.parse(paymentInProgressStateStr) as {
        sessionId: string;
        typebot: BotContext["typebot"];
      })
    : undefined;

  if (paymentInProgressState) {
    return resumeChatAfterPaymentRedirect({
      apiHost,
      stripeRedirectStatus,
      paymentInProgressState,
    });
  }

  const typebotId = typeof typebot === "string" ? typebot : typebot.id;

  if (isPreview) {
    return startPreviewChat({
      apiHost,
      typebotId,
      startFrom,
      typebot,
      prefilledVariables,
      sessionId,
    });
  }

  try {
    if (!window.gaGlobal?.vid) {
      throw new Error("Missing vid");
    }

    const iframeReferrerOrigin =
      parent !== window && isNotEmpty(document.referrer)
        ? new URL(document.referrer).origin
        : undefined;

    const response = await ky.post(
      `${getApiHost(apiHost)}/api/sessions/${typebotId}/startChat`,
      {
        headers: {
          "x-typebot-iframe-referrer-origin": iframeReferrerOrigin,
        },
        json: {
          is_stream_enabled: true,
          prefilled_variables: prefilledVariables,
          result_id: resultId,
          is_only_registering: false,
          session_id: window.gaGlobal.vid,
        } satisfies Omit<
          StartChatInput,
          "publicId" | "textBubbleContentFormat"
        >,
        timeout: false,
      },
    );

    return {
      data: await response.json<StartChatResponse>(),
    };
  } catch (error) {
    return {
      error,
    };
  }
}

export async function setChatLeadQuery({
  typebot,
  apiHost,
  formInputs,
}: {
  apiHost?: string;
  typebot: string | any;
  formInputs: {
    name: string;
    email: string;
    phone: string;
  };
}) {
  if (isNotDefined(typebot)) {
    throw new Error("Typebot ID is required to get initial messages");
  }

  const typebotId = typeof typebot === "string" ? typebot : typebot.id;

  try {
    const data = await ky
      .post(
        `${
          isNotEmpty(apiHost) ? apiHost : guessApiHost()
        }/api/sessions/${typebotId}/setLead`,
        {
          json: {
            session_id: window.gaGlobal?.vid,
            lead_info: formInputs,
          },
          timeout: false,
        },
      )
      .json<{
        created_at: string;
        id: string;
        lead_id: string;
        session_id: string;
        virtual_assistant_id: string;
      }>();

    return {
      data: {
        id: data.id,
        sessionId: data.session_id,
        virtualAssistantSessionId: data.id,
      },
    };
  } catch (error) {
    return { error };
  }
}

const resumeChatAfterPaymentRedirect = async ({
  apiHost,
  stripeRedirectStatus,
  paymentInProgressState,
}: {
  apiHost?: string;
  stripeRedirectStatus?: string;
  paymentInProgressState: {
    sessionId: string;
    typebot: BotContext["typebot"];
  };
}) => {
  removePaymentInProgressFromStorage();

  try {
    const data = await ky
      .post(
        `${getApiHost(apiHost)}/api/sessions/${
          paymentInProgressState.sessionId
        }/continueChat`,
        {
          json: {
            message: stripeRedirectStatus === "failed" ? "fail" : "Success",
            session_id: window.gaGlobal?.vid,
          },
          timeout: false,
        },
      )
      .json<ContinueChatResponse>();

    return {
      data: {
        ...data,
        ...paymentInProgressState,
      } as StartChatResponse,
    };
  } catch (error) {
    return { error };
  }
};

const startPreviewChat = async ({
  apiHost,
  typebotId,
  startFrom,
  typebot,
  prefilledVariables,
  sessionId,
}: {
  apiHost?: string;
  typebotId: string;
  startFrom?: StartFrom;
  typebot: StartPreviewChatInput["typebot"];
  prefilledVariables?: Record<string, unknown>;
  sessionId?: string;
}) => {
  try {
    const data = await ky
      .post(
        `${getApiHost(apiHost)}/api/sessions/${typebotId}/preview/startChat`,
        {
          json: {
            is_stream_enabled: true,
            start_from: startFrom,
            typebot,
            prefilled_variables: prefilledVariables,
            session_id: sessionId,
          } satisfies Omit<
            StartPreviewChatInput,
            "typebotId" | "isOnlyRegistering" | "textBubbleContentFormat"
          >,
          timeout: false,
        },
      )
      .json<StartChatResponse>();

    return { data };
  } catch (error) {
    return { error };
  }
};

const getApiHost = (apiHost?: string): string =>
  isNotEmpty(apiHost) ? apiHost : guessApiHost();
