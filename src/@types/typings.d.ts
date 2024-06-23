declare const APP_NAME: string;
declare const APP_VERSION: string;
declare const WEBSOCKETS_ENDPOINT:string;

declare const INITIAL_SESSION: Record<string, any>;
declare const AUDIO_FILLERS: any[];

declare module '\*.svg'
{
    import React = require('react');
    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
}