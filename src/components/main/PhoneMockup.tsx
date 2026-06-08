import React from 'react';
import Image from "next/image";

interface IphoneMockupProps {
    videoSrc?: string;
    imageSrc?: string;
    width?: number;
}

const IphoneMockup: React.FC<IphoneMockupProps> = ({ videoSrc, imageSrc, width = 350 }) => {
    const height = width * 2;

    return (
        <div
            style={{
                position: 'relative',
                width: `${width}px`,
                height: `${height}px`,
                userSelect: 'none',
            }}
        >
            {/* Контейнер екрану */}
            <div
                style={{
                    position: 'absolute',
                    top: '1.3%',
                    left: '3%',
                    width: '94.5%',
                    height: '97.5%',
                    overflow: 'hidden',
                    borderRadius: '40px',
                    backgroundColor: 'black',
                }}
            >
                {videoSrc ? (
                    <video
                        src={videoSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'fill',
                            display: 'block',
                        }}
                    />
                ) : imageSrc ? (
                    <img
                        src={imageSrc}
                        alt="Phone screen"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                        }}
                    />
                ) : null}
            </div>

            {/* Рамка телефону */}
            <Image
                src="/images/device-frame_4.png"
                alt="iPhone 15 Pro Frame"
                fill
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}
                draggable={false}
            />
        </div>
    );
};

export default IphoneMockup;