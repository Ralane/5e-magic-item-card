import { ReactSVG } from 'react-svg';
import React, { Component, Fragment } from 'react';

var listOfImages =[];
const importAll = (r) => {
  return r.keys().map(r);
}
listOfImages = importAll(require.context('./icons', true, /\.(svg)$/));

const defaultState = {
    search: '',
};


const onChange = property => function({ target }) {
    this.setState({
      [property]: target.value,
    }, this.saveState);
  }
  

class IconSearch extends Component {

    state = defaultState;

    itemList = () => {
        return listOfImages.filter((e) => (!this.state.search || e.toString().includes(this.state.search))).slice(0, 50);
    }

    constructor({onImageChange}) {
        super();
        this.onChangeSearch = onChange('search').bind(this);
        this.onImageChange = onImageChange;
      }

    render() {
        const {
            search
          } = this.state;
        return <>
        <div>
            <input placeholder={'Search icons'} value={search} onChange={this.onChangeSearch} />
            <div>
                {
                    this.itemList().map(
                        (image, index) =>    
                            <ReactSVG key={index} 
                                src={image}
                                beforeInjection={(svg) => {
                                    svg.classList.add('svg-class-name')
                                    svg.setAttribute('style', 'width: 48px')
                                }} 
                                wrapper="span"
                                onClick={(e) => {this.onImageChange(image)}}
                            />
                    )
                }
            </div>
        </div>
        </>
    }


}

export default IconSearch;