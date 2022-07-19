const fs = require("fs");
const path = require("path");
var cheerio = require("cheerio");
const { contents } = require("cheerio/lib/api/traversing");
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
    let tags = [];
    let files = [];
    $(item)
      .find(".content p, .content li")
      .each((i, e) => {
        let text = $(e).text();
        content.push(text);
        tags.push(...getTagsFromText(text))
      });
    $(item).find("img").each((i, e) => {
      let src = $(e).attr("src");
      files.push(src);
    });
    exportJSON.push({
      time: $(item).find(".time").text(),
      tags,
      content,
      filePath: files.length > 0 ? files : null,
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
