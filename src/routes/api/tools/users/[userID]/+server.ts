import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getToolsByUserId } from "$lib/server/cosmos";

export const GET: RequestHandler = async ({ params }) => {
  const userID = params.userID;

  if (!userID) {
    return json({ error: "Missing userID parameter" }, { status: 400 });
  }

  try {
    const userTools = await getToolsByUserId(userID);

    return json({
      success: true,
      tools: userTools,
      count: userTools.length,
    });
  } catch (error) {
    console.error("Error fetching user tools:", error);
    return json({ error: "Failed to fetch user tools" }, { status: 500 });
  }
};
