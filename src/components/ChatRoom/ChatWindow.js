import { UserAddOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {Button, Tooltip, Avatar, Form, Input, Alert, Row,Col, Drawer} from 'antd';
import Message from './Message';
import { AppContext } from '../../Context/AppProvider';
import { addDocument } from '../../firebase/services';
import { AuthContext } from '../../Context/AuthProvider';
import useFirestore from '../../hooks/useFirestore';
import {makeStyles} from "@mui/styles";
import NavBurger from '../../Customs/NavBurger'
import Sidebar from "./Sidebar";
import {useGlobal,setGlobal, getGlobal} from 'reactn';
import '../../App.css'

import {MenuOutlined} from '@ant-design/icons'
const HeaderStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 11px;
  align-items: center;

  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title {
      margin: 0;
      font-weight: bold;
    }

    &__description {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
  column-gap: 10px;
`;

const WrapperStyled = styled.div`
  position: relative;
  height: 100vh;
`;

const ContentStyled = styled.div`
  height: calc(100% - 90px);
  display: flex;
  flex-direction: column;
  padding:  0 11px;
  justify-content: flex-end;
  

`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;
const ButtonNav = styled.button`
  background: #3f0e40;
  border-color: '#3f0e40';
  border-radius: 10px;
  height: 40px;
  width: 40px;
  
  @media (min-width: 1200px) {
    display: none;
  }
`;
export default function ChatWindow() {
  const classes = useStyle()
  const [openNav] = useGlobal('openNav')
  const { selectedRoom, members, setIsInviteMemberVisible } =
    useContext(AppContext);
  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState('');
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const messageListRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOnSubmit = () => {
    addDocument('messages', {
      text: inputValue,
      uid,
      photoURL,
      roomId: selectedRoom.id,
      displayName,
    });

    form.resetFields(['message']);

    // focus to input again after submit
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }
  };

  const condition = React.useMemo(
    () => ({
      fieldName: 'roomId',
      operator: '==',
      compareValue: selectedRoom.id,
    }),
    [selectedRoom.id]
  );

  const messages = useFirestore('messages', condition);

  useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);
  const handleCloseNav = () => {
    setGlobal({openNav: false})
  }
  const handleOpenNav = () => {
    setGlobal({openNav: true})
  }
  return (
    <WrapperStyled>
      <Drawer
          className={classes.drawer}
          title="Basic Drawer"
          placement={'left'}
          closable={false}
          onClose={handleCloseNav}
          visible={openNav}
      >
        <Sidebar />
      </Drawer>
      {selectedRoom.id ? (
        <>

          <div className={classes.container} style={{borderBottom: '1px solid #ccc'}}>
            <ButtonNav
                className={classes.buttonDrawer}
                onClick={handleOpenNav}
            ><MenuOutlined /></ButtonNav>
            <HeaderStyled>
              <div className='header__info'>
                <p className='header__title'>{selectedRoom.name}</p>
                <span className='header__description'>
                  {selectedRoom.description}
                </span>
              </div>
              <ButtonGroupStyled>
                <Tooltip placement={"right"} title={'add more members to the channel'}>
                  <Button
                      className={classes.button}
                    icon={<UserAddOutlined />}
                    type='text'
                    onClick={() => setIsInviteMemberVisible(true)}
                  >
                    Add
                  </Button>
                </Tooltip>
                <Avatar.Group size='small' maxCount={2}>
                  {members.map((member) => (
                    <Tooltip title={member.displayName} key={member.id}>
                      <Avatar src={member.photoURL}>
                        {member.photoURL
                          ? ''
                          : member.displayName?.charAt(0)?.toUpperCase()}
                      </Avatar>
                    </Tooltip>
                  ))}
                </Avatar.Group>
              </ButtonGroupStyled>
            </HeaderStyled>
          </div>
          <ContentStyled>
            <MessageListStyled ref={messageListRef}>
              {messages.map((mes) => (
                <Message
                  key={mes.id}
                  text={mes.text}
                  photoURL={mes.photoURL}
                  displayName={mes.displayName}
                  createdAt={mes.createdAt}
                />
              ))}
            </MessageListStyled>
            <FormStyled form={form}>
              <Form.Item name='message'>
                <Input
                  ref={inputRef}
                  onChange={handleInputChange}
                  onPressEnter={handleOnSubmit}
                  placeholder='Enter message...'
                  bordered={false}
                  autoComplete='off'
                />
              </Form.Item>
              <Button className={classes.buttonSend} type='primary' onClick={handleOnSubmit}>
                Send
              </Button>
            </FormStyled>
          </ContentStyled>
        </>
      ) : (
          <div className={classes.container}>
            <ButtonNav
                className={classes.buttonDrawer}
                onClick={handleOpenNav}
            ><MenuOutlined /></ButtonNav>
            <div>
              <Alert
                  message='Choose or add a new a channel'
                  type='info'
                  showIcon
                  // style={{ margin: 5 }}
                  closable
              />
            </div>
          </div>
      )}
    </WrapperStyled>
  );
}

const useStyle = makeStyles({
  button: {
    background: '#3f0e40',
    color: '#fff',
    border: '1px solid #3f0e40',
    borderRadius: 10,

    '&:hover': {
      border: '1px solid #3f0e40',
      background: '#f1f1f1',
      color: '#3f0e40',
      '& span > svg > path':{
        fill: '#3f0e40 !important'
      }
    }
  },
  buttonSend: {
    background: '#3f0e40',
    border: 'none',
    '&:hover': {
      background: '#52214e',
    }
  },
  container: {
    width: '100%',
    position: 'sticky',
    padding: '0 11px',
    display: 'flex',
    alignItems: 'center',

    // justifyContent: 'space-between'
  },
  drawer: {
    '@media(min-width: 1200px)' : {
      display: 'none'
    },
    '& .ant-drawer-header': {
      display: 'none'
    },
    '& .ant-drawer-body': {
      padding: 0
    }
  },
  buttonDrawer: {
    '& span': {
      fontSize: 18,
      '& svg': {
        fill: '#fff'
      }
    },
    '&:hover': {
      background: '#fff',
      '& svg': {
        fill: '#3f0e40'
      }
    }
  }

})
