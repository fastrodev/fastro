import { PageProps } from "../../core/server/types.ts";

type Post = { title: string; url: string; date: string };

export default function Toc({ data }: PageProps<{ posts: Post[] }>) {
  {
    return (
      <ul class={`flex flex-col gap-y-3`}>
        {data.posts.map((v) => {
          return (
            <li>
              <a
                href={v.url}
                class={`flex items-baseline`}
              >
                {v.date && (
                  <div
                    class={`min-w-24 text-xs `}
                  >
                    <span
                      class={`dark:border-gray-400 dark: border-[1px] bg-slate-600 text-gray-100 p-[5px] rounded-sm`}
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
