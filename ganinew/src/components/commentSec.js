import { useState, useEffect } from "react";
import { Heart, Reply, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// const mockComments = [
//   {
//     id: "1",
//     author: "GameMaster42",
//     content: "This looks absolutely incredible! The graphics have come so far.",
//     timestamp: "2 hours ago",
//     likes: 12,
//     isLiked: false,
//     replies: [
//       {
//         id: "1-1",
//         author: "PixelPro",
//         content: "Totally agree! The lighting effects are mind-blowing.",
//         timestamp: "1 hour ago",
//         likes: 3,
//         isLiked: true,
//       }
//     ]
//   },
//   {
//     id: "2",
//     author: "AnimeOtaku2024",
//     content: "Can't wait for the release! Been following this development for years.",
//     timestamp: "4 hours ago",
//     likes: 8,
//     isLiked: false,
//   },
//   {
//     id: "3",
//     author: "RPGLover",
//     content: "The character customization options shown in the trailer look amazing. Hope there's good voice acting too!",
//     timestamp: "6 hours ago",
//     likes: 15,
//     isLiked: true,
//   }
// ];

const CommentItem = ({ comment, isReply = false }) => {
  const [likes, setLikes] = useState(comment.likes);
  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleReply = () => {
    if (replyText.trim()) {
      console.log("Reply:", replyText);
      setReplyText("");
      setShowReplyForm(false);
    }
  };

  return (

    <div
      className={`space-y-3 ${isReply ? "ml-8 border-l-2 border-border pl-4" : ""
        }`}
    >

      <div className="flex gap-3">
        {
          comment.user.userinfo.photo ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.user.userinfo.photo} />
              <AvatarFallback className="text-xs">
                {/* {comment.author.slice(0, 2).toUpperCase()} */}
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png" />
              <AvatarFallback className="text-xs">
                {/* {comment.author.slice(0, 2).toUpperCase()} */}
              </AvatarFallback>
            </Avatar>
          )
        }


        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{comment.user.username}</span>
            {/* <span className="text-xs text-muted-foreground">
              {comment.timestamp}
            </span> */}
          </div>

          <p className="text-sm text-foreground">{comment.detail}</p>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`h-auto p-1 ${isLiked ? "text-red-500" : "text-muted-foreground"
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
        </div>
      </div>

      {/* {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )} */}
    </div>
  );
};

export const CommentSection = ({ id }) => {
  const postid = id
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await fetch(`/api/comment/${postid}`)
        const data = await res.json()
        setComments(data)
      } catch (err) {
        console.log("Error is : ", err)
      }
    }
    fetchdata()
  }, [])
  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        author: "CurrentUser",
        content: newComment,
        likes: 0,
        isLiked: false,
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };
  const checkdata = () => {
    comments.map((i) => {
      console.log(i.user.username)
    })
  }
  return (
    <Card className="p-6">
      <button onClick={checkdata} >jjjjj</button>
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
            <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
              Post Comment
            </Button>
          </div>
        </div>

        <Separator />

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((i, index) => (
            <div key={index}>
              <CommentItem key={i.id} comment={i} />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};