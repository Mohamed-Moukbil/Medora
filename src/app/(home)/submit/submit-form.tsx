'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createProof, getAllTags } from '@/lib/actions/proofs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { TagInput } from '@/components/ui/tag-input'
import { toast } from 'sonner'
import { Loader2, Sparkles, Eye, Code2 } from 'lucide-react'
import { MathMarkdown } from '@/components/proof/math-markdown'

interface Subject {
  id: string
  name: string
  slug: string
  subSubjects: { id: string; name: string; slug: string; _count: { proofs: number } }[]
}

export function SubmitProofForm({ subjects }: { subjects: Subject[] }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState('')
  const [preview, setPreview] = useState(false)
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])

  useEffect(() => {
    getAllTags().then(t => setAllTags(t.map(tag => tag.name)))
  }, [])

  const currentSubject = subjects.find(s => s.id === selectedSubject)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      const result = await createProof(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Proof submitted successfully! It will be reviewed by our moderators.')
        router.push('/dashboard/submissions')
        router.refresh()
      }
    } catch {
      toast.error('Failed to submit proof')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              name="title"
              placeholder="e.g., Proof of the Pythagorean Theorem"
              required
              minLength={3}
              maxLength={200}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <select
                name="subjectId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                required
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
              >
                <option value="">Select a subject</option>
                {subjects.map(s => (
                  <optgroup key={s.id} label={s.name}>
                    <option value={s.id}>{s.name}</option>
                  </optgroup>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic (optional)</label>
              <select
                name="subSubjectId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                disabled={!currentSubject}
              >
                <option value="">Select a topic</option>
                {currentSubject?.subSubjects.map(ss => (
                  <option key={ss.id} value={ss.id}>{ss.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Short Description</label>
            <Input
              name="description"
              placeholder="A brief summary of your proof"
              required
              minLength={10}
              maxLength={500}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <input type="hidden" name="tags" value={JSON.stringify(tags)} />
            <TagInput
              tags={tags}
              onChange={setTags}
              suggestions={allTags}
              placeholder="Type to search or create tags..."
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Proof Content (LaTeX supported)</label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPreview(!preview)}
                className="gap-2"
              >
                {preview ? (
                  <><Code2 className="h-4 w-4" /> Edit</>
                ) : (
                  <><Eye className="h-4 w-4" /> Preview</>
                )}
              </Button>
            </div>
            <input type="hidden" name="content" value={content} />
            {preview ? (
              <Card className="min-h-[300px] border-2 border-primary/20">
                <CardContent className="p-6">
                  <div className="prose prose-sm max-w-none">
                    <MathMarkdown content={content || '*Nothing to preview*'} />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Textarea
                placeholder={`Write your proof here... Use $...$ for inline math and $$...$$ for display math.

Example:
**Theorem:** The sum of angles in a triangle is $180^\\circ$.

**Proof:**
Let $\\triangle ABC$ be a triangle. Draw a line through $A$ parallel to $BC$.

$$\\angle A + \\angle B + \\angle C = 180^\\circ$$`}
                className="min-h-[400px] font-mono text-sm"
                required
                minLength={10}
                value={content}
                onChange={e => setContent(e.target.value)}
              />
            )}
            <p className="text-xs text-muted-foreground">
              Use $...$ for inline math and $$...$$ for display math. Supports full LaTeX.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
          ) : (
            <><Sparkles className="h-4 w-4" /> Submit Proof</>
          )}
        </Button>
      </div>
    </form>
  )
}
