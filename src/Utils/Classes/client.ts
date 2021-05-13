import common from '../Functions/commons.js';
import path from 'path';
const { join } = path;
import fs from 'fs/promises';
const { readdir } = fs;
const res = common(import.meta.url);
const __dirname: string = res.__dirname;
import eris from 'eris-pluris';
import Collection from './Collection.js'
import dbla from 'dblapi.js'
import LangManager from './langManager.js';
import AfkManager from "./afkManager.js";
import PrefixManager from './prefixManager.js';
import LogsManager from './logsManager.js';
import mongoose from 'mongoose';
const { connect, set, connection } = mongoose;
import Comando from './command.js'
import CANVAS from 'canvas';
const { loadImage } = CANVAS;
import imagenesC from '../Interfaces/imagenes.js';
import listener from './Listener.js';
import Listener from './Listener.js';

class Zenitsu extends eris.Client {

    listener: listener;
    fileTOPGG: Buffer;
    dbl: dbla;
    color: number;
    imagenes: imagenesC;
    lang: LangManager
    prefix: PrefixManager;
    afk: AfkManager;
    logs: LogsManager
    commands: Collection<string, Comando>
    devs: string[]

    constructor(token: string, options: eris.ClientOptions) {
        super(token, options);
    }

    async connect(): Promise<void> {
        await this.init();
        await super.connect();
        return;
    }

    async init(): Promise<this> {
        this.listener = new Listener();
        const file = await fs.readFile(this.rutaImagen('topgg.png'));
        this.fileTOPGG = file;
        this.devs = ['507367752391196682', '577000793094488085', '390726024536653865']
        this.commands = new Collection();
        this.dbl = new dbla(process.env.DBLTOKEN, this);
        this.color = 14720566;
        this.lang = new LangManager();
        this.prefix = new PrefixManager();
        this.afk = new AfkManager();
        this.logs = new LogsManager();
        set('useFindAndModify', false);
        await connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log(`Connected to MONGODB.`));
        await this.loadImages();
        await this.loadEvents();
        await this.loadCommands();
        return this;
    }


    async loadImages(): Promise<imagenesC> {
        this.imagenes = {
            porquelloras: {
                chica: await loadImage(this.rutaImagen(`chica.png`)),
                chico: await loadImage(this.rutaImagen('chico.jpg'))
            },
            nicememe: {
                background: await loadImage(this.rutaImagen('nicememe.png'))
            },
            tictactoe: {
                background: await loadImage(this.rutaImagen(`inicio_tictactoe.gif`)),
                equis: await loadImage(this.rutaImagen(`x_tic.png`)),
                circulo: await loadImage(this.rutaImagen(`o_tic.png`))
            },
            connect4: {
                background: await loadImage(this.rutaImagen('4enraya.png')),
                win: await loadImage(this.rutaImagen('morado_de_4.png')),
                verde: await loadImage(this.rutaImagen('rojo_de_cuatro.png')),
                amarillo: await loadImage(this.rutaImagen('amarillo_de_cuatro.png'))
            }
        }
        return this.imagenes;

    }

    async loadCommands(): Promise<Zenitsu> {

        const ruta = (...str: string[]) => join(__dirname, '..', '..', ...str)
        const load = async (dirs: string) => {
            const commands = (await readdir(ruta('commands', dirs))).filter(d => {
                return d.endsWith('.ts') || d.endsWith('.js');
            });
            for (const file of commands) {
                try {
                    const { default: archivo } = await import(`file:///` + ruta('commands', dirs, file));
                    const instance = new archivo();
                    if (this.commands.has(instance.name)) {
                        console.log(instance)
                        console.warn(`${instance.name} ya existe.`)

                        continue;
                    }

                    this.commands.set(instance.name, instance);
                } catch (e) {
                    console.log(e, file);
                    break;
                }
            }
        };

        const categorys = await readdir(ruta('commands'))

        for (const i of categorys) {

            await load(i);

        }

        return this;

    }

    rutaImagen(str: string): string {
        return join(__dirname, '..', '..', '..', 'Images', str)
    }

    async loadEvents(): Promise<Zenitsu> {

        const ruta = (...str: string[]) => join(__dirname, '..', '..', ...str)
        const load = async (event: string) => {

            const { default: a } = await import(`file:///` + ruta('events', event))

            try {

                this.on(event.split('.')[0], a.bind(null, this));

            }
            catch (e) {
                console.log(event, e.message || e);
            }

        };

        const eventos = await readdir(ruta('events'))

        for (const i of eventos) {

            await load(i);

        }

        return this;

    }


    get private(): string[] {
        return [
            process.env.DISCORD_TOKEN,
            process.env.DBLTOKEN,
            process.env.MONGODB,
            process.env.PASSWORD,
            process.env.PASSWORDDBL,
            process.env.WEBHOOKID,
            process.env.WEBHOOKTOKEN,
            process.env.SHARD_ID,
            process.env.SHARD_TOKEN,
            connection.pass,
            connection.user,
            connection.host,
        ].filter(item => item);
    }

    unMarkdown(texto: string): string {

        return texto.split('*').join(`\\*`).split('`').join("\\`").split('~').join(`\\~`).split('_').join(`\\_`).split('|').join(`\\|`);

    }

}

export default Zenitsu;