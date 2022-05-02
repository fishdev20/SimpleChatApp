import React from 'react';
import { Collapse, Typography, Button, Tooltip } from 'antd';
import styled from 'styled-components';
import { PlusSquareOutlined } from '@ant-design/icons';
import { AppContext } from '../../Context/AppProvider';
import {useGlobal,setGlobal} from 'reactn';

const { Panel } = Collapse;

const PanelStyled = styled(Panel)`
  &&& {
    .ant-collapse-header,
    p {
      color: white;
    }

    .ant-collapse-content-box {
      padding: 0 40px;
    }

    .add-room {
      color: white;
      padding: 0;
    }
  }
`;

const LinkStyled = styled(Typography.Link)`
  display: block;
  margin-bottom: 5px;
  color: white;
`;

export default function RoomList() {
  const [openNav] = useGlobal('openNav')
  const { rooms, setIsAddRoomVisible, setSelectedRoomId } =
    React.useContext(AppContext);

  const handleAddRoom = () => {
    setIsAddRoomVisible(true);
  };
  console.log(rooms);
  return (
    <Collapse ghost defaultActiveKey={['1']}>
      <PanelStyled header='Channels' key='1'>
        {rooms.map((room) => (
          <LinkStyled key={room.id} onClick={() => {
            setSelectedRoomId(room.id)
            setGlobal({openNav: false})
          }}>
            #{room.name}
          </LinkStyled>
        ))}
        <Button
          type='text'
          icon={<PlusSquareOutlined />}
          className='add-room'
          onClick={handleAddRoom}
        >
          Add channel
        </Button>
      </PanelStyled>
    </Collapse>
  );
}
