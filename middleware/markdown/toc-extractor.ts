// deno-lint-ignore-file no-explicit-any

export function createTocExtractor() {
  let tocData: any = null;

  function extractToc() {
    return (tree: any) => {
      const indicesToRemove: number[] = [];
      let foundTocHeading = false;

      // Look for the TOC heading first, then find the list after it
      for (let i = 0; i < tree.children.length && !foundTocHeading; i++) {
        const node = tree.children[i];

        // Check if this is a TOC heading
        if (node.type === "heading") {
          const headingText = node.children?.map((child: any) =>
            child.value || child.children?.map((c: any) => c.value).join("") ||
            ""
          ).join("").toLowerCase();

          if (
            headingText.includes("contents") ||
            headingText.includes("table of contents")
          ) {
            indicesToRemove.push(i); // Remove the heading
            foundTocHeading = true;

            // Look for the next list node and remove it too
            for (let j = i + 1; j < tree.children.length; j++) {
              if (tree.children[j].type === "list") {
                tocData = convertTocToJson(tree.children[j]);
                indicesToRemove.push(j); // Remove the list
                break;
              }
            }
          }
        }
      }

      // Remove nodes in reverse order to maintain indices
      for (let i = indicesToRemove.length - 1; i >= 0; i--) {
        tree.children.splice(indicesToRemove[i], 1);
      }

      // Fallback: find any list with links (but don't remove if no heading found)
      if (!tocData && !foundTocHeading) {
        const findTocList = (node: any): any => {
          if (node.type === "list") {
            const hasLinks = node.children?.some((item: any) =>
              item.children?.some((child: any) => child.type === "link")
            );
            if (hasLinks) {
              return node;
            }
          }

          if (node.children) {
            for (const child of node.children) {
              const result = findTocList(child);
              if (result) return result;
            }
          }
          return null;
        };

        const rawTocList = findTocList(tree);
        if (rawTocList) {
          tocData = convertTocToJson(rawTocList);
        }
      }
    };
  }

  function convertTocToJson(
    listNode: any,
  ): Array<{ value: string; label: string }> {
    const extractFromListItem = (
      item: any,
    ): { value: string; label: string } | null => {
      // Find the link in this list item
      const findLink = (node: any): { url: string; text: string } | null => {
        if (node.type === "link") {
          const text = node.children?.map((child: any) =>
            child.value || ""
          ).join("") || "";
          return { url: node.url, text };
        }

        if (node.children) {
          for (const child of node.children) {
            const result = findLink(child);
            if (result) return result;
          }
        }
        return null;
      };

      const link = findLink(item);
      if (link) {
        return {
          value: link.url,
          label: link.text,
        };
      }
      return null;
    };

    const tocItems: Array<{ value: string; label: string }> = [];

    if (listNode.children) {
      for (const item of listNode.children) {
        const tocItem = extractFromListItem(item);
        if (tocItem) {
          tocItems.push(tocItem);
        }
      }
    }

    return tocItems;
  }

  return {
    plugin: extractToc,
    getTocData: () => tocData,
    resetTocData: () => {
      tocData = null;
    },
  };
}
