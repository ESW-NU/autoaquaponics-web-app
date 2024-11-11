import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Alert, Box, Button, TextField } from "@mui/material";
import { toast } from 'react-toastify';

export const VideoFeed = () => {
    const videoDivRef = useRef();
    const streamUrlInputRef = useRef();
    // the below state is an object so that, even if the value remains the same,
    // if the user presses reload stream it will actually rerun the Effect
    const [activeStreamUrl, _setActiveStreamUrl] = useState({ value: "https://controller.autoaquaponics.org/stream.m3u8" });
    const [hlsSupport, setHlsSupport] = useState("pending");

    useEffect(() => {
        let cleanup = () => {};

        // replace the current video element
        const video = document.createElement("video");
        if (videoDivRef.current.firstChild) {
            videoDivRef.current.replaceChild(video, videoDivRef.current.firstChild);
        } else {
            videoDivRef.current.appendChild(video);
        }
        video.style.width = "100%";

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            setHlsSupport("native");
            video.src = activeStreamUrl.value;
        } else if (Hls.isSupported()) {
            setHlsSupport("hls.js");
            const hls = new Hls({
                debug: false,
                liveSyncDurationCount: 2, // try to be about 2 segments away from the newest segment
                liveMaxLatencyDurationCount: 5, // don't be more than 5 segments away from newest
                maxLiveSyncPlaybackRate: 1.5, // allow speedup of up to 1.5x to catch up to live
            });

            hls.on(Hls.Events.MANIFEST_LOADED, (_event, _data) => {
                toast.info(`Loaded video from ${activeStreamUrl.value}`);
            });
            hls.on(Hls.Events.ERROR, (_event, data) => {
                switch (data.details) {
                    case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
                        toast.error("Unable to load manifest (incorrect stream source hostname?)");
                        break;
                    case Hls.ErrorDetails.BUFFER_STALLED_ERROR:
                        toast.warning("Buffer stalled.");
                        break;
                    default:
                        console.log(data);
                        toast.error("Encountered an error (see console)");
                }
            });

            // load and and attach video
            hls.loadSource(activeStreamUrl.value);
            hls.attachMedia(video);

            cleanup = () => {
                hls.destroy();
            };
        } else {
            setHlsSupport("none");
        }

        // autoplay
        video.play().catch(() => { /* do nothing */ });

        return cleanup;
    }, [activeStreamUrl]);

    return (
        <div>
            {hlsSupport == "pending" ? (
                <Alert severity="info">Detecting HLS support...</Alert>
            ) : hlsSupport == "none" && (
                <Alert severity="error">HLS is not supported in your browser</Alert>
            )}
            <div ref={videoDivRef} width="100%"></div>
        </div>
    );
}
