export function logger(req: Request, ctx: any, next: any) {
  const start = Date.now();

  // Attach data to the shared context state
  ctx.state.startTime = start;

  console.log(
    `[${new Date().toISOString()}] ${req.method} ${ctx.url.pathname}`,
  );

  return next();
}
