import { RefObject, useEffect, useRef, useState } from 'react';

export type AnimationState = 'entering' | 'entered' | 'exiting';

export const useAnimation = (
  elemRef: RefObject<HTMLElement>,
  onExit?: () => void,
) => {
  const [state, setState] = useState<AnimationState>('entering');

  const ongoingAnimationsCount = useRef(0);

  useEffect(() => {
    if (state === 'entering' || state === 'exiting') {
      const elem = elemRef.current;
      if (elem) {
        const onAnimationStart = () => {
          ongoingAnimationsCount.current++;
        };
        const onAnimationEnd = () => {
          ongoingAnimationsCount.current--;
          if (ongoingAnimationsCount.current === 0) {
            if (state === 'entering') {
              setState('entered');
            } else {
              onExit?.();
            }
          }
        };
        elem.addEventListener('animationstart', onAnimationStart);
        elem.addEventListener('animationend', onAnimationEnd);
        return () => {
          elem.removeEventListener('animationstart', onAnimationStart);
          elem.removeEventListener('animationend', onAnimationEnd);
        };
      }
    }
  }, [state, elemRef, onExit, ongoingAnimationsCount]);

  const exit = () => {
    setState('exiting');
  };

  return { state, exit };
};
