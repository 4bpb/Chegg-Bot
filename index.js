const fs = require('fs')
const Discord = require('discord.js');

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
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
    await page.goto("", {waitUntil: 'networkidle2'});
    await page.type('#emailForSignIn', '', {delay: 100}); // Types slower, like a user enter username here
    await page.type('#passwordForSignIn', '4Craftmine()', {delay: 100}); // Types slower, like a user enter pass here
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
    //console.log('t')
    
        //console.log(message)
        if(message.content.startsWith(`https://www.chegg.com/homework-help/`)) {


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







                




                const cookies = await page.cookies();

                await fs.writeFileSync('./cookies.json', '', function(){console.log('Cookies Cleared')})

                //console.log(cookies)
                await fs.writeFileSync('./cookies.json', JSON.stringify(cookies, null, 2))
                log(`New Cookie Value Saved to /cookies.json`, 'ok')
                await page.goto('https://www.google.com/')
                let server = message.guild.name
                let serverid = message.guild.id
                let channelID = message.channel.id
                let data = message.author.username+'#'+message.author.discriminator+' Requested: '+url+'  Server info: serverName: '+server+' ServerID: '+serverid+' ChannelID: '+channelID




                

                



                //console.log(message.author.username+' Requested: '+url)
                log(message.author.username+'#'+message.author.discriminator+' Requested: '+url, 'info')
                //message.channel.send(screenshot);
                message.channel.send({content: message.author.username, files: [
                    { attachment: screenshot }
                ]});

                log(`Image Requested by `+message.author.username+' Sent to Server', 'ok')
                const session = await page.target().createCDPSession();
                const {windowId} = await session.send('Browser.getWindowForTarget');
                whoRequest(data)
                await session.send('Browser.setWindowBounds', {windowId, bounds: {windowState: 'minimized'}});
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