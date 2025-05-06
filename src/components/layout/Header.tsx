import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Moon, 
  Sun, 
  Menu, 
  X, 
  Activity, 
  HeartPulse, 
  Dumbbell, 
  FileText, 
  LayoutDashboard,
  User,
  LogOut,
  Bell,
  Flame,
  Thermometer,
  Calendar,
  Utensils,
  MessageSquare
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import LogoutButton from "@/components/auth/LogoutButton";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header = ({ isDarkMode, toggleDarkMode }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  // New state to track unread notifications count (this would typically come from a backend API)
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  // Add streak state - in a real app, this would come from an API
  const [streak, setStreak] = useState(7);
  
  // Check if the path matches the current location
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-background/95 backdrop-blur-md shadow-sm' 
        : 'bg-background/80 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <HeartPulse className="h-6 w-6 text-forest dark:text-sage-light transition-transform group-hover:scale-110" />
            <span className="text-2xl font-bold text-forest dark:text-sage-light">HealthHub.ai</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-2">
            {/* Health Assessment Hub Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`flex items-center space-x-1 ${
                  isActive('/disease-predictor') || isActive('/risk') || isActive('/risk-planner') || isActive('/disease-metrics')
                  ? 'bg-primary/10 text-primary'
                  : ''
                }`}>
                  <Thermometer className="mr-1 h-4 w-4" />
                  <span>Health Assessment</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 bg-card/95 backdrop-blur-sm border-border">
                <DropdownMenuLabel>Health Assessment Tools</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/disease-predictor" className="w-full cursor-pointer">
                    Disease Predictor
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/risk" className="w-full cursor-pointer">
                    Health Risk Analysis
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/risk-planner" className="w-full cursor-pointer">
                    Risk Management Planner
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/disease-metrics" className="w-full cursor-pointer">
                    Disease Metrics Input
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Fitness & Diet Hub Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`flex items-center space-x-1 ${
                  isActive('/fitness-trainer') || isActive('/trainer') || isActive('/diet') || isActive('/gym-training') || 
                  isActive('/learn-exercise-ai') || isActive('/meal-planner')
                  ? 'bg-primary/10 text-primary'
                  : ''
                }`}>
                  <Dumbbell className="mr-1 h-4 w-4" />
                  <span>Fitness & Diet</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 bg-card/95 backdrop-blur-sm border-border">
                <DropdownMenuLabel>Fitness & Nutrition</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/fitness-trainer" className="w-full cursor-pointer">
                    AI Fitness Trainer
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/learn-exercise-ai" className="w-full cursor-pointer">
                    <Activity className="mr-2 h-4 w-4" />
                    Learn Exercise with AI
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/trainer" className="w-full cursor-pointer">
                    Personalized Workout Plans
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/diet" className="w-full cursor-pointer">
                    Diet & Nutrition Planner
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/meal-planner" className="w-full cursor-pointer">
                    <Utensils className="mr-2 h-4 w-4" />
                    Meal Planner
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/gym-training" className="w-full cursor-pointer">
                    Gym Training Guide
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Records & Documents Hub */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`flex items-center space-x-1 ${
                  isActive('/health-records') || isActive('/ocr')
                  ? 'bg-primary/10 text-primary'
                  : ''
                }`}>
                  <FileText className="mr-1 h-4 w-4" />
                  <span>Records</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 bg-card/95 backdrop-blur-sm border-border">
                <DropdownMenuLabel>Health Documentation</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/health-records" className="w-full cursor-pointer">
                    Health Records
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/ocr" className="w-full cursor-pointer">
                    Prescription Scanner
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant={isActive('/dashboard') ? 'secondary' : 'ghost'}
              className="flex items-center"
              asChild
            >
              <Link to="/dashboard">
                <LayoutDashboard className="mr-1 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </Button>
            
            <Button
              variant="default"
              className="flex items-center bg-forest text-white hover:bg-forest-dark"
              asChild
            >
              <Link to="/dashboard#ai-chat">
                <MessageSquare className="mr-1 h-4 w-4" />
                <span>AI Chat</span>
              </Link>
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            
            {/* New Notification Bell */}
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full relative">
                    <Bell size={18} />
                    {unreadNotifications > 0 && (
                      <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] bg-red-500 text-white border-background border-2 rounded-full">
                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-card/95 backdrop-blur-sm border-border">
                  <DropdownMenuLabel className="flex justify-between">
                    <span>Notifications</span>
                    <Button 
                      variant="ghost" 
                      className="h-auto p-0 text-xs hover:text-primary hover:bg-transparent"
                      onClick={() => setUnreadNotifications(0)}
                    >
                      Mark all as read
                    </Button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Sample notifications - These would come from API */}
                  <DropdownMenuItem className="py-3 px-4 focus:bg-primary/5 cursor-default">
                    <div className="flex gap-3 items-start w-full">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                        <Activity size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start w-full mb-1">
                          <p className="font-medium text-sm">Health Assessment Reminder</p>
                          <span className="text-xs text-muted-foreground">2h ago</span>
                        </div>
                        <p className="text-xs text-muted-foreground">It's time for your weekly health check-in. Complete your assessment now.</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="py-3 px-4 focus:bg-primary/5 cursor-default">
                    <div className="flex gap-3 items-start w-full">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                        <Dumbbell size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start w-full mb-1">
                          <p className="font-medium text-sm">Workout Scheduled</p>
                          <span className="text-xs text-muted-foreground">1d ago</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Your personal trainer has scheduled a new workout session for tomorrow.</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="py-3 px-4 focus:bg-primary/5 cursor-default">
                    <div className="flex gap-3 items-start w-full">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 dark:bg-blue-950 dark:text-blue-400">
                        <FileText size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start w-full mb-1">
                          <p className="font-medium text-sm">New Health Records</p>
                          <span className="text-xs text-muted-foreground">3d ago</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Your lab results have been uploaded to your health records.</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="justify-center text-primary text-sm py-2">
                      View all notifications
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {/* Streak Counter */}
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full relative flex items-center justify-center">
                    <Flame className="h-[18px] w-[18px] text-orange-500" />
                    <span className="ml-1 text-sm font-medium">{streak}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-card/95 backdrop-blur-sm border-border p-4">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="flex items-center space-x-2">
                      <Flame className="h-6 w-6 text-orange-500" />
                      <span className="text-xl font-bold">{streak} Day Streak!</span>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      You've been active for {streak} days in a row. Keep it up!
                    </p>
                    <div className="w-full flex gap-1 mt-2">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`flex-1 h-2 rounded-full ${
                            i < (streak % 7 || 7) ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last activity: Today at 9:30 AM
                    </p>
                    <div className="w-full pt-2 mt-2 border-t border-border">
                      <DropdownMenuItem asChild className="justify-center cursor-pointer">
                        <Link to="/dashboard" className="text-primary text-sm">
                          View activity history
                        </Link>
                      </DropdownMenuItem>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {/* User Account Button - Updated with Logout Option */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-sm border-border">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="w-full cursor-pointer">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account" className="w-full cursor-pointer">
                        Account Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <LogoutButton className="w-full cursor-pointer justify-start px-2" variant="ghost">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </LogoutButton>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login" className="w-full cursor-pointer">
                        Sign In
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/signup" className="w-full cursor-pointer">
                        Sign Up
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu - Updated with auth-aware options */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pt-4 pb-3 space-y-1 divide-y divide-border/40">
            <div className="py-2 space-y-1">
              <p className="text-xs font-medium text-muted-foreground px-3 py-1">Health Assessment</p>
              <Link
                to="/disease-predictor"
                className="block px-3 py-2 rounded-md hover:bg-primary/10 text-foreground hover:text-primary"
              >
                Disease Predictor
              </Link>
              <Link
                to="/risk"
                className="block px-3 py-2 rounded-md hover:bg-primary/10 text-foreground hover:text-primary"
              >
                Health Risk Analysis
              </Link>
              <Link
                to="/risk-planner"
                className="block px-3 py-2 rounded-md hover:bg-primary/10 text-foreground hover:text-primary"
              >
                Risk Management Planner
              </Link>
              <Link
                to="/disease-metrics"
                className="block px-3 py-2 rounded-md hover:bg-primary/10 text-foreground hover:text-primary"
              >
                Disease Metrics Input
              </Link>
            </div>
            
            <div className="py-2 space-y-1">
              <p className="text-xs font-medium text-muted-foreground px-3 py-1">Fitness & Diet</p>
              <Link
                to="/fitness-trainer"
                className="block px-3 py-2 rounded-md hover:bg-primary/10 text-foreground hover:text-primary"
              >
                AI Fitness Trainer
              </Link>
              <Link
                to="/learn-exercise-ai"
                className="block px-3 py-2 rounded-md hover:bg-primary/10 text-foreground hover:text-primary"
              >
                Learn Exercise with AI
              </Link>
              <Link
                to="/trainer"
                className="block px-3 py-2 rounded-md hover:bg-primary/10 text-foreground hover:text-primary"
              >
                Personalized Workout Plans
              </Link>
              <Link
                to="/diet"
                className="block px-3 py-2 rounded-md hover:bg-primary/10 text-foreground hover:text-primary"
              >
                Diet & Nutrition Planner
              </Link>
              <Link
                to="/meal-planner"
                className="block px-3 py-2 rounded-md hover:bg-primary/10 text-foreground hover:text-primary"
              >
                Meal Planner
              </Link>
              <Link
                to="/gym-training"
                className="block px-3 py-2 rounded-md hover:bg-primary/10 text-foreground hover:text-primary"
              >
                Gym Training Guide
              </Link>
            </div>
            
            <div className="py-2 space-y-1">
              <p className="text-xs font-medium text-muted-foreground px-3 py-1">Records & Documents</p>
              <Link
                to="/health-records"
                className="block px-3 py-2 rounded-md hover:bg-primary/10 text-foreground hover:text-primary"
              >
                Health Records
              </Link>
              <Link
                to="/ocr"
                className="block px-3 py-2 rounded-md hover:bg-primary/10 text-foreground hover:text-primary"
              >
                Prescription Scanner
              </Link>
            </div>
            
            <div className="py-2 space-y-1">
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md hover:bg-primary/10 text-foreground hover:text-primary"
              >
                Dashboard
              </Link>
              <Link
                to="/chat"
                className="block px-3 py-2 rounded-md hover:bg-primary/10 text-foreground hover:text-primary"
              >
                AI Chat
              </Link>
            </div>
            
            <div className="py-2 space-y-1">
              <p className="text-xs font-medium text-muted-foreground px-3 py-1">Account</p>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md hover:bg-primary/10 text-foreground hover:text-primary"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/account"
                    className="block px-3 py-2 rounded-md hover:bg-primary/10 text-foreground hover:text-primary"
                  >
                    Account Settings
                  </Link>
                  <div 
                    className="flex px-3 py-2 rounded-md hover:bg-primary/10 text-foreground hover:text-primary items-center justify-between cursor-pointer"
                    onClick={() => setUnreadNotifications(0)}
                  >
                    <div className="flex items-center">
                      <Bell size={16} className="mr-2" />
                      <span>Notifications</span>
                    </div>
                    {unreadNotifications > 0 && (
                      <Badge className="bg-red-500 text-white px-1.5 h-[18px] min-w-[18px]">
                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                      </Badge>
                    )}
                  </div>
                  <Link
                    to="/dashboard"
                    className="flex px-3 py-2 rounded-md hover:bg-primary/10 text-foreground hover:text-primary items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Flame size={16} className="mr-2 text-orange-500" />
                      <span>Activity Streak</span>
                    </div>
                    <span className="font-medium text-orange-500">{streak} days</span>
                  </Link>
                  <div className="px-3 py-2">
                    <LogoutButton variant="outline" className="w-full justify-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </LogoutButton>
                  </div>
                </>
              ) : (
                <div className="flex gap-2 px-3 py-2">
                  <Link to="/login" className="w-full">
                    <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/signup" className="w-full">
                    <Button size="sm" className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
            
            <div className="pt-2 flex items-center justify-between">
              <Button onClick={toggleDarkMode} variant="outline" size="sm" className="text-sm">
                {isDarkMode ? <Sun size={16} className="mr-2" /> : <Moon size={16} className="mr-2" />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
