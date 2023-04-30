import { useEffect, useRef } from "react";
import { IUseAddEventListener } from "./use-add-event-listener.interface";

const useAddEventListener = (props: IUseAddEventListener.Props) => {
  const {
    targetElementRef,
    eventName,
    eventListener,
  } = props;

  const savedCallback = useRef(null as any);
  const savedTargetElementRef = useRef(null as any);

  // eventListener 가 바뀔 때마다(갱신 될 때마다) eventListner 를 제거하고 ref 를 업데이트해주고 다시 eventListner 를 등록해준다.
  useEffect(() => {
    savedTargetElementRef.current?.removeEventListener(eventName, savedCallback.current);
    savedTargetElementRef.current = targetElementRef.current;
    savedCallback.current = eventListener;
  }, [targetElementRef, eventListener, eventName]);

  useEffect(() => {
    if (savedTargetElementRef.current === null || savedTargetElementRef.current === undefined) {
      return;
    }

    savedTargetElementRef.current.addEventListener(eventName, savedCallback.current);
  }, [targetElementRef, eventListener, eventName]);

  useEffect(() => {
    // unmount 가 되면, targetElement 에 할당한 eventListener 제거
    return () => {
      if (savedTargetElementRef.current === null || savedTargetElementRef.current === undefined) {
        return;
      }

      savedTargetElementRef.current?.removeEventListener(eventName, savedCallback.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useAddEventListener;