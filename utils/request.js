const cheerio = require("cheerio");
const qs = require("qs");
const axios = require("axios");
const baseURL = "https://simulator.sandbox.midtrans.com";


const _asyncRequest = async (options) => {
  options.url = baseURL + options.endpoint;
  options.method = "POST";
  options.headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  return axios({
    ...options,
    data: qs.stringify(options.form),
  });
};

const _parseHtmlResult = (html) => {
  const $ = cheerio.load(html);
  return [$(".alert-danger").text(), $(".alert-success").text()].map((x) => {
    if (!x) return null;
    return x;
  });
};

module.exports = { _asyncRequest, _parseHtmlResult };
