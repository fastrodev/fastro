export default function def_mw(_req, ctx, next) {
  ctx.__def = true;
  return next && next();
}
