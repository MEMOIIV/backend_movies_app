import cron from "node-cron";
import { RevokeTokenModel } from "../DB/models/Revoke.token.mode;.js";

cron.schedule("0 */2 * * *", async () => {
  try {
    const currentUnixTime = Math.floor(Date.now() / 1000); 
    const result = await RevokeTokenModel.deleteMany({
      expiresAccessDate: { $lt: currentUnixTime },
    });
    // console.log(`🧹 CronJob: Deleted ${result.deletedCount} expired tokens`);

  } catch (err) {
    // console.error("❌ CronJob Error:", err.message);
  }
});
