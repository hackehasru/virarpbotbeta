
// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));



// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Vuscâ Bot Başlatılıyor. Port: ' + listener.address().port);
});

const Discord = require("discord.js"); 
const client = new Discord.Client(); 
const chalk = require("chalk"); 
const fs = require("fs"); 


client.ayarlar = {
  "token": "ODkwOTk5NzE4MjEyMTY1NjUy.YU3-Jg.Fyvf_wdj0AUeFrOZuoofpqKtbyw", //Buraya botunuzun https://discordapp.com/developers/applications sitesindeki tokenini yazınız
  "sahip": "839538805118599230",//Buraya bot sahibinin IDini giriniz
  "renk": "RONDOM",
  "klasor": "komutlar", 
  "yardimcilar": ["798808295770816513","773238978371387454","803781249948450867"], // buraya kim aktif atıcaklar yazınız sahip id yazmanyın yoksa bot çalışmaz 
  "prefix": "v!", 
  "versiyon": "0.0.1",
};

client.on("ready", async () => {
  console.log(`Bot Developer By !UK#0002 !`)
  client.user.setActivity(`Vira Roleplay İyi Roller Diler`)
  /*Burada botunuzun oynuyor durumunu değiştiriniz durum type:STREAMING"" kısmında yazıyor
  Durumlar:
  STREAMING yazar iseniz durum Yayında olur bunun için url kısmına twich kanal linkinizi de yazınız,
  WATCHING yazar iseniz durum İzliyor olur,
  LISTENING yazar iseniz durum Dinliyor olur,
  PLAYING yazar iseniz durum Oynuyor olur.
  */
});

client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
fs.readdir(`./${client.ayarlar.klasor}`, (err, files) => {
  let jsfiles = files.filter(f => f.split(".").pop() === "js")

  if(jsfiles.length <= 0) {
    console.log("Bu klasörde hiç komut yok!")
  } else {
    if (err) {
      console.error("Hata! Bir komutun name veya aliases kısmı yok!")
    }
    console.log(`${jsfiles.length} komut yüklenecek.`)

    jsfiles.forEach(f => {
      let props = require(`./${client.ayarlar.klasor}/${f}`)
      client.commands.set(props.help.name, props)
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name)
      })
      console.log(`Yüklenen komut: ${props.help.name}`)
    })
  }
});

client.on("message", async message => {
  let prefix = client.ayarlar.prefix
 if (!message.guild) return;  
 if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return
  var command = message.content.split(" ")[0].slice(prefix.length)
  var args = message.content.split(" ").slice(1)
  
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  
  if (cmd) {
    
    if (cmd.conf.permLevel === 1) {
      if (!message.member.hasPermission("MANAGE_MESSAGES")) {
        message.reply(`Bu komutu kullanabilmek için Mesajları Yönet iznine sahip olmalısın!`)
        return
      }
    }
    if (cmd.conf.permLevel === 2) {
      if (!message.member.hasPermission("KICK_MEMBERS")) {
        message.reply(`Bu komutu kullanabilmek için Üyeleri At iznine sahip olmalısın!`)

        return
      }
    }
    if (cmd.conf.permLevel === 3) {
      if (!message.member.hasPermission("BAN_MEMBERS")) {
        message.reply(`Bu komutu kullanabilmek için Üyeleri Yasakla iznine sahip olmalısın!`)

        return
      }
    }
    if (cmd.conf.permLevel === 4) {
      if (!message.member.hasPermission("MANAGE_ROLES")) {
        message.reply(`Bu komutu kullanabilmek için Rolleri Yönet iznine sahip olmalısın!`)
        return
      }
    }
    if (cmd.conf.permLevel === 5) {
      if (!message.member.hasPermission("ADMINISTRATOR")) {
        message.reply(`Bu komutu kullanabilmek için Yönetici iznine sahip olmalısın!`)

        return
      }
    }
    if (cmd.conf.permLevel === 6) {
      if (!client.ayarlar.sahip.includes(message.author.id)) {
        message.reply(`Bu komutu kullanabilmek için Bot Sahibi iznine sahip olmalısın!`)
return
      }
    }
    cmd.run(client, message, args);
    
  }});


client.login(client.ayarlar.token); //Burada bot giriş yapıyor