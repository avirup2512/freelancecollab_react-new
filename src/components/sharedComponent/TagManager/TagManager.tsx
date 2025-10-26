import { useCallback, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../ui/_dialog";
import { Input } from "../../ui/_input";
import { Button } from "../../ui/_button";
import { Badge } from "../../ui/_badge";
import { Checkbox } from "../../ui/_checkbox";
import { ScrollArea } from "../../ui/_scroll-area";
import { X, Plus, Search } from "lucide-react";
import { type Tag } from "../../../interfaces/components/Application";
import debounce from "lodash.debounce";

const PRESET_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#eab308", // yellow
  "#84cc16", // lime
  "#22c55e", // green
  "#10b981", // emerald
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#0ea5e9", // sky
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#a855f7", // purple
  "#d946ef", // fuchsia
  "#ec4899", // pink
];

interface TagManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exitingTags:Tag[];
  searchedBoardTag:Tag[];
  searchTag: (searchQuery:string) => void;
  appliedTagIds?: string[];
  onAppliedTagsChange?: (tagIds: string[]) => void;
  submitAddedTag?: (tag:Tag[],removedTag:Tag[]) => void;
  submitDeletedTag?: (tagId:number) => void;
}

export function TagManagerModal({ 
  open, 
  onOpenChange, 
  exitingTags,
  appliedTagIds = [],
  searchedBoardTag=[],
  onAppliedTagsChange,
  submitAddedTag,
  submitDeletedTag,
  searchTag,
}: TagManagerModalProps) {
  const setSearchMethod = (query:string)=> {
    console.log(searchTag);
    
    searchTag(query);
  }
  const debouncedTagSearch = useCallback(debounce(setSearchMethod,400),[]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [removedTags, setRemovedTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [showSearchTag, setShowSearchTag] = useState(true);
    useEffect(()=>{  
      if(exitingTags)    
      setTags(exitingTags);
    },[exitingTags])

    useEffect(()=>{  
      setRemovedTags([]);
      setSearchQuery("");
    },[open])
    useEffect(()=>{
      if(searchQuery && searchQuery.length > 0)
      debouncedTagSearch(searchQuery);
    },[searchQuery]);


  const handleAddTag = () => {
    if (newTagName.trim()) {
      const newTag: Tag = {
        id: Date.now().toString(),
        tagName: newTagName.trim(),
        color: selectedColor,
      };
      // if(submitAddedTag)
        // submitAddedTag([newTag]);
      setTags([...tags, newTag]);
      setNewTagName("");
    }
  };

  const handleDeleteTag = (id: number,tag:Tag) => {
    // if(submitDeletedTag)
    // submitDeletedTag(id);
    setRemovedTags((prev) => {prev.push(tag); return prev});
    setTags(tags.filter((tag) => tag.tagId !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTag();
    }
  };

  const handleToggleTag = (tagId: string) => {
    console.log(tagId);
    
    if (!onAppliedTagsChange) return;
    
    const newAppliedIds = appliedTagIds.includes(tagId)
      ? appliedTagIds.filter(id => id !== tagId)
      : [...appliedTagIds, tagId];
    
    onAppliedTagsChange(newAppliedIds);
  };

  const handleSelectAll = () => {
    if (!onAppliedTagsChange) return;
    searchedBoardTag.forEach((e)=>{
      handleToggleTag(e.id);
    })
    setTags([...tags, ...searchedBoardTag]);
    const allFilteredIds = searchedBoardTag.map(tag => tag.id);
    const allSelected = allFilteredIds.every(id => appliedTagIds.includes(id));
    if (allSelected) {
      // Deselect all filtered tags
      const newAppliedIds = appliedTagIds.filter(id => !allFilteredIds.includes(id));
      onAppliedTagsChange(newAppliedIds);
    } else {
      // Select all filtered tags
      const newAppliedIds = Array.from(new Set([...appliedTagIds, ...allFilteredIds]));
      onAppliedTagsChange(newAppliedIds);
    }
  };

  const handleClearSelection = () => {
    if (!onAppliedTagsChange) return;
    
    const filteredIds = searchedBoardTag.map(tag => tag.id);
    const newAppliedIds = appliedTagIds.filter(id => !filteredIds.includes(id));
    onAppliedTagsChange(newAppliedIds);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0">
        <div className="px-6 pt-6">
          <DialogHeader>
            <DialogTitle>Manage Tags</DialogTitle>
            <DialogDescription>
              Add, search, and organize your tags with custom colors {searchedBoardTag.length}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 flex flex-col gap-6 overflow-scroll px-6 pb-6 pt-4 min-h-0">
          {/* Search */}
                  {
                      showSearchTag &&
                      <div className="space-y-3 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Search Results with Multiselect */}
            {searchQuery && searchedBoardTag.length > 0 && (
              <div className="border rounded-lg p-3 space-y-3 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {searchedBoardTag.length} result{searchedBoardTag.length !== 1 ? "s" : ""}
                    {searchedBoardTag.filter(tag => appliedTagIds.includes(tag.id)).length > 0 && 
                      ` (${searchedBoardTag.filter(tag => appliedTagIds.includes(tag.id)).length} selected)`}
                  </span>
                  <div className="flex gap-2">
                    {searchedBoardTag.some(tag => appliedTagIds.includes(tag.id)) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearSelection}
                      >
                        Clear
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSelectAll}
                    >
                      {searchedBoardTag.every(tag => appliedTagIds.includes(tag.id))
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                  </div>
                </div>
                <ScrollArea className="h-40">
                  <div className="space-y-2 pr-4">
                    {searchedBoardTag.map((tag) => {
                      const isApplied = appliedTagIds.includes(tag.id);
                      return (
                        <label
                          key={tag.id}
                          className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                          <Checkbox
                            checked={isApplied}
                            onCheckedChange={() => handleToggleTag(tag.id)}
                          />
                          <Badge
                            className="pointer-events-none"
                            style={{
                              backgroundColor: tag.color,
                              color: "#ffffff",
                              border: "none",
                            }}
                          >
                            {tag.name}
                          </Badge>
                        </label>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            )}

            {searchQuery && searchedBoardTag.length === 0 && (
              <div className="text-center py-4 text-muted-foreground border rounded-lg bg-muted/10">
                No tags found matching "{searchQuery}"
              </div>
            )}
                      </div>
                  }

          {/* Add New Tag */}
          <div className="space-y-3 flex-shrink-0">
            <label className="block">Add New Tag</label>
            <div className="flex gap-2">
              <Input
                placeholder="Tag name..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleAddTag} size="icon">
                <Plus className="size-4" />
              </Button>
            </div>

            {/* Color Picker */}
            <div className="space-y-2">
              <label className="block">Color</label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`size-8 rounded-md transition-all ${
                      selectedColor === color
                        ? "ring-2 ring-offset-2 ring-foreground scale-110"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* All Tags List */}
          <div className="space-y-2 flex-1 min-h-0 flex flex-col">
            <label className="block flex-shrink-0">
              All Tags ({tags && tags.length})
            </label>
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                {tags && tags.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No tags yet. Add your first tag above!
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 pr-4 pb-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        className="pl-3 pr-1 py-1.5 gap-2 group"
                        style={{
                          backgroundColor: tag.color,
                          color: "#ffffff",
                          border: "none",
                        }}
                      >
                        <span>{tag?.tagName || tag?.name}</span>
                        <button
                          onClick={() => handleDeleteTag(tag.tagId, tag)}
                          className="size-5 rounded-sm hover:bg-black/20 flex items-center justify-center transition-colors"
                          aria-label={`Delete ${tag?.tagName} tag`}
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 flex-1 flex flex-col gap-6 overflow-hidden px-6 pb-6 pt-4 min-h-0">
          <div className="flex gap-2 pt-2">
              <Button onClick={() => { if (submitAddedTag) submitAddedTag(tags,removedTags); onOpenChange(false)}} className="bg-blue-600 hover:bg-blue-700 gap-2">
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
