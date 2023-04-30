import { useDragAndDropController } from "@/hooks/use-drag-and-drop-controller/use-drag-and-drop-controller.hook";
import { useDragAndDrop } from "@/hooks/use-drag-and-drop/use-drag-and-drop.hook";
import { ICommon } from "@/interfaces/common.interface";
import { useState } from "react";

export default function OneRowInfiniteTestPage() {
  const [aList, setAList] = useState<ICommon.Item[] | undefined>([
    { name: 'a', value: 'a', },
    { name: 'aaa', value: 'aaa', },
    { name: 'aaaaa', value: 'aaaaa', },
    { name: 'aaaaaaa', value: 'aaaaaaa', },
  ]);

  const [bList, setBList] = useState<ICommon.Item[] | undefined>([
    { name: 'b', value: 'b', },
    { name: 'bbb', value: 'bbb', },
    { name: 'bbbbb', value: 'bbbbb', },
    { name: 'bbbbbbb', value: 'bbbbbbb', },
    // { name: '아침 해가 뜨면 2', value: '아침 해가 뜨면 2', },
    // { name: '매일 같은 사람들과 2', value: '매일 같은 사람들과 2', },
    // { name: '또 다시 하루 일을 2', value: '또 다시 하루 일을 2', },
    // { name: '시작해 2', value: '시작해 2', },
  ]);

  const dndController = useDragAndDropController<ICommon.Item>({
    onListsChange(map) {
      if (map.has('aList')) {
        setAList(map.get('aList'));
      }
      if (map.has('bList')) {
        setBList(map.get('bList'));
      }
    },
  });

  const aListDnD = useDragAndDrop({
    controller: dndController,
    name: 'aList',
    list: aList,
    listLayout: {
      type: 'one-row-infinite',
      // fixedColCount: 2,
    },
  });

  const bListDnD = useDragAndDrop({
    controller: dndController,
    name: 'bList',
    list: bList,
    listLayout: {
      type: 'one-row-infinite',
      // fixedColCount: 3,
    },
  });

  return (
    <>
      <div className="w-full relative">
        <div className="w-full box-border relative bg-blue-200 p-2 flex">
          <div ref={aListDnD.ref}>
            {
              aList?.map((item) => (
                <div key={item.value} className="inline-flex flex-row gap-2 border border-slate-300 p-2 rounded-lg bg-white w-32">
                  <div data-is-dnd-handler={true} className="cursor-move">
                    :::
                  </div>
                  <div>
                    { item.name }
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      <div className="h-10"></div>

      <div className="w-full relative">
        <div className="w-full box-border relative bg-blue-200 p-2 flex">
          <div ref={bListDnD.ref}>
            {
              bList?.map((item) => (
                <div key={item.value} className="inline-flex flex-row gap-2 border border-slate-300 p-2 rounded-lg bg-white w-32">
                  <div data-is-dnd-handler={true} className="cursor-move">
                    :::
                  </div>
                  <div>
                    { item.name }
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </>
  );
}