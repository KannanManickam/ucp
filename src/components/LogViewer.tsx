import React, { useRef, useEffect, useState } from 'react';
import { useUcp } from '../context/UcpContext';
import { Terminal, Minimize2, Maximize2, ChevronDown, ChevronRight, BrainCircuit, Code } from 'lucide-react';
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

    if (!logs.length && !embedded) return null;

    return (
        <div className={embedded ? `w-full ${className}` : `fixed bottom-4 right-4 z-50 w-full max-w-sm ${className}`}>
            <div className={`bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl overflow-hidden text-xs font-mono ${embedded ? 'h-full flex flex-col' : ''}`}>
                {!embedded && (
                    <div className="flex items-center justify-between p-2 bg-white/5 border-b border-white/10 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                        <div className="flex items-center space-x-2 text-blue-400">
                            <Terminal className="h-3 w-3" />
                            <span className="font-semibold">UCP Agent Stream</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            {isOpen ? <Minimize2 className="h-3 w-3 hover:text-white" /> : <Maximize2 className="h-3 w-3 hover:text-white" />}
                        </div>
                    </div>
                )}

                <AnimatePresence>
                    {(isOpen || embedded) && (
                        <motion.div
                            initial={{ height: embedded ? 'auto' : 0 }}
                            animate={{ height: embedded ? 'auto' : 300 }}
                            exit={{ height: 0 }}
                            className={`${embedded ? 'flex-1 overflow-hidden relative' : 'overflow-hidden'}`}
                        >
                            <div ref={scrollRef} className={`overflow-y-auto p-3 space-y-3 text-white/80 scrollbar-hide ${embedded ? 'absolute inset-0' : 'h-full'}`}>
                                {logs.length === 0 && <div className="text-muted-foreground italic p-2">Waiting for agent activity...</div>}
                                {logs.map((log) => (
                                    <LogEntryItem key={log.id} log={log} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function LogEntryItem({ log }: { log: any }) {
    return (
        <div className="flex gap-2 group">
            <span className="text-white/30 shrink-0 text-[10px] mt-0.5">
                {log.timestamp.toLocaleTimeString().split(' ')[0]}
            </span>
            <div className="flex-1 min-w-0">
                <div className="mb-0.5">
                    <span className={`
                        ${log.source === 'System' ? 'text-yellow-400' : ''}
                        ${log.source === 'Agent' ? 'text-blue-400' : ''}
                        ${log.source === 'UCP-Network' ? 'text-green-400' : ''}
                        font-bold mr-2 text-[11px] uppercase tracking-wide
                    `}>
                        {log.source}
                    </span>
                    {log.type === 'text' && <span>{log.message}</span>}
                </div>

                {log.type === 'reasoning' && (
                    <div className="mt-1 bg-blue-500/10 border-l-2 border-blue-500 pl-2 py-1 rounded-r text-blue-200">
                        <div className="flex items-center gap-1.5 mb-1 text-[10px] uppercase font-bold opacity-70">
                            <BrainCircuit className="h-3 w-3" /> Reasoning
                        </div>
                        <div className="text-[11px] leading-relaxed">{log.message}</div>
                        {log.data && (
                            <div className="mt-2 grid grid-cols-2 gap-2">
                                {Object.entries(log.data).map(([k, v]: [string, any]) => (
                                    <div key={k} className="bg-black/30 p-1.5 rounded">
                                        <div className="text-[9px] text-white/40 uppercase">{k}</div>
                                        <div className="font-bold text-white">{v}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {log.type === 'json' && (
                    <div className="mt-1">
                        <div className="text-[11px] mb-1">{log.message}</div>
                        <JsonBlock data={log.data} />
                    </div>
                )}
            </div>
        </div>
    );
}

function JsonBlock({ data }: { data: any }) {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className="rounded bg-black/50 border border-white/10 overflow-hidden text-[10px] font-mono">
            <div
                className="flex items-center gap-2 p-1.5 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <Code className="h-3 w-3 text-green-400" />
                <span className="opacity-70">Payload Data</span>
                {expanded ? <ChevronDown className="h-3 w-3 ml-auto" /> : <ChevronRight className="h-3 w-3 ml-auto" />}
            </div>
            {expanded && (
                <div className="p-2 text-green-300 whitespace-pre-wrap break-all border-t border-white/10">
                    {JSON.stringify(data, null, 2)}
                </div>
            )}
        </div>
    )
}
