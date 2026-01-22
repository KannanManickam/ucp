import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Adjusted Coordinates for 100x60 Aspect Ratio (Wider, less tall)
const LOCATIONS = [
    { id: 'user', x: 20, y: 35, label: 'HQ (User)', color: '#3b82f6' }, // West Coast roughly
    { id: 'mouser', x: 50, y: 50, label: 'Mouser (TX)', color: '#ef4444' }, // Texas
    { id: 'digikey', x: 55, y: 15, label: 'DigiKey (MN)', color: '#3b82f6' }, // North
    { id: 'adafruit', x: 80, y: 20, label: 'Adafruit (NY)', color: '#a855f7' }, // East Coast
];

// Simple simplified US Shape path
const US_PATH = "M 10,10 L 30,12 L 40,8 L 90,15 L 95,25 L 85,50 L 55,55 L 45,60 L 20,50 L 10,40 L 5,20 Z";

export function SupplyChainMap({ active }: { active: boolean }) {
    const [scanned, setScanned] = useState<string[]>([]);

    useEffect(() => {
        if (!active) return;
        const sequence = ['mouser', 'digikey', 'adafruit'];
        let i = 0;
        const interval = setInterval(() => {
            if (i < sequence.length) {
                setScanned(prev => [...prev, sequence[i]]);
                i++;
            }
        }, 800);
        return () => clearInterval(interval);
    }, [active]);

    return (
        <div className="w-full h-96 bg-black/40 border border-white/10 rounded-xl relative overflow-hidden flex items-center justify-center">
            {/* Grid Background */}
            <div className="absolute inset-0"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}
            />

            {/* Map Container - Preserving Aspect Ratio */}
            <div className="relative w-full h-full px-8 py-4">
                <svg className="w-full h-full" viewBox="0 0 100 65" preserveAspectRatio="xMidYMid meet">
                    {/* Abstract US Map Outline */}
                    <path
                        d="M2.0,18.0 L18.0,15.0 L24.0,5.0 L32.0,5.0 L45.0,8.0 L85.0,2.0 L98.0,15.0 L92.0,45.0 L80.0,55.0 L55.0,62.0 L35.0,58.0 L25.0,50.0 L5.0,40.0 Z"
                        fill="rgba(59, 130, 246, 0.05)"
                        stroke="rgba(59, 130, 246, 0.1)"
                        strokeWidth="0.5"
                        className="drop-shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                    />

                    {/* Connections */}
                    {LOCATIONS.slice(1).map((loc) => (
                        <ConnectionLine
                            key={loc.id}
                            start={LOCATIONS[0]}
                            end={loc}
                            active={active}
                            complete={scanned.includes(loc.id)}
                        />
                    ))}

                    {/* Nodes */}
                    {LOCATIONS.map((loc) => (
                        <MapNode
                            key={loc.id}
                            x={loc.x}
                            y={loc.y}
                            color={loc.color}
                            label={loc.label}
                            pulse={active || scanned.includes(loc.id)}
                            isUser={loc.id === 'user'}
                        />
                    ))}
                </svg>
            </div>

            {/* Overlay Status */}
            <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 text-xs font-mono text-blue-400 bg-black/50 px-3 py-1.5 rounded-full border border-blue-500/20">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    LIVE UCP NETWORK
                </div>
            </div>
        </div>
    );
}

function ConnectionLine({ start, end, active, complete }: any) {
    return (
        <motion.line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke={complete ? end.color : "#333"}
            strokeWidth="0.5"
            strokeDasharray="4 2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
                pathLength: active ? 1 : 0,
                opacity: 1,
                stroke: complete ? end.color : "#444"
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
        />
    );
}

function MapNode({ x, y, color, label, pulse, isUser }: any) {
    return (
        <g transform={`translate(${x}, ${y})`}>
            {pulse && (
                <motion.circle
                    r="4"
                    fill={color}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: [0, 0.4, 0], scale: [1, 3, 3.5] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                />
            )}
            {/* Core Dot */}
            <circle r={isUser ? "2" : "1.5"} fill={isUser ? "white" : color} filter="url(#glow)" />

            {/* Label Background */}
            <rect x="-10" y={isUser ? -8 : 3} width="20" height="5" rx="1" fill="rgba(0,0,0,0.6)" />

            <text
                y={isUser ? -4.5 : 6.5}
                className="text-[2.5px] font-mono fill-white font-bold uppercase tracking-wider"
                textAnchor="middle"
            >
                {label}
            </text>
        </g>
    );
}
