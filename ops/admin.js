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
  options = { deleteMessageDays: 0, reason: "No reason provided" }
) => {
  const date=  new Date(Date.now() + 1 * 60 * 1000);
  botIO._bot.guilds.get(botIO._msg.guildID).editMember(mention,{communicationDisabledUntil: date});
  //console.log(botIO._bot.guilds.get(botIO._msg.guildID));
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
  //falta validaciones de user
  const user = botIO._bot.guilds.get(botIO._msg.guildID).editMember(mention, { mute: true });
  console.log(user);
  
};
module.exports = { banMemberFromMention, unbanMemberFromQuery, muteMemberFromMention };
