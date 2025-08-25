import type { BubbleProps } from "./features/bubble/components/Bubble";
import { close } from "./features/commands/utils/close";
import { hidePreviewMessage } from "./features/commands/utils/hidePreviewMessage";
import { open } from "./features/commands/utils/open";
import { sendCommand } from "./features/commands/utils/sendCommand";
import { setInputValue } from "./features/commands/utils/setInputValue";
import { setPrefilledVariables } from "./features/commands/utils/setPrefilledVariables";
import { showPreviewMessage } from "./features/commands/utils/showPreviewMessage";
import { toggle } from "./features/commands/utils/toggle";
import { unmount } from "./features/commands/utils/unmount";
import type { PopupProps } from "./features/popup/components/Popup";
import { type BotProps, reload } from "./index";

// const initScript = (
//   props:
//     | (BubbleProps & { gTag: string })
//     | (PopupProps & { gTag: string })
//     | (BotProps & { id?: string; gTag: string }),
// ) => {
//   console.log("initScript");

//   const ENDPOINT = `${props.apiHost}/api/sessions/${props.typebot}/record`;

//   let leadId: string | null = null;

//   // Helper: get Google Analytics client ID
//   // function getGAClientId() {
//   //   if (typeof gtag === "function") {
//   //     return new Promise((resolve) => {
//   //       gtag("get", props.gTag, "client_id", (clientId) => {
//   //         console.log("clientId", clientId);

//   //         resolve(clientId);
//   //       });
//   //     });
//   //   }

//   //   console.log("not found gtag");

//   //   return Promise.resolve(null);
//   // }

//   // Send behavior to backend
//   // async function sendBehavior(type, metadata) {
//   //   const clientId = await getGAClientId();

//   //   if (!clientId) {
//   //     return;
//   //   }

//   //   fetch(ENDPOINT, {
//   //     method: "POST",
//   //     headers: {
//   //       "Content-Type": "application/json",
//   //     },
//   //     body: JSON.stringify({
//   //       session_id: clientId,
//   //       type,
//   //       metadata,
//   //     }),
//   //   }).catch(console.error);
//   // }

//   // -----------------------
//   // Robust GA client ID
//   // -----------------------
//   function getGAClientId() {
//     return new Promise((resolve) => {
//       let resolved = false;

//       function tryGet() {
//         if (typeof gtag === "function") {
//           gtag("get", props.gTag, "client_id", (clientId) => {
//             if (clientId && !resolved) {
//               resolved = true;
//               leadId = clientId;
//               resolve(resolved);
//             } else if (!resolved) {
//               setTimeout(tryGet, 100);
//             }
//           });
//         } else if (!resolved) {
//           setTimeout(tryGet, 100);
//         }
//       }

//       tryGet();

//       setTimeout(() => {
//         if (!resolved) {
//           resolved = true;
//           resolve(resolved);
//         }
//       }, 3000);
//     });
//   }

//   getGAClientId().then(() => {
//     trackPageView();
//   });

//   // -----------------------
//   // Send behavior
//   // -----------------------
//   async function sendBehavior(type, metadata) {
//     if (!leadId) {
//       await getGAClientId();

//       if (!leadId) {
//         return;
//       }
//     }

//     fetch(ENDPOINT, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         session_id: leadId,
//         type,
//         metadata,
//       }),
//     }).catch(console.error);
//   }

//   // -----------------------
//   // Page view + SPA duration
//   // -----------------------
//   let currentPageStart = Date.now();

//   function trackPageView() {
//     const now = Date.now();
//     const durationSeconds = Math.round((now - currentPageStart) / 1000);

//     if (!leadId) {
//       return;
//     }

//     if (currentPageStart) {
//       navigator.sendBeacon(
//         ENDPOINT,
//         JSON.stringify({
//           session_id: leadId,
//           type: "page_view",
//           metadata: {
//             source: "website",
//             url: window.location.href,
//             referrer: document.referrer,
//             device: navigator.userAgent,
//             browser: navigator.appVersion,
//             durationSeconds,
//           },
//         }),
//       );
//     }

