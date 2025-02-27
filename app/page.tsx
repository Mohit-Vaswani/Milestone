"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function OneManDBMilestone() {
  const TOTAL_CHECKBOXES = 1000
  const STORAGE_KEY = "onemandb_milestone"

  const [checkedState, setCheckedState] = useState<boolean[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    }
    return []
  })

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedState))
    }
  }, [checkedState])

  const toggleCheckbox = (index: number) => {
    setCheckedState((prev) => {
      const newState = [...prev]
      newState[index] = !newState[index]
      return newState
    })
  }

  const completedCount = checkedState.filter(Boolean).length
  const completionPercentage = (completedCount / TOTAL_CHECKBOXES) * 100

  return (
    <div className="min-h-screen flex flex-col items-center bg-white text-black">
      <header className="w-full py-8 bg-black text-white flex flex-col items-center">
        <h1 className="text-4xl font-bold tracking-tight">OneManDB Milestone</h1>
        <div className="mt-6 w-full max-w-md">
          <div className="flex justify-between text-sm mb-1">
            <span>{completedCount} completed</span>
            <span>{Math.round(completionPercentage)}%</span>
          </div>
          <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </header>

      <main className="w-full max-w-6xl px-4 py-10">
        <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-20 gap-2 md:gap-3">
          {Array.from({ length: TOTAL_CHECKBOXES }, (_, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-xs font-medium mb-1 block">{i + 1}</span>
              <button onClick={() => toggleCheckbox(i)} className="group relative flex items-center justify-center">
                <div
                  className={`
                  w-8 h-8 rounded-md border-2 transition-all duration-200
                  ${checkedState[i] ? "bg-black border-black" : "bg-white border-gray-300 hover:border-gray-800"}
                `}
                >
                  {checkedState[i] && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 text-white"
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
                </div>
              </button>
            </div>
          ))}
        </div>
      </main>

      <footer className="w-full py-6 bg-gray-100 mt-auto flex justify-center">
        <button
          onClick={() => setCheckedState([])}
          className="px-4 py-2 border-2 border-black text-black hover:bg-black hover:text-white transition-colors duration-200 rounded-md font-medium"
        >
          Reset Progress
        </button>
      </footer>
    </div>
  )
}

