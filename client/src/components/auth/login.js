import React, { useEffect } from "react";
import "@vkontakte/vkui/dist/vkui.css";
import {Group, FormItem, Input, Button} from "@vkontakte/vkui";
import "./auth.css";
const errors = require("../errors");

const defs = require("../../defaults");

class Login extends React.Component {
    constructor (props) {
        super(props);

        this.uName = React.createRef();
        this.pass = React.createRef();

        this.state = {
            error: null,
        };
    }

    tryToLogin = function() {
        var uName = this.uName.current.value;
        var pass = this.pass.current.value;
        console.log(uName + " " + pass + "11");
        fetch("/login", {
            method: "POST",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({userName: uName, password: pass}),
        }).then(errors.errorCheck(this))
        .then((data) => {
            if (data['result'] == "ok")
                window.location.reload(false);
            else
                errors.displayError(this, data['reason'] ? data['reason'] : defs.DEFAULT_ERROR_S);
        });
    }

    render() {
        return (
        <Group mode="plain">
            <div className="outerContainer">
                <div className="innerContainer">
                    <Input getRef={this.uName} type="text" defaultValue="" placeholder="логин" align="center" className="loginInput"/>
                    <div style={{height: "10px"}}></div>
                    <Input getRef={this.pass} type="password" defaultValue="" placeholder="пароль" align="center" className="loginInput"/>
                    <div style={{height: "10px"}}></div>
                    <Button className="loginBtn" onClick={(e) => this.tryToLogin()}>Войти</Button>
                    {this.state.error && (<div className="credError">{this.state.error}</div>)}
                </div>
            </div>
        </Group>);
    }
}

<Login />;

export default Login;