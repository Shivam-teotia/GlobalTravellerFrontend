"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChallengeGame from "@/components/ChallengeGame";
import ChallengeHeader from "@/components/DashboardHeader";

export default function ChallengePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const { id } = use(params); // Unwrap `params` using `use()`

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [challenge, setChallenge] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return; // Ensure `id` is available before making API calls

        const fetchChallengeData = async () => {
            try {
                const challengeResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}challenges/challenge/${id}`,
                    { cache: "no-store" }
                );

                if (!challengeResponse.ok) {
                    router.push("/404");
                    return;
                }

                const challengeData = await challengeResponse.json();
                setChallenge(challengeData);

                const userResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}users/me`,
                    {
                        credentials: "include",
                        method: "GET",
                        cache: "no-store",
                    }
                );

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setUser(userData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChallengeData();
    }, [id, router]); // Added `id` & `router` to dependencies

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (!challenge) {
        return null; // Prevent rendering if challenge is not found
    }

    return (
        <div className="min-h-screen flex flex-col">
            <ChallengeHeader
                user={{
                    username: challenge?.creatorUsername,
                    score: challenge?.creatorScore,
                }}
                isLoggedIn={!!user}
            />

            <main className="flex-1 container mx-auto px-4 py-8">
                <ChallengeGame
                    userId={user?._id}
                    challengeId={id}
                    challengeImageUrl={challenge.imageUrl}
                />
            </main>
        </div>
    );
}
