# ProtoCart - Google UCP Demo

This is a Proof of Concept (PoC) for a **Universal Commerce Protocol (UCP)** agent designed for hardware engineering. It demonstrates how an AI agent can take a Bill of Materials (BOM) and autonomously negotiate, optimize, and procure components from multiple disconnected suppliers (DigiKey, Mouser, etc.) in a single transaction.

## Features

- **Agentic Workflow**: Simulates the "Analysis" and "Negotiation" phases of an AI commerce agent.
- **Universal Cart**: Aggregates inventory from multiple sources into one optimization logic.
- **Real-time Status**: Displays simulated network latency and agent state (Scanning, Negotiating, Purchasing).
- **Log Stream**: A visual terminal showing the "thought process" and protocol events of the agent.

## Tech Stack

- **Framework**: React + Vite
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Run the development server:
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:5173](http://localhost:5173) to view the demo.

## user Journey

1.  **Landing Page**: Start the optimization process.
2.  **BOM Upload**: Drag and drop a file (visual simulation). Watch the "Agent Stream" in the bottom right corner wake up.
3.  **Suppliers**: Check the status of the UCP network nodes.
4.  **Results**: Choose your optimization strategy (Cheapest vs Fastest) and execute the federated purchase.