//     currentPageStart = now;
//   }

//   window.addEventListener("load", trackPageView);

//   const originalPushState = history.pushState;
//   history.pushState = function () {
//     originalPushState.apply(this, arguments);
//     setTimeout(trackPageView, 0);
//   };
//   window.addEventListener("popstate", trackPageView);
//   window.addEventListener("beforeunload", () => {
//     const durationSeconds = Math.round((Date.now() - currentPageStart) / 1000);

//     if (!leadId) {
//       return;
//     }

//     navigator.sendBeacon(
//       ENDPOINT,
//       JSON.stringify({
//         session_id: leadId,
//         type: "page_view",
//         metadata: {
//           source: "website",
//           url: window.location.href,
//           referrer: document.referrer,
//           device: navigator.userAgent,
//           browser: navigator.appVersion,
//           durationSeconds,
//         },
//       }),
//     );
//   });

//   // -----------------------
//   // Click + CTA + social_share
//   // -----------------------
//   document.addEventListener("click", function (e) {
//     const el = e.target.closest("button, a, [data-track-click]");
//     if (!el) return;

//     sendBehavior("click", {
//       elementId: el.id || null,
//       elementText: el.innerText || el.value || null,
//       pageUrl: window.location.href,
//       timestamp: new Date().toISOString(),
//     });

//     if (el.dataset.ctaId) {
//       sendBehavior("cta_interaction", {
//         ctaId: el.dataset.ctaId,
//         action: "click",
//         pageUrl: window.location.href,
//       });
//     }

//     if (el.dataset.socialPlatform) {
//       sendBehavior("social_share", {
//         platform: el.dataset.socialPlatform,
//         contentId: el.dataset.contentId,
//         url: window.location.href,
//       });
//     }
//   });

//   // -----------------------
//   // Form submissions + behaviors
//   // -----------------------
//   document.addEventListener("submit", function (e) {
//     const form = e.target;
//     const formData = {};
//     new FormData(form).forEach((value, key) => {
//       formData[key] = value;
//     });

//     const type = form.dataset.behaviorType || "form_submission";

//     sendBehavior(type, {
//       formId: form.id || null,
//       fields: formData,
//       pageUrl: window.location.href,
//       ipAddress: null,
//     });

//     // Special behaviors based on form type
//     if (type === "signup")
//       sendBehavior("signup", {
//         plan: formData.plan,
//         referral: formData.referral,
//         promoCode: formData.promoCode,
//       });
//     if (type === "demo_request")
//       sendBehavior("demo_request", {
//         productId: formData.productId,
//         preferredDate: formData.preferredDate,
//         notes: formData.notes,
//       });
//     if (type === "newsletter_subscription")
//       sendBehavior("newsletter_subscription", {
//         listId: formData.listId,
//         source: formData.source,
//         email: formData.email,
//       });
//     if (type === "survey_submission")
//       sendBehavior("survey_submission", {
//         surveyId: formData.surveyId,
//         responses: formData,
//       });
//   });

//   // -----------------------
//   // Scroll
//   // -----------------------
//   let lastScroll = 0;
//   window.addEventListener("scroll", function () {
//     const scrollDepth = Math.round(
//       ((window.scrollY + window.innerHeight) / document.body.scrollHeight) *
//         100,
//     );
//     if (scrollDepth - lastScroll >= 25) {
//       lastScroll = scrollDepth;
//       sendBehavior("page_scroll", {
//         pageUrl: window.location.href,
//         scrollDepthPercent: scrollDepth,
//       });
//     }
//   });

//   // -----------------------
//   // Video watch
//   // -----------------------
//   document.querySelectorAll("video").forEach((video) => {
//     let lastTime = 0;
//     video.addEventListener("timeupdate", () => {
//       const current = Math.floor(video.currentTime);
//       if (current - lastTime >= 10) {
//         lastTime = current;
//         sendBehavior("video_watch", {
//           videoId: video.id || null,
//           title: video.title || null,
//           durationSeconds: Math.floor(video.duration),
//           watchedSeconds: current,
//         });
//       }
//     });
//   });

