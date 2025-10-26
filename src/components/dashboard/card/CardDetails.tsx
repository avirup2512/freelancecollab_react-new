import { useEffect, useState } from 'react';
import CardHeader from './CardHeader';
import CardMetadata from './CardMetadata';
import CardDescription from './CardDescription';
import ChecklistSection from './ChecklistSection';
import CommentsSection from './CommentsSection';
import ActivityFeed from './ActivityFeed';
import { Separator } from '../../ui/_separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/_tabs';
import { CheckSquare, MessageSquare, Activity as ActivityIcon, IdCard } from 'lucide-react';
import { toast } from 'sonner';
import CardService from '../../../services/auth/CardService';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllBoardTag, setCurrentCard } from '../../../slices/Card';
import BoardService from '../../../services/auth/BoardService';
import DateService from '../../../services/auth/Date';
import { Input } from '../../ui/_input';
import { polyfill } from '../../../helper/polyfill';
import type { User } from '../../../interfaces/components/User';
import type { Card, CardUser as CardUserType } from '../../../interfaces/components/Card';
import CardUser from './CardUser';
import CardTag from './CardTag';
import CheckListService from '../../../services/auth/CheckListService';
import { UserAddModal } from '../../sharedComponent/UserAddModal/UserAddModal';

interface Activity {
  id: string;
  user: string;
  action: string;
  timestamp: Date;
}

interface Tag {
  id: string;
  label: string;
  color: string;
  boardTagId?:number
}

