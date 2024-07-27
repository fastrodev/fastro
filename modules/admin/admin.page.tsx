import { PageProps } from "@app/mod.ts";

export default function Admin({ data }: PageProps<
    {
        user: string;
        title: string;
        description: string;
    }
>) {
    return <>{data.title}</>;
}
