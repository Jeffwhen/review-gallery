'use strict';

var port = normalizePort(process.env.PORT || 7334);
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Max-Age", 86400);
  next();
});

app.get('/image', (req, res) => {
  const image = genImages();
  let {pageIndex} = req.query;
  if (pageIndex > image.maxPageIndex) {
    pageIndex = image.maxPageIndex;
  }
  setTimeout(() => {
    res.json({...image, pageIndex});
  }, 400);
});
app.post('/image', (req, res) => {
  const image = genImages();
  let {pageIndex} = req.query;
  pageIndex = parseInt(pageIndex, 10);
  pageIndex += 1;
  if (pageIndex > image.maxPageIndex) {
    pageIndex = image.maxPageIndex;
  }
  res.json({...image, pageIndex});
});

app.listen(port, function () {
  console.log(`api server @${port}`);
});

function genImages () {
  const resp =  JSON.parse('{"errcode":0,"pageIndex":"1","maxPageIndex":10,"isUserSelect":0,"isAuditSelect":1,"images":[{"unitId":"74829","check":1,"objs":[{"bndBoxes":[{"ymax":0.49883231791959,"uid":5673272,"xmin":0.50240505616198,"xmax":0.52220870924253,"ymin":0.48636804252658,"keypoints":[{"left_up":"0.503859375,0.48825608152531","left_low":"0.50396875,0.49706607495069","right_up":"0.522890625,0.48588921761999","right_low":"0.52307291666667,0.49548816568047","key_name":"plate"}]}],"name":"\u84dd\u5e95\u8f66\u724c","uid":3685}],"updateUrl":"\/user\/tag?updateId=74829&procedureId=228","url":"http:\/\/img.adkalava.com\/img006\/471\/ac197caf4ae7dbbf_300x300.jpg"},{"unitId":"74843","check":1,"objs":[{"bndBoxes":[{"ymax":0.34131466566927,"uid":5673285,"xmin":0.35231045888414,"xmax":0.36439280369482,"ymin":0.33405733862704,"keypoints":[{"left_up":"-1,-1","left_low":"-1,-1","right_up":"-1,-1","right_low":"-1,-1","key_name":"plate"}]}],"name":"\u84dd\u5e95\u8f66\u724c","uid":3685}],"updateUrl":"\/user\/tag?updateId=74843&procedureId=228","url":"http:\/\/img.adkalava.com\/img006\/452\/789791f023bc8d5c_300x300.jpg"},{"unitId":"74857","check":1,"objs":[{"bndBoxes":[{"ymax":0.4149,"uid":5673294,"xmin":0.62620544090056,"xmax":0.64235928705441,"ymin":0.40288333333333,"keypoints":[{"left_up":"-1,-1","left_low":"-1,-1","right_up":"-1,-1","right_low":"-1,-1","key_name":"plate"}]}],"name":"\u84dd\u5e95\u8f66\u724c","uid":3685}],"updateUrl":"\/user\/tag?updateId=74857&procedureId=228","url":"http:\/\/img.adkalava.com\/img006\/368\/579a42318a419690_300x300.jpg"},{"unitId":"74860","check":1,"objs":[{"bndBoxes":[{"ymax":0.77069006114916,"uid":5673303,"xmin":0.98813646549927,"xmax":0.99957730053912,"ymin":0.75079675925926,"keypoints":[{"left_up":"0.98841232638889,0.75111768573307","left_low":"0.98844965277778,0.76972386587771","right_up":"-1,-1","right_low":"-1,-1","key_name":"plate"}]}],"name":"\u84dd\u5e95\u8f66\u724c","uid":3685}],"updateUrl":"\/user\/tag?updateId=74860&procedureId=228","url":"http:\/\/img.adkalava.com\/img006\/429\/c459d193b102e0f5_300x300.jpg"},{"unitId":"74867","check":1,"objs":[{"bndBoxes":[{"ymax":0.34126641651032,"uid":5673308,"xmin":0.351379761272,"xmax":0.36413720700203,"ymin":0.3323248905566,"keypoints":[{"left_up":"-1,-1","left_low":"-1,-1","right_up":"-1,-1","right_low":"-1,-1","key_name":"plate"}]}],"name":"\u84dd\u5e95\u8f66\u724c","uid":3685}],"updateUrl":"\/user\/tag?updateId=74867&procedureId=228","url":"http:\/\/img.adkalava.com\/img006\/745\/58371393a6e4abc9_300x300.jpg"},{"unitId":"74868","check":1,"objs":[{"bndBoxes":[{"ymax":0.35078333333333,"uid":5673307,"xmin":0.5517987804878,"xmax":0.56762898686679,"ymin":0.33908333333333,"keypoints":[{"left_up":"-1,-1","left_low":"-1,-1","right_up":"-1,-1","right_low":"-1,-1","key_name":"plate"}]}],"name":"\u84dd\u5e95\u8f66\u724c","uid":3685}],"updateUrl":"\/user\/tag?updateId=74868&procedureId=228","url":"http:\/\/img.adkalava.com\/img006\/745\/58371393a6e4abc9_300x300.jpg"},{"unitId":"74881","check":1,"objs":[{"bndBoxes":[{"ymax":0.50109443402126,"uid":5673319,"xmin":0.35534110789225,"xmax":0.3763838092992,"ymin":0.48850531582239,"keypoints":[{"left_up":"0.35703125,0.49114069690993","left_low":"0.35699305555556,0.50024928774929","right_up":"0.37490625,0.49045584045584","right_low":"0.37555555555556,0.49997534516765","key_name":"plate"}]}],"name":"\u84dd\u5e95\u8f66\u724c","uid":3685}],"updateUrl":"\/user\/tag?updateId=74881&procedureId=228","url":"http:\/\/img.adkalava.com\/img006\/661\/8900ae7bfbbfb545_300x300.jpg"}]}');
  resp.images.forEach(i => Object.assign(i, {width: 1920, height: 1080}));
  return resp;
}
