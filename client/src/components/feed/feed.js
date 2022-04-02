import React from "react";
import "@vkontakte/vkui/dist/vkui.css";
import Post from "../post/post";
import {SimpleCell, Button} from "@vkontakte/vkui";
import "./feed.css";
import "../animations/roller.css";

import dateFormat from "dateformat";

import "./feed.css";

const errors = require("../errors");
const defs = require("../../defaults");

const COUNT_PER_PAGE = 15;

class Feed extends React.Component {

    constructor (props) {
        super(props);

        this.isMountedV = 0;

        this.state = {
            posts: [],
            page: 0,
            count: 1000,
            error: null,
        }
    }

    handleUnmount(postId) {
        console.log("Handled unmount of", postId);
        for (var i = 0; i < this.state.posts.length; i++) {
            if (this.state.posts[i]._id == postId) {
                this.state.posts.splice(i, 1);
                this.updateState({posts: this.state.posts});
                break;
            }
        }
    }

    componentDidMount() {
        this.isMountedV = 1;
        this.state.page = -1;
        this.state.posts = [];
        this.state.loaded = false;
        this.loadMore();
    }

    componentWillUnmount() {
        this.isMountedV = 0;
    }

    updateState = (state) => {
        if (this.isMountedV) {
            this.setState(state);
        }
    }

    loadMore = () => {
        console.log(this.state.count);
        var byUser = this.props.user || "";
        console.log(this.props.user);
        if ((this.state.page + 1) >= Math.ceil(this.state.count / COUNT_PER_PAGE))
            return;
        this.state.page++;
        fetch(`/posts?count=${COUNT_PER_PAGE}&skip=${this.state.page * COUNT_PER_PAGE}&user=${byUser}`)
        .then(errors.errorCheck(this))
        .then((parsed) => {
            this.state.loaded = true;
            var posts = this.state.posts;
            var data = parsed['data'];
            console.log(data);
            if (!data) {
                errors.displayError(this, "Ошибка сервера");
            }
            for (var i = 0; i < data.length; i++) {
                var formattedDate = dateFormat(
                    Date.parse(data[i].date),
                    "yyyy-mm-dd HH:MM"
                );
                //<Post text={data[i].text} author={data[i].authorName} key={data[i]._id} _id={data[i]._id} isOwner={data[i].isOwner}></Post>
                posts.push({text: data[i].text, author: data[i].author, key: data[i]._id, _id: data[i]._id, 
                            isOwner: data[i].isOwner, authorName: data[i].authorName, date: formattedDate,
                        imageId: data[i].imageId});
            }
            this.updateState({
                posts: posts,
                count: parsed['count'],
            });
            console.log(this.state.page + 1, this.state.count);
            console.log((this.state.page + 1 < Math.ceil(this.state.count / COUNT_PER_PAGE)));
        });
    }

    render() {
        
        if (this.state.loaded)
            return (
                <div>{this.state.posts.map(({text, author, authorName, key, _id, isOwner, date, imageId}) => {
                    return <Post text={text} author={authorName}
                    key={key} _id={_id} isOwner={isOwner} onUnmount={() => this.handleUnmount(_id)}
                    date={date} imageId={imageId}></Post>;
                })}
                <div align="center">
                {(this.state.page + 1 < Math.ceil(this.state.count / COUNT_PER_PAGE)) && (<Button mode="tertiary" align="center" onClick={(e) => this.loadMore()}>Еще</Button>)}
                </div>
                </div>
            );
        else 
            return (
                <div className="loadingDiv">
                    {!this.state.error && (<div className="loadOuter">
                        <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    </div>)}
                    {this.state.error && (
                        <SimpleCell disabled={true} align="center">{this.state.error}</SimpleCell>
                    )}
                    
                </div>
            )
    }
}
<Feed/>;

export default Feed;