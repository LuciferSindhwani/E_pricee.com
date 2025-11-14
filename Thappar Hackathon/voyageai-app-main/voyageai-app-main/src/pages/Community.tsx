import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users, TrendingUp, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { createApiClient } from "@/lib/api";

/**
 * Community Page - Forums & Discussions
 * 
 * WHAT IT DOES:
 * - Community forum with discussion threads
 * - Topic categories (destinations, tips, gear, etc.)
 * - Search functionality to find relevant discussions
 * - Trending topics and popular threads
 * 
 * HOW IT WORKS:
 * - Displays forum categories and recent threads
 * - Users can search, filter, and sort discussions
 * - Click on thread opens detailed discussion view
 * - Create new thread button starts new discussion
 * 
 * BACKEND INTEGRATION:
 * - GET /api/community/threads → fetch forum threads
 * - GET /api/community/categories → fetch topic categories
 * - POST /api/community/threads → create new thread
 * - WebSocket for real-time thread updates
 */

const Community = () => {
  const { token } = useAuth();
  const api = createApiClient({ token });
  const [discover, setDiscover] = useState<any[]>([]);
  const [carpools, setCarpools] = useState<any[]>([]);
  const [newCarpool, setNewCarpool] = useState({ tripId: "", seats: 3, from: "", to: "", departure: "" });

  useEffect(() => {
    api.get<{ items: any[] }>(`/api/trips/discover`).then((r) => setDiscover(r.items));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCarpools = async (tripId: string) => {
    const r = await api.get<{ items: any[] }>(`/api/trips/${tripId}/carpools`);
    setCarpools(r.items);
  };

  const createCarpool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCarpool.tripId) return;
    await api.post(`/api/trips/${newCarpool.tripId}/carpools`, newCarpool);
    await loadCarpools(newCarpool.tripId);
  };
  // Sample categories
  const categories = [
    { id: 1, name: "Destinations", icon: "🌍", threads: 234, color: "bg-blue-500" },
    { id: 2, name: "Travel Tips", icon: "💡", threads: 189, color: "bg-green-500" },
    { id: 3, name: "Gear & Equipment", icon: "🎒", threads: 145, color: "bg-purple-500" },
    { id: 4, name: "Food & Culture", icon: "🍜", threads: 167, color: "bg-orange-500" },
  ];

  // Sample threads
  const threads = [
    {
      id: 1,
      title: "Best hidden gems in Southeast Asia?",
      author: "TravelBug",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TravelBug",
      category: "Destinations",
      replies: 23,
      views: 456,
      timestamp: "2 hours ago",
      trending: true,
    },
    {
      id: 2,
      title: "Budget backpacking tips for Europe",
      author: "WandererSam",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=WandererSam",
      category: "Travel Tips",
      replies: 45,
      views: 892,
      timestamp: "5 hours ago",
      trending: true,
    },
    {
      id: 3,
      title: "Essential camera gear for travel photography",
      author: "PhotoNomad",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PhotoNomad",
      category: "Gear & Equipment",
      replies: 18,
      views: 234,
      timestamp: "1 day ago",
      trending: false,
    },
    {
      id: 4,
      title: "Must-try street food in Thailand",
      author: "FoodieExplorer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FoodieExplorer",
      category: "Food & Culture",
      replies: 67,
      views: 1234,
      timestamp: "2 days ago",
      trending: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 animate-slide-up">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Travel <span className="text-primary">Community</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect with fellow travelers, share experiences, and get advice
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Carpool & Join Requests */}
              <Card className="p-6 animate-scale-in">
                <h3 className="font-semibold text-lg mb-4">Find & Create Carpools</h3>
                <div className="space-y-4">
                  <form onSubmit={createCarpool} className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    <Input placeholder="Trip ID" value={newCarpool.tripId} onChange={(e) => setNewCarpool({ ...newCarpool, tripId: e.target.value })} />
                    <Input placeholder="From" value={newCarpool.from} onChange={(e) => setNewCarpool({ ...newCarpool, from: e.target.value })} />
                    <Input placeholder="To" value={newCarpool.to} onChange={(e) => setNewCarpool({ ...newCarpool, to: e.target.value })} />
                    <Input placeholder="Departure (YYYY-MM-DD)" value={newCarpool.departure} onChange={(e) => setNewCarpool({ ...newCarpool, departure: e.target.value })} />
                    <Button type="submit" className="gradient-hero text-white">Post</Button>
                  </form>

                  <div className="grid gap-3">
                    {carpools.map((c) => (
                      <Card key={c.id} className="p-4 flex items-center justify-between">
                        <div>
                          <div className="font-medium">{c.from} → {c.to}</div>
                          <div className="text-sm text-muted-foreground">Seats: {c.seats} • {new Date(c.departure).toDateString()}</div>
                        </div>
                        <Button variant="outline">Request Seat</Button>
                      </Card>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Search Bar */}
              <div className="relative animate-fade-in">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search discussions..."
                  className="pl-10"
                />
              </div>

              {/* Action Bar */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Recent Discussions</h2>
                <Button className="gradient-hero text-white">
                  New Thread
                </Button>
              </div>

              {/* Threads List */}
              <div className="space-y-4">
                {threads.map((thread, index) => (
                  <Card
                    key={thread.id}
                    className="p-6 hover:shadow-elevated transition-smooth cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={thread.avatar} />
                        <AvatarFallback>{thread.author.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        {/* Title & Trending Badge */}
                        <div className="flex items-start gap-2 mb-2">
                          <h3 className="font-semibold text-lg hover:text-primary transition-smooth">
                            {thread.title}
                          </h3>
                          {thread.trending && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Trending
                            </Badge>
                          )}
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{thread.author}</span>
                          <Badge variant="outline">{thread.category}</Badge>
                          <span>{thread.timestamp}</span>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-6 mt-3 text-sm">
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {thread.replies} replies
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {thread.views} views
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Discover Trips */}
              <Card className="p-6 animate-scale-in">
                <h3 className="font-semibold text-lg mb-4">Discover Trips</h3>
                <div className="space-y-3">
                  {discover.map((t) => (
                    <button key={t.id} onClick={() => loadCarpools(t.id)} className="w-full text-left p-3 rounded-lg hover:bg-muted">
                      <div className="font-medium">{t.title}</div>
                      <div className="text-sm text-muted-foreground">by {t.owner?.name || 'Traveler'}</div>
                    </button>
                  ))}
                </div>
              </Card>
              {/* Categories */}
              <Card className="p-6 animate-scale-in">
                <h3 className="font-semibold text-lg mb-4">Categories</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-smooth"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <Badge variant="secondary">{category.threads}</Badge>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Community Stats */}
              <Card className="p-6 animate-scale-in" style={{ animationDelay: "0.1s" }}>
                <h3 className="font-semibold text-lg mb-4">Community Stats</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-primary">15,234</div>
                    <div className="text-sm text-muted-foreground">Active Members</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-secondary">2,456</div>
                    <div className="text-sm text-muted-foreground">Discussions</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-accent">45,678</div>
                    <div className="text-sm text-muted-foreground">Posts</div>
                  </div>
                </div>
              </Card>

              {/* Join CTA */}
              <Card className="p-6 gradient-card animate-scale-in" style={{ animationDelay: "0.2s" }}>
                <h3 className="font-semibold text-lg mb-2">Join the Community</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Share your travel stories and connect with thousands of travelers
                </p>
                <Button className="w-full gradient-hero text-white">
                  Get Started
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Community;
