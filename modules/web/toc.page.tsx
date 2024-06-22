import { PageProps } from "$fastro/http/server/types.ts";

type Post = { title: string; url: string; date: string };

export default function Toc({ data }: PageProps<{ posts: Post[] }>) {
  {
    return (
      <ul class={`flex flex-col gap-y-1`}>
        {data.posts.map((v) => {
          return (
            <a href={v.url}>
              <li>{v.date && `${v.date} ~ `}{v.title}</li>
            </a>
          );
        })}
      </ul>
    );
  }
}
