import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'
import { rules } from './handlers/rules'

export const worker = setupWorker(
  ...handlers,
  ...rules
)