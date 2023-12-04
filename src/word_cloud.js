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
