export default function test_mw(_req, ctx, next) {
  ctx.__test = true;
  return next && next();
}
