import {useEffect, useRef, useState} from 'react';

const sleepSome = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getSupportedMimeType = () =>
{
    const mimes: string[] = [
        'audio/webm',
        'audio/mpeg',
        'audio/mp4',
        'audio/ogg'
    ];

    return mimes.find(foundMime => MediaRecorder.isTypeSupported(foundMime));
};

export interface TalkButtonProps
{
    canRecord?: boolean;
    recorderDelay?: number;
    onDebugMessage?: (message: string) => void;
    onDataAvailable?: (buffer: ArrayBuffer) => void;
}

const TalkButton = ({
                        canRecord = true,
                        recorderDelay = 750,
                        onDebugMessage,
                        onDataAvailable
                    }: TalkButtonProps) =>
{
    const [isRecording, setIsRecording] = useState(false);
    const [recorder, setRecorder] = useState<MediaRecorder>(null);

    const streamRef = useRef(null);

    //
    //  handle the component unmount scenario
    //
    useEffect(() =>
    {
        return () =>
        {
            if (recorder && recorder.state !== 'inactive')
            {
                recorder.stop();
            }
        };
    }, [recorder]);

    //
    // stopping the recording and disposing of resources
    //
    const stopRecording = () =>
    {
        if (recorder)
        {
            recorder.stop();
            setRecorder(null);
        }

        if (streamRef.current)
        {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        setIsRecording(false);
    };

    const runVoiceInput = async () =>
    {
        const supportsUserMedia = !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia;

        if (!supportsUserMedia && onDebugMessage)
        {
            onDebugMessage('Device does not support navigator.mediaDevices.getUserMedia');
        }

        // @ts-ignore
        navigator.permissions.query({name: 'microphone'}).then(function (result)
        {
            if (onDebugMessage)
            {
                onDebugMessage(`Microphone permission: ${result.state}`);
            }

            result.onchange = function ()
            {
                if (onDebugMessage)
                {
                    onDebugMessage(`Microphone permission changed: ${result.state}`);
                }
            };
        });

        if (!streamRef.current)
        {
            try
            {
                if (navigator.mediaDevices?.getUserMedia)
                {
                    streamRef.current = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            sampleRate: 48000,
                            noiseSuppression: false,
                            autoGainControl: false
                        }
                    });

                    await sleepSome(recorderDelay);
                }
            }
            catch (e)
            {
                if (onDebugMessage)
                {
                    onDebugMessage(`Error getting user media: ${e}`);
                }
                return;
            }
        }

        if (isRecording)
        {
            stopRecording();
        }
        else
        {
            setIsRecording(true);

            const mediaRecorder = new MediaRecorder(streamRef.current, {
                mimeType: getSupportedMimeType(),
                audioBitsPerSecond: 256000
            });

            setRecorder(mediaRecorder);

            mediaRecorder.ondataavailable = async event =>
            {
                if (event.data.size > 0)
                {
                    if (onDebugMessage)
                    {
                        onDebugMessage(`Data available: ${event.data.size}`);
                    }

                    // Convert event.data from 'audio/mp4' to 'audio/wav'
                    const arrayBuffer = await event.data.arrayBuffer();

                    if (onDataAvailable)
                    {
                        onDataAvailable(arrayBuffer);
                    }
                }
            };

            mediaRecorder.start();

            console.log('Recording started:', mediaRecorder);
        }
    };

    return <>
        {canRecord && <button onClick={runVoiceInput}
                              className={isRecording ? 'button-talk button-talk-online' : 'button-talk'}>
            <img alt={'Click to record'}
                 className={'button-icon'}
                 src={isRecording ? 'https://api.iconify.design/carbon:microphone-off.svg?color=%23ffffff' : 'https://api.iconify.design/carbon:microphone.svg?color=%23ffffff'}/>
        </button>}

        {!canRecord &&
            <div className={'button-talk button-talk-offline'}>
                <img alt={'Click to record'}
                     className={'button-icon'}
                     src={'https://api.iconify.design/carbon:microphone-off.svg?color=%23ffffff'}/>
            </div>}
    </>;
};
export default TalkButton;