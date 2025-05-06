import React, { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';

export const VideoFeed = () => {
    const imgRef = useRef();
    const wsRef = useRef();
    const [streamUrl, setStreamUrl] = useState("wss://controller.autoaquaponics.org:443/stream");

    useEffect(() => {
        const img = imgRef.current;

        // close previous connection if any
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.close();
        }

        const ws = new WebSocket(streamUrl);
        ws.binaryType = "arraybuffer";

        wsRef.current = ws;

        ws.onopen = () => {
            toast.info("Connected to video stream");
        };

        ws.onclose = () => {
            toast.info("Disconnected from video stream");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            toast.error("Error in video stream connection");
        };

        ws.onmessage = (event) => {
            const blob = new Blob([event.data], { type: "image/jpeg" });
            const url = URL.createObjectURL(blob);
            img.src = url;
            setTimeout(() => URL.revokeObjectURL(url), 100);
        };

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [streamUrl]);

    return (
        <div>
            <img
                ref={imgRef}
                style={{ width: '100%', height: 'auto' }}
                alt="Livestream will appear here"
            />
        </div>
    );
}
