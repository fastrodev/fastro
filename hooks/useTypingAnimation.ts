import { useEffect, useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

interface UseTypingAnimationProps {
  text: string | JSX.Element;
  shouldType?: boolean;
  onComplete?: () => void;
  minDelay?: number;
  maxDelay?: number;
}

export function useTypingAnimation({
  text,
  shouldType = true,
  onComplete,
  minDelay = 30,
  maxDelay = 70,
}: UseTypingAnimationProps) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    setDisplayText("");
    if (!shouldType) return;

    let timeoutId: number;
    let currentIndex = 0;
    let isActive = true;

    const typeNextCharacter = () => {
      if (!isActive) return;

      if ((typeof text === "string") && currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));

        if (currentIndex === text.length) {
          if (onComplete) onComplete();
        } else {
          currentIndex++;
          const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
          timeoutId = setTimeout(typeNextCharacter, randomDelay);
        }
      }
    };

    timeoutId = setTimeout(typeNextCharacter, 0);

    return () => {
      isActive = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [text, shouldType, minDelay, maxDelay]);

  return { displayText };
}
