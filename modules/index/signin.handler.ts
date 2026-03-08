import { Context } from "../../core/types.ts";

export async function signinHandler(req: Request, _ctx: Context) {
  console.log("BE: Signin request received!");
  try {
    const json = await req.json();
    console.log("BE: Body received:", json);
    return Response.json({ message: `Welcome, ${json.identifier}!` });
  } catch (e) {
    console.error("BE: Error parsing JSON:", e);
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
