'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { updateProof, getAllTags } from '@/lib/actions/proofs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { TagInput } from '@/components/ui/tag-input'
import { toast } from 'sonner'
import { Loader2, Eye, Code2, Save } from 'lucide-react'
import { MathMarkdown } from '@/components/proof/math-markdown'

interface Subject {
  id: string
  name: string
  slug: string
  subSubjects: { id: string; name: string; slug: string }[]
}

export function EditProofForm({ proof, subjects }: { proof: { id: string; slug: string; title: string; content: string; description: string | null; subjectId: string; subSubjectId: string | null; tags?: { id: string; name: string; slug: string }[] }; subjects: Subject[] }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState(proof.subjectId)
  const [preview, setPreview] = useState(false)
  const [content, setContent] = useState(proof.content)
  const [tags, setTags] = useState<string[]>(proof.tags?.map(t => t.name) || [])
  const [allTags, setAllTags] = useState<string[]>([])

  useEffect(() => {
    getAllTags().then(t => setAllTags(t.map(tag => tag.name)))
  }, [])

  const currentSubject = subjects.find(s => s.id === selectedSubject)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      await updateProof(proof.id, formData)
      toast.success('Proof updated successfully!')
      router.push(`/proofs/${proof.slug}`)
      router.refresh()
    } catch (e: any) {
      toast.error(e.message || 'Failed to update proof')
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
              defaultValue={proof.title}
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
                defaultValue={proof.subSubjectId || ''}
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
              defaultValue={proof.description || ''}
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
                className="min-h-[400px] font-mono text-sm textarea-hidden"
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
            <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
          ) : (
            <><Save className="h-4 w-4" /> Save Changes</>
          )}
        </Button>
      </div>
    </form>
  )
}