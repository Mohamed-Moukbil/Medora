'use client'

import { useTransition } from 'react'
import { saveProof, unsaveProof } from '@/lib/actions/proofs'
import { Button } from '@/components/ui/button'
import { Bookmark } from 'lucide-react'

export function SaveButton({ proofId, initialSaved }: { proofId: string; initialSaved: boolean }) {
  const [isPending, startTransition] = useTransition()

  const toggle = () => {
    startTransition(async () => {
      if (initialSaved) {
        await unsaveProof(proofId)
      } else {
        await saveProof(proofId)
      }
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5"
      onClick={toggle}
      disabled={isPending}
    >
      <Bookmark className={`h-3.5 w-3.5 ${initialSaved ? 'fill-current' : ''}`} />
      {initialSaved ? 'Saved' : 'Save'}
    </Button>
  )
}
