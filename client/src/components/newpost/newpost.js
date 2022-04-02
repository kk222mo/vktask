import React, { useEffect } from "react";
import "@vkontakte/vkui/dist/vkui.css";
import {Group, Button, Textarea, SplitLayout, SplitCol, Alert, File} from "@vkontakte/vkui";
import {Icon24Camera} from "@vkontakte/icons";
import "./newpost.css";
const defs = require("../../defaults");
const errors = require("../errors");


class NewPostPage extends React.Component {
    constructor (props) {
        super(props);
        this.areaRef = React.createRef();
        this.state = {
            successPopup: null,
            image: null,
            error: null,
            buttonsLocked: false,
        };

        this.fileRef = React.createRef();
    }

    setButtonsLocked = (val) => {
        this.setState({
            buttonsLocked: val,
        })
    }

    closePopout = () => {
        this.setState({
            successPopup: null,
        });
    }

    openPopup = () => {
        this.setState({
            successPopup: <Alert
                actions={[
                {
                    title: "Остаться",
                    autoclose: true,
                    mode: "cancel",
                },
                {
                    title: "Поглядеть новости",
                    autoclose: true,
                    mode: "destructive",
                    action: () => {window.location.href = "/"},
                },
                ]}
                actionsLayout="horizontal"
                onClose={this.closePopout}
                header="Пост успешно добавлен!"
                text="Пост добавлен, напишите еще или идем смотреть?"
            />
        });
    }

    createPost() {
        if (!this.state.buttonsLocked) {
            var textR = this.areaRef.current.value;
            this.setButtonsLocked(true);
            console.log(textR);
            fetch("/newpost", {
                method: "POST",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({text: textR, imageId: this.state.image}),
            }).then((res) => {
                if (res.ok)
                    return res.json();
                this.setButtonsLocked(false);
                console.log(res.text());
                errors.displayError(this, defs.DEFAULT_ERROR_S);
            })
            .then((data) => {
                console.log(data);
                if (data['result'] == "ok") {
                    this.setButtonsLocked(false);
                    this.areaRef.current.value = "";
                    this.fileRef.current.value = "";
                    errors.displayError(this, "");
                    this.openPopup();
                    this.setState({
                        image: null,
                    });
                } else {
                    errors.displayError(this, data['reason']);
                    this.setButtonsLocked(false);
                }
            });
        }
    }

    fileChange = (e) => {
        var formData = new FormData();
        var file = e.target.files[0];
        if (file) {
            formData.append("file", file);
            const options = {
                method: "POST",
                body: formData,

            };
            fetch("/uploadimage", options)
                .then(errors.errorCheck(this))
                .then((data) => {
                    if (data['result'] == "ok") {
                        this.setState({
                            image: data['_id'],
                        });
                    } else {
                        errors.displayError(this, data['reason']);
                    }
                });
        }
    }

    deleteImage = () => {
        this.fileRef.current.value = null;
        this.setState({
            image: null,
        });
    }

    render() {
        return (<SplitLayout popout={this.state.successPopup}><SplitCol><div className="outerDiv"><Group mode="plain">
            <Textarea
            cols={5}
            className="textArea"
            getRef={this.areaRef}
            placeholder="Ваш ход, товарищ маузер!"/>
            {this.state.image && (<img className="postImage" src={"/media?mediaId=" + this.state.image}/>)}
            <div style={{height: "10px"}}></div>
            <div className="errorDiv">{this.state.error ? this.state.error : ""}</div>
            <div className="buttonsDiv">
                <div className="addButtonDiv">
                    <Button className="addButton" disabled={this.state.buttonsLocked} onClick={(e) => this.createPost()}>Запостить</Button>
                </div>
                {this.state.image && (
                    <div className="removeImageDiv">
                        <Button className="removeImage" disabled={this.state.buttonsLocked} onClick={(e) => this.deleteImage()}>Удалить картинку</Button>
                    </div>
                )}
                <div className="addFileDiv">
                    <File getRef={this.fileRef} before={<Icon24Camera />} disabled={this.state.buttonsLocked} accept="image/jpeg, image/png, image/jpeg" onChange={this.fileChange}>{this.state.image ? "Заменить" : "Добавить"} картинку</File>
                </div>
            </div>
            </Group></div></SplitCol></SplitLayout>
        );
    }
}

<NewPostPage/>;

export default NewPostPage;