"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  Bell,
  Settings,
  Plus,
  X,
  MessageSquare,
  Calendar,
  Edit,
  Trash2,
  Moon,
  Share2,
  CheckCircle,
  LogOut,
  Search,
  MoreHorizontal,
  ChevronDown,
  Menu,
  Target,
  Heart,
  Briefcase,
  BookOpen,
  User,
  BarChart2,
  ChevronRight,
  Filter,
  ArrowRight,
  Clock,
  CheckSquare,
  PanelLeft,
} from "lucide-react"
import confetti from "canvas-confetti"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"

// Types
interface UserType {
  id: string
  name: string
  avatar: string
  role: string
}

interface Comment {
  id: string
  userId: string
  text: string
  date: string
  read: boolean
}

interface Milestone {
  percent: number
  badge: string
  achieved: boolean
  description: string
}

interface Goal {
  id: string
  title: string
  description: string
  progress: number
  target: number
  milestones: Milestone[]
  comments: Comment[]
  category: "health" | "work" | "learning" | "personal"
  createdAt: string
  dueDate: string
  color: string
}

interface Activity {
  id: string
  userId: string
  goalId: string
  type: "comment" | "progress" | "milestone"
  date: string
  read: boolean
  details: string
}

// Mock Data
const mockUsers: UserType[] = [
  {
    id: "user1",
    name: "Alex Morgan",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    role: "Product Manager",
  },
  {
    id: "user2",
    name: "Jamie Chen",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "Developer",
  },
  {
    id: "user3",
    name: "Taylor Swift",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    role: "Designer",
  },
  {
    id: "user4",
    name: "Morgan Freeman",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    role: "Team Lead",
  },
]

const currentUser = mockUsers[0]

