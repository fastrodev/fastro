import { useEffect, useState } from "preact/hooks";

function Expiration() {
    const toggleDropdown = () => {
        const dropdown = document.getElementById("dropdownMenu");
        if (dropdown) {
            dropdown.classList.toggle("hidden");
        }
    };

    return (
        <div class="relative inline-block text-left">
            <div>
                <button
                    onClick={toggleDropdown}
                    class="w-full  text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex justify-between items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    <span>Expiration</span>
                    <svg
                        class="-mr-1 ml-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06 0L10 10.293l3.71-3.08a.75.75 0 111.06 1.06l-4.25 3.5a.75.75 0 01-.92 0l-4.25-3.5a.75.75 0 010-1.06z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </button>
            </div>

            <div
                id="dropdownMenu"
                class="hidden absolute right-0 z-10 mt-2 w-full bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
            >
                <div
                    class="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="dropdownMenuButton"
                >
                    <div class="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                        <div class="flex items-center h-5">
                            <input
                                id="helper-radio-4"
                                name="helper-radio"
                                type="radio"
                                value=""
                                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            />
                        </div>
                        <div class="ms-2 text-sm">
                            <label
                                for="helper-radio-4"
                                class="font-medium text-gray-900 dark:text-gray-300"
                            >
                                <div>1 Day</div>
                            </label>
                        </div>
                    </div>
                    <div class="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                        <div class="flex items-center h-5">
                            <input
                                id="helper-radio-5"
                                name="helper-radio"
                                type="radio"
                                value=""
                                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            />
                        </div>
                        <div class="ms-2 text-sm">
                            <label
                                for="helper-radio-5"
                                class="font-medium text-gray-900 dark:text-gray-300"
                            >
                                <div>1 Week</div>
                            </label>
                        </div>
                    </div>
                    <div class="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                        <div class="flex items-center h-5">
                            <input
                                id="helper-radio-6"
                                name="helper-radio"
                                type="radio"
                                value=""
                                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            />
                        </div>
                        <div class="ms-2 text-sm">
                            <label
                                for="helper-radio-6"
                                class="font-medium text-gray-900 dark:text-gray-300"
                            >
                                <div>1 Month</div>
                            </label>
                        </div>
                    </div>

                    <div class="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                        <div class="flex items-center h-5">
                            <input
                                id="helper-radio-6"
                                name="helper-radio"
                                type="radio"
                                value=""
                                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            />
                        </div>
                        <div class="ms-2 text-sm">
                            <label
                                for="helper-radio-6"
                                class="font-medium text-gray-900 dark:text-gray-300"
                            >
                                <div>1 Year</div>
                            </label>
                        </div>
                    </div>

                    <div class="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                        <div class="flex items-center h-5">
                            <input
                                id="helper-radio-7"
                                name="helper-radio"
                                type="radio"
                                value=""
                                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            />
                        </div>
                        <div class="ms-2 text-sm">
                            <label
                                for="helper-radio-7"
                                class="font-medium text-gray-900 dark:text-gray-300"
                            >
                                <div>Custom</div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Fieldset() {
    return (
        <>
            <fieldset
                class={`grid grid-cols-2 gap-2 border border-gray-600 rounded-lg p-2 text-sm bg-slate-700`}
            >
                <div class="flex items-center">
                    <input
                        id="country-option-1"
                        type="radio"
                        name="types"
                        value="text"
                        class="text-sm w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                        checked
                    />
                    <label
                        for="country-option-1"
                        class="block ms-2 font-medium text-gray-900 dark:text-gray-300"
                    >
                        Message
                    </label>
                </div>
                <div class="flex items-center">
                    <input
                        id="country-option-4"
                        type="radio"
                        name="types"
                        value="template"
                        class="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus-ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                        disabled
                    />
                    <label
                        for="country-option-4"
                        class="block ms-2 font-medium text-gray-900 dark:text-gray-300"
                    >
                        Template
                    </label>
                </div>
            </fieldset>
        </>
    );
}

function TemplateCollection(
    props: { title: string; checked?: boolean; disabled?: boolean },
) {
    return (
        <li
            class={`inline-flex justify-between  items-center  gap-1`}
        >
            <span>{props.title}</span>
            <input
                id="helper-radio-4"
                name="helper-radio"
                type="radio"
                value=""
                checked={props.checked}
                disabled={props.disabled}
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            />
        </li>
    );
}

function Menu(props: { avatar_url: string; username: string }) {
    return (
        <div class={`w-2/12 flex flex-col gap-5 pb-5`}>
            <div class={`flex gap-2 items-center`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-bolt"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11" />
                </svg>

                <span>Home</span>
            </div>
            <div class={`flex gap-2 items-center`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-compass"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M8 16l2 -6l6 -2l-2 6l-6 2" />
                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                    <path d="M12 3l0 2" />
                    <path d="M12 19l0 2" />
                    <path d="M3 12l2 0" />
                    <path d="M19 12l2 0" />
                </svg>

                <span>Discover</span>
            </div>
            <div class={`flex gap-2 items-center`}>
                <svg
                    class="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill-rule="evenodd"
                        d="M4.857 3A1.857 1.857 0 0 0 3 4.857v4.286C3 10.169 3.831 11 4.857 11h4.286A1.857 1.857 0 0 0 11 9.143V4.857A1.857 1.857 0 0 0 9.143 3H4.857Zm10 0A1.857 1.857 0 0 0 13 4.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 9.143V4.857A1.857 1.857 0 0 0 19.143 3h-4.286Zm-10 10A1.857 1.857 0 0 0 3 14.857v4.286C3 20.169 3.831 21 4.857 21h4.286A1.857 1.857 0 0 0 11 19.143v-4.286A1.857 1.857 0 0 0 9.143 13H4.857Zm10 0A1.857 1.857 0 0 0 13 14.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 19.143v-4.286A1.857 1.857 0 0 0 19.143 13h-4.286Z"
                        clip-rule="evenodd"
                    />
                </svg>

                <span>Template Collections</span>
            </div>
            <div class={`grow pl-3`}>
                <ul
                    class={`flex flex-col text-xs font-thin border-l pl-3 gap-y-3`}
                >
                    <TemplateCollection
                        title="Job Template by Andrea"
                        checked={true}
                    />
                    <TemplateCollection
                        title="Ads Template by Andrea"
                        disabled={true}
                    />
                    <TemplateCollection
                        title="Question Template by Andrea"
                        disabled={true}
                    />
                    <TemplateCollection
                        title="Slide Template by Andrea"
                        disabled={true}
                    />
                    <TemplateCollection
                        title="Polling Template by Andrea"
                        disabled={true}
                    />
                </ul>
            </div>
            <div class={`flex flex-col gap-y-2`}>
                <div class={`text-base`}>Try Pro</div>
                <div class={`text-sm font-thin`}>
                    Upgrade for Elevating Your Template Creation and
                    Monetization Efforts
                </div>
                <button
                    type="button"
                    class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 inline-flex justify-center items-center gap-x-1"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-up-right"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M17 7l-10 10" />
                        <path d="M8 7l9 0l0 9" />
                    </svg>
                    <span>Learn more</span>
                </button>
            </div>
            <div class={`flex justify-between gap-2 items-center`}>
                <div class={`inline-flex gap-2 items-center`}>
                    <img
                        loading={"lazy"}
                        src={props.avatar_url}
                        width={24}
                        class={`rounded-full`}
                    />

                    <span>{props.username}</span>
                </div>

                <svg
                    class="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke="currentColor"
                        stroke-linecap="square"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                </svg>
            </div>
            <a href={"/signout"}>
                <div class={`inline-flex gap-2 items-center`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="icon icon-tabler icons-tabler-outline icon-tabler-logout"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                        <path d="M9 12h12l-3 -3" />
                        <path d="M18 15l3 -3" />
                    </svg>

                    <span>Sign out</span>
                </div>
            </a>
        </div>
    );
}

const images = ["gesits.jpg", "gesits-2.jpg", "gesits-3.webp"];
const ADS_INTERVAL = 5000;
function Ads() {
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
                        class={`rounded-lg`}
                    />
                </div>
            </a>
        </div>
    );
}

function Navigation() {
    return (
        <div class={`w-2/12 flex flex-col space-y-3`}>
            <Fieldset />
            <input
                type="text"
                id="small-input"
                disabled
                placeholder="Post Title"
                class="block w-full p-2 text-gray-900 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <input
                type="text"
                id="small-input"
                disabled
                placeholder="Short Description"
                class="block w-full p-2 text-gray-900 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <input
                type="text"
                id="small-input"
                disabled
                placeholder="SEO Image"
                class="block w-full p-2 text-gray-900 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <input
                type="text"
                id="small-input"
                disabled
                placeholder="Tags"
                class="block w-full p-2 text-gray-900 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <fieldset
                class={`grid grid-cols-2 gap-2 border border-gray-600 rounded-lg p-2 text-sm bg-slate-700`}
            >
                <div class="flex items-center">
                    <input
                        id="public-options"
                        type="radio"
                        name="access"
                        value="public"
                        class="text-sm w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                        checked
                    />
                    <label
                        for="public-options"
                        class="block ms-2 font-medium text-gray-900 dark:text-gray-300"
                    >
                        Public
                    </label>
                </div>
                <div class="flex items-center">
                    <input
                        id="public-options"
                        type="radio"
                        name="access"
                        value="secret"
                        class="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus-ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                        disabled
                    />
                    <label
                        for="public-options"
                        class="block ms-2 font-medium text-gray-900 dark:text-gray-300"
                    >
                        Secret
                    </label>
                </div>
            </fieldset>
            <Expiration />
            <div class={`grow flex flex-col text-xs font-thin py-5`}>
                <Ads />
            </div>
        </div>
    );
}

function Message(props: { msg: string; time: string }) {
    return (
        <li
            class={`rounded-lg inline-flex gap-2`}
        >
            <div>
                <img
                    src="https://avatars.githubusercontent.com/u/10122431?v=4"
                    width={32}
                    class={`rounded-full`}
                />
            </div>
            <div
                class={`bg-gray-900 ps-3 pt-2 pe-3 pb-2 border border-gray-700 rounded-lg flex flex-col gap-1`}
            >
                <div
                    class={`flex items-center justify-between gap-3 text-gray-500`}
                >
                    <span class={"grow text-sm"}>ynwd</span>
                    <svg
                        class="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1"
                            d="m19 9-7 7-7-7"
                        />
                    </svg>
                </div>
                <span>
                    {props.msg}
                </span>
                <span
                    class={`text-xs font-extralight text-gray-500 text-right`}
                >
                    {props.time}
                </span>
            </div>
        </li>
    );
}

function Main() {
    return (
        <div class="w-8/12 grow flex flex-col bg-gray-950 border-t border-l border-r border-gray-700 rounded-t-xl">
            <ul class={`grow px-4 text-sm flex flex-col justify-end gap-y-3`}>
                <Message msg="Hello world" time="10:44 AM" />
                <Message
                    msg="What is your name? Where is your address? How old are you?"
                    time="10:44 AM"
                />
            </ul>
            <div class="relative bottom-0 left-1/2 transform -translate-x-1/2 p-4 shadow-md">
                <div class="w-full">
                    <div class="relative">
                        <input
                            type="search"
                            id="search"
                            class="block w-full p-4 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Text your message here"
                            required
                        />
                        <button
                            type="submit"
                            class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Launchpad(
    props: { avatar_url: string; username: string },
) {
    return (
        <div
            class={`h-screen container flex max-w-screen-2xl bg-gray-900 space-x-5 mx-auto pt-5 px-5`}
        >
            <Menu
                avatar_url={props.avatar_url}
                username={props.username}
            />
            <Main />
            <Navigation />
        </div>
    );
}

// function StackSvg() {
//     return (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="36"
//             height="36"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             stroke-width="2"
//             stroke-linecap="round"
//             stroke-linejoin="round"
//             class="icon icon-tabler icons-tabler-outline icon-tabler-stack-front"
//         >
//             <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//             <path d="M12 4l-8 4l8 4l8 -4l-8 -4" fill="currentColor" />
//             <path d="M8 14l-4 2l8 4l8 -4l-4 -2" />
//             <path d="M8 10l-4 2l8 4l8 -4l-4 -2" />
//         </svg>
//     );
// }

// function LogisticSvg() {
//     return (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="36"
//             height="36"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             stroke-width="2"
//             stroke-linecap="round"
//             stroke-linejoin="round"
//             class="icon icon-tabler icons-tabler-outline icon-tabler-tir"
//         >
//             <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//             <path d="M5 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
//             <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
//             <path d="M7 18h8m4 0h2v-6a5 7 0 0 0 -5 -7h-1l1.5 7h4.5" />
//             <path d="M12 18v-13h3" />
//             <path d="M3 17l0 -5l9 0" />
//         </svg>
//     );
// }

// function NoteSvg() {
//     return (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="36"
//             height="36"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             stroke-width="2"
//             stroke-linecap="round"
//             stroke-linejoin="round"
//             class="icon icon-tabler icons-tabler-outline icon-tabler-notes"
//         >
//             <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//             <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
//             <path d="M9 7l6 0" />
//             <path d="M9 11l6 0" />
//             <path d="M9 15l4 0" />
//         </svg>
//     );
// }

// function FormSvg() {
//     return (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="36"
//             height="36"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             stroke-width="2"
//             stroke-linecap="round"
//             stroke-linejoin="round"
//             class="icon icon-tabler icons-tabler-outline icon-tabler-forms"
//         >
//             <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//             <path d="M12 3a3 3 0 0 0 -3 3v12a3 3 0 0 0 3 3" />
//             <path d="M6 3a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3" />
//             <path d="M13 7h7a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-7" />
//             <path d="M5 7h-1a1 1 0 0 0 -1 1v8a1 1 0 0 0 1 1h1" />
//             <path d="M17 12h.01" />
//             <path d="M13 12h.01" />
//         </svg>
//     );
// }

// function HtmlSvg() {
//     return (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="36"
//             height="36"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             stroke-width="2"
//             stroke-linecap="round"
//             stroke-linejoin="round"
//             class="icon icon-tabler icons-tabler-outline icon-tabler-html"
//         >
//             <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//             <path d="M13 16v-8l2 5l2 -5v8" />
//             <path d="M1 16v-8" />
//             <path d="M5 8v8" />
//             <path d="M1 12h4" />
//             <path d="M7 8h4" />
//             <path d="M9 8v8" />
//             <path d="M20 8v8h3" />
//         </svg>
//     );
// }

// function SurveySvg() {
//     return (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="36"
//             height="36"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             stroke-width="2"
//             stroke-linecap="round"
//             stroke-linejoin="round"
//             class="icon icon-tabler icons-tabler-outline icon-tabler-checkbox"
//         >
//             <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//             <path d="M9 11l3 3l8 -8" />
//             <path d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9" />
//         </svg>
//     );
// }

// function BlogSvg() {
//     return (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="36"
//             height="36"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             stroke-width="2"
//             stroke-linecap="round"
//             stroke-linejoin="round"
//             class="icon icon-tabler icons-tabler-outline icon-tabler-network"
//         >
//             <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//             <path d="M6 9a6 6 0 1 0 12 0a6 6 0 0 0 -12 0" />
//             <path d="M12 3c1.333 .333 2 2.333 2 6s-.667 5.667 -2 6" />
//             <path d="M12 3c-1.333 .333 -2 2.333 -2 6s.667 5.667 2 6" />
//             <path d="M6 9h12" />
//             <path d="M3 20h7" />
//             <path d="M14 20h7" />
//             <path d="M10 20a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
//             <path d="M12 15v3" />
//         </svg>
//     );
// }

// function SocialSvg() {
//     return (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="36"
//             height="36"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             stroke-width="2"
//             stroke-linecap="round"
//             stroke-linejoin="round"
//             class="icon icon-tabler icons-tabler-outline icon-tabler-social"
//         >
//             <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//             <path d="M12 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
//             <path d="M5 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
//             <path d="M19 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
//             <path d="M12 14m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
//             <path d="M12 7l0 4" />
//             <path d="M6.7 17.8l2.8 -2" />
//             <path d="M17.3 17.8l-2.8 -2" />
//         </svg>
//     );
// }

// function StoreSvg() {
//     return (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="36"
//             height="36"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             stroke-width="2"
//             stroke-linecap="round"
//             stroke-linejoin="round"
//             class="icon icon-tabler icons-tabler-outline icon-tabler-building-store"
//         >
//             <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//             <path d="M3 21l18 0" />
//             <path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4" />
//             <path d="M5 21l0 -10.15" />
//             <path d="M19 21l0 -10.15" />
//             <path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" />
//         </svg>
//     );
// }

// function LoyalSvg() {
//     return (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="36"
//             height="36"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             stroke-width="2"
//             stroke-linecap="round"
//             stroke-linejoin="round"
//             class="icon icon-tabler icons-tabler-outline icon-tabler-reload"
//         >
//             <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//             <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
//             <path d="M20 4v5h-5" />
//         </svg>
//     );
// }

// function AttendanceSvg() {
//     return (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="36"
//             height="36"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             stroke-width="2"
//             stroke-linecap="round"
//             stroke-linejoin="round"
//             class="icon icon-tabler icons-tabler-outline icon-tabler-report"
//         >
//             <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//             <path d="M8 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h5.697" />
//             <path d="M18 14v4h4" />
//             <path d="M18 11v-4a2 2 0 0 0 -2 -2h-2" />
//             <path d="M8 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
//             <path d="M18 18m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
//             <path d="M8 11h4" />
//             <path d="M8 15h3" />
//         </svg>
//     );
// }

// function PurchaseSvg() {
//     return (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="36"
//             height="36"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             stroke-width="2"
//             stroke-linecap="round"
//             stroke-linejoin="round"
//             class="icon icon-tabler icons-tabler-outline icon-tabler-package"
//         >
//             <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//             <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" />
//             <path d="M12 12l8 -4.5" />
//             <path d="M12 12l0 9" />
//             <path d="M12 12l-8 -4.5" />
//             <path d="M16 5.25l-8 4.5" />
//         </svg>
//     );
// }

// import Search from "@app/components/search.tsx";
// import ProjectBox from "@app/components/project-box.tsx";
// import AdminSvg from "@app/components/icons/admin-svg.tsx";
// import AdsSvg from "@app/components/icons/ads-svg.tsx";
// import SalesSvg from "@app/components/icons/sales-svg.tsx";
// import WareHouseSvg from "@app/components/icons/warehouse-svg.tsx";

// function Board() {
//     return (
//         <div
//             class={`flex flex-col p-6 bg-gray-900 rounded-2xl gap-y-6`}
//         >
//             <Search placeholder="Search module" />
//             <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
//                 <ProjectBox active={true} url="/mod/admin">
//                     <AdminSvg />
//                     <p>Admin</p>
//                 </ProjectBox>
//                 <ProjectBox>
//                     <AdsSvg />
//                     <p>Advertising</p>
//                 </ProjectBox>
//                 <ProjectBox>
//                     <AttendanceSvg />
//                     <p>Attendance</p>
//                 </ProjectBox>
//                 <ProjectBox>
//                     <BlogSvg />
//                     <p>Blog</p>
//                 </ProjectBox>
//                 <ProjectBox>
//                     <HtmlSvg />
//                     <p>Landing Page</p>
//                 </ProjectBox>
//                 <ProjectBox>
//                     <LogisticSvg />
//                     <p>Logistic</p>
//                 </ProjectBox>
//                 <ProjectBox>
//                     <LoyalSvg />
//                     <p>Loyalty</p>
//                 </ProjectBox>
//                 <ProjectBox>
//                     <NoteSvg />
//                     <p>Medical Record</p>
//                 </ProjectBox>
//                 <ProjectBox>
//                     <PurchaseSvg />
//                     <p>Purchasing</p>
//                 </ProjectBox>
//                 <ProjectBox>
//                     <FormSvg />
//                     <p>Registration</p>
//                 </ProjectBox>
//                 <ProjectBox>
//                     <SalesSvg />
//                     <p>Sales</p>
//                 </ProjectBox>
//                 <ProjectBox>
//                     <SocialSvg />
//                     <p>Social Media</p>
//                 </ProjectBox>
//                 <ProjectBox>
//                     <StoreSvg />
//                     <p>Store</p>
//                 </ProjectBox>
//                 <ProjectBox>
//                     <SurveySvg />
//                     <p>Survey</p>
//                 </ProjectBox>
//                 <ProjectBox>
//                     <WareHouseSvg />
//                     <p>Warehouse</p>
//                 </ProjectBox>
//                 <ProjectBox>
//                     <StackSvg />
//                     <p>Visitor queue</p>
//                 </ProjectBox>
//             </div>
//         </div>
//     );
// }
