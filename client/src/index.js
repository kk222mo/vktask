import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {ConfigProvider, AdaptivityProvider} from "@vkontakte/vkui"
import Content from './components/contents/content';

let bodyElement = document.getElementsByTagName('body')[0];
  
// Changing the class of body Before mounting
bodyElement.className = "vkui--sizeX-regular vkui--vkCom--light";
bodyElement.scheme = "vkcom_light";
bodyElement.style = " color: #2688eb;";
document.getElementsByTagName('html')[0].className = "vkui";
document.getElementsByTagName('html')[0].style = "color-scheme: light;";
ReactDOM.render(
  <div className="vkui__root vkui--sizeX-regular vkui--vkCom--light" style={{colorScheme: "light"}}>
    <ConfigProvider platform='vkcom'>
      <AdaptivityProvider>
        <Content />
      </AdaptivityProvider>
    </ConfigProvider>
  </div>,
  document.getElementById("root")
);