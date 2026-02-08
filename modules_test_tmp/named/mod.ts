export function named(_req, ctx, next) {
  ctx.__named = true;
  return next && next();
}
