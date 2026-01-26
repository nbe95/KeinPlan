import { useEffect } from "react";

interface UseKeyboardShortcutProps {
  key: string;
  onKeyPressed: () => void;
}

export const useKeyboardShortcut = (props: UseKeyboardShortcutProps) => {
  useEffect(() => {
    function keyDownHandler(e: globalThis.KeyboardEvent) {
      if (e.key === props.key) {
        e.preventDefault();
        props.onKeyPressed();
      }
    }
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [props.key, props.onKeyPressed]);
};
