export default function Search(props: { placeholder?: string }) {
    return (
        <form class="relative grow">
            <input
                type="search"
                class="block p-2.5 w-full z-20 text-sm rounded-e-lg rounded-s-lg border-[1px] focus:ring-blue-500 bg-gray-700 border-s-gray-700 border-gray-600 placeholder-gray-400 text-white focus:border-blue-500"
                placeholder={props.placeholder || "Search"}
                required
            />
            <button
                type="submit"
                class="absolute top-0 end-0 h-full p-2.5 text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                <svg
                    class="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                >
                    <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                </svg>
                <span class="sr-only">Search</span>
            </button>
        </form>
    );
}
