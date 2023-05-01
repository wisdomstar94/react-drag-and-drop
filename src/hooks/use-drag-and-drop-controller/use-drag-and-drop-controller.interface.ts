import { RefObject } from "react";
import { IUseDragAndDrop } from "../use-drag-and-drop/use-drag-and-drop.interface";

export declare namespace IUseDragAndDropController {
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
    offsetX: number;
    offsetY: number;
  }

  export interface PushListInfo<T = any> {
    name: string;
    list?: T[];
    listLayout: IUseDragAndDrop.ListLayout;
    ref: RefObject<HTMLDivElement>;
  }

  export interface Controller<T = any> {
    pushList: (info: PushListInfo) => void;
    isDragging: boolean;
  }

  export interface Props<T = any> {
    onListsChange: (map: Map<string, T[]>) => void;
    onDestinationActiveListName?: (name: string) => void;
    onStartDrag?: (dragFromInfo: DragInfo) => void;
    onEndDrag?: (dragFromInfo?: DragInfo, dragToInfo?: DragInfo) => void;
  }
}