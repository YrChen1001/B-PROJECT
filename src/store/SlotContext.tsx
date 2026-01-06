import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { SlotItem } from '../types';

interface SlotContextType {
    items: SlotItem[];
    addItem: (item: Omit<SlotItem, 'id'>) => void;
    updateItem: (id: string, updates: Partial<SlotItem>) => void;
    removeItem: (id: string) => void;
    spin: () => SlotItem | null;
}

const SlotContext = createContext<SlotContextType | undefined>(undefined);

const STORAGE_KEY = 'slot-machine-items';

export const SlotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<SlotItem[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addItem = (newItem: Omit<SlotItem, 'id'>) => {
        const item: SlotItem = {
            ...newItem,
            id: crypto.randomUUID(),
        };
        setItems((prev) => [...prev, item]);
    };

    const updateItem = (id: string, updates: Partial<SlotItem>) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
        );
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const spin = (): SlotItem | null => {
        if (items.length === 0) return null;

        // Weighted random selection
        const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);
        let random = Math.random() * totalWeight;

        for (const item of items) {
            const weight = item.weight || 1;
            if (random < weight) {
                return item;
            }
            random -= weight;
        }
        return items[items.length - 1];
    };

    return (
        <SlotContext.Provider value={{ items, addItem, updateItem, removeItem, spin }}>
            {children}
        </SlotContext.Provider>
    );
};

export const useSlotStore = () => {
    const context = useContext(SlotContext);
    if (!context) {
        throw new Error('useSlotStore must be used within a SlotProvider');
    }
    return context;
};
