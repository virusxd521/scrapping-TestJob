const fs = require("fs");
import { test, expect } from '@playwright/test';
require('dotenv').config();

const convertingToJSON = (productName, productCode, priceIncVat, productImage, percentageRating) => {
  const dataObj = {
    "Product_code" : productCode.toString().replace(/(\r\n|\n|\r)/gm, ""),
    "Name_of_a_product" : productName.toString().replace(/(\r\n|\n|\r)/gm, ""),
    "Image_URL" : productImage.toString().replace(/(\r\n|\n|\r)/gm, ""),
    "Price_with_VAT" : priceIncVat.toString().replace(/(\r\n|\n|\r|-|[od]|\s)/gm, ""),
    "Rating_in_percent" : percentageRating
  };
  return dataObj;
}

const gettingElementData = async (box : any) => {
  const productCode = await (await box.$(".code")).textContent();
  const productName = await (await box.$(".name")).textContent();
  const priceIncVat = await (await box.$(".c2")).textContent();
  const productImage = await (await box.$("img")).getAttribute("data-src");
  let percentageRating = '';
  // const percentageRating = await (await box.$(".star-rating-wrapper")).getAttribute("data-rating");
  if(await box.$(".star-rating-wrapper")){
    percentageRating = await (await box.$(".star-rating-wrapper")).getAttribute("data-rating");
  } else {
    percentageRating = "No Rating Found";
  }
    
  await box.$(".star-rating-wrapper");
  
  const jsonObject = convertingToJSON(productName, productCode, priceIncVat, productImage, percentageRating);
  return jsonObject;
}

test('alza test', async ({ page }) => {
  
  try{
    await page.goto("https://www.alza.cz/", { timeout: 5000 });
  } catch(error){
    console.log(error);
  }
  console.log(`${__dirname}\\..\\scraping.json` , "Daniel This is The Path");
  await page.locator("#edtSearch").click();
  await page.fill("#edtSearch", process.env.USER_ITEM);
  await page.locator("#btnSearch").click();
  console.log(`${__dirname}\\..\\scraping.json` , "Daniel This is The Path");
  console.log(process.env.USER_ITEM, "sssss");
  const boxesContainer = await page.waitForSelector("#boxes", { state: 'attached'});
  const box = await boxesContainer.$$(".box");
  const allJsonData = [];
  
  for(let i = 0; i < box.length; i++){
    allJsonData.push(await gettingElementData(box[i]));
  }
  
  fs.writeFileSync(`${__dirname}\\..\\scraping.json`, JSON.stringify(allJsonData));
  console.log(allJsonData);
});

test.afterEach(async ({ page }, testInfo) => {
  if(testInfo.status === testInfo.expectedStatus){
    console.log("Scrapp Succeeded!!");
  } else {
    console.log("Something went wrong, we will redirect you to the prompt so you would try again");
  }
})