var tmall = function() {
  var self = this;
  self.first = true;

  /**
   * get Shop info
   * @return {{shopId: string, shopName: string, shopLink: string, aliwangwang: string, website: string}}
   */
  self.getShop = function() {
    /**
     * Get shopId
     * @return {String} return shopId or empty string
     */
    function getShopId() {
      var shopId = $(rules.info.TMALL.shop.id_shopid).attr('shopid');
      if (!shopId) {
        shopId = $('input[name=seller_id]').val();
      }
      return shopId ? shopId : '';
    }

    /**
     * Get shopName
     * @return {String} return shopName or empty string
     */
    function getShopName() {
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
    }

    /**
     * Get shopLink
     * @return {String} return shopLink or empty string
     */
    function getShopLink() {
      var shopLink = $(rules.info.TMALL.shop.link).attr('href');
      return shopLink ? 'https:' + shopLink : '';
    }

    /**
     * Get aliwangwang
     * @return {String} return aliwangwang or empty string
     */
    function getAliWangWang() {
      var aliwangwang = $(rules.info.TMALL.shop.aliwangwang).val();
      if (!aliwangwang) {
        aliwangwang = getShopName();
      }
      return aliwangwang ? aliwangwang : '';
    }

    return {
      shopId: getShopId(),
      shopName: getShopName(),
      shopLink: getShopLink(),
      aliwangwang: getAliWangWang(),
      website: 'TMALL'
    };
  };

  /**
   * Get product from page
   * @return {object} return product
   */
  self.getProduct = function() {
    var prod = this;

    /**
     * Get product id
     * @return {String} retrun productId or empty string
     */
    prod.getProductId = function() {
      var id = $(rules.info.TMALL.product.id_itemid).attr('itemid');
      if (!id) {
        var path = window.location.pathname;
        id = /item\/(.+)\.htm/i.exec(path);
        return id[1];
      }
      return id ? id : '';
    };

    /**
     * Get product price
     * @return {String} return price
     */
    prod.getProductPrice = function() {
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
    prod.getProductImages = function() {
      var image = $(rules.info.TMALL.product.image).attr('src');
      return image
        ? image.indexOf('http') >= 0
          ? image
          : 'https:' + image
        : '';
    };

    /**
     * Get product title
     * @return {string} return title or empty string
     */
    prod.getProductTitle = function() {
      var title = $(rules.info.TMALL.product.title).val();
      return title ? title : '';
    };

    /**
     * Get location of product seller
     * @return {string} return location or empty string
     */
    prod.getSaleLocation = function() {
      var location = $(rules.info.TMALL.product.saleLocation).text();
      return location ? location : '';
    };

    /**
     * update box view when price on page change
     */
    prod.updateView = function() {
      var price = prod.getProductPrice();
      var priceVnd = '';
      if (Array.isArray(price) && price.length > 1) {
        priceVnd =
          tool.convertToVND(price[0]) +
          ' đ - ' +
          tool.convertToVND(price[1]) +
          'đ';
      } else {
        priceVnd = tool.convertToVND(price) + 'đ';
      }
      $('.chipo-box-info #sell_price').text(priceVnd);

      var stock = prod.getSelectStock();
      $('.chipo-box-info #stock').text(stock);
    };

    /**
     * Get product quantity
     * @return {number} return quantity or 0
     */
    prod.getInputQuantity = function() {
      var quantity = $(rules.info.TMALL.product.quantity).val();
      return !quantity ? 1 : quantity;
    };

    /**
     * Get product stock
     * @return {number} return stock or 0 if out of stock, 10 if can't get
     */
    prod.getSelectStock = function() {
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
    prod.getProductProperties = function(product) {
      var propsElem = $('.tm-sale-prop');
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
            propertiesImages += 'http:' + imgUrl + ';';
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
    prod.calculateTotal = function(product) {
      product.totalAmountNDT =
        Math.round(
          parseInt(product.quantity) * parseFloat(product.itemPriceNDT) * 100
        ) / 100;
      return product;
    };

    prod.init = function() {
      var product = {
        itemId: prod.getProductId(),
        itemName: prod.getProductTitle(),
        itemLink: tool.getProductLink(),
        itemImage: prod.getProductImages(),
        saleLocation: prod.getSaleLocation(),
        stock: prod.getSelectStock(),
        quantity: prod.getInputQuantity(),
        itemPriceNDT: prod.getProductPrice()
      };
      if (product.itemPriceNDT && Array.isArray(product.itemPriceNDT)) {
        product.itemPrice =
          tool.convertToVND(product.itemPriceNDT[0]) +
          ' đ - ' +
          tool.convertToVND(product.itemPriceNDT[1]);
      } else {
        product = prod.calculateTotal(product);
      }
      //check for first time run
      if (!self.first) {
        product = prod.getProductProperties(product);
      } else {
        product.updateView = prod.updateView;
      }
      return product;
    };

    return prod.init();
  };

  /**
   * Add chipo box to page
   **/
  self.renderView = function(product) {
    var div = $('<div>');
    var html = addon.box;
    $(div).html(html);
    $(div).addClass('tm-clear');
    $(rules.info.TMALL.box_after).after($(div));
    // if ($(rules.info.TMALL.product.hiddenPrice).length) {
    //     $('.chipo-warning').removeClass('hidden');
    // }
    $('.chipo-box-info #stock').text(product.stock);
    if (product.itemPrice) {
      $('.chipo-box-info #sell_price').text(product.itemPrice + 'đ');
    } else {
      $('.chipo-box-info #sell_price').text(
        tool.convertToVND(product.itemPriceNDT) + 'đ'
      );
    }
    if ($('#J_Sold-out-recommend').length) {
      $('.chipo-warning').text('Sản phẩm này đã hết hàng');
    }
  };

  self.init = function() {
    var product = self.getProduct();
    self.productView = product.productView;
    self.first = false;
    self.renderView(product);
  };
};
