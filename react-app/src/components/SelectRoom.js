import React, {useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal'
import {Button, FormGroup, FormControl} from "react-bootstrap";

const SelectRoom = ({roomSelectModalShow, setRoom, setUserName, addOrSelectRoom}) => {
    const [localRoomSelectModalShow, setLocalRoomSelectModalShow] = useState(roomSelectModalShow);
    useEffect(() => {
        setLocalRoomSelectModalShow(roomSelectModalShow);
    }, [roomSelectModalShow])
    return (
        <Modal className="in" centered show={localRoomSelectModalShow} onHide={() => {setLocalRoomSelectModalShow(false)}}>
            <Modal.Header>
                <Modal.Title>Please enter room name to get started</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup>
                    <FormControl
                        type="text"
                        placeholder="Enter room name..."
                        onInput={setRoom}
                    />
                </FormGroup>
                <FormGroup>
                    <FormControl
                        type="text"
                        placeholder="Enter username..."
                        onInput={setUserName}
                    />
                </FormGroup>
                <Button size='lg' variant="success" onClick={addOrSelectRoom}>Go</Button>
            </Modal.Body>
        </Modal>
    )
}

export default SelectRoom;