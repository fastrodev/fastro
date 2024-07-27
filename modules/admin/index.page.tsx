import { PageProps } from "@app/mod.ts";

export default function Index({ data }: PageProps<
    {
        user: string;
        title: string;
        description: string;
    }
>) {
    return <>{data.title}</>;
}
