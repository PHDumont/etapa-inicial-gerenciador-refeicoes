import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhookHandler = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("webhook secret is not set");
  }

  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: "headers are missing" });
  }

  const payload = req.body.toString("utf8");
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("webhook verification failed:", err.message);
    return res.status(400).json({ error: "verification failed" });
  }

  const eventType = evt.type;
  const { id, email_addresses, first_name, last_name } = evt.data;

  try {
    if (eventType === "user.created" || eventType === "user.updated") {
      const email =
        email_addresses && email_addresses.length > 0
          ? email_addresses[0].email_address
          : "";
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      await User.findOneAndUpdate(
        { userId: id },
        { userId: id, email, name },
        { upsert: true, returnDocument: "after" },
      );
      console.log(
        `User ${eventType === "user.created" ? "created" : "updated"} via Webhook: ${name}`,
      );
    }

    if (eventType === "user.deleted") {
      await User.findOneAndDelete({ userId: id });
      console.log(`User deleted via Webhook: ${id}`);

      // Opcional no futuro: Deletar as refeições (Meal) desse usuário também para limpar o banco!
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in database processing:", error);
    return res.status(500).json({ error: "Erro interno" });
  }
};
