import React, { useEffect, useContext } from 'react';
import { useHistory } from "react-router-dom";
import { Table, Row, Col, Button, notification, Tooltip } from 'antd';
import { GlobalContext } from '../../../../GlobalContext.js'

const modelName = s => {
  return (s.charAt(0).toUpperCase() + s.slice(1)).replace(/_/g, ' ')
}

const DocTable = props => {
  
  const title = props.columns[0].title

  const [id, setId] = title === 'Topics'
    ? useContext(GlobalContext).topic[3] : useContext(GlobalContext).clusters.id

  const history = useHistory()

  if (title === 'Cluster') {
    props.columns[0].render = (text, record) => (
        <Button onClick={() => {
          setId(record.cat)
          notification.success({
            message: `${title} ${record.cat} ajouté.`
          })
          history.push({
            pathname: '/visualisation',
            search: '',
            state: { menu: title === 'Cluster' ? '7' : '2' }
          })
        }}>
          {record.cat}
        </Button>
      )
  }

  if (title === 'Topics') {
    props.columns[0].render = (text, record) => (
        <Tooltip title={record.tooltip}>
          <Button onClick={() => {
            setId(record.cat)
            notification.success({
              message: `${title} ${record.cat} ajouté.`
            })
            history.push({
              pathname: '/visualisation',
              search: '',
              state: { menu: title === 'Cluster' ? '7' : '2' }
            })
          }}>
            {record.cat}
          </Button>
        </Tooltip>
      )
  }

  props.columns[0].title = modelName(title);
  // props.columns[0].width = 400;
  props.columns[1].align = 'center';
  props.columns[1].width = 100;

  return (
    <Col span={11} gutter={[16, 16]} >
      <Table bordered
             pagination={{ pageSize: 5, pageSizeOptions: [] }}
             columns={props.columns} dataSource={props.doc}
             size="small" />
    </Col>
  );
};

export default DocTable;
