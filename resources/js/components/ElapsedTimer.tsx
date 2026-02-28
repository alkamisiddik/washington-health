import { useState, useEffect } from 'react';

export default function ElapsedTimer({ startTime }: { startTime: string }) {
    const [elapsed, setElapsed] = useState('');

    useEffect(() => {
        const calculateElapsed = () => {
            const start = new Date(startTime).getTime();
            const now = new Date().getTime();
            const diff = Math.max(0, now - start);

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const formatted = `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
            setElapsed(formatted);
        };

        calculateElapsed();
        const interval = setInterval(calculateElapsed, 1000);

        return () => clearInterval(interval);
    }, [startTime]);

    return <span className="font-mono font-medium">{elapsed}</span>;
}
