import { RefObject } from "react";

export declare namespace IUseDragAndDropController {
  export type ListDirection = 'vertical' | 'horizontal';

  export interface DragInfo<T = any> {
    name: string;
    item: T;
    targetIndex: number;
    targetItemElement: HTMLElement | null | undefined;
    targetItemElementRect?: DOMRect;
    ref: RefObject<HTMLDivElement>;
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
  }

  export interface PushListInfo<T = any> {
    name: string;
    list?: T[];
    ref: RefObject<HTMLDivElement>;
  }

  export interface Controller<T = any> {
    getDragFromInfo: () => (DragInfo | undefined);
    getDragToInfo: () => (DragInfo | undefined);

    setDragFromInfo: (dragInfo?: DragInfo) => void;
    setDragToInfo: (dragInfo?: DragInfo) => void;

    pushList: (info: PushListInfo) => void;
    isDragging: boolean;
    setIsDragging: (v: boolean) => void;
    finallyCalculateItems: () => void;
  }

  export interface Props<T = any> {
    listDirection: ListDirection;
    onListsChange: (map: Map<string, T[]>) => void;
  }
}