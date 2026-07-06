'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfile } from '@/lib/actions/proofs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { Loader2, Save, User } from 'lucide-react'

export function SettingsForm({ user }: { user: { id: string; name: string | null; email: string | null; image: string | null } }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(user.image || '')

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      await updateProfile(formData)
      toast.success('Profile updated successfully!')
      router.refresh()
    } catch (e: any) {
      toast.error(e.message || 'Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={previewUrl || undefined} />
              <AvatarFallback className="text-2xl">{user.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name || 'User'}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input name="name" defaultValue={user.name || ''} placeholder="Your name" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Profile Picture URL</label>
            <Input
              name="image"
              value={previewUrl}
              onChange={e => setPreviewUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
            <p className="text-xs text-muted-foreground">
              Paste a URL to any image (GitHub, Google, Gravatar, etc.)
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
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