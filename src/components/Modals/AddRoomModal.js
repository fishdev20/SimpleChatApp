import React, { useContext } from 'react';
import { Form, Modal, Input } from 'antd';
import { AppContext } from '../../Context/AppProvider';
import { addDocument } from '../../firebase/services';
import { AuthContext } from '../../Context/AuthProvider';
import {makeStyles} from "@mui/styles";

export default function AddRoomModal() {
  const classes = useStyle()
  const { isAddRoomVisible, setIsAddRoomVisible } = useContext(AppContext);
  const {
    user: { uid },
  } = useContext(AuthContext);
  const [form] = Form.useForm();

  const handleOk = () => {
    // handle logic
    // add new room to firestore
    addDocument('rooms', { ...form.getFieldsValue(), members: [uid] });

    // reset form value
    form.resetFields();

    setIsAddRoomVisible(false);
  };

  const handleCancel = () => {
    // reset form value
    form.resetFields();

    setIsAddRoomVisible(false);
  };

  return (
    <div>
      <Modal
        title='ADD MORE CHAT CHANNEL'
        visible={isAddRoomVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className={classes.modal}
      >
        <Form form={form} layout='vertical'>
          <Form.Item label='Name' name='name'>
            <Input placeholder='name' />
          </Form.Item>
          <Form.Item label='Description' name='description'>
            <Input.TextArea placeholder='Enter description' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

const useStyle = makeStyles({
  modal: {
    "& .ant-modal-content": {
      borderRadius: 10,
      '& .ant-modal-header': {
        borderRadius: '10px 10px 0 0',
        color: '#3f0e40'
      },
      '& .ant-modal-footer': {
        '& .ant-btn': {
          borderRadius: 5,
          color: '#3f0e40',
          '&:hover': {
            border:  '1px solid #3f0e40'
          }

        },
        '& .ant-btn-primary': {
          background: '#3f0e40',
          border: 'none',
          color: '#fff'

        },
      }
    }

  }
})