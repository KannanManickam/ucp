import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Globe, Server, ShieldCheck } from 'lucide-react';
import { Button } from '../components/Button';

const suppliers = [
    { name: "DigiKey", region: "North America", status: "Active", latency: "12ms", parts: "12M+" },
    { name: "Mouser", region: "Global", status: "Active", latency: "45ms", parts: "8M+" },
    { name: "LCSC", region: "Asia", status: "Active", latency: "120ms", parts: "4M+" },
    { name: "Adafruit", region: "USA", status: "Active", latency: "24ms", parts: "50k+" },
    { name: "SparkFun", region: "USA", status: "Active", latency: "28ms", parts: "45k+" },
    { name: "RS Components", region: "Europe", status: "Active", latency: "85ms", parts: "6M+" },
];

export function SuppliersPage() {
    return (
        <div className="container max-w-6xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Supplier Network</h1>
                    <p className="text-muted-foreground">
                        Monitor real-time UCP connections to global component distributors.
                    </p>
                </div>
                <div className="mt-4 md:mt-0 flex gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm border border-green-500/20">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        System Operational
                    </div>
                    <Button variant="outline">Refresh Status</Button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suppliers.map((supplier, idx) => (
                    <SupplierCard key={supplier.name} supplier={supplier} index={idx} />
                ))}
            </div>

            <div className="mt-16 p-8 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-start gap-6">
                    <div className="p-4 rounded-xl bg-blue-500/20 text-blue-400">
                        <Server className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">How UCP Integration Works</h3>
                        <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
                            ProtoCart uses the Universal Commerce Protocol to query real-time stock levels,
                            tier pricing, and shipping API access tokens directly from these suppliers.
                            When you place an order, our agent orchestrates the checkout flow cryptographically
                            signed by your wallet, ensuring secure, autonomous procurement.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SupplierCard({ supplier, index }: { supplier: any, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center font-bold text-lg">
                    {supplier.name[0]}
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                    <CheckCircle2 className="h-3 w-3" />
                    {supplier.status}
                </div>
            </div>

            <h3 className="text-xl font-bold mb-1">{supplier.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mb-6">
                <Globe className="h-3 w-3 mr-1" />
                {supplier.region}
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/10">
                <div>
                    <div className="text-xs text-muted-foreground mb-1">Latency</div>
                    <div className="font-mono text-sm">{supplier.latency}</div>
                </div>
                <div>
                    <div className="text-xs text-muted-foreground mb-1">Catalog Size</div>
                    <div className="font-mono text-sm">{supplier.parts}</div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground/50 group-hover:text-blue-400 transition-colors">
                <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    UCP Verified
                </span>
                <span className="font-mono opacity-50">ID: {Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
            </div>
        </motion.div>
    );
}
