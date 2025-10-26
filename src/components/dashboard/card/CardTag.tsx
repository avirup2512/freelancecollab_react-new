import { useEffect, useState } from 'react';
import { Tag, User2,UserIcon, X } from 'lucide-react';
import { Button } from '../../ui/_button';
import { TagManagerModal } from '../../sharedComponent/TagManager/TagManager';
import { Badge } from '../../ui/_badge';
import type { Tag as TagType } from '../../../interfaces/components/Card';
import { useParams } from 'react-router-dom';


function CardTag({
  tags,
  searchedBoardTag,
  onTagAdd,
  onTagDelete,
  searchBoardTag
}: {tags:any[],searchedBoardTag:any[],onTagAdd:Function,onTagDelete:Function,searchBoardTag:Function}) {
    const {boardId,listId,cardId} = useParams();
    const [userAddModal, setUserAddModal] = useState<{ isOpen: boolean; id: number | null; name: string }>({
    isOpen: false,
    id: null,
    name: ''
  });
  useEffect(()=>{
    console.log(tags);
    setAppliedTagIds(tags)
  },[tags])
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [appliedTagIds, setAppliedTagIds] = useState<string[]>(tags);

  const addTagToCard = async(tags:TagType[] = [], removedTag:TagType[] = [])=>{
    onTagAdd(tags,removedTag);
    console.log(removedTag);
    console.log(tags);
  }
  const deleteTagFromCard = async(tagId:number)=>{
    onTagDelete(tagId)
    console.log(tags);
  }
  const searchQuery = (query:string)=>{
    searchBoardTag(query);
  }

  return (
    <>
        {/* Assignees */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center gap-1">
            <Tag className="h-3 w-3" />
            Tags ({tags.length})
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {tags.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg border">
                    {Array.isArray(tags) && tags.length > 0 && tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1.5 px-2.5 py-1">
                        {tag.tagName}
                        <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:bg-slate-300 rounded-full p-0.5 transition-colors"
                        >
                        <X className="h-3 w-3" />
                        </button>
                    </Badge>
                    ))}
                </div>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">No tags yet</span>
            )}
            <Button onClick={()=>{setIsTagModalOpen(true)}} size="sm" className="shrink-0">
              <UserIcon className="h-4 w-4" /> Manage Tags
            </Button>
            <TagManagerModal
            open={isTagModalOpen}
            exitingTags={tags}
            onOpenChange={setIsTagModalOpen}
            appliedTagIds={appliedTagIds}
            onAppliedTagsChange={setAppliedTagIds}
            submitAddedTag={addTagToCard}
            submitDeletedTag={deleteTagFromCard}
            searchTag={searchQuery}
            searchedBoardTag={searchedBoardTag}
            />
          </div>
        </div>
    </>
  );
}
export default CardTag;
