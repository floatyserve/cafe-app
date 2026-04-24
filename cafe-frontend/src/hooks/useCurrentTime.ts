import { useState, useEffect } from 'react';

export function useCurrentTime(refreshIntervalMs = 60000) {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, refreshIntervalMs);

        return () => clearInterval(interval);
    }, [refreshIntervalMs]);

    return now;
}