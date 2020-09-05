import React, {useEffect, useState} from "react";
import {Modal} from 'react-bootstrap';

/**
 *
 * Renders a loader modal.
 */

const LoadingModal = ({show}) => {
    const [localShow, setLocalShow] = useState(show);
    useEffect(() => {
        setLocalShow(show);
    }, [show]);
    return (
        <Modal show={localShow}>
            <Modal.Body>
                <h1 className="text-center">
                </h1>
                <h5 className="text-center">Loading...</h5>
            </Modal.Body>
        </Modal>
    );

}

export default LoadingModal;
