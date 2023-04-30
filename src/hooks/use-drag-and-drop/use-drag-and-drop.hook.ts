import { useCallback, useEffect, useRef } from "react";
import { IUseDragAndDrop } from "./use-drag-and-drop.interface";
import useAddEventListener from "../use-add-event-listener/use-add-event-listener.hook";

export function useDragAndDrop<T>(props: IUseDragAndDrop.Props<T>) {
  const {
    name,
    list,
    controller,
  } = props;

  const ref = useRef<HTMLDivElement>(null);
  // const [thisRefActive, setThisRefActive] =
  // const isRefDragTarget = useRef(false);

  const getEventClientX = useCallback((event: MouseEvent | TouchEvent) => {
    return event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  }, []);

  const getEventClientY = useCallback((event: MouseEvent | TouchEvent) => {
    return event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
  }, []);

  const getEventPageX = useCallback((event: MouseEvent | TouchEvent) => {
    return event instanceof MouseEvent ? event.pageX : event.touches[0].pageX;
  }, []);

  const getEventPageY = useCallback((event: MouseEvent | TouchEvent) => {
    return event instanceof MouseEvent ? event.pageY : event.touches[0].pageY;
  }, []);

  const getCursorElements = useCallback((event: MouseEvent | TouchEvent) => {
    const [x, y] = [getEventClientX(event), getEventClientY(event)];
    return document.elementsFromPoint(x, y) as (HTMLElement[] | null | undefined);
  }, [getEventClientX, getEventClientY]);

  const isDragTargetThisRef = useCallback((event: MouseEvent | TouchEvent) => {
    const cursorElements = getCursorElements(event);
    for (const element of cursorElements ?? []) {
      if (element === ref.current) {
        return true;
      }
    }
    return false;
  }, [getCursorElements]);

  const isSameFromDragRefEqualThisRef = useCallback(() => {
    const dragFromInfo = controller.getDragFromInfo();
    return dragFromInfo?.ref.current === ref.current;
  }, [controller]);

  const getElementAbsoluteXY = useCallback((_element: HTMLElement | null | undefined) => {
    const scrollTop = window.scrollY;
    const scrollLeft = window.scrollX;
    const rect = _element?.getBoundingClientRect();
    return [scrollLeft + (rect?.left ?? 0), scrollTop + (rect?.top ?? 0)];
  }, []);

  const getDragDestinationTargetIndexInfo = useCallback((event: MouseEvent | TouchEvent) => {
    const [refAbsoluteX, refAbsoluteY] = getElementAbsoluteXY(ref.current);
    const [cursorX, cursorY] = [getEventPageX(event), getEventPageY(event)];
    
    const targetElementHeight = (controller.getDragFromInfo()?.targetItemElementRect?.height ?? 0);
    const maxIndex = ref.current?.childElementCount ?? 0;
    for (let i = 0; i < maxIndex; i++) {
      const temp = refAbsoluteY + ((i + 1) * targetElementHeight);
      if (cursorY < temp) {
        return {
          index: i,
          rangeStart: temp - targetElementHeight,
          rangeEnd: temp, 
        };
      }
    }
    return undefined;
  }, [controller, getElementAbsoluteXY, getEventPageX, getEventPageY]);

  const getItemElement = useCallback((event: MouseEvent | TouchEvent) => {
    const element = event.target as HTMLElement | null | undefined;
    let prevElement = element;
    let currentElement = element;
    for (let i = 0; i < 10; i++) {
      if (currentElement === ref.current) {
        return prevElement;
      }
      prevElement = currentElement;
      currentElement = currentElement?.parentElement;
    }
    return undefined;
  }, []);

  const isDnDHandler = useCallback((event: MouseEvent | TouchEvent) => {
    const element = event.target as HTMLElement | null | undefined;
    let currentElement = element;
    for (let i = 0; i < 10; i++) {
      if (currentElement?.getAttribute('data-is-dnd-handler') === 'true') {
        return true;
      }
      currentElement = currentElement?.parentElement;
    }
    return false;
  }, []);

  const isThisList = useCallback((event: MouseEvent | TouchEvent) => {
    const element = event.target as HTMLElement | null | undefined;
    let currentElement = element;
    for (let i = 0; i < 10; i++) {
      if (currentElement === ref.current) {
        return true;
      }
      currentElement = currentElement?.parentElement;
    }
    return false;
  }, []);
  
  const getElementIndex = useCallback((_parentElement: HTMLElement | null | undefined, _element: HTMLElement | null | undefined) => {
    for (let i = 0; i < (_parentElement?.children.length ?? 0); i++) {
      const element = _parentElement?.children[i];
      if (element === _element) {
        return i;
      } 
    }
    return 0;
  }, []);

  const onPressStart = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isDnDHandler(event)) return;
    if (!isThisList(event)) return;
    const itemElement = getItemElement(event);
    const index = getElementIndex(itemElement?.parentElement, itemElement);
    console.log('@index', index);
    console.log('@itemElement', itemElement);
    controller.setIsDragging(true);
    controller.setDragFromInfo({
      name: name,
      item: list?.at(index),
      targetIndex: index,
      targetItemElement: itemElement,
      targetItemElementRect: itemElement?.getBoundingClientRect(),
      ref: ref,
      clientX: getEventClientX(event),
      clientY: getEventClientY(event),
      pageX: getEventPageX(event),
      pageY: getEventPageY(event),
    });
  }, [controller, getElementIndex, getEventClientX, getEventClientY, getEventPageX, getEventPageY, getItemElement, isDnDHandler, isThisList, list, name]);

  const onDragging = useCallback((event: MouseEvent | TouchEvent) => {
    if (!controller.isDragging) return;

    const dragFromInfo = controller.getDragFromInfo();
    const diffX = getEventPageX(event) - (dragFromInfo?.pageX ?? 0);
    const diffY = getEventPageY(event) - (dragFromInfo?.pageY ?? 0);

    if (!isDragTargetThisRef(event)) {
      for (let i = 0; i < (ref.current?.children.length ?? 0); i++) {
        (ref.current?.children[i] as HTMLElement).style.removeProperty('transform');
      }
      return;
    }

    // console.log('@@dragFromInfo?.targetItemElementRect', dragFromInfo?.targetItemElementRect);
    // console.log('@@dragFromInfo?.clientX', dragFromInfo?.clientX);
    // console.log('@@dragFromInfo?.clientY', dragFromInfo?.clientY);
    // console.log('@@event', event);
    // console.log('@@getEventClientX(event)', getEventClientX(event));
    // console.log('@@getEventClientY(event)', getEventClientY(event));
    // console.log(`diffX: ${diffX}, diffY: ${diffY}`);
    // console.log('@@ref.current?.getBoundingClientRect()', { ref: ref.current});

    const targetItemElement = dragFromInfo?.targetItemElement;
    if (targetItemElement !== undefined && targetItemElement !== null) {
      targetItemElement.style.transform = `translateX(${diffX}px) translateY(${diffY}px)`;
    }
    // event.preventDefault();
  }, [controller, getEventPageX, getEventPageY, isDragTargetThisRef]);

  const onMovingInRef = useCallback((event: MouseEvent | TouchEvent) => {
    if (!controller.isDragging) return;
    if (!isDragTargetThisRef(event)) {
      for (let i = 0; i < (ref.current?.children.length ?? 0); i++) {
        (ref.current?.children[i] as HTMLElement).style.removeProperty('transform');
      }
      return;
    }

    const dragDestinationTargetIndexInfo = getDragDestinationTargetIndexInfo(event);
    const dragFromInfo = controller.getDragFromInfo();
    const itemElementHeight = dragFromInfo?.targetItemElementRect?.height ?? 0;
    
    if (isSameFromDragRefEqualThisRef()) {
      for (let i = 0; i < (ref.current?.children.length ?? 0); i++) {
        if ((ref.current?.children[i] as HTMLElement) === dragFromInfo?.targetItemElement) {
          continue;
        }

        if (i <= (dragDestinationTargetIndexInfo?.index ?? 999999)) {
          (ref.current?.children[i] as HTMLElement).style.transform = `translateY(-${itemElementHeight}px)`;
        } else {
          (ref.current?.children[i] as HTMLElement).style.removeProperty('transform');
        }
      }
    } else {
      for (let i = 0; i < (ref.current?.children.length ?? 0); i++) {
        if (i < (dragDestinationTargetIndexInfo?.index ?? 999999)) {
          (ref.current?.children[i] as HTMLElement).style.removeProperty('transform');
          continue;
        }
        if ((ref.current?.children[i] as HTMLElement) !== undefined && (ref.current?.children[i] as HTMLElement) !== null) {
          (ref.current?.children[i] as HTMLElement).style.transform = `translateY(${itemElementHeight}px)`;
        } 
      }
    }

    event.preventDefault();
  }, [controller, getDragDestinationTargetIndexInfo, isDragTargetThisRef, isSameFromDragRefEqualThisRef]);

  const onLeaveRef = useCallback((event: MouseEvent | TouchEvent) => {
    // if (!isRefDragTarget.current) return;
    console.log(`@@@@leave..${name}`, event);
    // isRefDragTarget.current = false;
    event.preventDefault();
  }, [name]);

  const onEnterRef = useCallback((event: MouseEvent | TouchEvent) => {
    // if (isRefDragTarget.current) return;
    console.log(`@@@@enter..${name}`, event);
    // isRefDragTarget.current = true;
    event.preventDefault();
  }, [name]);

  useAddEventListener({
    targetElementRef: { current: typeof window !== 'undefined' ? window : null },
    eventName: 'mousedown',
    eventListener: onPressStart,
  });

  useAddEventListener({
    targetElementRef: { current: typeof window !== 'undefined' ? window : null },
    eventName: 'touchstart',
    eventListener: onPressStart,
  });

  useAddEventListener({
    targetElementRef: { current: typeof window !== 'undefined' ? window : null },
    eventName: 'mousemove',
    eventListener: onDragging,
  });

  useAddEventListener({
    targetElementRef: { current: typeof window !== 'undefined' ? window : null },
    eventName: 'touchmove',
    eventListener: onDragging,
  });

  useAddEventListener({
    targetElementRef: ref,
    eventName: 'mousemove',
    eventListener: onMovingInRef,
  });

  useAddEventListener({
    targetElementRef: ref,
    eventName: 'touchmove',
    eventListener: onMovingInRef,
  });

  // useAddEventListener({
  //   targetElementRef: ref,
  //   eventName: 'mouseout',
  //   eventListener: onLeaveRef,
  // });

  useAddEventListener({
    targetElementRef: ref,
    eventName: 'pointerleave',
    eventListener: onLeaveRef,
  });

  // useAddEventListener({
  //   targetElementRef: ref,
  //   eventName: 'mouseover',
  //   eventListener: onEnterRef,
  // });

  useAddEventListener({
    targetElementRef: ref,
    eventName: 'pointerenter',
    eventListener: onEnterRef,
  });

  useEffect(() => {
    controller.pushList({
      name,
      list,
      ref,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  useEffect(() => {

  }, []);

  return {
    ref,
  };
}