import { useDragAndDrop } from "@/hooks/use-drag-and-drop/use-drag-and-drop.hook";
import { createRef } from "react";
import styles from './index.module.scss';

export default function BoardTestPage() {
  const dndBoard = useDragAndDrop({
    lists: [
      [
        'board',
        {
          ref: createRef<HTMLDivElement>(),
          items: [
            { name: 'aList', value: 'aList', },
            { name: 'bList', value: 'bList', },
            { name: 'cList', value: 'cList', },
            { name: 'dList', value: 'dList', },
            { name: 'eList', value: 'eList', },
          ],
          listLayout: {
            type: 'one-row-infinite',
          },
        },
      ],
    ],
  });

  const dnd = useDragAndDrop({
    lists: [
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
      [
        'cList',
        {
          ref: createRef<HTMLDivElement>(),
          items: [
            { name: 'c', value: 'c', },
            { name: 'ccc', value: 'ccc', },
            { name: 'ccccc', value: 'ccccc', },
            { name: 'ccccccc', value: 'ccccccc', },
          ],
          listLayout: {
            type: 'one-col-infinite',
          },
        },
      ],
      [
        'dList',
        {
          ref: createRef<HTMLDivElement>(),
          items: [
            { name: 'd', value: 'd', },
            { name: 'ddd', value: 'ddd', },
            { name: 'ddddd', value: 'ddddd', },
            { name: 'ddddddd', value: 'ddddddd', },
          ],
          listLayout: {
            type: 'one-col-infinite',
          },
        },
      ],
      [
        'eList',
        {
          ref: createRef<HTMLDivElement>(),
          items: [
            { name: 'e', value: 'e', },
            { name: 'eee', value: 'eee', },
            { name: 'eeeee', value: 'eeeee', },
            { name: 'eeeeeee', value: 'eeeeeee', },
          ],
          listLayout: {
            type: 'one-col-infinite',
          },
        },
      ],
    ],
    draggingItemClassName: styles['drag-from-item-effect'],
    draggingFormListClassName: styles['from-item-list-active'],
    draggingNotFormListClassName: styles['from-item-list-expect-other-list-active'],
  });

  return (
    <>
      <div className="w-full relative">
        <div className="w-full box-border relative">
          <div ref={dndBoard.getList('board')?.ref} className="bg-blue-200 p-2 flex pr-20 h-screen">
            {
              dndBoard.getList('board')?.items.map((item) => (
                <div key={item.value} className="min-w-[160px] inline-flex flex-wrap content-start gap-2 border border-slate-300 p-2 rounded-lg bg-white">
                  <div data-is-dnd-handler={true} className="cursor-move w-full">
                    :::
                  </div>
                  <div ref={dnd.getList(item.name as any)?.ref} className="w-full flex flex-wrap content-start gap-1 box-border p-4 bg-slate-100">
                    {
                      dnd.getList(item.name as any)?.items.map((_item) => {
                        return (
                          <div key={_item.value} data-is-dnd-handler={true} className="w-full bg-blue-200 box-border p-2 cursor-pointer hover:bg-blue-300">
                            { _item.name }
                          </div>
                        )
                      })
                    }
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