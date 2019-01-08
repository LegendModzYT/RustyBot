const Discord = require('discord.js');
const fetch = require('node-fetch');
const Turndown = require('turndown');

// init  && config
const TD = new Turndown();
fetch.promise = Promise;
const baseUrl = 'https://developer.mozilla.org/en-US/search.json/';
const mdnTopics = [
  {
    name: 'html',
    pages: 41
  },
  {
    name: 'css',
    pages: 117
  },
  {
    name: 'js',
    pages: 127
  },
  {
    name: 'api',
    pages: 594
  }
];

TD.addRule('mark', {
  filter: ['mark'],
  replacement: function(content) {
    return '`' + content + '`';
  }
});

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['m', 'moz', 'docs'],
  permLevel: 'User'
};

exports.help = {
  name: 'mdn',
  category: 'Miscelaneous',
  description: 'Search Docs from MDN',
  usage: 'mdn random | mdn search [QUERY]'
};

// __main__
let fields, result;
exports.run = (client, message, args) => {
  // eslint-disable-line no-unused-vars

  if (args[0] === 'random') {
    let randomTopic = mdnTopics[Math.floor(Math.random() * mdnTopics.length)];
    let randomPage = Math.ceil(Math.random() * randomTopic.pages);
    fetch(`${baseUrl}?topic=${randomTopic.name}&page=${randomPage}`)
      .then(res => res.json())
      .then(res => {
        documents = res.documents;
        result = documents[Math.floor(Math.random() * documents.length)];
        fields = [
          ['Docs', result.url || 'NA', true],
          ['Tags', result.tags.join(' · ') || 'NA', true]
        ];

        return client.sendembed({
          method: message.channel,
          title: 'Result For ' + result.title,
          thumb: client.user.avatarURL,
          desc: TD.turndown(result.excerpt) || 'NA',
          fields: fields,
          color: '#d30f65'
        });
      });
  } else if (args[0] === 'search') {
    // checks if it has a search query
    if (!args[1])
      return client.sendembed({
        method: message.channel,
        title: 'No Search Query Detected',
        thumb: client.user.avatarURL,
        desc:
          'You have to provide a search query. For example, `mdn Array.prototype.slice()`. For a random search, you can use `mdn random`',
        color: '#d30f65'
      });
    // else search for docs
    else searchMDNDocs(args, client, message);
  }
};

/** Get the search term as param and send back the embed
 * @param {Array} query
 * @param {Object} cliemt
 * @param {Object} message
 */
const searchMDNDocs = (query, client, message) => {
  let result, fields;
  fetch(baseUrl + '?topic=javascript,html,css&q=' + createSearchQuery(query))
    .then(res => res.json())
    .then(res => {
      // if no data from MDN
      if (res.documents.length === 0) {
        return client.sendembed({
          method: message.channel,
          title: 'Nothing Found',
          desc:
            "Couldn't find anything in MDN. Maybe try something else? :thinking:",
          color: '#b90900'
        });
      }

      // return search result
      result = res.documents[0];
      fields = [
        ['Docs ', result.url || 'NA', false],
        ['Tags', result.tags.join(' · ') || 'NA', false]
      ];

      return client.sendembed({
        method: message.channel,
        title: 'Result For ' + result.title,
        thumb: client.user.avatarURL,
        color: '#078400',
        desc: TD.turndown(result.excerpt) || 'NA',
        fields: fields
      });
    });
};

/** create a search query by joining all args
 * @param {Array} argArr
 */

const createSearchQuery = argArr => {
  argArr.shift();
  return argArr.join(' ');
};

// [
//   'api',
//   'addons',
//   'css',
//   'canvas',
//   'firefox',
//   'firefox-fs',
//   'games',
//   'html',
//   'http',
//   'js',
//   'marketplace',
//   'mathml',
//   'mobile',
//   'apps',
//   'svg',
//   'webdev',
//   'standards',
//   'webext',
//   'webgl',
//   'docs',
//   'xpcom',
//   'xui'
// ];
