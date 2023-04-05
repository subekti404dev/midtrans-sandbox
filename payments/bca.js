const cheerio = require("cheerio");
const { _asyncRequest, _parseHtmlResult } = require("../utils/request");

const payment = async (vaNumber, amount) => {
  try {
    const companyCode = vaNumber.slice(0, 5);
    const customerNumber = vaNumber.slice(5);
    const inq = await inquiry(vaNumber);
    console.log({
      company_code: companyCode,
      customer_number: customerNumber,
      customer_name: inq.account?.split("-")?.[1]?.trim(),
      total_amount: `${amount}.00`,
      currency_code: "IDR",
    });
    const resp = await _asyncRequest({
      endpoint: "/bca/va/payment",
      form: {
        company_code: companyCode,
        customer_number: customerNumber,
        customer_name: inq.account?.split("-")?.[1]?.trim(),
        total_amount: `${amount}.00`,
        currency_code: "IDR",
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
      endpoint: "/bca/va/inquiry",
      form: {
        va_number: vaNumber,
      },
    });
    const html = resp?.body || "";
    const $ = cheerio.load(html);
    let amount =
      $(
        "#wrap > div.container > form > div:nth-child(5) > div > input[type=text]"
      ).attr("value") || "0";
    const account = $(
      "#wrap > div.container > form > div:nth-child(6) > div > p"
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

module.exports = { payment, inquiry };
