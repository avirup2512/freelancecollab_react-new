import { useState } from 'react';
import { MessageSquare, Send, Paperclip, Bold, Italic, List, AtSign, Smile } from 'lucide-react';
import { Button } from '../../ui/_button';
import { Textarea } from '../../ui/_textarea';
import { Avatar, AvatarFallback } from '../../ui/_avatar';
import { Separator } from '../../ui/_separator';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  user: string;
  initials: string;
  content: string;
  timestamp: Date;
}

function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: 'Avriup Chakraborty',
      initials: 'AC',
      content: 'I am working on this task and making great progress with the new design implementation.',
      timestamp: new Date('2025-09-24T18:12:00'),
    },
  ]);
  const [newComment, setNewComment] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        user: 'Avriup Chakraborty',
        initials: 'AC',
        content: newComment.trim(),
        timestamp: new Date(),
      };
      setComments([...comments, comment]);
      setNewComment('');
      setIsFocused(false);
      toast.success('Comment posted');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-4 w-4" />
        <h3 className="font-medium">Comments</h3>
        <Button variant="outline" size="sm" className="ml-auto">
          Add Comment
        </Button>
      </div>

      {/* Existing Comments */}
      <div className="space-y-4 mb-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback>{comment.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{comment.user}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-foreground">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      {/* New Comment Input */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div
              className={`border rounded-lg transition-all ${
                isFocused ? 'ring-2 ring-ring ring-offset-2' : ''
              }`}
            >
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onFocus={() => setIsFocused(true)}
                className="min-h-[100px] border-0 resize-none focus-visible:ring-0"
              />

              {isFocused && (
                <>
                  <Separator />
                  <div className="p-3 flex items-center justify-between bg-gray-50 rounded-b-lg">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Bold">
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Italic">
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="List">
                        <List className="h-4 w-4" />
                      </Button>
                      <Separator orientation="vertical" className="mx-2 h-8" />
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Mention">
                        <AtSign className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Emoji">
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Attach">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setNewComment('');
                          setIsFocused(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={!newComment.trim()}
                        className="gap-2"
                      >
                        <Send className="h-4 w-4" />
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {!isFocused && (
          <p className="text-xs text-muted-foreground ml-[52px]">
            Tip: Use @ to mention team members, formatting toolbar available when typing
          </p>
        )}
      </div>
    </div>
  );
}
export default CommentsSection;
