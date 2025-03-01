"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChallengeGame from "@/components/ChallengeGame";

export default function DashboardPage() {
    interface User {
        _id: string;
        username: string;
        score: number;
    }

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}users/me`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    router.push("/login");
                    return;
                }

                const userData = await response.json();
                setUser(userData?.user);
            } catch (error) {
                console.error("Error fetching user:", error);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg font-semibold">Loading...</p>
            </div>
        );
    }
    return (
        <div className="min-h-screen flex flex-col">
            {/* {user && <DashboardHeader user={user} />} */}
            <main className="flex-1 container mx-auto px-4 py-8">
                {user ? <ChallengeGame userId={user?._id} /> : null}
            </main>
        </div>
    );
}
