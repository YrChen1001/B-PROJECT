import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import type { SlotItem } from "../types";

const ITEM_HEIGHT = 180; // Height of each slot item in pixels
const VIEWPORT_HEIGHT = 380; // Height of the visible reel area
const NUM_DUPLICATES = 25; // Duplicates for spinning effect

interface SlotReelProps {
    items: SlotItem[];
    targetItem: SlotItem | null;
    isSpinning: boolean;
    onSpinEnd: () => void;
}

export default function SlotReel({ items, targetItem, isSpinning, onSpinEnd }: SlotReelProps) {
    const controls = useAnimation();
    const [blurAmount, setBlurAmount] = useState(0);
    const [showGlow, setShowGlow] = useState(false);

    // Create a very long strip
    const spinList = Array(NUM_DUPLICATES).fill(items).flat();

    useEffect(() => {
        const spin = async () => {
            if (isSpinning && targetItem) {
                setShowGlow(false);
                const targetIndex = items.findIndex(i => i.id === targetItem.id);
                if (targetIndex === -1) return;

                const targetSetIndex = NUM_DUPLICATES - 5;
                const finalIndex = (targetSetIndex * items.length) + targetIndex;

                // Calculate Y position so the target item aligns with the winning line (center of viewport)
                // Add random offset within the item so the line lands at a random vertical position on the item
                const baseOffset = (VIEWPORT_HEIGHT / 2) - (ITEM_HEIGHT / 2);
                const randomOffset = (Math.random() - 0.5) * (ITEM_HEIGHT * 0.6); // Random position within ±30% of item center
                const targetY = -(finalIndex * ITEM_HEIGHT) + baseOffset + randomOffset;

                // 1. Reset position instantly
                await controls.set({ y: 0 });

                // 2. Spin Phase - Start with blur
                setBlurAmount(12);

                // Main spin animation with custom easing
                await controls.start({
                    y: targetY,
                    transition: {
                        duration: 3,
                        ease: [0.15, 0.6, 0.1, 1], // Custom bezier: fast start, gradual slowdown
                    }
                });

                // 3. Stop Phase - Remove blur and show glow
                setBlurAmount(0);
                setShowGlow(true);
                onSpinEnd();
            }
        };

        if (isSpinning) {
            spin();
        }
    }, [isSpinning, targetItem, controls, items, onSpinEnd]);

    if (items.length === 0) {
        return (
            <div className="w-[320px] h-[380px] flex flex-col items-center justify-center bg-incense-yellow/50 border-8 border-wood rounded-lg">
                <span className="text-wood text-2xl font-bold font-serif">尚無籤詩</span>
                <span className="text-wood/60 text-sm mt-2">請至後台新增</span>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Dragon/Phoenix Decorative Corners */}
            <div className="absolute -top-4 -left-4 w-10 h-10 border-t-4 border-l-4 border-imperial-gold rounded-tl-lg z-40" />
            <div className="absolute -top-4 -right-4 w-10 h-10 border-t-4 border-r-4 border-imperial-gold rounded-tr-lg z-40" />
            <div className="absolute -bottom-4 -left-4 w-10 h-10 border-b-4 border-l-4 border-imperial-gold rounded-bl-lg z-40" />
            <div className="absolute -bottom-4 -right-4 w-10 h-10 border-b-4 border-r-4 border-imperial-gold rounded-br-lg z-40" />

            {/* Main Reel Container - Styled like a wooden fortune box */}
            <div
                className={`relative overflow-hidden w-[320px] h-[380px] bg-gradient-to-b from-[#FFF8DC] via-[#FAEBD7] to-[#F5DEB3] border-x-[14px] border-y-[18px] border-wood shadow-[inset_0_0_60px_rgba(0,0,0,0.4),0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-500 ${showGlow ? 'ring-4 ring-imperial-gold ring-opacity-70' : ''}`}
            >
                {/* Inner gold border */}
                <div className="absolute inset-1 border-2 border-imperial-gold/40 pointer-events-none z-20" />

                {/* Paper/Wood Texture overlay */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-30 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

                {/* Top/Bottom gradient shadows for depth */}
                <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/60" />

                {/* Side shadows for 3D depth */}
                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/30 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/30 to-transparent z-10 pointer-events-none" />

                {/* The Spinning Strip with Motion Blur */}
                <motion.div
                    className="flex flex-col items-center relative z-0"
                    animate={controls}
                    initial={{ y: 0 }}
                    style={{
                        filter: `blur(0px ${blurAmount}px)`,
                        transition: 'filter 0.3s ease-out'
                    }}
                >
                    {spinList.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="flex items-center justify-center w-full relative"
                            style={{ height: ITEM_HEIGHT }}
                        >
                            {/* Decorative border between items */}
                            <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-wood/30 to-transparent" />

                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="max-h-[80%] max-w-[80%] object-contain drop-shadow-lg mix-blend-multiply"
                            />
                        </div>
                    ))}
                </motion.div>

                {/* Center Winning Line Indicator - Red Cord with Gold Buttons */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex items-center z-30 pointer-events-none">
                    {/* Left gold knob */}
                    <div className="relative -ml-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-imperial-gold to-yellow-600 rounded-full shadow-lg border-2 border-red-900" />
                        <div className="absolute inset-1 bg-gradient-to-br from-white/40 to-transparent rounded-full" />
                    </div>

                    {/* Red ribbon/cord */}
                    <div className="flex-1 h-1 bg-gradient-to-r from-red-800 via-red-600 to-red-800 shadow-md relative">
                        <div className="absolute inset-x-0 top-0 h-px bg-red-400/50" />
                    </div>

                    {/* Right gold knob */}
                    <div className="relative -mr-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-imperial-gold to-yellow-600 rounded-full shadow-lg border-2 border-red-900" />
                        <div className="absolute inset-1 bg-gradient-to-br from-white/40 to-transparent rounded-full" />
                    </div>
                </div>

                {/* Top decorative wood carving pattern */}
                <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-wood to-transparent z-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-wood to-transparent z-20 pointer-events-none" />
            </div>

            {/* Shadow beneath the box */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[280px] h-4 bg-black/30 rounded-full blur-md" />
        </div>
    );
}
