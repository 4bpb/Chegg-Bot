const fs = require('fs')
const Discord = require('discord.js');
const client = new Discord.Client();
var log = require('./logger')
const imagesToPdf = require("images-to-pdf")
var moment = require('moment'); // require
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())


async function checkCookie(){
    global.browser = await puppeteer.launch({headless: true,args: ['--no-sandbox']});
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
    await page.type('#emailForSignIn', '', {delay: 100}); // Types slower, like a user enter username here
    await page.type('#passwordForSignIn', '', {delay: 100}); // Types slower, like a user enter pass here
    await page.click('#eggshell-2 > form > div > div > div > footer > button'); // Types slower, like a user
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
    //let rawdata = message.author.username+'#'+message.author.discriminator+' Requested  Server info: serverName: '+message.guild.name+' ServerID: '+message.guild.id+' ChannelID: '+message.channel.id
    //whoRequestRaw(rawdata) raw data breaks script sometimes so if its nec add a try catch
    
    if(message.member.hasPermission(['SEND_MESSAGES'])) {
        if(message.content.startsWith(`!chegg`)) {


            var s = message.content.replace('!chegg', '')
            var noq = s.split("?")[0]; //removes track id 

            cheggtopdf(noq)
            async function cheggtopdf(url){
                await page.goto(url, {waitUntil: 'networkidle2'});
                


                log(`Removing Two Device Limit Element`, 'init')
                let div_selector_to_remove= "#cs-dm-add";
                await page.evaluate((sel) => {
                    var elements = document.querySelectorAll(sel);
                    for(var i=0; i< elements.length; i++){
                        elements[i].parentNode.removeChild(elements[i]);
                    }
                }, div_selector_to_remove)


                let div_selector= "#cs-dm-swap";
                await page.evaluate((sel) => {
                    var elements = document.querySelectorAll(sel);
                    for(var i=0; i< elements.length; i++){
                        elements[i].parentNode.removeChild(elements[i]);
                    }
                }, div_selector)

                global.screenshot = await page.screenshot({path: 'test.png', fullPage: true});


                //remove chegg nav bar in screenshot
                let div_selector_two= "body > div.chg-body.no-nav.no-subnav.header-nav > div:nth-child(4) > oc-component > div.chgg-hdr.force-desktop.kit-kat-search.type-study.subtype-.loggedIn > div";
                await page.evaluate((sel) => {
                    var elements = document.querySelectorAll(sel);
                    for(var i=0; i< elements.length; i++){
                        elements[i].parentNode.removeChild(elements[i]);
                    }
                }, div_selector_two)

                //question
                try {
                    const element_question = await page.$('body > div.chg-body.no-nav.no-subnav.header-nav > div.chg-container.center-content > div.chg-container-content > div.chg-global-content > div > div.parent-container.question-headline > div.main-content.question-page > div.dialog-question > div.question.txt-small > div.txt-body.question-body.mod-parent-container');        // declare a variable with an ElementHandle
                    await element_question.screenshot({path: 'question.png'});
                } catch (error) {
                    log('Error on Question Picture','err')
                }

                //answer
                try {
                    const element_answer = await page.$('body > div.chg-body.no-nav.no-subnav.header-nav > div.chg-container.center-content > div.chg-container-content > div.chg-global-content > div > div.parent-container.question-headline > div.main-content.question-page > div.dialog-question > div.answers-wrap > ul > li > div.answer.txt-small.mod-parent-container > div.txt-body.answer-body');        // declare a variable with an ElementHandle
                    await element_answer.screenshot({path: 'answer.png'});
                } catch (error) {
                    log('Error on Answer Picture','err')
                }



                //generate pdf
                try {
                    await imagesToPdf(["./question.png", "./answer.png"],makeid(10)+".pdf")
                } catch (error) {
                    log('Error on Generation of PDF','err')
                }




                const cookies = await page.cookies();

                await fs.writeFileSync('./cookies.json', '', function(){console.log('Cookies Cleared')})

                //console.log(cookies)
                await fs.writeFileSync('./cookies.json', JSON.stringify(cookies, null, 2))
                log(`New Cookie Value Saved to /cookies.json`, 'ok')
                let server = message.guild.name
                let serverid = message.guild.id
                let channelID = message.channel.id
                let data = message.author.username+'#'+message.author.discriminator+' Requested: '+url+'  Server info: serverName: '+server+' ServerID: '+serverid+' ChannelID: '+channelID




                

                



                //console.log(message.author.username+' Requested: '+url)
                log(message.author.username+'#'+message.author.discriminator+' Requested: '+url, 'info')
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


async function whoRequestRaw(info){
    fs.appendFileSync('./rawlog.txt', moment().format("dddd, MMMM Do YYYY, h:mm:ss a    ")+info+'\n')
    //log('Wrote New Raw Data of '+info, 'info')
    
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


client.login('');