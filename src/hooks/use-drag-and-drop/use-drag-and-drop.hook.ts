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

    // console.log('@@dragFromInfo?.targetItemElementRect', dragFromInfo?.targetItemElementRect);
    // console.log('@@dragFromInfo?.clientX', dragFromInfo?.clientX);
    // console.log('@@dragFromInfo?.clientY', dragFromInfo?.clientY);
    // console.log('@@event', event);
    // console.log('@@getEventClientX(event)', getEventClientX(event));
    // console.log('@@getEventClientY(event)', getEventClientY(event));
    // console.log(`diffX: ${diffX}, diffY: ${diffY}`);

    const targetItemElement = dragFromInfo?.targetItemElement;
    if (targetItemElement !== undefined && targetItemElement !== null) {
      targetItemElement.style.transform = `translateX(${diffX}px) translateY(${diffY}px)`;
    }
  }, [controller, getEventPageX, getEventPageY]);

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