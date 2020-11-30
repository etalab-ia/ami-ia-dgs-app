import React, { useState, useEffect, useContext } from 'react'
import { Row, Col } from 'antd'
import Matrix from '../Matrix/index.jsx'
import { getTopicModel } from '../../../../requests'
import { baseURL } from '../../../../config.js'
import { GlobalContext } from '../../../../GlobalContext.js'

const urlPca = baseURL + '/dgs-api/topics/model/pca'

const TopicModel = () => {
  const context = useContext(GlobalContext).topicModel
  const auth = useContext(GlobalContext).auth
  const [data, setData] = context[0]

  useEffect(() => {
    getTopicModel([auth[0][0], auth[1][0]]).then(v => {
      setData(v.data)
    })
  }, [])

  return (
    <div>
      <h2> Métriques du modèle de clustering </h2>
        <Row justify="center">
          <p> Le modèle a {data?.nb_topics} topics et un score de cohérence de {Number(data?.coherence_score).toFixed(2)}. </p>
        </Row>
        <h2> Visualisation des topics </h2>
        <Row justify="center">
          <iframe style={{ minWidth: 1400 }} width="100%" height={800} frameBorder="0" scrolling="auto" src={urlPca} />
        </Row>
        <h2> Matrice des distances inter-topics </h2>
        <Row justify="center">
          <Col span={24}>
            <Matrix data={data?.distances_matrix} start_ind={1} />
          </Col>
        </Row>
      </div>
    )
  }

  export default TopicModel
