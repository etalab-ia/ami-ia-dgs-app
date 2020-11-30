import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import PageLayout from '@layout/PageLayout.jsx';
import { Input, Table, Row, Col, notification } from 'antd';
import Doc from '../Doc/index.jsx';
import { GlobalContext } from '../../../../GlobalContext.js'

const Documents = () => {
  const context = useContext(GlobalContext).documents
  const [doc, setDoc] = context[0]

  return (
    <div>
      <Row gutter={[16, 16]} justify="center">
        <Col span={6}>
          <Input.Search placeholder="Identifiant document" onSearch={id => setDoc(id)} />
        </Col>
      </Row>
      <Row gutter={[16, 16]} justify="center">
        <Col span={18}>
          <Doc id={doc} span={15}/>
        </Col>
      </Row>
    </div>
  );
};

export default Documents;
