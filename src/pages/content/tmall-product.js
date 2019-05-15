import $ from 'jquery';
import rules from './rules';
import { convertToVND } from './utils';

/**
 * Get product id
 * @return {String} retrun productId or empty string
 */
const getProductId = () => {
  var id = $(rules.info.TMALL.product.id_itemid).attr('itemid');
  if (!id) {
    var path = window.location.pathname;
    id = /item\/(.+)\.htm/i.exec(path);
    return id ? id[1] : '';
  }
  return id ? id : '';
};

/**
 * Get product price
 * @return {String} return price
 */
const getProductPrice = () => {
  var price = $(rules.info.TMALL.product.promoPrice).text();
  if (!price || !price.trim().length) {
    $(rules.info.TMALL.product.basePrice).each(function() {
      if ($(this).css('text-decoration') === 'line-through') {
        return;
      }
      price = $(this).text();
    });
  }
  if (price.includes('-')) {
    price = price.split('-');
  }
  if (!Array.isArray(price)) {
    price = [price];
  }
  for (var p in price) {
    if (price[p].indexOf('.') < price[p].length - 3) {
      price[p] = price[p].replace('.', '');
    }
    if (price[p].indexOf(',')) {
      price[p] = price[p].replace(',', '.');
    }
  }
  if (price.length === 1) {
    price = price[0];
  }
  return price;
};

/**
 * Get product image
 * @return {string} return image link or empty string
 */
const getProductImages = () => {
  var image = $(rules.info.TMALL.product.image).attr('src');
  return image ? (image.indexOf('http') >= 0 ? image : 'https:' + image) : '';
};

/**
 * Get product title
 * @return {string} return title or empty string
 */
const getProductTitle = () => {
  var title = $(rules.info.TMALL.product.title).val();
  return title ? title : '';
};

/**
 * wrapper for window.location.href
 * @return {string} href
 */
const getProductLink = () => {
  return window.location.href;
};

/**
 * Get location of product seller
 * @return {string} return location or empty string
 */
const getSaleLocation = () => {
  var location = $(rules.info.TMALL.product.saleLocation).text();
  return location ? location : '';
};

/**
 * update box view when price on page change
 */
const updateView = () => {
  var price = getProductPrice();
  var priceVnd = '';
  if (Array.isArray(price) && price.length > 1) {
    priceVnd = convertToVND(price[0]) + ' đ - ' + convertToVND(price[1]) + 'đ';
  } else {
    priceVnd = convertToVND(price) + 'đ';
  }
  $('.chipo-box-info #sell_price').text(priceVnd);

  var stock = getSelectStock();
  $('.chipo-box-info #stock').text(stock);
};

/**
 * Get product quantity
 * @return {number} return quantity or 0
 */
const getInputQuantity = () => {
  var quantity = $(rules.info.TMALL.product.quantity).val();
  return !quantity ? 1 : quantity;
};

/**
 * Get product stock
 * @return {number} return stock or 0 if out of stock, 10 if can't get
 */
const getSelectStock = () => {
  var stock = /[\d]+/.exec($(rules.info.TMALL.product.stock).text());
  if (stock && stock.length) {
    return stock[0];
  } else if (
    $('.ui-msg').is(':visible') ||
    $('#J_Sold-out-recommend').is(':visible')
  ) {
    return 0;
  }
  return 10;
};

/**
 * Get product properties
 * @param {object} product
 * @return {object} return product with properties
 */
const getProductProperties = product => {
  var propsElem = $('.tm-sale-prop');
  // console.log('getProductProperties', propsElem);
  //get properties type
  var propertiesType = '';
  if ($(propsElem).find('dt.tb-metatit .hidden').length > 0) {
    $(propsElem)
      .find('dt.tb-metatit .hidden')
      .each(function() {
        propertiesType += $(this).text() + ';';
      });
  } else {
    $(propsElem)
      .find('dt.tb-metatit')
      .each(function() {
        propertiesType += $(this).text() + ';';
      });
  }
  //get properties html
  var props = $(propsElem).find('.J_TSaleProp');
  if (!props || props.length <= 0) {
    props = $(propsElem).find('#J_SKU dl');
  }
  //get selected props
  var propsSelected = $(props).find('li.tb-selected');
  if (props.length > propsSelected.length) {
    //add border to not chosen properties and scroll to the first properties
    $(props)
      .find('li')
      .each(function(index) {
        if (!$(this).hasClass('tb-selected')) {
          var e = $(this).parents('.tm-sale-prop');
          e.css('border', '1px solid red');
          $(this).click(function() {
            e.css('border', 'none');
          });
          if (index === 0) {
            $('html, body').animate(
              {
                scrollTop: e.offset().top
              },
              1000
            );
          }
        }
      });
    alert('Xin chọn đủ thuộc tính của sản phẩm');
    return null;
  } else {
    // get properties Id,name, images
    var propertiesId = '';
    var propertiesName = '';
    var propertiesImages = '';
    for (var i = 0; i < propsSelected.length; i++) {
      propertiesId += $(propsSelected[i]).attr('data-value') + ';';
      var elem = $(propsSelected[i]).find('a');
      propertiesName += elem.find('span').text() + ';';
      if (elem.attr('style')) {
        var imgUrl = elem.attr('style').match(/\/\/.+\..+\.[\w]{3,4}/g);
        imgUrl = imgUrl[0].replace(/[\d]+x[\d]+/, '500x500');
        propertiesImages += 'https:' + imgUrl + ';';
      }
    }
    // asign to product
    product.propetiesType = propertiesType.slice(0, -1);
    product.propetiesId = propertiesId.slice(0, -1);
    product.propetiesName = propertiesName.slice(0, -1);
    product.propetiesImage = propertiesImages.slice(0, -1);
    return product;
  }
};

/**
 * Calculate total amount
 * @params {object} product
 * @return {object} return product
 */
const calculateTotal = product => {
  product.totalAmountNDT =
    Math.round(
      parseInt(product.quantity) * parseFloat(product.itemPriceNDT) * 100
    ) / 100;
  return product;
};

const init = () => {
  var product = {
    itemId: getProductId(),
    itemName: getProductTitle(),
    itemLink: getProductLink(),
    itemImage: getProductImages(),
    saleLocation: getSaleLocation(),
    stock: getSelectStock(),
    quantity: getInputQuantity(),
    itemPriceNDT: getProductPrice()
  };
  if (product.itemPriceNDT && Array.isArray(product.itemPriceNDT)) {
    product.itemPrice =
      convertToVND(product.itemPriceNDT[0]) +
      'đ - ' +
      convertToVND(product.itemPriceNDT[1]) +
      'đ';
  } else {
    product = calculateTotal(product);
  }
  product = getProductProperties(product);
  // updateView();
  //check for first time run
  /*
  if (!self.first) {
    product = getProductProperties(product);
  } else {
    product.updateView = prod.updateView;
  }
  //*/
  return product;
};

export default {
  getProductId,
  getProductTitle,
  getProductPrice,
  getProductImages,
  getProductLink,
  getSaleLocation,
  getInputQuantity,
  getSelectStock,
  getProductProperties,
  updateView,
  init
};
