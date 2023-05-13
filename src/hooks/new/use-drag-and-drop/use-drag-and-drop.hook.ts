import { RefObject, createRef, useCallback, useEffect, useRef, useState } from "react";
import { IUseDragAndDrop } from "./use-drag-and-drop.interface";
import { useBody } from "@/hooks/use-body/use-body.hook";
import useAddEventListener from "@/hooks/use-add-event-listener/use-add-event-listener.hook";

export function useDragAndDrop<
  T, 
  K extends HTMLElement, 
  E extends string,
>(
  props: IUseDragAndDrop.Props<T, K, E>
) {
  const {
    onListsChange,
    onDestinationActiveListName,
    onStartDrag,
    onEndDrag,
  } = props;
  const dragFromInfo = useRef<IUseDragAndDrop.DragInfo<T, K, E>>();
  const dragToInfo = useRef<IUseDragAndDrop.DragInfo<T, K, E>>();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isRealDragging, setIsRealDragging] = useState<boolean>(false);

  const [lists, setLists] = useState<Map<E, IUseDragAndDrop.List<T, K>>>(new Map());

  const body = useBody();
  
  const isMobile = useCallback(() => {
    return /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
  }, []);

  const getElementAbsoluteXY = useCallback((_element: HTMLElement | null | undefined) => {
    const scrollTop = window.scrollY;
    const scrollLeft = window.scrollX;
    const rect = _element?.getBoundingClientRect();
    return [scrollLeft + (rect?.left ?? 0), scrollTop + (rect?.top ?? 0)];
  }, []);

  const getEventCursorAbsoluteXY = useCallback((event: MouseEvent | TouchEvent) => {
    return [event instanceof MouseEvent ? event.pageX : event.touches[0].pageX, event instanceof MouseEvent ? event.pageY : event.touches[0].pageY];
  }, []);

  const getDragFirstStartFromInfo = useCallback((event: PointerEvent) => {
    if (lists === undefined) return;
    const element = event.target as (HTMLElement | null | undefined);
    let currentElement = element;
    for (let i = 0; i < 20; i++) {
      let targetKey: E | undefined;

      const [_, findTarget] = Array.from(lists.entries()).find(x => {
        const [key, value] = x;
        targetKey = key;
        return value.ref.current === currentElement;
      }) ?? [];

      if (findTarget !== undefined) {
        return {
          name: targetKey,
          info: findTarget,
        };
      }
      currentElement = currentElement?.parentElement;
    }
    return undefined;
  }, [lists]);

  const isDnDHandler = useCallback((event: PointerEvent) => {
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

  const isDnDHandlerThisGroup = useCallback((event: PointerEvent) => {
    if (lists === undefined) return false;
    const element = event.target as HTMLElement | null | undefined;
    let currentElement = element;

    const values = Array.from(lists.values());
    for (let i = 0; i < 20; i++) {
      for (const list of values) {
        if (list.ref.current === currentElement) {
          return true;
        }
      }
      currentElement = currentElement?.parentElement;
    }
    return false;
  }, [lists]);

  const getCursorElements = useCallback((event: MouseEvent | TouchEvent) => {
    const [x, y] = [event instanceof MouseEvent ? event.clientX : event.touches[0].clientX, event instanceof MouseEvent ? event.clientY : event.touches[0].clientY];
    return document.elementsFromPoint(x, y) as (HTMLElement[] | null | undefined);
  }, []);

  const isDragTargetThisRef = useCallback((ref: RefObject<K>, event: MouseEvent | TouchEvent) => {
    const cursorElements = getCursorElements(event);
    for (const element of cursorElements ?? []) {
      if (element === ref.current) {
        return true;
      }
    }
    return false;
  }, [getCursorElements]);

  const getRefAbsolutePointRange = useCallback((ref: RefObject<K>) => {
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

  const setDragFromInfo = useCallback((dragInfo?: IUseDragAndDrop.DragInfo<T, K, E>) => {
    dragFromInfo.current = dragInfo;
  }, []);

  const getDragToInfo = useCallback(() => {
    return dragToInfo.current;
  }, []);

  const setDragToInfo = useCallback((dragInfo?: IUseDragAndDrop.DragInfo<T, K, E>) => {
    dragToInfo.current = dragInfo;
  }, []);

  const isSameFromDragRefEqualThisRef = useCallback((ref: RefObject<K>) => {
    const dragFromInfo = getDragFromInfo();
    return dragFromInfo?.ref.current === ref.current;
  }, [getDragFromInfo]);

  const getItemElement = useCallback((ref: RefObject<HTMLElement> | undefined, event: PointerEvent) => {
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

  const getDragDestinationTargetIndexInfo = useCallback((ref: RefObject<K>, event: MouseEvent | TouchEvent) => {
    const dragFromInfo = getDragFromInfo();
    const [refAbsoluteX, refAbsoluteY] = getElementAbsoluteXY(ref.current);
    const [cursorX, cursorY] = [
      (event instanceof MouseEvent ? event.pageX : event.touches[0].pageX) - (dragFromInfo?.offsetX ?? 0), 
      (event instanceof MouseEvent ? event.pageY : event.touches[0].pageY) - (dragFromInfo?.offsetY ?? 0),
    ];
    console.log({ cursorX, cursorY });
    
    const fromItemHeight = (dragFromInfo?.targetItemElementRect?.height ?? 0);
    const fromItemWidth = (dragFromInfo?.targetItemElementRect?.width ?? 0);
    const itemTotalCount = (ref.current?.childElementCount ?? 0) + 1;

    const [_, target] = Array.from(lists.entries()).find(x => {
      const [key, value] = x;
      return value.ref === ref;
    }) ?? [];

    const layoutType = target?.listLayout.type;
    const fixedColCount = target?.listLayout.fixedColCount ?? 0;
    const fixedRowCount = target?.listLayout.fixedRowCount ?? 0;

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
  }, [getDragFromInfo, getElementAbsoluteXY, lists]);

  const onPressStart = useCallback((event: PointerEvent) => {
    if (!isDnDHandler(event)) return;
    if (!isDnDHandlerThisGroup(event)) return;
  
    const dragFirstStartFromInfo = getDragFirstStartFromInfo(event);
    const itemElement = getItemElement(dragFirstStartFromInfo?.info.ref, event);
    const index = getElementIndex(itemElement?.parentElement, itemElement);

    if (isMobile()) {
      body.denyScroll();
      body.denyTextDrag();
    }

    const dragInfo: IUseDragAndDrop.DragInfo<T, K, E> =  {
      name: dragFirstStartFromInfo?.name,
      item: dragFirstStartFromInfo?.info.items?.at(index),
      targetIndex: index,
      targetItemElement: itemElement,
      targetItemElementRect: itemElement?.getBoundingClientRect(),
      ref: dragFirstStartFromInfo?.info.ref ?? createRef(),
      clientX: event.clientX,
      clientY: event.clientY,
      pageX: event.pageX,
      pageY: event.pageY,
      offsetX: event.offsetX,
      offsetY: event.offsetY,
    };

    setIsDragging(true);
    setDragFromInfo(dragInfo);
    setDragToInfo({
      ...dragInfo,
      targetItemElement: null,
      targetItemElementRect: undefined,
      ref: dragFirstStartFromInfo?.info.ref ?? createRef(),
    });

    Array.from(lists.entries()).forEach(([key, value]) => {
      const item = value;
      if (item.ref.current === null) return;
      if (item.ref === dragFirstStartFromInfo?.info.ref) {
        let currentElement: HTMLElement | null | undefined = item.ref.current;
        for (let i = 0; i < 2; i++) {
          if (currentElement !== null && currentElement !== undefined) {
            currentElement.style.zIndex = '2';  
          }
          currentElement = currentElement?.parentElement;
        }
        return;
      };
      item.ref.current.style.zIndex = '1';
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
  }, [body, getDragFirstStartFromInfo, getElementIndex, getItemElement, isDnDHandler, isDnDHandlerThisGroup, isMobile, lists, onStartDrag, setDragFromInfo, setDragToInfo]);

  const onMovingTargetRef = useCallback((key: E | undefined, target: IUseDragAndDrop.List<T, K> | undefined, event: MouseEvent | TouchEvent) => {
    if (target === undefined) return;

    const ref = target.ref;

    if (!isDragging) return;
    if (!isDragTargetThisRef(ref, event)) {
      for (let i = 0; i < (ref.current?.children.length ?? 0); i++) {
        (ref.current?.children[i] as HTMLElement).style.removeProperty('transform');
      }
      return;
    }

    setIsRealDragging(true);

    if (typeof onDestinationActiveListName === 'function') {
      onDestinationActiveListName(key);  
    }

    const dragDestinationTargetIndexInfo = getDragDestinationTargetIndexInfo(ref, event);
    const dragFromInfo = getDragFromInfo();
    
    const destinationIndex = dragDestinationTargetIndexInfo?.index ?? 0;
    const dragStartIndex = dragFromInfo?.targetIndex ?? 0;

    setDragToInfo({
      name: key,
      item: target?.items?.at(destinationIndex),
      targetIndex: destinationIndex,
      targetItemElement: null,
      targetItemElementRect: undefined,
      ref: target.ref,
      clientX: event instanceof MouseEvent ? event.clientX : event.touches[0].clientX,
      clientY: event instanceof MouseEvent ? event.clientY : event.touches[0].clientY,
      pageX: event instanceof MouseEvent ? event.pageX : event.touches[0].pageX,
      pageY: event instanceof MouseEvent ? event.pageY : event.touches[0].pageY,
      offsetX: 0,
      offsetY: 0,
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
  }, [getDragDestinationTargetIndexInfo, getDragFromInfo, isDragTargetThisRef, isDragging, isSameFromDragRefEqualThisRef, onDestinationActiveListName, setDragToInfo]);

  const onDragging = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    if (lists === undefined) return;

    const dragFromInfo = getDragFromInfo();

    const diffX = ((event instanceof MouseEvent) ? event.pageX : event.touches[0].pageX) - (dragFromInfo?.pageX ?? 0);
    const diffY = ((event instanceof MouseEvent) ? event.pageY : event.touches[0].pageY) - (dragFromInfo?.pageY ?? 0);

    const targetItemElement = dragFromInfo?.targetItemElement;
    if (targetItemElement !== undefined && targetItemElement !== null) {
      targetItemElement.style.transform = `translateX(${diffX}px) translateY(${diffY}px)`;
    }

    const [key, target] = Array.from(lists.entries()).find(([k, v]) => {
      const refRange = getRefAbsolutePointRange(v.ref);
      const cursorPoint = getEventCursorAbsoluteXY(event);
      const isInclude = isIncludePointRangeTargetCursor(refRange.start, refRange.end, cursorPoint);
      return isInclude;
    }) ?? [undefined , undefined];

    onMovingTargetRef(key, target, event);
  }, [getDragFromInfo, getEventCursorAbsoluteXY, getRefAbsolutePointRange, isDragging, isIncludePointRangeTargetCursor, lists, onMovingTargetRef]);

  const onPressEnd = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    if (lists === undefined) return;

    Array.from(lists.entries()).forEach(([k, v]) => {
      const item = v;
      let currentElement: HTMLElement | null | undefined = item.ref.current;
      for (let i = 0; i < 2; i++) {
        if (currentElement !== null && currentElement !== undefined) {
          currentElement.style.removeProperty('z-index');
        }
        currentElement = currentElement?.parentElement;
      }

      const children = v.ref.current?.children;
      if (children === undefined) return;
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        child.style.removeProperty('transform');
      }
    });

    const dragFromInfo = getDragFromInfo();
    const dragToInfo = getDragToInfo();

    const destinationList = dragToInfo?.name === undefined ? [] : lists?.get(dragToInfo?.name)?.items ?? [];
    const copyDestinationList = [ ...destinationList ];
    
    const changeInfo = new Map<E, T[]>();
    
    if (dragFromInfo?.name !== dragToInfo?.name) {
      if (dragFromInfo?.item !== undefined && dragToInfo?.name !== undefined && dragFromInfo?.name) {
        copyDestinationList.splice(dragToInfo?.targetIndex ?? 0, 0, dragFromInfo.item);
        changeInfo.set(dragToInfo?.name, copyDestinationList);
        changeInfo.set(dragFromInfo?.name, lists?.get(dragFromInfo?.name)?.items?.filter((_, index) => index !== (dragFromInfo?.targetIndex ?? -1)) ?? []);
      }
    } else {
      if (dragFromInfo?.item !== undefined && dragFromInfo?.name !== undefined) {
        copyDestinationList.splice(dragFromInfo?.targetIndex ?? 0, 1);
        copyDestinationList.splice(dragToInfo?.targetIndex ?? 0, 0, dragFromInfo.item);
        changeInfo.set(dragFromInfo?.name, copyDestinationList);
      }
    }

    const children = dragFromInfo?.ref.current?.children ?? [];
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement; 
      child.style.removeProperty('z-index');
    }

    if (typeof onListsChange === 'function') {
      onListsChange(changeInfo);
    }
    setLists(prev => {
      const newLists = new Map(prev);

      if (typeof dragFromInfo?.name === 'string') {
        const fromList = prev.get(dragFromInfo?.name);
        if (fromList !== undefined) {
          // newLists[dragFromInfo.name].items = changeInfo.get(dragFromInfo.name) ?? []; 
          fromList.items = changeInfo.get(dragFromInfo.name) ?? [];
          newLists.set(dragFromInfo?.name, fromList);
        }
      }
      if (typeof dragToInfo?.name === 'string') {
        const toList = prev.get(dragToInfo?.name);
        if (toList !== undefined) {
          // newLists[dragToInfo.name].items = changeInfo.get(dragToInfo.name) ?? [];
          toList.items = changeInfo.get(dragToInfo.name) ?? [];
          newLists.set(dragToInfo?.name, toList);
        }
      }
      return newLists;
    });

    setIsDragging(false);

    if (isMobile()) {
      body.allowScroll();
      body.allowTextDrag();
    }

    if (typeof onEndDrag === 'function') {
      onEndDrag(dragFromInfo, dragToInfo);
    }
  }, [body, getDragFromInfo, getDragToInfo, isDragging, isMobile, lists, onEndDrag, onListsChange]);

  const getList = useCallback((key: E) => {
    if (lists === undefined) return undefined;
    return lists.get(key);
  }, [lists]);

  const setItems = useCallback((key: E, items: T[]) => {
    setLists(prev => {
      const newLists = new Map(prev);
      const keyList = prev.get(key);
      if (keyList === undefined) {
        return newLists;
      }
      keyList.items = items;
      newLists.set(key, keyList);
      return newLists;
    });
  }, []);

  useAddEventListener({
    targetElementRef: { current: typeof window !== 'undefined' ? window : null },
    eventName: 'pointerdown',
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

  useEffect(() => {
    if (props.lists === undefined) return;
    setLists(new Map(props.lists));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isDragging === false) {
      setIsRealDragging(false);
    }
  }, [isDragging]);

  return {
    isDragging,
    isRealDragging,
    getList,
    setItems,
  };
}