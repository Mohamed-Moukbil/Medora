'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export function SearchInput({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(defaultValue || '')
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const valueRef = useRef(value)
  valueRef.current = value

  const updateSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (term) {
        params.set('search', term)
      } else {
        params.delete('search')
      }
      params.set('page', '1')
      router.push(`/proofs?${params.toString()}`)
    },
    [router, searchParams]
  )

  useEffect(() => {
    const current = searchParams.get('search') || ''
    if (current !== valueRef.current) {
      setValue(current)
    }
  }, [searchParams])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    const currentParam = searchParams.get('search') || ''
    if (value === currentParam) return
    timerRef.current = setTimeout(() => updateSearch(value), 300)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [value, updateSearch, searchParams])

  return (
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search proofs..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-9"
      />
    </div>
  )
}
