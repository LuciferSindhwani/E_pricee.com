import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Compass, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

/**
 * Navbar Component
 * 
 * WHAT IT DOES:
 * - Provides main navigation across the application
 * - Shows logo, navigation links, and auth buttons
 * - Responsive design with mobile hamburger menu
 * 
 * HOW IT WORKS:
 * - Uses state to toggle mobile menu visibility
 * - Fixed positioning keeps navbar visible during scroll
 * - Backdrop blur effect creates modern glass morphism look
 * - Navigation links would connect to React Router routes
 * - Auth buttons would trigger login/signup flows
 */

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { token, user, logout } = useAuth();

  const navLinks = [
    { label: "Explore", href: "/feed" },
    { label: "Create Trip", href: "/planner" },
    { label: "Community", href: "/community" },
    { label: "Profile", href: "/profile" },
  ];

  const handleNavClick = (href: string) => {
    navigate(href);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-smooth"
          >
            <div className="p-2 rounded-lg gradient-hero">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">TripAI</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {token && navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className={`text-foreground/80 hover:text-foreground transition-smooth font-medium ${
                  location.pathname === link.href ? "text-primary font-semibold" : ""
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop Auth/Profile */}
          <div className="hidden md:flex items-center gap-3">
            {!token ? (
              <>
                <Button variant="ghost" onClick={() => navigate("/auth")}>Log In</Button>
                <Button className="gradient-hero text-white" onClick={() => navigate("/auth")}>Sign Up</Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"} />
                      <AvatarFallback>{(user?.name || 'U').charAt(0)}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/feed')}>Feed</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { logout(); navigate('/'); }}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-slide-up">
            {token && navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className={`block w-full text-left py-2 text-foreground/80 hover:text-foreground transition-smooth font-medium ${
                  location.pathname === link.href ? "text-primary font-semibold" : ""
                }`}
              >
                {link.label}
              </button>
            ))}
            {!token && (
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="outline" className="w-full" onClick={() => handleNavClick("/auth")}>Log In</Button>
                <Button className="w-full gradient-hero text-white" onClick={() => handleNavClick("/auth")}>Sign Up</Button>
              </div>
            )}
            {token && (
              <div className="flex gap-2 pt-4 border-t border-border">
                <Button className="flex-1" variant="outline" onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}>Profile</Button>
                <Button className="flex-1" variant="destructive" onClick={() => { logout(); navigate('/'); setIsMenuOpen(false); }}>Logout</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
