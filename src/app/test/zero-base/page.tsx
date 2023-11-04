"use client"
import { useDragAndDrop } from "@/hooks/use-drag-and-drop/use-drag-and-drop.hook";
import { createRef, useState } from "react";
import { IUseDragAndDrop } from "../../../..";

interface Item {
  name: string;
  value: string;
}

export default function ZeroBaseTestPage() {
  const [dndLists, setDndLists] = useState<[string, IUseDragAndDrop.List<Item, HTMLDivElement>][]>([
    [
      'aList',
      {
        ref: createRef<HTMLDivElement>(),
        items: [
          { name: 'a', value: 'a', },
          { name: 'aaa', value: 'aaa', },
          { name: 'aaaaa', value: 'aaaaa', },
          { name: 'aaaaaaa', value: 'aaaaaaa', },
        ],
        listLayout: {
          type: 'fixed-col-count-grid',
          fixedColCount: 2,
        },
      },
    ],
    [
      'bList',
      {
        ref: createRef<HTMLDivElement>(),
        items: [],
        listLayout: {
          type: 'fixed-col-count-grid',
          fixedColCount: 2,
        },
      },
    ],
  ]);
  const dnd = useDragAndDrop({
    lists: dndLists,
    onEndDrag(dragFromInfo, dragToInfo, newLists) {
      setDndLists([...newLists]);
    },
  });

  return (
    <>
      <div className="w-full grid grid-cols-2 gap-2">
        <div>
          <div className="w-full box-border relative">
            <div ref={dnd.getList('aList')?.ref} className="bg-blue-200 p-2 pb-24 grid grid-cols-2" data-is-dnd-list={true}>
              {
                dnd.getList('aList')?.items.map((item) => (
                  <div key={item.value} className="inline-flex flex-row gap-2 border border-slate-300 p-2 rounded-lg bg-white w-full">
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

        <div>
          <div className="w-full box-border relative">
            <div ref={dnd.getList('bList')?.ref} className="bg-blue-200 p-2 pb-24 grid grid-cols-2" data-is-dnd-list={true}>
              {
                dnd.getList('bList')?.items.map((item) => (
                  <div key={item.value} className="inline-flex flex-row gap-2 border border-slate-300 p-2 rounded-lg bg-white w-full">
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
      </div>
    </>
  );
}