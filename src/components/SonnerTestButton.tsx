'use client'

import { nanoid } from 'nanoid'
import { toast } from 'sonner'

export const SonnerTestButton = () => {
  return <button onClick={() => toast(nanoid(10))}>Click me</button>
}
