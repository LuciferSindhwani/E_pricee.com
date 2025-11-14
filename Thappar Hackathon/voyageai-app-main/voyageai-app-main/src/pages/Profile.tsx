import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { createApiClient } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Award, Settings, Grid, Bookmark } from "lucide-react";

/**
 * Profile Page - User Profile & Trip History
 * 
 * WHAT IT DOES:
 * - Displays user profile with avatar, bio, stats
 * - Shows trip history in grid layout (past & upcoming trips)
 * - Achievement badges and gamification elements
 * - Saved trips collection
 * 
 * HOW IT WORKS:
 * - Fetches user data from backend on mount
 * - Tabs switch between different content views
 * - Grid displays trip thumbnails with hover effects
 * - Edit button navigates to profile settings
 * 
 * BACKEND INTEGRATION:
 * - GET /api/users/:userId → fetch profile data
 * - GET /api/users/:userId/trips → fetch user's trips
 * - GET /api/users/:userId/saved → fetch saved trips
 * - Achievements calculated by backend based on activity
 */

const Profile = () => {
  const [activeTab, setActiveTab] = useState("trips");
  const { token } = useAuth();
  const api = createApiClient({ token });
  const [me, setMe] = useState<any>(null);
  const [ach, setAch] = useState<any[]>([]);
  useEffect(() => {
    api.get<{ user: any; achievements: any[] }>(`/api/profile/me`).then((r) => { setMe(r.user); setAch(r.achievements); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sample user data with safe defaults
  const user = {
    name: me?.name || "Traveler",
    username: me?.username || "@user",
    avatar: me?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
    bio: me?.bio || "",
    location: me?.location || "",
    stats: me?.stats || { trips: 0, followers: 0, following: 0 }
  };

  // Sample trips
  const trips = [
    { id: 1, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4", destination: "Swiss Alps", date: "Dec 2024" },
    { id: 2, image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e", destination: "Bali", date: "Nov 2024" },
    { id: 3, image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34", destination: "Paris", date: "Oct 2024" },
    { id: 4, image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1", destination: "Santorini", date: "Sep 2024" },
    { id: 5, image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828", destination: "Iceland", date: "Aug 2024" },
    { id: 6, image: "https://images.unsplash.com/photo-1494783367193-149034c05e8f", destination: "Maldives", date: "Jul 2024" },
  ];

  // Sample achievements
  const achievements = [
    { id: 1, icon: "🌍", title: "Globe Trotter", description: "Visited 10+ countries" },
    { id: 2, icon: "⛰️", title: "Mountain Climber", description: "Completed 5 mountain hikes" },
    { id: 3, icon: "📸", title: "Content Creator", description: "50+ posts with 10K+ likes" },
    { id: 4, icon: "👥", title: "Social Butterfly", description: "Joined 10+ group trips" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <Card className="p-8 mb-8 animate-slide-up">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Avatar */}
              <Avatar className="w-32 h-32 border-4 border-primary/20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="text-muted-foreground">{user.username}</p>
                </div>

                {/* Stats */}
                <div className="flex justify-center md:justify-start gap-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.stats.trips}</div>
                    <div className="text-sm text-muted-foreground">Trips</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.stats.followers}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.stats.following}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-foreground/80">{user.bio}</p>

                {/* Location */}
                <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-center md:justify-start">
                  <Button className="gradient-hero text-white">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline">Share Profile</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="trips" className="flex items-center gap-2">
                <Grid className="w-4 h-4" />
                <span className="hidden sm:inline">Trips</span>
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                <span className="hidden sm:inline">Saved</span>
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span className="hidden sm:inline">Achievements</span>
              </TabsTrigger>
            </TabsList>

            {/* Trips Grid */}
            <TabsContent value="trips" className="animate-fade-in">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {trips.map((trip) => (
                  <div
                    key={trip.id}
                    className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                  >
                    <img
                      src={trip.image}
                      alt={trip.destination}
                      className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-smooth flex flex-col justify-end p-4">
                      <h3 className="text-white font-semibold">{trip.destination}</h3>
                      <p className="text-white/80 text-sm flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {trip.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Saved Trips */}
            <TabsContent value="saved" className="animate-fade-in">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {trips.slice(0, 4).map((trip) => (
                  <div
                    key={trip.id}
                    className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                  >
                    <img
                      src={trip.image}
                      alt={trip.destination}
                      className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-smooth flex flex-col justify-end p-4">
                      <h3 className="text-white font-semibold">{trip.destination}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Achievements */}
            <TabsContent value="achievements" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ach.length === 0 && (<div className="text-muted-foreground">No achievements yet</div>)}
                {ach.map((unlock) => (
                  <Card key={unlock.id} className="p-6 hover:shadow-elevated transition-smooth">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{unlock.achievement.icon || '🏅'}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{unlock.achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">{unlock.achievement.description}</p>
                      </div>
                      <Badge variant="secondary">Earned</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
