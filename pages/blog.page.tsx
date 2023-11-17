import React from "react";
import Footer from "$fastro/components/footer.tsx";
import Header from "$fastro/components/header.tsx";

type Post = {
  title: string;
  description: string;
  date: string;
  path: string;
};

function monthToThreeChar(monthNumber: number) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  if (monthNumber < 1 || monthNumber > 12) {
    throw new Error("Invalid month number");
  }
  return months[monthNumber - 1];
}

function BlogDate(props: { date: string }) {
  const [m, d, y] = props.date.split("/");
  const month = monthToThreeChar(Number(m));

  return (
    <div className="text-center border border-secondary">
      <div className="text-black bg-secondary">
        {month} {y}
      </div>
      <div className="fs-1 mt-0">{d}</div>
    </div>
  );
}

export default function Blog(
  props: {
    version: string;
    path: string;
    title: string;
    description: string;
    posts: Post[];
    avatar: string;
  },
) {
  return (
    <div className="d-flex flex-column h-100">
      <Header path={props.path} version={props.version} avatar={props.avatar} />
      <main className="flex-grow-1">
        <div className="d-flex flex-column pt-3">
          {props.posts
            ? props.posts.map((post, i) => {
              return (
                <a href={post.path} className="text-white pb-3" key={i}>
                  <div className="d-flex">
                    <div
                      className="fw-light text-white-50 me-3"
                      style={{ minWidth: 85, maxWidth: 85 }}
                    >
                      <BlogDate date={post.date} />
                    </div>
                    <div className="d-flex flex-column">
                      <h3 className="fw-bold">{post.title}</h3>
                      <div className="fw-light text-white-50">
                        {post.description}
                      </div>
                    </div>
                  </div>
                </a>
              );
            })
            : ""}
        </div>
      </main>
      <Footer version={props.version} path="" />
    </div>
  );
}
