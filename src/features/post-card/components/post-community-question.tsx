"use client";
import { Card } from "@/components/ui/shadcn/card";
import { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import {useTranslations} from "next-intl";

type QuestionWithAnswers = Prisma.QuestionGetPayload<{
  include: { answers: { include: { users: true } } };
}>;

type AnswerWithUsers = Prisma.AnswerGetPayload<{
  include: { users: true };
}>;

type Props = {
  question: QuestionWithAnswers;
  userAnswerId?: number;
};

export default function PostCommunityQuestion({
  question,
  userAnswerId,
}: Props) {
  const [answers, setAnswers] = useState<AnswerWithUsers[]>(
    question.answers || []
  );
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("feature.post-community-question");

  answers.map((answer) => {
    if (answer.users?.length > 0) {
      userAnswerId = answer.id;
    }
  });

  useEffect(() => {
    if (userAnswerId) {
      setSelectedAnswerId(userAnswerId);
    }
  }, [userAnswerId]);

  const hasVoted = selectedAnswerId !== null;
  const totalVotes = answers.reduce((sum, a) => sum + a.votes, 0);

  async function handleVote(answerId: number) {
    if (hasVoted || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/posts/question/${question.id}/answer/${answerId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionId: question.id }),
        }
      );

      if (res.ok) {
        setAnswers((prev) =>
          prev.map((a) =>
            a.id === answerId ? { ...a, votes: a.votes + 1 } : a
          )
        );
        setSelectedAnswerId(answerId);
      }
    } catch (err) {
      console.error("Error while voting :", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="p-3 sm:p-4 rounded-lg">
      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
        {question.question}
        <span className="ml-2 text-xs sm:text-sm text-blue-600">
          ({totalVotes} vote{totalVotes !== 1 ? "s" : ""})
        </span>
      </h2>

      <ul className="space-y-2 sm:space-y-3">
        {answers.map((answer) => {
          const isSelected = selectedAnswerId === answer.id;
          const percent = totalVotes
            ? Math.round((answer.votes / totalVotes) * 100)
            : 0;

          return (
            <li key={answer.id}>
              <button
                onClick={() => handleVote(answer.id)}
                disabled={hasVoted || isLoading}
                className="w-full text-left"
              >
                <div className="relative bg-gray-100 dark:bg-transparent border rounded-lg overflow-hidden">
                  {(hasVoted || userAnswerId) && (
                    <div
                      className={`absolute top-0 left-0 h-full transition-all duration-300 bg-white`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  )}

                  <div className="relative z-10 p-2 sm:p-3 flex justify-between items-center">
                    <span
                      className={`font-medium w-4/5 text-xs sm:text-sm text-gray-700`}
                    >
                      {answer.content}
                      {isSelected && (
                        <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs bg-blue-100 text-gray-700 px-1 sm:px-2 py-0.5 rounded-full">
                          Votre choix
                        </span>
                      )}
                    </span>

                    {hasVoted || userAnswerId ? (
                      <span className="text-xs sm:text-sm font-medium">
                        {percent}% – {answer.votes} vote
                        {answer.votes !== 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-xs sm:text-sm text-gray-500">
                        ({answer.votes})
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {isLoading && (
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
          {t("vote-registering")}
        </p>
      )}

      {hasVoted && !userAnswerId && (
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-blue-700 bg-blue-50 border border-blue-200 p-2 sm:p-3 rounded">
            {t("vote-success")}
        </p>
      )}

      {userAnswerId && (
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-700 bg-gray-100 border border-gray-200 p-2 sm:p-3 rounded">
          {t("already-answered")}
        </p>
      )}
    </Card>
  );
}
