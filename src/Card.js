import React, { Component } from 'react';
import classnames from 'classnames';
import cardDefault from './assets/card--default.png';
import cardLong from './assets/card--long.png';
import './Card.css';
import TextFit from './textfit';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const cards = {
  default: cardDefault,
  long: cardLong,
}

const noop = () => { };
export default class Card extends Component {
  static propTypes = {}

  static defaultProps = {
    cardType: 'default',
  }

  renderField(property, props = {}) {
    return (
      <TextFit
        className={`card__${property}`}
        autoResize
        max={1500}
        forceSingleModeWidth={false}
        mode='single'
        {...props}
      >
        <ReactMarkdown children={this.props[property]} remarkPlugins={[remarkGfm]} />
      </TextFit>
    )
  }

  render() {
    const {
      cardType,
      needsAttunement,
      imagePreviewUrl,
      onRef,
    } = this.props;
    const containerClass = classnames(
      'card',
      `card--${cardType}`
    );
    return (
      <div className={containerClass} ref={onRef || noop}>
        <div className="card__icon">
          <img src={imagePreviewUrl} alt="icon" />
        </div>
        <img src={cards[cardType]} className="card__img" alt="card" />
        <div className={`card__attunement ${needsAttunement}`} />
        {          
        (cardType === 'default') && <>
          <div className="card__type_title" style={{ "font-size": "110rem" }}><div style={{ "display": "block" }}><div>Type</div></div></div>
          <div className="card__attunement_title" style={{ "font-size": "110rem" }}><div style={{ "display": "block" }}><div>Requires Attunement?</div></div></div>
          <div className="card__attunement_title_yes" style={{ "font-size": "82rem" }}><div style={{ "display": "block" }}><div>Yes</div></div></div>
          <div className="card__attunement_title_no" style={{ "font-size": "82rem" }}><div style={{ "display": "block" }}><div>No</div></div></div>
          <div className="card__value_unit" style={{ "font-size": "90rem" }}><div style={{ "display": "block" }}><div>GP</div></div></div>
          </>
        }
        {this.renderField('title')}
        {this.renderField('type')}
        {this.renderField('value', {
          forceSingleModeWidth: true,
          max: 241,
        })}
        {this.renderField('description', {
          mode: 'multi',
          max: 140,
        })}
      </div>
    );
  }
}
