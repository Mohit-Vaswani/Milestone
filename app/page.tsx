"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function OneManDBMilestone() {
  const TOTAL_CHECKBOXES = 1000
  const STORAGE_KEY = "onemandb_milestone"
  const PRICE_PER_SALE = 37

  const [checkedState, setCheckedState] = useState<boolean[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    }
    return []
  })

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true"
    }
    return false
  })

  const [showConfetti, setShowConfetti] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedState))
    }
  }, [checkedState])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", isDarkMode.toString())
      if (isDarkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [isDarkMode])

  const toggleCheckbox = (index: number) => {
    setCheckedState((prev) => {
      const newState = [...prev]
      const wasChecked = !!newState[index]
      newState[index] = !wasChecked

      // Show confetti on milestone completions (every 100 sales)
      const newCount = newState.filter(Boolean).length
      if (!wasChecked && newCount % 100 === 0 && newCount > 0) {
        triggerConfetti()
      }

      return newState
    })
  }

  const triggerConfetti = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  const completedCount = checkedState.filter(Boolean).length
  const completionPercentage = (completedCount / TOTAL_CHECKBOXES) * 100
  const totalRevenue = completedCount * PRICE_PER_SALE

  const milestones = [
    { at: 250, label: "25%" },
    { at: 500, label: "50%" },
    { at: 750, label: "75%" },
    { at: 1000, label: "100%" },
  ]

  return (
    <div
      className={`min-h-screen flex flex-col items-center transition-colors duration-300 ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"}`}
    >
      {showConfetti && <Confetti />}

      <header className="w-full px-4 py-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex flex-col items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>

        <div className="flex items-center justify-between w-full max-w-6xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">1000 Sales Milestone</h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="mt-10 w-full max-w-xl z-10">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">{completedCount} completed</span>
            <span className="font-medium">{Math.round(completionPercentage)}%</span>
          </div>

          <div className="h-3 w-full bg-black/20 dark:bg-white/20 rounded-full overflow-hidden backdrop-blur-sm relative">
            <motion.div
              className="h-full bg-gradient-to-r from-white to-white/80 dark:from-indigo-400 dark:to-purple-400"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.5 }}
            />

            {/* Milestone markers */}
            {milestones.map((milestone) => (
              <div
                key={milestone.at}
                className="absolute top-0 bottom-0 flex flex-col items-center"
                style={{ left: `${(milestone.at / TOTAL_CHECKBOXES) * 100}%` }}
              >
                <div className="h-full w-0.5 bg-white/30"></div>
                <span className="absolute -bottom-6 text-xs font-medium transform -translate-x-1/2">
                  {milestone.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium opacity-80">Current Revenue</p>
              <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium opacity-80">Remaining</p>
              <p className="text-xl font-semibold">{TOTAL_CHECKBOXES - completedCount} sales</p>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-6xl px-4 py-10">
        <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-20 gap-1.5 md:gap-2">
          {Array.from({ length: TOTAL_CHECKBOXES }, (_, i) => (
            <div
              key={i}
              className="flex flex-col items-center"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <AnimatePresence>
                {hoveredIndex === i && (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -mt-8 text-xs font-medium px-2 py-1 rounded-md bg-gray-800 text-white dark:bg-white dark:text-gray-900 z-10"
                  >
                    #{i + 1}
                  </motion.span>
                )}
              </AnimatePresence>

              <button
                onClick={() => toggleCheckbox(i)}
                className="group relative flex items-center justify-center"
                aria-label={`Toggle sale ${i + 1}`}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    w-6 h-6 sm:w-7 sm:h-7 rounded-md border-2 transition-all duration-200
                    ${
                      checkedState[i]
                        ? "bg-gradient-to-br from-indigo-600 to-purple-600 border-transparent shadow-lg shadow-indigo-500/20"
                        : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400"
                    }
                  `}
                >
                  {checkedState[i] && (
                    <motion.svg
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-4 h-4 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </motion.svg>
                  )}
                </motion.div>
              </button>
            </div>
          ))}
        </div>
      </main>

      <footer className="w-full py-8 mt-auto flex justify-center items-center gap-4">
        <button
          onClick={() => setCheckedState([])}
          className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-medium shadow-lg shadow-rose-500/20 hover:shadow-xl hover:shadow-rose-500/30 transition-all duration-200 transform hover:-translate-y-0.5"
        >
          Reset Progress
        </button>

        <button
          onClick={() => {
            const newState = Array(TOTAL_CHECKBOXES).fill(true)
            setCheckedState(newState)
            triggerConfetti()
          }}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 transform hover:-translate-y-0.5"
        >
          Complete All
        </button>
      </footer>
    </div>
  )
}

// Simple confetti component
function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 100 }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-2 h-2 rounded-full"
          initial={{
            top: "-10%",
            left: `${Math.random() * 100}%`,
            backgroundColor: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"][
              Math.floor(Math.random() * 6)
            ],
          }}
          animate={{
            top: "100%",
            left: `${Math.random() * 100}%`,
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: Math.random() * 2 + 2,
            ease: "easeOut",
            delay: Math.random(),
          }}
          style={{
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
          }}
        />
      ))}
    </div>
  )
}

