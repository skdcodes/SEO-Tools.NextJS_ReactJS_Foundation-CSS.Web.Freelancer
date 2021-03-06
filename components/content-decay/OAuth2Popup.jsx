// ! BUG: Sometimes the popup does not close after the success text is displayed

import { useEffect, useState } from "react";

export const OAuth2Popup = ({
  openUrl,
  saveUrl,
  onSuccess,
  onClose,
  onSuccessText,
  children,
}) => {
  const width = 450;
  const height = 600;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2.5;
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    let subscribePopup;

    if (popup) {
      subscribePopup = setInterval(() => {
        // handle popup close
        if (popup.closed === true) {
          clearInterval(subscribePopup);
          onClose?.(popup);
          return;
        }

        // check if popup same origin
        try {
          popup.parent.document;
        } catch (err) {
          return;
        }

        // check if oauth2 success
        if (popup.document.readyState === "complete") {
          const pageContent = popup.window.document.documentElement.innerHTML;

          if (popup.window.location.pathname !== saveUrl) {
            return;
          }

          if (pageContent.includes(onSuccessText)) {
            onSuccess?.(popup);
            popup.close();
          }
        }
      }, 100);
    }

    return () => {
      popup?.close();
      clearInterval(subscribePopup);
    };
  }, [popup]);

  const handleClick = () => {
    setPopup(
      window.open(
        openUrl,
        "OAuth2 Authentication",
        `height=${height},width=${width},top=${top},left=${left}`
      )
    );
  };

  return <div onClick={handleClick}>{children}</div>;
};

export default OAuth2Popup;
