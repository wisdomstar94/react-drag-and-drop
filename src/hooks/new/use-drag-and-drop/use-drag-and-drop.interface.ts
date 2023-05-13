import { RefObject } from "react";

export declare namespace IUseDragAndDrop {
  export type ListLayoutType = 
    'one-row-infinite' | 
    'one-col-infinite' | 
    'fixed-col-count-grid' | 
    // 'fixed-row-count-grid' // 해당 하는 경우는 없을 것으로 예상됨.
    ''
  ;

  export interface DragInfo<T = any, K extends HTMLElement = HTMLElement, Q extends Lists<T, K> = Lists<T, K>> {
    name: keyof Q;
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
  }

  export interface ListLayout {
    type: ListLayoutType;
    fixedColCount?: number;
    fixedRowCount?: number;
  }

  export interface List<T = any, K extends HTMLElement = HTMLElement> {
    items: T[];
    listLayout: ListLayout;
    ref: RefObject<K>;
  }

  export interface Lists<T, K extends HTMLElement> {
    [key: string]: List<T, K>;
  }

  export interface Props<T = any, K extends HTMLElement = HTMLElement, Q extends Lists<T, K> = Lists<T, K>> {
    lists: Q;
    onListsChange?: (map: Map<string, T[]>) => void;
    onDestinationActiveListName?: (name: string) => void;
    onStartDrag?: (dragFromInfo: DragInfo<T, K, Q>) => void;
    onEndDrag?: (dragFromInfo?: DragInfo<T, K, Q>, dragToInfo?: DragInfo<T, K, Q>) => void;
  }
}