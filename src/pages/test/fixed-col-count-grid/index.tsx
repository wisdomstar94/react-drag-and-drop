import { useDragAndDropController } from "@/hooks/use-drag-and-drop-controller/use-drag-and-drop-controller.hook";
import { useDragAndDrop } from "@/hooks/use-drag-and-drop/use-drag-and-drop.hook";
import { ICommon } from "@/interfaces/common.interface";
import { useState } from "react";
import styles from './index.module.scss';

export default function FixedColCountGridTestPage() {
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
    onDestinationActiveListName(name) {
      console.log('@name', name);
    },
    onStartDrag(dragFromInfo) {
      const fromItemElement = dragFromInfo?.targetItemElement;
      fromItemElement?.firstElementChild?.classList.add(styles['drag-from-item-effect']);
    },
    onEndDrag(dragFromInfo, dragToInfo) {
      const fromItemElement = dragFromInfo?.targetItemElement;
      fromItemElement?.firstElementChild?.classList.remove(styles['drag-from-item-effect']);
    },
  });

  const aListDnD = useDragAndDrop({
    controller: dndController,
    name: 'aList',
    list: aList,
    listLayout: {
      type: 'fixed-col-count-grid',
      fixedColCount: 2,
    },
  });

  const bListDnD = useDragAndDrop({
    controller: dndController,
    name: 'bList',
    list: bList,
    listLayout: {
      type: 'fixed-col-count-grid',
      fixedColCount: 2,
    },
  });

  return (
    <>
      <div className="w-full grid grid-cols-2 gap-2">
        <div>
          <div className="w-full box-border relative">
            <div ref={aListDnD.ref} className="bg-blue-200 p-2 pb-24 grid grid-cols-2 h-screen items-start content-start">
              {
                aList?.map((item) => (
                  <div className="inline-flex" key={item.value}>
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
            <div ref={bListDnD.ref} className="bg-blue-200 p-2 pb-24 grid grid-cols-2 h-screen items-start content-start">
              {
                bList?.map((item) => (
                  <div className="inline-flex" key={item.value}>
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