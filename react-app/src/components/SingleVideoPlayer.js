import React, {useEffect, useRef, useState} from "react";
import md5 from 'md5';

const VID_REGEX = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

const {YT} = window;

const SingleVideoPlayer = ({url, onPlay, onPause, bigger}) => {
    const [localURL, setLocalURL] = useState(url);
    const [current, setCurrent] = useState(null);
    const playerRef = useRef();
    let player;

    const onPlayerReady = () => {
        const videoId = localURL.match(VID_REGEX)[1];
        player.loadVideoById(videoId);
    }

    const onPlayerStateChange = (event) => {
        if (event.data !== current) {
            setCurrent(event.data);
            switch (event.data) {
                case YT.PlayerState.PLAYING:
                    onPlay(localURL);
                    break;
                case YT.PlayerState.PAUSED:
                    onPause(localURL);
                    break;
            }
        }
    }

    useEffect(() => {
        player = new YT.Player(md5(localURL), {
            height: bigger ? '390' : '110',
            width: bigger ? '640': '210',
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                // 'onError': onPlayerError
            }
        });
    }, [])

    useEffect(() => {
        setLocalURL(url)
    }, [url])

    return (<div id={md5(localURL)} ref={playerRef}/>);
}

SingleVideoPlayer.defaultProps = {
    url: '',
    onPlay: () => {},
    onPause: () => {},
    bigger: false
}

export default SingleVideoPlayer;