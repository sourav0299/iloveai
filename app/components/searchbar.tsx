"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", query)
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="Search..."
          className="pl-10 h-12 rounded-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </form>
    </div>
  )
}
