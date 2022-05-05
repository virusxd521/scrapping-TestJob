const fs = require("fs");
import { test, expect } from '@playwright/test';
require('dotenv').config();

const convertingToJSON = (productName, productCode, priceIncVat, productImage) => {
  const dataObj = {
    "Product code" : productCode.toString().replace(/(\r\n|\n|\r)/gm, ""),
    "Name of a product" : productName.toString().replace(/(\r\n|\n|\r)/gm, ""),
    "Image URL" : productImage.toString().replace(/(\r\n|\n|\r)/gm, ""),
    "Price with VAT" : priceIncVat.toString().replace(/(\r\n|\n|\r|-|[od]|\s)/gm, ""),
    // "Rating in percent" : percentageRating
  };
  return dataObj;
}

const gettingElementData = async (box : any) => {
  const productCode = await (await box.$(".code")).textContent();
  const productName = await (await box.$(".name")).textContent();
  const priceIncVat = await (await box.$(".c2")).textContent();
  const productImage = await (await box.$("img")).getAttribute("data-src");
  const percentageRating = await (await box.$(".star-rating-wrapper"));
  
  console.log(percentageRating);
  const jsonObject = convertingToJSON(productName, productCode, priceIncVat, productImage);
  return jsonObject;
}

test('alza test', async ({ page }) => {
  try{
    await page.goto("https://www.alza.cz/", {timeout : 3000});
  } catch(error){
    console.log(error);
    process.exit(1);
  }
  await page.locator("#edtSearch").click();
  await page.fill("#edtSearch", process.env.USER_ITEM);
  await page.locator("#btnSearch").click();
  const boxesContainer = await page.waitForSelector("#boxes", { state: 'attached'});
  const box = await boxesContainer.$$(".box");
  const allJsonData = [];
  
  for(let i = 0; i < box.length; i++){
    allJsonData.push(await gettingElementData(box[i]));
  }
  // console.log(JSON.stringify(allJsonData));
  fs.writeFileSync("C:/Users/Daniel/Desktop/jobTest/alzaScrapper/scraping.json", JSON.stringify(allJsonData));
});

test.afterEach(async ({ page }, testInfo) => {
  if(testInfo.status === testInfo.expectedStatus){
    console.log("Scrapp Succeeded!!");
  } else {
    console.log("Something went wrong, we will redirect you to the prompt so you would try again");
  }
})