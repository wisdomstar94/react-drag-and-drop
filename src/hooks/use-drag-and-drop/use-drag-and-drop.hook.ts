import { useEffect, useRef } from "react";
import { IUseDragAndDrop } from "./use-drag-and-drop.interface";

export function useDragAndDrop<T>(props: IUseDragAndDrop.Props<T>) {
  const {
    name,
    list,
    gridColCount,
    controller,
  } = props;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    controller.pushList({
      name,
      list,
      ref,
      gridColCount,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  return {
    ref,
  };
}