import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import PageLayout from '@layout/PageLayout.jsx';
import { Input, Table, Row, Col, notification } from 'antd';
import Bar from '../Bar/index.jsx';
import { getDco } from '../../../../requests';
import { GlobalContext } from '../../../../GlobalContext.js'

const DCO = props => {
  const auth = useContext(GlobalContext).auth
  const context = useContext(GlobalContext).dco
  const [dco, setDco] = context[0]

  const handleSearch = text => {
    if (text) {
      getDco(text.replace('/', '--'), [auth[0][0], auth[1][0]]).catch(v => {
        notification.error({
          message: 'Erreur identifiant',
          description: 'Le document demandé est introuvable.'
        })
      }).then(v => {if (v) { setDco(v.data) } else { setDco({})}})
    }
  }

  return (
    <div>
      <Row gutter={[16, 16]} justify="center">
        <Col span={6}>
          <Input.Search placeholder="Titre exact du DCO" onSearch={handleSearch} />
        </Col>
      </Row>
      <Row gutter = {[16, 16]} justify="center">
        <Col span={18}>
          <h1>DCO : {dco?.dco_name}</h1>
          Clusters principaux contenant le DCO, avec pour chacun le pourcentage de documents attribués à la DCO:
        </Col>
      </Row>
      <Row gutter={[16, 16]} justify="center">
        <Col span={18}>
            <Bar data={dco?.clusters} data_type={"perc"}  span={8} label="Score de la DCO dans les clusters" />
        </Col>
      </Row>
    </div>
  );
};

export default DCO;
