import { handleSeatAvailability } from "./src/core.js";
import { sendToMail } from "./src/emailUtil.js";
import { toFromList } from "./src/toFromList.js";

import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const runScheduledJob = async () => {
    let trainData = await handleSeatAvailability(toFromList);
    await sendToMail(trainData, process.env.MAIL_TO);
}

runScheduledJob();
