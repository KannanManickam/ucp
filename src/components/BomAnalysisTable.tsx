import React, { useEffect, useState, useRef } from 'react';
import { Check, X, Loader2, ArrowRightLeft, Square, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { DatasheetPreview } from './DatasheetPreview';

export interface BomItem {
    id: string;
    mpn: string;
    quantity: number;
    description: string;
    status: 'pending' | 'checking' | 'verified' | 'substituted' | 'error';
    supplier?: string;
    price?: number;
    stock?: number;
    notes?: string;
    selected?: boolean;
}

const MOCK_DATA: BomItem[] = [
    { id: '1', mpn: 'ATMMEGA328P-PU', quantity: 1, description: 'Microcontroller', status: 'pending', selected: true },
    { id: '2', mpn: 'LM7805', quantity: 1, description: 'Voltage Regulator 5V', status: 'pending', selected: true },
    { id: '3', mpn: '10k-RES-0603', quantity: 5, description: 'Resistor 10k Ohm', status: 'pending', selected: true },
    { id: '4', mpn: '100nF-CAP-CER', quantity: 2, description: 'Capacitor Ceramic', status: 'pending', selected: true },
    { id: '5', mpn: 'LED-RED-5MM', quantity: 2, description: 'Red LED 5mm', status: 'pending', selected: true },
    { id: '6', mpn: '1N4007', quantity: 1, description: 'Diode 1A 1000V', status: 'pending', selected: true },
    { id: '7', mpn: 'HC-SR04', quantity: 1, description: 'Ultrasonic Sensor', status: 'pending', selected: true },
    { id: '8', mpn: 'ESP32-WROOM', quantity: 1, description: 'WiFi Module', status: 'pending', selected: true },
];

export function BomAnalysisTable({ onComplete, isProcessing, startProcessing }: { onComplete: (items: BomItem[]) => void; isProcessing: boolean; startProcessing: () => void }) {
    const [items, setItems] = useState<BomItem[]>(MOCK_DATA);
    const [progress, setProgress] = useState(0);
    const itemsRef = useRef(items);
    useEffect(() => { itemsRef.current = items; }, [items]);

    // Handle selection toggle
    const toggleSelection = (id: string) => {
        if (isProcessing) return; // Lock selection during processing
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, selected: !item.selected } : item
        ));
    };

    // Completion Check Effect
    useEffect(() => {
        if (!isProcessing) return;

        const selectedItems = items.filter(i => i.selected);
        if (selectedItems.length === 0) return;

        const allDone = selectedItems.every(i => ['verified', 'substituted', 'error'].includes(i.status));

        if (allDone) {
            const timer = setTimeout(() => {
                onComplete(items);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [items, isProcessing, onComplete]);

    // Simulation Effect
    useEffect(() => {
        if (!isProcessing) return;

        // Reset statuses before starting
        setItems(prev => prev.map(item => ({ ...item, status: 'pending' })));

        let currentIndex = 0;

        const interval = setInterval(() => {
            const currentItems = itemsRef.current; // Use Ref to access latest selection state

            // 1. Skip over any unselected items
            while (currentIndex < currentItems.length && !currentItems[currentIndex].selected) {
                currentIndex++;
            }

            // CAPTURE current index to ensure setItems sees the correct value even if currentIndex is mutated later
            const processingIdx = currentIndex;

            // 2. Check if we are done
            if (processingIdx >= currentItems.length) {
                clearInterval(interval);
                return;
            }

            // 3. Process the current selected item
            setItems(prev => {
                const newItems = [...prev];
                // Safety check
                if (processingIdx >= newItems.length) return newItems;

                const item = { ...newItems[processingIdx] };

                // If somehow we got here and it's not selected (race condition?), skip
                if (!item.selected) return newItems;

                // Logic to simulate checking and results
                const supplies = ['DigiKey', 'Mouser', 'LCSC', 'Adafruit'];
                const randomSupplier = supplies[Math.floor(Math.random() * supplies.length)];
                const randomPrice = (Math.random() * 10 + 0.5).toFixed(2);

                const rand = Math.random();
                // Ensure every item gets a price (No errors/N/A for demo)
                if (rand > 0.8) {
                    item.status = 'substituted';
                    item.supplier = randomSupplier;
                    item.price = Number(randomPrice);
                    item.notes = 'Alt: Generic Equivalent found';
                } else {
                    item.status = 'verified';
                    item.supplier = randomSupplier;
                    item.price = Number(randomPrice);
                    item.stock = Math.floor(Math.random() * 5000) + 100;
                }

                newItems[processingIdx] = item;

                // 4. Set NEXT selected item to 'checking'
                let nextIdx = processingIdx + 1;
                while (nextIdx < newItems.length && !newItems[nextIdx].selected) {
                    nextIdx++;
                }

                if (nextIdx < newItems.length) {
                    newItems[nextIdx].status = 'checking';
                }

                return newItems;
            });

            // Update Progress
            // Progress based on currentIndex relative to total length
            setProgress(((processingIdx + 1) / MOCK_DATA.length) * 100);

            // Move to next item for next tick
            currentIndex++;

        }, 600);

        // Initial Setup: Set first selected item to checking immediately
        setItems(prev => {
            const newItems = [...prev];
            const firstSelectedIdx = newItems.findIndex(i => i.selected);
            if (firstSelectedIdx !== -1) {
                newItems[firstSelectedIdx].status = 'checking';
                // Also ensure currentIndex starts there?
                // No, currentIndex is local to effect, initialized to 0.
                // The loop 'while' check will catch up to firstSelectedIdx immediately.
            }
            return newItems;
        });

        return () => clearInterval(interval);
    }, [isProcessing]);

    return (
        <div className="w-full bg-white/5 border border-white/10 rounded-xl overflow-hidden text-sm flex flex-col h-[500px]">
            <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center shrink-0">
                <h3 className="font-semibold flex items-center gap-2">
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin text-blue-400" /> : <div className="h-4 w-4" />}
                    BOM Analysis
                </h3>

                {!isProcessing && (
                    <div className="flex gap-2">
                        <Button size="sm" onClick={startProcessing} className="bg-blue-600 hover:bg-blue-500 text-white">
                            Start Processing
                        </Button>
                    </div>
                )}

                {isProcessing && (
                    <span className="font-mono text-xs text-muted-foreground">{Math.round(progress)}% Processed</span>
                )}
            </div>

            <div className="overflow-y-auto flex-1">
                <table className="w-full">
                    <thead className="bg-white/5 sticky top-0 backdrop-blur-md z-10">
                        <tr className="text-left text-xs uppercase text-muted-foreground">
                            <th className="p-3 w-10"></th>
                            <th className="p-3">MPN</th>
                            <th className="p-3">Qty</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Source</th>
                            <th className="p-3 text-right">Unit Price</th>
                            <th className="p-3">Notes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {items.map((item) => (
                            <tr key={item.id} className={`hover:bg-white/5 transition-colors ${!item.selected ? 'opacity-50' : ''}`}>
                                <td className="p-3">
                                    <button
                                        onClick={() => toggleSelection(item.id)}
                                        disabled={isProcessing}
                                        className="text-white/60 hover:text-white disabled:opacity-50"
                                    >
                                        {item.selected ? <CheckSquare className="h-4 w-4 text-blue-400" /> : <Square className="h-4 w-4" />}
                                    </button>
                                </td>
                                <td className="p-3 font-mono text-white/80">
                                    <DatasheetPreview mpn={item.mpn}>
                                        {item.mpn}
                                    </DatasheetPreview>
                                </td>
                                <td className="p-3 text-white/60">{item.quantity}</td>
                                <td className="p-3">
                                    {item.selected ? <StatusBadge status={item.status} /> : <span className="text-xs text-muted-foreground">Skipped</span>}
                                </td>
                                <td className="p-3 text-blue-300">{item.supplier || '-'}</td>
                                <td className="p-3 text-right font-mono">
                                    {item.price ? `$${item.price.toFixed(2)}` : '-'}
                                </td>
                                <td className="p-3 text-xs text-muted-foreground max-w-[200px] truncate">
                                    {item.notes}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: BomItem['status'] }) {
    switch (status) {
        case 'pending':
            return <span className="text-muted-foreground text-xs">Waiting...</span>;
        case 'checking':
            return <div className="flex items-center text-blue-400 text-xs"><Loader2 className="h-3 w-3 animate-spin mr-1" /> Checking</div>;
        case 'verified':
            return <div className="flex items-center text-green-400 text-xs"><Check className="h-3 w-3 mr-1" /> Verified</div>;
        case 'substituted':
            return <div className="flex items-center text-yellow-400 text-xs"><ArrowRightLeft className="h-3 w-3 mr-1" /> Substituted</div>;
        case 'error':
            return <div className="flex items-center text-red-400 text-xs"><X className="h-3 w-3 mr-1" /> Failed</div>;
    }
}
