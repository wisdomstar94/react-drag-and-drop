import { RefObject, createRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IUseDragAndDrop } from "./use-drag-and-drop.interface";
import styles from './use-drag-and-drop.module.css';
import { useBody } from "@wisdomstar94/react-body";
import { useAddEventListener } from "@wisdomstar94/react-add-event-listener";

const TRANSITION_DURATION = 300; // use-drag-and-drop.module.css 내용에 맞춰주세요.
const DATA_IS_DND_LIST = `data-is-dnd-list`;
const DATA_IS_DND_HANDLER = `data-is-dnd-handler`;

export function useDragAndDrop<
  T, 
  K extends HTMLElement, 
  E extends string,
>(
  props: IUseDragAndDrop.Props<T, K, E>
) {
  const {
    dndTitle,
    onListsChange,
    onDestinationActiveListName,
    onStartDrag,
    onEndDrag,
  } = props;

  const draggingItemClassName = useMemo<string>(() => props.draggingItemClassName ?? '', [props.draggingItemClassName]);
  const draggingNotFormListClassName = useMemo<string>(() => props.draggingNotFormListClassName ?? '', [props.draggingNotFormListClassName]);
  const draggingFormListClassName = useMemo<string>(() => props.draggingFormListClassName ?? '', [props.draggingFormListClassName]);

  const dragFromInfo = useRef<IUseDragAndDrop.DragInfo<T, K, E>>();
  const dragToInfo = useRef<IUseDragAndDrop.DragInfo<T, K, E>>();
  const [isInit, setIsInit] = useState<boolean>(false);
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const isFinalTransitioning = useRef<boolean>(false);

  // const [lists, setLists] = useState<Map<E, IUseDragAndDrop.List<T, K>>>(new Map());
  // const lists = useMemo(() => {
  //   return new Map(props.lists);
  // }, [props.lists]);
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

    let isDndHandlerExist = false;
    let isListExist = false;
    let firstFindedListRefElement: HTMLElement | null = null;

    for (let i = 0; i < 30; i++) {
      // console.log('@currentElement', currentElement);
      if (currentElement?.getAttribute(DATA_IS_DND_HANDLER) === 'true') {
        isDndHandlerExist = true;
      }
      if (currentElement?.getAttribute(DATA_IS_DND_LIST) === 'true') {
        firstFindedListRefElement = currentElement;
        isListExist = true;
        break;
      }
      currentElement = currentElement?.parentElement;
    }

    if (isDndHandlerExist === false) return false;
    if (isListExist === false) return false;
    if (!Array.from(lists.values()).some((x) => x.ref.current === firstFindedListRefElement)) return false;

    return true;
  }, [lists]);

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

  const getList = useCallback((key: E) => {
    if (props.lists === undefined) return undefined;
    const listsMap = new Map(props.lists);
    return listsMap.get(key);
  }, [props.lists]);

  const getLists = useCallback(() => {
    return new Map(props.lists);
  }, [props.lists]);

  // const setItems = useCallback((key: E, items: T[]) => {
  //   setLists(prev => {
  //     const newLists = new Map(prev);
  //     const keyList = prev.get(key);
  //     if (keyList === undefined) {
  //       return newLists;
  //     }
  //     keyList.items = items;
  //     newLists.set(key, keyList);
  //     return newLists;
  //   });
  // }, []);

  const isDraggingNotFrom = useCallback((name: E) => {
    return isPressing && isDragging && getList(name)?.isDragFrom !== true;
  }, [getList, isDragging, isPressing]);

  const isDraggingFrom = useCallback((name: E) => {
    if (getList(name)?.isDragFrom === undefined) return false;
    return isPressing && isDragging && getList(name)?.isDragFrom === true;
  }, [getList, isDragging, isPressing]);

  const getListLayout = useCallback((name: E) => {
    const list = getList(name);
    return list?.listLayout;
  }, [getList]);

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
    // const [cursorX, cursorY] = [
    //   (event instanceof MouseEvent ? event.pageX : event.touches[0].pageX) - (dragFromInfo?.offsetX ?? 0), 
    //   (event instanceof MouseEvent ? event.pageY : event.touches[0].pageY) - (dragFromInfo?.offsetY ?? 0),
    // ];
    const [cursorX, cursorY] = [
      (event instanceof MouseEvent ? event.pageX : event.touches[0].pageX),
      (event instanceof MouseEvent ? event.pageY : event.touches[0].pageY),
    ];
    
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
    if (isFinalTransitioning.current) return;
  
    const dragFirstStartFromInfo = getDragFirstStartFromInfo(event);
    const itemElement = getItemElement(dragFirstStartFromInfo?.info.ref, event);
    const index = getElementIndex(itemElement?.parentElement, itemElement);

    if (isMobile()) {
      body.denyScroll();
      body.denyTextDrag();
    } else {
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

    if (dragInfo.name !== undefined) {
      const name = dragInfo.name;
      setLists(prev => {
        const newLists = new Map(prev);
        const targetList = newLists.get(name);
        if (targetList !== undefined) {
          targetList.isDragFrom = true;
          newLists.set(name, targetList);
        }
        return newLists;
      });
    }

    // if (dragInfo.targetItemElement !== undefined && dragInfo.targetItemElement !== null) {
    //   dragInfo.targetItemElement.style.transitionDelay = '0ms';
    // }

    setIsPressing(true);
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
      for (let i = 0; i < item.ref.current.children.length; i++) {
        const child = item.ref.current.children[i] as HTMLElement;
        if (child !== dragInfo.targetItemElement) {
          child.classList.add(styles['item-transition']);
        } else {
          child.classList.remove(styles['item-transition']);
        }
      }
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

  const prevRef = useRef<K | undefined | null>(undefined);

  const getCurrentCursorRefInfo = useCallback((event: MouseEvent | TouchEvent) => {
    const x = event instanceof MouseEvent ? event.pageX : event.touches[0].pageX;
    const y = event instanceof MouseEvent ? event.pageY : event.touches[0].pageY;

    const elements = document.elementsFromPoint(x, y) as HTMLElement[];
    let targetRefList: IUseDragAndDrop.List<T, K> | undefined;
  
    for (const element of elements) {
      for (const [v, k] of Array.from(lists.entries())) {
        if (k.ref.current === element) {
          targetRefList = k;
          break;
        }
      }
    }
    
    const result = {
      targetRefList,
      isChanged: prevRef.current !== targetRefList,
    };

    prevRef.current = targetRefList?.ref.current;
    return result;
  }, [lists]);

  const onMovingTargetRef = useCallback((key: E | undefined, target: IUseDragAndDrop.List<T, K> | undefined, event: MouseEvent | TouchEvent) => {
    const currentCursorRefInfo = getCurrentCursorRefInfo(event);

    let isAlreadySetDragToInfo = false;
    
    if (currentCursorRefInfo.isChanged) {
      if (currentCursorRefInfo.targetRefList !== undefined) {
        const dragDestinationTargetIndexInfo = getDragDestinationTargetIndexInfo(currentCursorRefInfo.targetRefList.ref, event);
        const destinationIndex = (dragDestinationTargetIndexInfo?.index ?? 0);
        const dragToInfo: IUseDragAndDrop.DragInfo<T, K, E> = {
          name: key,
          item: currentCursorRefInfo.targetRefList.items.at(destinationIndex),
          targetIndex: destinationIndex,
          targetItemElement: null,
          targetItemElementRect: undefined,
          ref: currentCursorRefInfo.targetRefList.ref,
          clientX: event instanceof MouseEvent ? event.clientX : event.touches[0].clientX,
          clientY: event instanceof MouseEvent ? event.clientY : event.touches[0].clientY,
          pageX: event instanceof MouseEvent ? event.pageX : event.touches[0].pageX,
          pageY: event instanceof MouseEvent ? event.pageY : event.touches[0].pageY,
          offsetX: 0,
          offsetY: 0,
        };
        setDragToInfo(dragToInfo);
        isAlreadySetDragToInfo = true;
      }

      const dragFromInfo = getDragFromInfo();
      const dragToInfo = getDragToInfo();

      lists.forEach((_, name) => {
        if (dragFromInfo?.name !== dragToInfo?.name) {
          if (dragToInfo?.name === name && currentCursorRefInfo.targetRefList !== undefined) {
            return;
          }
        }
        if (dragFromInfo === undefined) return;
        if (dragFromInfo.name === dragToInfo?.name) return;
        const listLayout = getListLayout(name);
        const thisRef = getList(name)?.ref;
        const dragDestinationTargetIndexInfo = getDragDestinationTargetIndexInfo(thisRef!, event);
        switch (listLayout?.type) {
          case 'one-col-infinite': {
            const height = thisRef?.current?.firstElementChild?.getBoundingClientRect().height ?? 0;
            const children = thisRef?.current?.children ?? [];
            for (let i = 0; i < children.length; i++) {
              const child = children[i] as HTMLElement;
              if (child === dragFromInfo?.targetItemElement) continue;
              const destinationIndex = 9999999999;
              if (thisRef === dragFromInfo?.ref) {
                if (destinationIndex < dragFromInfo.targetIndex) {
                  if (i >= destinationIndex && i <= dragFromInfo.targetIndex) {
                    child.style.transform = `translateY(${height}px)`;
                  } else {
                    child.style.transform = `translateY(0px)`;
                  }
                } else {
                  if (i >= dragFromInfo.targetIndex && i <= destinationIndex) {
                    child.style.transform = `translateY(-${height}px)`;
                  } else {
                    child.style.transform = `translateY(0px)`;
                  }
                }
              } else {
                child.style.transform = `translateY(0px)`;
              }
            }
          } break;
          case 'one-row-infinite': {
            const width = getDragFromInfo()?.targetItemElementRect?.width ?? 0;
            const children = thisRef?.current?.children ?? [];
            for (let i = 0; i < children.length; i++) {
              const child = children[i] as HTMLElement;
              if (child === dragFromInfo?.targetItemElement) continue;
              const destinationIndex = 9999999999;
              if (thisRef === dragFromInfo?.ref) {
                if (destinationIndex < dragFromInfo.targetIndex) {
                  if (i >= destinationIndex && i <= dragFromInfo.targetIndex) {
                    child.style.transform = `translateX(${width}px)`;
                  } else {
                    child.style.transform = `translateX(0px)`;
                  }
                } else {
                  if (i >= dragFromInfo.targetIndex && i <= destinationIndex) {
                    child.style.transform = `translateX(-${width}px)`;
                  } else {
                    child.style.transform = `translateX(0px)`;
                  }
                }
              } else {
                child.style.transform = `translateX(0px)`;
              }
            }
          } break;
          case 'fixed-col-count-grid': {
            const children = thisRef?.current?.children ?? [];
            for (let i = 0; i < children.length; i++) {
              const child = children[i] as HTMLElement;
              if (child === dragFromInfo?.targetItemElement) continue;
              const destinationIndex = 9999999999;
              if (thisRef === dragFromInfo?.ref) {
                if (destinationIndex < dragFromInfo.targetIndex) {
                  if (i >= destinationIndex && i <= dragFromInfo.targetIndex) {
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
                    child.style.transform = `translateX(0px) translateY(0px)`;
                  }
                } else {
                  if (i >= dragFromInfo.targetIndex && i <= destinationIndex) {
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
                    child.style.transform = `translateX(0px) translateY(0px)`;
                  }
                }
              } else {
                child.style.transform = `translateX(0px) translateY(0px)`;
              }
            }
          } break;
        }
      });
    }

    let isHandling = false;
    if (target === undefined) {
      const name = getDragFromInfo()?.name;
      if (name === undefined) return;
      key = name;
      target = getList(name);
      isHandling = true;
      if (target === undefined) {
        return;
      }
    }

    const ref = target?.ref;
    if (ref === undefined) return;

    if (!isPressing) return;
    if (!isDragTargetThisRef(ref, event) && !isHandling) {
      for (let i = 0; i < (ref.current?.children.length ?? 0); i++) {
        (ref.current?.children[i] as HTMLElement).style.removeProperty('transform');
      }
      return;
    }

    setIsDragging(true);

    if (typeof onDestinationActiveListName === 'function') {
      onDestinationActiveListName(key);  
    }

    const dragDestinationTargetIndexInfo = getDragDestinationTargetIndexInfo(ref, event);
    const dragFromInfo = getDragFromInfo();
    
    // console.log('@isHandling', isHandling);

    const destinationIndex = isHandling ? (dragFromInfo?.targetIndex ?? 0) : (dragDestinationTargetIndexInfo?.index ?? 0);
    const dragStartIndex = dragFromInfo?.targetIndex ?? 0;

    const dragToInfo: IUseDragAndDrop.DragInfo<T, K, E> = {
      name: key,
      item: target?.items?.at(destinationIndex),
      targetIndex: destinationIndex,
      targetItemElement: null,
      targetItemElementRect: undefined,
      ref,
      clientX: event instanceof MouseEvent ? event.clientX : event.touches[0].clientX,
      clientY: event instanceof MouseEvent ? event.clientY : event.touches[0].clientY,
      pageX: event instanceof MouseEvent ? event.pageX : event.touches[0].pageX,
      pageY: event instanceof MouseEvent ? event.pageY : event.touches[0].pageY,
      offsetX: 0,
      offsetY: 0,
    };
    // if (isAlreadySetDragToInfo === false) {
    setDragToInfo(dragToInfo);
    // }

    if (dragToInfo.name !== undefined && dragFromInfo?.name !== dragToInfo.name) {
      const name = dragToInfo.name;
      setLists(prev => {
        const prevLists =new Map(prev); 
        const newLists = new Map(prev);
        prevLists.forEach((value, key) => {
          if (key === dragFromInfo?.name) {
            newLists.set(key, value);
            return;
          }
          value.isDragTo = key === name;
          newLists.set(key, value);
          return;
        });
        return newLists;
      });
    }

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
  }, [getCurrentCursorRefInfo, getDragDestinationTargetIndexInfo, getDragFromInfo, getDragToInfo, getList, getListLayout, isDragTargetThisRef, isPressing, isSameFromDragRefEqualThisRef, lists, onDestinationActiveListName, setDragToInfo]);

  const onDragging = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isPressing) return;
    if (lists === undefined) return;

    const dragFromInfo = getDragFromInfo();
    if (dragFromInfo !== undefined) {
      const [x, y] = getElementAbsoluteXY(dragFromInfo.targetItemElement);
      setDragFromInfo({
        ...dragFromInfo,
        latestAbsoluteX: x,
        latestAbsoluteY: y,
      });
    }
    
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
  }, [getDragFromInfo, getElementAbsoluteXY, getEventCursorAbsoluteXY, getRefAbsolutePointRange, isIncludePointRangeTargetCursor, isPressing, lists, onMovingTargetRef, setDragFromInfo]);

  const onPressEnd = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isPressing) return;
    if (lists === undefined) return;
    // console.log('@event', event);

    // console.log('@prev', lists.get('aList')?.items);

    const dragFromInfo = getDragFromInfo();
    const dragToInfo = getDragToInfo();

    // console.log('!dragFromInfo?.ref.current', dragFromInfo?.ref.current);

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

    const prev = lists;
    const getNewLists = () => {
      const prevLists = new Map(prev); 
      const newLists = new Map(prev);
      prevLists.forEach((value, key) => {
        const newValue = { ...value };
        newValue.isDragFrom = undefined;
        newValue.isDragTo = undefined;

        if (key === dragFromInfo?.name) {
          newValue.items = changeInfo.get(dragFromInfo.name) ?? [];
        }

        if (key === dragToInfo?.name) {
          newValue.items = changeInfo.get(dragToInfo.name) ?? [];
        }

        newLists.set(key, newValue);
      });
      return newLists;
    };
    const newLists = getNewLists();

    setIsPressing(false);

    if (isMobile()) {
      body.allowScroll();
      body.allowTextDrag();
    } else {
      body.allowTextDrag();
    }

    if (typeof onEndDrag === 'function') {
      onEndDrag(dragFromInfo, dragToInfo, Array.from(newLists.entries()));
    }
  }, [isPressing, lists, getDragFromInfo, getDragToInfo, onListsChange, isMobile, onEndDrag, body]);

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'pointerdown',
      eventListener: onPressStart,  
    },
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'mousemove',
      eventListener: onDragging,
    }
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'touchmove',
      eventListener: onDragging,
    }
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'mouseup',
      eventListener: onPressEnd,
    }
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'touchend',
      eventListener: onPressEnd,
    }
  });

  useEffect(() => {
    if (props.lists === undefined) return;
    setLists(new Map(props.lists));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.lists]);

  useEffect(() => {
    if (lists.size > 0) {
      setIsInit(true);
    }
  }, [lists]);

  useEffect(() => {
    const dragFromInfo = getDragFromInfo();
    const fromItemElement = dragFromInfo?.targetItemElement;
    const draggingItemClassNames = draggingItemClassName.split(' ');
    draggingItemClassNames.forEach((className) => {
      if (className.trim() === '') return;
      if (isDragging) {
        fromItemElement?.firstElementChild?.classList.add(className);
      } else {
        fromItemElement?.firstElementChild?.classList.remove(className);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  useEffect(() => {
    if (isPressing === false) {
      setIsDragging(false);
      const dragFromInfo = getDragFromInfo();
      lists.forEach((value, key) => {
        const children = value.ref.current?.children;
        if (children !== undefined) {
          for (let i = 0; i < children.length; i++) {
            const child = children[i] as HTMLElement;
            if (child !== dragFromInfo?.targetItemElement) {
              child.classList.remove(styles['item-transition']);
            }
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPressing]);

  useEffect(() => {
    if (isPressing) return;
    if (!isDragging) return;
    if (isFinalTransitioning.current) return;
    const dragFromInfo = getDragFromInfo();
    const dragToInfo = getDragToInfo();

    // console.log('@dragFromInfo', dragFromInfo);
    // console.log('@dragToInfo', dragToInfo);

    if (dragFromInfo === undefined) return;
    if (dragToInfo === undefined) return;

    const lists = new Map(props.lists);

    // console.log('@lists 에 대한 useEffect 호출됨.', performance.now());

    const moveBeforeDot = [dragFromInfo.latestAbsoluteX ?? 0, dragFromInfo.latestAbsoluteY ?? 0];

    const dragToRefChildren = dragToInfo.ref.current?.children ?? [];
    const dragToTargetIndex = dragToRefChildren.length - 1 < dragToInfo.targetIndex ? dragToRefChildren.length - 1 : dragToInfo.targetIndex;

    const child = dragToRefChildren[dragToTargetIndex] as HTMLElement;
    const moveAfterDot = getElementAbsoluteXY(child);
    const diff = [moveBeforeDot[0] - moveAfterDot[0], moveBeforeDot[1] - moveAfterDot[1]];
    
    isFinalTransitioning.current = true;
    child.style.zIndex = '2';

    const firstTransform = `translateX(${diff[0]}px) translateY(${diff[1]}px)`;
    child.style.transform = firstTransform;
    // console.log('1) firstTransform', firstTransform);

    setTimeout(() => {
      child.classList.add(styles['item-transition']);
      // console.log('2) item-transition 클래스 추가');
    }, 20);
    setTimeout(() => {
      child.style.transform = `translateX(0px) translateY(0px)`;
      // console.log('3) secondTransform', `translateX(0px) translateY(0px)`);
    }, 40);
    setTimeout(() => {
      // console.log('4) finally');
      const draggingFormListClassNames = draggingFormListClassName.split(' ');
      const draggingNotFormListClassNames = draggingNotFormListClassName.split(' ');
      lists.forEach((value, name) => {
        if (isDraggingFrom(name)) {
          draggingFormListClassNames.filter(c => c.trim() !== '').forEach(c => value.ref.current?.classList.add(c));
        } else if (isDraggingNotFrom(name)) {
          draggingNotFormListClassNames.filter(c => c.trim() !== '').forEach(c => value.ref.current?.classList.add(c));
        } else {
          draggingFormListClassNames.filter(c => c.trim() !== '').forEach(c => value.ref.current?.classList.remove(c));
          draggingNotFormListClassNames.filter(c => c.trim() !== '').forEach(c => value.ref.current?.classList.remove(c));
        }
      });
      isFinalTransitioning.current = false;
      child.style.zIndex = '1';
    }, TRANSITION_DURATION + 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.lists]);

  return {
    isInit,
    isPressing,
    isDragging,
    isDraggingNotFrom,
    isDraggingFrom,
    getList,
    getLists,
    // setItems,
  };
}