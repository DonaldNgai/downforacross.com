import './css/chatv2.css';

import React, { Component } from 'react';
import Emoji from './Emoji';
import * as emojiLib from '../lib/emoji';
import nameGenerator from '../nameGenerator';
import ChatBar from './ChatBar';

const isEmojis = str => {
  const res = str.match(/[A-Za-z,.0-9!-]/g);
  return !res;
};

export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      username: nameGenerator(),
    };
    this.chatBar = React.createRef();
  }

  handleSendMessage = (message) => {
    const { username } = this.state;
    const { id } = this.props;
    this.props.onChat(username, id, message);
  }

  handleUsernameInputKeyPress = (ev) => {
    if (ev.key === 'Enter') {
      ev.stopPropagation();
      ev.preventDefault();
      this.focus();
    }
  }

  handleChangeUsername = (ev) => {
    const username = ev.target.value;
    this.setState({ username });
  }

  handleUnfocus = () => {
    this.props.onUnfocus();
  }

  handleToggleChat = () => {
    this.props.onToggleChat();
  }

  focus() {
    const chatBar = this.chatBar.current;
    if (chatBar) {
      chatBar.focus();
    }
  }

  renderChatHeader() {
    if (this.props.header) return this.props.header;
    const { info = {} } = this.props;
    const { title, author, type } = info;

    return (
      <div className='chatv2--header'>
        { this.props.mobile &&
          <button onClick={this.handleToggleChat}>Back to game</button>
        }
        <div className='chatv2--header--title'>
          { title }
        </div>

        <div className='chatv2--header--subtitle'>
          {
            type && (
              type + ' | '
              + 'By ' + author
            )
          }
        </div>
      </div>
    );
  }

  renderUsernameInput() {
    return (this.props.hideChatBar
      ? null
      : <div className='chatv2--username'>
          {'You are '}
          <input
            style={{
              textAlign: 'center',
            }}
            className='chatv2--username--input'
            value={this.state.username}
            onChange={this.handleChangeUsername}
            onKeyPress={this.handleUsernameInputKeyPress}
          />
        </div>
    );
  }


  renderChatBar() {
    if (this.props.hideChatBar) {
      return null;
    }
    return (
      <ChatBar ref={this.chatBar}
        placeHolder='[Enter] to chat'
        onSendMessage={this.handleSendMessage}
        onUnfocus={this.handleUnfocus}/>
    );
  }

  renderMessageText(text) {
    const words = text.split(' ');
    const tokens = [];
    words.forEach(word => {
      if (word.startsWith(':') && word.endsWith(':')) {
        const emoji = word.substring(1, word.length - 1)
        const emojiData = emojiLib.get(emoji);
        if (emojiData) {
          tokens.push({
            type: 'emoji',
            data: emoji,
          });
          return;
        }
      }

      if (word.startsWith('@')) {
        const pattern = word.substring(1);
        if (pattern.match(/^\d+-?\s?(a(cross)?|d(own)?)$/i)) {
          tokens.push({
            type: 'clueref',
            data: '@' + pattern,
          });
          return;
        }
      }

      if (tokens.length && tokens[tokens.length - 1].type === 'text') {
        tokens[tokens.length - 1].data += ' ' + word;
      } else {
        tokens.push({
          type: 'text',
          data: word,
        });
      }
    });

    return (
      <span className={'chatv2--message--text'}>
        {tokens.map(token => (
          token.type === 'emoji'
          ? <Emoji emoji={token.data}/>
          : token.type === 'clueref'
          ? token.data // for now, don't do anything special to cluerefs
          : token.data
        ))}
      </span>
    );
  }

  renderMessage(message) {
    const { sender, text } = message;
    const big = text.length <= 10 && isEmojis(text);
    return (
      <div className={'chatv2--message' + (big ? ' big' : '')}>
        <span className='chatv2--message--sender'>{message.sender}</span>
        {':'}
        {this.renderMessageText(message.text)}
      </div>
    );
  }

  render() {
    const {
      messages = [],
    } = this.props.data;
    return (
      <div className='chatv2'>
        {this.renderChatHeader()}
        {this.renderUsernameInput()}
        <div
          ref={
            el => {
              if (el) {
                el.scrollTop = el.scrollHeight;
              }
            }
          }
          className='chatv2--messages'>
          {
            messages.map((message, i) => (
              <div key={i}>{this.renderMessage(message)}</div>
            ))
          }
        </div>

        {this.renderChatBar()}
      </div>
    );
  }
};

