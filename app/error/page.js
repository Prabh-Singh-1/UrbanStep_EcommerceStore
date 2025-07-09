import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function AuthError() {
  const router = useRouter()
  const { error } = router.query

  useEffect(() => {
    if (error === 'user-not-found') {
        
      router.replace('/signup?message=User%20does%20not%20exist')
    }
  }, [error, router])

  return null
}