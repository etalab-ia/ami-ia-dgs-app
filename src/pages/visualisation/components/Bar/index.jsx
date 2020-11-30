import React, { useState, useEffect } from 'react'
import { Tooltip } from 'antd';



const Bar = props => {
  const [data, setData] = useState()
  const [total_width, setTotalWidth] = useState(1000)
  const [titles_width, setTitleWidth] = useState(0)
  const [nb_bars, setNbBars] = useState(0)
  const [max_value, setMaxValue] = useState(0)
  const [data_type, setDataType] = useState("")

  let barHeight = 40

  const BarGroup = bar_props => {
    let barPadding = 2
    let widthScale = d => d / max_value * 0.8 * (total_width - (titles_width*8)) // 25 * Math.sqrt(d * 10000)
    let round = v => {if (data_type === "perc") {return Number((v*100).toFixed(2)) + "%";} else {return v;}}
    let getColor = v => { 
      let h = Number(v.split(" ").slice(-1)[0])
      if ( isNaN(h) ) {
        h = 180 * Math.random();
      }
      return "hsl(" + 2 * h + ',70%,90%)'
    }

    let label_width = titles_width * 8
    let width = widthScale(bar_props.d.value)
    let yMid = bar_props.barHeight * 0.6
    let value = round(bar_props.d.value)
    let color = getColor(bar_props.d.topic)

    return <g className="bar-group">
              <Tooltip title={bar_props.d.tooltip}>
                <text className="name-label" x={-label_width} y={yMid} alignmentBaseline="middle" >{bar_props.d.topic}</text>
              </Tooltip>
              <Tooltip title={bar_props.d.tooltip}>
                <rect y={barPadding * 0.5} width={width} height={bar_props.barHeight - barPadding} fill={color} />
              </Tooltip>
              <text className="value-label" x={Math.max(15, width-40)} y={yMid} alignmentBaseline="middle" >{value}</text>
           </g>
  }

  useEffect(() => {
    if (props.data) {
      setData(props.data);
      setTotalWidth(Number(props.span) / 24 * (window.screen.width));
      setTitleWidth(Math.max(...props.data?.map(x => {return x.topic.length})));
      setNbBars(Math.min(5, props.data?.length));
      setMaxValue(Math.max(...props.data?.map(x => {return x.value})));
      if (props?.data_type) {
        setDataType(props.data_type);
      }
    }
  }, [props.data])

  return (<svg width={total_width} height={barHeight * 5} >
            <g className="container">
              <g className="chart" transform={"translate("+titles_width*8+",0)"}>
                {data?.map((d, i) => <g transform={`translate(0, ${i * barHeight})`}>
                                        <BarGroup d={d} barHeight={barHeight} />
                                     </g>)}
              </g>
            </g>
          </svg>)
}

export default React.memo(Bar, (p, n) => {
  return JSON.stringify(p) === JSON.stringify(n)
});
