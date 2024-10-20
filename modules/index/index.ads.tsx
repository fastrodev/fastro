import { useEffect, useState } from "preact/hooks";

const images = ["gesits.jpg", "gesits-2.jpg", "gesits-3.webp"];
const ADS_INTERVAL = 5000;
export default function Ads() {
    const [currentImage, setCurrentImage] = useState(images[0]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, ADS_INTERVAL);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        setCurrentImage(images[index]);
    }, [index]);

    return (
        <div class={`grow flex flex-col justify-end`}>
            <a href={"https://www.gesitsmotors.com"} target="_blank">
                <div class={`flex flex-col gap-3`}>
                    <span class={`text-xs font-extralight`}>
                        Ads from Gesits Motor
                    </span>
                    <img
                        alt="gesits ads"
                        src={currentImage}
                        class={`rounded-lg max-w-48`}
                    />
                </div>
            </a>
        </div>
    );
}