//   // -----------------------
//   // File downloads
//   // -----------------------
//   document.addEventListener("click", function (e) {
//     const link = e.target.closest("a[download]");
//     if (!link) return;
//     sendBehavior("file_download", {
//       fileName: link.getAttribute("download") || null,
//       fileSizeKb: null,
//       pageUrl: window.location.href,
//     });
//   });

//   // -----------------------
//   // Cart + purchase behaviors
//   // Expect elements with data attributes for auto-tracking
//   // -----------------------
//   document.querySelectorAll("[data-add-to-cart]").forEach((el) => {
//     el.addEventListener("click", () => {
//       sendBehavior("add_to_cart", {
//         productId: el.dataset.productId,
//         productName: el.dataset.productName,
//         price: Number.parseFloat(el.dataset.price),
//         quantity: Number.parseInt(el.dataset.quantity || "1"),
//       });
//     });
//   });

//   document.querySelectorAll("[data-remove-from-cart]").forEach((el) => {
//     el.addEventListener("click", () => {
//       sendBehavior("remove_from_cart", {
//         productId: el.dataset.productId,
//         quantityRemoved: Number.parseInt(el.dataset.quantityRemoved || "1"),
//       });
//     });
//   });

//   document.querySelectorAll("[data-purchase-start]").forEach((el) => {
//     el.addEventListener("click", () => {
//       sendBehavior("purchase_start", {
//         cartId: el.dataset.cartId,
//         totalAmount: Number.parseFloat(el.dataset.totalAmount),
//         itemsCount: Number.parseInt(el.dataset.itemsCount),
//       });
//     });
//   });

//   document.querySelectorAll("[data-purchase-complete]").forEach((el) => {
//     el.addEventListener("click", () => {
//       sendBehavior("purchase_complete", {
//         orderId: el.dataset.orderId,
//         totalAmount: Number.parseFloat(el.dataset.totalAmount),
//         paymentMethod: el.dataset.paymentMethod,
//       });
//     });
//   });

//   // -----------------------
//   // Product review
//   // -----------------------
//   document.querySelectorAll("[data-product-review]").forEach((form) => {
//     form.addEventListener("submit", (e) => {
//       e.preventDefault();
//       const reviewData = {};
//       new FormData(form).forEach((v, k) => (reviewData[k] = v));
//       sendBehavior("product_review", {
//         productId: form.dataset.productId,
//         rating: Number.parseInt(reviewData.rating),
//         comment: reviewData.comment,
//         reviewId: reviewData.reviewId,
//       });
//     });
//   });
// };

export const initStandard = (props: BotProps & { id?: string }) => {
  // initScript(props);

  const standardElement = props.id
    ? document.getElementById(props.id)
    : document.querySelector("typebot-standard");

  if (!standardElement) {
    throw new Error("<typebot-standard> element not found.");
  }

  Object.assign(standardElement, props);
};

export const initPopup = (props: PopupProps) => {
  // initScript(props);

  const popupElement = document.createElement("typebot-popup");

  Object.assign(popupElement, props);

  document.body.prepend(popupElement);
};

export const initBubble = (props: BubbleProps) => {
  // initScript(props);

  const bubbleElement = document.createElement("typebot-bubble");

  Object.assign(bubbleElement, props);

  document.body.prepend(bubbleElement);
};

export const parseTypebot = () => ({
  initStandard,
  initPopup,
  initBubble,
  close,
  hidePreviewMessage,
  open,
  setPrefilledVariables,
  showPreviewMessage,
  toggle,
  setInputValue,
  unmount,
  sendCommand,
  reload,
});

type Typebot = ReturnType<typeof parseTypebot>;

declare const window:
  | {
      Typebot: Typebot;
    }
  | undefined;

export const injectTypebotInWindow = (typebot: Typebot) => {
  if (typeof window === "undefined") return;
  window.Typebot = { ...typebot };
};
