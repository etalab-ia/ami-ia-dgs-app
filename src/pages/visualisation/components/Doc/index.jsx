import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import PageLayout from '@layout/PageLayout.jsx';
import { Input, Table, Row, Col, notification } from 'antd';
import { getDocuments } from '../../../../requests';
import Bar from '../Bar/index.jsx';
import { GlobalContext } from '../../../../GlobalContext.js'

const Doc = props => {
  const auth = useContext(GlobalContext).auth
  const [data, setData] = useState({})
  const [spanSize, setSpanSize] = useState(15)

  useEffect(() => {
    if (props.id) {
      if (props.span) {
        setSpanSize(props.span)
      }
      getDocuments(props.id, [auth[0][0], auth[1][0]]).catch(v => {
        notification.error({
          message: 'Erreur identifiant',
          description: 'Le document demandé est introuvable.'
        })
      }).then(v => {if (v) { setData(v.data) } else { setData({})}})
    }
  }, [props.id])

  return (
    <Row gutter={[16, 16]} justify="center">
      <Col>
        <Row gutter={[16, 16]}>
          <Col span={2/5}><p><b>Numéro de déclaration</b>: {data["Numero de déclaration"]}</p></Col>
          <Col span={2/5}><p><b>DCO</b>: {data.DCO}</p></Col>
          <Col span={1/5}><p><b>Cluster</b>: {data["cluster"]}</p></Col>
        </Row>
        <h3>Description incident</h3>
        <p>{data["Description incident"]}</p>
        <h3>État patient</h3>
        <p>{data["Etat patient"]}</p>
        <h2>Distribution des Topics dans le document</h2>
        <Row justify="left">
          <Bar data={data?.topics}  data_type={"perc"}  span={spanSize} label="Topics" />
        </Row>
      </Col>
    </Row>
  );
};

export default Doc;
