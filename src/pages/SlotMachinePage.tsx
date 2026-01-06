import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSlotStore } from '../store/SlotContext';
import SlotReel from '../components/SlotReel';
import { AnimatePresence, motion } from 'framer-motion';
import { Printer } from 'lucide-react';
import type { SlotItem } from '../types';

// Floating blessing words data
const BLESSING_WORDS = [
    { text: '風調雨順', size: 'text-7xl', left: '5%', delay: 0 },
    { text: '國泰民安', size: 'text-5xl', left: '15%', delay: 3 },
    { text: '吉祥如意', size: 'text-6xl', left: '75%', delay: 1 },
    { text: '心想事成', size: 'text-4xl', left: '85%', delay: 5 },
    { text: '平安喜樂', size: 'text-7xl', left: '60%', delay: 2 },
    { text: '福壽康寧', size: 'text-5xl', left: '40%', delay: 4 },
];

export default function SlotMachinePage() {
    const { items, spin } = useSlotStore();
    const [isSpinning, setIsSpinning] = useState(false);
    const [targetItem, setTargetItem] = useState<SlotItem | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [showPrintOverlay, setShowPrintOverlay] = useState(false);

    const handleSpin = () => {
        if (items.length === 0) {
            alert("目前沒有任何籤詩，請先前往管理後台新增！");
            return;
        }
        setShowResult(false);
        setShowPrintOverlay(false);
        setIsSpinning(true);

        const result = spin();
        setTargetItem(result);
    };

    const handleSpinEnd = () => {
        setIsSpinning(false);
        setShowResult(true);
    };

    const handlePrint = async () => {
        if (!targetItem) return;
        setShowPrintOverlay(true);

        setTimeout(async () => {
            try {
                const response = await fetch('http://localhost:3001/print', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imagePath: targetItem.imageUrl }),
                });

                if (!response.ok) throw new Error('Print server error');
                console.log("列印指令已發送");
            } catch (error) {
                console.error("列印失敗:", error);
                alert("無法連接列印伺服器！請確認 'npm run server' 正在執行中。");
            } finally {
                setTimeout(() => {
                    setShowPrintOverlay(false);
                    setShowResult(false);
                    setTargetItem(null);
                }, 3000);
            }
        }, 1000);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-gradient-to-b from-temple-red via-[#6B0000] to-[#4A0000]">

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/chinese-style.png')] opacity-10 pointer-events-none" />

            {/* Animated Floating Blessing Text Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                {BLESSING_WORDS.map((word, i) => (
                    <motion.div
                        key={i}
                        className={`absolute ${word.size} font-serif text-imperial-gold`}
                        style={{
                            left: word.left,
                            bottom: '-150px',
                            writingMode: 'vertical-rl',
                            textOrientation: 'upright',
                            letterSpacing: '0.15em',
                            textShadow: '0 0 20px rgba(255,215,0,0.3)'
                        }}
                        animate={{
                            y: [0, -1200],
                            opacity: [0, 0.12, 0.12, 0]
                        }}
                        transition={{
                            duration: 25,
                            delay: word.delay,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        {word.text}
                    </motion.div>
                ))}
            </div>

            {/* Top Temple Roof Decoration */}
            <div className="absolute top-0 w-full">
                <div className="h-20 bg-gradient-to-b from-black/50 to-transparent" />
                <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-8">
                    <div className="w-2 h-16 bg-imperial-gold/30 rounded-full" />
                    <div className="w-2 h-20 bg-imperial-gold/40 rounded-full" />
                    <div className="w-2 h-16 bg-imperial-gold/30 rounded-full" />
                </div>
            </div>

            {/* Main Content Container */}
            <div className="z-10 relative">

                {/* Temple Gate Header */}
                <div className="flex justify-center mb-8 relative">
                    <div className="relative">
                        {/* Roof decoration */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-[120%] h-8 bg-gradient-to-b from-wood to-transparent rounded-t-full opacity-60" />

                        {/* Diamond centerpiece */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-20 h-20 bg-red-800 rotate-45 border-4 border-imperial-gold shadow-2xl flex items-center justify-center rounded-lg z-10">
                            <span className="text-4xl text-imperial-gold font-bold -rotate-45 font-serif drop-shadow-lg">籤</span>
                        </div>

                        {/* Main title plaque */}
                        <div className="mt-4 px-12 py-4 bg-gradient-to-b from-wood via-[#A0522D] to-wood border-4 border-imperial-gold rounded-lg shadow-2xl">
                            <h1 className="text-5xl md:text-6xl font-bold text-imperial-gold drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] tracking-[0.3em] font-serif">
                                求籤問卜
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Main Panel - Temple Altar Style */}
                <div className="relative p-8 md:p-12 bg-gradient-to-b from-temple-red-light to-temple-red border-8 border-double border-imperial-gold rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.7)] max-w-[95vw]">

                    {/* Decorative lanterns */}
                    {/* <motion.div
                        className="absolute -top-16 left-6 w-14 h-20 bg-gradient-to-b from-red-500 to-red-700 rounded-full border-t-4 border-b-4 border-black shadow-xl flex items-center justify-center"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <span className="text-imperial-gold text-lg font-bold font-serif drop-shadow-md" style={{ writingMode: 'vertical-rl' }}>平安</span>
                    </motion.div>
                    <motion.div
                        className="absolute -top-16 right-6 w-14 h-20 bg-gradient-to-b from-red-500 to-red-700 rounded-full border-t-4 border-b-4 border-black shadow-xl flex items-center justify-center"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    >
                        <span className="text-imperial-gold text-lg font-bold font-serif drop-shadow-md" style={{ writingMode: 'vertical-rl' }}>招財</span>
                    </motion.div> */}

                    {/* Corner ornaments */}
                    <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-imperial-gold/60 rounded-tl" />
                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-imperial-gold/60 rounded-tr" />
                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-imperial-gold/60 rounded-bl" />
                    <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-imperial-gold/60 rounded-br" />

                    {/* Slot Reel */}
                    <div className="flex justify-center mb-8">
                        <SlotReel
                            items={items}
                            targetItem={targetItem}
                            isSpinning={isSpinning}
                            onSpinEnd={handleSpinEnd}
                        />
                    </div>

                    {/* Action Area */}
                    <div className="min-h-[120px] flex items-center justify-center">
                        {!isSpinning && !showResult && (
                            <motion.button
                                onClick={handleSpin}
                                className="relative group px-14 py-5 bg-gradient-to-b from-imperial-gold via-yellow-500 to-imperial-gold-dark text-red-900 font-bold text-4xl rounded-xl transition-all shadow-[0_8px_0px_#8B4513,0_15px_30px_rgba(0,0,0,0.4)] active:shadow-[0_2px_0px_#8B4513] active:translate-y-[6px] font-serif border-2 border-red-900 overflow-hidden"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="relative z-10 flex items-center gap-3 drop-shadow-sm tracking-[0.2em]">
                                    {/* <Sparkles className="w-8 h-8" /> */}
                                    求籤
                                </span>
                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                            </motion.button>
                        )}

                        {isSpinning && (
                            <motion.div
                                className="text-3xl text-imperial-gold font-bold font-serif tracking-widest bg-black/30 px-8 py-4 rounded-lg backdrop-blur-sm border border-imperial-gold/30"
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                誠心祈求中...
                            </motion.div>
                        )}

                        {!isSpinning && showResult && targetItem && (
                            <motion.div
                                className="flex flex-col items-center gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="text-2xl md:text-3xl text-incense-yellow font-bold font-serif bg-black/40 px-8 py-3 rounded-full border border-imperial-gold/50 backdrop-blur-sm shadow-lg">
                                    您的籤詩：<span className="text-imperial-gold">{targetItem.name}</span>
                                </div>
                                <motion.button
                                    onClick={handlePrint}
                                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-b from-red-600 to-red-800 text-imperial-gold font-bold text-xl md:text-2xl rounded-xl hover:from-red-500 hover:to-red-700 transition-all shadow-lg border-2 border-imperial-gold font-serif"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Printer className="w-6 h-6" />
                                    領取籤詩
                                </motion.button>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Admin Link */}
                <Link
                    to="/admin"
                    className="absolute -bottom-12 right-0 text-sm text-imperial-gold/40 hover:text-imperial-gold transition-colors font-serif flex items-center gap-1"
                >
                    廟祝管理 →
                </Link>
            </div>

            {/* Print Overlay */}
            <AnimatePresence>
                {showPrintOverlay && targetItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                        id="print-area"
                    >
                        <motion.div
                            className="relative max-w-md w-full"
                            initial={{ scale: 0.8, rotateY: -90 }}
                            animate={{ scale: 1, rotateY: 0 }}
                            transition={{ type: "spring", damping: 15 }}
                        >
                            {/* Paper slip container */}
                            <div className="bg-gradient-to-b from-[#FFF8DC] to-[#F5DEB3] p-6 md:p-10 rounded shadow-2xl border-[12px] border-wood relative bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
                                {/* Decorative header */}
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-temple-red px-6 py-1 rounded-full border-2 border-imperial-gold">
                                    <span className="text-imperial-gold font-serif font-bold text-lg">籤詩</span>
                                </div>

                                {/* Side text */}
                                <div className="absolute top-8 right-4 text-3xl text-red-800/60 font-serif" style={{ writingMode: 'vertical-rl' }}>上上籤</div>

                                {/* Red seal stamp */}
                                <div className="absolute bottom-6 left-6 w-16 h-16 border-4 border-red-700/70 rounded flex items-center justify-center transform -rotate-12">
                                    <span className="text-red-700/70 text-xl font-bold font-serif">大吉</span>
                                </div>

                                {/* Main image */}
                                <div className="aspect-[3/4] flex items-center justify-center p-4">
                                    <img
                                        src={targetItem.imageUrl}
                                        alt="籤詩"
                                        className="max-w-full max-h-full object-contain mix-blend-multiply filter contrast-110 sepia-[.2]"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
