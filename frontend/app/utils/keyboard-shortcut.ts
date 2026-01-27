import { useEffect } from "react";

interface UseKeyboardShortcutProps {
  key: string;
  onKeyPressed: () => void;
}

export const useKeyboardShortcut = (props: UseKeyboardShortcutProps) => {
  useEffect(() => {
    const keyDownHandler = (e: globalThis.KeyboardEvent) => {
      // Don't fire if user has focussed a form element
      const activeElement = document.activeElement;
      const isInputFocussed =
        activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement;
      if (isInputFocussed) {
        return;
      }

      if (e.key === props.key) {
        e.preventDefault();
        props.onKeyPressed();
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [props.key, props.onKeyPressed]);
};
