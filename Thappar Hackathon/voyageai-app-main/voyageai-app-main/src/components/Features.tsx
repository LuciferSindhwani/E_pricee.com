import { Card } from "@/components/ui/card";
import { Sparkles, Users, MapPin, Calendar, Shield, Zap } from "lucide-react";

/**
 * Features Component
 * 
 * WHAT IT DOES:
 * - Showcases key features of the AI Trip Organizer
 * - Displays 6 main features in a responsive grid layout
 * - Each feature has an icon, title, and description
 * 
 * HOW IT WORKS:
 * - Uses a static features array to render feature cards
 * - Cards use gradient backgrounds and hover effects from design system
 * - Icons use Lucide React for consistency
 * - Responsive grid adapts from 1 column (mobile) to 3 columns (desktop)
 * - Stagger animation on scroll would be added with IntersectionObserver
 */

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Recommendations",
    description: "Get personalized destination and itinerary suggestions based on your preferences, budget, and travel style",
  },
  {
    icon: Users,
    title: "Real-Time Collaboration",
    description: "Plan trips together with friends and family. Co-edit itineraries, vote on activities, and chat in real-time",
  },
  {
    icon: MapPin,
    title: "Smart Route Planning",
    description: "Optimize your journey with intelligent routing that considers traffic, weather, and points of interest",
  },
  {
    icon: Calendar,
    title: "Dynamic Itineraries",
    description: "Flexible day-by-day plans that adapt to changes. Add, remove, or rearrange activities with ease",
  },
  {
    icon: Shield,
    title: "Safe Travel Insights",
    description: "Stay informed with real-time safety alerts, weather updates, and local event notifications",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    description: "Book hotels, flights, and activities directly from your itinerary with integrated booking partners",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Everything You Need to Plan
            <span className="text-primary"> Amazing Trips</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to make trip planning effortless and fun
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-elevated transition-smooth hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm"
            >
              <div className="flex flex-col items-start space-y-4">
                {/* Icon */}
                <div className="p-3 rounded-xl gradient-card">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
