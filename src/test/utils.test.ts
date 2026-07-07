import { describe, it, expect } from 'vitest'
import { cn, formatDate, formatRelativeTime, generateSlug, truncate, getInitials } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })

  it('merges tailwind classes correctly', () => {
    expect(cn('px-4 py-2', 'px-6')).toBe('py-2 px-6')
  })
})

describe('formatDate', () => {
  it('formats a date string', () => {
    const result = formatDate('2024-01-15')
    expect(result).toContain('January')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })

  it('formats a Date object', () => {
    const result = formatDate(new Date(2024, 0, 15))
    expect(result).toContain('January')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })
})

describe('formatRelativeTime', () => {
  it('returns "just now" for recent dates', () => {
    expect(formatRelativeTime(new Date())).toBe('just now')
  })

  it('returns minutes ago', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000)
    expect(formatRelativeTime(fiveMinAgo)).toBe('5m ago')
  })

  it('returns hours ago', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000)
    expect(formatRelativeTime(threeHoursAgo)).toBe('3h ago')
  })

  it('returns days ago', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    expect(formatRelativeTime(twoDaysAgo)).toBe('2d ago')
  })
})

describe('generateSlug', () => {
  it('converts text to a slug', () => {
    expect(generateSlug('Hello World')).toBe('hello-world')
  })

  it('removes special characters', () => {
    expect(generateSlug('Hello! World?')).toBe('hello-world')
  })

  it('handles multiple spaces and dashes', () => {
    expect(generateSlug('Pythagorean   Theorem')).toBe('pythagorean-theorem')
  })

  it('trims leading and trailing dashes', () => {
    expect(generateSlug('--hello--')).toBe('hello')
  })

  it('handles empty string', () => {
    expect(generateSlug('')).toBe('')
  })
})

describe('truncate', () => {
  it('returns text as-is if within length', () => {
    expect(truncate('hello', 10)).toBe('hello')
  })

  it('truncates and adds ellipsis', () => {
    expect(truncate('hello world this is long', 10)).toBe('hello worl...')
  })

  it('handles exact length', () => {
    expect(truncate('hello', 5)).toBe('hello')
  })
})

describe('getInitials', () => {
  it('gets initials from a full name', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })

  it('handles single name', () => {
    expect(getInitials('Alice')).toBe('A')
  })

  it('caps at 2 characters', () => {
    expect(getInitials('John Michael Doe')).toBe('JM')
  })

  it('handles lowercase input', () => {
    expect(getInitials('john doe')).toBe('JD')
  })
})
