import React, { createContext, useContext, useState, useEffect } from 'react';

type AgentStatus = 'idle' | 'scanning' | 'negotiating' | 'purchasing' | 'optimizing';

interface UcpLog {
    id: string;
    timestamp: Date;
    message: string;
    source: 'System' | 'Agent' | 'UCP-Network';
}

interface UcpContextType {
    status: AgentStatus;
    setStatus: (status: AgentStatus) => void;
    logs: UcpLog[];
    addLog: (message: string, source?: UcpLog['source']) => void;
    networkLatency: number;
}

const UcpContext = createContext<UcpContextType | undefined>(undefined);

export function UcpProvider({ children }: { children: React.ReactNode }) {
    const [status, setStatus] = useState<AgentStatus>('idle');
    const [logs, setLogs] = useState<UcpLog[]>([]);
    const [networkLatency, setNetworkLatency] = useState(24);

    // Simulate live network latency updates
    useEffect(() => {
        const interval = setInterval(() => {
            setNetworkLatency(prev => {
                const change = Math.floor(Math.random() * 10) - 5;
                return Math.max(10, Math.min(100, prev + change));
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const addLog = (message: string, source: UcpLog['source'] = 'Agent') => {
        const newLog = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            message,
            source
        };
        setLogs(prev => [newLog, ...prev].slice(0, 50));
    };

    return (
        <UcpContext.Provider value={{ status, setStatus, logs, addLog, networkLatency }}>
            {children}
        </UcpContext.Provider>
    );
}

export function useUcp() {
    const context = useContext(UcpContext);
    if (context === undefined) {
        throw new Error('useUcp must be used within a UcpProvider');
    }
    return context;
}
