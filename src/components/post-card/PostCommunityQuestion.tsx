'use client'
// @ts-expect-error it works
import { Answer, Prisma } from '@prisma/client'

// @ts-expect-error it works
type QuestionWithAnswers = Prisma.QuestionGetPayload<{
  include: { answers: true }
}>

type Props = {
  question: QuestionWithAnswers
}
export default function PostCommunityQuestion({ question }: Props) {
  if (!question || !question.answers || question.answers.length === 0) {
    return null
  }

  let numberOfUserAnswers = 0

  // @ts-expect-error it works
  question.answers.forEach((answer) => {
    numberOfUserAnswers += answer.votes
  })

  function getAnswerVotePercentage(answer: Answer) {
    if (numberOfUserAnswers === 0) {
      return 0
    }

    return Math.round((answer.votes / numberOfUserAnswers) * 100)
  }

  async function handleAnswerClick(answer: Answer) {
    const response = await fetch(
      '/api/posts/question/' + question.id + '/answer/' + answer.id,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: question.id,
        }),
      },
    )

    if (response.ok) {
      const data = await response.json()
      console.log(data)
    }
  }

  return (
    <div className={'mt-4 rounded-lg bg-gray-100 p-4'}>
      <h2 className={'text-lg font-semibold'}>
        {question.question} - {numberOfUserAnswers}
      </h2>
      <ul className={'list-none space-y-4'}>
        {/* @ts-expect-error it works */}
        {question.answers.map((answer) => (
          <li
            key={'answer-' + answer.id}
            className={'relative rounded bg-gray-200 p-2'}
          >
            <button
              onClick={() => handleAnswerClick(answer)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleAnswerClick(answer)
                }
              }}
              className="w-full text-left"
            >
              <span className={'relative z-10 block'}>
                {answer.content} ({answer.votes})
              </span>
              <div
                className={'absolute top-0 left-0 z-0 h-full bg-gray-300'}
                style={{ width: getAnswerVotePercentage(answer) + '%' }}
              ></div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
