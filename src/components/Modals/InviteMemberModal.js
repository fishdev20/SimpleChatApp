import React, { useContext, useState } from 'react';
import { Form, Modal, Select, Spin, Avatar } from 'antd';
import { AppContext } from '../../Context/AppProvider';
import { debounce } from 'lodash';
import { db } from '../../firebase/config';
import {makeStyles} from "@mui/styles";

function DebounceSelect({
  fetchOptions,
  debounceTimeout = 300,
  curMembers,
  ...props
}) {
  // Search: abcddassdfasdf

  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);

  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value) => {
      setOptions([]);
      setFetching(true);

      fetchOptions(value, curMembers).then((newOptions) => {
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout, fetchOptions, curMembers]);

  React.useEffect(() => {
    return () => {
      // clear when unmount
      setOptions([]);
    };
  }, []);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size='small' /> : null}
      {...props}
    >
      {options.map((opt) => (
        <Select.Option key={opt.value} value={opt.value} title={opt.label}>
          <Avatar size='small' src={opt.photoURL}>
            {opt.photoURL ? '' : opt.label?.charAt(0)?.toUpperCase()}
          </Avatar>
          {` ${opt.label}`}
        </Select.Option>
      ))}
    </Select>
  );
}

async function fetchUserList(search, curMembers) {
  return db
    .collection('users')
    .where('keywords', 'array-contains', search?.toLowerCase())
    .orderBy('displayName')
    .limit(20)
    .get()
    .then((snapshot) => {
      return snapshot.docs
        .map((doc) => ({
          label: doc.data().displayName,
          value: doc.data().uid,
          photoURL: doc.data().photoURL,
        }))
        .filter((opt) => !curMembers.includes(opt.value));
    });
}

export default function InviteMemberModal() {
  const classes = useStyle()
  const {
    isInviteMemberVisible,
    setIsInviteMemberVisible,
    selectedRoomId,
    selectedRoom,
  } = useContext(AppContext);
  const [value, setValue] = useState([]);
  const [form] = Form.useForm();

  const handleOk = () => {
    // reset form value
    form.resetFields();
    setValue([]);

    // update members in current room
    const roomRef = db.collection('rooms').doc(selectedRoomId);

    roomRef.update({
      members: [...selectedRoom.members, ...value.map((val) => val.value)],
    });

    setIsInviteMemberVisible(false);
  };

  const handleCancel = () => {
    // reset form value
    form.resetFields();
    setValue([]);

    setIsInviteMemberVisible(false);
  };

  return (
    <div className={classes.root}>
      <Modal
        title='Add more member'
        visible={isInviteMemberVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
        className={classes.modal}
      >
        <Form form={form} layout='vertical'>
          <DebounceSelect
            mode='multiple'
            name='search-user'
            label={`Channel's members`}
            value={value}
            placeholder={`Enter member's name`}
            fetchOptions={fetchUserList}
            onChange={(newValue) => setValue(newValue)}
            style={{ width: '100%' }}
            curMembers={selectedRoom.members}
          />
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
