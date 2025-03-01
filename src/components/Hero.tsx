import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlobeIcon } from "lucide-react";

export default function Hero() {
    return (
        <div className="flex flex-col items-center justify-center text-center px-4 py-16 md:py-24">
            <div className="mb-6">
                <GlobeIcon className="h-20 w-20 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                Welcome to Globetrotter
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-8">
                Test your knowledge of famous destinations around the world with
                cryptic clues and challenge your friends!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-lg px-8">
                    <Link href="/login">Sign In</Link>
                </Button>
                <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="text-lg px-8"
                >
                    <Link href="/register">Create Account</Link>
                </Button>
            </div>
        </div>
    );
}
