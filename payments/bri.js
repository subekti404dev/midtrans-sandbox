const cheerio = require("cheerio");
const { _asyncRequest, _parseHtmlResult } = require("../utils/request");

const payment = async (vaNumber, amount) => {
  try {
    const resp = await _asyncRequest({
      endpoint: "/bri/va/payment",
      form: {
        va_number: vaNumber,
        total_amount: amount,
      },
    });
    const [err, res] = _parseHtmlResult(resp?.body || "");
    if (err) throw new Error(err);
    return res;
  } catch (error) {
    throw error;
  }
};

const inquiry = async (vaNumber) => {
  try {
    const resp = await _asyncRequest({
      endpoint: "/bri/va/inquiry",
      form: {
        va_number: vaNumber,
      },
    });
    const html = resp?.body || "";
    const $ = cheerio.load(html);
    let amount =
      $(
        "#wrap > div.container > form > div:nth-child(2) > div > input[type=text]"
      ).attr("value") || "0";
    const account = $(
      "#wrap > div.container > form > div:nth-child(3) > div > p"
    ).text();
    const description = $(
      "#wrap > div.container > form > div:nth-child(4) > div > p"
    ).text();
    amount = parseInt(amount);
    if (!account) throw new Error("Invalid VA Number");
    return { amount, account, description };
  } catch (error) {
    throw error;
  }
};

inquiry("4978610877221716861").then(console.log);
// payment("497861087722171686", 310000).then(console.log);
module.exports = { payment, inquiry };
