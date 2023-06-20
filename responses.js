const setupResponses = (botIO, estamos) => {
  // Listen for the messageCreate event

  // Check if the message content is "ping"
  if (botIO.match("\\s+ping")) {
    // Send a reply with the bot's pong response
    botIO.say("Pong! Latency is...", Date.now() - botIO._msg.timestamp, "ms");
    estamos.melos = true;
    return;
  }

  // https://stackoverflow.com/questions/63705166/how-to-make-the-bot-send-personalized-emojis
  if(botIO.match("\\s+[Pp][Aa]+[Tt]+")) {
    botIO.say('Gracias <:ayase_plead:1120401334953320529> Seguiré esforzándome', '\nhttps://tenor.com/view/anime-pat-gif-19580650')
    estamos.melos = true;
    return;
  }

  if (botIO.match("\\s+[Hh]([eE][lL][lL][oO]|[eE][yY]|[iI])!*")) {
    // Greet the user like a true Rolo
    const greetings = [
      `Hola, ${botIO._msg.author.username}`,
      `¿Quihubo, ${botIO._msg.author.username}?`,
      `¿Quihubo?`,
      `¿Todo bien, ${botIO._msg.author.username}?`,
      `¿Todo bien?`,
      `¿Bien o qué?`,
      `¿Bien o qué, ${botIO._msg.author.username}?`,
      `Epa`,
      `Epa ${botIO._msg.author.username}`,
      `¿Qué se iiceee?`,
      `¿Qué hizo mani?`,
      `¿Qué hiizoooo mani?`,
      `Ahí dándole, uste' sabe`,
      `Dándole, porque ajá`,
      `Dándole, porque qué más`,
      `Ahí haciéndole, porque ajá`,
      `Ahí haciéndole, porque qué más`,
      `Ahí vamos, ${botIO._msg.author.username}`,
      `Ahí vamos`,
      `Pues ahí vamos, ${botIO._msg.author.username}`,
      `Uuuy, manito loco, ¿Todo bien?`,
      `Uuuy, todo bien, manito loco, ¿Y usted?`,
      `Las que sea papi, ¿Cómo me le va?`,
      `Por acá todo bien, ¿Cómo me lo trata la vida, ${botIO._msg.author.username}?`,
    ];

    botIO.say(greetings[Math.floor(Math.random() * greetings.length)]);
    estamos.melos = true;
    return;
  }
};

module.exports = setupResponses;
