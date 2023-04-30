import { RefObject } from "react";
import { IUseDragAndDrop } from "../use-drag-and-drop/use-drag-and-drop.interface";

export declare namespace IUseDragAndDropController {
  // export type ListDirection = 'vertical' | 'horizontal';

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
    listLayout: IUseDragAndDrop.ListLayout;
    ref: RefObject<HTMLDivElement>;
  }

  // export interface ListMapValue<T = any> {
  //   list: T[];
  //   ref: RefObject<HTMLDivElement>;
  // }

  export interface Controller<T = any> {
    getDragFromInfo: () => (DragInfo | undefined);
    getDragToInfo: () => (DragInfo | undefined);

    setDragFromInfo: (dragInfo?: DragInfo) => void;
    setDragToInfo: (dragInfo?: DragInfo) => void;

    getEventClientX: (event: MouseEvent | TouchEvent) => number;
    getEventClientY: (event: MouseEvent | TouchEvent) => number;
    getEventPageX: (event: MouseEvent | TouchEvent) => number;
    getEventPageY: (event: MouseEvent | TouchEvent) => number;
    isDragTargetThisRef: (ref: RefObject<HTMLDivElement>, event: MouseEvent | TouchEvent) => boolean;

    pushList: (info: PushListInfo) => void;
    isDragging: boolean;
    setIsDragging: (v: boolean) => void;
    finallyCalculateItems: () => void;
  }

  export interface Props<T = any> {
    onListsChange: (map: Map<string, T[]>) => void;
  }
}