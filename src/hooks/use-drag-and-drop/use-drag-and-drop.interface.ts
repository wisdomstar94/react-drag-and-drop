import { IUseDragAndDropController } from "../use-drag-and-drop-controller/use-drag-and-drop-controller.interface";

export declare namespace IUseDragAndDrop {
  export interface Props<T> {
    name: string;
    list?: T[];
    controller: IUseDragAndDropController.Controller;
  }
}