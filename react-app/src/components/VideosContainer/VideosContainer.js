import React, {useEffect, useState} from "react";
import validator from "validator";
import {Button, Col, FormControl, FormGroup, Row} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import MultiVideoPlayer from "../MultiVideoPlayer";
import './VideosContainer.scss'


const VideosContainer = ({isVideoAPIReady, onPausePlay, playlist, socket, roomName}) => {
    const [localIsVideoAPIReady, setLocalIsVideoAPIReady] = useState(isVideoAPIReady);
    const [youtubeURL, setYoutubeURL] = useState('');
    const [localPlaylist, setLocalPlaylist] = useState(playlist);

    useEffect(() => {
        setLocalIsVideoAPIReady(isVideoAPIReady);
    }, [isVideoAPIReady])
    useEffect(() => {
        setLocalPlaylist(localPlaylist);
    }, [playlist])

    const setYoutubeUrl = (event) => {
        setYoutubeURL(event.target.value);
    }

    const addToPlaylist = () => {
        if (validator.isURL(youtubeURL) && playlist.indexOf(youtubeURL.trim()) === -1) {
            socket.emit('add-to-playlist', {youtubeURL, roomName})
        } else {
            NotificationManager.error(
                'Please use valid/unique youtube video url for playlist.',
                'Error!'
            );
        }
    }

    return (
        <Col md={8} className="videos-container">
            <Row>
                <Col md={12}>
                    {
                        localIsVideoAPIReady && (
                            <>
                                <Row className="row-item">
                                    <FormGroup>
                                        <FormControl
                                            style={{width: '30rem'}}
                                            value={youtubeURL}
                                            type="text"
                                            placeholder="Enter youtube video url"
                                            onInput={setYoutubeUrl}
                                        />
                                    </FormGroup>
                                </Row>
                                <Row className="row-item">
                                    <Button style={{marginRight: '1rem'}} size='lg' variant="outline-secondary"
                                            onClick={addToPlaylist}>Clear</Button>
                                    <Button size='lg' variant="success" onClick={addToPlaylist}>Go</Button>
                                </Row>
                                <MultiVideoPlayer
                                    onPlay={(src) => onPausePlay(src, 'played')}
                                    onPause={(src) => onPausePlay(src, 'paused')}
                                    srcList={localPlaylist}
                                />
                            </>
                        )
                    }
                </Col>
            </Row>
        </Col>
    )
}

export default VideosContainer;