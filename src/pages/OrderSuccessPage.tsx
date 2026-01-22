import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ShieldCheck, ShoppingBag, Download } from 'lucide-react';
import { Button } from '../components/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogViewer } from '../components/LogViewer';

export function OrderSuccessPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const { groupedItems, total, savings } = location.state || {};

    // Fallback if accessed directly
    if (!groupedItems) {
        return (
            <div className="container max-w-7xl mx-auto px-4 py-24 text-center">
                <h2 className="text-xl font-bold">No Order Details Found</h2>
                <Button className="mt-4" onClick={() => navigate('/')}>Return Home</Button>
            </div>
        )
    }

    const supplierCount = Object.keys(groupedItems).length;
    const itemCount = Object.values(groupedItems).flat().length;

    return (
        <div className="container max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-80px)]">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="flex flex-col items-center mb-8 text-center shrink-0"
            >
                <div className="mb-4 p-4 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_30px_rgba(74,222,128,0.2)]">
                    <CheckCircle className="h-12 w-12" />
                </div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600 mb-2">
                    Order Placed Successfully!
                </h1>
                <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                    Your UCP Agent has successfully secured stock for {itemCount} items across {supplierCount} suppliers.
                </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6 h-[calc(100%-200px)]">
                {/* Left: Order Details & Payment Summary */}
                <div className="lg:col-span-2 flex flex-col gap-6 h-full overflow-y-auto pr-2 scrollbar-hide">

                    {/* Payment Summary Banner */}
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                        <div className="flex gap-8 text-sm">
                            <div>
                                <div className="text-muted-foreground">Status</div>
                                <div className="text-green-400 font-semibold">Confirmed</div>
                            </div>
                            <div>
                                <div className="text-muted-foreground">Order ID</div>
                                <div className="text-white font-mono">#UCP-{Math.floor(Math.random() * 100000)}</div>
                            </div>
                            <div>
                                <div className="text-muted-foreground">Total Paid</div>
                                <div className="text-white font-bold text-lg">${total.toFixed(2)}</div>
                            </div>
                            {savings > 0 && (
                                <div>
                                    <div className="text-muted-foreground">Savings</div>
                                    <div className="text-green-400 font-bold">-${savings.toFixed(2)}</div>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4" /> Invoice
                            </Button>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white" onClick={() => navigate('/upload')}>
                                New Order
                            </Button>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold flex items-center shrink-0">
                        <ShoppingBag className="mr-2 h-5 w-5" /> Supplier Breakdown
                    </h2>

                    <div className="space-y-4">
                        {Object.entries(groupedItems).map(([supplier, items]: [string, any], index) => {
                            const supplierTotal = items.reduce((acc: number, i: any) => acc + ((i.price || 0) * i.quantity), 0);
                            return (
                                <motion.div
                                    key={supplier}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 + (index * 0.1) }}
                                    className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                                >
                                    <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                                                <ShieldCheck className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-white">{supplier}</div>
                                                <div className="text-xs text-muted-foreground font-mono">ID: TX-{Math.floor(Math.random() * 10000)}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-white">${supplierTotal.toFixed(2)}</div>
                                            <div className="text-xs text-green-400">Paid • Confirmed</div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-muted-foreground text-xs uppercase text-left">
                                                    <th className="pb-2">MPN</th>
                                                    <th className="pb-2">Qty</th>
                                                    <th className="pb-2 text-right">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {items.map((item: any, idx: number) => (
                                                    <tr key={idx} className="text-white/80">
                                                        <td className="py-2 font-mono text-xs">{item.mpn}</td>
                                                        <td className="py-2">{item.quantity}</td>
                                                        <td className="py-2 text-right">
                                                            {item.price ? `$${item.price.toFixed(2)}` : <span className="text-red-400">N/A</span>}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                {/* Right: Embedded Agent Stream (HERO) */}
                <div className="lg:col-span-1 h-full flex flex-col">
                    <div className="flex-1 rounded-xl bg-black/40 border border-white/10 overflow-hidden flex flex-col min-h-[400px]">
                        <div className="p-3 bg-white/5 border-b border-white/10 font-semibold text-sm text-blue-400 flex items-center">
                            Post-Order Agent Verification
                        </div>
                        <LogViewer embedded className="flex-1" />
                    </div>
                </div>
            </div>
        </div>
    );
}
