import { useDragAndDropController } from "@/hooks/use-drag-and-drop-controller/use-drag-and-drop-controller.hook";
import { useDragAndDrop } from "@/hooks/use-drag-and-drop/use-drag-and-drop.hook";
import { ICommon } from "@/interfaces/common.interface";
import { useState } from "react";

export default function OneColInfiniteTestPage() {
  const [aList, setAList] = useState<ICommon.Item[] | undefined>([
    { name: 'a', value: 'a', },
    { name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', value: 'aaa', },
    { name: 'aaaaa', value: 'aaaaa', },
    { name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', },
  ]);

  const [bList, setBList] = useState<ICommon.Item[] | undefined>([
    { name: 'b', value: 'b', },
    { name: 'bbb', value: 'bbb', },
    { name: 'bbbbb', value: 'bbbbb', },
    { name: 'bbbbbbb', value: 'bbbbbbb', },
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
      type: 'one-col-infinite',
    },
  });

  const bListDnD = useDragAndDrop({
    controller: dndController,
    name: 'bList',
    list: bList,
    listLayout: {
      type: 'one-col-infinite',
    },
  });

  return (
    <>
      <div className="w-full grid grid-cols-2 gap-2">
        <div>
          <div className="w-full box-border relative">
            <div ref={aListDnD.ref} className="bg-blue-200 p-2 flex flex-wrap items-start content-start pb-24 h-screen">
              {
                aList?.map((item) => (
                  <div key={item.value} className="flex gap-2 border border-slate-300 p-2 rounded-lg bg-white w-full">
                    <div data-is-dnd-handler={true} className="cursor-move w-6">
                      :::
                    </div>
                    <div className="whitespace-pre-line break-words flex-1 block break-all">
                      { item.name }
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        <div>
          <div className="w-full box-border relative">
            <div ref={bListDnD.ref} className="bg-blue-200 p-2 flex flex-wrap items-start content-start pb-24 h-screen">
              {
                bList?.map((item) => (
                  <div key={item.value} className="flex gap-2 border border-slate-300 p-2 rounded-lg bg-white w-full">
                    <div data-is-dnd-handler={true} className="cursor-move w-6">
                      :::
                    </div>
                    <div className="whitespace-pre-line break-words flex-1 block break-all">
                      { item.name }
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}