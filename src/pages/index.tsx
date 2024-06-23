import {Button, Card, Flex, Form, Input} from 'antd';
import {useState} from 'react';
import {playAudio, playFillerMessage, textToSpeechSynthesis} from '@/utils/audio';
import TalkButton from '@/components/TalkButton';
import {ReadyState} from 'ahooks/es/useWebSocket';

export default () =>
{
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

    const runSpeechSynthesis = async ({text}) =>
    {
        if ('speechSynthesis' in window && text)
        {
            setIsSpeaking(true);

            textToSpeechSynthesis(text);

            setIsSpeaking(false);
        }
    };

    return <Card>

        <Flex vertical={true}>
            <h2>Text to Speech Synthesis</h2>
            <Form onFinish={runSpeechSynthesis}
                  initialValues={{
                      text: 'Hello World!'
                  }}>
                <Flex gap={8}>
                    <Form.Item name={'text'}
                               style={{
                                   width: '100%'
                               }}>
                        <Input placeholder={'Enter text to speak'}
                               allowClear={true}
                        />
                    </Form.Item>
                    <Button htmlType={'submit'}>Speak</Button>
                </Flex>
            </Form>

            <h2>Audio Fillers and Audio Context</h2>
            <Flex gap={8}
                  wrap={true}>
                {AUDIO_FILLERS.map((filler, idx) =>
                {
                    return <Button key={`filler-button${idx}`}
                                   onClick={async () =>
                                   {
                                       await playAudio(filler);
                                   }}>Filler {idx + 1}</Button>;

                })}

                <Button onClick={async () =>
                {
                    await playFillerMessage();
                }}>Play Random filler</Button>
            </Flex>

            <h2>Use Microphone</h2>
            <TalkButton canRecord={true}
                        onDebugMessage={console.log}
                        onDataAvailable={async data =>
                        {
                            console.log(data);
                            await playAudio(data);
                        }}/>
        </Flex>
    </Card>;
};