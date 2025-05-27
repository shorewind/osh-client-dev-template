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

    useEffect(() => {
        const dataSource = new SweApi("KY017", {
            protocol: "ws",
            endpointUrl: `${props.server}/api`,
            resource: `/datastreams/${props.ObservableId}/observations`,
            mode: Mode.REAL_TIME
        });

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


// import React, { useEffect, useState } from "react";
// import SweApi from "osh-js/source/core/datasource/sweapi/SweApi.datasource";
// import { Mode } from "osh-js/source/core/datasource/Mode";
// import DataSynchronizer from 'osh-js/source/core/timesync/DataSynchronizer';
// import {EventType} from 'osh-js/source/core/event/EventType';
//
// export default function KY017Data(props:any) {
//     const [isTilted, setIsTilted] = useState<boolean | null>(null);
//     // useEffect(() => {
//     //     const fetchData = async () => {
//     //         const url = `http://192.168.1.136:8181/sensorhub/api/datastreams/cgr9vvhicuous/observations?f=json`;
//     //
//     //         try {
//     //             const response = await fetch(url);
//     //             console.log(response);
//     //             const data = await response.json();
//     //             console.log(data);
//     //
//     //             const value = data?.items?.[0]?.result?.isTilted;
//     //             if (typeof value !== "undefined") {
//     //                 setIsTilted(value);
//     //             } else {
//     //                 console.warn("No isTilted field found:", data);
//     //             }
//     //         } catch (error) {
//     //             console.error("HTTP Fetch Error:", error);
//     //         }
//     //     };
//     //
//     //     fetchData();
//     //
//     //     const interval = setInterval(fetchData, 5000); // poll every 5s
//     //     return () => clearInterval(interval);
//     // }, [props.server, props.SerialNumber, props.OutputFieldDefinition]);
//
//     useEffect(() => {
//         const dataSource = new SweApi("KY017", {
//             protocol: "ws",
//             // protocol: "wss",
//             endpointUrl: `${props.server}/api`, // WebSocket URL
//             resource: `/datastreams/${props.ObservableId}/observations`,   // same as your HTTP path, but over WS
//             mode: Mode.REAL_TIME,
//             // mode: Mode.REPLAY,
//             startTime: "2025-05-27T02:38:30Z",
//             endTime: "2025-05-27T02:39:23Z",
//         });
//
//         // Note: for replay mode
//         // let TimeController = new DataSynchronizer({
//         //     replaySpeed:1,
//         //     dataSources: [dataSource],
//         //     startTime: props.timeStart
//         // })
//         //
//         // TimeController.connect()
//
//         dataSource.subscribe((message) => {
//             console.log("Message received:", message.values[0].data);
//
//             if (message?.values[0]?.data?.isTilted !== undefined) {
//                 const value = message.values[0].data.isTilted;
//                 console.log("isTilted:", value);
//                 setIsTilted(value);
//             } else {
//                 console.warn("Unexpected message format:", message);
//             }
//         }, [EventType.DATA]);
//
//         dataSource.connect();
//
//     }, []);
//
//     return (
//         <div style={{ padding: "1rem" }}>
//             <h3>KY017 Tilt Status:</h3>
//             <p>{isTilted !== null ? isTilted.toString() : "Waiting for data..."}</p>
//         </div>
//     );
// }