import { GlobeIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

interface User {
    username: string;
    score: number;
}

interface Props {
    user: User;
    isLoggedIn: boolean;
}

export default function ChallengeHeader({ user, isLoggedIn }: Props) {
    console.log(isLoggedIn);
    return (
        <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <GlobeIcon className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl">Globetrotter</span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            Creator Name:
                        </span>
                        <span className="font-medium">{user?.username}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            Creator Score:
                        </span>
                        <span className="font-medium">{user?.score}</span>
                    </div>

                    {isLoggedIn ? (
                        <Button asChild variant="outline" size="sm">
                            <Link href="/dashboard">Back to Dashboard</Link>
                        </Button>
                    ) : (
                        <Button asChild variant="outline" size="sm">
                            <Link href="/login">Sign In</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
