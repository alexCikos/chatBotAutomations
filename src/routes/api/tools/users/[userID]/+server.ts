import { JSONFile } from "lowdb/node";
import { Low } from "lowdb";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { ToolData } from "$lib/types";

// Load tools.json database
const getToolDb = async () => {
  const adapter = new JSONFile<ToolData>("tools.json");
  const db = new Low(adapter, { tools: [] });
  await db.read();
  db.data ||= { tools: [] };
  return db;
};

export const GET: RequestHandler = async ({ params }) => {
  const userID = params.userID;

  if (!userID) {
    return json({ error: "Missing userID parameter" }, { status: 400 });
  }

  try {
    const toolDb = await getToolDb();

    // Filter tools for the specific user
    const userTools = toolDb.data.tools.filter(
      (tool) => tool.userId === userID
    );

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