const generateMockGoals = (): Goal[] => {
  return [
    {
      id: "goal1",
      title: "Complete Frontend Certification",
      description:
        "Finish all modules and pass the final assessment for the Advanced Frontend Developer certification.",
      progress: 65,
      target: 100,
      milestones: [
        { percent: 25, badge: "1", achieved: true, description: "Initial progress" },
        { percent: 50, badge: "2", achieved: true, description: "Midpoint checkpoint" },
        { percent: 75, badge: "3", achieved: false, description: "Advanced progress" },
        { percent: 100, badge: "4", achieved: false, description: "Completion" },
      ],
      comments: [
        {
          id: "c1",
          userId: "user2",
          text: "Great progress on the React module!",
          date: "2023-11-15T10:30:00",
          read: true,
        },
        {
          id: "c2",
          userId: "user3",
          text: "Do you need help with the TypeScript section?",
          date: "2023-11-16T14:20:00",
          read: false,
        },
      ],
      category: "learning",
      createdAt: "2023-10-01T09:00:00",
      dueDate: "2023-12-31T23:59:59",
      color: "#1e3a8a", // blue-900
    },
    {
      id: "goal2",
      title: "Run 100km This Month",
      description: "Complete 100 kilometers of running this month to improve cardiovascular health and endurance.",
      progress: 42,
      target: 100,
      milestones: [
        { percent: 25, badge: "1", achieved: true, description: "Initial progress" },
        { percent: 50, badge: "2", achieved: false, description: "Halfway mark" },
        { percent: 75, badge: "3", achieved: false, description: "Advanced progress" },
        { percent: 100, badge: "4", achieved: false, description: "Completion" },
      ],
      comments: [
        {
          id: "c3",
          userId: "user4",
          text: "Try interval training to improve your pace!",
          date: "2023-11-10T08:45:00",
          read: true,
        },
      ],
      category: "health",
      createdAt: "2023-11-01T06:00:00",
      dueDate: "2023-11-30T23:59:59",
      color: "#0f766e", // teal-700
    },
    {
      id: "goal3",
      title: "Launch Product MVP",
      description: "Complete and launch the minimum viable product to our first beta users for feedback.",
      progress: 80,
      target: 100,
      milestones: [
        { percent: 25, badge: "1", achieved: true, description: "Requirements defined" },
        { percent: 50, badge: "2", achieved: true, description: "Development initiated" },
        { percent: 75, badge: "3", achieved: true, description: "Testing phase" },
        { percent: 100, badge: "4", achieved: false, description: "Product launched" },
      ],
      comments: [
        {
          id: "c4",
          userId: "user2",
          text: "Backend API is ready for integration",
          date: "2023-11-12T11:20:00",
          read: true,
        },
        {
          id: "c5",
          userId: "user3",
          text: "UI designs are finalized, check Figma",
          date: "2023-11-14T15:30:00",
          read: false,
        },
      ],
      category: "work",
      createdAt: "2023-09-15T10:00:00",
      dueDate: "2023-12-15T17:00:00",
      color: "#334155", // slate-700
    },
    {
      id: "goal4",
      title: "Read 12 Books This Year",
      description: "Expand knowledge and perspective by reading one book per month across various genres.",
      progress: 9,
      target: 12,
      milestones: [
        { percent: 25, badge: "1", achieved: true, description: "3 books read" },
        { percent: 50, badge: "2", achieved: true, description: "6 books read" },
        { percent: 75, badge: "3", achieved: true, description: "9 books read" },
        { percent: 100, badge: "4", achieved: false, description: "All books read" },
      ],
      comments: [
        {
          id: "c6",
          userId: "user4",
          text: 'I recommend "Atomic Habits" for your next read!',
          date: "2023-11-05T19:15:00",
          read: true,
        },
      ],
      category: "personal",
      createdAt: "2023-01-01T00:00:00",
      dueDate: "2023-12-31T23:59:59",
      color: "#1e40af", // blue-800
    },
    {
      id: "goal5",
      title: "Improve Team Collaboration",
      description: "Implement new processes and tools to enhance team communication and productivity.",
      progress: 30,
      target: 100,
      milestones: [
        { percent: 25, badge: "1", achieved: true, description: "Needs assessment" },
        { percent: 50, badge: "2", achieved: false, description: "Process implementation" },
        { percent: 75, badge: "3", achieved: false, description: "Adoption metrics" },
        { percent: 100, badge: "4", achieved: false, description: "Full implementation" },
      ],
      comments: [
        {
          id: "c7",
          userId: "user2",
          text: "The new Slack channels are working well for cross-team communication",
          date: "2023-11-13T13:40:00",
          read: false,
        },
      ],
      category: "work",
      createdAt: "2023-10-15T14:00:00",
      dueDate: "2024-01-15T17:00:00",
      color: "#334155", // slate-700
    },
    {
      id: "goal6",
      title: "Learn Spanish",
      description: "Achieve conversational fluency in Spanish through daily practice and structured learning.",
      progress: 15,
      target: 100,
      milestones: [
        { percent: 25, badge: "1", achieved: false, description: "Basic vocabulary" },
        { percent: 50, badge: "2", achieved: false, description: "Simple conversations" },
        { percent: 75, badge: "3", achieved: false, description: "Advanced comprehension" },
        { percent: 100, badge: "4", achieved: false, description: "Fluent conversations" },
      ],
      comments: [
        {
          id: "c8",
          userId: "user3",
          text: "Duolingo has a great Spanish course for beginners!",
          date: "2023-11-08T20:10:00",
          read: true,
        },
      ],
      category: "learning",
      createdAt: "2023-09-01T08:00:00",
      dueDate: "2024-09-01T23:59:59",
      color: "#1e3a8a", // blue-900
    },
  ]
}

