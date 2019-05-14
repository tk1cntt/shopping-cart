var site;
var translated;
function start() {
  var siteName = tool.getSiteName();
  switch (siteName) {
    case 'TAOBAO':
      site = new taobao(tool);
      break;
    case 'TMALL':
      site = new tmall(tool);
      break;
    case 'cn1688':
      site = new cn1688(tool);
      break;
    default:
      return false;
  }

  setTimeout(function() {
    addTaskBar(siteName);
    site ? site.init() : null;
    setInterval(function() {
      if (site.updateView) {
        site.updateView();
      }
      if ($('#_is_translate').is(':checked') && translated) {
        addTranslate(siteName);
      }
    }, 1000);
  }, 2000);
  return true;
}

/**
 * Create task bar and modal on page
 */
function addTaskBar(domain) {
  // Make the toolbar
  var elem = document.createElement('div');
  $(elem).addClass('_chipo_template');
  document.body.insertBefore(elem, document.body.childNodes[0]);
  $(elem).css({ display: 'block' });
  $(elem).html(addon.toolbar);
  // Make popup
  var html = addon.popup;
  $(html).appendTo(document.body);
  chrome.storage.sync.get('translateWarning', function(result) {
    html = "<div class='chipo-toggle-container'>";
    if (
      result.translateWarning ||
      typeof result.translateWarning === 'undefined'
    ) {
      html += "<a href='javascript:;' id='chipo-toggle-addon'>Thu gọn</a>";
    } else {
      html += "<a href='javascript:;' id='chipo-toggle-addon'>Mở rộng</a>";
      $('.chipo-alert').addClass('collapsed');
      $('.chipo-alert').hide();
    }
    html += '</div>';
    $(html).appendTo(document.body);
  });
  // if (rules.currentVersion !== rules.newestVersion) {
  //     $("#version-warning").removeAttr('style');
  // }
  // Translate if set
  chrome.storage.sync.get('translateAuto', function(result) {
    if (result.translateAuto || typeof result.translateAuto === 'undefined') {
      $('#_is_translate').attr('checked', 'checked');
      addTranslate(domain);
    } else {
      $('#_is_translate').removeAttr('checked');
    }
  });
  // Handle button on taskbar
  setTimeout(function() {
    // Handle collapse button
    $('#chipo-toggle-addon').click(function() {
      if ($('.chipo-alert').hasClass('collapsed')) {
        $(this).text('Thu gọn');
        $('.chipo-alert').removeClass('collapsed');
        chrome.storage.sync.set({ translateWarning: true });
      } else {
        $(this).text('Mở rộng');
        $('.chipo-alert').addClass('collapsed');
        chrome.storage.sync.set({ translateWarning: false });
      }
      $('.chipo-alert').toggle('1000');
    });
    // Handle translate checkbox
    $('#_is_translate').change(function() {
      if ($(this).is(':checked')) {
        addTranslate(domain);
        chrome.storage.sync.set({ translateAuto: true });
      } else {
        removeTranslate(domain);
        chrome.storage.sync.set({ translateAuto: false });
      }
    });
    // Handle order button
    $('._addToCart').click(function() {
      if (site) {
        var product = site.getProducts ? site.getProducts() : site.getProduct();
        if (!product) {
          return;
        }
        var shop = site.getShop();
        if (!$.isEmptyObject(shop)) {
          if (Array.isArray(product) && product.length > 0) {
            var totalQuantity = 0;
            $.each(product, function() {
              if (this.itemPrice) delete this.itemPrice;
              this.note = $('#chipo-textarea').val();
              totalQuantity += parseInt(this.quantity);
            });
            if (totalQuantity < parseInt(product[0].wholesales[0].begin)) {
              alert(
                'Xin chọn tối thiểu ' +
                  product[0].wholesales[0].begin +
                  ' sản phẩm'
              );
              return;
            }
            tool.addToCart(product, shop);
            return;
          } else if (!$.isEmptyObject(product) && product.quantity) {
            if (
              product.wholesales &&
              parseInt(product.quantity) < parseInt(product.wholesales[0].begin)
            ) {
              alert(
                'Xin chọn tối thiểu ' +
                  product.wholesales[0].begin +
                  ' sản phẩm'
              );
              return;
            }
            if (parseInt(product.quantity) <= parseInt(product.stock)) {
              product.note = $('#chipo-textarea').val();
              if (product.itemPrice) delete product.itemPrice;
              product = [product];
              tool.addToCart(product, shop);
              return;
            } else {
              alert('Cửa hàng không còn đủ hàng');
            }
          } else {
            alert('Xin chọn ít nhất 1 sản phẩm');
          }
        } else {
          alert(
            'Có lỗi lấy dữ liệu sản phẩm. Xin bạn làm mới trang web và thử lại'
          );
        }
        site.focusOnError ? site.focusOnError() : null;
        console.warn('Đặt hàng không thành công');
      }
    });
  }, 1000);
  // $("#load_exchange_rate").click(function () {
  //     tool.calculateExchangeRate();
  //     $("#exchange_rate").text(rules.exchangeRate);
  // });
}

