import { RefObject, useCallback, useRef } from "react";
import styles from './use-body.module.scss';

export function useBody(ref?: RefObject<HTMLElement>) {
  const latestScrollYRef = useRef<number>(0);
  const latestScrollXRef = useRef<number>(0);

  const latestScrollTargetYRef = useRef<number>(0);
  const latestScrollTargetXRef = useRef<number>(0);

  const denyScroll = useCallback(() => {
    latestScrollYRef.current = window.scrollY;
    latestScrollXRef.current = window.scrollX;
    document.querySelector('html')?.classList.add(styles['html-window-scroll-deny']);
    document.body.classList.add(styles['body-window-scroll-deny']);
    document.body.style.top = `-${latestScrollYRef.current}px`;
    document.body.style.left = `-${latestScrollXRef.current}px`;

    if (ref !== undefined && ref.current !== null) {
      latestScrollTargetYRef.current = ref.current.scrollTop;
      latestScrollTargetXRef.current = ref.current.scrollLeft;
      ref.current.classList.add(styles['scroll-target-scroll-block']);
      ref.current.style.top = `-${latestScrollTargetYRef.current}px`;
      ref.current.style.left = `-${latestScrollTargetXRef.current}px`;
    }
  }, [ref]);

  const allowScroll = useCallback(() => {
    document.querySelector('html')?.classList.remove(styles['html-window-scroll-deny']);
    document.body.classList.remove(styles['body-window-scroll-deny']);
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('left');
    window.scrollTo({
      top: latestScrollYRef.current,
      left: latestScrollXRef.current,
    });

    if (ref !== undefined && ref.current !== null) {
      ref.current.classList.remove(styles['scroll-target-scroll-block']);
      ref.current.style.removeProperty('top');
      ref.current.style.removeProperty('left');
      ref.current.scrollTo({
        top: latestScrollTargetYRef.current,
        left: latestScrollTargetXRef.current,
      });
    }
  }, [ref]);

  const denyTextDrag = useCallback(() => {
    document.body.classList.add(styles['no-text-drag']);
  }, []);

  const allowTextDrag = useCallback(() => {
    document.body.classList.remove(styles['no-text-drag']);
  }, []);

  return {
    denyScroll,
    allowScroll,
    denyTextDrag,
    allowTextDrag,
  };
}