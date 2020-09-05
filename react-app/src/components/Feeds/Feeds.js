import React, {useEffect, useState} from "react";
import {Col} from "react-bootstrap";
import './Feeds.scss';

const Feeds = ({ feeds }) => {
    const [localFeeds, setLocalFeeds] = useState(feeds);

    useEffect(() => {
        setLocalFeeds(feeds);
    }, [feeds]);

    return (
        <Col md={4} className="feed-pan">
            {localFeeds.map((feed) => (
                <div className="feed">
                    <img
                        alt={feed.userName ? feed.userName :feed.message}
                        src={`https://avatars.dicebear.com/api/bottts/${feed.userName ? feed.userName :feed.message}.svg`}
                    />
                    <h5>{feed.message}</h5>
                </div>
            ))}
        </Col>
    )
}

export default Feeds;