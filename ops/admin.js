const fetchUtils = require("./fetchUtils");
const lunr = require("lunr");
const Eris = require("eris");

const banMemberFromMention = async (
  botIO,
  mention,
  options = { deleteMessageDays: 0, reason: "No reason provided" }
) => {
  await fetchUtils.updateGuildMembers(botIO._bot, botIO._msg.guildID);
  // extract id from mention and ban user with options
  // console.log("parsed ID from mention -> " + mention.replace(/\<\@|\>/gm, ""));
  botIO._bot.guilds
    .get(botIO._msg.guildID)
    .banMember(
      mention.replace(/\<\@|\>/gm, ""),
      (deleteMessageDays = options.deleteMessageDays),
      (reason = options.reason)
    );
  botIO.say(
    stutter.kobeniStutterString(
      `Banned ${
        botIO._bot.guilds
          .get(botIO._msg.guildID)
          .members.get(mention.replace(/\<\@|\>/gm, "")).username
      }!`
    )
  );
};

const unbanMemberFromQuery = async (
  botIO,
  query,
  options = { reason: "No reason provided" }
) => {
  // console.log(await botIO._bot.guilds.get(botIO._msg.guildID).getBans());

  // extract user from query and look for id
  const bannedUsers = await botIO._bot.guilds.get(botIO._msg.guildID).getBans();

  const lunrIdx = lunr(function () {
    this.ref("id");
    this.field("id");
    this.field("username");
    this.field("discriminator");

    bannedUsers.forEach(function (bu) {
      this.add(bu.user);
    }, this);
  });

  // console.log("parsed query -> " + query.replace(/\@|\<|\>/gm, ""));
  const bannedSearch = lunrIdx.search(query.replace(/\@|\<|\>/gm, ""));

  /*
  console.log("bannedSearch[0] ->");
  console.log(bannedSearch);
  console.log("id ->");
  console.log(bannedSearch[0].ref);
  console.log("User to Unban ->");
  */

  const userToUnban = bannedUsers.find(
    (u) => u.user.id === bannedSearch[0].ref
  );

  // console.log(userToUnban);

  botIO._bot.guilds
    .get(botIO._msg.guildID)
    .unbanMember(bannedSearch[0].ref, (reason = options.reasons));
  botIO.say(
    stutter.kobeniStutterString(
      `Unbanned ${`${userToUnban.user.username}#${userToUnban.user.discriminator}`}, since they were the closest match to `
    ),
    query,
    stutter.kobeniStutterString(`in the list of banned users!`)
  );
};

const isolateMemberFromMention = (
  botIO,
  mention,
  time,
  options = { deleteMessageDays: 0, reason: "No reason provided" }
) => {
  try {
    if(time>0||time.isNumeric){
    const user =botIO._bot.guilds.get(botIO._msg.guildID).members.get(mention).username;
    const min = time * 60 * 1000;
    const date=  new Date(Date.now() + min);
    botIO._bot.guilds.get(botIO._msg.guildID).editMember(mention,{communicationDisabledUntil: date});
    botIO.say(
      `Usuario ${user} esta aislado`
    );
  }else{
    botIO.say(
      `El tiempo esta mal ingresado debe ser numerico y mayor a 0`
    );
  }
  } catch (error) {
    botIO.say(
      `Error: no existe el usuario`
    );
  }
  
};
const outIsolateMemberFromMention = (
  botIO,
  mention,
  options = { deleteMessageDays: 0, reason: "No reason provided" }
) => {
  try {
    const user =botIO._bot.guilds.get(botIO._msg.guildID).members.get(mention).username;
    botIO._bot.guilds.get(botIO._msg.guildID).editMember(mention,{communicationDisabledUntil: null});
    botIO.say(
      `Usuario ${user} salio de la estar aislado`
    );
  } catch (e) {
    botIO.say(
      `Error: el usuario no puede ser aislado o no existe el usuario`
    );
  }
  
};
const muteMemberFromMention = (
  botIO,
  mention,
  channel,
  options = { deleteMessageDays: 0, reason: "No reason provided" }
) => {
  const chan =botIO._bot.guilds.get(botIO._msg.guildID).channels.get(channel);
  chan.editPermission(mention, Eris.Constants.Permissions.sendMessages, Eris.Constants.Permissions.none, 1, "No reason provided");  
  console.log(chan.permissionOverwrites);
  //console.log(botIO._bot.guilds.get(botIO._msg.guildID));
};
const muteMemberVoiceFromMention = (
  botIO,
  mention,
  options = { deleteMessageDays: 0, reason: "No reason provided" }
) => {
  try {
    const user =botIO._bot.guilds.get(botIO._msg.guildID).members.get(mention).username;
    botIO._bot.guilds.get(botIO._msg.guildID).editMember(mention, { mute: true });
    botIO.say(
      `Usuario ${user} muteado`
    );
  } catch (error) {
    botIO.say(
      `Error: no existe el usuario`
    );
  }
  
};
const unmuteMemberVoiceFromMention = (
  botIO,
  mention,
  options = { deleteMessageDays: 0, reason: "No reason provided" }
) => {
  try {
    const user =botIO._bot.guilds.get(botIO._msg.guildID).members.get(mention).username;
    botIO._bot.guilds.get(botIO._msg.guildID).editMember(mention, { mute: false });
    botIO.say(
      `Usuario ${user} ya puede hablar`
    );
  } catch (error) {
    botIO.say(
      `Error: no existe el usuario`
    );
  }
  
};
const unmuteMemberVoiceEvery = (
  botIO,
  options = { deleteMessageDays: 0, reason: "No reason provided" }
) => {
  try {
    const user =botIO._bot.guilds.get(botIO._msg.guildID).voiceStates;
    for (let [key, value] of user) {
      botIO._bot.guilds.get(botIO._msg.guildID).editMember(key, { mute: false });
    }
    
    botIO.say(
      `Todo los usuarios puede hablar`
    );
  } catch (error) {
    botIO.say(
      `Error: intente mas tarde`
    );
  }
  
};
const muteMemberVoiceEvery = (
  botIO,
  options = { deleteMessageDays: 0, reason: "No reason provided" }
) => {
  try {
    const user =botIO._bot.guilds.get(botIO._msg.guildID).voiceStates;
    for (let [key, value] of user) {
      botIO._bot.guilds.get(botIO._msg.guildID).editMember(key, { mute: true });
    }
    botIO.say(
      `Todo los usuarios estan muteados`
    );
  } catch (error) {
    botIO.say(
      `Error: intente mas tarde`
    );
  }
  
};
const muteMemberVoiceEveryBut = (
  botIO,
  mention,
  options = { deleteMessageDays: 0, reason: "No reason provided" }
) => {
  try {
    const user =botIO._bot.guilds.get(botIO._msg.guildID).members.get(mention).username;
    const users =botIO._bot.guilds.get(botIO._msg.guildID).voiceStates;
    for (let [key, value] of users) {
      console.log(key+"ds"+mention);
      if(key!=mention){
      botIO._bot.guilds.get(botIO._msg.guildID).editMember(key, { mute: true });
    }
    }
    botIO.say(
      `Todo los usuarios estan muteados, menos ${user} `
    );
  } catch (error) {
    botIO.say(
      `Error: intente mas tarde`
    );
  }
  
};
module.exports = {outIsolateMemberFromMention,muteMemberVoiceEvery,muteMemberVoiceEveryBut, banMemberFromMention, unbanMemberFromQuery, muteMemberFromMention ,isolateMemberFromMention,muteMemberVoiceFromMention,unmuteMemberVoiceFromMention, unmuteMemberVoiceEvery};
