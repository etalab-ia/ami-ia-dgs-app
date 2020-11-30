import React, { useState, useEffect, useContext } from 'react';
import PageLayout from '@layout/PageLayout.jsx';
import { Affix, Button, Input, Modal, Row, Col, Select, notification } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { getClusters } from '../../../../requests';
import Bar from '../Bar/index.jsx';
import WordCloud from '../WordCloud/index.jsx';
import Doc from '../Doc/index.jsx';
import { GlobalContext } from '../../../../GlobalContext.js'

const Cluster = props => {
  const auth = useContext(GlobalContext).auth
  const [da, setDa] = props.state[0]
  const [docList, setDocList] = props.state[1]
  const [externalId, setExternalId] = props.externalId
  const [side, setSide] = props.side

  useEffect(() => {
    if (externalId) {
      handleSearch(externalId)
      setExternalId(undefined)
    }
  }, [externalId])

  const handleSearch = id => {
    getClusters(id, [auth[0][0], auth[1][0]]).catch(e => {
      notification.error({
        message: 'Erreur identifiant',
        description: 'La ressource demandée est introuvable.'
      })
    }).then(v => {
      if (v) {
        setDocList([...new Set(v.data.documents.sort((a, b) => b.topic_score - a.topic_score).map(x => x.doc_name))])
        setDa({ data: v.data, doc: (v.data.documents.sort((a, b) => b.topic_score - a.topic_score).slice(0,1)[0].doc_name) })
      }
    })
  }

  return (
    <div>
      <Row span={2} gutter = {[5, 5]} justify="center">
        <Col span={6}>
          <Input.Search placeholder="Identifiant Cluster" onSearch={handleSearch} />
        </Col>
      </Row>
      <Row gutter = {[5, 5]} justify={side}>
        <Col span={16}>
          <h1>Cluster #{da?.data?.cluster_id}</h1>
          Ce Cluster regroupe {da?.data?.weight.nb_docs} documents ( {da?.data?.weight.weight} % du corpus ).
        </Col>
      </Row>
      <Row gutter = {[5, 5]} justify={side}>
        <Col span={20}>
          <h2>Nuage des mots les plus présents dans ce cluster</h2>
          <WordCloud words={da?.data?.wordcloud} type='cluster' />
        </Col>
      </Row>
      <Row gutter = {[5, 5]} justify={side}>
        <Col span={20}>
          <h2>Distribution des Topics dans le cluster</h2>
          <Bar data={da?.data?.topics} data_type={"perc"}  span={8} label="Distribution des Topics dans le cluster" />
          <h2>Distribution des DCOs dans le cluster</h2>
          <Bar data={da?.data?.dcos} data_type={"perc"}  span={8} label= "Distribution des DCOs dans le cluster"/>
        </Col>
      </Row>
      <Row gutter={[5, 5]} justify={side}>
        <Col span={20}>
          <h2>Visualisation d'un document représentatif</h2>
          <Select defaultValue={da?.doc} size="middle" style={{ width: '50%' }} onChange={v => setDa({ data: da?.data, doc: v })}>
            {
              docList.map(x => <Option value={x} key={x}>{x}</Option>)
            }
          </Select>
        </Col>
      </Row>
      <Row gutter={[5, 5]} justify="center">
        <Col span={23}>
          <Doc id={da?.doc} span={8}/>
        </Col>
      </Row>
    </div>
  )
}

const Clusters = () => {
  const context = useContext(GlobalContext).clusters

  return (
    <div>
      <Row justify="space-between">
        <Col span={11}>
          <Cluster state={context.state} externalId={context.id} side='left'/>
        </Col>
        <Col span={11}>
          <Cluster state={context.state.slice(2)} externalId={[undefined, undefined]} side="right"/>
        </Col>
      </Row>
    </div>
  );
};

export default Clusters;
