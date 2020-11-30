import React, { useState, useEffect } from 'react';
import PageLayout from '@layout/PageLayout.jsx';
import { Button, Input, Modal, Row, Col, notification } from 'antd';
import ReactWordcloud from 'react-wordcloud';
import { getTopic, getClusters } from '../../../../requests';
import WordCloud from '../WordCloud/index.jsx'

const WordcloudStandalone = () => {
  const [showModal, setShowModal] = useState(false)
  const [isTopic, setIsTopic] = useState(null)
  const [id, setId] = useState(null)
  const [wordcloud, setWordcloud] = useState([])

  const handleSearch = id => {
    setId(id)
    setShowModal(true)
  }

  useEffect(() => {
    if (isTopic !== null && showModal !== true) {
      let f = isTopic === true ? getTopic : getClusters
      f(id).catch(e => {
        notification.error({
          message: 'Erreur identifiant',
          description: 'La ressource demandée est introuvable.'
        })
      }).then(v => {
        setWordcloud(v.data?.wordcloud)
      })
    }
  }, [showModal])

  return (
    <div>
      <Row gutter = {[16, 16]} justify="center">
        <Col span={6}>
          <Input.Search placeholder="Identifiant Topic ou Cluster" onSearch={handleSearch} />
        </Col>
      </Row>
      <Modal
        title="Topic ou Cluster"
        visible={showModal}
        closable={false}
        footer={[
          <Button key="topic" type="primary" onClick={() => {
            setIsTopic(true)
            setShowModal(false)
          }}>
            Topic
          </Button>,
          <Button key="cluster" type="primary" onClick={() => {
            setIsTopic(false)
            setShowModal(false)
          }}>
            Cluster
          </Button>
        ]}
      >
        L'identifiant spécifié est-il celui d'un Cluster ou d'un Topic ?
      </Modal>
      <Row gutter = {[16, 16]} justify="center">
        <Col span={20}>
          <WordCloud words={wordcloud} />
        </Col>
      </Row>
    </div>
  );
};

export default WordcloudStandalone;
