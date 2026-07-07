import { describe, it, expect } from 'vitest'
import { z } from 'zod'

const createProofSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(10),
  description: z.string().min(10).max(500),
  subjectId: z.string(),
  subSubjectId: z.string().optional(),
})

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
})

describe('createProofSchema', () => {
  it('validates a correct payload', () => {
    const result = createProofSchema.parse({
      title: 'Pythagorean Theorem Proof',
      content: 'Let a, b, c be the sides...',
      description: 'A visual proof of the Pythagorean theorem.',
      subjectId: 'abc123',
    })
    expect(result.title).toBe('Pythagorean Theorem Proof')
  })

  it('rejects a title that is too short', () => {
    expect(() =>
      createProofSchema.parse({
        title: 'AB',
        content: 'a'.repeat(10),
        description: 'd'.repeat(10),
        subjectId: 'abc',
      })
    ).toThrow()
  })

  it('rejects content that is too short', () => {
    expect(() =>
      createProofSchema.parse({
        title: 'Valid Title',
        content: 'short',
        description: 'desc'.repeat(4),
        subjectId: 'abc',
      })
    ).toThrow()
  })

  it('rejects missing required fields', () => {
    expect(() =>
      createProofSchema.parse({
        title: 'Valid Title',
      })
    ).toThrow()
  })

  it('accepts optional subSubjectId', () => {
    const result = createProofSchema.parse({
      title: 'Proof Title',
      content: 'x'.repeat(10),
      description: 'y'.repeat(10),
      subjectId: 's1',
      subSubjectId: 'ss1',
    })
    expect(result.subSubjectId).toBe('ss1')
  })
})

describe('contactSchema', () => {
  it('validates a correct contact submission', () => {
    const result = contactSchema.parse({
      name: 'Alice',
      email: 'alice@example.com',
      message: 'Hello, I have a question.',
    })
    expect(result.email).toBe('alice@example.com')
  })

  it('rejects invalid email', () => {
    expect(() =>
      contactSchema.parse({
        name: 'Alice',
        email: 'not-an-email',
        message: 'Hello',
      })
    ).toThrow()
  })

  it('rejects empty name', () => {
    expect(() =>
      contactSchema.parse({
        name: '',
        email: 'a@b.com',
        message: 'Hello',
      })
    ).toThrow()
  })
})
