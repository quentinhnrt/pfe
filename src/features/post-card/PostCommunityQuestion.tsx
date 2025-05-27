"use client";
import { Answer, Prisma } from "@prisma/client";
import { useState, useEffect } from "react";

type QuestionWithAnswers = Prisma.QuestionGetPayload<{
  include: { answers: true };
}>;

type Props = {
  question: QuestionWithAnswers;
  userAnswerId?: number;
};

export default function PostCommunityQuestion({ question, userAnswerId }: Props) {
  const [answers, setAnswers] = useState<Answer[]>(question.answers || []);
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      const res = await fetch(`/api/posts/question/${question.id}/answer/${answerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: question.id }),
      });

      if (res.ok) {
        setAnswers((prev) =>
          prev.map((a) =>
            a.id === answerId ? { ...a, votes: a.votes + 1 } : a
          )
        );
        setSelectedAnswerId(answerId);
      }
    } catch (err) {
      console.error("Erreur lors du vote :", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white border border-gray-200 p-4 rounded-lg">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {question.question}
        <span className="ml-2 text-sm text-blue-600">
          ({totalVotes} vote{totalVotes !== 1 ? "s" : ""})
        </span>
      </h2>

      <ul className="space-y-3">
        {answers.map((answer) => {
          const isSelected = selectedAnswerId === answer.id;
          const percent = totalVotes ? Math.round((answer.votes / totalVotes) * 100) : 0;

          return (
            <li key={answer.id}>
              <button
                onClick={() => handleVote(answer.id)}
                disabled={hasVoted || isLoading}
                className="w-full text-left"
              >
                <div className="relative bg-gray-100 border rounded-lg overflow-hidden">
                  {(hasVoted || userAnswerId) && (
                    <div
                      className={`absolute top-0 left-0 h-full transition-all duration-300 ${
                        isSelected ? "bg-gray-300" : "bg-gray-100"
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  )}

                  <div className="relative z-10 p-3 flex justify-between items-center">
                    <span className={`font-medium ${isSelected ? "text-gray-700" : "text-gray-800"}`}>
                      {answer.content}
                      {isSelected && (
                        <span className="ml-2 text-xs bg-blue-100 text-gray-700 px-2 py-0.5 rounded-full">
                          Votre choix
                        </span>
                      )}
                    </span>

                    {(hasVoted || userAnswerId) ? (
                      <span className="text-sm text-gray-700 font-medium">
                        {percent}% – {answer.votes} vote{answer.votes !== 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">({answer.votes})</span>
                    )}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {isLoading && (
        <p className="mt-4 text-sm text-gray-600">Enregistrement du vote...</p>
      )}

      {hasVoted && !userAnswerId && (
        <p className="mt-4 text-sm text-blue-700 bg-blue-50 border border-blue-200 p-3 rounded">
          Merci pour votre vote ! Les résultats sont maintenant visibles.
        </p>
      )}

      {userAnswerId && (
        <p className="mt-4 text-sm text-gray-700 bg-gray-100 border border-gray-200 p-3 rounded">
          Vous avez déjà répondu à cette question.
        </p>
      )}
    </div>
  );
}
