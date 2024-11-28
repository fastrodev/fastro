import { PageProps } from "../../core/server/types.ts";

type Post = { title: string; url: string; date: string };

export default function Toc({ data }: PageProps<{ posts: Post[] }>) {
  {
    return (
      <ul class={`flex flex-col gap-y-1`}>
        {data.posts.map((v) => {
          return (
            <li>
              <a href={v.url} class={`flex space-x-1`}>
                {v.date && (
                  <div
                    class={`min-w-24 text-sm text-blue-400 items-center`}
                  >
                    <span
                      class={`border border-gray-400 p-[2px] rounded-md`}
                    >
                      {v.date}
                    </span>
                  </div>
                )} <span>{v.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
}
