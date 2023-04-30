import { useDragAndDropController } from "@/hooks/use-drag-and-drop-controller/use-drag-and-drop-controller.hook";
import { useDragAndDrop } from "@/hooks/use-drag-and-drop/use-drag-and-drop.hook";
import { Fragment, useState } from "react";

interface Item {
  name: string;
  value: string;
}

export default function Home() {
  const [aList, setAList] = useState<Item[] | undefined>([
    { name: '안녕하세요 1', value: '안녕하세요 1', },
    { name: '감사해요 1', value: '감사해요 1', },
    { name: '잘있어요 1', value: '잘있어요 1', },
    { name: '다시만나요 1', value: '다시만나요 1', },
  ]);

  const [bList, setBList] = useState<Item[] | undefined>([
    { name: '안녕하세요 2', value: '안녕하세요 2', },
    { name: '감사해요 2', value: '감사해요 2', },
    { name: '잘있어요 2', value: '잘있어요 2', },
    { name: '다시만나요 2', value: '다시만나요 2', },
    { name: '아침 해가 뜨면 2', value: '아침 해가 뜨면 2', },
    { name: '매일 같은 사람들과 2', value: '매일 같은 사람들과 2', },
    { name: '또 다시 하루 일을 2', value: '또 다시 하루 일을 2', },
    { name: '시작해 2', value: '시작해 2', },
  ]);

  const dndController = useDragAndDropController<Item>({
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
    gridColCount: 1,
  });

  const bListDnD = useDragAndDrop({
    controller: dndController,
    name: 'bList',
    list: bList,
    gridColCount: 1,
  });

  return (
    <>
      <div className="h-96"></div>
      <div className="w-full relative grid grid-cols-2 gap-2 box-border p-2">
        <div className="flex flex-wrap gap-2 items-start">
          <div ref={aListDnD.ref} className="w-full box-border p-2 bg-blue-200 pb-14">
            {
              aList?.map((x) => {
                return (
                  <Fragment key={x.value}>
                    <div className="w-full relative flex border border-1 border-slate-500">
                      <div className="w-16 cursor-move" data-is-dnd-handler={true}>
                        <div className="p-4">@@</div>
                      </div>
                      <div className="w-full flex-1">
                        { x.name }
                      </div>
                    </div>
                  </Fragment>
                );
              })
            }
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-start">
          <div ref={bListDnD.ref} className="w-full box-border p-2 bg-blue-200 pb-14">
            {
              bList?.map((x) => {
                return (
                  <Fragment key={x.value}>
                    <div className="w-full relative flex border border-1 border-slate-500">
                      <div className="w-16 cursor-move" data-is-dnd-handler={true}>
                        <div className="p-4">@@</div>
                      </div>
                      <div className="w-full flex-1">
                        { x.name }
                      </div>
                    </div>
                  </Fragment>
                );
              })
            }
          </div>
        </div>
      </div>
    </>
  );
}
