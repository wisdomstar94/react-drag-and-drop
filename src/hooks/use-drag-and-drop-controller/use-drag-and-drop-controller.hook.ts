import { RefObject, createRef, useCallback, useRef, useState } from "react";
import { IUseDragAndDropController } from "./use-drag-and-drop-controller.interface";
import useAddEventListener from "../use-add-event-listener/use-add-event-listener.hook";

export function useDragAndDropController<T = any>(props: IUseDragAndDropController.Props<T>): IUseDragAndDropController.Controller<T> {
  const {
    onListsChange,
    onDestinationActiveListName,
    onStartDrag,
    onEndDrag,
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

  const isDnDHandlerThisController = useCallback((event: MouseEvent | TouchEvent) => {
    const element = event.target as HTMLElement | null | undefined;
    let currentElement = element;
    for (let i = 0; i < 20; i++) {
      for (const r of convertMapToArray(listMap.current).map(x => x.value?.ref)) {
        if (r.current === currentElement) {
          return true;
        }
      }
      currentElement = currentElement?.parentElement;
    }
    return false;
  }, [convertMapToArray]);

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
    
    const dragFromInfo = getDragFromInfo();
    const fromItemHeight = (dragFromInfo?.targetItemElementRect?.height ?? 0);
    const fromItemWidth = (dragFromInfo?.targetItemElementRect?.width ?? 0);
    const itemTotalCount = (ref.current?.childElementCount ?? 0) + 1;

    const target = convertMapToArray(listMap.current).find(x => x.value.ref === ref);
    const layoutType = target?.value.listLayout.type;
    const fixedColCount = target?.value.listLayout.fixedColCount ?? 0;
    const fixedRowCount = target?.value.listLayout.fixedRowCount ?? 0;

    const destinationRefItemWidth = ref.current?.firstElementChild?.getBoundingClientRect().width ?? fromItemWidth;
    const destinationRefItemHeight = ref.current?.firstElementChild?.getBoundingClientRect().height ?? fromItemHeight;

    let yInfoMaxIndex = 0;
    let xInfoMaxIndex = 0;
    let isUseNextIndexItem = false;

    switch (layoutType) {
      case 'one-col-infinite': {
        /**
         * [ 0 ]
         * [ 1 ]
         * [ 2 ]
         * ...
         */
        yInfoMaxIndex = itemTotalCount;
      } break;
      case 'one-row-infinite': {
        /**
         * [ 0 ] [ 1 ] [ 2 ] ...
         */
        xInfoMaxIndex = itemTotalCount;
      } break;
      case 'fixed-col-count-grid': {
        /**
         * [ 0 ] [ 1 ]
         * [ 2 ] [ 3 ] 
         * [ 4 ] [ 5 ] 
         * ... ...
         */
        yInfoMaxIndex = Math.ceil((itemTotalCount) / 2);
        xInfoMaxIndex = fixedColCount;
      } break;
      // case 'fixed-row-count-grid': {
      //   /**
      //    * [ 0 ] [ 2 ] [ 4 ] [ 6 ] ...
      //    * [ 1 ] [ 3 ] [ 5 ] [ 7 ] ...
      //    */
      //   yInfoMaxIndex = fixedRowCount;
      //   xInfoMaxIndex = Math.ceil(itemTotalCount / 2);
      // } break;
    }

    const yInfo = { index: 999999999, rangeStart: 0, rangeEnd: 0 };
    let stackedHeight = 0;
    isUseNextIndexItem = false;
    for (let i = 0; i < yInfoMaxIndex; i++) {
      let target = ref.current?.children[i];
      if (target === dragFromInfo?.targetItemElement) {
        isUseNextIndexItem = true;
      }
      if (isUseNextIndexItem) {
        target = ref.current?.children[i + 1];
      }
      const height = target?.getBoundingClientRect().height ?? 200;
      stackedHeight += height;
      const temp = refAbsoluteY + stackedHeight;
      if (cursorY < temp) {
        yInfo.index = i;
        yInfo.rangeStart = temp - height;
        yInfo.rangeEnd = temp;
        break;
      }
    }

    const xInfo = { index: 999999999, rangeStart: 0, rangeEnd: 0 };
    let stackedWidth = 0;
    isUseNextIndexItem = false;
    for (let i = 0; i < xInfoMaxIndex; i++) {
      let target = ref.current?.children[i];
      if (target === dragFromInfo?.targetItemElement) {
        isUseNextIndexItem = true;
      }
      if (isUseNextIndexItem) {
        target = ref.current?.children[i + 1];
      }
      const width = target?.getBoundingClientRect().width ?? 200;
      stackedWidth += width;
      const temp = refAbsoluteX + stackedWidth;
      if (cursorX < temp) {
        xInfo.index = i;
        xInfo.rangeStart = temp - width;
        xInfo.rangeEnd = temp;
        break;
      }
    }

    let destinationIndex = 0;
    switch (layoutType) {
      case 'one-col-infinite': {
        destinationIndex = yInfo.index;
      } break;
      case 'one-row-infinite': {
        destinationIndex = xInfo.index;
      } break;
      case 'fixed-col-count-grid': {
        destinationIndex = xInfo.index + (yInfo.index * fixedColCount);
      } break;
      // case 'fixed-row-count-grid': {
      //   destinationIndex = yInfo.index + (xInfo.index * fixedRowCount);
      // } break;
    }

    return {
      index: destinationIndex,
      layoutType,
      fixedColCount,
      fixedRowCount,
      destinationRefItemWidth,
      destinationRefItemHeight,
    };
  }, [convertMapToArray, getDragFromInfo, getElementAbsoluteXY, getEventPageX, getEventPageY]);

  const onPressStart = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isDnDHandler(event)) return;
    if (!isDnDHandlerThisController(event)) return;
  
    const dragFirstStartFromInfo = getDragFirstStartFromInfo(event);
    const itemElement = getItemElement(dragFirstStartFromInfo?.info.ref, event);
    const index = getElementIndex(itemElement?.parentElement, itemElement);

    const dragInfo: IUseDragAndDropController.DragInfo =  {
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
    };

    setIsDragging(true);
    setDragFromInfo(dragInfo);
    setDragToInfo({
      ...dragInfo,
      targetItemElement: null,
      targetItemElementRect: undefined,
      ref: dragFirstStartFromInfo?.info.ref ?? createRef(),
    });

    convertMapToArray(listMap.current).forEach((item) => {
      if (item.value.ref.current === null) return;
      if (item.value.ref === dragFirstStartFromInfo?.info.ref) {
        let currentElement: HTMLElement | null | undefined = item.value.ref.current;
        for (let i = 0; i < 2; i++) {
          if (currentElement !== null && currentElement !== undefined) {
            currentElement.style.zIndex = '2';  
          }
          currentElement = currentElement?.parentElement;
        }
        return;
      };
      // if (item.value.ref.current.style.position === 'static') return;
      item.value.ref.current.style.zIndex = '1';
    });

    const children = dragFirstStartFromInfo?.info.ref.current?.children ?? [];
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement; 
      if (child === itemElement) {
        child.style.zIndex = '2';
        continue;
      }
      child.style.zIndex = '1';
    }

    if (typeof onStartDrag === 'function') {
      onStartDrag(dragInfo);
    }
  }, [convertMapToArray, getDragFirstStartFromInfo, getElementIndex, getEventClientX, getEventClientY, getEventPageX, getEventPageY, getItemElement, isDnDHandler, isDnDHandlerThisController, onStartDrag, setDragFromInfo, setDragToInfo]);

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

    if (typeof onDestinationActiveListName === 'function') {
      onDestinationActiveListName(target.name);  
    }

    const dragDestinationTargetIndexInfo = getDragDestinationTargetIndexInfo(ref, event);
    const dragFromInfo = getDragFromInfo();
    // const itemElementWidth = dragFromInfo?.targetItemElementRect?.width ?? 0;
    // const itemElementHeight = dragFromInfo?.targetItemElementRect?.height ?? 0;
    
    const destinationIndex = dragDestinationTargetIndexInfo?.index ?? 0;
    const dragStartIndex = dragFromInfo?.targetIndex ?? 0;

    setDragToInfo({
      name: target?.name ?? '',
      item: target?.list?.at(destinationIndex),
      targetIndex: destinationIndex,
      targetItemElement: null,
      targetItemElementRect: undefined,
      ref: target.ref,
      clientX: getEventClientX(event),
      clientY: getEventClientY(event),
      pageX: getEventPageX(event),
      pageY: getEventPageY(event),
    });

    if (isSameFromDragRefEqualThisRef(ref)) {
      switch (dragDestinationTargetIndexInfo.layoutType) {
        case 'one-col-infinite': {
          const height = getDragFromInfo()?.targetItemElementRect?.height ?? 0;
          for (let i = 0; i < (ref.current?.children.length ?? 0); i++) {
            const child = (ref.current?.children[i] as HTMLElement);
            if (child === dragFromInfo?.targetItemElement) {
              continue;
            }
    
            if (destinationIndex < dragStartIndex) {
              if (i >= destinationIndex && i <= dragStartIndex) {
                child.style.transform = `translateY(${height}px)`;
              } else {
                child.style.removeProperty('transform');
              }
            } else {
              if (i >= dragStartIndex && i <= destinationIndex) {
                child.style.transform = `translateY(-${height}px)`;
              } else {
                child.style.removeProperty('transform');
              }
            }
          }
        } break;
        case 'one-row-infinite': {
          const width = getDragFromInfo()?.targetItemElementRect?.width ?? 0;
          for (let i = 0; i < (ref.current?.children.length ?? 0); i++) {
            const child = (ref.current?.children[i] as HTMLElement);
            if (child === dragFromInfo?.targetItemElement) {
              continue;
            }
    
            if (destinationIndex < dragStartIndex) {
              if (i >= destinationIndex && i <= dragStartIndex) {
                child.style.transform = `translateX(${width}px)`;
              } else {
                child.style.removeProperty('transform');
              }
            } else {
              if (i >= dragStartIndex && i <= destinationIndex) {
                child.style.transform = `translateX(-${width}px)`;
              } else {
                child.style.removeProperty('transform');
              }
            }
          }
        } break;
        case 'fixed-col-count-grid': {
          for (let i = 0; i < (ref.current?.children.length ?? 0); i++) {
            const child = (ref.current?.children[i] as HTMLElement);
            if (child === dragFromInfo?.targetItemElement) {
              continue;
            }
    
            if (destinationIndex < dragStartIndex) {
              if (i >= destinationIndex && i <= dragStartIndex) {
                let x = 0;
                let y = 0;
                const virtualIndex = i + 1;
                if (virtualIndex % dragDestinationTargetIndexInfo.fixedColCount === 0) {
                  x = -((i % dragDestinationTargetIndexInfo.fixedColCount) * dragDestinationTargetIndexInfo.destinationRefItemWidth);
                  y = dragDestinationTargetIndexInfo.destinationRefItemHeight;
                } else {
                  x = dragDestinationTargetIndexInfo.destinationRefItemWidth;
                }
                child.style.transform = `translateX(${x}px) translateY(${y}px)`;
              } else {
                child.style.removeProperty('transform');
              }
            } else {
              if (i >= dragStartIndex && i <= destinationIndex) {
                let x = 0;
                let y = 0;
                const virtualIndex = i - 1;
                if (i % dragDestinationTargetIndexInfo.fixedColCount === 0) {
                  x = ((virtualIndex % dragDestinationTargetIndexInfo.fixedColCount) * dragDestinationTargetIndexInfo.destinationRefItemWidth);
                  y = -dragDestinationTargetIndexInfo.destinationRefItemHeight;
                } else {
                  x = -dragDestinationTargetIndexInfo.destinationRefItemWidth;
                }
                child.style.transform = `translateX(${x}px) translateY(${y}px)`;
              } else {
                child.style.removeProperty('transform');
              }
            }
          }
        } break;
      }
    } else {
      switch (dragDestinationTargetIndexInfo.layoutType) {
        case 'one-col-infinite': {
          const height = getDragFromInfo()?.targetItemElementRect?.height ?? 0;
          for (let i = 0; i < (ref.current?.children.length ?? 0); i++) {
            const child = (ref.current?.children[i] as HTMLElement);
            if (i < (dragDestinationTargetIndexInfo?.index ?? 999999)) {
              child.style.removeProperty('transform');
              continue;
            }
            if (child !== undefined && child !== null) {
              child.style.transform = `translateY(${height}px)`;
            } 
          }
        } break;
        case 'one-row-infinite': {
          const width = getDragFromInfo()?.targetItemElementRect?.width ?? 0;
          for (let i = 0; i < (ref.current?.children.length ?? 0); i++) {
            const child = (ref.current?.children[i] as HTMLElement);
            if (i < (dragDestinationTargetIndexInfo?.index ?? 999999)) {
              child.style.removeProperty('transform');
              continue;
            }
            if (child !== undefined && child !== null) {
              child.style.transform = `translateX(${width}px)`;
            } 
          }
        } break;
        case 'fixed-col-count-grid': {
          for (let i = 0; i < (ref.current?.children.length ?? 0); i++) {
            const child = (ref.current?.children[i] as HTMLElement);
            if (i < (dragDestinationTargetIndexInfo?.index ?? 999999)) {
              child.style.removeProperty('transform');
              continue;
            }
            if (child !== undefined && child !== null) {
              const virtualIndex = i + 1; // ex. index = 3, virtual index = 4
              let x = 0;
              let y = 0;
              if (virtualIndex % dragDestinationTargetIndexInfo.fixedColCount === 0) {
                x = -((i % dragDestinationTargetIndexInfo.fixedColCount) * dragDestinationTargetIndexInfo.destinationRefItemWidth);
                y = dragDestinationTargetIndexInfo.destinationRefItemHeight;
              } else {
                x = dragDestinationTargetIndexInfo.destinationRefItemWidth;
              }
              child.style.transform = `translateX(${x}px) translateY(${y}px)`;
            } 
          }
        } break;
      }
    }
  }, [getDragDestinationTargetIndexInfo, getDragFromInfo, getEventClientX, getEventClientY, getEventPageX, getEventPageY, isDragTargetThisRef, isDragging, isSameFromDragRefEqualThisRef, onDestinationActiveListName, setDragToInfo]);

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

  const onPressEnd = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const arr = convertMapToArray(listMap.current);
    arr.forEach((item, index) => {
      // item.value.ref.current?.style.removeProperty('z-index');
      let currentElement: HTMLElement | null | undefined = item.value.ref.current;
      for (let i = 0; i < 2; i++) {
        if (currentElement !== null && currentElement !== undefined) {
          currentElement.style.removeProperty('z-index');
        }
        currentElement = currentElement?.parentElement;
      }

      const children = item.value.ref.current?.children;
      if (children === undefined) return;
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        child.style.removeProperty('transform');
      }
    });

    const dragFromInfo = getDragFromInfo();
    const dragToInfo = getDragToInfo();

    const destinationList = listMap.current.get(dragToInfo?.name ?? '')?.list ?? [];
    const copyDestinationList = [ ...destinationList ];
    
    const changeInfo = new Map<string, T[]>();
    
    if (dragFromInfo?.name !== dragToInfo?.name) {
      copyDestinationList.splice(dragToInfo?.targetIndex ?? 0, 0, dragFromInfo?.item);
      changeInfo.set(dragToInfo?.name ?? '', copyDestinationList);
      changeInfo.set(dragFromInfo?.name ?? '', listMap.current.get(dragFromInfo?.name ?? '')?.list?.filter((_, index) => index !== (dragFromInfo?.targetIndex ?? -1)) ?? []);
    } else {
      copyDestinationList.splice(dragFromInfo?.targetIndex ?? 0, 1);
      copyDestinationList.splice(dragToInfo?.targetIndex ?? 0, 0, dragFromInfo?.item);
      changeInfo.set(dragFromInfo?.name ?? '', copyDestinationList);
    }

    const children = dragFromInfo?.ref.current?.children ?? [];
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement; 
      child.style.removeProperty('z-index');
    }

    onListsChange(changeInfo);
    setIsDragging(false);

    if (typeof onEndDrag === 'function') {
      onEndDrag(dragFromInfo, dragToInfo);
    }
  }, [convertMapToArray, getDragFromInfo, getDragToInfo, isDragging, onEndDrag, onListsChange]);

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
    targetElementRef: { current: typeof window !== 'undefined' ? window : null },
    eventName: 'mouseup',
    eventListener: onPressEnd,
  });

  useAddEventListener({
    targetElementRef: { current: typeof window !== 'undefined' ? window : null },
    eventName: 'touchend',
    eventListener: onPressEnd,
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