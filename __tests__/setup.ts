import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { RenderOptions } from '@testing-library/react'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import type { ReactElement } from 'react'
import React from 'react'

// Create a new QueryClient for each test
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

export const setup = (
  jsx: ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
) => {
  const queryClient = createQueryClient()
  const wrappedJsx = React.createElement(
    QueryClientProvider,
    { client: queryClient },
    jsx,
  )

  return {
    user: userEvent.setup(),
    ...render(wrappedJsx, options),
    queryClient,
  }
}
