import type { User } from '@prisma/client'

export async function getUser(firebaseUid: string): Promise<User | null> {
  const response = await fetch(`/api/sso-login?firebaseUid=${firebaseUid}`)
  if (!response.ok) return null
  return response.json()
}

export async function createUser(data: {
  firebaseUid: string
  email: string
  displayName: string | null
  photoURL: string | null
}): Promise<User> {
  const response = await fetch('/api/sso-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return response.json()
}

export async function updateUserLastLogin(firebaseUid: string): Promise<User> {
  const response = await fetch(`/api/sso-login?firebaseUid=${firebaseUid}`, {
    method: 'PATCH'
  })
  return response.json()
}