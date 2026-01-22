import React, { useRef, useEffect } from 'react';
import { useUcp } from '../context/UcpContext';
import { Terminal, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface LogViewerProps {
    className?: string;
    embedded?: boolean;
}

export function LogViewer({ className, embedded = false }: LogViewerProps) {
    const { logs } = useUcp();
    const [isOpen, setIsOpen] = React.useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [logs]);

    if (!logs.length && !embedded) return null; // Always show if embedded to reserve space? Or just return null if empty? User wants it to "show streams", so maybe empty state is fine.

    return (
        <div className={embedded ? `w-full ${className}` : `fixed bottom-4 right-4 z-50 w-full max-w-sm ${className}`}>
            <div className={`bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl overflow-hidden text-xs font-mono ${embedded ? 'h-full flex flex-col' : ''}`}>
                <div className="flex items-center justify-between p-2 bg-white/5 border-b border-white/10 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                    <div className="flex items-center space-x-2 text-blue-400">
                        <Terminal className="h-3 w-3" />
                        <span className="font-semibold">UCP Agent Stream</span>
                    </div>
                    {!embedded && (
                        <div className="flex items-center space-x-1">
                            {isOpen ? <Minimize2 className="h-3 w-3 hover:text-white" /> : <Maximize2 className="h-3 w-3 hover:text-white" />}
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {(isOpen || embedded) && (
                        <motion.div
                            initial={{ height: embedded ? 'auto' : 0 }}
                            animate={{ height: embedded ? 'auto' : 200 }}
                            exit={{ height: 0 }}
                            className={`${embedded ? 'flex-1 overflow-hidden relative' : 'overflow-hidden'}`}
                        >
                            <div ref={scrollRef} className={`overflow-y-auto p-3 space-y-2 text-white/80 scrollbar-hide ${embedded ? 'absolute inset-0' : 'h-full'}`}>
                                {logs.length === 0 && <div className="text-muted-foreground italic p-2">Waiting for agent activity...</div>}
                                {logs.map((log) => (
                                    <div key={log.id} className="flex gap-2">
                                        <span className="text-white/30 shrink-0">[{log.timestamp.toLocaleTimeString().split(' ')[0]}]</span>
                                        <div>
                                            <span className={`
                                ${log.source === 'System' ? 'text-yellow-400' : ''}
                                ${log.source === 'Agent' ? 'text-blue-400' : ''}
                                ${log.source === 'UCP-Network' ? 'text-green-400' : ''}
                                font-bold mr-1
                            `}>
                                                {log.source}:
                                            </span>
                                            {log.message}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
