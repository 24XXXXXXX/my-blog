const welcomePopupHandler = () => {
  const config = (window as any).REIMU_WELCOME_POPUP_CONFIG || {};
  const popup = _$(".welcome-popup") as HTMLElement | null;
  const closeButton = popup?.querySelector(".popup-btn-close") as HTMLElement | null;
  const confirmButton = popup?.querySelector(".welcome-popup-confirm") as HTMLButtonElement | null;
  const mask = _$("#mask") as HTMLElement | null;
  const onceKey = String(config.onceKey || "REIMU_WELCOME_POPUP_DISMISSED_V1");
  const delay = Number(config.delay || 0);

  if (!popup || !mask || config.enabled === false) {
    return;
  }

  const shouldSkip = () => {
    try {
      return localStorage.getItem(onceKey) === "1";
    } catch {
      return false;
    }
  };

  const markDismissed = () => {
    try {
      localStorage.setItem(onceKey, "1");
    } catch {}
  };

  const closePopup = () => {
    popup.classList.remove("show");
    mask.classList.add("hide");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", keydownHandler);
    mask.removeEventListener("click", handleMaskClick);
    markDismissed();
  };

  const keydownHandler = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closePopup();
    }
  };

  const handleMaskClick = () => {
    closePopup();
  };

  const openPopup = () => {
    if (shouldSkip()) {
      return;
    }

    popup.classList.add("show");
    mask.classList.remove("hide");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", keydownHandler);
    mask.addEventListener("click", handleMaskClick);
    closeButton?.focus?.();
  };

  closeButton?.addEventListener("click", closePopup);
  confirmButton?.addEventListener("click", closePopup);

  window.setTimeout(openPopup, Math.max(0, delay));
};

if (document.readyState !== "loading") {
  welcomePopupHandler();
} else {
  document.addEventListener("DOMContentLoaded", welcomePopupHandler);
}
