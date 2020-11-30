import React, { useState, useEffect, useMemo } from 'react';
import ReactWordcloud from 'react-wordcloud';
import { select } from "d3-selection";

const Wordcloud = props => {
  const size = [600, 100]
  let min_weight = 1, max_weight = 2;
  let wordcloud_type = "topic"

  const words = useMemo(() => {
    if (props.words) {
      min_weight = Math.min(...props.words.map(v => v.weight))
      max_weight = Math.max(...props.words.map(v => v.weight))
      if (props.type) wordcloud_type = props.type;
      return props.words.map(x => {
        return { text: x.word, value: x.weight }
      })
    }
    return [];
  }, [props.words]);

  function getCallback(callback) {
    return function (word, event) {
      const isActive = callback !== "onWordMouseOut";
      const element = event.target;
      if (element) {
        const text = select(element);
        if (text) {
          text
            .transition()
            .attr("background", "white")
            .attr("text-decoration", isActive ? "underline" : "none");
        };
      }
    }
  }

  const callbacks = {
    getWordColor: (word) => "hsl(240, 100%, " + Number(95 - (word.value - min_weight) / (max_weight - min_weight) * 70).toFixed(0) + "%)",
    getWordTooltip: (word) => {
      if (wordcloud_type === "topic") {
        return `"` + word.text + `" : ` + Number(word.value / 100).toFixed(2) + ` (fréq. relative dans le topic).`
      }
       return `"` + word.text + `" : ` + word.value + ` (occurences dans le cluster)`
    },
    onWordClick: getCallback("onWordClick"),
    onWordMouseOut: getCallback("onWordMouseOut"),
    onWordMouseOver: getCallback("onWordMouseOver")
  };
  

  return (
    <div>
        <ReactWordcloud words={words} options={{
          rotations: 0,
          scale: 'log',
          fontSizes: [10, 90],
          enableOptimizations: true,
          tooltipOptions: {
            theme: ''
          }
        }}
          size={size}
          callbacks={callbacks}
        />
    </div>
  );
};

export default React.memo(Wordcloud, (p, n) => {
  return JSON.stringify(p) === JSON.stringify(n)
});
