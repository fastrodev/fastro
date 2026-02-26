// Minimal manifest used for tests when the generated manifest is not present.
// The real build step generates a richer manifest; tests expect some
// module entries to exercise registration paths, so provide a small set.

export const index = {
  default: () => {
    /* placeholder middleware */
    return () => undefined;
  },
};

export const a = {
  a: () => {
    return () => undefined;
  },
};

export const b = {
  b: () => {
    return () => undefined;
  },
};

export const profile = {
  profile: () => {
    return () => undefined;
  },
};
