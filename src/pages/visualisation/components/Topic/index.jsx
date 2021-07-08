import React, { useState, useEffect, useContext } from 'react';
import PageLayout from '@layout/PageLayout.jsx';
import { Button, Input, Modal, Row, Col, Select, notification } from 'antd';
import { getTopic } from '../../../../requests';
import WordCloud from '../WordCloud/index.jsx';
import Doc from '../Doc/index.jsx';
import { GlobalContext } from '../../../../GlobalContext.js'

const Topic = () => {
  const auth = useContext(GlobalContext).auth
  const context = useContext(GlobalContext).topic
  const [externalId, setExternalId] = context[3] ? context[3] : [undefined, undefined]

  const [data, setData] = context[0]
  const [doc, setDoc] = context[1]
  const [docList, setDocList] = context[2]

  useEffect(() => {
    if (externalId) {
      handleSearch(externalId)
      setExternalId(undefined)
    }
  }, [context])

  const handleSearch = id => {
    getTopic(id, [auth[0][0], auth[1][0]]).catch(e => {
      notification.error({
        message: 'Erreur identifiant',
        description: 'La ressource demandée est introuvable.'
      })
    }).then(v => {
      if (v) {
        setDocList([...new Set(v.data.documents.sort((a, b) => b.topic_score - a.topic_score).map(x => x.doc_name))])
        setDoc(v.data.documents.sort((a,b) => b.topic_score - a.topic_score).slice(0,1)[0].doc_name)
        setData(v.data)
      }
    })
  }

  return (
    <div>
      <Row gutter = {[16, 16]} justify="center">
        <Col span={6}>
          <Input.Search placeholder="Identifiant Topic" onSearch={handleSearch} />
        </Col>
      </Row>
      <Row gutter = {[16, 16]} justify="center">
        <Col span={10}>
          <h1>Topic #{data?.topic_id}</h1>
          Ce topic a un poids de {Number(data?.weight).toFixed(2)} dans le corpus.
        </Col>
      </Row>
      <Row gutter = {[16, 16]} justify="center">
        <Col span={20}>
          <h2>Termes associés</h2>
          <WordCloud words={data?.wordcloud} type='topic' />
        </Col>
      </Row>
      <Row gutter={[16, 24]} justify="center">
        <Col span={20}>
          <h2>Visualisation d'un document représentatif</h2>
          <Select value={doc} size="middle" style={{ width: '50%' }} onChange={v => setDoc(v)}>
            {
              docList.map(x => <Option value={x}>{x}</Option>)
            }
          </Select>
        </Col>
      </Row>
      <Row gutter = {[16, 16]} justify="center">
        <Col span={20}>
          <Doc id={doc} span={15}/>
        </Col>
      </Row>
    </div>
  );
};

export default Topic;
