import React, { useEffect } from "react";
import "@vkontakte/vkui/dist/vkui.css";
import {usePlatform, VKCOM, SplitLayout, PanelHeader, SplitCol,
        Panel, Group, Cell, Epic, Tabbar, TabbarItem, Badge, View, PanelHeaderBack,
        SimpleCell,
        withAdaptivity, ViewWidth, Link} from "@vkontakte/vkui";
import {Icon28NewsfeedOutline, Icon28ServicesOutline, Icon28MessageOutline, 
  Icon28UserCircleOutline, Icon28ClipOutline, Icon56NewsfeedOutline} from "@vkontakte/icons";
import { Icon28Mention } from '@vkontakte/icons';
import { Icon28AddOutline } from '@vkontakte/icons';
import "./content.css";
import Feed from "../feed/feed";
import Auth from "../auth/auth";
import Profile from "../profile/profile";
import NewPostPage from "../newpost/newpost";

  const Content = withAdaptivity(
    ({ viewWidth }) => {
      const platform = usePlatform();
      const [activeStory, setActiveStory] = React.useState("feed");
      const [isAuthorized, setIsAuthorized] = React.useState(false);
      const onStoryChange = (e) => setActiveStory(e.currentTarget.dataset.story);
      const isDesktop = viewWidth >= ViewWidth.TABLET;
      const hasHeader = platform !== VKCOM;

      useEffect(() => {
        fetch("/whoami").then((res) => res.json())
        .then((data) => {
            setIsAuthorized(data['result'] == 'authorized');
        });
      });
  
      return (
        <SplitLayout
          header={hasHeader && <PanelHeader separator={false} />}
          style={{ justifyContent: "center" }}
        >
          {isDesktop && (
            <SplitCol fixed width={280} maxWidth={280}>
              <Panel>
                {hasHeader && <PanelHeader />}
                <Group>
                <Cell
                    disabled={activeStory === "logo"}
                    style={
                      activeStory === "logo"
                        ? {
                            backgroundColor: "var(--button_secondary_background)",
                            borderRadius: 8,
                          }
                        : {}
                    }
                    data-story="logo"
                    onClick={onStoryChange}
                    before={<Icon28Mention />}
                  >
                    О проекте
                  </Cell>
                  <Cell
                    disabled={activeStory === "feed"}
                    style={
                      activeStory === "feed"
                        ? {
                            backgroundColor: "var(--button_secondary_background)",
                            borderRadius: 8,
                          }
                        : {}
                    }
                    data-story="feed"
                    onClick={onStoryChange}
                    before={<Icon28NewsfeedOutline />}
                  >
                    Лента
                  </Cell>
                  {isAuthorized && (<Cell
                    disabled={activeStory === "addPost"}
                    style={
                      activeStory === "addPost"
                        ? {
                            backgroundColor: "var(--button_secondary_background)",
                            borderRadius: 8,
                          }
                        : {}
                    }
                    data-story="addPost"
                    onClick={onStoryChange}
                    before={<Icon28AddOutline />}
                  >
                    Добавить пост
                  </Cell>)}
                  <Cell
                    disabled={activeStory === "profile"}
                    style={
                      activeStory === "profile"
                        ? {
                            backgroundColor: "var(--button_secondary_background)",
                            borderRadius: 8,
                          }
                        : {}
                    }
                    data-story="profile"
                    onClick={onStoryChange}
                    before={<Icon28UserCircleOutline />}
                  >
                    {isAuthorized ? "Мой аккаунт" : "Войти / Регистрация"}
                  </Cell>
                </Group>
              </Panel>
            </SplitCol>
          )}
  
          <SplitCol
            animate={!isDesktop}
            spaced={isDesktop}
            width={isDesktop ? "560px" : "100%"}
            maxWidth={isDesktop ? "560px" : "100%"}
          >
            <Epic
              activeStory={activeStory}
              tabbar={
                !isDesktop && (
                  <Tabbar>
                    <TabbarItem
                      onClick={onStoryChange}
                      selected={activeStory === "feed"}
                      data-story="feed"
                      text="Новости"
                    >
                      <Icon28NewsfeedOutline />
                    </TabbarItem>
                    {isAuthorized && (<TabbarItem
                      onClick={onStoryChange}
                      selected={activeStory === "addPost"}
                      data-story="addPost"
                      text="Добавить пост"
                    >
                      <Icon28AddOutline />
                    </TabbarItem>)}
                    <TabbarItem
                      onClick={onStoryChange}
                      selected={activeStory === "profile"}
                      data-story="profile"
                      text={isAuthorized ? "Мой аккаунт" : "Войти / Регистрация"}
                    >
                      <Icon28UserCircleOutline />
                    </TabbarItem>
                  </Tabbar>
                )
              }
            >
              <View id="logo" activePanel="logo">
                <Panel id="logo">
                  <PanelHeader left={<PanelHeaderBack />}>О проекте</PanelHeader>
                    <Group>
                        <SimpleCell disabled={true}>Тестовое задание в команду контентной платформы, 2022</SimpleCell>
                        <SimpleCell disabled={true}>Выполнил: Иван Орлов</SimpleCell>
                        <SimpleCell disabled={true}><Link target="_blank" href="mailto:northcapitalhouse@yandex.ru">northcapitalhouse@yandex.ru</Link></SimpleCell>
                        <SimpleCell disabled={true}><Link target="_blank" href="https://t.me/Withoutinfo">@Withoutinfo (TG)</Link></SimpleCell>
                    </Group>
                </Panel>
              </View>
              <View id="feed" activePanel="feed">
                <Panel id="feed">
                  <PanelHeader left={<PanelHeaderBack />}>Новости</PanelHeader>
                    <Group>
                        <Feed/>
                    </Group>
                </Panel>
              </View>
              <View id="addPost" activePanel="addPost">
                <Panel id="addPost">
                  <PanelHeader left={<PanelHeaderBack />}>Добавить пост</PanelHeader>
                  <Group>
                    <NewPostPage />
                  </Group>
                </Panel>
              </View>
              <View id="profile" activePanel="profile">
                <Panel id="profile">
                  <PanelHeader left={<PanelHeaderBack />}>{isAuthorized ? "Мой аккаунт" : "Войти / Регистрация"}</PanelHeader>
                  <Group>
                    {!isAuthorized && (<Auth/>)}
                    {isAuthorized && (<Profile/>)}
                    
                  </Group>
                </Panel>
              </View>
            </Epic>
          </SplitCol>
        </SplitLayout>
      );
    },
    {
      viewWidth: true,
    }
  );
  
  <Content />;

export default Content;
