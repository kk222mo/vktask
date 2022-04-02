import React from "react";
import "@vkontakte/vkui/dist/vkui.css";
import {Card, CardGrid} from "@vkontakte/vkui";
import "./post.css";
import { Icon24UserCircleOutline } from '@vkontakte/icons';
import { Icon28DeleteOutline } from '@vkontakte/icons';
const defs = require("../../defaults");


class Post extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            isLiked: false,
            text: props.text,
            author: props.author,
            curUserName: props.curUserName,
            disappearing: false,
        };
    }

    removePost() {
        var id = this.props._id;
        fetch("/deletepost", {
            method: "POST",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({postId: id}),
        }).then((res) => {
            if (res.ok)
                return res.json();
            alert("Во время удаления поста произошла ошибка: " + defs.DEFAULT_ERROR_S);
        })
        .then((data) => {
            console.log(data);
            if (data['result'] == "ok") {
                this.setState({disappearing: true});
                setTimeout(this.props.onUnmount, 1100);
            } else {
                alert("Во время удаления поста произошла ошибка: " + data['reason']);
            }
        });
    }

    render() {
        return (
        <CardGrid size="l" className={this.state.disappearing && ("disappearing")}>
          <Card mode="shadow">
            <div className="postOuter" >
                {this.state.text && this.state.text != "" && (<div className="postText">{this.state.text}</div>)}
                {this.props.imageId && (
                <div className="postImgDiv">
                    <img className="postImg" src={"/media?mediaId=" + this.props.imageId}/>
                </div>
                )}
                <div className="postBottom">
                    <div className="authorProfile"><Icon24UserCircleOutline/>{this.state.author ? this.state.author : "Иван"}</div>
                    <div className="utilOptions" onClick={(e) => this.removePost()}>{this.props.isOwner && (<Icon28DeleteOutline width={20} height={20}/>)}</div>
                    <div className="pubInfo">{this.props.date ? this.props.date : "черт знает когда..."}</div>
                    
                </div>
            </div>
          </Card>
        </CardGrid>);
    }


}

<Post/>;

export default Post;