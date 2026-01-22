import React, { useState, useRef } from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUcp } from '../context/UcpContext';

import { BomAnalysisTable } from '../components/BomAnalysisTable';
import { LogViewer } from '../components/LogViewer';
import { SupplyChainMap } from '../components/SupplyChainMap';

export function BomUploadPage() {
    const [isDragOver, setIsDragOver] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [complete, setComplete] = useState(false);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [analyzedItems, setAnalyzedItems] = useState<any[]>([]);
    const { setStatus, addLog } = useUcp();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleFile = (file: File) => {
        addLog(`Received BOM Upload: ${file.name}`, 'System');
        setFileUploaded(true);
        addLog('Parsing file structure...', 'Agent');
        addLog('Identified 8 components. Waiting for review.', 'Agent');
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files?.[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const onAnalysisComplete = (items: any[]) => {
        setAnalyzing(false);
        setComplete(true);
        setAnalyzedItems(items);
        setStatus('optimizing');
        addLog('Inventory check complete.', 'System');
        addLog('Optimization ready.', 'Agent');
    };

    const startProcessing = () => {
        setAnalyzing(true);
        setStatus('scanning');
        addLog('Starting BOM Analysis...', 'Agent');
    };

    return (
        <div className="container max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-80px)]">
            <div className="mb-6 flex justify-between items-end shrink-0">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Upload Bill of Materials</h1>
                    <p className="text-muted-foreground">Supported formats: CSV, Excel, KiCad, Eagle</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 h-[calc(100%-120px)]">
                {/* Left: Upload / Analysis Area */}
                <div className="lg:col-span-2 flex flex-col gap-6 h-full overflow-y-auto pr-2 scrollbar-hide">
                    {!fileUploaded && !analyzing && !complete && (
                        <div
                            className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-colors min-h-[400px] ${isDragOver
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-white/20 hover:border-white/40 bg-white/5'
                                }`}
                            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                            onDragLeave={() => setIsDragOver(false)}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileSelect}
                                accept=".csv,.xlsx,.xls"
                            />

                            <div className="h-16 w-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-6">
                                <Upload className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Drag & Drop your BOM here</h3>
                            <p className="text-muted-foreground mb-6 max-w-xs">
                                Or click to browse files. We'll automatically identify MPNs (Manufacturer Part Numbers).
                            </p>
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>Select File</Button>
                            <div className="mt-6 flex flex-col items-center gap-2">
                                <a
                                    href="/sample_bom.csv"
                                    download
                                    className="text-xs text-muted-foreground hover:text-blue-400 underline underline-offset-4 transition-colors"
                                >
                                    Download Sample CSV
                                </a>
                            </div>
                        </div>
                    )}

                    <AnimatePresence>
                        {(fileUploaded || analyzing || complete) && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full flex-col gap-6"
                            >
                                {/* LIVE SUPPLY CHAIN MAP (Visible during processing/analysis) */}
                                {analyzing && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mb-6 w-full"
                                    >
                                        <SupplyChainMap active={true} />
                                    </motion.div>
                                )}

                                <BomAnalysisTable
                                    onComplete={onAnalysisComplete}
                                    isProcessing={analyzing}
                                    startProcessing={startProcessing}
                                />
                            </motion.div>
                        )}

                        {complete && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 rounded-xl bg-green-500/10 border border-green-500/20 mt-6"
                            >
                                <div className="flex items-center mb-2 text-green-400 font-semibold">
                                    <CheckCircle className="mr-2 h-5 w-5" />
                                    Analysis Complete
                                </div>
                                <p className="text-sm text-green-300/70 mb-4">Found 8/8 parts (with substitutions).</p>
                                <div className="flex gap-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setComplete(false);
                                            setAnalyzing(false);
                                            setFileUploaded(false);
                                            setAnalyzedItems([]);
                                            setStatus('idle');
                                        }}
                                    >
                                        Re-Analyze
                                    </Button>
                                    <Button
                                        className="flex-1 bg-green-600 hover:bg-green-500 text-white border-0"
                                        onClick={() => navigate('/results', { state: { items: analyzedItems.filter((i: any) => i.selected) } })}
                                    >
                                        View Optimization
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right: Embedded Agent Stream */}
                <div className="lg:col-span-1 h-full flex flex-col">
                    <div className="flex-1 rounded-xl bg-black/40 border border-white/10 overflow-hidden flex flex-col min-h-[400px]">
                        <div className="p-3 bg-white/5 border-b border-white/10 font-semibold text-sm text-blue-400 flex items-center">
                            UCP Agent Activity
                        </div>
                        <LogViewer embedded className="flex-1" />
                    </div>
                </div>
            </div>
        </div>
    );
}
