import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, ChevronRight, Package, ShoppingCart, Truck, Zap, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useUcp } from '../context/UcpContext';
import { LogViewer } from '../components/LogViewer';
import { RollingPrice } from '../components/RollingPrice';
import { DatasheetPreview } from '../components/DatasheetPreview';

export function ResultsPage() {
    const [selectedStrategy, setSelectedStrategy] = useState<'cheapest' | 'fastest' | 'balanced'>('balanced');
    const { setStatus, addLog } = useUcp();
    const navigate = useNavigate();
    const location = useLocation();

    // -- DYNAMIC ITEMS LOGIC --
    const items = location.state?.items || [];

    const modifiers = {
        cheapest: 0.9,
        balanced: 1.0,
        fastest: 1.2
    };

    const baseTotal = items.reduce((acc: number, item: any) => acc + ((item.price || 0) * item.quantity), 0);
    const [negotiating, setNegotiating] = useState(true);
    const [recalculating, setRecalculating] = useState(false);
    const [purchasing, setPurchasing] = useState(false);
    const [savings, setSavings] = useState(0);

    // Start at 0 for "tick up" effect
    const [currentTotal, setCurrentTotal] = useState(0);

    const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'alternatives'>('overview');
    const [groupedItems, setGroupedItems] = useState<any>({});

    useEffect(() => {
        setSavings(0);
        setNegotiating(true);
        setRecalculating(false);
        setPurchasing(false);
        setActiveTab('overview');

        const groups: any = { 'DigiKey': [], 'Mouser': [], 'Adafruit': [] };
        items.forEach((item: any) => {
            const s = item.supplier && groups[item.supplier] ? item.supplier : Object.keys(groups)[Math.floor(Math.random() * 3)];
            groups[s].push(item);
        });
        setGroupedItems(groups);
    }, [items]);

    const strategyPricing = {
        cheapest: baseTotal * modifiers.cheapest,
        balanced: baseTotal * modifiers.balanced,
        fastest: baseTotal * modifiers.fastest
    };

    const handleStrategyChange = (strategy: 'cheapest' | 'fastest' | 'balanced') => {
        if (negotiating || recalculating || purchasing || strategy === selectedStrategy) return;

        setSelectedStrategy(strategy);
        setRecalculating(true);
        addLog(`Switching strategy to ${strategy.toUpperCase()}...`, 'System');
        addLog('Re-verifying stock and shipping routes...', 'Agent');

        setTimeout(() => {
            setCurrentTotal(strategyPricing[strategy]);
            setRecalculating(false);
            addLog(`Updated optimization: $${strategyPricing[strategy].toFixed(2)}`, 'System');
        }, 1200);
    };

    useEffect(() => {
        if (items.length === 0) return;
        setStatus('negotiating');
        addLog('Starting multi-party negotiation...', 'Agent');
        const timeouts: any[] = [];

        // Trigger initial tick up almost immediately
        setCurrentTotal(baseTotal * 1.15);

        // 1. Initial Logic Analysis (Reasoning Block)
        timeouts.push(setTimeout(() => {
            addLog('Analyzing supplier constraints...', 'Agent', 'reasoning', {
                "Vendors": 3,
                "Constraints": "Lead-Time < 3 days"
            });
        }, 800));

        // 2. DigiKey Negotiation (JSON Handshake)
        timeouts.push(setTimeout(() => {
            addLog('DigiKey API Handshake', 'UCP-Network', 'json', {
                "endpoint": "/v3/quote",
                "token": "0x8a...3f",
                "items": items.length
            });
        }, 1200));

        // 3. Discount Applied
        timeouts.push(setTimeout(() => {
            addLog('DigiKey: Volume discount applied (-5%)', 'Agent');
            setSavings(baseTotal * 0.05);
            setCurrentTotal(prev => prev * 0.95);
        }, 2200));

        // 4. Detailed Optimization Thought
        timeouts.push(setTimeout(() => {
            addLog('Optimizing Shipping Route', 'Agent', 'reasoning', {
                "Strategy": "Consolidation",
                "Original": "3 Shipments",
                "New": "1 Combined Shipment",
                "Saved": "$18.50"
            });
        }, 3000));

        timeouts.push(setTimeout(() => {
            addLog('Mouser: Combined shipping logic optimized route.', 'UCP-Network');
            setSavings(prev => prev + (baseTotal * 0.03));
            setCurrentTotal(prev => prev * 0.97);
        }, 4500));

        timeouts.push(setTimeout(() => {
            addLog('Adafruit: Applied loyalist token coupon.', 'Agent');
            setSavings(prev => prev + (baseTotal * 0.01));
            setCurrentTotal(strategyPricing.balanced);
            setNegotiating(false);
            setStatus('idle');
            addLog('Negotiation complete. Best price locked.', 'System');
        }, 5500));

        return () => timeouts.forEach(clearTimeout);
    }, [items]);

    const handlePurchase = () => {
        if (negotiating || recalculating || purchasing) return;

        setPurchasing(true); // Disable button immediately
        setStatus('purchasing');
        addLog('Initiating UCP autonomous payment sequence...', 'Agent');

        setTimeout(() => {
            addLog('Verifying Smart Contract Liquidity', 'UCP-Network', 'json', {
                "Contract": "0x7a2...bb",
                "Gas": "0.004 ETH",
                "Method": "batchSettle"
            });
        }, 800);

        setTimeout(() => {
            addLog('DigiKey Payment Authorized', 'UCP-Network', 'reasoning', {
                "Protocol": "UCP-v2",
                "Auth": "ED25519-Signed",
                "Nonce": "49201"
            });
        }, 1600);

        setTimeout(() => {
            addLog('Mouser + Adafruit Batch Settled', 'UCP-Network');
            setStatus('idle');
            navigate('/success', { state: { groupedItems, total: currentTotal, savings } });
        }, 3000);
    };

    if (items.length === 0) {
        return (
            <div className="container max-w-7xl mx-auto px-4 py-8 text-center pt-24">
                <h2 className="text-xl font-bold mb-4">No Items to Process</h2>
                <Link to="/upload">
                    <Button>Upload BOM</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="container max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-80px)]">
            <Link to="/upload" className="inline-flex items-center text-sm text-muted-foreground hover:text-white mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Upload
            </Link>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${negotiating || recalculating ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                        {negotiating || recalculating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                    </div>
                    <div>
                        <h3 className="font-semibold">
                            {negotiating ? 'Negotiating Best Prices...' : recalculating ? 'Re-optimizing Route...' : 'Optimization Complete'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {negotiating ? 'Agent is communicating with 3 suppliers.' : recalculating ? 'Verifying new shipping & stock data...' : 'Best possible route locked via UCP.'}
                        </p>
                    </div>
                </div>
                {!negotiating && !recalculating && savings > 0 && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-right px-4"
                    >
                        <div className="text-xs text-muted-foreground">Total Savings</div>
                        <div className="text-xl font-bold text-green-400">-${savings.toFixed(2)}</div>
                    </motion.div>
                )}
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6 h-[calc(100%-120px)]">
                {/* Left Column: Strategies, Summary, Breakdown */}
                <div className="lg:col-span-2 flex flex-col gap-6 h-full overflow-y-auto pr-2 scrollbar-hide">

                    <div className="flex items-center justify-between shrink-0">
                        <h1 className="text-3xl font-bold">Optimization Results</h1>
                        <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
                            {['overview', 'breakdown', 'alternatives'].map((tab: any) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-1.5 rounded-md text-sm capitalize transition-all ${activeTab === tab
                                        ? 'bg-blue-600/20 text-blue-300'
                                        : 'text-muted-foreground hover:text-white'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 shrink-0 p-1 bg-white/5 border border-white/10 rounded-xl">
                        <StrategyButton
                            active={selectedStrategy === 'cheapest'}
                            onClick={() => handleStrategyChange('cheapest')}
                            icon={<ShoppingCart className="h-4 w-4" />}
                            label="Cheapest"
                            subLabel={`$${strategyPricing.cheapest.toFixed(2)}`}
                        />
                        <StrategyButton
                            active={selectedStrategy === 'balanced'}
                            onClick={() => handleStrategyChange('balanced')}
                            icon={<Zap className="h-4 w-4" />}
                            label="Balanced"
                            subLabel={`$${strategyPricing.balanced.toFixed(2)} • 3 days`}
                        />
                        <StrategyButton
                            active={selectedStrategy === 'fastest'}
                            onClick={() => handleStrategyChange('fastest')}
                            icon={<Truck className="h-4 w-4" />}
                            label="Fastest"
                            subLabel={`$${strategyPricing.fastest.toFixed(2)} • Tmrw`}
                        />
                    </div>

                    {/* Order Summary (Horizontal Bar) */}
                    <div className="bg-white/5 border border-white/10 p-4 sm:p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6 shrink-0">
                        <div className="space-y-1 text-sm flex-1">
                            <div className="flex gap-4 md:gap-8 text-muted-foreground mb-2">
                                <span>Subtotal: ${baseTotal.toFixed(2)}</span>
                                <span>Shipping: $13.50</span>
                            </div>
                            <div className="flex gap-4 items-baseline">
                                <RollingPrice
                                    value={currentTotal}
                                    className="text-2xl font-bold text-white"
                                />
                                {savings > 0 && (
                                    <span className="text-green-400 font-medium">-{savings.toFixed(2)} Saved</span>
                                )}
                            </div>
                        </div>
                        <div className="w-full sm:w-auto min-w-[200px]">
                            <Button
                                size="lg"
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white h-12"
                                onClick={handlePurchase}
                                disabled={negotiating || recalculating || purchasing}
                            >
                                {purchasing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing Order...
                                    </>
                                ) : negotiating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Negotiating...
                                    </>
                                ) : recalculating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="mr-2 h-4 w-4 fill-current" />
                                        Execute Auto-Purchase
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold shrink-0">Sourcing Breakdown</h3>
                        {Object.entries(groupedItems).map(([supplier, groupItems]: [string, any]) => {
                            if (groupItems.length === 0) return null;
                            const groupTotal = groupItems.reduce((acc: number, i: any) => acc + ((i.price || 0) * i.quantity), 0);

                            return (
                                <SupplierGroup
                                    key={supplier}
                                    name={supplier}
                                    total={`$${groupTotal.toFixed(2)}`}
                                    count={groupItems.length}
                                    items={groupItems}
                                    shipping={selectedStrategy === 'fastest' ? "$25.00 Priority" : "Free Shipping"}
                                    arrives={supplier === 'Adafruit' ? "Arrives Tomorrow" : "Arrives in 3 days"}
                                    color={supplier === 'DigiKey' ? 'blue' : supplier === 'Mouser' ? 'red' : 'purple'}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Embedded Agent Stream (HERO) */}
                <div className="lg:col-span-1 h-full flex flex-col">
                    <div className="flex-1 rounded-xl bg-black/40 border border-white/10 overflow-hidden flex flex-col min-h-[400px]">
                        <LogViewer embedded className="flex-1" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StrategyButton({ active, onClick, icon, label, subLabel }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center py-4 px-2 rounded-lg transition-all ${active
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'hover:bg-white/5 text-muted-foreground hover:text-white'
                }`}
        >
            <div className="mb-2 opacity-80">{icon}</div>
            <div className="font-medium text-sm mb-0.5">{label}</div>
            <div className={`text-xs ${active ? 'text-blue-200' : 'text-muted-foreground/60'}`}>{subLabel}</div>
        </button>
    )
}

function SupplierGroup({ name, total, count, items, shipping, arrives, color }: any) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden transition-all duration-300">
            <div className="p-4 flex items-center justify-between bg-white/5 cursor-pointer hover:bg-white/10" onClick={() => setExpanded(!expanded)}>
                <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm bg-${color}-500/20 text-${color}-300`}>
                        {name[0]}
                    </div>
                    <div>
                        <div className="font-semibold">{name}</div>
                        <div className="text-xs text-muted-foreground">{count} items</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="font-semibold">{total}</div>
                    <div className="text-xs text-muted-foreground">{shipping}</div>
                </div>
            </div>

            {/* Expanded Content */}
            {expanded && (
                <div className="border-t border-white/10 bg-black/20">
                    <table className="w-full text-xs text-left">
                        <thead className="text-muted-foreground bg-white/5">
                            <tr>
                                <th className="px-4 py-2 font-medium">MPN</th>
                                <th className="px-4 py-2 font-medium text-center">Qty</th>
                                <th className="px-4 py-2 font-medium text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {items.map((item: any, idx: number) => (
                                <tr key={idx} className="hover:bg-white/5">
                                    <td className="px-4 py-2 font-mono text-white/80">
                                        <DatasheetPreview mpn={item.mpn}>
                                            {item.mpn}
                                        </DatasheetPreview>
                                        {item.status === 'substituted' && <span className="ml-2 text-[10px] text-yellow-400 bg-yellow-400/10 px-1 rounded">Alt</span>}
                                    </td>
                                    <td className="px-4 py-2 text-center text-white/60">{item.quantity}</td>
                                    <td className="px-4 py-2 text-right text-white">
                                        {item.price ? `$${item.price.toFixed(2)}` : <span className="text-red-400">N/A</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="px-4 py-3 bg-white/2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-white/5">
                <div className="flex items-center text-xs text-green-400">
                    <Package className="mr-2 h-3 w-3" />
                    {arrives}
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs ml-auto" onClick={() => setExpanded(!expanded)}>
                    {expanded ? 'Hide Items' : 'View Items'} <ChevronRight className={`ml-1 h-3 w-3 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                </Button>
            </div>
        </div>
    )
}