/**
 * add translation
 * @param {string} domain
 */
function addTranslate(domain) {
  var text;
  if (!$(rules.translate[domain].basePrice).find('.hidden').length) {
    $(rules.translate[domain].basePrice).each(function() {
      text = $(this).text();
      $(this).html("<span class='hidden'>" + text + '</span>Giá');
    });
  }
  if (!$(rules.translate[domain].promoPrice).find('.hidden').length) {
    $(rules.translate[domain].promoPrice).each(function() {
      text = $(this).text();
      $(this).html("<span class='hidden'>" + text + '</span>Khuyến mại');
    });
  }
  if (!$(rules.translate[domain].stock).find('.hidden').length) {
    $(rules.translate[domain].stock).each(function() {
      text = $(this).text();
      $(this).html("<span class='hidden'>" + text + '</span>Số lượng');
    });
  }
  if (!$(rules.translate[domain].product).find('.hidden').length) {
    $(rules.translate[domain].product).each(function() {
      text = $(this).text();
      $(this).html("<span class='hidden'>" + text + '</span>Sản phẩm');
    });
  }
  if (!$(rules.translate[domain].size).find('.hidden').length) {
    $(rules.translate[domain].size).each(function() {
      text = $(this).text();
      $(this).html("<span class='hidden'>" + text + '</span>Kích cỡ');
    });
  }
  if (!$(rules.translate[domain].color).find('.hidden').length) {
    $(rules.translate[domain].color).each(function() {
      text = $(this).text();
      $(this).html("<span class='hidden'>" + text + '</span>Màu sắc');
    });
  }
  if (!$(rules.translate[domain].stock_str).find('.hidden').length) {
    $(rules.translate[domain].stock_str).each(function() {
      text = $(this).text();
      var stock = text ? /[\d]+/.exec(text)[0] : 0;
      $(this).html(
        "<span class='hidden'>" + text + '</span> (Còn ' + stock + ' sản phẩm)'
      );
    });
  }
  if (
    rules.translate[domain].condition &&
    !$(rules.translate[domain].condition).find('.hidden').length
  ) {
    $(rules.translate[domain].condition).each(function() {
      text = $(this).text();
      $(this).html("<span class='hidden'>" + text + '</span>Điều kiện');
    });
  }
  translated = true;
}

/**
 * remove translation
 * @param {string} domain
 */
function removeTranslate(domain) {
  var text;
  $(rules.translate[domain].basePrice).each(function() {
    text = $(this)
      .find('.hidden')
      .text();
    $(this).text(text);
  });
  $(rules.translate[domain].promoPrice).each(function() {
    text = $(this)
      .find('.hidden')
      .text();
    $(this).text(text);
  });
  $(rules.translate[domain].stock).each(function() {
    text = $(this)
      .find('.hidden')
      .text();
    $(this).text(text);
  });
  $(rules.translate[domain].product).each(function() {
    text = $(this)
      .find('.hidden')
      .text();
    $(this).text(text);
  });
  $(rules.translate[domain].size).each(function() {
    text = $(this)
      .find('.hidden')
      .text();
    $(this).text(text);
  });
  $(rules.translate[domain].color).each(function() {
    text = $(this)
      .find('.hidden')
      .text();
    $(this).text(text);
  });
  $(rules.translate[domain].stock_str).each(function() {
    text = $(this)
      .find('.hidden')
      .text();
    $(this).text(text);
  });
  if (rules.translate[domain].condition) {
    $(rules.translate[domain].condition).each(function() {
      text = $(this)
        .find('.hidden')
        .text();
      $(this).text(text);
    });
  }
  translated = false;
}

//start the script when page done loading
$(document).ready(function() {
  start();
  tool.calculateExchangeRate();
  setTimeout(function() {
    $('#exchange_rate').text(rules.exchangeRate);
  }, 3000);
});
