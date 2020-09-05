import React, {useEffect, useState} from "react";
import {Modal} from 'react-bootstrap';

/**
 *
 * Renders a Error modal if app encounter any error.
 */

const ErrorModal = ({show, errorMessage}) => {
    const [localErrorMessage, setLocalErrorMessage] = useState(errorMessage);
    const [localShow, setLocalShow] = useState(errorMessage);

    useEffect(() => {
        setLocalShow(show);
    }, [show]);

    useEffect(() => {
        setLocalErrorMessage(errorMessage);
    }, [errorMessage]);

    return (
        <Modal show={localShow}>
            <Modal.Header>
                <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 className="text-center">{localErrorMessage}</h5>
            </Modal.Body>
        </Modal>
    );
}

export default ErrorModal;
