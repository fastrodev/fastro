import React from "react";
import Footer from "../components/footer.tsx";
import Header from "../components/header.tsx";

type Post = {
  title: string;
  description: string;
  date: string;
  path: string;
};

export default function Blog(
  props: {
    version: string;
    path: string;
    title: string;
    description: string;
    posts: Post[];
  },
) {
  return (
    <div className="d-flex flex-column h-100">
      <Header path={props.path} />
      <main className="flex-grow-1">
        <div className="d-flex flex-column pt-3">
          {props.posts
            ? props.posts.map((post) => {
              return (
                <a href={post.path} className="text-white pb-3">
                  <div className="d-flex">
                    <div
                      className="fw-light text-white-50 me-3"
                      style={{ minWidth: 110 }}
                    >
                      {post.date}
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
