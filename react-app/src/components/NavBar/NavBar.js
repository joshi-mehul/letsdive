import React, {useEffect, useState} from "react";
import {Navbar} from "react-bootstrap";
import './NavBar.scss';

/**
 *
 * Renders top navbar and shows the current signed in user.
 */
const NavBar = ({signedInUser}) => {

    const [localSignedInUser, setLocalSignedInUser] = useState(signedInUser);

    useEffect(() => {
        if (signedInUser) {
            setLocalSignedInUser(signedInUser);
        }
    }, [signedInUser]);

    return (
        <Navbar bg="dark" variant="dark">
            {
                localSignedInUser && (
                    <>
                        <Navbar.Collapse className="justify-content-start">
                            <Navbar.Text>
                                Selected room {localSignedInUser.name}
                            </Navbar.Text>
                        </Navbar.Collapse>
                        <Navbar.Toggle/>
                        <Navbar.Collapse className="justify-content-end">
                            <Navbar.Text>
                                Signed in as:&nbsp;
                                <span className="signed-in-user">{localSignedInUser.userName}</span>
                            </Navbar.Text>
                        </Navbar.Collapse>
                    </>
                )
            }
        </Navbar>
    );
}

NavBar.defaultProps = {
    signedInUser: {
        name: 'test user',
        userName: 'test user',
    }
}

export default NavBar;
