import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-travel.jpg";

/**
 * Hero Component
 * 
 * WHAT IT DOES:
 * - Eye-catching landing section that introduces the AI Trip Organizer
 * - Displays compelling headline, subheadline, and CTAs
 * - Features animated background image with gradient overlay
 * 
 * HOW IT WORKS:
 * - Uses CSS animations (animate-slide-up, animate-fade-in) for staggered entrance
 * - Gradient overlay creates depth and ensures text readability
 * - Responsive design scales text and spacing for mobile/desktop
 * - CTA buttons use design system tokens (primary, secondary variants)
 */
const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Travelers exploring destinations"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-secondary/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Trip Planning</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Plan Your Perfect Trip
            <br />
            <span className="text-secondary">Together</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-white/90 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Discover, collaborate, and organize unforgettable adventures with AI-powered recommendations and real-time team planning
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Button
              size="lg"
              onClick={() => navigate("/planner")}
              className="bg-white text-primary hover:bg-white/90 shadow-elevated group px-8"
            >
              Start Planning
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/feed")}
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8"
            >
              Explore Trips
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div>
              <div className="text-3xl sm:text-4xl font-bold">10K+</div>
              <div className="text-sm text-white/80">Trips Planned</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold">50K+</div>
              <div className="text-sm text-white/80">Happy Travelers</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold">120+</div>
              <div className="text-sm text-white/80">Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
