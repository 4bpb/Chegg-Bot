const fs = require('fs')
const Discord = require('discord.js');
const client = new Discord.Client();
var log = require('./logger')
var moment = require('moment'); // require
const puppeteer = require('puppeteer-extra')
const imagesToPdf = require("images-to-pdf")
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())


async function checkCookie(){
    global.browser = await puppeteer.launch({headless: true});
    global.page = await browser.newPage();
    const session = await page.target().createCDPSession();
    const {windowId} = await session.send('Browser.getWindowForTarget');
    await session.send('Browser.setWindowBounds', {windowId, bounds: {windowState: 'minimized'}});
    log('Browser Deployed', 'init')
    fs.readFile(__dirname+'/cookies.json', 'utf8' , (err, data) => {
        if (err) {
            log(err, 'err')
          return
        }
        if(data.length === 0){
            //console.log('No Cookies')
            log('No Cookies Sending to Login', 'init')

            ///input login here
            login()


        } else {
            /// input use cookies here
            log('Fetched Cookies Sending to Load Cookies', 'init')
            useCookie()




        }
      })

}

async function login(){
    await page.goto("https://www.chegg.com/writing/login/", {waitUntil: 'networkidle2'});
    await page.type('#emailForSignIn', 'blakebein@gmail.com', {delay: 100}); // Types slower, like a user
    await page.type('#passwordForSignIn', '4Craftmine()!', {delay: 100}); // Types slower, like a user
    await page.click('#eggshell-8 > form > div > div > div > footer > button'); // Types slower, like a user
}

async function useCookie(){
    const cookiesString = await fs.readFileSync('./cookies.json');
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
    log('Cookies Loaded to Browser', 'ok')
}


client.on('ready', () => {
    checkCookie()
    //console.log(`Logged in as ${client.user.tag}!`);
    log(`Logged in to Discord as ${client.user.tag}!`, 'init')
  });
client.on('message', message => {
    if(message.member.hasPermission(['SEND_MESSAGES'])) {
        if(message.content.startsWith(`!chegg`)) {

            var s = message.content.replace('!chegg', '')
            cheggtopdf(s)
            async function cheggtopdf(url){
                await page.goto(url, {waitUntil: 'networkidle2'});
                


                log(`Removing Two Device Limit Element`, 'init')
                let div_selector_to_remove= "#cs-dm-swap";
                await page.evaluate((sel) => {
                    var elements = document.querySelectorAll(sel);
                    for(var i=0; i< elements.length; i++){
                        elements[i].parentNode.removeChild(elements[i]);
                    }
                }, div_selector_to_remove)



                global.screenshot = await page.screenshot({path: 'test.png', fullPage: true});



                let divselectortoremove= "body > div.chg-body.no-nav.no-subnav.header-nav > div:nth-child(4)";
                await page.evaluate((sel) => {
                    var elements = document.querySelectorAll(sel);
                    for(var i=0; i< elements.length; i++){
                        elements[i].parentNode.removeChild(elements[i]);
                    }
                }, divselectortoremove)



                await page.waitForSelector('body > div.chg-body.no-nav.no-subnav.header-nav > div.chg-container.center-content > div.chg-container-content > div.chg-global-content > div > div.parent-container.question-headline > div.main-content.question-page > div.dialog-question > div.question.txt-small > div.txt-body.question-body.mod-parent-container > div.ugc-base.question-body-text');          // wait for the selector to load
                const element = await page.$('body > div.chg-body.no-nav.no-subnav.header-nav > div.chg-container.center-content > div.chg-container-content > div.chg-global-content > div > div.parent-container.question-headline > div.main-content.question-page > div.dialog-question > div.question.txt-small > div.txt-body.question-body.mod-parent-container > div.ugc-base.question-body-text');        // declare a variable with an ElementHandle
                await element.screenshot({path: 'question.png'}); // take screenshot element in puppeteer
                     
              
              
              
              
                await page.waitForSelector('body > div.chg-body.no-nav.no-subnav.header-nav > div.chg-container.center-content > div.chg-container-content > div.chg-global-content > div > div.parent-container.question-headline > div.main-content.question-page > div.dialog-question > div.answers-wrap > ul > li > div.answer.txt-small.mod-parent-container > div.txt-body.answer-body');          // wait for the selector to load
                const answer = await page.$('body > div.chg-body.no-nav.no-subnav.header-nav > div.chg-container.center-content > div.chg-container-content > div.chg-global-content > div > div.parent-container.question-headline > div.main-content.question-page > div.dialog-question > div.answers-wrap > ul > li > div.answer.txt-small.mod-parent-container > div.txt-body.answer-body');        // declare a variable with an ElementHandle
                await answer.screenshot({path: 'answer.png'}); // take screenshot element in puppeteer
              

                main('question.png','answer.png')

















                const cookies = await page.cookies();

                await fs.writeFileSync('./cookies.json', '', function(){console.log('Cookies Cleared')})

                //console.log(cookies)
                await fs.writeFileSync('./cookies.json', JSON.stringify(cookies, null, 2))
                log(`New Cookie Value Saved to /cookies.json`, 'ok')


                let data = message.author.username+' Requested: '+url
                



                //console.log(message.author.username+' Requested: '+url)
                log(message.author.username+' Requested: '+url, 'info')
                message.channel.send(message.author.username, {files: [screenshot]});
                log(`Image Requested by `+message.author.username+' Sent to Server', 'ok')
                const session = await page.target().createCDPSession();
                const {windowId} = await session.send('Browser.getWindowForTarget');
                whoRequest(data)
                await session.send('Browser.setWindowBounds', {windowId, bounds: {windowState: 'minimized'}});
            }


            

        }
    }
})

async function whoRequest(info){
    fs.appendFileSync('./log.txt', moment().format("dddd, MMMM Do YYYY, h:mm:ss a    ")+info+'\n')
    log('Wrote Info to /Logs.txt', 'info')
    
}


async function main(questionimage, answerimage){
    let rnadomstring = makeid(5)
    await imagesToPdf([questionimage, answerimage], rnadomstring+".pdf")
    log('Made file :'+rnadomstring+'.pdf','ok')
}


function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}




client.login('NjkzOTY5MDAxNzcyMDg5NDE1.XoEzHg.NI-fSJgBXdxscHbDojP_ElStoZ8');