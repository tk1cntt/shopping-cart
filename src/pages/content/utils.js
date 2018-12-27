function checkMultiPrice(input) {
  return /(\d+\.\d{1,2})-(\d+\.\d{1,2})/.test(input);
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatMoney(price) {
  price = Number.parseFloat(price);
  var exchangeRate = 3575;
  var rounding = 1;
  var num = Math.ceil((price * exchangeRate) / rounding) * rounding;
  return numberWithCommas(num);
}

/**
   * convert NDT price to VND
   * @param {string} price
   * @return {string} return converted price
   */
export const convertToVND = price => {
  if (checkMultiPrice(price)) {
    var prices = price.split('-');
    price = '';
    for (var i in prices) {
      price += ' ' + formatMoney(prices[i]) + ' -';
    }
    price = price.slice(0, -1);
    return price;
  }
  return formatMoney(price);
};

/**
   * Get name of the site
   * @return {string} return site name or rmpty string
   */
export const getSiteName = () => {
    var url = window.location.href;
    if (url.match(/item.taobao/) || url.match(/taobao.com\/item\//)) {
      return 'TAOBAO';
    }
    if (url.match(/detail.tmall/) || url.match(/tmall.com\/item\//)) {
      return 'TMALL';
    }
    if (
      url.match(/detail.1688/) ||
      url.match(/[d]+[e]+[t]+[a]+[i]+[l]+.1688/)
    ) {
      return 'cn1688';
    }
    return '';
  };
