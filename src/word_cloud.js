import React from 'react';
import ReactWordcloud from 'react-wordcloud';

const WordCloud = ({ words }) => {
    // Convert your word frequencies to the format required by react-wordcloud
    const wordArray = Object.keys(words).map(key => ({
        text: key,
        value: words[key] // The library uses 'value' instead of 'size'
    }));

    // Options for the word cloud
    // You can customize it as per your requirements
    const options = {
        rotations: 2,
        rotationAngles: [-90, 0],
        fontSizes: [10, 60], // Adjust min and max font sizes as needed
        // Add more options as needed
    };

    return (
    <div className="d-flex align-items-center"> 
        <div style={{ width: '75%', height: '400px' }}> {/* Adjust size as needed */}
            <ReactWordcloud words={wordArray} options={options} />
        </div>

        <div className="text-explanation p-3" style={{ flex: '1', marginRight: '20px', background: '#f5f5f5', borderRadius: '5px' }}>
          <h4>Word Cloud</h4>
          <p>The most frequent words in reviews in the selected region</p>
          <p>It is helpful for identifying potential improvements</p>
        </div>
      </div>






    );
};

export { WordCloud };







// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';
// import cloud from 'd3-cloud';

// const WordCloud = ({ words }) => {
//     const ref = useRef();

//     useEffect(() => {

//         d3.select(ref.current).selectAll("*").remove();

//         const wordArray = Object.keys(words).map(key => ({
//             text: key,
//             size: words[key] * 10 // Adjust sizing logic as needed
//         }));

//         const layout = cloud()
//             .size([300, 300]) // Adjust size as needed
//             .words(wordArray)
//             .padding(5)
//             .rotate(() => ~~(Math.random() * 2) * 90)
//             .font("Impact")
//             .fontSize(d => d.size)
//             .on("end", draw);

//         layout.start();

//         function draw(words) {
//             d3.select(ref.current)
//                 .attr("width", layout.size()[0])
//                 .attr("height", layout.size()[1])
//                 .append("g")
//                 .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
//                 .selectAll("text")
//                 .data(words)
//                 .enter().append("text")
//                 .style("font-size", d => d.size + "px")
//                 .attr("text-anchor", "middle")
//                 .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
//                 .text(d => d.text);
//         }
//     }, [words]);

//     return <svg ref={ref} />;
// };

// export {WordCloud};
