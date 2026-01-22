import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Cpu, Activity } from 'lucide-react';

interface DatasheetPreviewProps {
    mpn: string;
    children: React.ReactNode;
}

export function DatasheetPreview({ mpn, children }: DatasheetPreviewProps) {
    const [hover, setHover] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                // Position above the element (accounting for popup height approx 160px)
                top: rect.top - 180,
                left: rect.left
            });
            setHover(true);
        }
    };

    return (
        <>
            <div
                ref={triggerRef}
                className="inline-block cursor-help hover:text-blue-300 transition-colors group"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setHover(false)}
            >
                <div className="underline decoration-dotted decoration-white/30 group-hover:decoration-blue-400">
                    {children}
                </div>
            </div>
            {createPortal(
                <AnimatePresence>
                    {hover && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            transition={{ duration: 0.2 }}
                            style={{
                                position: 'fixed',
                                top: coords.top,
                                left: coords.left,
                                zIndex: 9999
                            }}
                            className="pointer-events-none"
                        >
                            <div className="w-64 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl overflow-hidden ring-1 ring-white/20">
                                {/* Decorative header gradient */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2 text-blue-400">
                                        <FileText className="h-4 w-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Datasheet</span>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground bg-white/10 px-1.5 py-0.5 rounded">PDF</span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="font-mono text-sm font-semibold text-white">{mpn}</div>
                                    <div className="text-xs text-muted-foreground">High-performance component. Automated spec retrieval confirmed.</div>

                                    {/* Mock Specs Grid */}
                                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/10">
                                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                                            <Cpu className="h-3 w-3 text-blue-400" />
                                            <span>Industrial</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                                            <Activity className="h-3 w-3 text-green-400" />
                                            <span>Active</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center w-full py-1.5 bg-blue-600/20 text-blue-300 text-xs rounded-lg border border-blue-500/30">
                                    <Download className="h-3 w-3 mr-2" />
                                    Preview PDF
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
