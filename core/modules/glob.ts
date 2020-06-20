const readDir = async (pattern: string, target: string) => {
  let files: string[] = [];
  const results = Deno.readDir(target);
  for await (const dirEntry of results) {
    let file = target + "/" + dirEntry.name;
    if (dirEntry.isDirectory) {
      files = files.concat(await readDir(pattern, file));
    } else {
      files.push(file);
    }
  }
  files = files.filter((file) => {
    return file.includes(pattern);
  });
  return files;
};

export const glob = async (pattern: string, target: string) => {
  const patterns = pattern.split(",");
  const filesPromise = patterns.map((p) => {
    return readDir(p, target);
  });
  let files = await Promise.all(filesPromise);
  let finalFiles: string[] = [];
  files.forEach((arr) => {
    arr.forEach((f) => {
      finalFiles.push(f);
    });
  });
  return finalFiles;
};
