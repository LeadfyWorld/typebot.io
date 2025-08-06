import { FilePreview } from "@/features/blocks/inputs/fileUpload/components/FilePreview";
import { formatMessageDate } from "@/lib/date";
import type {
  InputSubmitContent,
  RecordingInputSubmitContent,
  TextInputSubmitContent,
} from "@/types";
import { isNotEmpty } from "@typebot.io/lib/utils";
import {
  defaultGuestAvatarIsEnabled,
  defaultHostAvatarIsEnabled,
} from "@typebot.io/theme/constants";
import { isChatContainerLight } from "@typebot.io/theme/helpers/isChatContainerLight";
import type { Theme } from "@typebot.io/theme/schemas";
import { cx } from "@typebot.io/ui/lib/cva";
import { For, Match, Show, Switch, createSignal } from "solid-js";
import { Modal } from "../Modal";
import { Avatar } from "../avatars/Avatar";

type Props = {
  answer?: InputSubmitContent;
  theme: Theme;
  error: string | null;
  createdAt: string | null;
};

export const GuestBubble = (props: Props) => {
  return (
    <div
      class={cx(
        "flex justify-end items-end animate-fade-in gap-2 guest-container",
        (props.theme.chat?.hostAvatar?.isEnabled ??
          defaultHostAvatarIsEnabled) &&
          "ml-7 @xs:ml-[50px]",
      )}
    >
      <Switch>
        <Match when={props.answer?.type === "text"}>
          <TextGuestBubble
            createdAt={props.createdAt}
            error={props.error}
            answer={props.answer as TextInputSubmitContent}
          />
        </Match>

        <Match when={props.answer?.type === "recording"}>
          <AudioGuestBubble
            createdAt={props.createdAt}
            error={props.error}
            answer={props.answer as RecordingInputSubmitContent}
          />
        </Match>
      </Switch>

      <Show
        when={
          props.theme.chat?.guestAvatar?.isEnabled ??
          defaultGuestAvatarIsEnabled
        }
      >
        <Avatar
          src={props.theme.chat?.guestAvatar?.url}
          isChatContainerLight={isChatContainerLight({
            chatContainer: props.theme.chat?.container,
            generalBackground: props.theme.general?.background,
          })}
        />
      </Show>
    </div>
  );
};

const TextGuestBubble = (props: {
  answer: TextInputSubmitContent;
  error: string | null;
  createdAt: string | null;
}) => {
  const [clickedImageSrc, setClickedImageSrc] = createSignal<string>();

  return (
    <div class="flex flex-col gap-1 items-end">
      <Show when={(props.answer.attachments ?? []).length > 0}>
        <div class="flex gap-1 overflow-auto max-w-[350px] flex-wrap justify-end @xs:items-center @xs:flex-nowrap">
          <For
            each={props.answer.attachments?.filter((attachment) =>
              attachment.type.startsWith("image"),
            )}
          >
            {(attachment, idx) => (
              <img
                src={attachment.blobUrl ?? attachment.url}
                alt={`Attached image ${idx() + 1}`}
                class={cx(
                  "typebot-guest-bubble-image-attachment cursor-pointer",
                  props.answer.attachments!.filter((attachment) =>
                    attachment.type.startsWith("image"),
                  ).length > 1 && "max-w-[90%]",
                )}
                onClick={() =>
                  setClickedImageSrc(attachment.blobUrl ?? attachment.url)
                }
              />
            )}
          </For>
        </div>
        <div class="flex gap-1 overflow-auto max-w-[350px] flex-wrap justify-end @xs:items-center @xs:flex-nowrap">
          <For
            each={props.answer.attachments?.filter(
              (attachment) => !attachment.type.startsWith("image"),
            )}
          >
            {(attachment) => (
              <FilePreview
                file={{
                  name: attachment.url.split("/").at(-1)!,
                }}
              />
            )}
          </For>
        </div>
      </Show>

      <div
        class={`p-[1px] whitespace-pre-wrap max-w-full typebot-guest-bubble ${props.error ? "typebot-guest-bubble-error" : ""} px-[15px] py-[7px]`}
        data-testid="guest-bubble"
      >
        <div
          class="flex flex-col"
          style={{
            display: "flex",
            "flex-direction": "row",
            "align-items": "center",
          }}
        >
          <Show
            when={
              isNotEmpty(props.answer.label ?? props.answer.value) &&
              !props.error
            }
          >
            <span>{props.answer.label ?? props.answer.value}</span>
          </Show>

          <Show
            when={
              isNotEmpty(props.answer.label ?? props.answer.value) &&
              props.error
            }
          >
            <div
              class="relative group"
              style={{ display: "inline-block" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-triangle-alert-icon lucide-triangle-alert"
                style={{
                  "margin-right": "15px",
                  display: "inline-block",
                }}
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>

              <span
                class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap"
                style={{
                  right: 0,
                  "white-space": "normal",
                  margin: 0,
                  width: "100%",
                  "word-break": "break-word",
                }}
              >
                {props.error}
              </span>

              <span>{props.answer.label ?? props.answer.value}</span>
            </div>
          </Show>
        </div>

        <div
          style={{
            opacity: "0.6",
            "font-size": "9px",
            "line-height": "13px",
            "margin-top": "5px",
          }}
        >
          {formatMessageDate(props.createdAt)}
        </div>
      </div>

      <Modal
        isOpen={clickedImageSrc() !== undefined}
        onClose={() => setClickedImageSrc(undefined)}
      >
        <img
          src={clickedImageSrc()}
          alt="Attachment"
          class="max-h-[calc(100vh-1rem)] max-w-[calc(100%-1rem)] rounded-[6px] m-auto"
        />
      </Modal>
    </div>
  );
};

const AudioGuestBubble = (props: {
  answer: RecordingInputSubmitContent;
  error: string | null;
  createdAt: string | null;
}) => {
  return (
    <div class="flex flex-col gap-1 items-end">
      <div
        class={`p-2 w-full whitespace-pre-wrap typebot-guest-bubble ${props.error ? "typebot-guest-bubble-error" : ""} flex flex-col`}
        data-testid="guest-bubble"
      >
        <audio
          controls
          src={props.answer.blobUrl ?? props.answer.url}
        />
      </div>
    </div>
  );
};
