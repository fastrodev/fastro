import { PageProps } from "@app/mod.ts";
import Header from "@app/components/header.tsx";
import { Footer } from "@app/components/footer.tsx";
import Button from "@app/components/button.tsx";
import Search from "@app/components/search.tsx";
import UserAccountSvg from "@app/components/icons/user-account-svg.tsx";
import UserGroupsSvg from "@app/components/icons/user-group-svg.tsx";
import Info from "@app/components/icons/info-svg.tsx";

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
