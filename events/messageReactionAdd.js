const Discord = require("discord.js");

// This event executes when a reaction is added to a message
// We will use this to collect Reaction Stats
// We will also use this for the welcome interface

module.exports = async (client, reaction, user) => {
    // Ignore Bot Reactions
    if (user.bot) return

    // Stats
    // To be implemented
    // ....



    // Menu Reactions
    if (reaction.message.embeds[0]) {
        menu.react(client, reaction, user)
    }

    // Report Message via Emoji
    if (reaction.emoji.name === "⚠") flagMessage(client, reaction, user)
};


const flagMessage = (client, reaction, user) => {
    console.log(reaction.users.map(g => g).join("\n"))
    let flagChannel = client.settings.issueTracker;
    const management = reaction.message.guild.roles.get(client.settings.adminRoleID)
    let content = (reaction.message.content.length === 0 ? "No message content" : reaction.message.content);
    let attachments = (reaction.message.attachments.array()[0] ? reaction.message.attachments.array()[0].url : undefined);

    let title = ''
    const fields = [
        [":warning: Flag Count", reaction.count, true],
        [":id: Message ID", reaction.message.id, true],
        [":pencil: Channel", reaction.message.channel.name, true],
        [":clock: Timestamp", new Date(reaction.message.createdTimestamp).toUTCString(), true],
        ["Reporter, ", user.username,true]
    ]
    if(reaction.count >= client.settings.minimumFlag) {
        title = '**Message Flagged For Immediate Review**'
        fields.push(["Issued to", management, true])
    } else {
        title = '**Message Flagged For Review**'
    }

    client.sendembed({
        method: client.channels.get(flagChannel),
        title: `${title} - Flagged ${reaction.count} time(s)`,
        thumb: "https://cdn2.iconfinder.com/data/icons/color-svg-vector-icons-2/512/warning_alert_attention_search-512.png",
        desc: `**Message Contents:**\n ${content}`,
        color: "#f45c41", 
        fields: fields,
        image: attachments
    })
}


