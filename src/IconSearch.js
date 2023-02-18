import { ReactSVG } from 'react-svg';
import React, { Component, Fragment } from 'react';

var listOfImages =[];
const importAll = (r) => {
  return r.keys().map(r);
}
listOfImages = importAll(require.context('./icons', true, /\.(svg)$/));

class IconSearch extends Component {

    render() {
        return <div>
                {
                    listOfImages.slice(0, 25).map(
                        (image, index) =>    
                        <ReactSVG key={index} 
                        src={image}
                        beforeInjection={(svg) => {
                        svg.classList.add('svg-class-name')
                        svg.setAttribute('style', 'width: 48px')
                        }}   
                        wrapper="span"
                        />
                    )
                }
            </div>;
    }


}

export default IconSearch;