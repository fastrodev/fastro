import { PageProps } from "@app/mod.ts";
import Header from "@app/components/header.tsx";
import { Footer } from "@app/components/footer.tsx";
import Button from "@app/components/button.tsx";
import Search from "@app/components/search.tsx";

function UserAccountSvg() {
    return (
        <svg
            class="text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            fill="none"
            viewBox="0 0 24 24"
        >
            <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
        </svg>
    );
}

function UserGroupsSvg() {
    return (
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
                stroke-linecap="round"
                stroke-width="2"
                d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
            />
        </svg>
    );
}

function Info() {
    return (
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
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
        </svg>
    );
}

function UserItem(
    props: { username: string; groupname?: string; group?: boolean },
) {
    return (
        <div
            class={`flex justify-between border-b-[1px] border-b-gray-700 pb-3 last:border-b-[0px]`}
        >
            <div class={`inline-flex items-center space-x-1`}>
                {props.group && <UserGroupsSvg />}
                {!props.group && <UserAccountSvg />}
                <div class={`flex flex-col`}>
                    <span>{props.username}</span>
                    {props.groupname && (
                        <span class={`text-xs text-gray-500`}>
                            {props.groupname}
                        </span>
                    )}
                </div>
            </div>
            <div class={`flex items-center`}>
                <Info />
            </div>
        </div>
    );
}

export default function Admin({ data }: PageProps<
    {
        user: string;
        title: string;
        description: string;
    }
>) {
    console.log("data ==>", data);
    return (
        <div class={` bg-gray-950`}>
            <Header
                isLogin={false}
                avatar_url=""
                html_url=""
                title="Users and Groups"
                previous_url="/"
            />
            <main
                class={`container flex flex-col space-y-6 grow max-w-4xl mx-auto bg-gray-900 p-6 rounded-xl text-white text-sm`}
            >
                {/* user */}
                <div class={`flex flex-col space-y-6`}>
                    <div
                        class={`flex justify-between items-center space-x-3`}
                    >
                        <Button>Add User</Button>
                        <Search placeholder="Search user" />
                    </div>
                    <div
                        class={`flex flex-col space-y-6 border-[1px] border-gray-700 p-3 rounded-xl`}
                    >
                        <div class={`flex flex-col space-y-3`}>
                            <UserItem username="Admin" groupname="Operations" />
                            <UserItem username="John" groupname="Operations" />
                            <UserItem
                                username="Clark"
                                groupname="Human Resources"
                            />
                            <UserItem
                                username="Ane"
                                groupname="Human Resources"
                            />
                            <UserItem
                                username="April"
                                groupname="Information Technology"
                            />
                            <UserItem
                                username="George"
                                groupname="Information Technology"
                            />
                        </div>
                    </div>
                </div>

                {/* groups */}
                <div class={`flex flex-col space-y-6`}>
                    <div
                        class={`flex justify-between items-center space-x-3`}
                    >
                        <Button>Add Group</Button>
                        <Search placeholder="Search groups" />
                    </div>
                    <div
                        class={`flex flex-col space-y-3 border-[1px] border-gray-700 p-3 rounded-xl`}
                    >
                        <div class={`flex flex-col space-y-3`}>
                            <UserItem
                                username="Customer Service"
                                group={true}
                            />
                            <UserItem username="Finance" group={true} />
                            <UserItem username="Human Resources" group={true} />
                            <UserItem
                                username="Information Technology"
                                group={true}
                            />
                            <UserItem username="Marketing" group={true} />
                            <UserItem username="Operations" group={true} />
                            <UserItem username="Sales" group={true} />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
