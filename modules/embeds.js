module.exports = (client) => {
    const Discord = require("discord.js");

    /**
    * A simplified function to create message embeds.
    */
    const sendembed = ({ color, title, url, author, thumb, desc, image, footer, fields, method }) => {
        let embedToSend = new Discord.RichEmbed()
        .setColor(color)
        if (title !== undefined) embedToSend.setTitle(title)
        if (url !== undefined) embedToSend.setURL(url)
        if (author !== undefined) embedToSend.setAuthor(author)
        if (thumb !== undefined) embedToSend.setThumbnail(thumb)
        if (desc !== undefined) embedToSend.setDescription(desc)
        if (image !== undefined) embedToSend.setImage(image)
        if (footer !== undefined) embedToSend.setFooter(footer)
        if (fields) {
            fields.forEach((f, i) => {
                embedToSend.addField(f[0], f[1], f[2])
            })
        }

        method.send({ embed: embedToSend });
    }

    client.sendembed = sendembed
}