import React, { useEffect } from "react";
import "@vkontakte/vkui/dist/vkui.css";

import Login from "./login";
import Register from "./register";
import { Button, Group } from "@vkontakte/vkui";


class Auth extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            pageSelected: 0,
        };
    }

    componentDidMount() {
        this.setState({
            pageSelected: 0,
        });
    }

    changeMode() {
        this.setState({
            pageSelected: this.state.pageSelected == 1 ? 0 : 1,
        });
    }

    render() {
        return (<div className="loginDiv">
                    {this.state.pageSelected == 0 ? (<Login/>) : (<Register/>)}
                    <div style={{height: "10px"}}></div>
                    <Button mode="tertiary" align="center" onClick={(e) => this.changeMode()}>{this.state.pageSelected == 0 ? "Регистрация" : "Войти"}</Button>
                    </div>);
    }


}
<Auth />;

export default Auth;