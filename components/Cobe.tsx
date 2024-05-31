// @ts-nocheck
"use client"

import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { useSpring } from "react-spring";

export default function Cobe() {
    const canvasRef = useRef( null );
    const pointerInteracting = useRef(null);
    const pointerInteractionMovement = useRef(0);
    const [{ r }, api] = useSpring(() => ({
        r: 0,
        config: {
            mass: 1,
            tension: 280,
            friction: 40,
            precision: 0.001,
        },
    }));
    useEffect(() => {

        let width = 0;
        let phi = 0;
        const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth);
        window.addEventListener('resize', onResize)
        onResize()
        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: width * 2,
            height: width * 2,
            phi: 0,
            theta: 0.3,
            dark: 1,
            diffuse: 3,
            mapBrightness: 4.6,
            mapSamples: 16000,

            baseColor: [0.5, 0.5, 0.5],
            markerColor: [251 / 255, 100 / 255, 21 / 255],

            glowColor: [13 / 255, 13 / 255, 13 / 255],
            markers: [],
            onRender: ( state ) => {

                if ( !pointerInteracting.current )
                    phi += 0.002;

                state.phi = phi + r.get()
                state.width = width * 2
                state.height = width * 2

            }
        })
        setTimeout(() => canvasRef.current.style.opacity = '1')
        return () => {
            globe.destroy();
            window.removeEventListener('resize', onResize);
        }
    }, [])
    return <div style={{
        width: "100%",
        maxWidth: 800,
        aspectRatio: 1,
        margin: 'auto',
        position: 'relative',
    }}>
        <canvas
            ref={canvasRef}
            onPointerDown={(e) => {
                pointerInteracting.current =
                    e.clientX - pointerInteractionMovement.current;
                canvasRef.current.style.cursor = 'grabbing';
            }}
            onPointerUp={() => {
                pointerInteracting.current = null;
                canvasRef.current.style.cursor = 'grab';
            }}
            onPointerOut={() => {
                pointerInteracting.current = null;
                canvasRef.current.style.cursor = 'grab';
            }}
            onMouseMove={(e) => {
                if (pointerInteracting.current !== null) {
                    const delta = e.clientX - pointerInteracting.current;
                    pointerInteractionMovement.current = delta;
                    api.start({
                        r: delta / 200,
                    });
                }
            }}
            onTouchMove={(e) => {
                if (pointerInteracting.current !== null && e.touches[0]) {
                    const delta = e.touches[0].clientX - pointerInteracting.current;
                    pointerInteractionMovement.current = delta;
                    api.start({
                        r: delta / 100,
                    });
                }
            }}
            style={{
                width: '100%',
                height: '100%',
                cursor: 'grab',
                contain: 'layout paint size',
                opacity: 0,
                transition: 'opacity 1s ease',
            }}
        />
    </div>
}

