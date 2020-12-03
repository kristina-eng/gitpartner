const express = require('express')
const puppeteer = require('puppeteer')
const fs = require('fs-extra');
const data = require('./model/User');
const path = require('path')
const hbs = require('handlebars');


async function convert() {
  const compile = async function(templateName, data) {
    const filePath = path.join(process.cwd(), 'views', `${templateName}.hbs`);
    const html = await fs.readFile(filePath, 'utf-8')
  return hbs.compile(html)(data);
};

  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();

    const content = await compile('test', User)
    await page.setContent(content)
    await page.emulateMediaType('screen');
    await page.pdf({
      path: "./downloads/mypdf.pdf",
      format: "A4",
      printBackground: true,
    })
    console.log('done');
    await browser.close();
  } catch (err) {
    console.log('our error: ', err)
  }
};

// async function createPDF(user){

//   const compile = async function(templateName, data) {
//     const filePath = path.join(process.cwd(), 'views', `${templateName}.hbs`);
//     const html = await fs.readFile(filePath, 'utf-8')
//   return hbs.compile(html)(data);
// };

//   var templateHtml = fs.readFileSync(path.join(process.cwd(), '.html'), 'utf8');
//   var template = hbs.compile(templateHtml);
//   var html = template(data);

//   var milis = new Date();
//   milis = milis.getTime();

//   var pdfPath = path.join('pdf', `${data.name}-${milis}.pdf`);

//   var options = {
//     width: '1230px',
//     headerTemplate: "<p></p>",
//     footerTemplate: "<p></p>",
//     displayHeaderFooter: false,
//     margin: {
//       top: "10px",
//       bottom: "30px"
//     },
//     printBackground: true,
//     path: pdfPath
//   }

//   const browser = await puppeteer.launch({
//     args: ['--no-sandbox'],
//     headless: true
//   });

//   var page = await browser.newPage();
  
//   await page.goto(`data:text/html;charset=UTF-8,${html}`, {
//     waitUntil: 'networkidle0'
//   });

//   await page.pdf(options);
//   await browser.close();
// }