const fs = require("fs");
const path = require("path");
var cheerio = require("cheerio");
// const log = console.log.bind(console);

// input string, output tag[]
function getTagsFromText(string) {
  var reg = /\#[^\s]+/g;
  return string.match(reg) || [];
}

// input cherrio_Obj, output json
function HtmlMemo2Json($) {
  let exportJSON = [];
  $(".memo").each((index, item) => {
    let content = [];
    let contentStr = $(item).find(".content").text();
    $(item)
      .find(".content p")
      .each((i, e) => {
        let text = $(e).text();
        content.push(text);
      });
    exportJSON.push({
      time: $(item).find(".time").text(),
      tags: getTagsFromText(contentStr),
      content,
    });
  });
  return exportJSON;
}

// input json, output json file
function Export_JSON_File(data) {
  let str = JSON.stringify(data, "", "\t");
  fs.writeFile("myMemos.json", str, function (err) {
    if (err) {
      res.status(500).send("Server is error...");
    }
  });
}

var myHtml = fs.readFileSync("flomoResource/202112.html");
var $ = cheerio.load(myHtml);
let exportJson = HtmlMemo2Json($);
Export_JSON_File(exportJson);
