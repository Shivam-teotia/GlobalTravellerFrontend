"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChallengeGame from "@/components/ChallengeGame";
import ChallengeHeader from "@/components/DashboardHeader";

export default function ChallengePage({
    params,
}: Readonly<{ params: { id: string } }>) {
    const router = useRouter();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [challenge, setChallenge] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChallengeData = async () => {
            try {
                // Fetch challenge data
                const challengeResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}challenges/challenge/${params.id}`,
                    { cache: "no-store" }
                );

                if (!challengeResponse.ok) {
                    router.push("/404"); // Redirect to 404 page if not found
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
    }, []);

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
                    challengeId={params.id}
                    challengeImageUrl={challenge.imageUrl}
                />
            </main>
        </div>
    );
}
