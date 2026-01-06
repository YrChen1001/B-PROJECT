
import { useState } from 'react';
import { useSlotStore } from '../store/SlotContext';
import { Trash2, Plus, Check } from 'lucide-react';
import { AVAILABLE_IMAGES } from '../lib/images';

export default function AdminDashboard() {
    const { items, addItem, removeItem } = useSlotStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemWeight, setNewItemWeight] = useState(1);
    const [newItemImage, setNewItemImage] = useState<string | null>(null);

    const handleAdd = () => {
        if (newItemName && newItemImage) {
            addItem({
                name: newItemName,
                imageUrl: newItemImage,
                weight: newItemWeight,
            });
            setIsAdding(false);
            setNewItemName('');
            setNewItemImage(null);
            setNewItemWeight(1);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto bg-incense-yellow min-h-screen text-black font-serif">
            <header className="flex justify-between items-center mb-12 border-b-4 border-wood pb-6">
                <h1 className="text-5xl font-bold text-temple-red drop-shadow-sm">
                    廟祝管理後台
                </h1>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-6 py-3 bg-temple-red text-imperial-gold font-bold rounded-lg hover:bg-red-800 transition border-2 border-imperial-gold"
                >
                    <Plus size={20} />
                    新增簽詩
                </button>
            </header>

            {isAdding && (
                <div className="mb-12 p-8 bg-paper border-4 border-wood rounded-none shadow-xl animate-in fade-in slide-in-from-top-4 relative">
                    <div className="absolute -top-3 left-8 bg-temple-red text-white px-2 py-1 text-sm rounded">新增項目</div>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-temple-red border-b border-wood/30 pb-2">
                        <Plus className="w-6 h-6" /> 填寫籤詩資訊
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-lg text-wood font-bold mb-2">名稱 (如: 上上籤)</label>
                                <input
                                    type="text"
                                    className="w-full bg-white border-2 border-wood rounded p-3 focus:border-temple-red focus:outline-none transition text-lg"
                                    placeholder="請輸入名稱..."
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-lg text-wood font-bold mb-2">權重 (機率)</label>
                                <input
                                    type="number"
                                    className="w-full bg-white border-2 border-wood rounded p-3 focus:border-temple-red focus:outline-none transition text-lg"
                                    min="1"
                                    value={newItemWeight}
                                    onChange={(e) => setNewItemWeight(Number(e.target.value))}
                                />
                            </div>
                            <button
                                onClick={handleAdd}
                                disabled={!newItemName || !newItemImage}
                                className="mt-4 w-full py-4 bg-imperial-gold text-red-900 font-bold text-xl rounded hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition border-2 border-red-900"
                            >
                                儲存項目
                            </button>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="block text-lg text-wood font-bold">選擇籤詩圖片</label>
                            <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar p-2 bg-white/50 border border-wood rounded">
                                {AVAILABLE_IMAGES.map((imgSrc) => (
                                    <button
                                        key={imgSrc}
                                        onClick={() => setNewItemImage(imgSrc)}
                                        className={`relative aspect-square border-4 rounded-lg overflow-hidden transition ${newItemImage === imgSrc
                                                ? 'border-temple-red shadow-lg scale-95 ring-2 ring-imperial-gold'
                                                : 'border-transparent hover:border-wood/50'
                                            }`}
                                    >
                                        <img src={imgSrc} alt="Option" className="w-full h-full object-cover" />
                                        {newItemImage === imgSrc && (
                                            <div className="absolute inset-0 bg-temple-red/30 flex items-center justify-center">
                                                <div className="bg-temple-red text-white rounded-full p-1">
                                                    <Check className="w-6 h-6" />
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item) => (
                    <div key={item.id} className="relative group bg-paper border-4 border-wood shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-temple-red border-2 border-imperial-gold rounded-full z-20 flex items-center justify-center text-white text-xs font-bold shadow">
                            {item.weight}
                        </div>
                        <div className="h-56 p-6 bg-white/40 flex items-center justify-center border-b-2 border-wood/20">
                            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-contain mix-blend-multiply" />
                        </div>
                        <div className="p-4 bg-wood/10">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-2xl text-temple-red">{item.name}</h3>
                            </div>
                            <div className="flex justify-end mt-2 pt-2 border-t border-wood/20">
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-red-700 hover:text-red-900 text-sm flex items-center gap-1 font-bold px-3 py-1 rounded hover:bg-red-100/50"
                                >
                                    <Trash2 size={16} /> 移除
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="col-span-full py-20 text-center text-wood/60 border-4 border-dashed border-wood/30 rounded-xl text-xl">
                        目前沒有任何籤詩，請點擊上方按鈕新增。
                    </div>
                )}
            </div>
        </div>
    );
}
