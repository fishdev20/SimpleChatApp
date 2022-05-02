import React from 'react';
import { Row, Col } from 'antd';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import NavBurger from "../../Customs/NavBurger";
import {makeStyles} from "@mui/styles";

export default function ChatRoom() {
  const classes = useStyle()
  return (
    <div className={classes.root}>
      <Row>
        <Col xl={6} l={4} s={2} xs={0}>
          <Sidebar />
        </Col>
        <Col xl={18} l={20} s={22} xs={24}>
          <ChatWindow />
        </Col>
      </Row>
    </div>
  );
}

const useStyle = makeStyles({
  root: {
    position: 'relative'
  },

})