const generateActivities = (goals: Goal[], users: UserType[]): Activity[] => {
  const activities: Activity[] = []

  goals.forEach((goal) => {
    // Add comment activities
    goal.comments.forEach((comment) => {
      activities.push({
        id: `activity-${comment.id}`,
        userId: comment.userId,
        goalId: goal.id,
        type: "comment",
        date: comment.date,
        read: comment.read,
        details: `commented on "${goal.title}"`,
      })
    })

    // Add progress activities
    if (goal.progress > 0) {
      activities.push({
        id: `activity-progress-${goal.id}`,
        userId: users[Math.floor(Math.random() * users.length)].id,
        goalId: goal.id,
        type: "progress",
        date: new Date(
          new Date(goal.createdAt).getTime() +
            Math.random() * (new Date().getTime() - new Date(goal.createdAt).getTime()),
        ).toISOString(),
        read: Math.random() > 0.5,
        details: `updated progress on "${goal.title}" to ${goal.progress}%`,
      })
    }

    // Add milestone activities
    goal.milestones.forEach((milestone) => {
      if (milestone.achieved) {
        activities.push({
          id: `activity-milestone-${goal.id}-${milestone.percent}`,
          userId: users[Math.floor(Math.random() * users.length)].id,
          goalId: goal.id,
          type: "milestone",
          date: new Date(
            new Date(goal.createdAt).getTime() +
              Math.random() * (new Date().getTime() - new Date(goal.createdAt).getTime()),
          ).toISOString(),
          read: Math.random() > 0.3,
          details: `reached the ${milestone.percent}% milestone on "${goal.title}"`,
        })
      }
    })
  })

  // Sort by date (newest first)
  return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Main Component
export default function GoalTracker() {
  // State
  const [goals, setGoals] = useState<Goal[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [activeTab, setActiveTab] = useState<"all" | "health" | "work" | "learning" | "personal">("all")
  const [darkMode, setDarkMode] = useState(false)
  const [showNewGoalModal, setShowNewGoalModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showGoalDetailModal, setShowGoalDetailModal] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [newComment, setNewComment] = useState("")
  const [newGoalForm, setNewGoalForm] = useState({
    title: "",
    description: "",
    target: 100,
    category: "personal" as "health" | "work" | "learning" | "personal",
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  })
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showShareModal, setShowShareModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const router = useRouter()
  const pathname = usePathname()
  const confettiRef = useRef<HTMLDivElement>(null)

  // Initialize data
  useEffect(() => {
    // Try to load from localStorage first
    const savedGoals = localStorage.getItem("goalTrackerGoals")
    const savedActivities = localStorage.getItem("goalTrackerActivities")
    const savedDarkMode = localStorage.getItem("goalTrackerDarkMode")

    if (savedGoals && savedActivities) {
      setGoals(JSON.parse(savedGoals))
      setActivities(JSON.parse(savedActivities))
    } else {
      const initialGoals = generateMockGoals()
      const initialActivities = generateActivities(initialGoals, mockUsers)
      setGoals(initialGoals)
      setActivities(initialActivities)
    }

    if (savedDarkMode) {
      setDarkMode(savedDarkMode === "true")
    }

    // Set sidebar closed by default on mobile
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    // Initial check
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Save to localStorage when data changes
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem("goalTrackerGoals", JSON.stringify(goals))
    }
    if (activities.length > 0) {
      localStorage.setItem("goalTrackerActivities", JSON.stringify(activities))
    }
    localStorage.setItem("goalTrackerDarkMode", String(darkMode))
  }, [goals, activities, darkMode])

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Filtered goals based on active tab and search query
  const filteredGoals = goals.filter((goal) => {
    const matchesTab = activeTab === "all" || goal.category === activeTab
    const matchesSearch =
      goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  // Unread notifications count
  const unreadNotificationsCount = activities.filter((activity) => !activity.read).length

  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getUserById = (userId: string) => {
    return mockUsers.find((user) => user.id === userId) || mockUsers[0]
  }

  const getGoalById = (goalId: string) => {
    return goals.find((goal) => goal.id === goalId)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "health":
        return "bg-teal-700 text-teal-50"
      case "work":
        return "bg-slate-700 text-slate-50"
      case "learning":
        return "bg-blue-900 text-blue-50"
      case "personal":
        return "bg-blue-800 text-blue-50"
      default:
        return "bg-slate-600 text-slate-50"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "health":
        return <Heart className="h-4 w-4" />
      case "work":
        return <Briefcase className="h-4 w-4" />
      case "learning":
        return <BookOpen className="h-4 w-4" />
      case "personal":
        return <User className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress < 25) return "bg-red-600"
    if (progress < 50) return "bg-amber-600"
    if (progress < 75) return "bg-blue-600"
    return "bg-emerald-600"
  }

  // Event handlers
  const handleTabChange = (tab: "all" | "health" | "work" | "learning" | "personal") => {
    setActiveTab(tab)
    if (window.innerWidth < 1024) {
      setShowMobileMenu(false)
    }
  }

  const handleProgressUpdate = (goalId: string, increment: number) => {
    setGoals((prevGoals) => {
      return prevGoals.map((goal) => {
        if (goal.id === goalId) {
          const newProgress = Math.max(0, Math.min(goal.target, goal.progress + increment))

          // Check if any new milestones were achieved
          const updatedMilestones = goal.milestones.map((milestone) => {
            const percentComplete = (newProgress / goal.target) * 100
            const wasAchieved = milestone.achieved
            const isNowAchieved = percentComplete >= milestone.percent

            // If a milestone was just achieved, trigger confetti
            if (!wasAchieved && isNowAchieved) {
              setTimeout(() => {
                if (confettiRef.current) {
                  const rect = confettiRef.current.getBoundingClientRect()
                  confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: {
                      x: rect.left / window.innerWidth + rect.width / window.innerWidth / 2,
                      y: rect.top / window.innerHeight,
                    },
                  })
                }
              }, 100)

              // Add a new activity for the milestone
              const newActivity: Activity = {
                id: `activity-milestone-${goal.id}-${milestone.percent}-${Date.now()}`,
                userId: currentUser.id,
                goalId: goal.id,
                type: "milestone",
                date: new Date().toISOString(),
                read: false,
                details: `reached the ${milestone.percent}% milestone on "${goal.title}"`,
              }

              setActivities((prev) => [newActivity, ...prev])
            }

            return {
              ...milestone,
              achieved: isNowAchieved,
            }
          })

          // Add activity for progress update
          const newActivity: Activity = {
            id: `activity-progress-${goal.id}-${Date.now()}`,
            userId: currentUser.id,
            goalId: goal.id,
            type: "progress",
            date: new Date().toISOString(),
            read: false,
            details: `updated progress on "${goal.title}" to ${newProgress}/${goal.target}`,
          }

          setActivities((prev) => [newActivity, ...prev])

          return {
            ...goal,
            progress: newProgress,
            milestones: updatedMilestones,
          }
        }
        return goal
      })
    })
  }

  const handleAddComment = (goalId: string) => {
    if (!newComment.trim()) return

    const commentId = `comment-${Date.now()}`

    setGoals((prevGoals) => {
      return prevGoals.map((goal) => {
        if (goal.id === goalId) {
          const newCommentObj = {
            id: commentId,
            userId: currentUser.id,
            text: newComment,
            date: new Date().toISOString(),
            read: false,
          }

          return {
            ...goal,
            comments: [...goal.comments, newCommentObj],
          }
        }
        return goal
      })
    })

    // Add activity for the new comment
    const newActivity: Activity = {
      id: `activity-${commentId}`,
      userId: currentUser.id,
      goalId: goalId,
      type: "comment",
      date: new Date().toISOString(),
      read: false,
      details: `commented on "${getGoalById(goalId)?.title}"`,
    }

    setActivities((prev) => [newActivity, ...prev])
    setNewComment("")
  }

  const handleCreateGoal = () => {
    if (!newGoalForm.title.trim()) return

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: newGoalForm.title,
      description: newGoalForm.description,
      progress: 0,
      target: newGoalForm.target,
      milestones: [
        { percent: 25, badge: "1", achieved: false, description: "Initial progress" },
        { percent: 50, badge: "2", achieved: false, description: "Midpoint checkpoint" },
        { percent: 75, badge: "3", achieved: false, description: "Advanced progress" },
        { percent: 100, badge: "4", achieved: false, description: "Completion" },
      ],
      comments: [],
      category: newGoalForm.category,
      createdAt: new Date().toISOString(),
      dueDate: new Date(newGoalForm.dueDate).toISOString(),
      color: getCategoryDefaultColor(newGoalForm.category),
    }

    setGoals((prev) => [...prev, newGoal])

    // Add activity for the new goal
    const newActivity: Activity = {
      id: `activity-new-goal-${newGoal.id}`,
      userId: currentUser.id,
      goalId: newGoal.id,
      type: "progress",
      date: new Date().toISOString(),
      read: false,
      details: `created a new objective "${newGoal.title}"`,
    }

    setActivities((prev) => [newActivity, ...prev])

    // Reset form and close modal
    setNewGoalForm({
      title: "",
      description: "",
      target: 100,
      category: "personal",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    })
    setShowNewGoalModal(false)
  }

  const handleDeleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== goalId))
    setActivities((prev) => prev.filter((activity) => activity.goalId !== goalId))
    setShowGoalDetailModal(false)
  }

  const handleMarkAllNotificationsAsRead = () => {
    setActivities((prev) => prev.map((activity) => ({ ...activity, read: true })))
  }

  const getCategoryDefaultColor = (category: string) => {
    switch (category) {
      case "health":
        return "#0f766e" // teal-700
      case "work":
        return "#334155" // slate-700
      case "learning":
        return "#1e3a8a" // blue-900
      case "personal":
        return "#1e40af" // blue-800
      default:
        return "#475569" // slate-600
    }
  }

  // Chart data
  const getCategoryData = () => {
    const data: { name: string; value: number }[] = []
    const categories = ["health", "work", "learning", "personal"]

    categories.forEach((category) => {
      const count = goals.filter((goal) => goal.category === category).length
      if (count > 0) {
        data.push({ name: category, value: count })
      }
    })

    return data
  }

  const getProgressData = () => {
    return goals.map((goal) => ({
      name: goal.title.substring(0, 15) + (goal.title.length > 15 ? "..." : ""),
      progress: (goal.progress / goal.target) * 100,
    }))
  }

  const COLORS = ["#1e3a8a", "#334155", "#0f766e", "#1e40af"] // blue-900, slate-700, teal-700, blue-800

  return (
    <div
      className={`min-h-screen flex flex-col ${darkMode ? "dark bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}
    >
      {/* Confetti container */}
      <div ref={confettiRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"></div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center gap-2 mr-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <PanelLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-semibold hidden sm:block">Objective Tracker</h1>
          </div>

          <div className="flex-1 flex items-center justify-between">
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search objectives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {/* Notifications dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="p-3 border-b dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-semibold">Notifications</h3>
                        <button
                          onClick={handleMarkAllNotificationsAsRead}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Mark all as read
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {activities.slice(0, 5).map((activity) => (
                          <div
                            key={activity.id}
                            className={`p-3 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${!activity.read ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mr-3">
                                <Image
                                  src={getUserById(activity.userId).avatar || "/placeholder.svg"}
                                  alt={getUserById(activity.userId).name}
                                  width={36}
                                  height={36}
                                  className="rounded-full"
                                />
                              </div>
                              <div>
                                <p className="text-sm">
                                  <span className="font-medium">{getUserById(activity.userId).name}</span>{" "}
                                  {activity.details}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {formatDate(activity.date)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {activities.length > 5 && (
                          <div className="p-2 text-center">
                            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                              View all notifications
                            </button>
                          </div>
                        )}
                        {activities.length === 0 && (
                          <div className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications yet</div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Moon className="h-5 w-5" />
              </button> */}

              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
              >
                <Settings className="h-5 w-5" />
              </button>

              <div className="hidden md:flex items-center">
                <div className="relative">
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Image
                      src={currentUser.avatar || "/placeholder.svg"}
                      alt={currentUser.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{currentUser.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.role}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>

                  <AnimatePresence>
                    {showMobileMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="p-3 border-b dark:border-gray-700">
                          <p className="font-medium">{currentUser.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.role}</p>
                        </div>
                        <div className="p-2">
                          <button
                            onClick={() => setShowSettingsModal(true)}
                            className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                          >
                            Settings
                          </button>
                          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
                            Profile
                          </button>
                          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
                            Help
                          </button>
                        </div>
                        <div className="p-2 border-t dark:border-gray-700">
                          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm flex items-center gap-2">
                            <LogOut className="h-4 w-4" />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden p-3 border-t border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search objectives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-600"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto z-30 ${sidebarOpen ? "block" : "hidden"} lg:relative fixed inset-y-0 left-0`}
            >
              <div className="p-4 flex flex-col h-full">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-lg font-semibold">Objective Tracker</h2>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-1 mb-6">
                  <button
                    onClick={() => handleTabChange("all")}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left ${activeTab === "all" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                  >
                    <Target className="h-4 w-4" />
                    <span>All Objectives</span>
                  </button>
                  <button
                    onClick={() => handleTabChange("health")}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left ${activeTab === "health" ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-white-400 font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                  >
                    <Heart className="h-4 w-4" />
                    <span>Health</span>
                  </button>
                  <button
                    onClick={() => handleTabChange("work")}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left ${activeTab === "work" ? "bg-slate-50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                  >
                    <Briefcase className="h-4 w-4" />
                    <span>Work</span>
                  </button>
                  <button
                    onClick={() => handleTabChange("learning")}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left ${activeTab === "learning" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Learning</span>
                  </button>
                  <button
                    onClick={() => handleTabChange("personal")}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left ${activeTab === "personal" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                  >
                    <User className="h-4 w-4" />
                    <span>Personal</span>
                  </button>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 px-3">Analytics</h3>
                  <div className="space-y-1">
                    <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                      <BarChart2 className="h-4 w-4" />
                      <span>Performance</span>
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Clock className="h-4 w-4" />
                      <span>Timeline</span>
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                      <CheckSquare className="h-4 w-4" />
                      <span>Completion</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 px-3">Recent Activity</h3>
                  <div className="space-y-3">
                    {activities.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="px-3 py-2 text-sm">
                        <div className="flex items-start gap-2">
                          <Image
                            src={getUserById(activity.userId).avatar || "/placeholder.svg"}
                            alt={getUserById(activity.userId).name}
                            width={24}
                            height={24}
                            className="rounded-full mt-0.5"
                          />
                          <div>
                            <p className="text-xs">
                              <span className="font-medium">{getUserById(activity.userId).name}</span>{" "}
                              {activity.details}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(activity.date)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <Image
                      src={currentUser.avatar || "/placeholder.svg"}
                      alt={currentUser.name}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{currentUser.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser.role}</p>
                    </div>
                    <button
                      onClick={() => setShowSettingsModal(true)}
                      className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
        <section className="mb-8">
          <div className={`rounded-s overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
            <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute inset-0 flex items-center px-8">
                <div className="max-w-2xl">
                  <h1 className="text-3xl font-bold text-white mb-2">Welcome back! {/*, {userName.split(" ")[0]}*/} </h1>
                  <p className="text-white/90 mb-4">Track your goals, celebrate progress, and achieve more.</p>
                  <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                    Start Tracking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
          <div className="container mx-auto p-4 md:p-6 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {activeTab === "all"
                    ? "All Objectives"
                    : activeTab === "health"
                      ? "Health Objectives"
                      : activeTab === "work"
                        ? "Work Objectives"
                        : activeTab === "learning"
                          ? "Learning Objectives"
                          : "Personal Objectives"}
                </h2>
                {/* <p className="text-gray-500 dark:text-gray-400">
                  Track your progress and achieve your goals efficiently
                </p> */}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative hidden md:block">
                  <button className="flex items-center gap-1 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>
                </div>
                <button
                  onClick={() => setShowNewGoalModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-1 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Objective</span>
                </button>
              </div>
            </div>

            {filteredGoals.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                  <Target className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">No objectives found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  {searchQuery ? "Try a different search term or" : "Get started by"} creating a new objective to track
                  your progress
                </p>
                <button
                  onClick={() => setShowNewGoalModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-1 transition-colors mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Objective</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGoals.map((goal) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="h-1" style={{ backgroundColor: goal.color }}></div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-1 mb-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(goal.category)}`}
                            >
                              {getCategoryIcon(goal.category)}
                              <span className="capitalize">{goal.category}</span>
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg">{goal.title}</h3>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => {
                              setSelectedGoal(goal)
                              setShowGoalDetailModal(true)
                            }}
                            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{goal.description}</p>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-gray-500 dark:text-gray-400">Progress</span>
                          <span className="font-medium">
                            {goal.progress}/{goal.target}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(goal.progress / goal.target) * 100}%` }}
                            transition={{ duration: 0.5 }}
                            className={`h-2 rounded-full ${getProgressColor(Math.round((goal.progress / goal.target) * 100))}`}
                          ></motion.div>
                        </div>
                        <div className="flex justify-between gap-2">
                          <button
                            onClick={() => handleProgressUpdate(goal.id, -1)}
                            className="flex-1 text-xs px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => handleProgressUpdate(goal.id, 1)}
                            className="flex-1 text-xs px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                          >
                            +1
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-1">
                          {goal.milestones.map((milestone, index) => (
                            <div
                              key={index}
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                                milestone.achieved
                                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-600"
                              }`}
                              title={`${milestone.percent}% - ${milestone.description}`}
                            >
                              {milestone.badge}
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {new Date(goal.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium flex items-center">
                            <MessageSquare className="h-3.5 w-3.5 mr-1" />
                            Comments ({goal.comments.length})
                          </h4>
                          <button
                            onClick={() => {
                              setSelectedGoal(goal)
                              setShowGoalDetailModal(true)
                            }}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                          >
                            View all
                            <ArrowRight className="h-3 w-3 ml-0.5" />
                          </button>
                        </div>

                        {goal.comments.length > 0 ? (
                          <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            <div className="flex items-start gap-2">
                              <Image
                                src={
                                  getUserById(goal.comments[goal.comments.length - 1].userId).avatar ||
                                  "/placeholder.svg"
                                }
                                alt={getUserById(goal.comments[goal.comments.length - 1].userId).name}
                                width={24}
                                height={24}
                                className="rounded-full mt-0.5"
                              />
                              <div>
                                <p className="font-medium text-xs">
                                  {getUserById(goal.comments[goal.comments.length - 1].userId).name}
                                </p>
                                <p className="line-clamp-1 text-xs">{goal.comments[goal.comments.length - 1].text}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">No comments yet</p>
                        )}

                        <div className="mt-3 flex items-center gap-2">
                          <Image
                            src={currentUser.avatar || "/placeholder.svg"}
                            alt={currentUser.name}
                            width={28}
                            height={28}
                            className="rounded-full flex-shrink-0"
                          />
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleAddComment(goal.id)
                                }
                              }}
                              className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                            />
                            <button
                              onClick={() => handleAddComment(goal.id)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Analytics Section */}
            {filteredGoals.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Analytics Overview</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                    <h4 className="font-medium mb-4">Objectives by Category</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getCategoryData()}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {getCategoryData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                    <h4 className="font-medium mb-4">Progress Overview</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getProgressData()} margin={{ top: 5, right: 5, left: 0, bottom: 25 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Bar dataKey="progress" fill="#1e3a8a" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating action button - Mobile only */}
      <button
        onClick={() => setShowNewGoalModal(true)}
        className="md:hidden fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors z-30"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* New Goal Modal */}
      <AnimatePresence>
        {showNewGoalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold">Create New Objective</h3>
                <button
                  onClick={() => setShowNewGoalModal(false)}
                  className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                      Objective Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={newGoalForm.title}
                      onChange={(e) => setNewGoalForm({ ...newGoalForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                      placeholder="Enter objective title"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={newGoalForm.description}
                      onChange={(e) => setNewGoalForm({ ...newGoalForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                      placeholder="Describe your objective"
                      rows={3}
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="target" className="block text-sm font-medium mb-1">
                        Target Value
                      </label>
                      <input
                        type="number"
                        id="target"
                        value={newGoalForm.target}
                        onChange={(e) =>
                          setNewGoalForm({ ...newGoalForm, target: Number.parseInt(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                        min="1"
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium mb-1">
                        Category
                      </label>
                      <select
                        id="category"
                        value={newGoalForm.category}
                        onChange={(e) => setNewGoalForm({ ...newGoalForm, category: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                      >
                        <option value="health">Health</option>
                        <option value="work">Work</option>
                        <option value="learning">Learning</option>
                        <option value="personal">Personal</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      value={newGoalForm.dueDate}
                      onChange={(e) => setNewGoalForm({ ...newGoalForm, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
                <button
                  onClick={() => setShowNewGoalModal(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGoal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                >
                  Create Objective
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold">Settings</h3>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon className="h-5 w-5" />
                    <span className="font-medium">Dark Mode</span>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${darkMode ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </button>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="font-medium mb-3">Account</h4>
                  <div className="flex items-center gap-3 mb-4">
                    <Image
                      src={currentUser.avatar || "/placeholder.svg"}
                      alt={currentUser.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium">{currentUser.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser.role}</p>
                    </div>
                  </div>

                  <button className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center gap-2 text-sm font-medium">
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="font-medium mb-3">Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Notifications</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Push Notifications</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Milestone Alerts</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="font-medium mb-3">Data Management</h4>
                  <div className="space-y-2">
                    <button className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-left text-sm">
                      Export All Data
                    </button>
                    <button className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-left text-sm text-red-600 dark:text-red-400">
                      Reset Application Data
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goal Detail Modal */}
      <AnimatePresence>
        {showGoalDetailModal && selectedGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col mx-4"
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 truncate max-w-[70%]">
                  <div
                    className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center ${getCategoryColor(selectedGoal.category)}`}
                  >
                    {getCategoryIcon(selectedGoal.category)}
                  </div>
                  <h3 className="text-lg font-bold truncate">{selectedGoal.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setShowGoalDetailModal(false)}
                    className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-gray-600 dark:text-gray-300">{selectedGoal.description}</p>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Progress</h4>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-500 dark:text-gray-400">Current Progress</span>
                        <span className="font-medium">
                          {selectedGoal.progress}/{selectedGoal.target}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                        <div
                          className={`h-2 rounded-full ${getProgressColor(Math.round((selectedGoal.progress / selectedGoal.target) * 100))}`}
                          style={{ width: `${(selectedGoal.progress / selectedGoal.target) * 100}%` }}
                        ></div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleProgressUpdate(selectedGoal.id, -5)}
                          className="flex-1 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleProgressUpdate(selectedGoal.id, -1)}
                          className="flex-1 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => handleProgressUpdate(selectedGoal.id, 1)}
                          className="flex-1 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleProgressUpdate(selectedGoal.id, 5)}
                          className="flex-1 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                        >
                          +5
                        </button>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Milestones</h4>
                      <div className="space-y-3">
                        {selectedGoal.milestones.map((milestone, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg flex items-center gap-3 ${
                              milestone.achieved
                                ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                                : "bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700"
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                                milestone.achieved
                                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                              }`}
                            >
                              {milestone.badge}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <h5 className="font-medium">{milestone.description}</h5>
                                <span className="text-sm">{milestone.percent}%</span>
                              </div>
                              {milestone.achieved && (
                                <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mt-1">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Achieved
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Details</h4>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 space-y-3 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Category</span>
                          <span className="font-medium capitalize">{selectedGoal.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Created</span>
                          <span className="font-medium">{new Date(selectedGoal.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Due Date</span>
                          <span className="font-medium">{new Date(selectedGoal.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Progress</span>
                          <span className="font-medium">
                            {Math.round((selectedGoal.progress / selectedGoal.target) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Comments</h4>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 max-h-80 overflow-y-auto border border-gray-200 dark:border-gray-700">
                        {selectedGoal.comments.length > 0 ? (
                          <div className="space-y-4">
                            {selectedGoal.comments.map((comment) => (
                              <div key={comment.id} className="flex gap-3">
                                <Image
                                  src={getUserById(comment.userId).avatar || "/placeholder.svg"}
                                  alt={getUserById(comment.userId).name}
                                  width={36}
                                  height={36}
                                  className="rounded-full mt-0.5"
                                />
                                <div className="flex-1">
                                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="font-medium">{getUserById(comment.userId).name}</span>
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatDate(comment.date)}
                                      </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">{comment.text}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 dark:text-gray-400 py-4">No comments yet</div>
                        )}
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <Image
                          src={currentUser.avatar || "/placeholder.svg"}
                          alt={currentUser.name}
                          width={36}
                          height={36}
                          className="rounded-full flex-shrink-0"
                        />
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleAddComment(selectedGoal.id)
                              }
                            }}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                          />
                          <button
                            onClick={() => handleAddComment(selectedGoal.id)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <button
                  onClick={() => handleDeleteGoal(selectedGoal.id)}
                  className="px-4 py-2 text-red-600 hover:text-red-700 dark:hover:text-red-400 flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Objective</span>
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowGoalDetailModal(false)}
                    className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowGoalDetailModal(false)
                      setShowShareModal(true)
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium flex items-center gap-1"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && selectedGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold">Share Objective</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${getCategoryColor(selectedGoal.category)}`}
                    >
                      {getCategoryIcon(selectedGoal.category)}
                    </div>
                    <div>
                      <h4 className="font-medium">{selectedGoal.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {Math.round((selectedGoal.progress / selectedGoal.target) * 100)}% Complete
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(Math.round((selectedGoal.progress / selectedGoal.target) * 100))}`}
                      style={{ width: `${(selectedGoal.progress / selectedGoal.target) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Share Link</label>
                  <div className="flex">
                    <input
                      readOnly
                      value={`https://objectives.app/goals/${selectedGoal.id}`}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                    />
                    <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md">Copy</button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Share with Collaborators</label>
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {mockUsers
                      .filter((user) => user.id !== currentUser.id)
                      .map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <div className="flex items-center gap-3">
                            <Image
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                              width={36}
                              height={36}
                              className="rounded-full"
                            />
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                            </div>
                          </div>
                          <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md text-sm">
                            Share
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
