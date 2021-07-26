const puppeteer=require('puppeteer');
const videoshow = require('videoshow')
// const bodyParser = require("body-parser");
const express = require("express");
const fs = require('fs');
//----------------------------------------------
// const jsonParser = bodyParser.json();

const pic_path=__dirname+"//pic.png"

const port =3000
const server = express();
//-----------------------------------------------take screenshot
const Screenshot = async (url,pic_path) => {
  try{           
  const browser = await puppeteer.launch(); 
  const page = await browser.newPage();     
  await page.goto(url);                       
  await page.screenshot({path: pic_path,fullPage: true});
  console.log("screenshot was saved")
  await page.close();                      
  await browser.close();   
  }
  catch (error) {
    console.log("Error during screenshot: " + error.message);
  }
}
// //-----------------------------------------------make video from screenshot
 function make_video(pic_path){
  var videoOptions = {
    fps: 25,
    loop: 10, // seconds
    transition: true,
    videoCodec: 'libx264',
    size: '640x?',
    audioBitrate: '128k',
    audioChannels: 2,
    format: 'mp4',
    pixelFormat: 'yuv420p'
  }
  try{
   videoshow([pic_path], videoOptions)
    .save('video.mp4')
    .on('error', function (err, stdout, stderr) { console.error('Error:', err); console.error('ffmpeg stderr:', stderr);})
    .on('end', function (output) {console.error('Video was saved in:', output); fs.unlinkSync('./pic.png'); console.log("pic was deleted");})
  }
  catch (error) {
    console.log("Error during making video: " + error.message);
  }
}
//---------------------------------------------server 
server.post("/", express.json(), async (requset, response) => 
{
  try{
    const url = "https://"+requset.body.url;
     await Screenshot(url,pic_path);
     await make_video(pic_path);
     const path=__dirname+"\\video.mp4"
    response.send({ file: path }); 
  }
  catch (error) {
    console.log("Error : " + error.message);
  }
});

server.listen(port,'localhost',function(error){
    if (error){
        console.log('Error - server connection faild: ',error);
        }
    else{
        console.log("Listening for requests on port :"+port);
        }
    });




