"use client"
import { useDragAndDrop } from "@/hooks/use-drag-and-drop/use-drag-and-drop.hook";
import { ICommon } from "@/interfaces/common.interface";
import { createRef, useCallback, useEffect, useState } from "react";
import { IUseDragAndDrop } from "../../../..";

interface Item {
  name: string;
  value: string;
}

export default function ItemSelfDnDHanlderTestPage() {
  const [dndLists, setDndLists] = useState<[string, IUseDragAndDrop.List<Item, HTMLDivElement>][]>([
    [
      'aList', 
      {
        items: [
          { name: 'a', value: 'a' },
          { name: 'aaa', value: 'aaa' },
          { name: 'aaaaa', value: 'aaaaa' },
          { name: 'aaaaaaa', value: 'aaaaaaa' },
        ] as ICommon.Item[],
        ref: createRef<HTMLDivElement>(),
        listLayout: {
          type: 'one-col-infinite',
        },
      }
    ],
    [
      'bList', 
      {
        items: [
          { name: 'b', value: 'b' },
          { name: 'bbb', value: 'bbb' },
          { name: 'bbbbb', value: 'bbbbb' },
          { name: 'bbbbbbb', value: 'bbbbbbb' },
        ] as ICommon.Item[],
        ref: createRef<HTMLDivElement>(),
        listLayout: {
          type: 'one-col-infinite',
        },
      }
    ],
  ]);
  const dnd = useDragAndDrop({
    lists: dndLists,
    onEndDrag(dragFromInfo, dragToInfo, newLists) {
      setDndLists([...newLists]);
    },
  });

  const onItemClick = useCallback((item: ICommon.Item) => {
    if (dnd.isDragging) return;
    alert('hi!');
  }, [dnd.isDragging]);

  useEffect(() => {
    // 데이터를 나중에 할당해야 하는 경우에는 아래와 같이 비동기로 데이터를 불러온 이후에 dnd.setItems 메서드로 할당 가능합니다.
    // setTimeout(() => {
    //   dnd.setItems('bList', [
    //     { name: 'b2', value: 'b2' },
    //     { name: 'bbb2', value: 'bbb2' },
    //     { name: 'bbbbb2', value: 'bbbbb2' },
    //     { name: 'bbbbbbb2', value: 'bbbbbbb2' },
    //   ]);
    // }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!dnd.isInit) return;
    console.log(`dnd.getList('aList')`, dnd.getList('aList'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dnd.isInit]);

  return (
    <>
      <div className="w-full h-96"></div>

      <div className="w-full grid grid-cols-2 gap-2">
        <div>
          <div className="w-full box-border relative">
            <div ref={dnd.getList('aList')?.ref} className="bg-blue-200 p-2 flex flex-wrap items-start content-start pb-24 h-screen" data-is-dnd-list={true}>
              {
                dnd.getList('aList')?.items?.map((item) => (
                  <div data-is-dnd-handler={true} key={item.value} 
                    className="flex gap-2 border border-slate-300 p-2 rounded-lg bg-white w-full cursor-pointer hover:bg-gray-100" 
                    onClick={() => onItemClick(item)}>
                    <div className="cursor-move w-6">
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
            <div ref={dnd.getList('bList')?.ref} className="bg-blue-200 p-2 flex flex-wrap items-start content-start pb-24 h-screen" data-is-dnd-list={true}>
              {
                dnd.getList('bList')?.items?.map((item) => (
                  <div data-is-dnd-handler={true} key={item.value} 
                    className="flex gap-2 border border-slate-300 p-2 rounded-lg bg-white w-full cursor-pointer hover:bg-gray-100" 
                    onClick={() => onItemClick(item)}>
                    <div className="cursor-move w-6">
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