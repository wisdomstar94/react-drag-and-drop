import { useDragAndDrop } from "@/hooks/use-drag-and-drop/use-drag-and-drop.hook";
import { createRef } from "react";
import styles from './index.module.scss';

export default function DragEffectTestPage() {
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
            type: 'fixed-col-count-grid',
            fixedColCount: 2,
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
            type: 'fixed-col-count-grid',
            fixedColCount: 2,
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
            type: 'fixed-col-count-grid',
            fixedColCount: 2,
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
            type: 'fixed-col-count-grid',
            fixedColCount: 2,
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
            type: 'fixed-col-count-grid',
            fixedColCount: 2,
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
      <div className="w-full grid grid-cols-5 gap-12">
        <div>
          <div className="w-full box-border relative">
            <div 
              ref={dnd.getList('aList')?.ref} 
              className={[
                "bg-blue-200 p-2 pb-24 grid grid-cols-2 h-screen items-start content-start",
                // dnd.isDraggingNotForm('aList') ? styles['from-item-list-expect-other-list-active'] : '',
                // dnd.isDraggingFrom('aList') ? styles['from-item-list-active'] : '',
              ].join(' ')}>
              {
                dnd.getList('aList')?.items.map((item) => (
                  <div className="inline-flex text-xs" key={item.value}>
                    <div className="inline-flex flex-row gap-2 border border-slate-300 p-2 rounded-lg bg-white w-full">
                      <div data-is-dnd-handler={true} className="cursor-move">
                        :::
                      </div>
                      <div>
                        { item.name }
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        <div>
          <div className="w-full box-border relative">
            <div 
              ref={dnd.getList('bList')?.ref} 
              className={[
                "bg-blue-200 p-2 pb-24 grid grid-cols-2 h-screen items-start content-start",
                // dnd.isDraggingNotForm('bList') ? styles['from-item-list-expect-other-list-active'] : '',
                // dnd.isDraggingFrom('bList') ? styles['from-item-list-active'] : '',
              ].join(' ')}>
              {
                dnd.getList('bList')?.items.map((item) => (
                  <div className="inline-flex text-xs" key={item.value}>
                    <div className="inline-flex flex-row gap-2 border border-slate-300 p-2 rounded-lg bg-white w-full">
                      <div data-is-dnd-handler={true} className="cursor-move">
                        :::
                      </div>
                      <div>
                        { item.name }
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        <div>
          <div className="w-full box-border relative">
            <div 
              ref={dnd.getList('cList')?.ref} 
              className={[
                "bg-blue-200 p-2 pb-24 grid grid-cols-2 h-screen items-start content-start",
              ].join(' ')}>
              {
                dnd.getList('cList')?.items.map((item) => (
                  <div className="inline-flex text-xs" key={item.value}>
                    <div className="inline-flex flex-row gap-2 border border-slate-300 p-2 rounded-lg bg-white w-full">
                      <div data-is-dnd-handler={true} className="cursor-move">
                        :::
                      </div>
                      <div>
                        { item.name }
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        <div>
          <div className="w-full box-border relative">
            <div 
              ref={dnd.getList('dList')?.ref} 
              className={[
                "bg-blue-200 p-2 pb-24 grid grid-cols-2 h-screen items-start content-start",
              ].join(' ')}>
              {
                dnd.getList('dList')?.items.map((item) => (
                  <div className="inline-flex text-xs" key={item.value}>
                    <div className="inline-flex flex-row gap-2 border border-slate-300 p-2 rounded-lg bg-white w-full">
                      <div data-is-dnd-handler={true} className="cursor-move">
                        :::
                      </div>
                      <div>
                        { item.name }
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        <div>
          <div className="w-full box-border relative">
            <div 
              ref={dnd.getList('eList')?.ref} 
              className={[
                "bg-blue-200 p-2 pb-24 grid grid-cols-2 h-screen items-start content-start",
              ].join(' ')}>
              {
                dnd.getList('eList')?.items.map((item) => (
                  <div className="inline-flex text-xs" key={item.value}>
                    <div className="inline-flex flex-row gap-2 border border-slate-300 p-2 rounded-lg bg-white w-full">
                      <div data-is-dnd-handler={true} className="cursor-move">
                        :::
                      </div>
                      <div>
                        { item.name }
                      </div>
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