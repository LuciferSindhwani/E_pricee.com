import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import TripCard from "@/components/TripCard";
import { Button } from "@/components/ui/button";

/**
 * Index Page - Landing Page
 * 
 * WHAT IT DOES:
 * - Main landing page that users see when visiting the app
 * - Showcases the value proposition through hero section
 * - Displays key features and sample trip posts
 * - Provides entry points for authentication and exploration
 * 
 * HOW IT WORKS:
 * - Composed of multiple reusable components (Navbar, Hero, Features, TripCard)
 * - Sample trip data shown for demonstration (would come from API in production)
 * - Smooth scroll navigation through anchor links
 * 
 * FUTURE INTEGRATION:
 * - Hero CTA buttons would navigate to /auth or /dashboard
 * - Trip cards would be fetched from GET /api/trips/trending endpoint
 * - Backend would return paginated results with user, destination, stats
 * - Real-time updates via WebSocket for live like/comment counts
 */

const Index = () => {
  const navigate = useNavigate();

  // Sample trip data - in production, this would come from API
  const sampleTrips = [
    {
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      destination: "Swiss Alps",
      description: "5-day adventure through stunning mountain landscapes",
      userName: "Sarah Chen",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      likes: 324,
      comments: 18,
      duration: "5 days",
      budget: "$1200-1500",
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
      destination: "Bali, Indonesia",
      description: "Tropical paradise with temples and beaches",
      userName: "Marcus Johnson",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
      likes: 567,
      comments: 42,
      duration: "7 days",
      budget: "$800-1000",
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
      destination: "Paris, France",
      description: "Romantic getaway in the city of lights",
      userName: "Emma Wilson",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      likes: 891,
      comments: 67,
      duration: "4 days",
      budget: "$1500-2000",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />

      {/* Featured Trips Section */}
      <section id="explore" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold">
              Trending <span className="text-primary">Trips</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Get inspired by trips from our community of travelers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {sampleTrips.map((trip, index) => (
              <div key={index} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <TripCard {...trip} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 gradient-hero text-white">
        <div className="container mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Join thousands of travelers who are planning amazing trips together
          </p>
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg shadow-elevated hover:scale-105 transition-smooth"
          >
            Get Started Free
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
