import React, { useState, useEffect, useContext } from 'react';
import { getClusters, getClustersModel, getWordcloud } from '../../../../requests'
import { Select, Button, Row, Col, Table, notification, Tabs, Input } from 'antd';
import Bar from '../Bar/index.jsx';
import BubbleGraph from '../Bubble/index.jsx'
import Matrix from '../Matrix/index.jsx';
import { GlobalContext } from '../../../../GlobalContext.js'

const { TabPane } = Tabs;

const ClustersModel = props => {
  const context = useContext(GlobalContext).clustersModel
  const auth = useContext(GlobalContext).auth

  const [nb_clusters, setNbClusters] = context[0]
  const [data, setData] = context[1]
  const [matrix, setMatrix] = context[2]
  const [p, setP] = context[3]
  const mul = 4;
  const [current_cluster_ind, setCurrentClusterInd] = context[4]
  const [current_cluster_words, setCurrentClusterWords] = context[5]
  const [current_cluster_topics, setCurrentClusterTopics] = context[6]
  const [current_cluster_dco, setCurrentClusterDco] = context[7]
  const [score, setScore] = context[8]

  useEffect(() => {
    getClustersModel([auth[0][0], auth[1][0]]).catch( e => {
      notification.error({
        message: 'Erreur Clusters Model',
        description: 'La ressource demandée est introuvable.'
      })
    }).then(r => {
      if (r.data) {
        setNbClusters(r.data.nb_clusters)
        const pca = r.data.pca
        setP(r.data.pca)
        setData(pca.X.map((x, i) => {
          return { x: x, y: pca.Y[i], r: pca.weights[i] + pca.weights[i] * mul }
        }))
        setMatrix(r.data.distances_matrix)
        setScore(Object.entries(r.data.scores).map(x => {
          return { title: x[0], score: Number(x[1]).toFixed(2) }
        }))
      }
      setCurrentCluster(0);
    })
  }, [])

  const handleClick = () => {
    setData(p.X.map((x, i) => {
      return { x: x, y: p.Y[i], r: p.weights[i] * mul }
    }))
  }

  const handleSearch = id => {
    getClusters(id, [auth[0][0], auth[1][0]]).catch(e => {
      notification.error({
        message: 'Erreur identifiant',
        description: 'La ressource demandée est introuvable.'
      })
    }).then(e => {
      setCurrentClusterInd(id);
      setCurrentClusterWords(e.data.wordcloud.map(x => { return { value: x.weight, topic: x.word } }));
      setCurrentClusterTopics(e.data.topics);
      setCurrentClusterDco(e.data.dcos);
    })
  }

  const setCurrentCluster = c => {
    if (c != current_cluster_ind) {
      setCurrentClusterInd(c);
      getClusters(c, [auth[0][0], auth[1][0]]).then(e => {
        setCurrentClusterInd(c);
        setCurrentClusterWords(e.data.wordcloud.map(x => { return { value: x.weight, topic: x.word } }));
        setCurrentClusterTopics(e.data.topics);
        setCurrentClusterDco(e.data.dcos);
      });
    }
  }

  const getModelMetrics = (nb_c, scores) => {
    let str = "Le modèle a " + nb_c + " clusters. Ses scores sont : ";
    for (const key in scores) {
      str += scores[key]['title'] + " : " + Number(scores[key]['score']).toFixed(2) + ", "
    }
    str = str.substring(0, str.length-2) + '.'
    return (
      <p>{str}</p>
    )
  }

  return (
    <div>
      <Row justify="left">
        <h2> Métriques du modèle de clustering </h2>
      </Row>
      <Row justify="left">
        {getModelMetrics(nb_clusters, score)}
      </Row>
      <Row>
        <h2> Visualisation des clusters </h2><br/>
      </Row>
      <Row>
        <Col span={5}>
          <Input.Search placeholder={String(current_cluster_ind)} onSearch={handleSearch} />
        </Col>
        <Col>
          <Button onClick={handleClick} type="primary">Reset</Button>
        </Col>
      </Row>
      <Row>
        <Col span={21} justify="center">
          <Tabs defaultActiveKey="1">
            <TabPane tab="DCO les plus fréquents" key="1">
              <Bar data={current_cluster_dco} data_type={"perc"} span={12} />
            </TabPane>
            <TabPane tab="Termes les plus fréquents" key="2">
              <Bar data={current_cluster_words} span={12} />
            </TabPane>
            <TabPane tab="Topics les plus fréquents" key="3">
              <Bar data={current_cluster_topics} data_type={"perc"} span={12} />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
      <Row>
        <h2> Visualisation 2D (directions principales) </h2>
      </Row>
      <Row>
        <Col span={21} justify="center">
          <BubbleGraph data={data} selected_cluster={current_cluster_ind} onClick={setCurrentCluster}/>
        </Col>
      </Row>
      <Row>
        <h2> Matrices des distances de Jaccard inter-clusters </h2>
      </Row>
      <Row>
        <Matrix data={matrix}/>
      </Row>
    </div>
  )
}

export default ClustersModel
