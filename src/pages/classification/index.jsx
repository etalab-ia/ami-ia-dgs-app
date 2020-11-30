import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import PageLayout from '@layout/PageLayout.jsx'
import { Pagination, Input, Table, Row, Col, Upload, Select, notification, Button } from 'antd'
import DocTable from './components/DocTable/index.jsx'
import { baseURL } from '../../config.js'
import { GlobalContext } from '../../GlobalContext.js'

const route = baseURL + '/dgs-api/predict/all_models'

const Classification = ({ location: { pathname } }) => {
  const context = useContext(GlobalContext).classification
  const auth = useContext(GlobalContext).auth
  const [data, setData] = context[0]
  const [index, setIndex] = context[1]
  const [names, setNames] = context[2]
  const [result_keys, setResultKeys] = context[3]

  const getTableForModel = model_name => {
    return data[index]?.map((x, i) => {
      if (x.model_name === model_name) {
        if (x.model_name === 'topics' || x.model_name === 'cluster') {
          return (<DocTable columns={x.predictions?.columns} doc={
            x.predictions?.datasource.map(x => {
              return { ...x, cat: x.cat.match(/([0-9]+)/g)[0]
              } })
          } />)
        } else {
          return (<DocTable columns={x.predictions?.columns} doc={x.predictions?.datasource} />)
        }
      }
    })
  }

  const reset_docs = () => {
    setIndex(0)
    setData([])
    setNames([])
    setResultKeys([])
  }

  return (
    <PageLayout title="Classification">
      <Row gutter={[16, 24]} justify="left">
        <Select value={names[index]} size="middle" style={{ width: '35%' }} onChange={i => setIndex(i)}>
          { names.map((x, i) => <Option value={i}>{x}</Option>) }
        </Select>
        <Pagination hideOnSinglePage current={index + 1} pageSize={1} total={data.length} onChange={(p, ps) => setIndex(p - 1)} />
        <Button type="default" onClick={reset_docs}>Reset</Button>
      </Row>
      <Row gutter={[5, 5]} justify="full">
        <Col span={20}>
          <Row justify="center">
            {getTableForModel('DCO')}<Col span={1}/>{getTableForModel('dysfonctionnement')}
          </Row>
          <Row justify="center">
            {getTableForModel('consequence')}<Col span={1}/>{getTableForModel('effet')}
          </Row>
          <Row justify="center">
            {getTableForModel('gravité_binaire')}<Col span={1}/>{getTableForModel('gravité_ordinale')}
          </Row>
          <Row justify="center">
            {getTableForModel('topics')}<Col span={1}/>{getTableForModel('cluster')}
          </Row>
        </Col>
      </Row>
    </PageLayout>
  )
}

Classification.propTypes = {
    location: PropTypes.object.isRequired,
}

export default Classification
