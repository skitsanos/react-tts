/**
 * Umijs configuration settings
 * Please refer to https://umijs.org/config for more details
 * or contact Evi Skitsanos https://www.linkedin.com/in/skitsanos/
 */
import dayjs from 'dayjs';
import {readdirSync, readFileSync} from 'fs';

import manifest from './package.json';

const audioFillers = [];

for (const file of readdirSync('./assets/audio/')) {
    const fileContent = readFileSync(`./assets/audio/${file}`);
    audioFillers.push(fileContent);
}

export default ({
    title: 'Text to Speech and Voice Synthesis',

    favicons: [],

    styles: [
        'https://fonts.googleapis.com/css?family=IBM+Plex+Mono:400,400i|IBM+Plex+Sans:300,400&display=swap',
        'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap'
    ],

    headScripts: [
        {
            content: 'console.log("Hello from the head! Modify your .umirc.ts")'
        },
        {
            content: 'window.SYSTEM_AUDIO_CONTEXT = new (window.AudioContext || window[\'webkitAudioContext\'])();'
        }
        //'http://unpkg.com/tone'
    ],

    define: {
        // the following are the default values for the application, and they are defined in @types/typings.d.ts
        APP_NAME: 'My Dashboard',
        APP_VERSION: `${manifest.version} (beta/${dayjs().format('YYYY-MM-DD')})`,
        WEBSOCKETS_ENDPOINT: 'http://localhost:3000/chats/voice-llm',

        // prepare your audio files in the assets/audio folder with https://ttsmp3.com/ai
        AUDIO_FILLERS: audioFillers,

        INITIAL_SESSION:
            {
                'session': {
                    'user': {
                        '_key': '177651341',
                        'createdOn': 1696934748132,
                        'email': 'info@skitsanos.com',
                        'lastLogin': 1709038324097,
                        'updatedOn': 1709038324097,
                        'gravatar': 'https://www.gravatar.com/avatar/df4fd31987b27934b23f90da7af2feb7?d=robohash&s=150'
                    },
                    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.IntcInVzZXJJZFwiOlwiMTc3NjUxMzQxXCIsXCJleHBpcmVzT25cIjoxNzA5MDQxOTQ0NTEyfSI.7NsFhzhDPHH0Gf7IObsskxVWL_7Fdge5uWKviV771SE1FN72eeFH04Zet12WWx_Kx_1cmTrffXy7jB777tl8MQ'
                }
            }

    },

    mfsu: {},

    svgr: {},

    deadCode: {},

    devtool: process.env.NODE_ENV === 'development' ? 'eval' : false,

    proxy: {
        // '/api': {
        //     target: 'http://localhost:3000',
        //     changeOrigin: true,
        //     pathRewrite: {'^/api': ''},
        // }
    }
});
