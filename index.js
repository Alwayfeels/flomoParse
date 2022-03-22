const fs = require("fs");
const path = require("path");
var cheerio = require("cheerio");
const log = console.log.bind(console);

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


const FLOMO_DATA_FOLDER = 'flomoResource'

const flomoDataPath = `./${FLOMO_DATA_FOLDER + '/' || ''}`
var filePath = path.resolve(flomoDataPath)
fs.readdir(filePath, (err, files) => {
  var memosJSON = files.map(_path => {
    if (err) {
      log(err)
      return [];
    }
    if (_path.indexOf('.html') > 0) {
      let _html = fs.readFileSync(`${flomoDataPath}/${_path}`);
      let _$ = cheerio.load(_html)
      return HtmlMemo2Json(_$)
    }
    return []
  })
  memosJSON = memosJSON.flat()
  console.log('finish: ' + memosJSON.length + ' data is exported')
  Export_JSON_File(memosJSON);
});
