import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import TripCard from "@/components/TripCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { createApiClient } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

/**
 * Feed Page - Social Feed with Trip Posts
 * 
 * WHAT IT DOES:
 * - Displays Instagram-style feed of trip posts from users
 * - Stories carousel at top shows recent trip highlights
 * - Infinite scroll loads more posts as user scrolls
 * - Create trip button navigates to trip planner
 * 
 * HOW IT WORKS:
 * - Stories data shown in horizontal scrollable carousel
 * - Trip posts displayed in responsive grid
 * - Each post shows image, destination, stats, and interactions
 * 
 * BACKEND INTEGRATION:
 * - GET /api/feed → fetch paginated trip posts
 * - GET /api/stories → fetch active stories (24hr expiry)
 * - WebSocket connection for real-time updates
 * - When user likes/comments → backend broadcasts to all clients
 */

const Feed = () => {
  const navigate = useNavigate();

  // Sample stories data
  const stories = [
    { id: 1, name: "Sarah", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    { id: 2, name: "Marcus", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" },
    { id: 3, name: "Emma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },
    { id: 4, name: "Alex", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    { id: 5, name: "Sofia", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia" },
  ];

  const { token } = useAuth();
  const api = createApiClient({ token });
  const [items, setItems] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const qs = cursor ? `?cursor=${cursor}` : "";
      const res = await api.get<{ items: any[]; nextCursor: string | null }>(`/api/posts/${qs}`);
      setItems((prev) => [...prev, ...res.items]);
      setCursor(res.nextCursor);
    } catch (error) {
      console.error("Failed to load posts:", error);
    }
    setLoading(false);
  };

  useEffect(() => { loadMore(); // initial
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && cursor !== null) loadMore();
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [cursor]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Stories Carousel */}
          <div className="mb-8 animate-fade-in">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {/* Add Your Story */}
              <div className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer group">
                <div className="w-20 h-20 rounded-full gradient-hero flex items-center justify-center shadow-smooth group-hover:shadow-elevated transition-smooth">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs font-medium">Add Story</span>
              </div>

              {/* Story Items */}
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer group"
                >
                  <div className="p-1 rounded-full bg-gradient-to-tr from-primary via-secondary to-accent">
                    <div className="bg-background p-1 rounded-full">
                      <Avatar className="w-16 h-16 border-2 border-background">
                        <AvatarImage src={story.avatar} />
                        <AvatarFallback>{story.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  <span className="text-xs font-medium">{story.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trip Posts Grid */}
          <div className="space-y-6">
            {items.map((post, index) => (
              <div key={post.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <TripCard
                  imageUrl={post.mediaUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"}
                  destination={post.caption || "Trip"}
                  description={post.caption}
                  userName={post.author?.name || "Traveler"}
                  userAvatar={post.author?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"}
                  likes={post.likes}
                  comments={post.comments?.length || 0}
                  duration={""}
                  budget={""}
                />
              </div>
            ))}
            <div ref={sentinelRef} />
            {loading && <div className="text-center text-muted-foreground">Loading…</div>}
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <Button
        onClick={() => navigate("/planner")}
        className="fixed bottom-8 right-8 rounded-full w-14 h-14 shadow-elevated gradient-hero text-white hover:scale-110 transition-smooth"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default Feed;
