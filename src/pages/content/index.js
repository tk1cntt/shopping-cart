import React, { Component } from 'react';
import { render } from 'react-dom';
import './index.css';
import { Store } from 'react-chrome-redux';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';

const store = new Store({
  portName: 'COUNTING'
});

export default class InjectApp extends Component {
  constructor(props) {
    super(props);
    this.classButtonDetail = '';
    this.classPopupDetail = '';
  }

  componentDidMount() {
    setTimeout(() => {
      this.translate();
    }, 3000);
    setTimeout(() => {
      this.convertMoney();
    }, 7000);
  }

  checkMultiPrice(input) {
    return /(\d+\.\d{1,2})-(\d+\.\d{1,2})/.test(input);
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  convertMoney = () => {
    if (document.getElementsByClassName('tb-metatit')[0])
      document.getElementsByClassName('tb-metatit')[0].innerHTML = 'Giá';
    // Remove tm-yen
    if (document.getElementsByClassName('tm-yen')[0])
      document.getElementsByClassName('tm-yen')[0].innerHTML = '';
    if (document.getElementsByClassName('tm-price')[0]) {
      var priceFormat = document.getElementsByClassName('tm-price')[0]
        .innerText;
      console.log();

      var convertPrice = '';
      if (this.checkMultiPrice(priceFormat)) {
        var priceText = document.getElementsByClassName('tm-price')[0]
          .innerText;
        console.log(priceText);
        let priceParts = priceText.split('-');
        convertPrice =
          this.numberWithCommas(Number.parseInt(priceParts[0]) * 3123) +
          ' - ' +
          this.numberWithCommas(Number.parseInt(priceParts[1]) * 3123);
      } else {
        convertPrice =
          Number.parseInt(
            document.getElementsByClassName('tm-price')[0].innerText
          ) * 3123;
      }

      document.getElementsByClassName('tm-price')[0].innerHTML =
        convertPrice + ' đồng';
    }
  };

  translate = () => {
    var metatits = document.getElementsByClassName('tb-metatit');
    var i = 0;
    for (i = 0; i < metatits.length; i++) {
      console.log(metatits[i]);
      if (metatits[i].innerText === '数量') {
        document.getElementsByClassName('tb-metatit')[i].innerHTML =
          'Khối lượng';
      }
      if (metatits[i].innerText === '化妆品净含量') {
        document.getElementsByClassName('tb-metatit')[i].innerHTML =
          'Khối lượng mỹ phẩm';
      }
    }
    document.getElementsByClassName('mui-amount-unit')[0].innerHTML = 'cái';
  };

  render() {
    if (!this.props.settings || !this.props.animation) return null;
    if (this.props.animation.buttonCog) {
      this.classButtonDetail = 'circle faa-tada ';
      this.classPopupDetail = 'popup popup-visibility-show ';
      setTimeout(function() {
        store.dispatch({ type: 'TOGGLE-COG', buttonCog: false });
      }, 3500);
    }
    if (!this.props.animation.buttonCog) {
      this.classButtonDetail = 'circle ';
      this.classPopupDetail = 'popup popup-visibility-hide';
    }

    return (
      <div>
        <div
          className={
            this.props.settings.button
              ? `${this.classButtonDetail} visible`
              : `${this.classButtonDetail} hidden`
          }
          accessKey="s"
          onClick={() => {
            store.dispatch({ type: 'ADD-FROM-BUTTON', addFromButton: true });
            store.dispatch({ type: 'TOGGLE-COG', buttonCog: true });
          }}
        >
          <div className={this.classPopupDetail}>Saved</div>
          <div className="x-line" />
          <div className="y-line" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settings,
  animation: state.animation
});

const ConnectedInjectApp = connect(mapStateToProps)(InjectApp);

window.addEventListener('load', () => {
  const injectDOM = document.createElement('div');
  injectDOM.className = 'inject-react';
  injectDOM.style.textAlign = 'center';
  document.body.appendChild(injectDOM);
  render(
    <Provider store={store}>
      <ConnectedInjectApp />
    </Provider>,
    injectDOM
  );
});
