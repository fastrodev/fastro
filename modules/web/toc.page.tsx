import { PageProps } from "$fastro/http/server/types.ts";

type Post = { title: string; url: string; date: string };

export default function Toc({ data }: PageProps<{ posts: Post[] }>) {
  {
    return (
      <ul class={`flex flex-col gap-y-1`}>
        {data.posts.map((v) => {
          return (
            <a href={v.url}>
              <li class={`flex`}>
                {v.date && (
                  <span class={`w-24 text-justify text-blue-600`}>
                    {v.date}
                  </span>
                )} <span>{v.title}</span>
              </li>
            </a>
          );
        })}
      </ul>
    );
  }
}
