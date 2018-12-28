import React, { Component } from 'react';
import { render } from 'react-dom';
import './index.css';
import { Store } from 'react-chrome-redux';
import { Provider, connect } from 'react-redux';
import $ from 'jquery';
import { Button } from 'antd';
import rules from './rules';
import tmallProduct from './tmall-product';
import tmallShop from './tmall-shop';
import { convertToVND } from './utils';

const store = new Store({
  portName: 'COUNTING'
});

export default class InjectApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      isShow: false
    };
    this.classButtonDetail = '';
    this.classPopupDetail = '';
  }

  componentDidMount() {
    /*
    var propsElem = $('.tb-metatit');
    console.log('jquery-propsElem', propsElem);
    propsElem = $('.tm-sale-prop');
    //get properties type
    var propertiesType = '';
    if ($(propsElem).find('dt.tb-metatit .hidden').length > 0) {
      $(propsElem).find('dt.tb-metatit .hidden').each(function () {
        propertiesType += $(this).text() + ';';
      });
    } else {
      $(propsElem).find('dt.tb-metatit').each(function () {
        propertiesType += $(this).text() + ';';
      });
    }
    console.log('jquery-propertiesType', propertiesType);
    console.log('rules', rules);
    // tmall.init();
    setTimeout(() => {
      this.translate();
    }, 3000);
    setTimeout(() => {
      this.convertMoney();
    }, 7000);
    */
    setTimeout(() => {
      $('.sufei-dialog').css('display', 'none');
    }, 100);
    setTimeout(() => {
      this.renderPriceBox();
    }, 7000);
  }

  showShoppingCart = value => {
    this.setState({
      isShow: value
    });
  };

  renderPriceBox() {
    const product = tmallProduct.init();
    const products = [];
    products.push(product);
    products.push(product);
    products.push(product);
    products.push(product);
    this.setState({
      products
    });
    const shop = tmallShop.init();
    console.log('tmall-product', product);
    console.log('tmall-shop', shop);
    var div = $('<div>');
    var html = this.priceBox();
    // tm-ind-panel
    //

    // if (document.getElementsById('J_MUIMallbar'))
    //   document.getElementsById('J_MUIMallbar')[0].innerHTML = '';
    if (document.getElementsByClassName(rules.info.TMALL.box_after)[0])
      document.getElementsByClassName(
        rules.info.TMALL.box_after
      )[0].innerHTML = html;
    // console.log('tmall-box_after', html);
    // $(div).html(html);
    // $(div).addClass('tm-clear');
    // console.log('tmall-box_after', $(rules.info.TMALL.box_after));
    // $(rules.info.TMALL.box_after).after($(html));
    // $('.chipo-box-info #stock').text(product.stock);
    if (product.itemPrice) {
      $('.chipo-box-info #sell_price').text(product.itemPrice);
    } else {
      $('.chipo-box-info #sell_price').text(
        convertToVND(product.itemPriceNDT) + 'đ'
      );
    }
    if ($('#J_Sold-out-recommend').length) {
      $('.chipo-warning').text('Sản phẩm này đã hết hàng');
    }
  }

  priceBox() {
    const html = `
      <div className="tm-clear">
        <div className="chipo-box-info">
          <div className="chipo-basic-info">
            <ul>
              <li>
                Giá bán:${' '}
                <span id="sell_price" className="text-chipo">
                  372.060đ
                </span>
              </li>
              <li>
                Tỷ giá 1<span className="chipo-yen">¥</span>:${' '}
                <span id="exchange_rate" className="text-chipo">
                  3.445đ
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      `;
    return html;
  }

  /*
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

      var convertPrice = '';
      if (this.checkMultiPrice(priceFormat)) {
        var priceText = document.getElementsByClassName('tm-price')[0]
          .innerText;
        let priceParts = priceText.split('-');
        convertPrice =
          this.numberWithCommas(Number.parseInt(priceParts[0]) * 3123) +
          ' - ' +
          this.numberWithCommas(Number.parseInt(priceParts[1]) * 3123);
      } else {
        convertPrice = this.numberWithCommas(
          Number.parseInt(priceFormat) * 3123
        );
      }

      document.getElementsByClassName('tm-price')[0].innerHTML =
        convertPrice + 'đ';
    }
  };

  translate = () => {
    if (document.getElementsByClassName('tb-metatit')) {
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
    }

    if (document.getElementsByClassName('mui-amount-unit')[0])
      document.getElementsByClassName('mui-amount-unit')[0].innerHTML =
        'Sản phẩm';
  };
  */

  addToCart = () => {
    const product = tmallProduct.init();
    const products = this.state.products;
    products.push(product);
    this.setState({
      products
    });
  };

  productListForm() {
    const productListDom = this.state.products.map((item, index) => (
      <div key={`entity-${item.itemId}-${index}`} className="cart-item">
        <a target="_blank" rel="noopener noreferrer" href={item.itemLink}>
          <div>
            <img src={item.itemImage} alt={item.itemName} />
          </div>
          <div>
            <div>2.000.000đ</div>
          </div>
        </a>
      </div>
    ));
    return productListDom;
  }

  shoppingBox() {
    return (
      <div
        className={`${
          this.state.isShow
            ? 'shopping-cart-box visible'
            : 'shopping-cart-box hidden'
        }`}
      >
        <i
          className="fa fa-times shopping-cart-close"
          onClick={() => this.showShoppingCart(false)}
        />
        <div className="checkout">Thanh toán</div>
        {this.productListForm()}
      </div>
    );
  }

  toolbar() {
    return (
      <div className="shopping-cart-toolbar-box">
        <div className="shopping-cart-toolbar">
          <Button
            type="primary"
            onClick={() => {
              store.dispatch({ type: 'TOGGLE-COG', buttonCog: true });
              this.addToCart();
            }}
          >
            Đặt hàng
          </Button>
          <Button type="primary" onClick={() => this.showShoppingCart(true)}>
            Xem giỏ hàng
          </Button>
          <Button type="primary">Thanh toán</Button>
        </div>
      </div>
    );
  }

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
        {this.shoppingBox()}
        {this.toolbar()}
        <div
          className={
            this.props.settings.button
              ? `${this.classButtonDetail} visible`
              : `${this.classButtonDetail} hidden`
          }
          accessKey="s"
          onClick={() => {
            // store.dispatch({ type: 'ADD-FROM-BUTTON', addFromButton: true });
            // store.dispatch({ type: 'TOGGLE-COG', buttonCog: true });
            this.showShoppingCart(!this.state.isShow);
          }}
        >
          <div className={this.classPopupDetail}>Đã thêm hàng vào giỏ</div>
          <i className="fa fa-shopping-cart circle-cart" />
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
