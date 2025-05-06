import { templates } from '@/lib/templates'
import { Prisma } from '@prisma/client'
import { notFound } from 'next/navigation'

// @ts-expect-error it works
type UserWithTemplate = Prisma.UserGetPayload<{
  include: {
    posts: {
      include: {
        artworks: true
        question: {
          include: {
            answers: true
          }
        }
      }
    }
    user_template: {
      where: {
        active: true
      }
      include: {
        template: true
      }
    }
  }
}>
export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const response = await fetch(
    process.env.BETTER_AUTH_URL + '/api/user/username/' + username,
  )

  if (!response.ok) {
    console.log('Error fetching user data:', response.statusText)
    notFound()
  }

  const user: UserWithTemplate = await response.json()

  const activeTemplate = user.user_template[0]

  if (!activeTemplate) {
    console.log('No active template found for user:', username)
    notFound()
  }

  const templateId = activeTemplate.template.slug

  // @ts-expect-error it is a dynamic import
  const Template = templates[templateId]?.render.default

  if (!Template) {
    console.log('Template not found:', templateId)
    notFound()
  }

  return (
    <div>
      <h1>Portfolio</h1>
      <p>Portfolio of {username}</p>
      <p>Active template: {templateId}</p>

      <Template data={activeTemplate.data} user={user} />
    </div>
  )
}
