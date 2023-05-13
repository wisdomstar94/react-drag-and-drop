import { useDragAndDrop } from "@/hooks/new/use-drag-and-drop/use-drag-and-drop.hook";
import { createRef } from "react";

export default function OneRowInfiniteTestPage() {
  const dnd = useDragAndDrop({
    lists: [
      [
        'aList',
        {
          ref: createRef<HTMLDivElement>(),
          items: [
            { name: 'aaaaaaaaaaaaaaa', value: 'a', },
            { name: 'aaa', value: 'aaa', },
            { name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', value: 'aaaaa', },
            { name: 'aaaaaaa', value: 'aaaaaaa', },
          ],
          listLayout: {
            type: 'one-row-infinite',
          },
        },
      ],
      [
        'bList',
        {
          ref: createRef<HTMLDivElement>(),
          items: [
            { name: 'bbbbbbbbbbbbbbb', value: 'b', },
            { name: 'bbb', value: 'bbb', },
            { name: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', value: 'bbbbb', },
            { name: 'bbbbbbb', value: 'bbbbbbb', },
          ],
          listLayout: {
            type: 'one-row-infinite',
          },
        },
      ],
    ],
  });

  return (
    <>
      <div className="w-full relative">
        <div className="w-full box-border relative">
          <div ref={dnd.getList('aList')?.ref} className="bg-blue-200 p-2 flex pr-20">
            {
              dnd.getList('aList')?.items.map((item) => (
                <div key={item.value} className="inline-flex flex-row gap-2 border border-slate-300 p-2 rounded-lg bg-white">
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
        <div className="w-full box-border relative">
          <div ref={dnd.getList('bList')?.ref} className="bg-blue-200 p-2 flex pr-20">
            {
              dnd.getList('bList')?.items.map((item) => (
                <div key={item.value} className="inline-flex flex-row gap-2 border border-slate-300 p-2 rounded-lg bg-white">
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