import shuffleArray from '@/utils/shuffleArray';

// Helper function to decode audio data
async function decodeAudioData(arrayBuffer)
{
    const audioContext = new (window.AudioContext || window['webkitAudioContext'])();
    return new Promise((resolve, reject) =>
    {
        audioContext.decodeAudioData(arrayBuffer, resolve, reject);
    });
}

function writeString(view, offset, string_data)
{
    for (let i = 0; i < string_data.length; i++)
    {
        view.setUint8(offset + i, string_data.charCodeAt(i));
    }
}

// Helper function to encode WAV
function encodeWAV(audioBuffer)
{
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const length = audioBuffer.length * numberOfChannels * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    const channels = [];

    let offset = 0;

    // Write WAV header
    writeString(view, offset, 'RIFF');
    offset += 4;
    view.setUint32(offset, 36 + audioBuffer.length * 2, true);
    offset += 4;
    writeString(view, offset, 'WAVE');
    offset += 4;
    writeString(view, offset, 'fmt ');
    offset += 4;
    view.setUint32(offset, 16, true);
    offset += 4;
    view.setUint16(offset, 1, true);
    offset += 2;
    view.setUint16(offset, numberOfChannels, true);
    offset += 2;
    view.setUint32(offset, sampleRate, true);
    offset += 4;
    view.setUint32(offset, sampleRate * 4, true);
    offset += 4;
    view.setUint16(offset, numberOfChannels * 2, true);
    offset += 2;
    view.setUint16(offset, 16, true);
    offset += 2;
    writeString(view, offset, 'data');
    offset += 4;
    view.setUint32(offset, audioBuffer.length * numberOfChannels * 2, true);
    offset += 4;

    // Write interleaved audio data
    for (let i = 0; i < audioBuffer.numberOfChannels; i++)
    {
        channels.push(audioBuffer.getChannelData(i));
    }

    for (let i = 0; i < audioBuffer.length; i++)
    {
        for (let channel = 0; channel < numberOfChannels; channel++)
        {
            const sample = Math.max(-1, Math.min(1, channels[channel][i]));
            view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
            offset += 2;
        }
    }

    return new Blob([buffer], {type: 'audio/wav'});
}

// Helper function to convert MP4 ArrayBuffer to WAV Blob
export async function convertMp4ToWav(arrayBuffer)
{
    try
    {
        const audioBuffer = await decodeAudioData(arrayBuffer);
        return encodeWAV(audioBuffer);
    }
    catch (error)
    {
        console.error('Error during conversion:', error);
        return null;
    }
}

export const playAudio = async arrayBuffer =>
{
    let audioBuffer;
    if ('type' in arrayBuffer && arrayBuffer.type === 'Buffer')
    {
        const audioData = new Uint8Array(arrayBuffer.data);
        audioBuffer = audioData.buffer;
    }
    else
    {
        audioBuffer = arrayBuffer;
    }

    const audioContext = window['SYSTEM_AUDIO_CONTEXT'];
    const playableAudioBuffer = await audioContext.decodeAudioData(audioBuffer);
    const source = audioContext.createBufferSource();
    source.buffer = playableAudioBuffer;
    source.connect(audioContext.destination);
    source.start();
};

export const textToSpeechSynthesis = (text: string) =>
{
    if ('speechSynthesis' in window)
    {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
    else
    {
        console.error('Speech synthesis is not supported in this browser');
    }
};

export const playFillerMessage = async () =>
{
    if (AUDIO_FILLERS.length > 0)
    {
        const randomIdx = Math.floor(Math.random() * AUDIO_FILLERS.length);
        shuffleArray(AUDIO_FILLERS);
        await playAudio(AUDIO_FILLERS[randomIdx]);
    }
};