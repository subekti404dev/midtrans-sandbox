const cheerio = require("cheerio");
const { _asyncRequest, _parseHtmlResult } = require("../utils/request");

const payment = async (vaNumber, amount) => {
  try {
    const inq = await inquiry(vaNumber);
    const resp = await _asyncRequest({
      endpoint: "/openapi/va/payment",
      form: {
        vaNumber,
        amount,
        bank: "BRI",
        virtualAccountName: inq.account.split("-")?.[0]?.trim(),
      },
    });
    const [err, res] = _parseHtmlResult(resp?.body || "");
    if (err) throw new Error(err);
    return res?.trim();
  } catch (error) {
    throw error;
  }
};

const inquiry = async (vaNumber) => {
  try {
    const resp = await _asyncRequest({
      endpoint: "/openapi/va/inquiry",
      form: {
        vaNumber,
        bank: "BRI",
      },
    });
    const html = resp?.body || "";
    const $ = cheerio.load(html);
    let amount = $("#amount_display").attr("value") || "0";
    const account = $(
      "#wrap > div.container > form > div:nth-child(6) > div > p"
    ).text();
    const description = "";
    amount = parseInt(amount);
    if (!account) throw new Error("Invalid VA Number");
    return { amount, account, description };
  } catch (error) {
    throw error;
  }
};

// payment("080711087722171686", 172000).then(console.log).catch(console.log);

module.exports = { payment, inquiry };
