import { useEffect, useState } from 'react';
import { Button } from '../../ui/_button';
import { Badge } from '../../ui/_badge';
import { Plus } from 'lucide-react';
import ListItem,{ type Column } from './ListItem';
import AddCardDialog from '../card/AddCardDialog';
import AddListDialog from './AddListDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/_tabs';

import { toast } from "sonner";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDispatch, useSelector } from 'react-redux';
import { polyfill } from '../../../helper/polyfill';
import ListService from '../../../services/auth/ListService';
import { useNavigate, useNavigation, useParams } from 'react-router-dom';
import { setAllList } from '../../../slices/List';
import ListContainerHeader from './ListContainerHeader';
import { Tab } from '../../../interfaces/App';
import CardService from '../../../services/auth/CardService';
import type { Card } from '../card/CardItem';
interface AddCardModalProps {
  isOpen:boolean
  listId?: number,
}
function ListContainer() {
  const navigate = useNavigate();
  const [columns, setColumns] = useState<Column[]>([]);
  const [showAddCard, setShowAddCard] = useState<AddCardModalProps>({isOpen:false});
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<number>(NaN);
  const [editingTask, setEditingTask] = useState<Card | undefined>();
  const [editingColumn, setEditingColumn] = useState<Column | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const handleAddCard = (listId: number) => {
    setActiveColumnId(listId);
    setEditingTask(undefined);
    setShowAddCard({isOpen:true, listId});
  };
  const handleOpenCard = (cardId:number, listId:number) => {
    navigate("../list/"+projectId+"/"+boardId+"/"+listId+"/card/"+cardId)
  }

  const handleEditCard = (task: Card, listId:number) => {
    setEditingTask(task);
    setShowAddCard({isOpen:true, listId});
  };
  const cardService = new CardService();
  const handleSaveCard = async (cardData: Omit<Card, 'id'>) => {
    console.log(cardData);
    
    if (cardData.name) {
      const card = await cardService.createCard({
        name: cardData.name,
        listId: cardData?.listId,
        boardId: boardId,
        position: allList.length,
        priority: cardData.priority && cardData.priority.id ? cardData.priority.id : 3,
        dueDate:cardData.dueDate,
        description:cardData.description
      });
      if (card.status && card.status == 200) {
        const index = allList.findIndex((l:any) => l.id === cardData?.listId);
        const list = [...allList];
        const listObj = { ...list[index] };
        const cardArr = [...listObj.cards];
        cardArr.push({
          complete: 0,
          description: null,
          id: card.data.lastInsertCardId,
          name: cardData.name,
          user: [],
          tags: [],
        });
        listObj.cards = cardArr;
        list[index] = listObj;
        dispatch(setAllList(list));
        // setCardEditMode(false);
      }
    }
    // if (editingTask) {
    //   // Update existing task
    //   setColumns(prev => prev.map(column => ({
    //     ...column,
    //     tasks: column.tasks.map(task =>
    //       task.id === editingTask.id ? { ...taskData, id: task.id } : task
    //     )
    //   })));
    // } else {
    //   // Add new task
    //   const newTask: Task = {
    //     ...taskData,
    //     id: Date.now().toString()
    //   };
      
    //   setColumns(prev => prev.map(column =>
    //     column.id === activeColumnId
    //       ? { ...column, tasks: [...column.tasks, newTask] }
    //       : column
    //   ));
    // }
  };

  const handleDeleteCard = (taskId: string) => {
    setColumns(prev => prev.map(column => ({
      ...column,
      tasks: column.tasks.filter(task => task.id !== taskId)
    })));
  };

  const handleMoveCard = (taskId: string, targetColumnId: string) => {
    let movedTask: Task | null = null;
    
    // Remove task from current column
    setColumns(prev => {
      const newColumns = prev.map(column => ({
        ...column,
        tasks: column.tasks.filter(task => {
          if (task.id === taskId) {
            movedTask = task;
            return false;
          }
          return true;
        })
      }));
      
      // Add task to target column
      return newColumns.map(column =>
        column.id === targetColumnId && movedTask
          ? { ...column, tasks: [...column.tasks, movedTask] }
          : column
      );
    });
  };

  const handleAddColumn = () => {
    setEditingColumn(undefined);
    setShowAddColumn(true);
  };

  const handleEditColumn = (column: Column) => {
    setEditingColumn(column);
    setShowAddColumn(true);
  };

  const handleSaveColumn = async(columnData: Omit<Column, 'id' | 'tasks'>) => {
    console.log(columnData);
    if (columnData.title) {
      const list = await listService.createList({
        boardId: boardId,
        name: columnData.title,
        position: allList.length + 1,
      });
      if (list.status && list.status == 200) {
        console.log(list.data);
        const listCopy = polyfill.deepCopy(allList);
        listCopy.push({
          id: list.data.lastInsertListId,
          name: columnData.title,
          cards: [],
        });
        dispatch(setAllList(listCopy));
      }
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (column && column.tasks.length > 0) {
      toast.error(`Cannot delete column "${column.title}" - it contains ${column.tasks.length} tasks`);
      return;
    }
    setColumns(prev => prev.filter(column => column.id !== columnId));
    toast.success('Column deleted successfully');
  };

  const handleDuplicateCard = (task: Task) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      title: `${task.title} (Copy)`
    };
    
    setColumns(prev => prev.map(column => {
      const hasTask = column.tasks.some(t => t.id === task.id);
      if (hasTask) {
        return { ...column, tasks: [...column.tasks, newTask] };
      }
      return column;
    }));
    toast.success('Card duplicated successfully');
  };

  const handleDuplicateColumn = (column: Column) => {
    const newColumn: Column = {
      ...column,
      id: Date.now().toString(),
      title: `${column.title} (Copy)`,
      tasks: column.tasks.map(task => ({
        ...task,
        id: `${Date.now()}-${task.id}`
      }))
    };
    setColumns(prev => [...prev, newColumn]);
    toast.success('Column duplicated successfully');
  };

  const handleMoveColumn = (columnId: string, direction: 'left' | 'right') => {
    setColumns(prev => {
      const currentIndex = prev.findIndex(col => col.id === columnId);
      if (currentIndex === -1) return prev;
      
      const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const newColumns = [...prev];
      [newColumns[currentIndex], newColumns[newIndex]] = [newColumns[newIndex], newColumns[currentIndex]];
      return newColumns;
    });
  };

  const handleToggleCollapse = (columnId: string) => {
    setColumns(prev => prev.map(column =>
      column.id === columnId
        ? { ...column, collapsed: !column.collapsed }
        : column
    ));
  };

  const handleArchiveColumn = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (column) {
      toast.success(`Column "${column.title}" archived`);
      // In a real app, you might move this to an archived state instead of deleting
      handleDeleteColumn(columnId);
    }
  };

  const handleChangePriority = (taskId: string, priority: 'low' | 'medium' | 'high') => {
    setColumns(prev => prev.map(column => ({
      ...column,
      tasks: column.tasks.map(task =>
        task.id === taskId ? { ...task, priority } : task
      )
    })));
    toast.success(`Task priority updated to ${priority}`);
  };

  const handleMoveCardBetweenColumns = (taskId: string, direction: 'left' | 'right') => {
    const currentColumnIndex = columns.findIndex(col => 
      col.tasks.some(task => task.id === taskId)
    );
    
    if (currentColumnIndex === -1) return;
    
    const targetIndex = direction === 'left' ? currentColumnIndex - 1 : currentColumnIndex + 1;
    if (targetIndex < 0 || targetIndex >= columns.length) return;
    
    const targetColumnId = columns[targetIndex].id;
    handleMoveCard(taskId, targetColumnId);
    toast.success(`Card moved ${direction}`);
  };







  const dispatch = useDispatch();
  const { projectId,boardId, filterType } = useParams();
  const [activeTabKey, setActiveTabKey] = useState<Tab>(filterType);
  const listService:any = new ListService();
  const allList = useSelector((e:any) => e.list.allList);
  const [isListDragging, setIsListDragging] = useState<any>();
  const [draggingCard, setDraggingCard] = useState({});
  const [activeId, setActiveId] = useState(null);
  const sensor = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 5 } }), useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }));
  useEffect(() => {
    if(filterType)
    {
      if (activeTabKey == Tab.ACTIVE) {
        getList(0, filterType);
      } else if (activeTabKey == Tab.ARCHIVE) {
        getList(1, filterType);
      }
    }
    }, [filterType]);
    const getList = async (isArchive:number, filterType:Tab) => {    
    const list = await listService.getAllList(boardId, isArchive, filterType);
    if (list.status && list.status == 200) {
      const result = Object.entries(list.data).map(([_, value]) => value);

      result.sort((a:any, b:any) => {
        return a.position > b.position ? 1 : -1;
      });
      result.forEach((e, i) => {
        result[i] = modifyListData(e);
      });
      dispatch(setAllList([]));
      dispatch(setAllList(result));
      if (result.length > 0) {
        // setListProperties((p) => ({
        //   ...p,
        //   lastPosition: result[result.length - 1].position,
        // }));
      } else {
        // setListProperties((p) => ({ ...p, lastPosition: 0 }));
      }
    }
  };
    const modifyListData = (e:any) => {
    console.log(e);
    
    e.label = e.name;
    e.value = e.id;
    const item = JSON.parse(JSON.stringify(e));
    if (item.hasOwnProperty("cards")) {
      let cardArray = Object.entries(item?.cards).map((e:any) => {
        let users = Object.entries(e[1].users).map((u) => {
          return u[1];
        });
        e[1].users = users;
        let tags = Object.entries(e[1].tags).map((u) => {
          return u[1];
        });
        e[1].tags = tags;
        return e[1];
      });
      cardArray.sort((a, b) => {
        return a.position > b.position ? 1 : -1;
      });
      item.cards = cardArray;
    } else {
      item.cards = [];
    }

    return item;
  };
  const isList = (id:any) => {
    return allList.findIndex((l:any) => l.id == id.match(/\d+/)[0]);
  };
    const findContainer = (id:number, type:any) => {    
    if(type == "LIST")
    if (allList.some((l:any) => l.id == id)) return id;
    // if (listOrder.includes(id)) return id; // it's a list
    let listId;
    allList.forEach((e:any) => {
      e.cards.forEach((e2:any) => {
        if (e2.id == id) listId = e.id;
      });
    });
    return listId;
  };
  const handleDragStart = (active: any) => {    
      console.log("JH");
      
    if (active.active.data.current.sortable.containerId == "LISTCONTAINER") {
      setIsListDragging(true);
      setActiveId(active.active.id.match(/\d+/)[0]);
      return
    } else {
      const elem =
        active.activatorEvent.srcElement.offsetParent.querySelector(
          ".cardWrapper"
        );
      setIsListDragging(false);
      setActiveId(elem.getAttribute("data-list-id"));
      const card = allList
        .find((l:any) => l.id == elem.getAttribute("data-list-id"))
        .cards.find((c:any) => c.id == active.active.id.match(/\d+/)[0]);
      setDraggingCard(card);
    }
    // setCurrentDraggingHtml(active.activatorEvent.srcElement.parentElement);
  };
  const handleDragEnd = async ({ active, over }:{active:any,over:any}) => {
    setActiveId(null); // reset
    if (!over) return;
    const activeId = active.id.match(/\d+/)[0];
    const overId = over.id.match(/\d+/)[0];
    const isListOrCardActive = active.id.match(/[A-Z]/g).join("");
    const isListOrCardOver = over.id.match(/[A-Z]/g).join("");
    const activeContainer = findContainer(activeId, isListOrCardActive);
    const overContainer = findContainer(overId, isListOrCardOver);

    // ✅ CASE 1: Moving entire lists
    if (activeContainer == activeId && overContainer == overId) {
      if (activeId !== overId) {
        const listCopy = polyfill.deepCopy(allList);

        const oldIndex = listCopy.findIndex((l:any) => l.id == activeId);

        const newIndex = listCopy.findIndex((l:any) => l.id == overId);
        listCopy[oldIndex].position = newIndex + 1;
        listCopy[newIndex].position = oldIndex + 1;
        const list = await listService.updateListPosition({
          boardId,
          lists: [listCopy[oldIndex], listCopy[newIndex]],
        });
        if (list.status && list.status == 200) {
          listCopy.sort((a:any, b:any) => {
            return a.position > b.position ? 1 : -1;
          });
          dispatch(setAllList(listCopy));
        }
      }
      return;
    }

    // ✅ CASE 2: Moving cards
    if (activeContainer && overContainer) {
      // 🔹 Same list
      if (activeContainer == overContainer) {
        const listIndex = allList.findIndex((l:any) => l.id == activeContainer);
        const cards = allList[listIndex].cards;

        const oldIndex = cards.findIndex((c:any) => c.id == activeId);
        const newIndex = cards.findIndex((c:any) => c.id == overId);

        const newCards = arrayMove(cards, oldIndex, newIndex);

        const newAllList = [...allList];
        newAllList[listIndex] = { ...newAllList[listIndex], cards: newCards };

        dispatch(setAllList(newAllList));

        // 🔹 optional backend update
        await listService.updateCardPositionSameList({
          boardId,
          cards: newCards.map((c:any, i) => ({ ...c, position: i + 1 })),
        });
      }
      // 🔹 Different lists
      else {
        const fromListIndex = allList.findIndex((l:any) => l.id == activeContainer);
        const toListIndex = allList.findIndex((l:any) => l.id == overContainer);

        const fromCards = [...allList[fromListIndex].cards];

        const toCards = [...allList[toListIndex].cards];

        const movingCardIndex = fromCards.findIndex((c) => c.id == activeId);
        const [movedCard] = fromCards.splice(movingCardIndex, 1);

        const overIndex = toCards.findIndex((c) => c.id == overId);
        toCards.splice(overIndex, 0, movedCard);

        const newAllList = [...allList];
        newAllList[fromListIndex] = {
          ...newAllList[fromListIndex],
          cards: fromCards,
        };
        newAllList[toListIndex] = {
          ...newAllList[toListIndex],
          cards: toCards,
        };

        dispatch(setAllList(newAllList));
        const movedCard2 = await listService.updateCardPosition({
          boardId,
          cardId: activeId,
          addedListId: allList[toListIndex].id,
          deletedListId: allList[fromListIndex].id,
          position: overIndex,
        });
        if (movedCard2.status && movedCard2.status == 200) {
          const listCopy = polyfill.deepCopy(allList);
          const listFromDeleted = { ...listCopy[fromListIndex] };

          const listToAdded = { ...listCopy[toListIndex] };

          const card = listFromDeleted.cards.find((e:any) => {
            return e.id == activeId;
          });
          const nextAllCardPositionMinus:Array<any> = [];
          const cardIndex = listFromDeleted.cards.findIndex(
            (card:any) => card.id == activeId
          );
          listFromDeleted.cards.splice(cardIndex, 1);
          listToAdded.cards.splice(overIndex, 0, card);
          const nextAllCardPositionPlus:Array<any> = [];
          listToAdded.cards.find((e:any, i:number) => {
            if (i > overIndex) {
              nextAllCardPositionPlus.push(e.id);
            }
          });
          listFromDeleted.cards.find((e:any, i:number) => {
            if (i >= cardIndex) {
              nextAllCardPositionMinus.push(e.id);
            }
          });

          listCopy[fromListIndex] = listFromDeleted;
          listCopy[toListIndex] = listToAdded;
          const updateCardPosition =
            await listService.updateNextAllCardPosition({
              boardId,
              listId: allList[toListIndex].id,
              cardsPositionToBePlus: nextAllCardPositionPlus,
              cardsPositionToBeMinus: nextAllCardPositionMinus,
            });

          dispatch(setAllList(listCopy));
        }
      }
    }
    setIsListDragging(null);
  };
  const tabSelection = (value: any) => {
    // dispatch(setPaginationState({itemsPerPage:5,currentOffset:0}))
    //   navigate("../board/"+projectId+"/"+value);
  };
  return (
      
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-background to-slate-50/50">
        {/* Header */}
      <ListContainerHeader/>
        <Tabs onValueChange={(value: any) => { tabSelection(value); }} defaultValue={activeTabKey} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value={Tab.ACTIVE}>
            {activeTabKey == Tab.ACTIVE} Active
          </TabsTrigger>
          <TabsTrigger value={Tab.ARCHIVE}>
            {activeTabKey !== Tab.ACTIVE} Archive
          </TabsTrigger>
        </TabsList>
        <TabsContent value={Tab.ACTIVE} className="space-y-4">
          <DndContext
            sensors={sensor}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
            onDragStart={(e) => {
              handleDragStart(e);
            }}
          >
          {/* Board */}
          <div className="flex-1 overflow-x-auto px-8 py-6">
            <div className="flex gap-6 h-full pb-6 min-w-max">
                  <SortableContext
                items={allList.map((l:any) => "LIST" + l.id)}
                id={"LISTCONTAINER"}
                strategy={horizontalListSortingStrategy}
                >
                {allList.map((column:any) => (
                  <ListItem
                    key={column.id}
                    column={column}
                    onOpenCard = {handleOpenCard}
                    onAddCard={handleAddCard}
                    onEditCard={handleEditCard}
                    onDeleteCard={handleDeleteCard}
                    onEditColumn={handleEditColumn}
                    onDeleteColumn={handleDeleteColumn}
                    onMoveCard={handleMoveCard}
                    onDuplicateCard={handleDuplicateCard}
                    onDuplicateColumn={handleDuplicateColumn}
                    onMoveColumn={handleMoveColumn}
                    onToggleCollapse={handleToggleCollapse}
                    onArchiveColumn={handleArchiveColumn}
                    onChangePriority={handleChangePriority}
                    onMoveCardInColumn={handleMoveCardBetweenColumns}
                    isListDragging={isListDragging}
                  />
                ))}
                  </SortableContext>
                  <DragOverlay>
                    {activeId && 
                    <ListItem
                    key={allList[isList(activeId)].id}
                    column={allList[isList(activeId)]}
                    onOpenCard = {handleOpenCard}
                    onAddCard={handleAddCard}
                    onEditCard={handleEditCard}
                    onDeleteCard={handleDeleteCard}
                    onEditColumn={handleEditColumn}
                    onDeleteColumn={handleDeleteColumn}
                    onMoveCard={handleMoveCard}
                    onDuplicateCard={handleDuplicateCard}
                    onDuplicateColumn={handleDuplicateColumn}
                    onMoveColumn={handleMoveColumn}
                    onToggleCollapse={handleToggleCollapse}
                    onArchiveColumn={handleArchiveColumn}
                    onChangePriority={handleChangePriority}
                    onMoveCardInColumn={handleMoveCardBetweenColumns}
                    isListDragging={isListDragging}
                  />}
                  
                  </DragOverlay>
                {/* Add Column Button */}
                <div className="flex-shrink-0 w-80">
                <Button
                  variant="outline"
                  onClick={handleAddColumn}
                  className="w-full h-20 border-dashed border-2 border-border/40 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 rounded-xl group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted group-hover:bg-blue-100 transition-colors">
                      <Plus className="h-4 w-4 group-hover:text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">Add another column</span>
                  </div>
                </Button>
                </div>
                </div>
          </div>
        </DndContext>
        {/* Dialogs */}
        <AddCardDialog
          open={showAddCard.isOpen}
          listId={showAddCard.listId || 0}
          onOpenChange={(isOpen:boolean,listId:number)=>{setShowAddCard({isOpen,listId})}}
          onSave={handleSaveCard}
          editingTask={editingTask}
        />
        <AddListDialog
          open={showAddColumn}
          onOpenChange={setShowAddColumn}
          onSave={handleSaveColumn}
          editingColumn={editingColumn}
        />
        </TabsContent>
        <TabsContent value={Tab.ARCHIVE} className="space-y-4">
         <h3>Nothing</h3>
        </TabsContent>
      </Tabs>
      </div>
  );
}
export default ListContainer;