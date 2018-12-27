import $ from 'jquery';
import rules from './rules';

/**
 * Get shopId
 * @return {String} return shopId or empty string
 */
const getShopId = () => {
  var shopId = $(rules.info.TMALL.shop.id_shopid).attr('shopid');
  if (!shopId) {
    shopId = $('input[name=seller_id]').val();
  }
  return shopId ? shopId : '';
};

/**
 * Get shopName
 * @return {String} return shopName or empty string
 */
const getShopName = () => {
  var name = $(rules.info.TMALL.shop.name_value).val();
  if (!name) {
    name = $(rules.info.TMALL.shop.name_text).text();
  }
  if (!name) {
    name = decodeURIComponent(
      $(rules.info.TMALL.shop.name_data_nick).attr('data-nick')
    );
  }
  return name ? name : '';
};

/**
 * Get shopLink
 * @return {String} return shopLink or empty string
 */
const getShopLink = () => {
  var shopLink = $(rules.info.TMALL.shop.link).attr('href');
  return shopLink ? 'https:' + shopLink : '';
};

/**
 * Get aliwangwang
 * @return {String} return aliwangwang or empty string
 */
const getAliWangWang = () => {
  var aliwangwang = $(rules.info.TMALL.shop.aliwangwang).val();
  if (!aliwangwang) {
    aliwangwang = getShopName();
  }
  return aliwangwang ? aliwangwang : '';
};

const init = () => {
  var shop = {
    shopId: getShopId(),
    shopName: getShopName(),
    shopLink: getShopLink(),
    aliwangwang: getAliWangWang(),
    website: 'TMALL'
  };
  return shop;
};

export default {
  getShopId,
  getShopName,
  getShopLink,
  getAliWangWang,
  init
};
