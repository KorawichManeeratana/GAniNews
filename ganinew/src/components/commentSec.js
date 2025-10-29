import { useState, useEffect } from "react";
import { Heart, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const CommentItem = ({ comment, postId, refreshComments, isReply = false }) => {
  const [likes, setLikes] = useState(comment.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;

    try {
      await fetch(`/api/comment/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          detail: replyText,
          user_id: 1,
          parent_id: comment.id,
        }),
      });

      setReplyText("");
      setShowReplyForm(false);
      refreshComments();
    } catch (err) {
      console.error("Error posting reply:", err);
    }
  };

  return (
    <div
      className={`space-y-3 ${
        isReply ? "ml-8 border-l-2 border-border pl-4" : ""
      }`}
    >
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={
              comment.user?.userinfo?.photo ||
              "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
            }
          />
          <AvatarFallback className="text-xs">
            {comment.user?.username?.slice(0, 2).toUpperCase() || "NA"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">
              {comment.user?.username || "Unknown"}
            </span>
          </div>

          <p className="text-sm text-foreground">{comment.detail}</p>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`h-auto p-1 ${
                isLiked ? "text-red-500" : "text-muted-foreground"
              }`}
              onClick={handleLike}
            >
              <Heart
                className={`h-3 w-3 mr-1 ${isLiked ? "fill-current" : ""}`}
              />
              <span className="text-xs">{likes}</span>
            </Button>

            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-muted-foreground"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                <Reply className="h-3 w-3 mr-1" />
                <span className="text-xs">Reply</span>
              </Button>
            )}
          </div>

          {showReplyForm && (
            <div className="space-y-2 mt-3">
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleReply}>
                  Reply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Render replies */}
          {Array.isArray(comment.replies) && comment.replies.length > 0 && (
            <div className="space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  refreshComments={refreshComments}
                  isReply
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const CommentSection = ({ id }) => {
  const postId = id;
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comment/${postId}`);
      
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
    }
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      await fetch(`/api/comment/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          detail: newComment,
          user_id: 1,
          parent_id: null,
        }),
      });

      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">
          Comments ({comments.length})
        </h3>

        {/* New Comment Form */}
        <div className="space-y-3">
          <Textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
            >
              Post Comment
            </Button>
          </div>
        </div>

        <Separator />

        {/* Comments List */}
        <div className="space-y-6">
          {Array.isArray(comments) && comments.length > 0 ? (
            comments.map((c) => (
              <CommentItem
                key={c.id}
                comment={c}
                postId={postId}
                refreshComments={fetchComments}
              />
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>
      </div>
    </Card>
  );
};
