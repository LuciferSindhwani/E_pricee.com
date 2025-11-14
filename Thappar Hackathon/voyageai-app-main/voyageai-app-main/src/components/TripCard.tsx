import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Bookmark, MapPin } from "lucide-react";
import { useState } from "react";

/**
 * TripCard Component
 * 
 * WHAT IT DOES:
 * - Displays a single trip post in Instagram-style card format
 * - Shows trip image, destination, creator info, and engagement metrics
 * - Allows users to like, comment, and save trips
 * 
 * HOW IT WORKS:
 * - Props include trip data (image, destination, user, stats)
 * - Local state manages like/save toggle states
 * - In production, these interactions would:
 *   1. Update backend via API call (POST /api/trips/:id/like)
 *   2. Update database likes/saves count
 *   3. Create notification for trip creator
 *   4. Return updated count to client
 * - CSS transitions provide smooth hover and click feedback
 * 
 * DATA FLOW (when integrated):
 * User clicks like → API request → Database update → WebSocket broadcast → 
 * UI update across all clients viewing this trip
 */

interface TripCardProps {
  imageUrl: string;
  destination: string;
  description: string;
  userName: string;
  userAvatar?: string;
  likes: number;
  comments: number;
  duration: string;
  budget: string;
}

const TripCard = ({
  imageUrl,
  destination,
  description,
  userName,
  userAvatar,
  likes,
  comments,
  duration,
  budget,
}: TripCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    // TODO: API call to backend
    // fetch(`/api/trips/${tripId}/like`, { method: 'POST' })
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: API call to backend
    // fetch(`/api/trips/${tripId}/save`, { method: 'POST' })
  };

  return (
    <Card className="overflow-hidden shadow-smooth hover:shadow-elevated transition-smooth">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{userName}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{destination}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={destination}
          className="w-full h-full object-cover hover:scale-105 transition-smooth cursor-pointer"
        />
      </div>

      {/* Actions */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="transition-smooth hover:scale-110"
            >
              <Heart
                className={`w-6 h-6 ${
                  isLiked ? "fill-red-500 text-red-500" : "text-foreground"
                }`}
              />
            </button>
            <button className="transition-smooth hover:scale-110">
              <MessageCircle className="w-6 h-6" />
            </button>
          </div>
          <button
            onClick={handleSave}
            className="transition-smooth hover:scale-110"
          >
            <Bookmark
              className={`w-6 h-6 ${
                isSaved ? "fill-primary text-primary" : "text-foreground"
              }`}
            />
          </button>
        </div>

        {/* Engagement Stats */}
        <div className="space-y-1">
          <p className="font-semibold text-sm">{likeCount} likes</p>
          <p className="text-sm">
            <span className="font-semibold">{userName}</span>{" "}
            <span className="text-muted-foreground">{description}</span>
          </p>
          {comments > 0 && (
            <button className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
              View all {comments} comments
            </button>
          )}
        </div>

        {/* Trip Info */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {duration}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {budget}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default TripCard;
