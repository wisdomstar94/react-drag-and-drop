import { RefObject, createRef, useCallback, useRef, useState } from "react";
import { IUseDragAndDropController } from "./use-drag-and-drop-controller.interface";
import useAddEventListener from "../use-add-event-listener/use-add-event-listener.hook";

export function useDragAndDropController<T = any>(props: IUseDragAndDropController.Props<T>): IUseDragAndDropController.Controller<T> {
  const {
    onListsChange,
  } = props;
  const listMap = useRef(new Map<string, IUseDragAndDropController.PushListInfo>());
  const dragFromInfo = useRef<IUseDragAndDropController.DragInfo>();
  const dragToInfo = useRef<IUseDragAndDropController.DragInfo>();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  const convertMapToArray = useCallback(function<T, K>(map: Map<T, K>) {
    return Array.from(map, function (entry) {
      return { key: entry[0], value: entry[1] };
    });
  }, []);

  const getElementAbsoluteXY = useCallback((_element: HTMLElement | null | undefined) => {
    const scrollTop = window.scrollY;
    const scrollLeft = window.scrollX;
    const rect = _element?.getBoundingClientRect();
    return [scrollLeft + (rect?.left ?? 0), scrollTop + (rect?.top ?? 0)];
  }, []);

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

  const getEventCursorAbsoluteXY = useCallback((event: MouseEvent | TouchEvent) => {
    return [getEventPageX(event), getEventPageY(event)];
  }, [getEventPageX, getEventPageY]);

  const getDragFirstStartFromInfo = useCallback((event: MouseEvent | TouchEvent) => {
    const element = event.target as (HTMLElement | null | undefined);
    let currentElement = element;
    for (let i = 0; i < 20; i++) {
      const findTarget = convertMapToArray(listMap.current).find(x => x.value.ref.current === currentElement);
      if (findTarget !== undefined) {
        return {
          name: findTarget.key,
          info: findTarget.value,
        };
      }
      currentElement = currentElement?.parentElement;
    }
    return undefined;
  }, [convertMapToArray]);

  const isDnDHandler = useCallback((event: MouseEvent | TouchEvent) => {
    const element = event.target as HTMLElement | null | undefined;
    let currentElement = element;
    for (let i = 0; i < 20; i++) {
      if (currentElement?.getAttribute('data-is-dnd-handler') === 'true') {
        return true;
      }
      currentElement = currentElement?.parentElement;
    }
    return false;
  }, []);

  const getCursorElements = useCallback((event: MouseEvent | TouchEvent) => {
    const [x, y] = [getEventClientX(event), getEventClientY(event)];
    return document.elementsFromPoint(x, y) as (HTMLElement[] | null | undefined);
  }, [getEventClientX, getEventClientY]);

  const isDragTargetThisRef = useCallback((ref: RefObject<HTMLDivElement>, event: MouseEvent | TouchEvent) => {
    const cursorElements = getCursorElements(event);
    for (const element of cursorElements ?? []) {
      if (element === ref.current) {
        return true;
      }
    }
    return false;
  }, [getCursorElements]);

  const getRefAbsolutePointRange = useCallback((ref: RefObject<HTMLDivElement>) => {
    const [startX, startY] = getElementAbsoluteXY(ref.current);
    const [endX, endY] = [startX + (ref.current?.getBoundingClientRect().width ?? 0), startY + (ref.current?.getBoundingClientRect().height ?? 0)];
    return {
      start: [startX, startY],
      end: [endX, endY],
    };
  }, [getElementAbsoluteXY]);

  const isIncludePointRangeTargetCursor = useCallback((start: number[], end: number[], target: number[]) => {
    let isIncludeX = target[0] > start[0] && target[0] < end[0];
    let isIncludeY = target[1] > start[1] && target[1] < end[1];
    return isIncludeX && isIncludeY;
  }, []);

  const getDragFromInfo = useCallback(() => {
    return dragFromInfo.current;
  }, []);

  const setDragFromInfo = useCallback((dragInfo?: IUseDragAndDropController.DragInfo) => {
    dragFromInfo.current = dragInfo;
  }, []);

  const getDragToInfo = useCallback(() => {
    return dragToInfo.current;
  }, []);

  const setDragToInfo = useCallback((dragInfo?: IUseDragAndDropController.DragInfo) => {
    dragToInfo.current = dragInfo;
  }, []);

  const pushList = useCallback((info: IUseDragAndDropController.PushListInfo) => {
    listMap.current.delete(info.name);
    listMap.current.set(info.name, info);
  }, []);

  const finallyCalculateItems = useCallback(() => {

  }, []);

  const isSameFromDragRefEqualThisRef = useCallback((ref: RefObject<HTMLDivElement>) => {
    const dragFromInfo = getDragFromInfo();
    return dragFromInfo?.ref.current === ref.current;
  }, [getDragFromInfo]);

  const getItemElement = useCallback((ref: RefObject<HTMLElement> | undefined, event: MouseEvent | TouchEvent) => {
    const element = event.target as HTMLElement | null | undefined;
    let prevElement = element;
    let currentElement = element;
    for (let i = 0; i < 10; i++) {
      if (currentElement === ref?.current) {
        return prevElement;
      }
      prevElement = currentElement;
      currentElement = currentElement?.parentElement;
    }
    return undefined;
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

  const getDragDestinationTargetIndexInfo = useCallback((ref: RefObject<HTMLDivElement>, event: MouseEvent | TouchEvent) => {
    const [refAbsoluteX, refAbsoluteY] = getElementAbsoluteXY(ref.current);
    const [cursorX, cursorY] = [getEventPageX(event), getEventPageY(event)];
    
    const targetElementHeight = (getDragFromInfo()?.targetItemElementRect?.height ?? 0);
    const targetElementWidth = (getDragFromInfo()?.targetItemElementRect?.width ?? 0);
    const maxIndex = (ref.current?.childElementCount ?? 0) + 1;

    const target = convertMapToArray(listMap.current).find(x => x.value.ref === ref);
    const gridColCount = (target?.value.gridColCount ?? 0); 

    // x 축 계산
    const xInfo = { index: 0, rangeStart: 0, rangeEnd: 0 };
    for (let i = 0; i < gridColCount; i++) {
      const temp = refAbsoluteX + ((i + 1) * targetElementWidth);
      if (cursorX < temp) {
        xInfo.index = i;
        xInfo.rangeStart = temp - targetElementWidth;
        xInfo.rangeEnd = temp;
        break;
      }
    }

    // y 축 계산
    const yInfo = { index: 0, rangeStart: 0, rangeEnd: 0 };
    for (let i = 0; i < maxIndex; i++) {
      const temp = refAbsoluteY + ((i + 1) * targetElementHeight);
      if (cursorY < temp) {
        yInfo.index = i;
        yInfo.rangeStart = temp - targetElementHeight;
        yInfo.rangeEnd = temp;
        break;
      }
    }

    const destinationIndex = xInfo.index + (yInfo.index * gridColCount);
    return {
      index: destinationIndex,
    };
  }, [convertMapToArray, getDragFromInfo, getElementAbsoluteXY, getEventPageX, getEventPageY]);

  const onPressStart = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isDnDHandler(event)) return;
  
    const dragFirstStartFromInfo = getDragFirstStartFromInfo(event);
    const itemElement = getItemElement(dragFirstStartFromInfo?.info.ref, event);
    const index = getElementIndex(itemElement?.parentElement, itemElement);
    setIsDragging(true);
    setDragFromInfo({
      name: dragFirstStartFromInfo?.name ?? '',
      item: dragFirstStartFromInfo?.info.list?.at(index),
      targetIndex: index,
      targetItemElement: itemElement,
      targetItemElementRect: itemElement?.getBoundingClientRect(),
      ref: dragFirstStartFromInfo?.info.ref ?? createRef(),
      clientX: getEventClientX(event),
      clientY: getEventClientY(event),
      pageX: getEventPageX(event),
      pageY: getEventPageY(event),
    });
  }, [getDragFirstStartFromInfo, getElementIndex, getEventClientX, getEventClientY, getEventPageX, getEventPageY, getItemElement, isDnDHandler, setDragFromInfo]);

  const onMovingTargetRef = useCallback((target: IUseDragAndDropController.PushListInfo | undefined, event: MouseEvent | TouchEvent) => {
    if (target === undefined) return;

    const ref = target.ref;

    if (!isDragging) return;
    if (!isDragTargetThisRef(ref, event)) {
      for (let i = 0; i < (ref.current?.children.length ?? 0); i++) {
        (ref.current?.children[i] as HTMLElement).style.removeProperty('transform');
      }
      return;
    }

    const dragDestinationTargetIndexInfo = getDragDestinationTargetIndexInfo(ref, event);
    const dragFromInfo = getDragFromInfo();
    const itemElementHeight = dragFromInfo?.targetItemElementRect?.height ?? 0;
    
    const destinationIndex = dragDestinationTargetIndexInfo?.index ?? 0;
    const dragStartIndex = dragFromInfo?.targetIndex ?? 0;

    if (isSameFromDragRefEqualThisRef(ref)) {
      for (let i = 0; i < (ref.current?.children.length ?? 0); i++) {
        if ((ref.current?.children[i] as HTMLElement) === dragFromInfo?.targetItemElement) {
          continue;
        }

        if (destinationIndex < dragStartIndex) {
          if (i >= destinationIndex && i <= dragStartIndex) {
            (ref.current?.children[i] as HTMLElement).style.transform = `translateY(${itemElementHeight}px)`;
          } else {
            (ref.current?.children[i] as HTMLElement).style.removeProperty('transform');
          }
        } else {
          if (i >= dragStartIndex && i <= destinationIndex) {
            (ref.current?.children[i] as HTMLElement).style.transform = `translateY(-${itemElementHeight}px)`;
          } else {
            (ref.current?.children[i] as HTMLElement).style.removeProperty('transform');
          }
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
  }, [getDragDestinationTargetIndexInfo, getDragFromInfo, isDragTargetThisRef, isDragging, isSameFromDragRefEqualThisRef]);

  const onDragging = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const dragFromInfo = getDragFromInfo();
    const diffX = getEventPageX(event) - (dragFromInfo?.pageX ?? 0);
    const diffY = getEventPageY(event) - (dragFromInfo?.pageY ?? 0);

    const targetItemElement = dragFromInfo?.targetItemElement;
    if (targetItemElement !== undefined && targetItemElement !== null) {
      targetItemElement.style.transform = `translateX(${diffX}px) translateY(${diffY}px)`;
    }

    const target = convertMapToArray(listMap.current).find(x => {
      const refRange = getRefAbsolutePointRange(x.value.ref);
      const cursorPoint = getEventCursorAbsoluteXY(event);
      const isInclude = isIncludePointRangeTargetCursor(refRange.start, refRange.end, cursorPoint);
      return isInclude;
    });
    onMovingTargetRef(target?.value, event);
  }, [convertMapToArray, getDragFromInfo, getEventCursorAbsoluteXY, getEventPageX, getEventPageY, getRefAbsolutePointRange, isDragging, isIncludePointRangeTargetCursor, onMovingTargetRef]);

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

  return {
    getDragFromInfo,
    getDragToInfo,

    setDragFromInfo,
    setDragToInfo,

    getEventClientX,
    getEventClientY,
    getEventPageX,
    getEventPageY,
    isDragTargetThisRef,

    pushList,
    isDragging,
    setIsDragging,
    finallyCalculateItems,
  };
}