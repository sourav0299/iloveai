import { NextResponse } from 'next/server'
import redis from '@/lib/redis'

const SEARCH_COUNTS_KEY = 'search_counts'
const MAX_RESULTS = 5

export async function POST(req: Request) {
  try {
    const { query } = await req.json()
    const cleanQuery = query.trim().toLowerCase()
    
    if (!cleanQuery) {
      return NextResponse.json({ error: 'Invalid query' }, { status: 400 })
    }

    // Increment the search count for this keyword
    await redis.zincrby(SEARCH_COUNTS_KEY, 1, cleanQuery)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save search' }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Get top 5 searched keywords with their counts
    const results = await redis.zrevrange(SEARCH_COUNTS_KEY, 0, MAX_RESULTS - 1, 'WITHSCORES')
    
    // Convert the flat array into an array of objects
    const topSearches = []
    for (let i = 0; i < results.length; i += 2) {
      topSearches.push({
        keyword: results[i],
        count: parseInt(results[i + 1])
      })
    }
    
    return NextResponse.json(topSearches)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch searches' }, { status: 500 })
  }
}