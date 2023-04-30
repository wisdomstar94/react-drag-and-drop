import { IUseDragAndDropController } from "../use-drag-and-drop-controller/use-drag-and-drop-controller.interface";

export declare namespace IUseDragAndDrop {
  export type ListLayoutType = 'one-row-infinite' | 'one-col-infinite' | 'fixed-col-count-grid' | 'fixed-row-count-grid';

  export interface ListLayout {
    type: ListLayoutType;
    fixedColCount?: number;
    fixedRowCount?: number;
  }

  export interface Props<T> {
    name: string;
    list?: T[];
    // gridColCount: number;
    listLayout: ListLayout;
    controller: IUseDragAndDropController.Controller;
  }
}