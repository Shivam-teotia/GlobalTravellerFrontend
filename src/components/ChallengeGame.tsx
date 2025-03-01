"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2, RefreshCw, Share2 } from "lucide-react";
import ConfettiExplosion from "react-confetti-explosion";
import ChallengeShareModal from "@/components/ChallengeShareModel";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface Destination {
    _id: string;
    city: string;
    country: string;
    clues: string[];
    fun_facts: string[];
    trivia: string[];
}

interface ChallengeGameProps {
    userId?: string;
    challengeId?: string;
    challengeImageUrl?: string;
}

export default function ChallengeGame({
    userId,
    challengeImageUrl,
}: ChallengeGameProps) {
    const [destination, setDestination] = useState<Destination | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [funFact, setFunFact] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [score, setScore] = useState({ correct: 0, incorrect: 0 });
    const [isExploding, setIsExploding] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const { token } = useAuth();

    const fetchDestination = useCallback(async () => {
        setIsLoading(true);
        setSelectedOption(null);
        setIsCorrect(null);
        setFunFact("");

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}destinations/random`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch destination");
            }

            const data = await response.json();
            setDestination(data);
            setOptions(["Cairo", "India", "Egypt"]);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    const checkAnswer = async (selected: string) => {
        setSelectedOption(selected);
        const normalizeString = (str: string) =>
            str.trim().toLowerCase().replace(/\s+/g, " ");

        const selectedNormalized = normalizeString(selected);
        const cityNormalized = normalizeString(destination?.city || "");

        const isAnswerCorrect = selectedNormalized === cityNormalized;

        setIsCorrect(isAnswerCorrect);

        const randomFact =
            destination?.fun_facts[
                Math.floor(Math.random() * destination.fun_facts.length)
            ] || "No fun facts available for this destination.";

        setFunFact(randomFact);

        if (isAnswerCorrect) {
            setIsExploding(true);
            setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
        } else {
            setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
        }
        try {
            if (!isAnswerCorrect) return;
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/score`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    correct: isAnswerCorrect,
                }),
                credentials: "include",
            });
        } catch (error) {
            console.error("Failed to update score:", error);
        }
    };

    const handleNextQuestion = () => {
        fetchDestination();
    };

    const handleShareChallenge = () => {
        setIsShareModalOpen(true);
    };

    useEffect(() => {
        fetchDestination();
    }, [fetchDestination]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg">Loading your destination...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {isExploding && (
                <div className="confetti-container">
                    <ConfettiExplosion
                        force={0.8}
                        duration={3000}
                        particleCount={100}
                        width={1600}
                    />
                </div>
            )}

            {challengeImageUrl && (
                <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
                    <Image
                        src={challengeImageUrl || "/placeholder.svg"}
                        alt="Challenge image"
                        width={800}
                        height={400}
                        className="w-full h-auto object-cover"
                    />
                </div>
            )}

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Where in the world is this?
                    </CardTitle>
                    <CardDescription>
                        Guess the destination based on the clues below
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Clues:</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            {destination?.clues
                                .slice(0, 2)
                                .map((clue, index) => (
                                    <li key={index} className="text-lg">
                                        {clue}
                                    </li>
                                ))}
                        </ul>
                    </div>

                    <div className="flex gap-4 flex-wrap">
                        {options &&
                            options.map((option) => (
                                <Button
                                    key={option}
                                    variant={
                                        selectedOption === option
                                            ? isCorrect
                                                ? "default"
                                                : "destructive"
                                            : "outline"
                                    }
                                    className={`h-auto py-4 text-lg break-words justify-start ${
                                        selectedOption &&
                                        selectedOption !== option
                                            ? "opacity-60"
                                            : ""
                                    }`}
                                    disabled={!!selectedOption}
                                    onClick={() => checkAnswer(option)}
                                >
                                    {option}
                                </Button>
                            ))}
                    </div>

                    {isCorrect !== null && (
                        <div
                            className={`p-4 rounded-lg ${
                                isCorrect
                                    ? "bg-green-50 text-green-700"
                                    : "bg-red-50 text-red-700"
                            }`}
                        >
                            <h3 className="font-bold text-lg mb-2">
                                {isCorrect ? "Correct! 🎉" : "Incorrect! 😢"}
                            </h3>
                            <p className="text-base">
                                <span className="font-medium">Fun Fact:</span>{" "}
                                {funFact}
                            </p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                        Score: {score.correct} correct, {score.incorrect}{" "}
                        incorrect
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleShareChallenge}
                            disabled={!userId}
                        >
                            <Share2 className="h-4 w-4 mr-2" />
                            Challenge a Friend
                        </Button>
                        <Button onClick={handleNextQuestion}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Next Destination
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            <ChallengeShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                userId={userId || ""}
            />
        </div>
    );
}
