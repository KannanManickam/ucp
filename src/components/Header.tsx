import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Cpu, Menu } from 'lucide-react';
import { Button } from './Button';
import { useUcp } from '../context/UcpContext';

export function Header() {
    const { status, networkLatency } = useUcp();
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center w-full max-w-7xl mx-auto px-4">
                <div className="mr-8 flex items-center space-x-2">
                    <Cpu className="h-6 w-6 text-blue-400" />
                    <span className="text-xl font-bold tracking-tight">ProtoCart</span>
                </div>

                <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
                    <Link to="/" className="transition-colors hover:text-foreground/80 text-foreground/60">Home</Link>
                    <Link to="/upload" className="transition-colors hover:text-foreground/80 text-foreground/60">BOM Upload</Link>

                    <div className="hidden lg:flex items-center text-xs space-x-4 border-l border-white/10 pl-6 h-8">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                            <div className={`h-1.5 w-1.5 rounded-full ${status === 'idle' ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`}></div>
                            <span className="capitalize">{status === 'idle' ? 'UCP Network Active' : status}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                            <span className={`font-mono ${networkLatency > 50 ? 'text-yellow-500' : 'text-green-500'}`}>{networkLatency}ms</span>
                            <span>latency</span>
                        </div>
                    </div>

                    <Link to="/suppliers" className="transition-colors hover:text-foreground/80 text-foreground/60">Suppliers</Link>
                </nav>

                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="w-9 px-0">
                        <ShoppingCart className="h-4 w-4" />
                        <span className="sr-only">Cart</span>
                    </Button>
                    <Button size="sm" className="hidden md:flex bg-blue-600 hover:bg-blue-500 text-white border-0">
                        Get Started
                    </Button>
                    <Button variant="ghost" size="sm" className="md:hidden">
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
