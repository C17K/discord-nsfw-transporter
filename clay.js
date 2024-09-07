const { Client, Intents } = require('discord.js-selfbot-v13');
const fs = require('fs');
const path = require('path');

const configdosyasi = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configdosyasi, 'utf8'));

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_CONTENT] });

client.once('ready', () => {
    console.log(`giriş yaptım: ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.channel.id === config.takipedilcekkanal && !message.author.bot) {
        if (message.attachments.size > 0) {
            message.attachments.forEach(attachment => {
                if (attachment.name.endsWith('.mp4') || attachment.name.endsWith('.mov') || attachment.name.endsWith('.avi')) {
                    const kanal = client.channels.cache.get(config.atilcakkanal);
                    if (kanal) {
                        try {
                            kanal.send(`${attachment.url}`);
                        } catch (error) {
                            console.error('mesaj gönderme hatası:', error);
                        }
                    } else {
                        console.error('hedef kanal bulunamadı!');
                    }
                }
            });
        }

        const urlpath = /https:\/\/cdn\.discordapp\.com\/attachments\/\d+\/\d+\/[^\s]+/g;
        const urls = message.content.match(urlpath);

        if (urls) {
            const kanal = client.channels.cache.get(config.atilcakkanal);
            if (kanal) {
                try {
                    for (const url of urls) {
                        await kanal.send(`${url}`);
                    }
                } catch (error) {
                    console.error('mesaj gönderme hatası:', error);
                }
            } else {
                console.error('hedef kanal bulunamadı.');
            }
        }
    }
});

client.login(config.token);
