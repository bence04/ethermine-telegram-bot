import axios from "axios";
import dotenv from "dotenv";

const ETHERMINE_API = "https://api.ethermine.org";
const ETH_WALLET_ADDREESS = "23A24646fEF17a3E43fAbdec6526483452c2FF2D";
const ONE_ETH_IN_WEI = 1000000000000000000;
dotenv.config();

console.log("Hello World");

/* axios
  .get(`${ETHERMINE_API}/miner/${ETH_WALLET_ADDREESS}/workers`)
  .then((res) => {
    console.log(res.data.data);
  })
  .catch((error) => {
    console.error(error);
  });

axios
  .get(`${ETHERMINE_API}/miner/${ETH_WALLET_ADDREESS}/dashboard`)
  .then((res) => {
    console.log(res.data.data.currentStatistics);
  })
  .catch((error) => {
    console.error(error);
  }); */

  console.log(process.env.TELEGRAM_BOT_TOKEN);

Promise.all([
  axios.get(`${ETHERMINE_API}/miner/${ETH_WALLET_ADDREESS}/dashboard`),
  axios.get(`${ETHERMINE_API}/miner/${ETH_WALLET_ADDREESS}/workers`),
  axios.get(`${ETHERMINE_API}/miner/${ETH_WALLET_ADDREESS}/payouts`),
]).then(([dashboardResp, workersResp, payoutsResp]) => {
  console.log(dashboardResp.data.data.currentStatistics);
  console.log('____________________');
  console.log(workersResp.data.data);
  console.log('____________________');
  // console.log(payoutsResp.data.data[0].amount / ONE_ETH_IN_WEI);
  console.log(payoutsResp.data.data);
});