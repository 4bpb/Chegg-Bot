const fs = require('fs')
const Discord = require('discord.js');
const client = new Discord.Client();
var log = require('./logger')
var moment = require('moment'); // require
const puppeteer = require('puppeteer-extra')
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
    await page.type('#emailForSignIn', '', {delay: 100}); // Types slower, like a user enter username here
    await page.type('#passwordForSignIn', '', {delay: 100}); // Types slower, like a user enter pass here
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


client.login('');