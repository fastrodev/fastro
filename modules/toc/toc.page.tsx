import { PageProps } from "../../core/server/types.ts";

type Post = { title: string; url: string; date: string };

export default function Toc({ data }: PageProps<{ posts: Post[] }>) {
  {
    return (
      <ul class={`flex flex-col gap-y-1`}>
        {data.posts.map((v) => {
          return (
            <li>
              <a href={v.url} class={`flex space-x-2`}>
                {v.date && (
                  <span
                    class={`w-24 text-center text-blue-400 border border-gray-400 p-[1px] rounded-md`}
                  >
                    {v.date}
                  </span>
                )} <span>{v.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
}
