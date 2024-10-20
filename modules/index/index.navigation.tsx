import Ads from "@app/modules/index/index.ads.tsx";
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
            </fieldset>
        </>
    );
}

export function Navigation() {
    return (
        <div
            class={`hidden w-3/12 min-w-[250px] lg:flex lg:flex-col space-y-3 pe-5 pb-5 pt-5`}
        >
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
            <div class={`grow flex flex-col text-xs font-thin`}>
                <Ads />
            </div>
        </div>
    );
}
