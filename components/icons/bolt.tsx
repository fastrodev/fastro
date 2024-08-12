export default function BoltSvg(props: { height?: string; width?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height={props.height || "24px"}
            width={props.width || "24px"}
            fill="#e8eaed"
            viewBox="0 -960 960 960"
        >
            <path d="m320-80 40-280H160l360-520h80l-40 320h240L400-80h-80Z" />
        </svg>
    );
}