function CardDetails() {
  const cardService = new CardService();
  const boardService = new BoardService();
  const dateService = new DateService();
  const checkListService = new CheckListService();
  const { boardId, listId, cardId } = useParams();
  const dispatch = useDispatch();
  // GETTING DATA FROM REDUX STARTS
  const currentCard = useSelector((s:any) => s.card.card);
  const allTag = useSelector((s:any) => s.card.allTag);
  const allBoardTag = useSelector((e:any) => e.card.allBoardTag);
  // const user = useSelector((e:any) => e.user.allUserList);
  const roles = useSelector((e:any) => e.dashboard.allRoles);
  // GETTING DATA FROM REDUX ENDS


  const [userAddModal, setUserAddModal] = useState<{ isOpen: boolean; id: number | null; name: string }>({
    isOpen: false,
    id: null,
    name: ''
  });
  const [existingCheckListUser,setExistingCheckListUser] = useState([]);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'todo' | 'in-progress' | 'review' | 'completed'>('in-progress');
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date('2025-10-20'));
  const [reminderDate, setReminderDate] = useState<Date | undefined>(new Date('2025-10-18'));
  const [description, setDescription] = useState(
    'Working on the new project management interface with modern design patterns and improved user experience. This includes creating a clean, modular architecture with reusable components.'
  );
  const [tags, setTags] = useState<Tag[]>([
    { id: '1', label: 'Development', color: 'green' },
    { id: '2', label: 'Backend', color: 'orange' },
    { id: '3', label: 'UI/UX', color: 'blue' },
  ]);

  const [assignees, setAssignees] = useState([
    { id: '1', name: 'Avriup Chakraborty', initials: 'AC', email: 'avriup@example.com' },
    { id: '2', name: 'John Doe', initials: 'JD', email: 'john@example.com' },
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      user: 'Avriup Chakraborty',
      action: 'created this card',
      timestamp: new Date('2025-08-27T10:30:00'),
    },
    {
      id: '2',
      user: 'Avriup Chakraborty',
      action: 'changed the status to in progress',
      timestamp: new Date('2025-09-25T10:02:00'),
    },
    {
      id: '3',
      user: 'John Doe',
      action: 'added checklist items',
      timestamp: new Date('2025-09-25T09:45:00'),
    },
    {
      id: '4',
      user: 'Avriup Chakraborty',
      action: 'changed priority to high',
      timestamp: new Date('2025-09-24T14:20:00'),
    },
  ]);
  const [progress, setProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);
  const handleSaveTitle = () => {
    setCardName(localTitle);
    setIsEditing(false);
  };
  useEffect(() => {
    // Initially card is getting as {} from Redux;
  if (!currentCard || Object.keys(currentCard).length == 0) {
    getCurrentCard();
  } else {
    console.log(currentCard);
    
    setTitle(currentCard.name);
    setLocalTitle(currentCard.name)
    getCardActivity();
    if (currentCard?.checkList && currentCard?.checkList.length > 0) {
      setProgress(0);
      currentCard?.checkList.forEach((e:any) => {
        if (e.cliIsChecked)
          setProgress((p) => p + (1 / currentCard?.checkList.length) * 100);
      });
    }
  }
}, [currentCard]);
useEffect(()=>{
  return ()=>{
    dispatch(setCurrentCard({}));
  }
},[]);
  const getCurrentCard = async () => {
    const card = await cardService.getCardById(boardId, cardId);
    if (card.status && card.status == 200) {
      // dispatch(setCurrentCard(card.data[Object.keys(card.data)[0]]));
      let cardData = card.data[Object.keys(card.data)[0]];
      console.log(cardData);
      
      var fetchedCard:Card = {name:cardData?.name,
        id:cardData?.id,
        listId:cardData?.list_id,
        description:cardData?.description,
        priority:cardData?.priority,
        users:cardData?.users,
        dueDate:cardData?.due_date,
        reminderDate:cardData?.reminder_date,
        complete:cardData?.complete,
        isFixed:cardData?.isFixed,
        position:cardData?.position,
        tags:cardData?.tags,
        checkList:cardData?.checkList,
        comments:cardData?.comments
      };

      dispatch(setCurrentCard(fetchedCard));
      getAllBoardTag();
      if (cardData?.reminder_date)
        setReminderDate(
          new Date(
            dateService.FromUTCToLocal(
              cardData.reminder_date
            )
          )
        );
      if (cardData?.due_date)
        setDueDate(
          new Date(
            dateService.FromUTCToLocal(
              cardData.due_date
            )
          )
        );
    }
  };
  const getAllBoardTag = async () => {
    const allTag = await boardService.getAllTag(boardId);
    if (allTag.status && allTag.status == 200) {
      dispatch(setAllBoardTag(allTag.data));
    } else {
      dispatch(setAllBoardTag([]));
    }
  };
  const searchBoardTag = async (query:string) => {
    const allTag = await boardService.searchBoardTag(boardId,query);
    if (allTag.status && allTag.status == 200) {
      dispatch(setAllBoardTag(allTag.data));
    } else {
      dispatch(setAllBoardTag([]));
    }
  };
  const getCardActivity = async () => {
    const activities = await cardService.getCardActivity({
      boardId,
      listId,
      cardId: currentCard.id,
    });
      if (activities.status && activities.status == 200) {
      const activity = activities.data.map((e:any)=>{return {id:e.id,user:e.full_name,action:e.activity,timestamp:e.created_date}})
      setActivities(activity);
    }
  };
  const setCardName = async (cardName:any) => {
    // setCardNamEdit(false);
    const card = await cardService.editCard({
      name: cardName,
      cardId: currentCard.id,
      listId,
      boardId,
    });
    if (card.status && card.status == 200) {
      dispatch(setCurrentCard({...currentCard,name:cardName}))
    }
  };
  const handleAddTag = (label: string, color: string) => {
    const newTag = {
      id: Date.now().toString(),
      label,
      color,
    };
    setTags([...tags, newTag]);
    toast.success('Tag added successfully');
  };

  const handleRemoveTag = (tagId: string) => {
    setTags(tags.filter((tag) => tag.id !== tagId));
    toast.success('Tag removed');
  };
  const setDueDateCall = async (date: any) => {
    const editedCard = await cardService.editCard({
      dueDate: date,
      boardId,
      listId,
      cardId: currentCard?.id,
    });
    if (editedCard.status && editedCard.status == 200) {
      dispatch(setCurrentCard({...currentCard,due_date:new Date(date).toISOString()}))
    }
  };
    const setReminderDateCall = async (date:any) => {
    const editedCard = await cardService.editCard({
      reminderDate: "" + date + "",
      boardId,
      listId,
      cardId: currentCard?.id,
    });
      if (editedCard.status && editedCard.status == 200) {
        const currentCardCopy = {...currentCard};
        currentCardCopy.reminder_date = new Date(date).toISOString()
        dispatch(setCurrentCard(currentCardCopy));
    }
  };
  const setPriority = async (priorityValue:any) => {
    console.log(priorityValue);
    const editedCard = await cardService.setCardPriority({
      priority: priorityValue.id,
      boardId,
      listId,
      cardId: currentCard?.id,
    });
    if (editedCard.status && editedCard.status == 200) {
      dispatch(setCurrentCard({...currentCard,priority:priorityValue.id}));
    }
  }
  const addUsersToCard = async (users:Array<any>) => {
    console.log(users);
    let usersParams = users.map(e => ({ user_id: e.id, role: (e.role) }))
    const card = await cardService.addUsers({ cardId, boardId, users:usersParams });
    if (card.status && card.status == 200) {
      const currentCardCopy = {...currentCard};
      currentCardCopy.users = users;
      dispatch(setCurrentCard(currentCardCopy));
    }
  };
  const addTagToCard = async(tags:Tag[], removedTags:Tag[] = [])=>{
    console.log(tags);
      let params = {
      tags,
      removedTags,
      boardId,
      cardId,
    //   boardTagId: tag.boardTagId,
    };
    const addedTag = await cardService.addTag(params);
    if (addedTag.status && addedTag.status == 200) {
      let currCard:any = polyfill.deepCopy(currentCard);
      let key = tags[0].boardTagId ? tags[0].boardTagId : addedTag.data.boardTagId;
      currCard.tags[key] = {
        tagId: addedTag.data.insertId,
        tagName: tags[0].name,
        color: tags[0].color,
      };
      dispatch(setCurrentCard(currCard));
      // const allBoardTagCopy = [];
      // for (var k in allBoardTag) {
      //   allBoardTagCopy[k] = polyfill.deepCopy(allBoardTag[k]);
      // }
      // allBoardTagCopy.push({
      //   id: addedTag.data.insertId,
      //   name: tag.name,
      //   color: tag.color,
      // });
      // dispatch(setAllBoardTag(allBoardTagCopy));
    }
  }
    const deleteTagFromCard = async(tagId:number)=>{
      let params = {
      tagId,
      boardId,
      cardId,
    };
    const deletedTag = await cardService.deleteTag(params);
    if (deletedTag.status && deletedTag.status == 200) {
      let currCard:any = polyfill.deepCopy(currentCard);
      const boardTag:any = Object.entries(currCard.tags).find((e:any)=> e[1].tagId == tagId);
      if(boardTag && boardTag.length > 0)
      delete currCard.tags[boardTag[0]];
      dispatch(setCurrentCard(currCard));
    }
  }
   const addCheckList = async (...param:any) => {
    console.log(param[0]);
    
    const name = param[0];
    const params = {
      cardId,
      boardId,
      title: name,
      isChecked: 0,
      position: 0,
    };    
    const addedCheckList = await checkListService.create(params);
    if (addedCheckList.status && addedCheckList.status == 200) {
      let currCard = polyfill.deepCopy(currentCard);
      if (currCard.hasOwnProperty("checkList") && currCard.checkList)
        currCard.checkList.push({
          cliId: addedCheckList.data.insertId,
          cliIsChecked: 0,
          cliName: name,
          cliPosition: 0,
        });
      dispatch(setCurrentCard(currCard));
    }
  };
  const deleteCheckList = async (checklistId:string) => {
    const deletedCheckList = await checkListService.delete({
      checkListId: checklistId,
      boardId,
      cardId,
    });
    if (deletedCheckList.status && deletedCheckList.status == 200) {
      let currCard = polyfill.deepCopy(currentCard);
      if (currCard.hasOwnProperty("checkList") && currCard.checkList)
        currCard.checkList = currCard.checkList.filter((e:any) => e.cliId != checklistId);
      dispatch(setCurrentCard(currCard));
    }
  };
    const handleAddUser = (users:User[]) => {
    console.log(users);
    const params  = {
      boardId,
      cardId,
      checkListId:userAddModal.id,
      userId: users[0].id || users[0].userId,
      roleId:3
    };
    const addedUser = checkListService.addUser(params);
    if (addedUser.status && addedUser.status == 200) {
      let currCard = polyfill.deepCopy(currentCard);
      if (currCard.hasOwnProperty("users") && currCard.users)
        currCard.users.push(users[0]);
      dispatch(setCurrentCard(currCard));
    }
    // onAssigneesChange(users);
    // toast.success(`${newUserName} has been assigned`);
  };
