// KY017Data.tsx
import React, { useEffect, useState, useRef } from "react";
import SweApi from "osh-js/source/core/datasource/sweapi/SweApi.datasource";
import { Mode } from "osh-js/source/core/datasource/Mode";
import { EventType } from "osh-js/source/core/event/EventType";
import KY017Visualization from "./KY017Visualization";

export default function KY017Data(props: any) {
    const [isTilted, setIsTilted] = useState<boolean | null>(null);
    const [history, setHistory] = useState<{ time: string; value: number }[]>([]);
    const lastStateRef = useRef<number | null>(null);
    const lastTimestampRef = useRef<Date | null>(null);

    // subscribe to connected systems web socket to get real time data stream
    useEffect(() => {
        const dataSource = new SweApi("KY017", {
            protocol: "ws",
            endpointUrl: `${props.server}/api`,
            resource: `/datastreams/${props.ObservableId}/observations`,
            mode: Mode.REAL_TIME
        });

        // check api observation for response structure
        // set the tilted state from incoming data message
        dataSource.subscribe((message: any) => {
            const data = message?.values?.[0]?.data;

            if (data?.isTilted !== undefined) {
                const value = data.isTilted ? 1 : 0;
                setIsTilted(!!value);
                lastStateRef.current = value;
            }
        }, [EventType.DATA]);

        dataSource.connect();

        // push a value every second using the last known value
        const interval = setInterval(() => {
            if (lastStateRef.current != null)
            {
                const now = new Date();
                const value = lastStateRef.current;

                setHistory(prev => {
                    return [...prev, { time: now.toISOString(), value }];
                });
            }
        }, 1000);

        return () => {
            clearInterval(interval);
            dataSource.disconnect();
        };
    }, []);

    return (
        <KY017Visualization isTilted={isTilted} history={history} />
    );
}
