import Zenitsu from "../../Utils/Classes/client.js";
import svg from 'node-svg2img'
import util from 'util';
const { promisify } = util;
import fs from 'fs/promises';
const { writeFile } = fs;
import path from 'path';
const { join } = path;
import axios from 'axios'
import light from 'discord.js-light';
import common from '../../Utils/Functions/commons.js';
const res = common(import.meta.url);
const __dirname: string = res.__dirname;
const messages: {
    type: light.ActivityType;
    name: string
}[] =
    [{
        name: 'nezuko',
        type: 'WATCHING'
    },
    {
        name: 'with tanjiro',
        type: 'PLAYING'
    },
    {
        name: 'kimetsu no yaiba',
        type: 'WATCHING'
    },
    {
        name: 'Thunder Breathing First Form...',
        type: 'WATCHING'
    },
    {
        name: 'nezuko sing',
        type: 'LISTENING'
    }];

function generateStatus(): { type: light.ActivityType, name: string } {

    return messages[Math.floor(Math.random() * messages.length)];

}

async function get() {

    const fetch: string = await axios(`https://github.com/marcrock22/zenitsu`).then(res => res.data);
    const arr = fetch.split('js-details-container Details')
    return arr[arr.length - 1].match(/title="(([A-Z])|\.){1,99}".data-/gmi).map(item => item.slice(7).slice(0, -7)).slice(0)

}
async function event(client: Zenitsu): Promise<void> {

    const buffer = (await promisify(svg)(`https://top.gg/api/widget/721080193678311554.svg`, {})) as Buffer
    const path = join(__dirname, '..', '..', '..', 'Images', 'topgg.png');
    await writeFile(path, buffer);
    let status = generateStatus();
    client.setPresence(status.name, status.type);
    console.log(`${client.user.tag} está listo :):):):):).`)

    setInterval(async () => {
        //Status
        status = generateStatus()
        client.setPresence(status.name, status.type);

        //Post stats to top.gg
        client.dbl.postStats(client.guilds.cache.size);


    }, ((60 * 30) * 1000));//30m

    const webhook = await ((await client.channels.fetch(`832735151309848596`) as light.TextChannel)).fetchWebhooks().then(we => we.first())

    const preRes = await get();
    const res = [];
    const emojis: {
        [x: string]: string
    } = {
        Images: `📁`,
        src: `😋`,
        handler: `⛏`,
        '.eslintrc.json': `🗃️`,
        '.gitignore': `👁️`,
        'Aptfile': `❓`,
        'COMIC.TTF': `📰`,
        LICENSE: `👮‍♀️`,
        'Minecrafter.Reg.ttf': `📰`,
        'OpenSansEmoji.ttf': `📰`,
        'README.md': `👉`,
        'package.json': `🗃️`,
        'tsconfig.json': `🗃️`
    };

    for (const file of preRes) {

        const papush = (emojis[file]) ? `${emojis[file]} ${file}` : file;

        res.push(papush);

    }

    client.editWebhookMessage({
        id: webhook.id,
        token: webhook.token,
        messageID: '834586549781135380',
        data: {
            content: '```' + res.join('\n') + '```', embeds: [{
                description: `Source code: https://github.com/marcrock22/zenitsu`
            }]
        }
    })

}

export default event;