import { RefObject } from "react";

export declare namespace IUseDragAndDrop {
  export type ListLayoutType = 
    'one-row-infinite' | 
    'one-col-infinite' | 
    'fixed-col-count-grid' | 
    // 'fixed-row-count-grid' // 해당 하는 경우는 없을 것으로 예상되지만, 주석 처리만 해놓음.
    ''
  ;

  export interface DragInfo<T = any, K extends HTMLElement = HTMLElement, E = string> {
    name: E | undefined;
    item: T | undefined;
    targetIndex: number;
    targetItemElement: HTMLElement | null | undefined;
    targetItemElementRect?: DOMRect;
    ref: RefObject<K>;
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
    offsetX: number;
    offsetY: number;
    latestAbsoluteX?: number;
    latestAbsoluteY?: number;
  }

  export interface ListLayout {
    type: ListLayoutType;
    fixedColCount?: number;
    fixedRowCount?: number;
  }

  export interface List<T, K extends HTMLElement> {
    items: T[];
    listLayout: ListLayout;
    ref: RefObject<K>;
    isDragFrom?: boolean;
    isDragTo?: boolean;
  }

  export interface Props<T, K extends HTMLElement, E extends string> {
    lists: [E, List<T, K>][];
    draggingItemClassName?: string;
    draggingNotFormListClassName?: string;
    draggingFormListClassName?: string;
    onListsChange?: (map: Map<E, T[]>) => void;
    onDestinationActiveListName?: (name: E | undefined) => void;
    onStartDrag?: (dragFromInfo: DragInfo<T, K, E>) => void;
    onEndDrag?: (dragFromInfo?: DragInfo<T, K, E>, dragToInfo?: DragInfo<T, K, E>) => void;
  }
}