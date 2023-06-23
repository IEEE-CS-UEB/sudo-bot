const Eris = require("eris");
const responses = require("./responses");
const commands = require("./commands");
const { BotIOManager } = require("./ops/interaction");
const { Configuration, OpenAIApi } = require("openai");

// TODO: create process management script because I'm insane

// Cargamos las variables de entorno (Archivo .env)
require("dotenv").config();

// Creamos un cliente de OpenAI / Nos logueamos con nuestra credencial OpenAI
console.log("🔁 Iniciando cliente de la API de OpenAI...")
const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);
console.log("✅ Conectado a API de OpenAI")

// Creamos un nuevo "Cliente" (Bot) con Eris
console.log("🔁 Preparando Bot...");
const bot = Eris(`Bot ${process.env.DISCORD_TOKEN}`, {
  intents: ["guilds", "guildMembers", "guildMessages"],
  getAllUsers: true,
});

/*
  botIO es un objeto que simplifica el I/O
  Y le mandamos el prefijo, que en este caso es "sudo"
*/
const botIO = new BotIOManager(bot, openai, "sudo", true);

bot.on("messageCreate", async (msg) => {
  // Chequiamos que A) El mensaje no sea del Bot y B) Que esté usando el prefix
  if (
    msg.author.id !== bot.user.id &&
    msg.content.match(botIO._prefixRegexBuilder(""))
  ) {
    console.log(`💬 ${msg.author.username}: ${msg.content}`); // log() pa ver los mensajes en consola

    // Acomodamos nuestro botIO con los datos del mensaje entrante
    botIO._msg = msg;
    // Acomodamos nuestro botIO con el ID del guild (Servidor) del que lo llaman
    botIO._guildID = msg.guildID

    // Mostramos el mensaje de "Sudo está escribiendo..." en el chat
    botIO.typing();

    let estamos = { melos: false }; // Para frenar al bot de hacer if .. else si ya decidió qué hacer
    responses(botIO, estamos);
    if (!estamos.melos) {
      await commands(botIO, estamos);
    }
  }
});

bot.on("ready", () => {
  console.log(`✅ Bot conectado! Mi nombre es ${bot.user.username}!`);
});

// Connect to Discord
bot.connect();
