import { JSX } from "preact";

type Author = {
  name: string;
  avatar?: string;
  bio?: string;
  url?: string;
};

export default function AuthorCard(
  { author }: { author: Author },
): JSX.Element {
  return (
    <div class="bg-gray-800/60 border border-gray-700 rounded-xl shadow-md p-5 flex flex-col items-center text-center">
      <div class="w-16 h-16 mb-3 flex items-center justify-center">
        <img
          src={author.avatar || "/default-avatar.png"}
          alt={author.name}
          class="w-16 h-16 rounded-full border-2 border-gray-700 object-cover"
          loading="eager"
        />
      </div>
      <div class="font-semibold text-gray-100 text-base">
        {author.name}
      </div>
      {author.bio && (
        <div class="text-xs sm:text-sm text-gray-400 mt-1">
          {author.bio}
        </div>
      )}
      {author.url && (
        <a
          href={author.url}
          class="mt-2 text-blue-400 text-xs hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Profile
        </a>
      )}
    </div>
  );
}