const handleRemoveUser = async (id:number) => {    
    const removedUser = await checkListService.removeUser({checkListId:userAddModal.id, userId:id, boardId, cardId});
    if (removedUser.status && removedUser.status == 200) {
      let currCard = polyfill.deepCopy(currentCard);
      let currentCheckList = currCard.checkList.find((e:any)=> (e.cliId || e.id) == userAddModal.id);
      console.log(currentCheckList);
      
      if(currentCheckList && currentCheckList.hasOwnProperty("user") && currentCheckList.user)
        delete currentCheckList.user;
        dispatch(setCurrentCard(currCard));
    };
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <CardHeader
        title={currentCard.name}
        status={currentCard.status}
        onTitleChange={setCardName}
        onStatusChange={setStatus}
      /> */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                <label className="text-sm text-muted-foreground flex items-center gap-1">
                  <IdCard className="h-3 w-3" />
                  Card Name
                </label>
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <Input
                    value={localTitle}
                    onChange={(e) => setLocalTitle(e.target.value)}
                    onBlur={handleSaveTitle}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                    autoFocus
                    className="flex-1"
                  />
                ) : (
                  <h1
                    onClick={() => setIsEditing(true)}
                    className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded flex-1"
                  >
                    {title}
                  </h1>
                )}
            </div>
            </div>
            {/* Metadata Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <CardMetadata
                dueDate={currentCard.dueDate}
                reminderDate={currentCard.reminderDate}
                priority={currentCard.priority}
                assignees={currentCard.users && Object.keys(currentCard.users).length > 0 ? Object.entries(currentCard.users).map((e:any)=> e[1]): []}
                onDueDateChange={setDueDateCall}
                onReminderDateChange={setReminderDateCall}
                onPriorityChange={setPriority}
                onAssigneesChange={addUsersToCard}
              />

              <Separator />

              {/* <CardTags
                tags={tags}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
              /> */}

              <Separator />

              <CardDescription
                description={description}
                onDescriptionChange={setDescription}
              />
            </div>

            {/* Tabs for Checklist and Comments */}
            <Tabs defaultValue="checklist" className="w-full">
              <TabsList className="w-full grid grid-cols-2 h-auto p-1">
                <TabsTrigger value="checklist" className="gap-2">
                  <CheckSquare className="h-4 w-4" />
                  Checklist
                </TabsTrigger>
                <TabsTrigger value="comments" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Comments
                </TabsTrigger>
              </TabsList>

              <TabsContent value="checklist" className="mt-4">
                <ChecklistSection existingCheckList={currentCard?.checkList} addEditCheckList={addCheckList} deleteCheckList={deleteCheckList} openUserModal={($event:any)=>{setExistingCheckListUser($event.user); setUserAddModal({isOpen:true,id:$event.id, name:$event.name})}}/>
              </TabsContent>

              <TabsContent value="comments" className="mt-4">
                <CommentsSection />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Activity Feed */}
          <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 mb-4">
                <CardUser 
                  assignees={currentCard.users && Object.keys(currentCard.users).length > 0 ? Object.entries(currentCard.users).map((e:any)=> e[1]): []}
                  onAssigneesChange={addUsersToCard}
                />
              </div>
               <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 mb-4">
                <CardTag 
                  tags={currentCard.tags && Object.keys(currentCard.tags).length > 0 ? Object.entries(currentCard.tags).map((e:any)=> e[1]): []}
                  onTagAdd={addTagToCard} onTagDelete={deleteTagFromCard} searchBoardTag={searchBoardTag} searchedBoardTag={allBoardTag}
                />
              </div>
            <div className="sticky top-24">
              <ActivityFeed activities={activities} />
            </div>
          </div>
        </div>
      </div>
      <UserAddModal
        open={userAddModal.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setUserAddModal({ isOpen: false, id: null, name: '' });
          }
        }}
        onAddUsers={handleAddUser}
        onRemoveUsers={(userId:number)=>{handleRemoveUser(userId)}}
        name={userAddModal.name}
        existingAssignees={existingCheckListUser} />
    </div>
  );
}
export default CardDetails;