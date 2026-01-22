import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Box, Zap, Layers } from 'lucide-react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';

export function LandingPage() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center py-20 md:py-32 px-4 text-center overflow-hidden relative">
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px]" />
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 max-w-4xl mx-auto space-y-6"
                >
                    <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm text-blue-300 backdrop-blur-sm mb-4">
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                        Powered by Google UCP
                    </div>

                    <h1 className="text-4xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        One BOM. <br />
                        <span className="text-blue-400">Universal Fulfillment.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Stop checking 10 different supplier carts. Upload your engineering BOM and let our
                        AI agent optimize stock, price, and shipping across the entire hardware ecosystem.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link to="/upload">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white min-w-[200px] h-12 text-lg">
                                Start Optimization
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="min-w-[200px] h-12 text-lg">
                            View Demo
                        </Button>
                    </div>
                </motion.div>
            </section>

            {/* Feature Grid */}
            <section className="py-24 bg-white/5 border-t border-white/5">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Layers className="h-8 w-8 text-blue-400" />}
                            title="Unified Inventory"
                            description="Access DigiKey, Mouser, Adafruit, and LCSC in a single interface. No more tab switching."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<Zap className="h-8 w-8 text-purple-400" />}
                            title="AI Optimization"
                            description="Our agent calculates the perfect split: lowest BOM cost vs. fewest shipments vs. fastest delivery."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Box className="h-8 w-8 text-green-400" />}
                            title="One-Click Procurement"
                            description="Execute orders across 5 vendors simultaneously using the Universal Commerce Protocol."
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
        >
            <div className="mb-4 p-3 bg-white/5 w-fit rounded-xl">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </motion.div>
    );
}
