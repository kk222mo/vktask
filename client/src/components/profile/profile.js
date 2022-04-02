import React, { useEffect } from "react";
import "@vkontakte/vkui/dist/vkui.css";
import {Group, SimpleCell, Input, Button, Header} from "@vkontakte/vkui";
import { Icon56UserCircleOutline } from '@vkontakte/icons';
import "./profile.css";
import Feed from "../feed/feed";
import "../animations/roller.css"

const errors = require("../errors");

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: "...",
            error: null,
        };
    }

    logout = () => {
        fetch("/logout", {
            method: "POST",
        }).then(() => {
            window.location.reload();
        });
    }

    whoami = () => {
        fetch("/whoami")
            .then(errors.errorCheck(this))
            .then((data) => {
                console.log(data);
                if (data['result'] == 'authorized') {
                    var us = data['user'];
                    this.setState({
                        user: us,
                    });
                } else {
                    console.log("Не получить данные о пользователе!");
                }
            });
    }

    componentDidMount() {
        this.whoami();
    }

    render() {
        return (
            <div>{this.state.user.userName && (<div className="profileMainDiv">
                <Group mode="plain">
                    <div className="profileHeader">
                        <div className="profileInfo">
                            <Icon56UserCircleOutline/>
                            <div className="userName">{this.state.user ? this.state.user.userName : "..."}</div>
                        </div>
                        <div className="buttons">
                            <Button onClick={(e) => this.logout()}>Выйти</Button>
                        </div>
                    </div>
                </Group>
                <Group mode="plain">
                    {this.state.user._id && (<Feed user={this.state.user._id}/>)}
                </Group>
            </div>)}
            {!this.state.user.userName && (
                <div>
                    {!this.state.error &&(<div className="loadOuter">
                        <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    </div>)}
                    {this.state.error && (
                        <SimpleCell disabled={true} align="center">{this.state.error}</SimpleCell>
                    )}
                </div>
            )}
            </div>
            
        );
    }
}

<Profile />

export default Profile;