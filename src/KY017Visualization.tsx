// KY017Visualization.tsx
import React from "react";
import { Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

import './KY017Style.css';

type HistoryPoint = { time: string; value: number };

interface Props {
    isTilted: boolean | null;
    history: HistoryPoint[];
}

export default function KY017Visualization({ isTilted, history }: Props) {
    // Note: don't show graph without data
    // if (history.length === 0) {
    //     return (
    //         <div className="card">
    //             <h2 className="card-title">KY017 Tilt Status</h2>
    //             <p className="status-label status-waiting">Waiting...</p>
    //             <p className="chart-note">No data received yet from the sensor.</p>
    //         </div>
    //     );
    // }

    const chartData = {
        labels: history.map((entry) =>
            new Date(entry.time).toLocaleTimeString()
        ),
        datasets: [
            {
                label: "Tilted (1) / Level (0)",
                data: history.map((entry) => entry.value),
                fill: false,
                stepped: true,
                borderColor: "rgba(75,192,192,1)",
                tension: 0
            }
        ]
    };

    const chartOptions: ChartOptions<"line"> = {
        scales: {
            y: {
                min: 0,
                max: 1,
                ticks: {
                    stepSize: 1,
                    callback: (value) => (value === 1 ? "Tilted" : "Level")
                }
            }
        }
    };

    return (
        <div className="page-container">
            <div className="card">
                <h2 className="card-title">KY017 Tilt Status</h2>
                <p className={`status-label ${
                    isTilted === null
                        ? "status-waiting"
                        : isTilted
                            ? "status-tilted"
                            : "status-level"
                }`}>
                    {isTilted === null ? "Waiting..." : isTilted ? "TILTED" : "LEVEL"}
                </p>

                <div className="chart-container">
                    <div style={{height: '100%', width: '100%'}}>
                        <Line data={chartData} options={chartOptions}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
