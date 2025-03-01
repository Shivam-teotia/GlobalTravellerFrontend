"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Copy, Share } from "lucide-react";
import { toast } from "sonner";

interface ChallengeShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
}

export default function ChallengeShareModal({
    isOpen,
    onClose,
    userId,
}: ChallengeShareModalProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [challengeUrl, setChallengeUrl] = useState("");
    const [isUrlCopied, setIsUrlCopied] = useState(false);
    const shareCardRef = useRef<HTMLDivElement>(null);

    const createChallenge = async () => {
        setIsCreating(true);

        try {
            // First create a screenshot of the share card
            if (shareCardRef.current) {
                // Send the image to the server
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}challenges/create`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json", // Required to send JSON data
                        },
                        body: JSON.stringify({ userId: userId }),
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to create challenge");
                }

                const data = await response.json();
                setChallengeUrl(
                    `${window.location.origin}/challenge/${data.challenge?._id}`
                );
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast("Failed to create challenge");
        } finally {
            setIsCreating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(challengeUrl);
        setIsUrlCopied(true);

        toast("Link Copied");

        setTimeout(() => {
            setIsUrlCopied(false);
        }, 3000);
    };

    const shareToWhatsApp = () => {
        const text =
            "Join me for a Globetrotter challenge! Can you guess these destinations?";
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
            text + " " + challengeUrl
        )}`;
        window.open(whatsappUrl, "_blank");
    };

    useEffect(() => {
        if (isOpen) {
            setChallengeUrl("");
            setIsUrlCopied(false);
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Challenge a Friend</DialogTitle>
                    <DialogDescription>
                        Create a unique challenge link to share with your
                        friends
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col space-y-4">
                    {!challengeUrl ? (
                        <>
                            <div
                                ref={shareCardRef}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white"
                            >
                                <h3 className="text-xl font-bold mb-2">
                                    Globetrotter Challenge!
                                </h3>
                                <p className="mb-4">
                                    Can you guess these famous destinations from
                                    cryptic clues?
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold">
                                            G
                                        </div>
                                        <span>Globetrotter</span>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="text-blue-600"
                                    >
                                        Play Now
                                    </Button>
                                </div>
                            </div>

                            <Button
                                onClick={createChallenge}
                                disabled={isCreating}
                            >
                                {isCreating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating challenge...
                                    </>
                                ) : (
                                    "Create Challenge Link"
                                )}
                            </Button>
                        </>
                    ) : (
                        <>
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="challenge-url">
                                    Challenge Link
                                </Label>
                                <div className="flex space-x-2">
                                    <Input
                                        id="challenge-url"
                                        value={challengeUrl}
                                        readOnly
                                        className="flex-1"
                                    />
                                    <Button
                                        size="icon"
                                        onClick={copyToClipboard}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={copyToClipboard}
                                    className="sm:mr-2"
                                >
                                    <Copy className="mr-2 h-4 w-4" />
                                    {isUrlCopied ? "Copied!" : "Copy Link"}
                                </Button>
                                <Button type="button" onClick={shareToWhatsApp}>
                                    <Share className="mr-2 h-4 w-4" />
                                    Share on WhatsApp
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
