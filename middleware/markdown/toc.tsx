// deno-lint-ignore-file no-explicit-any
import { JSX } from "preact/jsx-runtime";

export function tocToJSX(tocNode: any): JSX.Element | null {
  if (!tocNode) return null;

  const renderListItem = (item: any, index: number): JSX.Element => {
    const content: JSX.Element[] = [];

    if (item.children) {
      for (const child of item.children) {
        if (child.type === "paragraph") {
          // Handle paragraph content (usually contains links)
          const paragraphContent = child.children?.map(
            (node: any, nodeIndex: number) => {
              if (node.type === "link") {
                return (
                  <a
                    key={nodeIndex}
                    href={node.url}
                    title={node.title || undefined}
                  >
                    {node.children?.map((linkChild: any) => linkChild.value)
                      .join("")}
                  </a>
                );
              } else if (node.type === "text") {
                return node.value;
              }
              return null;
            },
          ).filter(Boolean); // Remove null values

          if (paragraphContent.length > 0) {
            content.push(
              <span key={`paragraph-${index}`}>{paragraphContent}</span>,
            );
          }
        } else if (child.type === "list") {
          // Handle nested lists
          content.push(<div key={`list-${index}`}>{renderList(child)}</div>);
        }
      }
    }

    return <li key={index}>{content}</li>;
  };

  const renderList = (listNode: any): JSX.Element => {
    const listItems = listNode.children?.map(renderListItem);
    return listNode.ordered ? <ol>{listItems}</ol> : <ul>{listItems}</ul>;
  };

  return renderList(tocNode);
}
