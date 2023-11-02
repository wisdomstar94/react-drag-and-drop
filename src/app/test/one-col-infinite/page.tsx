"use client"
import { useDragAndDrop } from "@/hooks/use-drag-and-drop/use-drag-and-drop.hook";
import { createRef } from "react";

export default function OneColInfiniteTestPage() {
  const dnd = useDragAndDrop({
    lists: [
      [
        'aList',
        {
          ref: createRef<HTMLDivElement>(),
          items: [
            { name: 'a', value: 'a', },
            { name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', value: 'aaa', },
            { name: 'aaaaa', value: 'aaaaa', },
            { name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', },
          ],
          listLayout: {
            type: 'one-col-infinite',
          },
        },
      ],
      [
        'bList',
        {
          ref: createRef<HTMLDivElement>(),
          items: [
            { name: 'b', value: 'b', },
            { name: 'bbb', value: 'bbb', },
            { name: 'bbbbb', value: 'bbbbb', },
            { name: 'bbbbbbb', value: 'bbbbbbb', },
          ],
          listLayout: {
            type: 'one-col-infinite',
          },
        },
      ],
    ],
  });

  return (
    <>
      <div className="w-full grid grid-cols-2 gap-2">
        <div>
          <div className="w-full box-border relative">
            <div ref={dnd.getList('aList')?.ref} className="bg-blue-200 p-2 flex flex-wrap items-start content-start pb-24 h-screen" data-is-dnd-list={true}>
              {
                dnd.getList('aList')?.items.map((item) => (
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
            <div ref={dnd.getList('bList')?.ref} className="bg-blue-200 p-2 flex flex-wrap items-start content-start pb-24 h-screen" data-is-dnd-list={true}>
              {
                dnd.getList('bList')?.items.map((item) => (
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