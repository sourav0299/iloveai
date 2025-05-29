"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/useDebouce"

interface TopSearch{
  keyword: string;
  count: number;
}

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [topSearches, setTopSearches] = useState<TopSearch[]>([])

  const debouncedQuery = useDebounce(query, 500)

  console.log(debouncedQuery)

   useEffect(() => {
    fetchTopSearches()
  }, [])

  useEffect(() => {
    if(debouncedQuery){
      performSearch(debouncedQuery)
    }
  }, [debouncedQuery])

    const fetchTopSearches = async () => {
    try {
      const response = await fetch('/api/searchedKeywords')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setTopSearches(data)
    } catch (error) {
      console.error('Error fetching top searches:', error)
    }
  }

    const performSearch = async(searchQuery: string) => {
    try {
      // Save the search query
      await fetch('/api/searchedKeywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      })

      // Refresh the top searches
      await fetchTopSearches()
      
      // Here you can add your actual search logic
      console.log('Searching for:', searchQuery)
    } catch (error) {
      console.error('Error performing search:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if(query.trim())[
      performSearch(query)
    ]
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setShowDropdown(true)
  }

  const handleItemClick = (item: string) => {
    setQuery(item)
    setShowDropdown(false)
  }

  const mostSearchedItem = topSearches.slice(0, 1)
  const recentItems = topSearches.slice(1, 4)

  return (
    <div className="w-full max-w-xl mx-auto relative" ref={dropdownRef}>
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="Search..."
          className="pl-10 h-12 rounded-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </form>

      {showDropdown && (
        <div className="absolute w-full bottom-[calc(100%+0.5rem)] bg-popover text-popover-foreground rounded-lg shadow-lg border border-border z-50">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Most Searched</h3>
            <ul className="space-y-2">
              {mostSearchedItem.map((item, index) => (
                <li
                  key={`most-${index}`}
                  className="cursor-pointer rounded transition-colors duration-200"
                  onClick={() => handleItemClick(item.keyword)}
                >
                  {item.keyword}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="border-t border-border"></div>
          
          <div className="p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Recently Searched</h3>
            <ul className="space-y-2">
              {recentItems.map((item, index) => (
                <li
                  key={`recent-${index}`}
                  className="cursor-pointer rounded transition-colors duration-200"
                  onClick={() => handleItemClick(item.keyword)}
                >
                  {item.keyword}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}