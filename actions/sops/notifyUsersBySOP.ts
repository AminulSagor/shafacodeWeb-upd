import { getSOPById } from "./getSOPById";
import { getUsersByPosition } from "./getUsersByPosition";
import { sendSOPCreateMail } from "./sendSOPCreateMail";
import { sendSOPUpdateMail } from "./sendSOPUpdateMail";


function isNewByTimestamps(createdAt?: string, updatedAt?: string) {
  if (!createdAt || !updatedAt) return false;

  const c = new Date(createdAt).getTime();
  const u = new Date(updatedAt).getTime();
  if (Number.isNaN(c) || Number.isNaN(u)) return false;

  return Math.abs(u - c) <= 10_000;
}

export const notifyUsersBySOP = async (sopId: string) => {
  const sop = await getSOPById(sopId);

  if (!sop || !sop.category) return;

  type UserWithEmail = { id: string; username?: any; email?: string };
  const users: UserWithEmail[] = await getUsersByPosition(sop.category);

  const sopTitle = sop.procedureSteps || "SOP";
  const isNew = isNewByTimestamps(sop.createdAt, sop.updatedAt);

  for (const user of users) {
    const to = user.email;
    if (!to) continue;

    if (isNew) {
      await sendSOPCreateMail({
        to,
        category: sop.category,
        userName: user.username || "",
        sopTitle,
      });
    } else {
      await sendSOPUpdateMail({
        to,
        category: sop.category,
        userName: user.username || "",
        sopTitle,
      });
    }
  }
};
