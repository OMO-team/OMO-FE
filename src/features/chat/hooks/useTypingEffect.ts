import { useState, useEffect } from 'react';

export default function useTypingEffect(text: string, speed: number = 50) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let index = 0;

    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return displayText;
}
