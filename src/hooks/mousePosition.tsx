import { useEffect, useState } from 'react';

// be careful using this hook.
// Try to use only in the last level of react components!
export const useMousePosition = (): any => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const setFromEvent = (e: any): any =>
      setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', setFromEvent);

    return () => {
      window.removeEventListener('mousemove', setFromEvent);
    };
  }, []);

  return position;
};
