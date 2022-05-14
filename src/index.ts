import axios from "axios";
import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import moment from "moment";

dotenv.config();
const ETHERMINE_API = "https://api.ethermine.org";
const ETH_WALLET_ADDREESS = "23A24646fEF17a3E43fAbdec6526483452c2FF2D";
const ONE_ETH_IN_WEI = 1000000000000000000;
const TELEGRAM_BOT = new Telegraf(process.env.TELEGRAM_BOT_TOKEN ?? "");
const TELEGRAM_CHAT_ID = -632117764;

console.log("Bot started");
TELEGRAM_BOT.telegram.sendMessage(TELEGRAM_CHAT_ID, `Bot started`);

let downAlertSended = false;

setInterval(async () => {
  console.log("Checking workers and payouts");
  Promise.all([
    axios.get(`${ETHERMINE_API}/miner/${ETH_WALLET_ADDREESS}/dashboard`),
    axios.get(`${ETHERMINE_API}/miner/${ETH_WALLET_ADDREESS}/workers`),
    axios.get(`${ETHERMINE_API}/miner/${ETH_WALLET_ADDREESS}/payouts`),
  ]).then(([dashboardResp, workersResp, payoutsResp]) => {
    const activeWorkers =
      dashboardResp.data.data.currentStatistics.activeWorkers;

    if (activeWorkers < workersResp.data.data.length && !downAlertSended) {
      TELEGRAM_BOT.telegram.sendMessage(TELEGRAM_CHAT_ID, "Rig is down!");
      TELEGRAM_BOT.telegram.sendAnimation(
        TELEGRAM_CHAT_ID,
        "https://media.giphy.com/media/eImrJKnOmuBDmqXNUj/giphy.gif"
      );
      downAlertSended = true;
    } else if (
      activeWorkers === workersResp.data.data.length &&
      downAlertSended
    ) {
      TELEGRAM_BOT.telegram.sendMessage(TELEGRAM_CHAT_ID, "Rig is up!");
      TELEGRAM_BOT.telegram.sendAnimation(
        TELEGRAM_CHAT_ID,
        "https://media.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif"
      );
      downAlertSended = false;
    }

    const nowDate = moment(new Date(Date.now()));
    const lastPayoutDate = moment(
      new Date(payoutsResp.data.data[0].paidOn * 1000)
    );
    if (nowDate.diff(lastPayoutDate, "minutes") <= 3) {
      console.log("last payout less than 3 minutes ago");
      TELEGRAM_BOT.telegram.sendMessage(
        TELEGRAM_CHAT_ID,
        "Last payout less than 3 minutes ago (" +
          payoutsResp.data.data[0].amount / ONE_ETH_IN_WEI +
          "ETH)"
      );
      TELEGRAM_BOT.telegram.sendAnimation(
        TELEGRAM_CHAT_ID,
        "https://media.giphy.com/media/5e22CwMaD4oMSk3Qpc/giphy.gif"
      );
    }
  });
}, 180000);
