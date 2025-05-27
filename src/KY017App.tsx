// KY017App.tsx
import React from 'react'
import KY017Data from './KY017Data'

export default function KY017App() {

    const sensorApiVariables = {
        server: "192.168.1.185:8181/sensorhub",
        // for replay
        // timeStart:"2025-04-17T13:25:30.453Z",
        // timeEnd:"2026-04-11T19:35:18.716Z",
        // secure:true,

        // for connected systems api
        ObservableId:"c9quh2smsefpa",
        // for sos api
        SerialNumber:"urn:osh:sensor:trainingky017",
        OutputFieldDefinition:"http://sensorml.com/ont/swe/property/tilted"
    }

    return (
        <KY017Data {...sensorApiVariables} />
    )
};