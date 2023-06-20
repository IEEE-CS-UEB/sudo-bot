const fetchUtils = require("./fetchUtils");
const cssUtils = require("./cssStuff");
const lunr = require("lunr");

const addRoleToMemberFromQuery = async (
  botIO,
  mention,
  query,
  options = { reason: "No reason provided" }
) => {
  await fetchUtils.updateGuildMembers(botIO._bot, botIO._msg.guildID);

  // get role id from query
  const availableRoles = await botIO._bot.guilds.get(botIO._msg.guildID).roles;

  console.log(availableRoles);

  const lunrIdx = lunr(function () {
    this.ref("id");
    this.field("name");

    availableRoles.forEach(function (role) {
      this.add({ id: role.id, name: role.name });
    }, this);
  });

  const roleSearch = lunrIdx.search(query);

  // extract id from mention and ban user with options
  // console.log("parsed ID from mention -> " + mention.replace(/\<\@|\>/gm, ""));
  console.log(roleSearch[0]);

  try {
    botIO._bot.guilds
      .get(botIO._msg.guildID)
      .addMemberRole(
        mention.replace(/\<\@|\>/gm, ""),
        roleSearch[0].ref,
        (reason = options.reason)
      );
    botIO.say(
      `${
        botIO._bot.guilds
          .get(botIO._msg.guildID)
          .members.get(mention.replace(/\<\@|\>/gm, "")).username
      } ahora tiene el rol ${
        botIO._bot.guilds.get(botIO._msg.guildID).roles.get(roleSearch[0].ref)
          .name
      }!`
    );
  } catch (Error) {
    botIO.say(
      `No encontré un rol con el nombre '${query}'\nMal ahí manito, ojo con la ortografía`
    );
  }
};

const removeMemberRoleFromQuery = async (
  botIO,
  mention,
  query,
  options = { reason: "No reason provided" }
) => {
  await fetchUtils.updateGuildMembers(botIO._bot, botIO._msg.guildID);

  // get role id from query
  const availableRoles = await botIO._bot.guilds.get(botIO._msg.guildID).roles;

  console.log(availableRoles);

  const lunrIdx = lunr(function () {
    this.ref("id");
    this.field("name");

    availableRoles.forEach(function (role) {
      this.add({ id: role.id, name: role.name });
    }, this);
  });

  const roleSearch = lunrIdx.search(query);

  // extract id from mention and ban user with options
  // console.log("parsed ID from mention -> " + mention.replace(/\<\@|\>/gm, ""));
  console.log(roleSearch[0]);

  try {
    botIO._bot.guilds
      .get(botIO._msg.guildID)
      .removeMemberRole(
        mention.replace(/\<\@|\>/gm, ""),
        roleSearch[0].ref,
        (reason = options.reason)
      );
    botIO.say(
      `${
        botIO._bot.guilds
          .get(botIO._msg.guildID)
          .members.get(mention.replace(/\<\@|\>/gm, "")).username
      } ya NO tiene el rol ${
        botIO._bot.guilds.get(botIO._msg.guildID).roles.get(roleSearch[0].ref)
          .name
      }!`
    );
  } catch (Error) {
    botIO.say(
      `No encontré un rol con el nombre '${query}'\nMal ahí manito, ojo con la ortografía`
    );
  }
};

// TODO: Meterle más funciones bacanas a esta joda (Permisos, etc.)
const createRole = async (
  botIO,
  name,
  options = { color, reason: "No reason provided" }
) => {
  if (options.color) {
    let parsedColor;

    try {
      parsedColor = cssUtils.parseRGB(options.color);
    } catch (err) {
      console.log(err);
    }

    if (!parsedColor) {
      try {
        parsedColor = cssUtils.parseHEX(options.color);
      } catch (err) {
        console.log(err);
      }
    }

    // El último error no se catchea para elevarlo y que Sudo lo reporte al usuario
    if (!parsedColor) {
      parsedColor = cssUtils.parseCSSColorName(options.color);
    }

    console.log("⚙️  Parsed Color : " + parsedColor.toString(16));

    botIO._bot.guilds.get(botIO._msg.guildID).createRole(
      {
        name: name,
        color: parsedColor,
      },
      (reason = options.reason)
    );
    botIO.say(`Se creó el rol '${name}' con el color ${options.color}`);
  } else {
    botIO._bot.guilds
      .get(botIO._msg.guildID)
      .createRole({ name: name }, (reason = options.reason));
    botIO.say(`Se creó el rol ${name} con el color por defecto`);
  }
};

module.exports = {
  addRoleToMemberFromQuery,
  removeMemberRoleFromQuery,
  createRole,
};
