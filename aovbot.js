const { Client, Intents, Collection } = require('discord.js');
const mongoose = require('mongoose');
require('dotenv').config();


const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS ]});

client.commands = new Collection();
client.aliases = new Collection();
client.categories = new Collection();
client.interactions = new Collection();

['command', 'event', 'slashCommand'].forEach(handler => require(`./handlers/${handler}`)(client));


/* Connect to discord and mongodb */
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGOOSE).then((c) => {
    console.log('MongooseDB Connected ✅')
})

client.login(process.env.TOKEN);