import React, { Component, Fragment } from 'react';
import html2canvas from 'html2canvas';
import Card from './Card';
import IconSearch from './IconSearch';
import './App.css';
import debounce from 'lodash.debounce';
import classnames from 'classnames';
import magicItems from './assets/magic-items.json';
import Select from 'react-select';
import defaultIcon from './icons/delapouite/ancient-sword.svg';

const onChange = property => function({ target }) {
  const value = target.type === 'checkbox' ? target.checked : target.value;

  this.setState({
    [property]: value,
    selectRef: null,
  }, this.saveState);
}

const localStorage = window.localStorage;

const defaultItem = 'Sword of Life Stealing';
const defaultState = {
  cardType: 'default',
  description: magicItems[defaultItem].description,
  needsAttunement: magicItems[defaultItem].attunement,
  title: defaultItem,
  type: magicItems[defaultItem].rarity,
  imagePreviewUrl: defaultIcon,
  value: '100',
  selectRef: null,
  showSearch: false,
};

const saveData = debounce((key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
}, 500);

const getSavedDate = (key) => {
  const data = localStorage.getItem(key);
  if (!data) return undefined;
  return JSON.parse(data);
}

class CardEditor extends Component {
  
  static defaultProps = {
    localStorageKey: 'card',
  }

  state = defaultState;

  constructor() {
    super();
    this.onChangeTitle = onChange('title').bind(this);
    this.onChangeType = onChange('type').bind(this);
    this.onChangeDescription = onChange('description').bind(this);
    this.onChangeValue = onChange('value').bind(this);
    this.onChangeNeedsAttunement = onChange('needsAttunement').bind(this);
    this.onChangeCardType = onChange('cardType').bind(this);
  }

  componentDidMount() {
    const cachedState = getSavedDate(this.props.localStorageKey);
    this.setState(cachedState || defaultState);
    setTimeout(() => this.forceUpdate(), 100);
  }


  componentWillMount() {
      
  }

  saveState = () => {
    saveData(this.props.localStorageKey, this.state);
  }

  onReset = () => {
    this.setState(defaultState, this.saveState);
  }

  onSave = () => {
    html2canvas(this.ref).then(canvas => {
      const href = canvas.toDataURL("image/png");
      this.setState({ href });
    })
  }

  onImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      }, this.saveState);
    }

    reader.readAsDataURL(file)
  }

  onChangeCardTemplate = (selected) => {
    if(selected && selected.value) {
      this.setState({
        title: selected.value,
        type: magicItems[selected.value].type,
        needsAttunement: magicItems[selected.value].attunement,
        description: magicItems[selected.value].description,
        selectRef: selected,
      }, this.saveState);
    }
  }
  get cardTypeOptions() {
    return [
      {value: 'default', label: 'default'},
      {value: 'long', label: 'long'},
    ];
  }

  get cardTemplateOptions() {
    return [...Object.keys(magicItems).map(title => {
      return {value: title, label: title};
    })];
  }

  render() {
    const {
      cardType,
      description,
      href,
      needsAttunement,
      title,
      type,
      value,
      selectRef,
    } = this.state;
    return (
      <div>
        <hr></hr>
        <div className="container">
          <div className="fields">
            <Select onChange={this.onChangeCardType} options={this.cardTypeOptions} />
            <Select value={selectRef} onChange={this.onChangeCardTemplate} placeholder={'Select SRD Item Template...'} options={this.cardTemplateOptions} isSearchable={true} isClearable={true} />
            <input placeholder={'Title'} value={title} onChange={this.onChangeTitle} />
            <input placeholder={'Type'} value={type} onChange={this.onChangeType} />
            <input placeholder={'Value'} value={value} onChange={this.onChangeValue} />
            <textarea placeholder={'Description'} value={description} onChange={this.onChangeDescription} />
            <div>
              <input type="checkbox" checked={needsAttunement} onChange={this.onChangeNeedsAttunement} />
              Needs Attunement?
            </div>
            <IconSearch onImageChange={(e) => {
                  this.setState({
                    imagePreviewUrl: e
                  }, this.saveState)
                  }}></IconSearch>
            <div>
              <h6>Or, upload a custom icon</h6>
              <input
                className="fileInput"
                accept="image/*"
                type="file"
                onChange={this.onImageChange}
              />
          </div>
            <div className="buttons">
              <button onClick={this.onReset}>
                Reset
              </button>
              <button onClick={this.onSave}>
                Save
              </button>
            </div>
            {href && <a download="image.png" href={href}>Download</a>}
          </div>
          <Card key={cardType} onRef={ref => this.ref = ref} {...this.state} />
        </div>
      </div>
    );
  }
}

class App extends Component {
  state = {
    printMode: false,
  }

  onClick = () => this.setState({ printMode: !this.state.printMode });

  onSave = () => {
    html2canvas(this.ref).then(canvas => {
      const href = canvas.toDataURL("image/png");
      this.setState({ href });
    })
  }

  render() {
    const { href, printMode } = this.state;
    const classes = classnames({
      'app-container--print': this.state.printMode,
      'app-container': true,
    });

    return (
      <Fragment>
        <button className="print-mode" onClick={this.onClick}>Print Mode</button>
        {printMode && <button className="download-all" onClick={this.onSave}>Create Image</button>}
        {href && <a className="download-cards" download="cards.png" href={href}>Download Image</a>}
        <div className={classes} ref={ref => this.ref = ref}>
          {[...Array(9).keys()].map(i => (
            <CardEditor key={i} localStorageKey={`card${i}`} />
          ))}
        </div>
      </Fragment>
    );
  }
}

export default App;
