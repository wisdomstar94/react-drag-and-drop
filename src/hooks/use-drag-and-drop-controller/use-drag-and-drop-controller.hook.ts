import { RefObject, useCallback, useRef, useState } from "react";
import { IUseDragAndDropController } from "./use-drag-and-drop-controller.interface";

export function useDragAndDropController<T = any>(props: IUseDragAndDropController.Props<T>): IUseDragAndDropController.Controller<T> {
  const {
    listDirection,
    onListsChange,
  } = props;
  const listMap = useRef(new Map<string, { list: T[], ref: RefObject<HTMLDivElement> }>());
  const dragFromInfo = useRef<IUseDragAndDropController.DragInfo>();
  const dragToInfo = useRef<IUseDragAndDropController.DragInfo>();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
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
    listMap.current.set(info.name, { list: info.list ?? [], ref: info.ref });
  }, []);

  const finallyCalculateItems = useCallback(() => {

  }, []);

  return {
    getDragFromInfo,
    getDragToInfo,

    setDragFromInfo,
    setDragToInfo,

    pushList,
    isDragging,
    setIsDragging,
    finallyCalculateItems,
  };
}