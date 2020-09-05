import React, {useState, useEffect} from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import {Row} from 'react-bootstrap';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {NavBar, ErrorModal, LoadingModal, SelectRoom, Feeds, VideosContainer} from './components';
import 'react-chat-elements/dist/main.css';
import 'react-notifications/lib/notifications.css';
import './App.scss';


/**
 * Fetches socket server URL from env
 */
const SOCKET_URI = process.env.REACT_APP_SERVER_URI;

/**
 * App Component
 *
 * initiaites Socket connection and handle all cases like disconnected,
 * reconnected again so that user can send messages when he is back online
 *
 * handles Error scenarios if requests from Axios fails.
 *
 */

const App = () => {
    const [socket, setSocket] = useState(null)
    let [roomSelectModalShow, setRoomSelectModalShow] = useState(false);
    let [user, setUser] = useState(null); // Signed-In User
    let [error, setError] = useState(false);
    let [loading, setLoading] = useState(false);
    let [errorMessage, setErrorMessage] = useState('');
    let [roomName, setRoomName] = useState('');
    let [userName, setUserName] = useState('');
    let [feeds, setFeeds] = useState([]);
    let [isVideoAPIReady, setIsVideoAPIReady] = useState(false);
    let [playlist, setPlaylist] = useState([]);

    const initSocketConnection = () => {
        setSocket(io.connect(SOCKET_URI));
    }

    /**
     *
     * Checks if request from axios fails
     * and if it does then shows error modal.
     */
    const initAxios = () => {
        axios.interceptors.request.use(
            config => {
                setLoading(true);
                return config;
            },
            error => {
                setLoading(false);
                setError(true);
                setErrorMessage(`Couldn't connect to server. try refreshing the page.`)
                return Promise.reject(error);
            }
        );
        axios.interceptors.response.use(
            response => {
                setLoading(false)
                return response;
            },
            error => {
                setLoading(false);
                setError(true);
                setErrorMessage(`Some error occurred. try after sometime.`)
                return Promise.reject(error);
            }
        );
    }

    /**
     *
     * Shows error if client gets disconnected.
     */
    const onClientDisconnected = () => {
        NotificationManager.error(
            'Connection Lost from server please check your connection.',
            'Error!'
        );
    }

    /**
     *
     * Established new connection if reconnected.
     */
    const onReconnection = () => {
        if (user) {
            socket.emit('select-or-add-room', {userName, roomName});
            NotificationManager.success('Connection Established.', 'Reconnected!');
        }
    }

    /**
     *
     * Setup all listeners
     */

    const setupSocketListeners = () => {
        if (socket) {
            socket.on('add-to-playlist', onAddToPlaylist);
            socket.on('select-or-add-room', onSelectOrAddRoomReceived);
            socket.on('feed', onFeedReceived);
            socket.on('reconnect', onReconnection);
            socket.on('disconnect', onClientDisconnected);
        }
    }

    /**
     *
     * Setups Axios to monitor XHR errors.
     * Initiates and listen to socket.
     */

    useEffect(() => {
        setupSocketListeners();
        initAxios();
        initSocketConnection();
        setRoomSelectModalShow(true);
        window.onYouTubeIframeAPIReady = () => {
            setIsVideoAPIReady(true)
        }
        return () => {
            setSocket(null);
        }
    }, [])


    useEffect(() => {
        if (socket) {
            setupSocketListeners();
        }
    }, [socket]);


    /**
     *
     * @param {SelectOrAddRoomReceivedFromSocket} roomMessage
     *
     * Triggered when message is received.
     * It can be a message from user himself but on different session (Tab).
     * so it decides which is the position of the message 'right' or 'left'.
     *
     * increments unread count and appends in the messages array to maintain Chat History
     */

    const onSelectOrAddRoomReceived = (roomMessage) => {
        setRoomSelectModalShow(false);
        setUser(roomMessage);
    }

    /**
     *
     * @param {feedReceivedFromSocket} feed
     *
     * Triggered when feed is received.
     * It can be any activity from other users..
     *
     */

    const onFeedReceived = (feed) => {
        feeds.push(feed)
        setFeeds([...feeds])
    }

    /**
     *
     * @param {playlistItem} message
     *
     * Triggered when feed is received.
     * It can be any activity from other users..
     *
     */

    const onAddToPlaylist = (message) => {
        if (message.removed) {
            playlist = playlist.filter((play) => play !== message.removed);
        }
        playlist.push(message.added)
        setPlaylist([...playlist]);
    }


    /**
     *
     * @param {feedReceivedFromSocket} feed
     *
     * Local state setter
     *
     */


    const setRoom = (event) => {
        event.persist();
        setRoomName(event.target.value)
    }

    const setUserNam = (event) => {
        event.persist();
        setUserName(event.target.value)
    }

    /**
     *
     * Event emits from client to server
     *
     */

    const addOrSelectRoom = () => {
        socket.emit('select-or-add-room', {userName, roomName})
    }

    const onPausePlay = (src, action) => {
        socket.emit('feed', {userName, roomName, message: `${userName} ${action} ${src}`});
    }

    return (
        <div>
            <NavBar signedInUser={user}/>
            <Row>
                <Feeds feeds={feeds}/>
                <VideosContainer
                    isVideoAPIReady={isVideoAPIReady}
                    onPausePlay={onPausePlay}
                    playlist={playlist}
                    roomName={roomName}
                    socket={socket}
                />
            </Row>

            <SelectRoom
                addOrSelectRoom={addOrSelectRoom}
                roomSelectModalShow={roomSelectModalShow}
                setRoom={setRoom}
                setUserName={setUserNam}
            />
            <ErrorModal
                show={error}
                errorMessage={errorMessage}
            />
            <LoadingModal show={loading}/>
            <NotificationContainer/>
        </div>
    );
}

export default App;
