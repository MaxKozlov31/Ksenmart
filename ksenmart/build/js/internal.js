"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

$(document).ready(function () {
  /**
   * Глобальные переменные, которые используются многократно
   */
  var globalOptions = {
    // Время для анимаций
    time: 200,
    // Контрольные точки адаптива
    desktopXlSize: 1920,
    desktopLgSize: 1600,
    desktopSize: 1280,
    tabletLgSize: 1024,
    tabletSize: 768,
    mobileLgSize: 640,
    mobileSize: 480,
    // Точка перехода попапов на фулскрин
    popupsBreakpoint: 768,
    // Время до сокрытия фиксированных попапов
    popupsFixedTimeout: 5000,
    // Проверка touch устройств
    isTouch: $.browser.mobile,
    lang: $('html').attr('lang')
  }; // Брейкпоинты адаптива
  // @example if (globalOptions.breakpointTablet.matches) {} else {}

  var breakpoints = {
    breakpointDesktopXl: window.matchMedia("(max-width: ".concat(globalOptions.desktopXlSize - 1, "px)")),
    breakpointDesktopLg: window.matchMedia("(max-width: ".concat(globalOptions.desktopLgSize - 1, "px)")),
    breakpointDesktop: window.matchMedia("(max-width: ".concat(globalOptions.desktopSize - 1, "px)")),
    breakpointTabletLg: window.matchMedia("(max-width: ".concat(globalOptions.tabletLgSize - 1, "px)")),
    breakpointTablet: window.matchMedia("(max-width: ".concat(globalOptions.tabletSize - 1, "px)")),
    breakpointMobileLgSize: window.matchMedia("(max-width: ".concat(globalOptions.mobileLgSize - 1, "px)")),
    breakpointMobile: window.matchMedia("(max-width: ".concat(globalOptions.mobileSize - 1, "px)"))
  };
  $.extend(true, globalOptions, breakpoints);
  $(window).load(function () {
    if (globalOptions.isTouch) {
      $('body').addClass('touch').removeClass('no-touch');
    } else {
      $('body').addClass('no-touch').removeClass('touch');
    } // if ($('textarea').length > 0) {
    //     autosize($('textarea'));
    // }

  });
  /**
   * Подключение js partials
   */

  /* form_style.js должен быть выполнен перед form_validation.js */

  /**
   * Расширение animate.css
   * @param  {String} animationName название анимации
   * @param  {Function} callback функция, которая отработает после завершения анимации
   * @return {Object} объект анимации
   * 
   * @see  https://daneden.github.io/animate.css/
   * 
   * @example
   * $('#yourElement').animateCss('bounce');
   * 
   * $('#yourElement').animateCss('bounce', function() {
   *     // Делаем что-то после завершения анимации
   * });
   */

  $.fn.extend({
    animateCss: function animateCss(animationName, callback) {
      var animationEnd = function (el) {
        var animations = {
          animation: 'animationend',
          OAnimation: 'oAnimationEnd',
          MozAnimation: 'mozAnimationEnd',
          WebkitAnimation: 'webkitAnimationEnd'
        };

        for (var t in animations) {
          if (el.style[t] !== undefined) {
            return animations[t];
          }
        }
      }(document.createElement('div'));

      this.addClass('animated ' + animationName).one(animationEnd, function () {
        $(this).removeClass('animated ' + animationName);
        if (typeof callback === 'function') callback();
      });
      return this;
    }
  });
  /**
   * Стилизует селекты с помощью плагина select2
   * https://select2.github.io
   */

  var CustomSelect = function CustomSelect($elem) {
    var self = this;

    self.init = function ($initElem) {
      $initElem.each(function () {
        if ($(this).hasClass('select2-hidden-accessible')) {
          return;
        } else {
          var selectSearch = $(this).data('search');
          var minimumResultsForSearch;

          if (selectSearch) {
            minimumResultsForSearch = 1; // показываем поле поиска
          } else {
            minimumResultsForSearch = Infinity; // не показываем поле поиска
          }

          $(this).select2({
            minimumResultsForSearch: minimumResultsForSearch,
            selectOnBlur: true,
            dropdownCssClass: 'error'
          });
          $(this).on('change', function (e) {
            // нужно для вылидации на лету
            $(this).find("option[value=\"".concat($(this).context.value, "\"]")).click();
          });
        }
      });
    };

    self.update = function ($updateElem) {
      $updateElem.select2('destroy');
      self.init($updateElem);
    };

    self.init($elem);
  };
  /**
   * Стилизует file input
   * http://gregpike.net/demos/bootstrap-file-input/demo.html
   */


  $.fn.customFileInput = function () {
    this.each(function (i, elem) {
      var $elem = $(elem); // Maybe some fields don't need to be standardized.

      if (typeof $elem.attr('data-bfi-disabled') !== 'undefined') {
        return;
      } // Set the word to be displayed on the button


      var buttonWord = 'Browse';
      var className = '';

      if (typeof $elem.attr('title') !== 'undefined') {
        buttonWord = $elem.attr('title');
      }

      if (!!$elem.attr('class')) {
        className = ' ' + $elem.attr('class');
      } // Now we're going to wrap that input field with a button.
      // The input will actually still be there, it will just be float above and transparent (done with the CSS).


      $elem.wrap("<div class=\"custom-file\"><a class=\"btn ".concat(className, "\"></a></div>")).parent().prepend($('<span></span>').html(buttonWord));
    }) // After we have found all of the file inputs let's apply a listener for tracking the mouse movement.
    // This is important because the in order to give the illusion that this is a button in FF we actually need to move the button from the file input under the cursor. Ugh.
    .promise().done(function () {
      // As the cursor moves over our new button we need to adjust the position of the invisible file input Browse button to be under the cursor.
      // This gives us the pointer cursor that FF denies us
      $('.custom-file').mousemove(function (cursor) {
        var input, wrapper, wrapperX, wrapperY, inputWidth, inputHeight, cursorX, cursorY; // This wrapper element (the button surround this file input)

        wrapper = $(this); // The invisible file input element

        input = wrapper.find('input'); // The left-most position of the wrapper

        wrapperX = wrapper.offset().left; // The top-most position of the wrapper

        wrapperY = wrapper.offset().top; // The with of the browsers input field

        inputWidth = input.width(); // The height of the browsers input field

        inputHeight = input.height(); //The position of the cursor in the wrapper

        cursorX = cursor.pageX;
        cursorY = cursor.pageY; //The positions we are to move the invisible file input
        // The 20 at the end is an arbitrary number of pixels that we can shift the input such that cursor is not pointing at the end of the Browse button but somewhere nearer the middle

        moveInputX = cursorX - wrapperX - inputWidth + 20; // Slides the invisible input Browse button to be positioned middle under the cursor

        moveInputY = cursorY - wrapperY - inputHeight / 2; // Apply the positioning styles to actually move the invisible file input

        input.css({
          left: moveInputX,
          top: moveInputY
        });
      });
      $('body').on('change', '.custom-file input[type=file]', function () {
        var fileName;
        fileName = $(this).val(); // Remove any previous file names

        $(this).parent().next('.custom-file__name').remove();

        if (!!$(this).prop('files') && $(this).prop('files').length > 1) {
          fileName = $(this)[0].files.length + ' files';
        } else {
          fileName = fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.length);
        } // Don't try to show the name if there is none


        if (!fileName) {
          return;
        }

        var selectedFileNamePlacement = $(this).data('filename-placement');

        if (selectedFileNamePlacement === 'inside') {
          // Print the fileName inside
          $(this).siblings('span').html(fileName);
          $(this).attr('title', fileName);
        } else {
          // Print the fileName aside (right after the the button)
          $(this).parent().after("<span class=\"custom-file__name\">".concat(fileName, " </span>"));
        }
      });
    });
  };

  $('input[type="file"]').customFileInput(); // $('select').customSelect();

  var customSelect = new CustomSelect($('select'));

  if ($('.js-label-animation').length > 0) {
    /**
     * Анимация элемента label при фокусе полей формы
     */
    $('.js-label-animation').each(function (index, el) {
      var field = $(el).find('input, textarea');

      if ($(field).val().trim() != '') {
        $(el).addClass('is-filled');
      }

      $(field).on('focus', function (event) {
        $(el).addClass('is-filled');
      }).on('blur', function (event) {
        if ($(this).val().trim() === '') {
          $(el).removeClass('is-filled');
        }
      });
    });
  }

  var locale = globalOptions.lang == 'ru-RU' ? 'ru' : 'en';
  Parsley.setLocale(locale);
  /* Настройки Parsley */

  $.extend(Parsley.options, {
    trigger: 'blur change',
    // change нужен для select'а
    validationThreshold: '0',
    errorsWrapper: '<div></div>',
    errorTemplate: '<p class="parsley-error-message"></p>',
    classHandler: function classHandler(instance) {
      var $element = instance.$element;
      var type = $element.attr('type'),
          $handler;

      if (type == 'checkbox' || type == 'radio') {
        $handler = $element; // то есть ничего не выделяем (input скрыт), иначе выделяет родительский блок
      } else if ($element.hasClass('select2-hidden-accessible')) {
        $handler = $('.select2-selection--single', $element.next('.select2'));
      }

      return $handler;
    },
    errorsContainer: function errorsContainer(instance) {
      var $element = instance.$element;
      var type = $element.attr('type'),
          $container;

      if (type == 'checkbox' || type == 'radio') {
        $container = $("[name=\"".concat($element.attr('name'), "\"]:last + label")).next('.errors-placement');
      } else if ($element.hasClass('select2-hidden-accessible')) {
        $container = $element.next('.select2').next('.errors-placement');
      } else if (type == 'file') {
        $container = $element.closest('.custom-file').next('.errors-placement');
      } else if ($element.closest('.js-datepicker-range').length) {
        $container = $element.closest('.js-datepicker-range').next('.errors-placement');
      } else if ($element.attr('name') == 'is_recaptcha_success') {
        $container = $element.parent().next('.g-recaptcha').next('.errors-placement');
      }

      return $container;
    }
  }); // Кастомные валидаторы
  // Только русские буквы, тире, пробелы

  Parsley.addValidator('nameRu', {
    validateString: function validateString(value) {
      return /^[а-яё\- ]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы А-Я, а-я, " ", "-"',
      en: 'Only simbols А-Я, а-я, " ", "-"'
    }
  }); // Только латинские буквы, тире, пробелы

  Parsley.addValidator('nameEn', {
    validateString: function validateString(value) {
      return /^[a-z\- ]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы A-Z, a-z, " ", "-"',
      en: 'Only simbols A-Z, a-z, " ", "-"'
    }
  }); // Только латинские и русские буквы, тире, пробелы

  Parsley.addValidator('name', {
    validateString: function validateString(value) {
      return /^[а-яёa-z\- ]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы A-Z, a-z, А-Я, а-я, " ", "-"',
      en: 'Only simbols A-Z, a-z, А-Я, а-я, " ", "-"'
    }
  }); // Только цифры и русские буквы

  Parsley.addValidator('numLetterRu', {
    validateString: function validateString(value) {
      return /^[0-9а-яё]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы А-Я, а-я, 0-9',
      en: 'Only simbols А-Я, а-я, 0-9'
    }
  }); // Только цифры, латинские и русские буквы

  Parsley.addValidator('numLetter', {
    validateString: function validateString(value) {
      return /^[а-яёa-z0-9]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы A-Z, a-z, А-Я, а-я, 0-9',
      en: 'Only simbols A-Z, a-z, А-Я, а-я, 0-9'
    }
  }); // Телефонный номер

  Parsley.addValidator('phone', {
    validateString: function validateString(value) {
      return /^[-+0-9() ]*$/i.test(value);
    },
    messages: {
      ru: 'Некорректный телефонный номер',
      en: 'Incorrect phone number'
    }
  }); // Только цифры

  Parsley.addValidator('number', {
    validateString: function validateString(value) {
      return /^[0-9]*$/i.test(value);
    },
    messages: {
      ru: 'Cимволы 0-9',
      en: 'Only simbols 0-9'
    }
  }); // Почта без кириллицы

  Parsley.addValidator('email', {
    validateString: function validateString(value) {
      return /^([A-Za-zА-Яа-я0-9\-](\.|_|-){0,1})+[A-Za-zА-Яа-я0-9\-]\@([A-Za-zА-Яа-я0-9\-])+((\.){0,1}[A-Za-zА-Яа-я0-9\-]){1,}\.[a-zа-я0-9\-]{2,}$/.test(value);
    },
    messages: {
      ru: 'Некорректный почтовый адрес',
      en: 'Incorrect email address'
    }
  }); // Формат даты DD.MM.YYYY

  Parsley.addValidator('date', {
    validateString: function validateString(value) {
      var regTest = /^(?:(?:31(\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{4})$/,
          regMatch = /(\d{1,2})\.(\d{1,2})\.(\d{4})/,
          min = arguments[2].$element.data('dateMin'),
          max = arguments[2].$element.data('dateMax'),
          minDate,
          maxDate,
          valueDate,
          result;

      if (min && (result = min.match(regMatch))) {
        minDate = new Date(+result[3], result[2] - 1, +result[1]);
      }

      if (max && (result = max.match(regMatch))) {
        maxDate = new Date(+result[3], result[2] - 1, +result[1]);
      }

      if (result = value.match(regMatch)) {
        valueDate = new Date(+result[3], result[2] - 1, +result[1]);
      }

      return regTest.test(value) && (minDate ? valueDate >= minDate : true) && (maxDate ? valueDate <= maxDate : true);
    },
    messages: {
      ru: 'Некорректная дата',
      en: 'Incorrect date'
    }
  }); // Файл ограниченного размера

  Parsley.addValidator('fileMaxSize', {
    validateString: function validateString(value, maxSize, parsleyInstance) {
      var files = parsleyInstance.$element[0].files;
      return files.length != 1 || files[0].size <= maxSize * 1024;
    },
    requirementType: 'integer',
    messages: {
      ru: 'Файл должен весить не более, чем %s Kb',
      en: 'File size can\'t be more then %s Kb'
    }
  }); // Ограничения расширений файлов

  Parsley.addValidator('fileExtension', {
    validateString: function validateString(value, formats) {
      var fileExtension = value.split('.').pop();
      var formatsArr = formats.split(', ');
      var valid = false;

      for (var i = 0; i < formatsArr.length; i++) {
        if (fileExtension === formatsArr[i]) {
          valid = true;
          break;
        }
      }

      return valid;
    },
    messages: {
      ru: 'Допустимы только файлы формата %s',
      en: 'Available extensions are %s'
    }
  }); // Создаёт контейнеры для ошибок у нетипичных элементов

  Parsley.on('field:init', function () {
    var $element = this.$element,
        type = $element.attr('type'),
        $block = $('<div/>').addClass('errors-placement'),
        $last;

    if (type == 'checkbox' || type == 'radio') {
      $last = $("[name=\"".concat($element.attr('name'), "\"]:last + label"));

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    } else if ($element.hasClass('select2-hidden-accessible')) {
      $last = $element.next('.select2');

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    } else if (type == 'file') {
      $last = $element.closest('.custom-file');

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    } else if ($element.closest('.js-datepicker-range').length) {
      $last = $element.closest('.js-datepicker-range');

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    } else if ($element.attr('name') == 'is_recaptcha_success') {
      $last = $element.parent().next('.g-recaptcha');

      if (!$last.next('.errors-placement').length) {
        $last.after($block);
      }
    }
  }); // Инициирует валидацию на втором каледарном поле диапазона

  Parsley.on('field:validated', function () {
    var $element = $(this.element);
  });
  $('form[data-validate="true"]').parsley();
  /**
   * Добавляет маски в поля форм
   * @see  https://github.com/RobinHerbots/Inputmask
   *
   * @example
   * <input class="js-phone-mask" type="tel" name="tel" id="tel">
   */

  $('.js-phone-mask').inputmask('+7(999) 999-99-99', {
    clearMaskOnLostFocus: true,
    showMaskOnHover: false
  });
  $(".flagman-request__date").datepicker();
  /**
   * Костыль для обновления xlink у svg-иконок после обновления DOM (для IE)
   * функцию нужно вызывать в событиях, которые вносят изменения в элементы уже после формирования DOM-а
   * (например, после инициализации карусели или открытии попапа)
   *
   * @param  {Element} element элемент, в котором необходимо обновить svg (наприм $('#some-popup'))
   */

  function updateSvg(element) {
    var $useElement = element.find('use');
    $useElement.each(function (index) {
      if ($useElement[index].href && $useElement[index].href.baseVal) {
        $useElement[index].href.baseVal = $useElement[index].href.baseVal; // trigger fixing of href
      }
    });
  }

  var datepickerDefaultOptions = {
    dateFormat: 'dd.mm.yy',
    showOtherMonths: true
  };
  /**
   * Делает выпадющие календарики
   * @see  http://api.jqueryui.com/datepicker/
   *
   * @example
   * // в data-date-min и data-date-max можно задать дату в формате dd.mm.yyyy
   * <input type="text" name="dateInput" id="" class="js-datepicker" data-date-min="06.11.2015" data-date-max="10.12.2015">
   */

  var Datepicker = function Datepicker() {
    var datepicker = $('.js-datepicker');
    datepicker.each(function () {
      var minDate = $(this).data('date-min');
      var maxDate = $(this).data('date-max');
      var itemOptions = {
        minDate: minDate || null,
        maxDate: maxDate || null,
        onSelect: function onSelect() {
          $(this).change();
          $(this).closest('.field').addClass('is-filled');
        }
      };
      $.extend(true, itemOptions, datepickerDefaultOptions);
      $(this).datepicker(itemOptions);
    });
  };

  var datepicker = new Datepicker(); // Диапазон дат

  var DatepickerRange = function DatepickerRange() {
    var datepickerRange = $('.js-datepicker-range');
    datepickerRange.each(function () {
      var fromItemOptions = {};
      var toItemOptions = {};
      $.extend(true, fromItemOptions, datepickerDefaultOptions);
      $.extend(true, toItemOptions, datepickerDefaultOptions);
      var dateFrom = $(this).find('.js-range-from').datepicker(fromItemOptions);
      var dateTo = $(this).find('.js-range-to').datepicker(toItemOptions);
      dateFrom.on('change', function () {
        dateTo.datepicker('option', 'minDate', getDate(this));
        dateTo.prop('required', true);

        if ($(this).hasClass('parsley-error') && $(this).parsley().isValid()) {
          $(this).parsley().validate();
        }
      });
      dateTo.on('change', function () {
        dateFrom.datepicker('option', 'maxDate', getDate(this));
        dateFrom.prop('required', true);

        if ($(this).hasClass('parsley-error') && $(this).parsley().isValid()) {
          $(this).parsley().validate();
        }
      });
    });

    function getDate(element) {
      var date;

      try {
        date = $.datepicker.parseDate(datepickerDefaultOptions.dateFormat, element.value);
      } catch (error) {
        date = null;
      }

      return date;
    }
  };

  var datepickerRange = new DatepickerRange();
  /**
   * Реализует переключение табов
   *
   * @example
   * <ul class="tabs js-tabs">
   *     <li class="tabs__item">
   *         <span class="is-active tabs__link js-tab-link">Tab name</span>
   *         <div class="tabs__cnt">
   *             <p>Tab content</p>
   *         </div>
   *     </li>
   * </ul>
   */

  var TabSwitcher = function TabSwitcher() {
    var self = this;
    var tabs = $('.js-tabs');
    tabs.each(function () {
      $(this).find('.js-tab-link.is-active').next().addClass('is-open');
    });
    tabs.on('click', '.js-tab-link', function (event) {
      self.open($(this), event); // return false;
    });
    /**
     * Открывает таб по клику на какой-то другой элемент
     *
     * @example
     * <span data-tab-open="#tab-login">Open login tab</span>
     */

    $(document).on('click', '[data-tab-open]', function (event) {
      var tabElem = $(this).data('tab-open');
      self.open($(tabElem), event);

      if ($(this).data('popup') == undefined) {
        return false;
      }
    });
    /**
     * Открывает таб
     * @param  {Element} elem элемент .js-tab-link, на который нужно переключить
     *
     * @example
     * // вызов метода open, откроет таб
     * tabSwitcher.open($('#some-tab'));
     */

    self.open = function (elem, event) {
      if (!elem.hasClass('is-active')) {
        event.preventDefault();
        var parentTabs = elem.closest(tabs);
        parentTabs.find('.is-open').removeClass('is-open');
        elem.next().toggleClass('is-open');
        parentTabs.find('.is-active').removeClass('is-active');
        elem.addClass('is-active');
      } else {
        event.preventDefault();
      }
    };
  };

  var tabSwitcher = new TabSwitcher();
  /**
   * Скрывает элемент hiddenElem при клике за пределами элемента targetElem
   *
   * @param  {Element}   targetElem
   * @param  {Element}   hiddenElem
   * @param  {Function}  [optionalCb] отрабатывает сразу не дожидаясь завершения анимации
   */

  function onOutsideClickHide(targetElem, hiddenElem, optionalCb) {
    $(document).bind('mouseup touchend', function (e) {
      if (!targetElem.is(e.target) && $(e.target).closest(targetElem).length == 0) {
        hiddenElem.stop(true, true).fadeOut(globalOptions.time);

        if (optionalCb) {
          optionalCb();
        }
      }
    });
  }
  /**
   * Хэлпер для показа, скрытия или чередования видимости элементов
   *
   * @example
   * <button type="button" data-visibility="show" data-show="#elemId1"></button>
   *
   * или
   * <button type="button" data-visibility="hide" data-hide="#elemId2"></button>
   *
   * или
   * <button type="button" data-visibility="toggle" data-toggle="#elemId3"></button>
   *
   * или
   * <button type="button" data-visibility="show" data-show="#elemId1|#elemId3"></button>
   *
   * или
   * // если есть атрибут data-queue="show", то будет сначала скрыт элемент #elemId2, а потом показан #elemId1
   * <button type="button" data-visibility="show" data-show="#elemId1" data-visibility="hide" data-hide="#elemId2" data-queue="show"></button>
   *
   * <div id="elemId1" style="display: none;">Text</div>
   * <div id="elemId2">Text</div>
   * <div id="elemId3" style="display: none;">Text</div>
   */


  var visibilityControl = function visibilityControl() {
    var settings = {
      types: ['show', 'hide', 'toggle']
    };

    if ($('[data-visibility]').length > 0) {
      /**
       * Устанавливает видимость
       * @param {String}  visibilityType тип отображения
       * @param {Array}   list массив элементов, с которым работаем
       * @param {Number}  delay задержка при показе элемента в ms
       */
      var setVisibility = function setVisibility(visibilityType, list, delay) {
        for (var i = 0; i < list.length; i++) {
          if (visibilityType == settings.types[0]) {
            $(list[i]).delay(delay).fadeIn(globalOptions.time);
          }

          if (visibilityType == settings.types[1]) {
            $(list[i]).fadeOut(globalOptions.time);
          }

          if (visibilityType == settings.types[2]) {
            if ($(list[i]).is(':visible')) {
              $(list[i]).fadeOut(globalOptions.time);
            } else {
              $(list[i]).fadeIn(globalOptions.time);
            }
          }
        }
      };

      $(document).on('click', '[data-visibility]', function () {
        var dataType;

        for (var i = 0; i < settings.types.length; i++) {
          dataType = settings.types[i];

          if ($(this).data(dataType)) {
            var visibilityList = $(this).data(dataType).split('|'),
                delay = 0;

            if ($(this).data('queue') == 'show') {
              delay = globalOptions.time;
            } else {
              delay = 0;
            }

            setVisibility(dataType, visibilityList, delay);
          }
        }

        if (!$(this).hasClass('tabs__link') && $(this).attr('type') != 'radio' && $(this).attr('type') != 'checkbox') {
          return false;
        }
      });
    }
  };

  visibilityControl();
  /**
   * Делает слайдер
   * @see  http://api.jqueryui.com/slider/
   *
   * @example
   * // в data-min и data-max задаются минимальное и максимальное значение
   * // в data-step шаг,
   * // в data-values дефолтные значения "min, max"
   * <div class="slider js-range">
   *      <div class="slider__range" data-min="0" data-max="100" data-step="1" data-values="10, 55"></div>
   * </div>
   */

  var Slider = function Slider() {
    var slider = $('.js-range');
    var min, max, step, values;
    slider.each(function () {
      var self = $(this),
          range = self.find('.slider__range');
      min = range.data('min');
      max = range.data('max');
      step = range.data('step');
      values = range.data('values').split(', ');
      range.slider({
        range: true,
        min: min || null,
        max: max || null,
        step: step || 1,
        values: values,
        slide: function slide(event, ui) {
          self.find('.ui-slider-handle').children('span').remove();
          self.find('.ui-slider-handle:nth-child(2)').append("<span>".concat(ui.values[0], "</span>"));
          self.find('.ui-slider-handle:nth-child(3)').append("<span>".concat(ui.values[1], "</span>"));
        }
      });
      self.find('.ui-slider-handle:nth-child(2)').append("<span>".concat(range.slider('values', 0), "</span>"));
      self.find('.ui-slider-handle:nth-child(3)').append("<span>".concat(range.slider('values', 1), "</span>"));
    });
  };

  var slider = new Slider();

  window.onload = function () {
    var Persons = document.querySelectorAll('.team_persons_photo');
    Persons.forEach(function (node) {
      node.addEventListener('click', function (element) {
        Persons.forEach(function (node) {
          node.style.width = '13%';
        });
        var current = element.target;
        current.style.width = "18%";
        current.nextElementSibling.style.width = "16%";
        current.previousElementSibling.style.width = "16%";
        current.nextElementSibling.nextElementSibling.style.width = "14%";
        current.previousElementSibling.previousElementSibling.style.width = "14%";
      });
    });
  };

  $(".modal_dialog_content_item").not(":first").hide();
  $(".modal_dialog_content .modal_button").click(function () {
    $(".modal_dialog_content .modal_button").removeClass("active").eq($(this).index()).addClass("active");
    $(".modal_dialog_content_item").hide().eq($(this).index()).fadeIn();
  }).eq(0).addClass("active");
  var modalCall = $("[data-modal]");
  var modalClose = $("[data-close]");
  modalCall.on("click", function (event) {
    event.preventDefault();
    var $this = $(this);
    var modalId = $this.data('modal');
    $(modalId).addClass('show');
    $("body").addClass('no-scroll');
    setTimeout(function () {
      $(modalId).find(".location").css({
        transform: "scale(1)"
      });
    }, 100);
  });
  modalClose.on("click", function (event) {
    event.preventDefault();
    var $this = $(this);
    var modalParent = $this.parents('.modal');
    modalParent.find(".location").css({
      transform: "scale(0)"
    });
    setTimeout(function () {
      modalParent.removeClass('show');
      $("body").removeClass('no-scroll');
    }, 100);
  });
  $(".modal").on("click", function (event) {
    var $this = $(this);
    $this.find(".location").css({
      transform: "scale(0)"
    });
    setTimeout(function () {
      $this.removeClass('show');
      $("body").removeClass('no-scroll');
    }, 200);
  });
  $(".location").on("click", function (event) {
    event.stopPropagation();
  });
  var doc = document.querySelectorAll('.contr');
  doc.forEach(function (node) {
    node.addEventListener('click', function (element) {
      doc.forEach(function (node) {
        node.style.width = '223px';
      });
      var current = element.target;
      current.style.width = "284px";
    });
  });
  $('a[href^="#"]').on('click', function (event) {
    // отменяем стандартное действие
    event.preventDefault();
    var sc = $(this).attr("href"),
        dn = $(sc).offset().top;
    /*
    * sc - в переменную заносим информацию о том, к какому блоку надо перейти
    * dn - определяем положение блока на странице
    */

    $('html, body').animate({
      scrollTop: dn
    }, 1000);
    /*
    * 1000 скорость перехода в миллисекундах
    */
  });
  /*window.onload = function () {
        window.Nodes = document.querySelectorAll('.cases_content_item');
      let i = -1;
      let count = 0;
      let flag = false;
      document.addEventListener('scroll', () => {
          if (window.scrollY > Nodes[0].getBoundingClientRect().y) {
              flag = true;
          }
      },
       {
          passive: false
      }
      );
        document.addEventListener('wheel', (event) => {
          if (flag == true) {
              console.log('scroll' + window.scrollY);
              count++;
              console.log(count);
              if (count > 10) {
                  if (i < Nodes.length - 1) {
                      i++;
                      Nodes[i].scrollIntoView({
                          behavior: 'smooth'
                      });
                      count = 0;
                  }else{
                      flag=false;
                  }
              
              }
              event.preventDefault();
              event.stopPropagation();
          }
      }, {
          passive: false
      });
  }
  */
  // $(".cases_sidebar_list_item").click(function(e) {
  //     e.preventDefault();
  //     $(".cases_sidebar_list_item").removeClass('active');
  //     $(this).addClass('active');
  // });

  $(document).ready(function () {
    $(".intro_cases").hide();
  });
  $("#op").click(function (e) {
    e.preventDefault(); // $(".intro_items").removeClass('active');
    // $(this).addClass('active');
    // $(".intro_items").addClass('display_none');

    $(".intro_items").hide();
    $(".intro_cases").show('speed');
  }); // $(document).ready(function(){
  // 	$("#op").click(function(){
  // 		$(".intro_items").toggleClass("display_none"); return false;
  // 	});
  // });
  // $("#btn-drop").click(function() {
  //     if (flag['drop'] = !flag['drop']) {
  //         $("#test-drop").hide("drop", { direction: "right" }, 1000);
  //     }
  //     else {
  //         $("#test-drop").show("drop", { direction: "down" }, 500);
  //     }
  // });

  /**
   * Фиксированный хедер
   */
  // $(window).on('scroll', toggleFixedHeader);
  // function toggleFixedHeader() {
  //     const $header = $('.header');
  //     const $main = $('.header').next();
  //     if (window.pageYOffset > 0) {
  //         $header.addClass('is-fixed');
  //         $main.css({ marginTop: $header.outerHeight() });
  //     } else {
  //         $header.removeClass('is-fixed');
  //         $main.css({ marginTop: 0 });
  //     }
  // }

  !function (i) {
    "use strict";

    "function" == typeof define && define.amd ? define(["jquery"], i) : "undefined" != typeof exports ? module.exports = i(require("jquery")) : i(jQuery);
  }(function (i) {
    "use strict";

    var e = window.Slick || {};
    (e = function () {
      var e = 0;
      return function (t, o) {
        var s,
            n = this;
        n.defaults = {
          accessibility: !0,
          adaptiveHeight: !1,
          appendArrows: i(t),
          appendDots: i(t),
          arrows: !0,
          asNavFor: null,
          prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
          nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
          autoplay: !1,
          autoplaySpeed: 3e3,
          centerMode: !1,
          centerPadding: "50px",
          cssEase: "ease",
          customPaging: function customPaging(e, t) {
            return i('<button type="button" />').text(t + 1);
          },
          dots: !1,
          dotsClass: "slick-dots",
          draggable: !0,
          easing: "linear",
          edgeFriction: .35,
          fade: !1,
          focusOnSelect: !1,
          focusOnChange: !1,
          infinite: !0,
          initialSlide: 0,
          lazyLoad: "ondemand",
          mobileFirst: !1,
          pauseOnHover: !0,
          pauseOnFocus: !0,
          pauseOnDotsHover: !1,
          respondTo: "window",
          responsive: null,
          rows: 1,
          rtl: !1,
          slide: "",
          slidesPerRow: 1,
          slidesToShow: 1,
          slidesToScroll: 1,
          speed: 500,
          swipe: !0,
          swipeToSlide: !1,
          touchMove: !0,
          touchThreshold: 5,
          useCSS: !0,
          useTransform: !0,
          variableWidth: !1,
          vertical: !1,
          verticalSwiping: !1,
          waitForAnimate: !0,
          zIndex: 1e3
        }, n.initials = {
          animating: !1,
          dragging: !1,
          autoPlayTimer: null,
          currentDirection: 0,
          currentLeft: null,
          currentSlide: 0,
          direction: 1,
          $dots: null,
          listWidth: null,
          listHeight: null,
          loadIndex: 0,
          $nextArrow: null,
          $prevArrow: null,
          scrolling: !1,
          slideCount: null,
          slideWidth: null,
          $slideTrack: null,
          $slides: null,
          sliding: !1,
          slideOffset: 0,
          swipeLeft: null,
          swiping: !1,
          $list: null,
          touchObject: {},
          transformsEnabled: !1,
          unslicked: !1
        }, i.extend(n, n.initials), n.activeBreakpoint = null, n.animType = null, n.animProp = null, n.breakpoints = [], n.breakpointSettings = [], n.cssTransitions = !1, n.focussed = !1, n.interrupted = !1, n.hidden = "hidden", n.paused = !0, n.positionProp = null, n.respondTo = null, n.rowCount = 1, n.shouldClick = !0, n.$slider = i(t), n.$slidesCache = null, n.transformType = null, n.transitionType = null, n.visibilityChange = "visibilitychange", n.windowWidth = 0, n.windowTimer = null, s = i(t).data("slick") || {}, n.options = i.extend({}, n.defaults, o, s), n.currentSlide = n.options.initialSlide, n.originalSettings = n.options, void 0 !== document.mozHidden ? (n.hidden = "mozHidden", n.visibilityChange = "mozvisibilitychange") : void 0 !== document.webkitHidden && (n.hidden = "webkitHidden", n.visibilityChange = "webkitvisibilitychange"), n.autoPlay = i.proxy(n.autoPlay, n), n.autoPlayClear = i.proxy(n.autoPlayClear, n), n.autoPlayIterator = i.proxy(n.autoPlayIterator, n), n.changeSlide = i.proxy(n.changeSlide, n), n.clickHandler = i.proxy(n.clickHandler, n), n.selectHandler = i.proxy(n.selectHandler, n), n.setPosition = i.proxy(n.setPosition, n), n.swipeHandler = i.proxy(n.swipeHandler, n), n.dragHandler = i.proxy(n.dragHandler, n), n.keyHandler = i.proxy(n.keyHandler, n), n.instanceUid = e++, n.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, n.registerBreakpoints(), n.init(!0);
      };
    }()).prototype.activateADA = function () {
      this.$slideTrack.find(".slick-active").attr({
        "aria-hidden": "false"
      }).find("a, input, button, select").attr({
        tabindex: "0"
      });
    }, e.prototype.addSlide = e.prototype.slickAdd = function (e, t, o) {
      var s = this;
      if ("boolean" == typeof t) o = t, t = null;else if (t < 0 || t >= s.slideCount) return !1;
      s.unload(), "number" == typeof t ? 0 === t && 0 === s.$slides.length ? i(e).appendTo(s.$slideTrack) : o ? i(e).insertBefore(s.$slides.eq(t)) : i(e).insertAfter(s.$slides.eq(t)) : !0 === o ? i(e).prependTo(s.$slideTrack) : i(e).appendTo(s.$slideTrack), s.$slides = s.$slideTrack.children(this.options.slide), s.$slideTrack.children(this.options.slide).detach(), s.$slideTrack.append(s.$slides), s.$slides.each(function (e, t) {
        i(t).attr("data-slick-index", e);
      }), s.$slidesCache = s.$slides, s.reinit();
    }, e.prototype.animateHeight = function () {
      var i = this;

      if (1 === i.options.slidesToShow && !0 === i.options.adaptiveHeight && !1 === i.options.vertical) {
        var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
        i.$list.animate({
          height: e
        }, i.options.speed);
      }
    }, e.prototype.animateSlide = function (e, t) {
      var o = {},
          s = this;
      s.animateHeight(), !0 === s.options.rtl && !1 === s.options.vertical && (e = -e), !1 === s.transformsEnabled ? !1 === s.options.vertical ? s.$slideTrack.animate({
        left: e
      }, s.options.speed, s.options.easing, t) : s.$slideTrack.animate({
        top: e
      }, s.options.speed, s.options.easing, t) : !1 === s.cssTransitions ? (!0 === s.options.rtl && (s.currentLeft = -s.currentLeft), i({
        animStart: s.currentLeft
      }).animate({
        animStart: e
      }, {
        duration: s.options.speed,
        easing: s.options.easing,
        step: function step(i) {
          i = Math.ceil(i), !1 === s.options.vertical ? (o[s.animType] = "translate(" + i + "px, 0px)", s.$slideTrack.css(o)) : (o[s.animType] = "translate(0px," + i + "px)", s.$slideTrack.css(o));
        },
        complete: function complete() {
          t && t.call();
        }
      })) : (s.applyTransition(), e = Math.ceil(e), !1 === s.options.vertical ? o[s.animType] = "translate3d(" + e + "px, 0px, 0px)" : o[s.animType] = "translate3d(0px," + e + "px, 0px)", s.$slideTrack.css(o), t && setTimeout(function () {
        s.disableTransition(), t.call();
      }, s.options.speed));
    }, e.prototype.getNavTarget = function () {
      var e = this,
          t = e.options.asNavFor;
      return t && null !== t && (t = i(t).not(e.$slider)), t;
    }, e.prototype.asNavFor = function (e) {
      var t = this.getNavTarget();
      null !== t && "object" == _typeof(t) && t.each(function () {
        var t = i(this).slick("getSlick");
        t.unslicked || t.slideHandler(e, !0);
      });
    }, e.prototype.applyTransition = function (i) {
      var e = this,
          t = {};
      !1 === e.options.fade ? t[e.transitionType] = e.transformType + " " + e.options.speed + "ms " + e.options.cssEase : t[e.transitionType] = "opacity " + e.options.speed + "ms " + e.options.cssEase, !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t);
    }, e.prototype.autoPlay = function () {
      var i = this;
      i.autoPlayClear(), i.slideCount > i.options.slidesToShow && (i.autoPlayTimer = setInterval(i.autoPlayIterator, i.options.autoplaySpeed));
    }, e.prototype.autoPlayClear = function () {
      var i = this;
      i.autoPlayTimer && clearInterval(i.autoPlayTimer);
    }, e.prototype.autoPlayIterator = function () {
      var i = this,
          e = i.currentSlide + i.options.slidesToScroll;
      i.paused || i.interrupted || i.focussed || (!1 === i.options.infinite && (1 === i.direction && i.currentSlide + 1 === i.slideCount - 1 ? i.direction = 0 : 0 === i.direction && (e = i.currentSlide - i.options.slidesToScroll, i.currentSlide - 1 == 0 && (i.direction = 1))), i.slideHandler(e));
    }, e.prototype.buildArrows = function () {
      var e = this;
      !0 === e.options.arrows && (e.$prevArrow = i(e.options.prevArrow).addClass("slick-arrow"), e.$nextArrow = i(e.options.nextArrow).addClass("slick-arrow"), e.slideCount > e.options.slidesToShow ? (e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.prependTo(e.options.appendArrows), e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.appendTo(e.options.appendArrows), !0 !== e.options.infinite && e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({
        "aria-disabled": "true",
        tabindex: "-1"
      }));
    }, e.prototype.buildDots = function () {
      var e,
          t,
          o = this;

      if (!0 === o.options.dots) {
        for (o.$slider.addClass("slick-dotted"), t = i("<ul />").addClass(o.options.dotsClass), e = 0; e <= o.getDotCount(); e += 1) {
          t.append(i("<li />").append(o.options.customPaging.call(this, o, e)));
        }

        o.$dots = t.appendTo(o.options.appendDots), o.$dots.find("li").first().addClass("slick-active");
      }
    }, e.prototype.buildOut = function () {
      var e = this;
      e.$slides = e.$slider.children(e.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), e.slideCount = e.$slides.length, e.$slides.each(function (e, t) {
        i(t).attr("data-slick-index", e).data("originalStyling", i(t).attr("style") || "");
      }), e.$slider.addClass("slick-slider"), e.$slideTrack = 0 === e.slideCount ? i('<div class="slick-track"/>').appendTo(e.$slider) : e.$slides.wrapAll('<div class="slick-track"/>').parent(), e.$list = e.$slideTrack.wrap('<div class="slick-list"/>').parent(), e.$slideTrack.css("opacity", 0), !0 !== e.options.centerMode && !0 !== e.options.swipeToSlide || (e.options.slidesToScroll = 1), i("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading"), e.setupInfinite(), e.buildArrows(), e.buildDots(), e.updateDots(), e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), !0 === e.options.draggable && e.$list.addClass("draggable");
    }, e.prototype.buildRows = function () {
      var i,
          e,
          t,
          o,
          s,
          n,
          r,
          l = this;

      if (o = document.createDocumentFragment(), n = l.$slider.children(), l.options.rows > 1) {
        for (r = l.options.slidesPerRow * l.options.rows, s = Math.ceil(n.length / r), i = 0; i < s; i++) {
          var d = document.createElement("div");

          for (e = 0; e < l.options.rows; e++) {
            var a = document.createElement("div");

            for (t = 0; t < l.options.slidesPerRow; t++) {
              var c = i * r + (e * l.options.slidesPerRow + t);
              n.get(c) && a.appendChild(n.get(c));
            }

            d.appendChild(a);
          }

          o.appendChild(d);
        }

        l.$slider.empty().append(o), l.$slider.children().children().children().css({
          width: 100 / l.options.slidesPerRow + "%",
          display: "inline-block"
        });
      }
    }, e.prototype.checkResponsive = function (e, t) {
      var o,
          s,
          n,
          r = this,
          l = !1,
          d = r.$slider.width(),
          a = window.innerWidth || i(window).width();

      if ("window" === r.respondTo ? n = a : "slider" === r.respondTo ? n = d : "min" === r.respondTo && (n = Math.min(a, d)), r.options.responsive && r.options.responsive.length && null !== r.options.responsive) {
        s = null;

        for (o in r.breakpoints) {
          r.breakpoints.hasOwnProperty(o) && (!1 === r.originalSettings.mobileFirst ? n < r.breakpoints[o] && (s = r.breakpoints[o]) : n > r.breakpoints[o] && (s = r.breakpoints[o]));
        }

        null !== s ? null !== r.activeBreakpoint ? (s !== r.activeBreakpoint || t) && (r.activeBreakpoint = s, "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]), !0 === e && (r.currentSlide = r.options.initialSlide), r.refresh(e)), l = s) : (r.activeBreakpoint = s, "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]), !0 === e && (r.currentSlide = r.options.initialSlide), r.refresh(e)), l = s) : null !== r.activeBreakpoint && (r.activeBreakpoint = null, r.options = r.originalSettings, !0 === e && (r.currentSlide = r.options.initialSlide), r.refresh(e), l = s), e || !1 === l || r.$slider.trigger("breakpoint", [r, l]);
      }
    }, e.prototype.changeSlide = function (e, t) {
      var o,
          s,
          n,
          r = this,
          l = i(e.currentTarget);

      switch (l.is("a") && e.preventDefault(), l.is("li") || (l = l.closest("li")), n = r.slideCount % r.options.slidesToScroll != 0, o = n ? 0 : (r.slideCount - r.currentSlide) % r.options.slidesToScroll, e.data.message) {
        case "previous":
          s = 0 === o ? r.options.slidesToScroll : r.options.slidesToShow - o, r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide - s, !1, t);
          break;

        case "next":
          s = 0 === o ? r.options.slidesToScroll : o, r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide + s, !1, t);
          break;

        case "index":
          var d = 0 === e.data.index ? 0 : e.data.index || l.index() * r.options.slidesToScroll;
          r.slideHandler(r.checkNavigable(d), !1, t), l.children().trigger("focus");
          break;

        default:
          return;
      }
    }, e.prototype.checkNavigable = function (i) {
      var e, t;
      if (e = this.getNavigableIndexes(), t = 0, i > e[e.length - 1]) i = e[e.length - 1];else for (var o in e) {
        if (i < e[o]) {
          i = t;
          break;
        }

        t = e[o];
      }
      return i;
    }, e.prototype.cleanUpEvents = function () {
      var e = this;
      e.options.dots && null !== e.$dots && (i("li", e.$dots).off("click.slick", e.changeSlide).off("mouseenter.slick", i.proxy(e.interrupt, e, !0)).off("mouseleave.slick", i.proxy(e.interrupt, e, !1)), !0 === e.options.accessibility && e.$dots.off("keydown.slick", e.keyHandler)), e.$slider.off("focus.slick blur.slick"), !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow && e.$prevArrow.off("click.slick", e.changeSlide), e.$nextArrow && e.$nextArrow.off("click.slick", e.changeSlide), !0 === e.options.accessibility && (e.$prevArrow && e.$prevArrow.off("keydown.slick", e.keyHandler), e.$nextArrow && e.$nextArrow.off("keydown.slick", e.keyHandler))), e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler), e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler), e.$list.off("touchend.slick mouseup.slick", e.swipeHandler), e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler), e.$list.off("click.slick", e.clickHandler), i(document).off(e.visibilityChange, e.visibility), e.cleanUpSlideEvents(), !0 === e.options.accessibility && e.$list.off("keydown.slick", e.keyHandler), !0 === e.options.focusOnSelect && i(e.$slideTrack).children().off("click.slick", e.selectHandler), i(window).off("orientationchange.slick.slick-" + e.instanceUid, e.orientationChange), i(window).off("resize.slick.slick-" + e.instanceUid, e.resize), i("[draggable!=true]", e.$slideTrack).off("dragstart", e.preventDefault), i(window).off("load.slick.slick-" + e.instanceUid, e.setPosition);
    }, e.prototype.cleanUpSlideEvents = function () {
      var e = this;
      e.$list.off("mouseenter.slick", i.proxy(e.interrupt, e, !0)), e.$list.off("mouseleave.slick", i.proxy(e.interrupt, e, !1));
    }, e.prototype.cleanUpRows = function () {
      var i,
          e = this;
      e.options.rows > 1 && ((i = e.$slides.children().children()).removeAttr("style"), e.$slider.empty().append(i));
    }, e.prototype.clickHandler = function (i) {
      !1 === this.shouldClick && (i.stopImmediatePropagation(), i.stopPropagation(), i.preventDefault());
    }, e.prototype.destroy = function (e) {
      var t = this;
      t.autoPlayClear(), t.touchObject = {}, t.cleanUpEvents(), i(".slick-cloned", t.$slider).detach(), t.$dots && t.$dots.remove(), t.$prevArrow && t.$prevArrow.length && (t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove()), t.$nextArrow && t.$nextArrow.length && (t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove()), t.$slides && (t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function () {
        i(this).attr("style", i(this).data("originalStyling"));
      }), t.$slideTrack.children(this.options.slide).detach(), t.$slideTrack.detach(), t.$list.detach(), t.$slider.append(t.$slides)), t.cleanUpRows(), t.$slider.removeClass("slick-slider"), t.$slider.removeClass("slick-initialized"), t.$slider.removeClass("slick-dotted"), t.unslicked = !0, e || t.$slider.trigger("destroy", [t]);
    }, e.prototype.disableTransition = function (i) {
      var e = this,
          t = {};
      t[e.transitionType] = "", !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t);
    }, e.prototype.fadeSlide = function (i, e) {
      var t = this;
      !1 === t.cssTransitions ? (t.$slides.eq(i).css({
        zIndex: t.options.zIndex
      }), t.$slides.eq(i).animate({
        opacity: 1
      }, t.options.speed, t.options.easing, e)) : (t.applyTransition(i), t.$slides.eq(i).css({
        opacity: 1,
        zIndex: t.options.zIndex
      }), e && setTimeout(function () {
        t.disableTransition(i), e.call();
      }, t.options.speed));
    }, e.prototype.fadeSlideOut = function (i) {
      var e = this;
      !1 === e.cssTransitions ? e.$slides.eq(i).animate({
        opacity: 0,
        zIndex: e.options.zIndex - 2
      }, e.options.speed, e.options.easing) : (e.applyTransition(i), e.$slides.eq(i).css({
        opacity: 0,
        zIndex: e.options.zIndex - 2
      }));
    }, e.prototype.filterSlides = e.prototype.slickFilter = function (i) {
      var e = this;
      null !== i && (e.$slidesCache = e.$slides, e.unload(), e.$slideTrack.children(this.options.slide).detach(), e.$slidesCache.filter(i).appendTo(e.$slideTrack), e.reinit());
    }, e.prototype.focusHandler = function () {
      var e = this;
      e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*", function (t) {
        t.stopImmediatePropagation();
        var o = i(this);
        setTimeout(function () {
          e.options.pauseOnFocus && (e.focussed = o.is(":focus"), e.autoPlay());
        }, 0);
      });
    }, e.prototype.getCurrent = e.prototype.slickCurrentSlide = function () {
      return this.currentSlide;
    }, e.prototype.getDotCount = function () {
      var i = this,
          e = 0,
          t = 0,
          o = 0;
      if (!0 === i.options.infinite) {
        if (i.slideCount <= i.options.slidesToShow) ++o;else for (; e < i.slideCount;) {
          ++o, e = t + i.options.slidesToScroll, t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow;
        }
      } else if (!0 === i.options.centerMode) o = i.slideCount;else if (i.options.asNavFor) for (; e < i.slideCount;) {
        ++o, e = t + i.options.slidesToScroll, t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow;
      } else o = 1 + Math.ceil((i.slideCount - i.options.slidesToShow) / i.options.slidesToScroll);
      return o - 1;
    }, e.prototype.getLeft = function (i) {
      var e,
          t,
          o,
          s,
          n = this,
          r = 0;
      return n.slideOffset = 0, t = n.$slides.first().outerHeight(!0), !0 === n.options.infinite ? (n.slideCount > n.options.slidesToShow && (n.slideOffset = n.slideWidth * n.options.slidesToShow * -1, s = -1, !0 === n.options.vertical && !0 === n.options.centerMode && (2 === n.options.slidesToShow ? s = -1.5 : 1 === n.options.slidesToShow && (s = -2)), r = t * n.options.slidesToShow * s), n.slideCount % n.options.slidesToScroll != 0 && i + n.options.slidesToScroll > n.slideCount && n.slideCount > n.options.slidesToShow && (i > n.slideCount ? (n.slideOffset = (n.options.slidesToShow - (i - n.slideCount)) * n.slideWidth * -1, r = (n.options.slidesToShow - (i - n.slideCount)) * t * -1) : (n.slideOffset = n.slideCount % n.options.slidesToScroll * n.slideWidth * -1, r = n.slideCount % n.options.slidesToScroll * t * -1))) : i + n.options.slidesToShow > n.slideCount && (n.slideOffset = (i + n.options.slidesToShow - n.slideCount) * n.slideWidth, r = (i + n.options.slidesToShow - n.slideCount) * t), n.slideCount <= n.options.slidesToShow && (n.slideOffset = 0, r = 0), !0 === n.options.centerMode && n.slideCount <= n.options.slidesToShow ? n.slideOffset = n.slideWidth * Math.floor(n.options.slidesToShow) / 2 - n.slideWidth * n.slideCount / 2 : !0 === n.options.centerMode && !0 === n.options.infinite ? n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2) - n.slideWidth : !0 === n.options.centerMode && (n.slideOffset = 0, n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2)), e = !1 === n.options.vertical ? i * n.slideWidth * -1 + n.slideOffset : i * t * -1 + r, !0 === n.options.variableWidth && (o = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(i) : n.$slideTrack.children(".slick-slide").eq(i + n.options.slidesToShow), e = !0 === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0, !0 === n.options.centerMode && (o = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(i) : n.$slideTrack.children(".slick-slide").eq(i + n.options.slidesToShow + 1), e = !0 === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0, e += (n.$list.width() - o.outerWidth()) / 2)), e;
    }, e.prototype.getOption = e.prototype.slickGetOption = function (i) {
      return this.options[i];
    }, e.prototype.getNavigableIndexes = function () {
      var i,
          e = this,
          t = 0,
          o = 0,
          s = [];

      for (!1 === e.options.infinite ? i = e.slideCount : (t = -1 * e.options.slidesToScroll, o = -1 * e.options.slidesToScroll, i = 2 * e.slideCount); t < i;) {
        s.push(t), t = o + e.options.slidesToScroll, o += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
      }

      return s;
    }, e.prototype.getSlick = function () {
      return this;
    }, e.prototype.getSlideCount = function () {
      var e,
          t,
          o = this;
      return t = !0 === o.options.centerMode ? o.slideWidth * Math.floor(o.options.slidesToShow / 2) : 0, !0 === o.options.swipeToSlide ? (o.$slideTrack.find(".slick-slide").each(function (s, n) {
        if (n.offsetLeft - t + i(n).outerWidth() / 2 > -1 * o.swipeLeft) return e = n, !1;
      }), Math.abs(i(e).attr("data-slick-index") - o.currentSlide) || 1) : o.options.slidesToScroll;
    }, e.prototype.goTo = e.prototype.slickGoTo = function (i, e) {
      this.changeSlide({
        data: {
          message: "index",
          index: parseInt(i)
        }
      }, e);
    }, e.prototype.init = function (e) {
      var t = this;
      i(t.$slider).hasClass("slick-initialized") || (i(t.$slider).addClass("slick-initialized"), t.buildRows(), t.buildOut(), t.setProps(), t.startLoad(), t.loadSlider(), t.initializeEvents(), t.updateArrows(), t.updateDots(), t.checkResponsive(!0), t.focusHandler()), e && t.$slider.trigger("init", [t]), !0 === t.options.accessibility && t.initADA(), t.options.autoplay && (t.paused = !1, t.autoPlay());
    }, e.prototype.initADA = function () {
      var e = this,
          t = Math.ceil(e.slideCount / e.options.slidesToShow),
          o = e.getNavigableIndexes().filter(function (i) {
        return i >= 0 && i < e.slideCount;
      });
      e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({
        "aria-hidden": "true",
        tabindex: "-1"
      }).find("a, input, button, select").attr({
        tabindex: "-1"
      }), null !== e.$dots && (e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function (t) {
        var s = o.indexOf(t);
        i(this).attr({
          role: "tabpanel",
          id: "slick-slide" + e.instanceUid + t,
          tabindex: -1
        }), -1 !== s && i(this).attr({
          "aria-describedby": "slick-slide-control" + e.instanceUid + s
        });
      }), e.$dots.attr("role", "tablist").find("li").each(function (s) {
        var n = o[s];
        i(this).attr({
          role: "presentation"
        }), i(this).find("button").first().attr({
          role: "tab",
          id: "slick-slide-control" + e.instanceUid + s,
          "aria-controls": "slick-slide" + e.instanceUid + n,
          "aria-label": s + 1 + " of " + t,
          "aria-selected": null,
          tabindex: "-1"
        });
      }).eq(e.currentSlide).find("button").attr({
        "aria-selected": "true",
        tabindex: "0"
      }).end());

      for (var s = e.currentSlide, n = s + e.options.slidesToShow; s < n; s++) {
        e.$slides.eq(s).attr("tabindex", 0);
      }

      e.activateADA();
    }, e.prototype.initArrowEvents = function () {
      var i = this;
      !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.off("click.slick").on("click.slick", {
        message: "previous"
      }, i.changeSlide), i.$nextArrow.off("click.slick").on("click.slick", {
        message: "next"
      }, i.changeSlide), !0 === i.options.accessibility && (i.$prevArrow.on("keydown.slick", i.keyHandler), i.$nextArrow.on("keydown.slick", i.keyHandler)));
    }, e.prototype.initDotEvents = function () {
      var e = this;
      !0 === e.options.dots && (i("li", e.$dots).on("click.slick", {
        message: "index"
      }, e.changeSlide), !0 === e.options.accessibility && e.$dots.on("keydown.slick", e.keyHandler)), !0 === e.options.dots && !0 === e.options.pauseOnDotsHover && i("li", e.$dots).on("mouseenter.slick", i.proxy(e.interrupt, e, !0)).on("mouseleave.slick", i.proxy(e.interrupt, e, !1));
    }, e.prototype.initSlideEvents = function () {
      var e = this;
      e.options.pauseOnHover && (e.$list.on("mouseenter.slick", i.proxy(e.interrupt, e, !0)), e.$list.on("mouseleave.slick", i.proxy(e.interrupt, e, !1)));
    }, e.prototype.initializeEvents = function () {
      var e = this;
      e.initArrowEvents(), e.initDotEvents(), e.initSlideEvents(), e.$list.on("touchstart.slick mousedown.slick", {
        action: "start"
      }, e.swipeHandler), e.$list.on("touchmove.slick mousemove.slick", {
        action: "move"
      }, e.swipeHandler), e.$list.on("touchend.slick mouseup.slick", {
        action: "end"
      }, e.swipeHandler), e.$list.on("touchcancel.slick mouseleave.slick", {
        action: "end"
      }, e.swipeHandler), e.$list.on("click.slick", e.clickHandler), i(document).on(e.visibilityChange, i.proxy(e.visibility, e)), !0 === e.options.accessibility && e.$list.on("keydown.slick", e.keyHandler), !0 === e.options.focusOnSelect && i(e.$slideTrack).children().on("click.slick", e.selectHandler), i(window).on("orientationchange.slick.slick-" + e.instanceUid, i.proxy(e.orientationChange, e)), i(window).on("resize.slick.slick-" + e.instanceUid, i.proxy(e.resize, e)), i("[draggable!=true]", e.$slideTrack).on("dragstart", e.preventDefault), i(window).on("load.slick.slick-" + e.instanceUid, e.setPosition), i(e.setPosition);
    }, e.prototype.initUI = function () {
      var i = this;
      !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.show(), i.$nextArrow.show()), !0 === i.options.dots && i.slideCount > i.options.slidesToShow && i.$dots.show();
    }, e.prototype.keyHandler = function (i) {
      var e = this;
      i.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === i.keyCode && !0 === e.options.accessibility ? e.changeSlide({
        data: {
          message: !0 === e.options.rtl ? "next" : "previous"
        }
      }) : 39 === i.keyCode && !0 === e.options.accessibility && e.changeSlide({
        data: {
          message: !0 === e.options.rtl ? "previous" : "next"
        }
      }));
    }, e.prototype.lazyLoad = function () {
      function e(e) {
        i("img[data-lazy]", e).each(function () {
          var e = i(this),
              t = i(this).attr("data-lazy"),
              o = i(this).attr("data-srcset"),
              s = i(this).attr("data-sizes") || n.$slider.attr("data-sizes"),
              r = document.createElement("img");
          r.onload = function () {
            e.animate({
              opacity: 0
            }, 100, function () {
              o && (e.attr("srcset", o), s && e.attr("sizes", s)), e.attr("src", t).animate({
                opacity: 1
              }, 200, function () {
                e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading");
              }), n.$slider.trigger("lazyLoaded", [n, e, t]);
            });
          }, r.onerror = function () {
            e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), n.$slider.trigger("lazyLoadError", [n, e, t]);
          }, r.src = t;
        });
      }

      var t,
          o,
          s,
          n = this;
      if (!0 === n.options.centerMode ? !0 === n.options.infinite ? s = (o = n.currentSlide + (n.options.slidesToShow / 2 + 1)) + n.options.slidesToShow + 2 : (o = Math.max(0, n.currentSlide - (n.options.slidesToShow / 2 + 1)), s = n.options.slidesToShow / 2 + 1 + 2 + n.currentSlide) : (o = n.options.infinite ? n.options.slidesToShow + n.currentSlide : n.currentSlide, s = Math.ceil(o + n.options.slidesToShow), !0 === n.options.fade && (o > 0 && o--, s <= n.slideCount && s++)), t = n.$slider.find(".slick-slide").slice(o, s), "anticipated" === n.options.lazyLoad) for (var r = o - 1, l = s, d = n.$slider.find(".slick-slide"), a = 0; a < n.options.slidesToScroll; a++) {
        r < 0 && (r = n.slideCount - 1), t = (t = t.add(d.eq(r))).add(d.eq(l)), r--, l++;
      }
      e(t), n.slideCount <= n.options.slidesToShow ? e(n.$slider.find(".slick-slide")) : n.currentSlide >= n.slideCount - n.options.slidesToShow ? e(n.$slider.find(".slick-cloned").slice(0, n.options.slidesToShow)) : 0 === n.currentSlide && e(n.$slider.find(".slick-cloned").slice(-1 * n.options.slidesToShow));
    }, e.prototype.loadSlider = function () {
      var i = this;
      i.setPosition(), i.$slideTrack.css({
        opacity: 1
      }), i.$slider.removeClass("slick-loading"), i.initUI(), "progressive" === i.options.lazyLoad && i.progressiveLazyLoad();
    }, e.prototype.next = e.prototype.slickNext = function () {
      this.changeSlide({
        data: {
          message: "next"
        }
      });
    }, e.prototype.orientationChange = function () {
      var i = this;
      i.checkResponsive(), i.setPosition();
    }, e.prototype.pause = e.prototype.slickPause = function () {
      var i = this;
      i.autoPlayClear(), i.paused = !0;
    }, e.prototype.play = e.prototype.slickPlay = function () {
      var i = this;
      i.autoPlay(), i.options.autoplay = !0, i.paused = !1, i.focussed = !1, i.interrupted = !1;
    }, e.prototype.postSlide = function (e) {
      var t = this;
      t.unslicked || (t.$slider.trigger("afterChange", [t, e]), t.animating = !1, t.slideCount > t.options.slidesToShow && t.setPosition(), t.swipeLeft = null, t.options.autoplay && t.autoPlay(), !0 === t.options.accessibility && (t.initADA(), t.options.focusOnChange && i(t.$slides.get(t.currentSlide)).attr("tabindex", 0).focus()));
    }, e.prototype.prev = e.prototype.slickPrev = function () {
      this.changeSlide({
        data: {
          message: "previous"
        }
      });
    }, e.prototype.preventDefault = function (i) {
      i.preventDefault();
    }, e.prototype.progressiveLazyLoad = function (e) {
      e = e || 1;
      var t,
          o,
          s,
          n,
          r,
          l = this,
          d = i("img[data-lazy]", l.$slider);
      d.length ? (t = d.first(), o = t.attr("data-lazy"), s = t.attr("data-srcset"), n = t.attr("data-sizes") || l.$slider.attr("data-sizes"), (r = document.createElement("img")).onload = function () {
        s && (t.attr("srcset", s), n && t.attr("sizes", n)), t.attr("src", o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"), !0 === l.options.adaptiveHeight && l.setPosition(), l.$slider.trigger("lazyLoaded", [l, t, o]), l.progressiveLazyLoad();
      }, r.onerror = function () {
        e < 3 ? setTimeout(function () {
          l.progressiveLazyLoad(e + 1);
        }, 500) : (t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), l.$slider.trigger("lazyLoadError", [l, t, o]), l.progressiveLazyLoad());
      }, r.src = o) : l.$slider.trigger("allImagesLoaded", [l]);
    }, e.prototype.refresh = function (e) {
      var t,
          o,
          s = this;
      o = s.slideCount - s.options.slidesToShow, !s.options.infinite && s.currentSlide > o && (s.currentSlide = o), s.slideCount <= s.options.slidesToShow && (s.currentSlide = 0), t = s.currentSlide, s.destroy(!0), i.extend(s, s.initials, {
        currentSlide: t
      }), s.init(), e || s.changeSlide({
        data: {
          message: "index",
          index: t
        }
      }, !1);
    }, e.prototype.registerBreakpoints = function () {
      var e,
          t,
          o,
          s = this,
          n = s.options.responsive || null;

      if ("array" === i.type(n) && n.length) {
        s.respondTo = s.options.respondTo || "window";

        for (e in n) {
          if (o = s.breakpoints.length - 1, n.hasOwnProperty(e)) {
            for (t = n[e].breakpoint; o >= 0;) {
              s.breakpoints[o] && s.breakpoints[o] === t && s.breakpoints.splice(o, 1), o--;
            }

            s.breakpoints.push(t), s.breakpointSettings[t] = n[e].settings;
          }
        }

        s.breakpoints.sort(function (i, e) {
          return s.options.mobileFirst ? i - e : e - i;
        });
      }
    }, e.prototype.reinit = function () {
      var e = this;
      e.$slides = e.$slideTrack.children(e.options.slide).addClass("slick-slide"), e.slideCount = e.$slides.length, e.currentSlide >= e.slideCount && 0 !== e.currentSlide && (e.currentSlide = e.currentSlide - e.options.slidesToScroll), e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0), e.registerBreakpoints(), e.setProps(), e.setupInfinite(), e.buildArrows(), e.updateArrows(), e.initArrowEvents(), e.buildDots(), e.updateDots(), e.initDotEvents(), e.cleanUpSlideEvents(), e.initSlideEvents(), e.checkResponsive(!1, !0), !0 === e.options.focusOnSelect && i(e.$slideTrack).children().on("click.slick", e.selectHandler), e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), e.setPosition(), e.focusHandler(), e.paused = !e.options.autoplay, e.autoPlay(), e.$slider.trigger("reInit", [e]);
    }, e.prototype.resize = function () {
      var e = this;
      i(window).width() !== e.windowWidth && (clearTimeout(e.windowDelay), e.windowDelay = window.setTimeout(function () {
        e.windowWidth = i(window).width(), e.checkResponsive(), e.unslicked || e.setPosition();
      }, 50));
    }, e.prototype.removeSlide = e.prototype.slickRemove = function (i, e, t) {
      var o = this;
      if (i = "boolean" == typeof i ? !0 === (e = i) ? 0 : o.slideCount - 1 : !0 === e ? --i : i, o.slideCount < 1 || i < 0 || i > o.slideCount - 1) return !1;
      o.unload(), !0 === t ? o.$slideTrack.children().remove() : o.$slideTrack.children(this.options.slide).eq(i).remove(), o.$slides = o.$slideTrack.children(this.options.slide), o.$slideTrack.children(this.options.slide).detach(), o.$slideTrack.append(o.$slides), o.$slidesCache = o.$slides, o.reinit();
    }, e.prototype.setCSS = function (i) {
      var e,
          t,
          o = this,
          s = {};
      !0 === o.options.rtl && (i = -i), e = "left" == o.positionProp ? Math.ceil(i) + "px" : "0px", t = "top" == o.positionProp ? Math.ceil(i) + "px" : "0px", s[o.positionProp] = i, !1 === o.transformsEnabled ? o.$slideTrack.css(s) : (s = {}, !1 === o.cssTransitions ? (s[o.animType] = "translate(" + e + ", " + t + ")", o.$slideTrack.css(s)) : (s[o.animType] = "translate3d(" + e + ", " + t + ", 0px)", o.$slideTrack.css(s)));
    }, e.prototype.setDimensions = function () {
      var i = this;
      !1 === i.options.vertical ? !0 === i.options.centerMode && i.$list.css({
        padding: "0px " + i.options.centerPadding
      }) : (i.$list.height(i.$slides.first().outerHeight(!0) * i.options.slidesToShow), !0 === i.options.centerMode && i.$list.css({
        padding: i.options.centerPadding + " 0px"
      })), i.listWidth = i.$list.width(), i.listHeight = i.$list.height(), !1 === i.options.vertical && !1 === i.options.variableWidth ? (i.slideWidth = Math.ceil(i.listWidth / i.options.slidesToShow), i.$slideTrack.width(Math.ceil(i.slideWidth * i.$slideTrack.children(".slick-slide").length))) : !0 === i.options.variableWidth ? i.$slideTrack.width(5e3 * i.slideCount) : (i.slideWidth = Math.ceil(i.listWidth), i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0) * i.$slideTrack.children(".slick-slide").length)));
      var e = i.$slides.first().outerWidth(!0) - i.$slides.first().width();
      !1 === i.options.variableWidth && i.$slideTrack.children(".slick-slide").width(i.slideWidth - e);
    }, e.prototype.setFade = function () {
      var e,
          t = this;
      t.$slides.each(function (o, s) {
        e = t.slideWidth * o * -1, !0 === t.options.rtl ? i(s).css({
          position: "relative",
          right: e,
          top: 0,
          zIndex: t.options.zIndex - 2,
          opacity: 0
        }) : i(s).css({
          position: "relative",
          left: e,
          top: 0,
          zIndex: t.options.zIndex - 2,
          opacity: 0
        });
      }), t.$slides.eq(t.currentSlide).css({
        zIndex: t.options.zIndex - 1,
        opacity: 1
      });
    }, e.prototype.setHeight = function () {
      var i = this;

      if (1 === i.options.slidesToShow && !0 === i.options.adaptiveHeight && !1 === i.options.vertical) {
        var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
        i.$list.css("height", e);
      }
    }, e.prototype.setOption = e.prototype.slickSetOption = function () {
      var e,
          t,
          o,
          s,
          n,
          r = this,
          l = !1;
      if ("object" === i.type(arguments[0]) ? (o = arguments[0], l = arguments[1], n = "multiple") : "string" === i.type(arguments[0]) && (o = arguments[0], s = arguments[1], l = arguments[2], "responsive" === arguments[0] && "array" === i.type(arguments[1]) ? n = "responsive" : void 0 !== arguments[1] && (n = "single")), "single" === n) r.options[o] = s;else if ("multiple" === n) i.each(o, function (i, e) {
        r.options[i] = e;
      });else if ("responsive" === n) for (t in s) {
        if ("array" !== i.type(r.options.responsive)) r.options.responsive = [s[t]];else {
          for (e = r.options.responsive.length - 1; e >= 0;) {
            r.options.responsive[e].breakpoint === s[t].breakpoint && r.options.responsive.splice(e, 1), e--;
          }

          r.options.responsive.push(s[t]);
        }
      }
      l && (r.unload(), r.reinit());
    }, e.prototype.setPosition = function () {
      var i = this;
      i.setDimensions(), i.setHeight(), !1 === i.options.fade ? i.setCSS(i.getLeft(i.currentSlide)) : i.setFade(), i.$slider.trigger("setPosition", [i]);
    }, e.prototype.setProps = function () {
      var i = this,
          e = document.body.style;
      i.positionProp = !0 === i.options.vertical ? "top" : "left", "top" === i.positionProp ? i.$slider.addClass("slick-vertical") : i.$slider.removeClass("slick-vertical"), void 0 === e.WebkitTransition && void 0 === e.MozTransition && void 0 === e.msTransition || !0 === i.options.useCSS && (i.cssTransitions = !0), i.options.fade && ("number" == typeof i.options.zIndex ? i.options.zIndex < 3 && (i.options.zIndex = 3) : i.options.zIndex = i.defaults.zIndex), void 0 !== e.OTransform && (i.animType = "OTransform", i.transformType = "-o-transform", i.transitionType = "OTransition", void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (i.animType = !1)), void 0 !== e.MozTransform && (i.animType = "MozTransform", i.transformType = "-moz-transform", i.transitionType = "MozTransition", void 0 === e.perspectiveProperty && void 0 === e.MozPerspective && (i.animType = !1)), void 0 !== e.webkitTransform && (i.animType = "webkitTransform", i.transformType = "-webkit-transform", i.transitionType = "webkitTransition", void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (i.animType = !1)), void 0 !== e.msTransform && (i.animType = "msTransform", i.transformType = "-ms-transform", i.transitionType = "msTransition", void 0 === e.msTransform && (i.animType = !1)), void 0 !== e.transform && !1 !== i.animType && (i.animType = "transform", i.transformType = "transform", i.transitionType = "transition"), i.transformsEnabled = i.options.useTransform && null !== i.animType && !1 !== i.animType;
    }, e.prototype.setSlideClasses = function (i) {
      var e,
          t,
          o,
          s,
          n = this;

      if (t = n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"), n.$slides.eq(i).addClass("slick-current"), !0 === n.options.centerMode) {
        var r = n.options.slidesToShow % 2 == 0 ? 1 : 0;
        e = Math.floor(n.options.slidesToShow / 2), !0 === n.options.infinite && (i >= e && i <= n.slideCount - 1 - e ? n.$slides.slice(i - e + r, i + e + 1).addClass("slick-active").attr("aria-hidden", "false") : (o = n.options.slidesToShow + i, t.slice(o - e + 1 + r, o + e + 2).addClass("slick-active").attr("aria-hidden", "false")), 0 === i ? t.eq(t.length - 1 - n.options.slidesToShow).addClass("slick-center") : i === n.slideCount - 1 && t.eq(n.options.slidesToShow).addClass("slick-center")), n.$slides.eq(i).addClass("slick-center");
      } else i >= 0 && i <= n.slideCount - n.options.slidesToShow ? n.$slides.slice(i, i + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : t.length <= n.options.slidesToShow ? t.addClass("slick-active").attr("aria-hidden", "false") : (s = n.slideCount % n.options.slidesToShow, o = !0 === n.options.infinite ? n.options.slidesToShow + i : i, n.options.slidesToShow == n.options.slidesToScroll && n.slideCount - i < n.options.slidesToShow ? t.slice(o - (n.options.slidesToShow - s), o + s).addClass("slick-active").attr("aria-hidden", "false") : t.slice(o, o + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false"));

      "ondemand" !== n.options.lazyLoad && "anticipated" !== n.options.lazyLoad || n.lazyLoad();
    }, e.prototype.setupInfinite = function () {
      var e,
          t,
          o,
          s = this;

      if (!0 === s.options.fade && (s.options.centerMode = !1), !0 === s.options.infinite && !1 === s.options.fade && (t = null, s.slideCount > s.options.slidesToShow)) {
        for (o = !0 === s.options.centerMode ? s.options.slidesToShow + 1 : s.options.slidesToShow, e = s.slideCount; e > s.slideCount - o; e -= 1) {
          t = e - 1, i(s.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t - s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");
        }

        for (e = 0; e < o + s.slideCount; e += 1) {
          t = e, i(s.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t + s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");
        }

        s.$slideTrack.find(".slick-cloned").find("[id]").each(function () {
          i(this).attr("id", "");
        });
      }
    }, e.prototype.interrupt = function (i) {
      var e = this;
      i || e.autoPlay(), e.interrupted = i;
    }, e.prototype.selectHandler = function (e) {
      var t = this,
          o = i(e.target).is(".slick-slide") ? i(e.target) : i(e.target).parents(".slick-slide"),
          s = parseInt(o.attr("data-slick-index"));
      s || (s = 0), t.slideCount <= t.options.slidesToShow ? t.slideHandler(s, !1, !0) : t.slideHandler(s);
    }, e.prototype.slideHandler = function (i, e, t) {
      var o,
          s,
          n,
          r,
          l,
          d = null,
          a = this;
      if (e = e || !1, !(!0 === a.animating && !0 === a.options.waitForAnimate || !0 === a.options.fade && a.currentSlide === i)) if (!1 === e && a.asNavFor(i), o = i, d = a.getLeft(o), r = a.getLeft(a.currentSlide), a.currentLeft = null === a.swipeLeft ? r : a.swipeLeft, !1 === a.options.infinite && !1 === a.options.centerMode && (i < 0 || i > a.getDotCount() * a.options.slidesToScroll)) !1 === a.options.fade && (o = a.currentSlide, !0 !== t ? a.animateSlide(r, function () {
        a.postSlide(o);
      }) : a.postSlide(o));else if (!1 === a.options.infinite && !0 === a.options.centerMode && (i < 0 || i > a.slideCount - a.options.slidesToScroll)) !1 === a.options.fade && (o = a.currentSlide, !0 !== t ? a.animateSlide(r, function () {
        a.postSlide(o);
      }) : a.postSlide(o));else {
        if (a.options.autoplay && clearInterval(a.autoPlayTimer), s = o < 0 ? a.slideCount % a.options.slidesToScroll != 0 ? a.slideCount - a.slideCount % a.options.slidesToScroll : a.slideCount + o : o >= a.slideCount ? a.slideCount % a.options.slidesToScroll != 0 ? 0 : o - a.slideCount : o, a.animating = !0, a.$slider.trigger("beforeChange", [a, a.currentSlide, s]), n = a.currentSlide, a.currentSlide = s, a.setSlideClasses(a.currentSlide), a.options.asNavFor && (l = (l = a.getNavTarget()).slick("getSlick")).slideCount <= l.options.slidesToShow && l.setSlideClasses(a.currentSlide), a.updateDots(), a.updateArrows(), !0 === a.options.fade) return !0 !== t ? (a.fadeSlideOut(n), a.fadeSlide(s, function () {
          a.postSlide(s);
        })) : a.postSlide(s), void a.animateHeight();
        !0 !== t ? a.animateSlide(d, function () {
          a.postSlide(s);
        }) : a.postSlide(s);
      }
    }, e.prototype.startLoad = function () {
      var i = this;
      !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.hide(), i.$nextArrow.hide()), !0 === i.options.dots && i.slideCount > i.options.slidesToShow && i.$dots.hide(), i.$slider.addClass("slick-loading");
    }, e.prototype.swipeDirection = function () {
      var i,
          e,
          t,
          o,
          s = this;
      return i = s.touchObject.startX - s.touchObject.curX, e = s.touchObject.startY - s.touchObject.curY, t = Math.atan2(e, i), (o = Math.round(180 * t / Math.PI)) < 0 && (o = 360 - Math.abs(o)), o <= 45 && o >= 0 ? !1 === s.options.rtl ? "left" : "right" : o <= 360 && o >= 315 ? !1 === s.options.rtl ? "left" : "right" : o >= 135 && o <= 225 ? !1 === s.options.rtl ? "right" : "left" : !0 === s.options.verticalSwiping ? o >= 35 && o <= 135 ? "down" : "up" : "vertical";
    }, e.prototype.swipeEnd = function (i) {
      var e,
          t,
          o = this;
      if (o.dragging = !1, o.swiping = !1, o.scrolling) return o.scrolling = !1, !1;
      if (o.interrupted = !1, o.shouldClick = !(o.touchObject.swipeLength > 10), void 0 === o.touchObject.curX) return !1;

      if (!0 === o.touchObject.edgeHit && o.$slider.trigger("edge", [o, o.swipeDirection()]), o.touchObject.swipeLength >= o.touchObject.minSwipe) {
        switch (t = o.swipeDirection()) {
          case "left":
          case "down":
            e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide + o.getSlideCount()) : o.currentSlide + o.getSlideCount(), o.currentDirection = 0;
            break;

          case "right":
          case "up":
            e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide - o.getSlideCount()) : o.currentSlide - o.getSlideCount(), o.currentDirection = 1;
        }

        "vertical" != t && (o.slideHandler(e), o.touchObject = {}, o.$slider.trigger("swipe", [o, t]));
      } else o.touchObject.startX !== o.touchObject.curX && (o.slideHandler(o.currentSlide), o.touchObject = {});
    }, e.prototype.swipeHandler = function (i) {
      var e = this;
      if (!(!1 === e.options.swipe || "ontouchend" in document && !1 === e.options.swipe || !1 === e.options.draggable && -1 !== i.type.indexOf("mouse"))) switch (e.touchObject.fingerCount = i.originalEvent && void 0 !== i.originalEvent.touches ? i.originalEvent.touches.length : 1, e.touchObject.minSwipe = e.listWidth / e.options.touchThreshold, !0 === e.options.verticalSwiping && (e.touchObject.minSwipe = e.listHeight / e.options.touchThreshold), i.data.action) {
        case "start":
          e.swipeStart(i);
          break;

        case "move":
          e.swipeMove(i);
          break;

        case "end":
          e.swipeEnd(i);
      }
    }, e.prototype.swipeMove = function (i) {
      var e,
          t,
          o,
          s,
          n,
          r,
          l = this;
      return n = void 0 !== i.originalEvent ? i.originalEvent.touches : null, !(!l.dragging || l.scrolling || n && 1 !== n.length) && (e = l.getLeft(l.currentSlide), l.touchObject.curX = void 0 !== n ? n[0].pageX : i.clientX, l.touchObject.curY = void 0 !== n ? n[0].pageY : i.clientY, l.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(l.touchObject.curX - l.touchObject.startX, 2))), r = Math.round(Math.sqrt(Math.pow(l.touchObject.curY - l.touchObject.startY, 2))), !l.options.verticalSwiping && !l.swiping && r > 4 ? (l.scrolling = !0, !1) : (!0 === l.options.verticalSwiping && (l.touchObject.swipeLength = r), t = l.swipeDirection(), void 0 !== i.originalEvent && l.touchObject.swipeLength > 4 && (l.swiping = !0, i.preventDefault()), s = (!1 === l.options.rtl ? 1 : -1) * (l.touchObject.curX > l.touchObject.startX ? 1 : -1), !0 === l.options.verticalSwiping && (s = l.touchObject.curY > l.touchObject.startY ? 1 : -1), o = l.touchObject.swipeLength, l.touchObject.edgeHit = !1, !1 === l.options.infinite && (0 === l.currentSlide && "right" === t || l.currentSlide >= l.getDotCount() && "left" === t) && (o = l.touchObject.swipeLength * l.options.edgeFriction, l.touchObject.edgeHit = !0), !1 === l.options.vertical ? l.swipeLeft = e + o * s : l.swipeLeft = e + o * (l.$list.height() / l.listWidth) * s, !0 === l.options.verticalSwiping && (l.swipeLeft = e + o * s), !0 !== l.options.fade && !1 !== l.options.touchMove && (!0 === l.animating ? (l.swipeLeft = null, !1) : void l.setCSS(l.swipeLeft))));
    }, e.prototype.swipeStart = function (i) {
      var e,
          t = this;
      if (t.interrupted = !0, 1 !== t.touchObject.fingerCount || t.slideCount <= t.options.slidesToShow) return t.touchObject = {}, !1;
      void 0 !== i.originalEvent && void 0 !== i.originalEvent.touches && (e = i.originalEvent.touches[0]), t.touchObject.startX = t.touchObject.curX = void 0 !== e ? e.pageX : i.clientX, t.touchObject.startY = t.touchObject.curY = void 0 !== e ? e.pageY : i.clientY, t.dragging = !0;
    }, e.prototype.unfilterSlides = e.prototype.slickUnfilter = function () {
      var i = this;
      null !== i.$slidesCache && (i.unload(), i.$slideTrack.children(this.options.slide).detach(), i.$slidesCache.appendTo(i.$slideTrack), i.reinit());
    }, e.prototype.unload = function () {
      var e = this;
      i(".slick-cloned", e.$slider).remove(), e.$dots && e.$dots.remove(), e.$prevArrow && e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.remove(), e.$nextArrow && e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.remove(), e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "");
    }, e.prototype.unslick = function (i) {
      var e = this;
      e.$slider.trigger("unslick", [e, i]), e.destroy();
    }, e.prototype.updateArrows = function () {
      var i = this;
      Math.floor(i.options.slidesToShow / 2), !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && !i.options.infinite && (i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 0 === i.currentSlide ? (i.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : i.currentSlide >= i.slideCount - i.options.slidesToShow && !1 === i.options.centerMode ? (i.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : i.currentSlide >= i.slideCount - 1 && !0 === i.options.centerMode && (i.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")));
    }, e.prototype.updateDots = function () {
      var i = this;
      null !== i.$dots && (i.$dots.find("li").removeClass("slick-active").end(), i.$dots.find("li").eq(Math.floor(i.currentSlide / i.options.slidesToScroll)).addClass("slick-active"));
    }, e.prototype.visibility = function () {
      var i = this;
      i.options.autoplay && (document[i.hidden] ? i.interrupted = !0 : i.interrupted = !1);
    }, i.fn.slick = function () {
      var i,
          t,
          o = this,
          s = arguments[0],
          n = Array.prototype.slice.call(arguments, 1),
          r = o.length;

      for (i = 0; i < r; i++) {
        if ("object" == _typeof(s) || void 0 === s ? o[i].slick = new e(o[i], s) : t = o[i].slick[s].apply(o[i].slick, n), void 0 !== t) return t;
      }

      return o;
    };
  });
  $(document).ready(function () {
    $('.banners-slider').slick({
      infinite: false,
      dots: false,
      prevArrow: '<button class="prev arrow"></button>',
      nextArrow: '<button class="next arrow"></button>',
      responsive: [{
        breakpoint: 1024,
        settings: {
          dots: false,
          // prevArrow: false,
          // nextArrow: false,
          arrows: false,
          infinite: true,
          autoplay: false,
          autoplaySpeed: 3000
        }
      }, // {
      //     breakpoint: 600,
      //     settings: {
      //     slidesToShow: 2,
      //     slidesToScroll: 2
      //     }
      // },
      {
        breakpoint: 320,
        settings: {
          dots: false,
          prevArrow: false,
          nextArrow: false,
          arrows: false
        }
      } // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
      ]
    });
  });
  $(document).ready(function () {
    $('.product-slider').slick({
      dots: false,
      // кастомные точки(цифры) customPaging: (slider, i) => `<a>${i + 1}</a>`
      // колонки rows:
      infinite: false,
      speed: 400,
      slidesToShow: 4,
      slidesToScroll: 4,
      prevArrow: '<button class="prev arrow"></button>',
      nextArrow: '<button class="next arrow"></button>',
      responsive: [{
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          dots: false,
          arrows: true
        }
      }, {
        breakpoint: 992,
        settings: {
          // slidesToShow: 3,
          // slidesToScroll: 1,
          infinite: false,
          speed: 300,
          slidesToShow: 1,
          slidesToScroll: 1,
          // centerMode: true,
          variableWidth: true,
          arrows: false
        }
      } // {
      //     breakpoint: 480,
      //     settings: {
      //     slidesToShow: 1,
      //     slidesToScroll: 1,
      //     arrows: false  
      //     }
      // },
      // {
      //     breakpoint: 320,
      //     settings: {
      //       dots: false,
      //       prevArrow: false,
      //       nextArrow: false,
      //       arrows: false        
      //     }
      // }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
      ]
    });
    $('.SOMEcategory-slider').slick({
      rows: 2,
      dots: true,
      customPaging: function customPaging(slider, i) {
        return "<a>".concat(i + 1, "</a>");
      },
      infinite: false,
      arrows: false,
      speed: 600,
      slidesToShow: 3,
      slidesToScroll: 3
    });
  }); // $(function(){
  //     $('.product-list-expend').click(function(){
  //         $('.product-list').toggleClass('product-slider');
  //     });
  // });

  $(function () {
    $("#filter__range").slider({
      min: 0,
      max: 50000,
      values: [25000, 35000],
      range: true,
      stop: function stop(event, ui) {
        $("input#priceMin").val($("#filter__range").slider("values", 0));
        $("input#priceMax").val($("#filter__range").slider("values", 1));
      },
      slide: function slide(event, ui) {
        $("input#priceMin").val($("#filter__range").slider("values", 0));
        $("input#priceMax").val($("#filter__range").slider("values", 1));
      }
    });
    $("input#priceMin").on('change', function () {
      var value1 = $("input#priceMin").val();
      var value2 = $("input#priceMax").val();

      if (parseInt(value1) > parseInt(value2)) {
        value1 = value2;
        $("input#priceMin").val(value1);
      }

      $("#filter__range").slider("values", 0, value1);
    });
    $("input#priceMax").on('change', function () {
      var value1 = $("input#priceMin").val();
      var value2 = $("input#priceMax").val();

      if (value2 > 50000) {
        value2 = 50000;
        $("input#priceMax").val(50000);
      }

      if (parseInt(value1) > parseInt(value2)) {
        value2 = value1;
        $("input#priceMax").val(value2);
      }

      $("#filter__range").slider("values", 1, value2);
    });
  });
  $('.prod-description-picture__img-max').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    infinite: false,
    fade: true,
    asNavFor: '.prod-description-picture__img-min'
  });
  $('.prod-description-picture__img-min').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: false,
    asNavFor: '.prod-description-picture__img-max',
    // arrows: true,
    prevArrow: '<button class="prev_up arrow arrow_product"></button>',
    nextArrow: '<button class="next_down arrow arrow_product"></button>',
    dots: false,
    vertical: true,
    verticalSwiping: true,
    // centerMode: true,
    focusOnSelect: true
  }); // jQuery(document).ready(function(){
  //     function classFunction(){
  //       if(jQuery('body').width()<700){ jQuery('.footer-header').removeClass('footer-header').addClass('tab-header');
  //       jQuery('.footer-content').removeClass('footer-content').addClass('tab-content');
  //       }
  //       else{
  //         jQuery('.tab-header').removeClass('tab-header').addClass('footer-header');
  //         jQuery('.tab-content').removeClass('tab-content').addClass('footer-content');
  //       }
  //     }
  //     classFunction();
  //     jQuery(window).resize(classFunction);
  // })
  // Лайк

  $('.btn-like').on('click', function (e) {
    e.preventDefault;
    $('.fa-heart').toggleClass('fas');
  }); // Категории

  $('.header__catalog-btn').on('click', function (e) {
    e.preventDefault;
    $(this).toggleClass('header__catalog-btn_active');
  }); // Аккордеонб сайдбар-фильтр

  $(document).ready(function () {
    $('.tab-header').click(function () {
      $(this).toggleClass('collapse-btn__active').next().slideToggle(); // $('.tab-header').not(this).removeClass('collapse-btn__active').next().slideUp();
    });
  });
  $(document).ready(function () {
    // $('.filter__more').click(function () {
    //     $('.custom-checkbox').toggleClass('custom-checkbox__active');
    //     // $('.tab-header').not(this).removeClass('collapse-btn__active').next().slideUp();
    // });
    $('.btn__more').click(function () {
      $(this).prev().toggleClass('filter__active'); // $('.tab-header').not(this).removeClass('collapse-btn__active').next().slideUp();
    });
  }); // button quantity

  $('.add').click(function () {
    if ($(this).prev().val() < 10) {
      $(this).prev().val(+$(this).prev().val() + 1);
    }
  });
  $('.sub').click(function () {
    if ($(this).next().val() > 1) {
      if ($(this).next().val() > 1) $(this).next().val(+$(this).next().val() - 1);
    }
  }); // Сменяющаяся

  $('.btn_change').click(function () {
    $(this).text(function (i, text) {
      return text === "Показать еще" ? "Скрыть" : "Показать еще";
    });
  });
  $('.btn_basket').click(function () {
    $(this).text(function (i, text) {
      return text === "В корзину" ? "Удалить из корзины" : "В корзину";
    });
  }); // var rating = document.querySelector('.star'),
  //     ratingItem = document.querySelectorAll('.star-item');
  // rating.onclick = function(e){
  //   var target = e.target;
  //   if(target.classList.contains('star-item')){
  //     removeClass(ratingItem,'active')
  //     target.classList.add('active');
  //   }
  // };
  // function removeClass(elements, className) {
  //   for (var i = 0; i < elements.length; i++) {
  //      elements[i].classList.remove(className);
  //   }
  // };
  // const circle = document.querySelector('.rating-ring__circle');
  // const radius = circle.r.baseVal.value;
  // const circumference = 2 * Math.PI * radius;
  // circle.style.strokeDashoffset = circumference;
  // circle.style.strokeDasharray = circumference;
  // function setProgress(percent) {
  //     const offset = circumference - percent / 100 * circumference;
  //     circle.style.strokeDashoffset = offset;
  // }
  // setProgress(64);

  /**
   * Фиксированный хедер
   */
  // $(window).on('scroll', toggleFixedHeader);
  // function toggleFixedHeader() {
  //     const $header = $('.header');
  //     const $main = $('.header').next();
  //     if (window.pageYOffset > 0) {
  //         $header.addClass('is-fixed');
  //         $main.css({ marginTop: $header.outerHeight() });
  //     } else {
  //         $header.removeClass('is-fixed');
  //         $main.css({ marginTop: 0 });
  //     }
  // }

  ;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVybmFsLmpzIl0sIm5hbWVzIjpbIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiZ2xvYmFsT3B0aW9ucyIsInRpbWUiLCJkZXNrdG9wWGxTaXplIiwiZGVza3RvcExnU2l6ZSIsImRlc2t0b3BTaXplIiwidGFibGV0TGdTaXplIiwidGFibGV0U2l6ZSIsIm1vYmlsZUxnU2l6ZSIsIm1vYmlsZVNpemUiLCJwb3B1cHNCcmVha3BvaW50IiwicG9wdXBzRml4ZWRUaW1lb3V0IiwiaXNUb3VjaCIsImJyb3dzZXIiLCJtb2JpbGUiLCJsYW5nIiwiYXR0ciIsImJyZWFrcG9pbnRzIiwiYnJlYWtwb2ludERlc2t0b3BYbCIsIndpbmRvdyIsIm1hdGNoTWVkaWEiLCJicmVha3BvaW50RGVza3RvcExnIiwiYnJlYWtwb2ludERlc2t0b3AiLCJicmVha3BvaW50VGFibGV0TGciLCJicmVha3BvaW50VGFibGV0IiwiYnJlYWtwb2ludE1vYmlsZUxnU2l6ZSIsImJyZWFrcG9pbnRNb2JpbGUiLCJleHRlbmQiLCJsb2FkIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImZuIiwiYW5pbWF0ZUNzcyIsImFuaW1hdGlvbk5hbWUiLCJjYWxsYmFjayIsImFuaW1hdGlvbkVuZCIsImVsIiwiYW5pbWF0aW9ucyIsImFuaW1hdGlvbiIsIk9BbmltYXRpb24iLCJNb3pBbmltYXRpb24iLCJXZWJraXRBbmltYXRpb24iLCJ0Iiwic3R5bGUiLCJ1bmRlZmluZWQiLCJjcmVhdGVFbGVtZW50Iiwib25lIiwiQ3VzdG9tU2VsZWN0IiwiJGVsZW0iLCJzZWxmIiwiaW5pdCIsIiRpbml0RWxlbSIsImVhY2giLCJoYXNDbGFzcyIsInNlbGVjdFNlYXJjaCIsImRhdGEiLCJtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCIsIkluZmluaXR5Iiwic2VsZWN0MiIsInNlbGVjdE9uQmx1ciIsImRyb3Bkb3duQ3NzQ2xhc3MiLCJvbiIsImUiLCJmaW5kIiwiY29udGV4dCIsInZhbHVlIiwiY2xpY2siLCJ1cGRhdGUiLCIkdXBkYXRlRWxlbSIsImN1c3RvbUZpbGVJbnB1dCIsImkiLCJlbGVtIiwiYnV0dG9uV29yZCIsImNsYXNzTmFtZSIsIndyYXAiLCJwYXJlbnQiLCJwcmVwZW5kIiwiaHRtbCIsInByb21pc2UiLCJkb25lIiwibW91c2Vtb3ZlIiwiY3Vyc29yIiwiaW5wdXQiLCJ3cmFwcGVyIiwid3JhcHBlclgiLCJ3cmFwcGVyWSIsImlucHV0V2lkdGgiLCJpbnB1dEhlaWdodCIsImN1cnNvclgiLCJjdXJzb3JZIiwib2Zmc2V0IiwibGVmdCIsInRvcCIsIndpZHRoIiwiaGVpZ2h0IiwicGFnZVgiLCJwYWdlWSIsIm1vdmVJbnB1dFgiLCJtb3ZlSW5wdXRZIiwiY3NzIiwiZmlsZU5hbWUiLCJ2YWwiLCJuZXh0IiwicmVtb3ZlIiwicHJvcCIsImxlbmd0aCIsImZpbGVzIiwic3Vic3RyaW5nIiwibGFzdEluZGV4T2YiLCJzZWxlY3RlZEZpbGVOYW1lUGxhY2VtZW50Iiwic2libGluZ3MiLCJhZnRlciIsImN1c3RvbVNlbGVjdCIsImluZGV4IiwiZmllbGQiLCJ0cmltIiwiZXZlbnQiLCJsb2NhbGUiLCJQYXJzbGV5Iiwic2V0TG9jYWxlIiwib3B0aW9ucyIsInRyaWdnZXIiLCJ2YWxpZGF0aW9uVGhyZXNob2xkIiwiZXJyb3JzV3JhcHBlciIsImVycm9yVGVtcGxhdGUiLCJjbGFzc0hhbmRsZXIiLCJpbnN0YW5jZSIsIiRlbGVtZW50IiwidHlwZSIsIiRoYW5kbGVyIiwiZXJyb3JzQ29udGFpbmVyIiwiJGNvbnRhaW5lciIsImNsb3Nlc3QiLCJhZGRWYWxpZGF0b3IiLCJ2YWxpZGF0ZVN0cmluZyIsInRlc3QiLCJtZXNzYWdlcyIsInJ1IiwiZW4iLCJyZWdUZXN0IiwicmVnTWF0Y2giLCJtaW4iLCJhcmd1bWVudHMiLCJtYXgiLCJtaW5EYXRlIiwibWF4RGF0ZSIsInZhbHVlRGF0ZSIsInJlc3VsdCIsIm1hdGNoIiwiRGF0ZSIsIm1heFNpemUiLCJwYXJzbGV5SW5zdGFuY2UiLCJzaXplIiwicmVxdWlyZW1lbnRUeXBlIiwiZm9ybWF0cyIsImZpbGVFeHRlbnNpb24iLCJzcGxpdCIsInBvcCIsImZvcm1hdHNBcnIiLCJ2YWxpZCIsIiRibG9jayIsIiRsYXN0IiwiZWxlbWVudCIsInBhcnNsZXkiLCJpbnB1dG1hc2siLCJjbGVhck1hc2tPbkxvc3RGb2N1cyIsInNob3dNYXNrT25Ib3ZlciIsImRhdGVwaWNrZXIiLCJ1cGRhdGVTdmciLCIkdXNlRWxlbWVudCIsImhyZWYiLCJiYXNlVmFsIiwiZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zIiwiZGF0ZUZvcm1hdCIsInNob3dPdGhlck1vbnRocyIsIkRhdGVwaWNrZXIiLCJpdGVtT3B0aW9ucyIsIm9uU2VsZWN0IiwiY2hhbmdlIiwiRGF0ZXBpY2tlclJhbmdlIiwiZGF0ZXBpY2tlclJhbmdlIiwiZnJvbUl0ZW1PcHRpb25zIiwidG9JdGVtT3B0aW9ucyIsImRhdGVGcm9tIiwiZGF0ZVRvIiwiZ2V0RGF0ZSIsImlzVmFsaWQiLCJ2YWxpZGF0ZSIsImRhdGUiLCJwYXJzZURhdGUiLCJlcnJvciIsIlRhYlN3aXRjaGVyIiwidGFicyIsIm9wZW4iLCJ0YWJFbGVtIiwicHJldmVudERlZmF1bHQiLCJwYXJlbnRUYWJzIiwidG9nZ2xlQ2xhc3MiLCJ0YWJTd2l0Y2hlciIsIm9uT3V0c2lkZUNsaWNrSGlkZSIsInRhcmdldEVsZW0iLCJoaWRkZW5FbGVtIiwib3B0aW9uYWxDYiIsImJpbmQiLCJpcyIsInRhcmdldCIsInN0b3AiLCJmYWRlT3V0IiwidmlzaWJpbGl0eUNvbnRyb2wiLCJzZXR0aW5ncyIsInR5cGVzIiwic2V0VmlzaWJpbGl0eSIsInZpc2liaWxpdHlUeXBlIiwibGlzdCIsImRlbGF5IiwiZmFkZUluIiwiZGF0YVR5cGUiLCJ2aXNpYmlsaXR5TGlzdCIsIlNsaWRlciIsInNsaWRlciIsInN0ZXAiLCJ2YWx1ZXMiLCJyYW5nZSIsInNsaWRlIiwidWkiLCJjaGlsZHJlbiIsImFwcGVuZCIsIm9ubG9hZCIsIlBlcnNvbnMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsIm5vZGUiLCJhZGRFdmVudExpc3RlbmVyIiwiY3VycmVudCIsIm5leHRFbGVtZW50U2libGluZyIsInByZXZpb3VzRWxlbWVudFNpYmxpbmciLCJub3QiLCJoaWRlIiwiZXEiLCJtb2RhbENhbGwiLCJtb2RhbENsb3NlIiwiJHRoaXMiLCJtb2RhbElkIiwic2V0VGltZW91dCIsInRyYW5zZm9ybSIsIm1vZGFsUGFyZW50IiwicGFyZW50cyIsInN0b3BQcm9wYWdhdGlvbiIsImRvYyIsInNjIiwiZG4iLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwic2hvdyIsImRlZmluZSIsImFtZCIsImV4cG9ydHMiLCJtb2R1bGUiLCJyZXF1aXJlIiwialF1ZXJ5IiwiU2xpY2siLCJvIiwicyIsIm4iLCJkZWZhdWx0cyIsImFjY2Vzc2liaWxpdHkiLCJhZGFwdGl2ZUhlaWdodCIsImFwcGVuZEFycm93cyIsImFwcGVuZERvdHMiLCJhcnJvd3MiLCJhc05hdkZvciIsInByZXZBcnJvdyIsIm5leHRBcnJvdyIsImF1dG9wbGF5IiwiYXV0b3BsYXlTcGVlZCIsImNlbnRlck1vZGUiLCJjZW50ZXJQYWRkaW5nIiwiY3NzRWFzZSIsImN1c3RvbVBhZ2luZyIsInRleHQiLCJkb3RzIiwiZG90c0NsYXNzIiwiZHJhZ2dhYmxlIiwiZWFzaW5nIiwiZWRnZUZyaWN0aW9uIiwiZmFkZSIsImZvY3VzT25TZWxlY3QiLCJmb2N1c09uQ2hhbmdlIiwiaW5maW5pdGUiLCJpbml0aWFsU2xpZGUiLCJsYXp5TG9hZCIsIm1vYmlsZUZpcnN0IiwicGF1c2VPbkhvdmVyIiwicGF1c2VPbkZvY3VzIiwicGF1c2VPbkRvdHNIb3ZlciIsInJlc3BvbmRUbyIsInJlc3BvbnNpdmUiLCJyb3dzIiwicnRsIiwic2xpZGVzUGVyUm93Iiwic2xpZGVzVG9TaG93Iiwic2xpZGVzVG9TY3JvbGwiLCJzcGVlZCIsInN3aXBlIiwic3dpcGVUb1NsaWRlIiwidG91Y2hNb3ZlIiwidG91Y2hUaHJlc2hvbGQiLCJ1c2VDU1MiLCJ1c2VUcmFuc2Zvcm0iLCJ2YXJpYWJsZVdpZHRoIiwidmVydGljYWwiLCJ2ZXJ0aWNhbFN3aXBpbmciLCJ3YWl0Rm9yQW5pbWF0ZSIsInpJbmRleCIsImluaXRpYWxzIiwiYW5pbWF0aW5nIiwiZHJhZ2dpbmciLCJhdXRvUGxheVRpbWVyIiwiY3VycmVudERpcmVjdGlvbiIsImN1cnJlbnRMZWZ0IiwiY3VycmVudFNsaWRlIiwiZGlyZWN0aW9uIiwiJGRvdHMiLCJsaXN0V2lkdGgiLCJsaXN0SGVpZ2h0IiwibG9hZEluZGV4IiwiJG5leHRBcnJvdyIsIiRwcmV2QXJyb3ciLCJzY3JvbGxpbmciLCJzbGlkZUNvdW50Iiwic2xpZGVXaWR0aCIsIiRzbGlkZVRyYWNrIiwiJHNsaWRlcyIsInNsaWRpbmciLCJzbGlkZU9mZnNldCIsInN3aXBlTGVmdCIsInN3aXBpbmciLCIkbGlzdCIsInRvdWNoT2JqZWN0IiwidHJhbnNmb3Jtc0VuYWJsZWQiLCJ1bnNsaWNrZWQiLCJhY3RpdmVCcmVha3BvaW50IiwiYW5pbVR5cGUiLCJhbmltUHJvcCIsImJyZWFrcG9pbnRTZXR0aW5ncyIsImNzc1RyYW5zaXRpb25zIiwiZm9jdXNzZWQiLCJpbnRlcnJ1cHRlZCIsImhpZGRlbiIsInBhdXNlZCIsInBvc2l0aW9uUHJvcCIsInJvd0NvdW50Iiwic2hvdWxkQ2xpY2siLCIkc2xpZGVyIiwiJHNsaWRlc0NhY2hlIiwidHJhbnNmb3JtVHlwZSIsInRyYW5zaXRpb25UeXBlIiwidmlzaWJpbGl0eUNoYW5nZSIsIndpbmRvd1dpZHRoIiwid2luZG93VGltZXIiLCJvcmlnaW5hbFNldHRpbmdzIiwibW96SGlkZGVuIiwid2Via2l0SGlkZGVuIiwiYXV0b1BsYXkiLCJwcm94eSIsImF1dG9QbGF5Q2xlYXIiLCJhdXRvUGxheUl0ZXJhdG9yIiwiY2hhbmdlU2xpZGUiLCJjbGlja0hhbmRsZXIiLCJzZWxlY3RIYW5kbGVyIiwic2V0UG9zaXRpb24iLCJzd2lwZUhhbmRsZXIiLCJkcmFnSGFuZGxlciIsImtleUhhbmRsZXIiLCJpbnN0YW5jZVVpZCIsImh0bWxFeHByIiwicmVnaXN0ZXJCcmVha3BvaW50cyIsInByb3RvdHlwZSIsImFjdGl2YXRlQURBIiwidGFiaW5kZXgiLCJhZGRTbGlkZSIsInNsaWNrQWRkIiwidW5sb2FkIiwiYXBwZW5kVG8iLCJpbnNlcnRCZWZvcmUiLCJpbnNlcnRBZnRlciIsInByZXBlbmRUbyIsImRldGFjaCIsInJlaW5pdCIsImFuaW1hdGVIZWlnaHQiLCJvdXRlckhlaWdodCIsImFuaW1hdGVTbGlkZSIsImFuaW1TdGFydCIsImR1cmF0aW9uIiwiTWF0aCIsImNlaWwiLCJjb21wbGV0ZSIsImNhbGwiLCJhcHBseVRyYW5zaXRpb24iLCJkaXNhYmxlVHJhbnNpdGlvbiIsImdldE5hdlRhcmdldCIsInNsaWNrIiwic2xpZGVIYW5kbGVyIiwic2V0SW50ZXJ2YWwiLCJjbGVhckludGVydmFsIiwiYnVpbGRBcnJvd3MiLCJyZW1vdmVBdHRyIiwiYWRkIiwiYnVpbGREb3RzIiwiZ2V0RG90Q291bnQiLCJmaXJzdCIsImJ1aWxkT3V0Iiwid3JhcEFsbCIsInNldHVwSW5maW5pdGUiLCJ1cGRhdGVEb3RzIiwic2V0U2xpZGVDbGFzc2VzIiwiYnVpbGRSb3dzIiwiciIsImwiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50IiwiZCIsImEiLCJjIiwiZ2V0IiwiYXBwZW5kQ2hpbGQiLCJlbXB0eSIsImRpc3BsYXkiLCJjaGVja1Jlc3BvbnNpdmUiLCJpbm5lcldpZHRoIiwiaGFzT3duUHJvcGVydHkiLCJ1bnNsaWNrIiwicmVmcmVzaCIsImN1cnJlbnRUYXJnZXQiLCJtZXNzYWdlIiwiY2hlY2tOYXZpZ2FibGUiLCJnZXROYXZpZ2FibGVJbmRleGVzIiwiY2xlYW5VcEV2ZW50cyIsIm9mZiIsImludGVycnVwdCIsInZpc2liaWxpdHkiLCJjbGVhblVwU2xpZGVFdmVudHMiLCJvcmllbnRhdGlvbkNoYW5nZSIsInJlc2l6ZSIsImNsZWFuVXBSb3dzIiwic3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uIiwiZGVzdHJveSIsImZhZGVTbGlkZSIsIm9wYWNpdHkiLCJmYWRlU2xpZGVPdXQiLCJmaWx0ZXJTbGlkZXMiLCJzbGlja0ZpbHRlciIsImZpbHRlciIsImZvY3VzSGFuZGxlciIsImdldEN1cnJlbnQiLCJzbGlja0N1cnJlbnRTbGlkZSIsImdldExlZnQiLCJmbG9vciIsIm9mZnNldExlZnQiLCJvdXRlcldpZHRoIiwiZ2V0T3B0aW9uIiwic2xpY2tHZXRPcHRpb24iLCJwdXNoIiwiZ2V0U2xpY2siLCJnZXRTbGlkZUNvdW50IiwiYWJzIiwiZ29UbyIsInNsaWNrR29UbyIsInBhcnNlSW50Iiwic2V0UHJvcHMiLCJzdGFydExvYWQiLCJsb2FkU2xpZGVyIiwiaW5pdGlhbGl6ZUV2ZW50cyIsInVwZGF0ZUFycm93cyIsImluaXRBREEiLCJpbmRleE9mIiwicm9sZSIsImlkIiwiZW5kIiwiaW5pdEFycm93RXZlbnRzIiwiaW5pdERvdEV2ZW50cyIsImluaXRTbGlkZUV2ZW50cyIsImFjdGlvbiIsImluaXRVSSIsInRhZ05hbWUiLCJrZXlDb2RlIiwib25lcnJvciIsInNyYyIsInNsaWNlIiwicHJvZ3Jlc3NpdmVMYXp5TG9hZCIsInNsaWNrTmV4dCIsInBhdXNlIiwic2xpY2tQYXVzZSIsInBsYXkiLCJzbGlja1BsYXkiLCJwb3N0U2xpZGUiLCJmb2N1cyIsInByZXYiLCJzbGlja1ByZXYiLCJicmVha3BvaW50Iiwic3BsaWNlIiwic29ydCIsImNsZWFyVGltZW91dCIsIndpbmRvd0RlbGF5IiwicmVtb3ZlU2xpZGUiLCJzbGlja1JlbW92ZSIsInNldENTUyIsInNldERpbWVuc2lvbnMiLCJwYWRkaW5nIiwic2V0RmFkZSIsInBvc2l0aW9uIiwicmlnaHQiLCJzZXRIZWlnaHQiLCJzZXRPcHRpb24iLCJzbGlja1NldE9wdGlvbiIsImJvZHkiLCJXZWJraXRUcmFuc2l0aW9uIiwiTW96VHJhbnNpdGlvbiIsIm1zVHJhbnNpdGlvbiIsIk9UcmFuc2Zvcm0iLCJwZXJzcGVjdGl2ZVByb3BlcnR5Iiwid2Via2l0UGVyc3BlY3RpdmUiLCJNb3pUcmFuc2Zvcm0iLCJNb3pQZXJzcGVjdGl2ZSIsIndlYmtpdFRyYW5zZm9ybSIsIm1zVHJhbnNmb3JtIiwiY2xvbmUiLCJzd2lwZURpcmVjdGlvbiIsInN0YXJ0WCIsImN1clgiLCJzdGFydFkiLCJjdXJZIiwiYXRhbjIiLCJyb3VuZCIsIlBJIiwic3dpcGVFbmQiLCJzd2lwZUxlbmd0aCIsImVkZ2VIaXQiLCJtaW5Td2lwZSIsImZpbmdlckNvdW50Iiwib3JpZ2luYWxFdmVudCIsInRvdWNoZXMiLCJzd2lwZVN0YXJ0Iiwic3dpcGVNb3ZlIiwiY2xpZW50WCIsImNsaWVudFkiLCJzcXJ0IiwicG93IiwidW5maWx0ZXJTbGlkZXMiLCJzbGlja1VuZmlsdGVyIiwiQXJyYXkiLCJhcHBseSIsInZhbHVlMSIsInZhbHVlMiIsInNsaWRlVG9nZ2xlIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVlDLEtBQVosQ0FBa0IsWUFBVztBQUN6Qjs7O0FBR0EsTUFBSUMsYUFBYSxHQUFHO0FBQ2hCO0FBQ0FDLElBQUFBLElBQUksRUFBRyxHQUZTO0FBSWhCO0FBQ0FDLElBQUFBLGFBQWEsRUFBRSxJQUxDO0FBTWhCQyxJQUFBQSxhQUFhLEVBQUUsSUFOQztBQU9oQkMsSUFBQUEsV0FBVyxFQUFJLElBUEM7QUFRaEJDLElBQUFBLFlBQVksRUFBSSxJQVJBO0FBU2hCQyxJQUFBQSxVQUFVLEVBQU0sR0FUQTtBQVVoQkMsSUFBQUEsWUFBWSxFQUFJLEdBVkE7QUFXaEJDLElBQUFBLFVBQVUsRUFBTSxHQVhBO0FBYWhCO0FBQ0FDLElBQUFBLGdCQUFnQixFQUFFLEdBZEY7QUFnQmhCO0FBQ0FDLElBQUFBLGtCQUFrQixFQUFFLElBakJKO0FBbUJoQjtBQUNBQyxJQUFBQSxPQUFPLEVBQUVkLENBQUMsQ0FBQ2UsT0FBRixDQUFVQyxNQXBCSDtBQXNCaEJDLElBQUFBLElBQUksRUFBRWpCLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVWtCLElBQVYsQ0FBZSxNQUFmO0FBdEJVLEdBQXBC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QVlpTixJQUFaLEVBQWtCO0FBQzdCLGFBQU9BLElBQUksS0FBSyxjQUFULEdBQTBCLFFBQTFCLEdBQXFDLGNBQTVDO0FBQ0QsS0FGRDtBQUdILEdBSkQ7QUFPQXpSLEVBQUFBLENBQUMsQ0FBQyxhQUFELENBQUQsQ0FBaUJvRSxLQUFqQixDQUF1QixZQUFXO0FBQzlCcEUsSUFBQUEsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFReVIsSUFBUixDQUFhLFVBQVNqTixDQUFULEVBQVlpTixJQUFaLEVBQWtCO0FBQzdCLGFBQU9BLElBQUksS0FBSyxXQUFULEdBQXVCLG9CQUF2QixHQUE4QyxXQUFyRDtBQUNELEtBRkQ7QUFHSCxHQUpELEVBejBDeUIsQ0E4MEN6QjtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBSUE7OztBQUlBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFLSjtBQUVDLENBdjRDRCIsInNvdXJjZXNDb250ZW50IjpbIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG4gICAgLyoqXHJcbiAgICAgKiDQk9C70L7QsdCw0LvRjNC90YvQtSDQv9C10YDQtdC80LXQvdC90YvQtSwg0LrQvtGC0L7RgNGL0LUg0LjRgdC/0L7Qu9GM0LfRg9GO0YLRgdGPINC80L3QvtCz0L7QutGA0LDRgtC90L5cclxuICAgICAqL1xyXG4gICAgbGV0IGdsb2JhbE9wdGlvbnMgPSB7XHJcbiAgICAgICAgLy8g0JLRgNC10LzRjyDQtNC70Y8g0LDQvdC40LzQsNGG0LjQuVxyXG4gICAgICAgIHRpbWU6ICAyMDAsXHJcblxyXG4gICAgICAgIC8vINCa0L7QvdGC0YDQvtC70YzQvdGL0LUg0YLQvtGH0LrQuCDQsNC00LDQv9GC0LjQstCwXHJcbiAgICAgICAgZGVza3RvcFhsU2l6ZTogMTkyMCxcclxuICAgICAgICBkZXNrdG9wTGdTaXplOiAxNjAwLFxyXG4gICAgICAgIGRlc2t0b3BTaXplOiAgIDEyODAsXHJcbiAgICAgICAgdGFibGV0TGdTaXplOiAgIDEwMjQsXHJcbiAgICAgICAgdGFibGV0U2l6ZTogICAgIDc2OCxcclxuICAgICAgICBtb2JpbGVMZ1NpemU6ICAgNjQwLFxyXG4gICAgICAgIG1vYmlsZVNpemU6ICAgICA0ODAsXHJcblxyXG4gICAgICAgIC8vINCi0L7Rh9C60LAg0L/QtdGA0LXRhdC+0LTQsCDQv9C+0L/QsNC/0L7QsiDQvdCwINGE0YPQu9GB0LrRgNC40L1cclxuICAgICAgICBwb3B1cHNCcmVha3BvaW50OiA3NjgsXHJcblxyXG4gICAgICAgIC8vINCS0YDQtdC80Y8g0LTQviDRgdC+0LrRgNGL0YLQuNGPINGE0LjQutGB0LjRgNC+0LLQsNC90L3Ri9GFINC/0L7Qv9Cw0L/QvtCyXHJcbiAgICAgICAgcG9wdXBzRml4ZWRUaW1lb3V0OiA1MDAwLFxyXG5cclxuICAgICAgICAvLyDQn9GA0L7QstC10YDQutCwIHRvdWNoINGD0YHRgtGA0L7QudGB0YLQslxyXG4gICAgICAgIGlzVG91Y2g6ICQuYnJvd3Nlci5tb2JpbGUsXHJcblxyXG4gICAgICAgIGxhbmc6ICQoJ2h0bWwnKS5hdHRyKCdsYW5nJylcclxuICAgIH07XHJcblxyXG4gICAgLy8g0JHRgNC10LnQutC/0L7QuNC90YLRiyDQsNC00LDQv9GC0LjQstCwXHJcbiAgICAvLyBAZXhhbXBsZSBpZiAoZ2xvYmFsT3B0aW9ucy5icmVha3BvaW50VGFibGV0Lm1hdGNoZXMpIHt9IGVsc2Uge31cclxuICAgIGNvbnN0IGJyZWFrcG9pbnRzID0ge1xyXG4gICAgICAgIGJyZWFrcG9pbnREZXNrdG9wWGw6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMuZGVza3RvcFhsU2l6ZSAtIDF9cHgpYCksXHJcbiAgICAgICAgYnJlYWtwb2ludERlc2t0b3BMZzogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5kZXNrdG9wTGdTaXplIC0gMX1weClgKSxcclxuICAgICAgICBicmVha3BvaW50RGVza3RvcDogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5kZXNrdG9wU2l6ZSAtIDF9cHgpYCksXHJcbiAgICAgICAgYnJlYWtwb2ludFRhYmxldExnOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLnRhYmxldExnU2l6ZSAtIDF9cHgpYCksXHJcbiAgICAgICAgYnJlYWtwb2ludFRhYmxldDogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy50YWJsZXRTaXplIC0gMX1weClgKSxcclxuICAgICAgICBicmVha3BvaW50TW9iaWxlTGdTaXplOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLm1vYmlsZUxnU2l6ZSAtIDF9cHgpYCksXHJcbiAgICAgICAgYnJlYWtwb2ludE1vYmlsZTogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5tb2JpbGVTaXplIC0gMX1weClgKVxyXG4gICAgfTtcclxuXHJcbiAgICAkLmV4dGVuZCh0cnVlLCBnbG9iYWxPcHRpb25zLCBicmVha3BvaW50cyk7XHJcblxyXG5cclxuXHJcblxyXG4gICAgJCh3aW5kb3cpLmxvYWQoKCkgPT4ge1xyXG4gICAgICAgIGlmIChnbG9iYWxPcHRpb25zLmlzVG91Y2gpIHtcclxuICAgICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCd0b3VjaCcpLnJlbW92ZUNsYXNzKCduby10b3VjaCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnbm8tdG91Y2gnKS5yZW1vdmVDbGFzcygndG91Y2gnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGlmICgkKCd0ZXh0YXJlYScpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAvLyAgICAgYXV0b3NpemUoJCgndGV4dGFyZWEnKSk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/QvtC00LrQu9GO0YfQtdC90LjQtSBqcyBwYXJ0aWFsc1xyXG4gICAgICovXHJcbiAgICAvKiBmb3JtX3N0eWxlLmpzINC00L7Qu9C20LXQvSDQsdGL0YLRjCDQstGL0L/QvtC70L3QtdC9INC/0LXRgNC10LQgZm9ybV92YWxpZGF0aW9uLmpzICovXHJcbiAgICAvKipcclxuICAgICAqINCg0LDRgdGI0LjRgNC10L3QuNC1IGFuaW1hdGUuY3NzXHJcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGFuaW1hdGlvbk5hbWUg0L3QsNC30LLQsNC90LjQtSDQsNC90LjQvNCw0YbQuNC4XHJcbiAgICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gY2FsbGJhY2sg0YTRg9C90LrRhtC40Y8sINC60L7RgtC+0YDQsNGPINC+0YLRgNCw0LHQvtGC0LDQtdGCINC/0L7RgdC70LUg0LfQsNCy0LXRgNGI0LXQvdC40Y8g0LDQvdC40LzQsNGG0LjQuFxyXG4gICAgICogQHJldHVybiB7T2JqZWN0fSDQvtCx0YrQtdC60YIg0LDQvdC40LzQsNGG0LjQuFxyXG4gICAgICogXHJcbiAgICAgKiBAc2VlICBodHRwczovL2RhbmVkZW4uZ2l0aHViLmlvL2FuaW1hdGUuY3NzL1xyXG4gICAgICogXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogJCgnI3lvdXJFbGVtZW50JykuYW5pbWF0ZUNzcygnYm91bmNlJyk7XHJcbiAgICAgKiBcclxuICAgICAqICQoJyN5b3VyRWxlbWVudCcpLmFuaW1hdGVDc3MoJ2JvdW5jZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICogICAgIC8vINCU0LXQu9Cw0LXQvCDRh9GC0L4t0YLQviDQv9C+0YHQu9C1INC30LDQstC10YDRiNC10L3QuNGPINCw0L3QuNC80LDRhtC40LhcclxuICAgICAqIH0pO1xyXG4gICAgICovXHJcbiAgICAkLmZuLmV4dGVuZCh7XHJcbiAgICAgICAgYW5pbWF0ZUNzczogZnVuY3Rpb24oYW5pbWF0aW9uTmFtZSwgY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgbGV0IGFuaW1hdGlvbkVuZCA9IChmdW5jdGlvbihlbCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGFuaW1hdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiAnYW5pbWF0aW9uZW5kJyxcclxuICAgICAgICAgICAgICAgICAgICBPQW5pbWF0aW9uOiAnb0FuaW1hdGlvbkVuZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgTW96QW5pbWF0aW9uOiAnbW96QW5pbWF0aW9uRW5kJyxcclxuICAgICAgICAgICAgICAgICAgICBXZWJraXRBbmltYXRpb246ICd3ZWJraXRBbmltYXRpb25FbmQnLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB0IGluIGFuaW1hdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZWwuc3R5bGVbdF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uc1t0XTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ2xhc3MoJ2FuaW1hdGVkICcgKyBhbmltYXRpb25OYW1lKS5vbmUoYW5pbWF0aW9uRW5kLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGVkICcgKyBhbmltYXRpb25OYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLyoqXHJcbiAgICAgKiDQodGC0LjQu9C40LfRg9C10YIg0YHQtdC70LXQutGC0Ysg0YEg0L/QvtC80L7RidGM0Y4g0L/Qu9Cw0LPQuNC90LAgc2VsZWN0MlxyXG4gICAgICogaHR0cHM6Ly9zZWxlY3QyLmdpdGh1Yi5pb1xyXG4gICAgICovXHJcbiAgICBsZXQgQ3VzdG9tU2VsZWN0ID0gZnVuY3Rpb24oJGVsZW0pIHtcclxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYuaW5pdCA9IGZ1bmN0aW9uKCRpbml0RWxlbSkge1xyXG4gICAgICAgICAgICAkaW5pdEVsZW0uZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RTZWFyY2ggPSAkKHRoaXMpLmRhdGEoJ3NlYXJjaCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdFNlYXJjaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCA9IDE7IC8vINC/0L7QutCw0LfRi9Cy0LDQtdC8INC/0L7Qu9C1INC/0L7QuNGB0LrQsFxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoID0gSW5maW5pdHk7IC8vINC90LUg0L/QvtC60LDQt9GL0LLQsNC10Lwg0L/QvtC70LUg0L/QvtC40YHQutCwXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNlbGVjdDIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogbWluaW11bVJlc3VsdHNGb3JTZWFyY2gsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdE9uQmx1cjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHJvcGRvd25Dc3NDbGFzczogJ2Vycm9yJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vINC90YPQttC90L4g0LTQu9GPINCy0YvQu9C40LTQsNGG0LjQuCDQvdCwINC70LXRgtGDXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZChgb3B0aW9uW3ZhbHVlPVwiJHskKHRoaXMpLmNvbnRleHQudmFsdWV9XCJdYCkuY2xpY2soKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGUgPSBmdW5jdGlvbigkdXBkYXRlRWxlbSkge1xyXG4gICAgICAgICAgICAkdXBkYXRlRWxlbS5zZWxlY3QyKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgICAgIHNlbGYuaW5pdCgkdXBkYXRlRWxlbSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5pbml0KCRlbGVtKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodGC0LjQu9C40LfRg9C10YIgZmlsZSBpbnB1dFxyXG4gICAgICogaHR0cDovL2dyZWdwaWtlLm5ldC9kZW1vcy9ib290c3RyYXAtZmlsZS1pbnB1dC9kZW1vLmh0bWxcclxuICAgICAqL1xyXG4gICAgJC5mbi5jdXN0b21GaWxlSW5wdXQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uKGksIGVsZW0pIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0ICRlbGVtID0gJChlbGVtKTtcclxuXHJcbiAgICAgICAgICAgIC8vIE1heWJlIHNvbWUgZmllbGRzIGRvbid0IG5lZWQgdG8gYmUgc3RhbmRhcmRpemVkLlxyXG4gICAgICAgICAgICBpZiAodHlwZW9mICRlbGVtLmF0dHIoJ2RhdGEtYmZpLWRpc2FibGVkJykgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFNldCB0aGUgd29yZCB0byBiZSBkaXNwbGF5ZWQgb24gdGhlIGJ1dHRvblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uV29yZCA9ICdCcm93c2UnO1xyXG4gICAgICAgICAgICBsZXQgY2xhc3NOYW1lID0gJyc7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mICRlbGVtLmF0dHIoJ3RpdGxlJykgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICBidXR0b25Xb3JkID0gJGVsZW0uYXR0cigndGl0bGUnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCEhJGVsZW0uYXR0cignY2xhc3MnKSkge1xyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lID0gJyAnICsgJGVsZW0uYXR0cignY2xhc3MnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gTm93IHdlJ3JlIGdvaW5nIHRvIHdyYXAgdGhhdCBpbnB1dCBmaWVsZCB3aXRoIGEgYnV0dG9uLlxyXG4gICAgICAgICAgICAvLyBUaGUgaW5wdXQgd2lsbCBhY3R1YWxseSBzdGlsbCBiZSB0aGVyZSwgaXQgd2lsbCBqdXN0IGJlIGZsb2F0IGFib3ZlIGFuZCB0cmFuc3BhcmVudCAoZG9uZSB3aXRoIHRoZSBDU1MpLlxyXG4gICAgICAgICAgICAkZWxlbS53cmFwKGA8ZGl2IGNsYXNzPVwiY3VzdG9tLWZpbGVcIj48YSBjbGFzcz1cImJ0biAke2NsYXNzTmFtZX1cIj48L2E+PC9kaXY+YCkucGFyZW50KCkucHJlcGVuZCgkKCc8c3Bhbj48L3NwYW4+JykuaHRtbChidXR0b25Xb3JkKSk7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLy8gQWZ0ZXIgd2UgaGF2ZSBmb3VuZCBhbGwgb2YgdGhlIGZpbGUgaW5wdXRzIGxldCdzIGFwcGx5IGEgbGlzdGVuZXIgZm9yIHRyYWNraW5nIHRoZSBtb3VzZSBtb3ZlbWVudC5cclxuICAgICAgICAvLyBUaGlzIGlzIGltcG9ydGFudCBiZWNhdXNlIHRoZSBpbiBvcmRlciB0byBnaXZlIHRoZSBpbGx1c2lvbiB0aGF0IHRoaXMgaXMgYSBidXR0b24gaW4gRkYgd2UgYWN0dWFsbHkgbmVlZCB0byBtb3ZlIHRoZSBidXR0b24gZnJvbSB0aGUgZmlsZSBpbnB1dCB1bmRlciB0aGUgY3Vyc29yLiBVZ2guXHJcbiAgICAgICAgLnByb21pc2UoKS5kb25lKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgLy8gQXMgdGhlIGN1cnNvciBtb3ZlcyBvdmVyIG91ciBuZXcgYnV0dG9uIHdlIG5lZWQgdG8gYWRqdXN0IHRoZSBwb3NpdGlvbiBvZiB0aGUgaW52aXNpYmxlIGZpbGUgaW5wdXQgQnJvd3NlIGJ1dHRvbiB0byBiZSB1bmRlciB0aGUgY3Vyc29yLlxyXG4gICAgICAgICAgICAvLyBUaGlzIGdpdmVzIHVzIHRoZSBwb2ludGVyIGN1cnNvciB0aGF0IEZGIGRlbmllcyB1c1xyXG4gICAgICAgICAgICAkKCcuY3VzdG9tLWZpbGUnKS5tb3VzZW1vdmUoZnVuY3Rpb24oY3Vyc29yKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGlucHV0LCB3cmFwcGVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHdyYXBwZXJYLCB3cmFwcGVyWSxcclxuICAgICAgICAgICAgICAgICAgICBpbnB1dFdpZHRoLCBpbnB1dEhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICBjdXJzb3JYLCBjdXJzb3JZO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFRoaXMgd3JhcHBlciBlbGVtZW50ICh0aGUgYnV0dG9uIHN1cnJvdW5kIHRoaXMgZmlsZSBpbnB1dClcclxuICAgICAgICAgICAgICAgIHdyYXBwZXIgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgLy8gVGhlIGludmlzaWJsZSBmaWxlIGlucHV0IGVsZW1lbnRcclxuICAgICAgICAgICAgICAgIGlucHV0ID0gd3JhcHBlci5maW5kKCdpbnB1dCcpO1xyXG4gICAgICAgICAgICAgICAgLy8gVGhlIGxlZnQtbW9zdCBwb3NpdGlvbiBvZiB0aGUgd3JhcHBlclxyXG4gICAgICAgICAgICAgICAgd3JhcHBlclggPSB3cmFwcGVyLm9mZnNldCgpLmxlZnQ7XHJcbiAgICAgICAgICAgICAgICAvLyBUaGUgdG9wLW1vc3QgcG9zaXRpb24gb2YgdGhlIHdyYXBwZXJcclxuICAgICAgICAgICAgICAgIHdyYXBwZXJZID0gd3JhcHBlci5vZmZzZXQoKS50b3A7XHJcbiAgICAgICAgICAgICAgICAvLyBUaGUgd2l0aCBvZiB0aGUgYnJvd3NlcnMgaW5wdXQgZmllbGRcclxuICAgICAgICAgICAgICAgIGlucHV0V2lkdGggPSBpbnB1dC53aWR0aCgpO1xyXG4gICAgICAgICAgICAgICAgLy8gVGhlIGhlaWdodCBvZiB0aGUgYnJvd3NlcnMgaW5wdXQgZmllbGRcclxuICAgICAgICAgICAgICAgIGlucHV0SGVpZ2h0ID0gaW5wdXQuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICAvL1RoZSBwb3NpdGlvbiBvZiB0aGUgY3Vyc29yIGluIHRoZSB3cmFwcGVyXHJcbiAgICAgICAgICAgICAgICBjdXJzb3JYID0gY3Vyc29yLnBhZ2VYO1xyXG4gICAgICAgICAgICAgICAgY3Vyc29yWSA9IGN1cnNvci5wYWdlWTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL1RoZSBwb3NpdGlvbnMgd2UgYXJlIHRvIG1vdmUgdGhlIGludmlzaWJsZSBmaWxlIGlucHV0XHJcbiAgICAgICAgICAgICAgICAvLyBUaGUgMjAgYXQgdGhlIGVuZCBpcyBhbiBhcmJpdHJhcnkgbnVtYmVyIG9mIHBpeGVscyB0aGF0IHdlIGNhbiBzaGlmdCB0aGUgaW5wdXQgc3VjaCB0aGF0IGN1cnNvciBpcyBub3QgcG9pbnRpbmcgYXQgdGhlIGVuZCBvZiB0aGUgQnJvd3NlIGJ1dHRvbiBidXQgc29tZXdoZXJlIG5lYXJlciB0aGUgbWlkZGxlXHJcbiAgICAgICAgICAgICAgICBtb3ZlSW5wdXRYID0gY3Vyc29yWCAtIHdyYXBwZXJYIC0gaW5wdXRXaWR0aCArIDIwO1xyXG4gICAgICAgICAgICAgICAgLy8gU2xpZGVzIHRoZSBpbnZpc2libGUgaW5wdXQgQnJvd3NlIGJ1dHRvbiB0byBiZSBwb3NpdGlvbmVkIG1pZGRsZSB1bmRlciB0aGUgY3Vyc29yXHJcbiAgICAgICAgICAgICAgICBtb3ZlSW5wdXRZID0gY3Vyc29yWSAtIHdyYXBwZXJZIC0gKGlucHV0SGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQXBwbHkgdGhlIHBvc2l0aW9uaW5nIHN0eWxlcyB0byBhY3R1YWxseSBtb3ZlIHRoZSBpbnZpc2libGUgZmlsZSBpbnB1dFxyXG4gICAgICAgICAgICAgICAgaW5wdXQuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiBtb3ZlSW5wdXRYLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcDogbW92ZUlucHV0WVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJCgnYm9keScpLm9uKCdjaGFuZ2UnLCAnLmN1c3RvbS1maWxlIGlucHV0W3R5cGU9ZmlsZV0nLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZmlsZU5hbWU7XHJcbiAgICAgICAgICAgICAgICBmaWxlTmFtZSA9ICQodGhpcykudmFsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGFueSBwcmV2aW91cyBmaWxlIG5hbWVzXHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLm5leHQoJy5jdXN0b20tZmlsZV9fbmFtZScpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCEhJCh0aGlzKS5wcm9wKCdmaWxlcycpICYmICQodGhpcykucHJvcCgnZmlsZXMnKS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWUgPSAkKHRoaXMpWzBdLmZpbGVzLmxlbmd0aCArICcgZmlsZXMnO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZSA9IGZpbGVOYW1lLnN1YnN0cmluZyhmaWxlTmFtZS5sYXN0SW5kZXhPZignXFxcXCcpICsgMSwgZmlsZU5hbWUubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBEb24ndCB0cnkgdG8gc2hvdyB0aGUgbmFtZSBpZiB0aGVyZSBpcyBub25lXHJcbiAgICAgICAgICAgICAgICBpZiAoIWZpbGVOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZEZpbGVOYW1lUGxhY2VtZW50ID0gJCh0aGlzKS5kYXRhKCdmaWxlbmFtZS1wbGFjZW1lbnQnKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEZpbGVOYW1lUGxhY2VtZW50ID09PSAnaW5zaWRlJykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFByaW50IHRoZSBmaWxlTmFtZSBpbnNpZGVcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCdzcGFuJykuaHRtbChmaWxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCd0aXRsZScsIGZpbGVOYW1lKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gUHJpbnQgdGhlIGZpbGVOYW1lIGFzaWRlIChyaWdodCBhZnRlciB0aGUgdGhlIGJ1dHRvbilcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmFmdGVyKGA8c3BhbiBjbGFzcz1cImN1c3RvbS1maWxlX19uYW1lXCI+JHtmaWxlTmFtZX0gPC9zcGFuPmApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICAkKCdpbnB1dFt0eXBlPVwiZmlsZVwiXScpLmN1c3RvbUZpbGVJbnB1dCgpO1xyXG4gICAgLy8gJCgnc2VsZWN0JykuY3VzdG9tU2VsZWN0KCk7XHJcbiAgICB2YXIgY3VzdG9tU2VsZWN0ID0gbmV3IEN1c3RvbVNlbGVjdCgkKCdzZWxlY3QnKSk7XHJcblxyXG4gICAgaWYgKCQoJy5qcy1sYWJlbC1hbmltYXRpb24nKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0JDQvdC40LzQsNGG0LjRjyDRjdC70LXQvNC10L3RgtCwIGxhYmVsINC/0YDQuCDRhNC+0LrRg9GB0LUg0L/QvtC70LXQuSDRhNC+0YDQvNGLXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJCgnLmpzLWxhYmVsLWFuaW1hdGlvbicpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gJChlbCkuZmluZCgnaW5wdXQsIHRleHRhcmVhJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoJChmaWVsZCkudmFsKCkudHJpbSgpICE9ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAkKGVsKS5hZGRDbGFzcygnaXMtZmlsbGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQoZmllbGQpLm9uKCdmb2N1cycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAkKGVsKS5hZGRDbGFzcygnaXMtZmlsbGVkJyk7XHJcbiAgICAgICAgICAgIH0pLm9uKCdibHVyJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnZhbCgpLnRyaW0oKSA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGVsKS5yZW1vdmVDbGFzcygnaXMtZmlsbGVkJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBsb2NhbGUgPSBnbG9iYWxPcHRpb25zLmxhbmcgPT0gJ3J1LVJVJyA/ICdydScgOiAnZW4nO1xyXG5cclxuICAgIFBhcnNsZXkuc2V0TG9jYWxlKGxvY2FsZSk7XHJcblxyXG4gICAgLyog0J3QsNGB0YLRgNC+0LnQutC4IFBhcnNsZXkgKi9cclxuICAgICQuZXh0ZW5kKFBhcnNsZXkub3B0aW9ucywge1xyXG4gICAgICAgIHRyaWdnZXI6ICdibHVyIGNoYW5nZScsIC8vIGNoYW5nZSDQvdGD0LbQtdC9INC00LvRjyBzZWxlY3Qn0LBcclxuICAgICAgICB2YWxpZGF0aW9uVGhyZXNob2xkOiAnMCcsXHJcbiAgICAgICAgZXJyb3JzV3JhcHBlcjogJzxkaXY+PC9kaXY+JyxcclxuICAgICAgICBlcnJvclRlbXBsYXRlOiAnPHAgY2xhc3M9XCJwYXJzbGV5LWVycm9yLW1lc3NhZ2VcIj48L3A+JyxcclxuICAgICAgICBjbGFzc0hhbmRsZXI6IGZ1bmN0aW9uKGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRlbGVtZW50ID0gaW5zdGFuY2UuJGVsZW1lbnQ7XHJcbiAgICAgICAgICAgIGxldCB0eXBlID0gJGVsZW1lbnQuYXR0cigndHlwZScpLFxyXG4gICAgICAgICAgICAgICAgJGhhbmRsZXI7XHJcbiAgICAgICAgICAgIGlmICh0eXBlID09ICdjaGVja2JveCcgfHwgdHlwZSA9PSAncmFkaW8nKSB7XHJcbiAgICAgICAgICAgICAgICAkaGFuZGxlciA9ICRlbGVtZW50OyAvLyDRgtC+INC10YHRgtGMINC90LjRh9C10LPQviDQvdC1INCy0YvQtNC10LvRj9C10LwgKGlucHV0INGB0LrRgNGL0YIpLCDQuNC90LDRh9C1INCy0YvQtNC10LvRj9C10YIg0YDQvtC00LjRgtC10LvRjNGB0LrQuNC5INCx0LvQvtC6XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoJGVsZW1lbnQuaGFzQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKSkge1xyXG4gICAgICAgICAgICAgICAgJGhhbmRsZXIgPSAkKCcuc2VsZWN0Mi1zZWxlY3Rpb24tLXNpbmdsZScsICRlbGVtZW50Lm5leHQoJy5zZWxlY3QyJykpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGhhbmRsZXI7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlcnJvcnNDb250YWluZXI6IGZ1bmN0aW9uKGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRlbGVtZW50ID0gaW5zdGFuY2UuJGVsZW1lbnQ7XHJcbiAgICAgICAgICAgIGxldCB0eXBlID0gJGVsZW1lbnQuYXR0cigndHlwZScpLFxyXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lcjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh0eXBlID09ICdjaGVja2JveCcgfHwgdHlwZSA9PSAncmFkaW8nKSB7XHJcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJChgW25hbWU9XCIkeyRlbGVtZW50LmF0dHIoJ25hbWUnKX1cIl06bGFzdCArIGxhYmVsYCkubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICgkZWxlbWVudC5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpKSB7XHJcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQubmV4dCgnLnNlbGVjdDInKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT0gJ2ZpbGUnKSB7XHJcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQuY2xvc2VzdCgnLmN1c3RvbS1maWxlJykubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICgkZWxlbWVudC5jbG9zZXN0KCcuanMtZGF0ZXBpY2tlci1yYW5nZScpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50LmNsb3Nlc3QoJy5qcy1kYXRlcGlja2VyLXJhbmdlJykubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICgkZWxlbWVudC5hdHRyKCduYW1lJykgPT0gJ2lzX3JlY2FwdGNoYV9zdWNjZXNzJykge1xyXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50LnBhcmVudCgpLm5leHQoJy5nLXJlY2FwdGNoYScpLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkY29udGFpbmVyO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCa0LDRgdGC0L7QvNC90YvQtSDQstCw0LvQuNC00LDRgtC+0YDRi1xyXG5cclxuICAgIC8vINCi0L7Qu9GM0LrQviDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLLCDRgtC40YDQtSwg0L/RgNC+0LHQtdC70YtcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCduYW1lUnUnLCB7XHJcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAvXlvQsC3Rj9GRXFwtIF0qJC9pLnRlc3QodmFsdWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJyxcclxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0KLQvtC70YzQutC+INC70LDRgtC40L3RgdC60LjQtSDQsdGD0LrQstGLLCDRgtC40YDQtSwg0L/RgNC+0LHQtdC70YtcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCduYW1lRW4nLCB7XHJcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAvXlthLXpcXC0gXSokL2kudGVzdCh2YWx1ZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgQS1aLCBhLXosIFwiIFwiLCBcIi1cIicsXHJcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIEEtWiwgYS16LCBcIiBcIiwgXCItXCInXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0KLQvtC70YzQutC+INC70LDRgtC40L3RgdC60LjQtSDQuCDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLLCDRgtC40YDQtSwg0L/RgNC+0LHQtdC70YtcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCduYW1lJywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gL15b0LAt0Y/RkWEtelxcLSBdKiQvaS50ZXN0KHZhbHVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInLFxyXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0KLQvtC70YzQutC+INGG0LjRhNGA0Ysg0Lgg0YDRg9GB0YHQutC40LUg0LHRg9C60LLRi1xyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ251bUxldHRlclJ1Jywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gL15bMC050LAt0Y/RkV0qJC9pLnRlc3QodmFsdWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLINCQLdCvLCDQsC3RjywgMC05JyxcclxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMg0JAt0K8sINCwLdGPLCAwLTknXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0KLQvtC70YzQutC+INGG0LjRhNGA0YssINC70LDRgtC40L3RgdC60LjQtSDQuCDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbnVtTGV0dGVyJywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gL15b0LAt0Y/RkWEtejAtOV0qJC9pLnRlc3QodmFsdWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLIEEtWiwgYS16LCDQkC3Qrywg0LAt0Y8sIDAtOScsXHJcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIEEtWiwgYS16LCDQkC3Qrywg0LAt0Y8sIDAtOSdcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQotC10LvQtdGE0L7QvdC90YvQuSDQvdC+0LzQtdGAXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcigncGhvbmUnLCB7XHJcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAvXlstKzAtOSgpIF0qJC9pLnRlc3QodmFsdWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgcnU6ICfQndC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0YLQtdC70LXRhNC+0L3QvdGL0Lkg0L3QvtC80LXRgCcsXHJcbiAgICAgICAgICAgIGVuOiAnSW5jb3JyZWN0IHBob25lIG51bWJlcidcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQotC+0LvRjNC60L4g0YbQuNGE0YDRi1xyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ251bWJlcicsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC9eWzAtOV0qJC9pLnRlc3QodmFsdWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLIDAtOScsXHJcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIDAtOSdcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQn9C+0YfRgtCwINCx0LXQtyDQutC40YDQuNC70LvQuNGG0YtcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdlbWFpbCcsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC9eKFtBLVphLXrQkC3Qr9CwLdGPMC05XFwtXShcXC58X3wtKXswLDF9KStbQS1aYS160JAt0K/QsC3RjzAtOVxcLV1cXEAoW0EtWmEtetCQLdCv0LAt0Y8wLTlcXC1dKSsoKFxcLil7MCwxfVtBLVphLXrQkC3Qr9CwLdGPMC05XFwtXSl7MSx9XFwuW2EtetCwLdGPMC05XFwtXXsyLH0kLy50ZXN0KHZhbHVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAn0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5INC/0L7Rh9GC0L7QstGL0Lkg0LDQtNGA0LXRgScsXHJcbiAgICAgICAgICAgIGVuOiAnSW5jb3JyZWN0IGVtYWlsIGFkZHJlc3MnXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0KTQvtGA0LzQsNGCINC00LDRgtGLIERELk1NLllZWVlcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdkYXRlJywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICBsZXQgcmVnVGVzdCA9IC9eKD86KD86MzEoXFwuKSg/OjA/WzEzNTc4XXwxWzAyXSkpXFwxfCg/Oig/OjI5fDMwKShcXC4pKD86MD9bMSwzLTldfDFbMC0yXSlcXDIpKSg/Oig/OjFbNi05XXxbMi05XVxcZCk/XFxkezJ9KSR8Xig/OjI5KFxcLikwPzJcXDMoPzooPzooPzoxWzYtOV18WzItOV1cXGQpPyg/OjBbNDhdfFsyNDY4XVswNDhdfFsxMzU3OV1bMjZdKXwoPzooPzoxNnxbMjQ2OF1bMDQ4XXxbMzU3OV1bMjZdKTAwKSkpKSR8Xig/OjA/WzEtOV18MVxcZHwyWzAtOF0pKFxcLikoPzooPzowP1sxLTldKXwoPzoxWzAtMl0pKVxcNCg/Oig/OjFbNi05XXxbMi05XVxcZCk/XFxkezR9KSQvLFxyXG4gICAgICAgICAgICAgICAgcmVnTWF0Y2ggPSAvKFxcZHsxLDJ9KVxcLihcXGR7MSwyfSlcXC4oXFxkezR9KS8sXHJcbiAgICAgICAgICAgICAgICBtaW4gPSBhcmd1bWVudHNbMl0uJGVsZW1lbnQuZGF0YSgnZGF0ZU1pbicpLFxyXG4gICAgICAgICAgICAgICAgbWF4ID0gYXJndW1lbnRzWzJdLiRlbGVtZW50LmRhdGEoJ2RhdGVNYXgnKSxcclxuICAgICAgICAgICAgICAgIG1pbkRhdGUsIG1heERhdGUsIHZhbHVlRGF0ZSwgcmVzdWx0O1xyXG5cclxuICAgICAgICAgICAgaWYgKG1pbiAmJiAocmVzdWx0ID0gbWluLm1hdGNoKHJlZ01hdGNoKSkpIHtcclxuICAgICAgICAgICAgICAgIG1pbkRhdGUgPSBuZXcgRGF0ZSgrcmVzdWx0WzNdLCByZXN1bHRbMl0gLSAxLCArcmVzdWx0WzFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobWF4ICYmIChyZXN1bHQgPSBtYXgubWF0Y2gocmVnTWF0Y2gpKSkge1xyXG4gICAgICAgICAgICAgICAgbWF4RGF0ZSA9IG5ldyBEYXRlKCtyZXN1bHRbM10sIHJlc3VsdFsyXSAtIDEsICtyZXN1bHRbMV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPSB2YWx1ZS5tYXRjaChyZWdNYXRjaCkpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlRGF0ZSA9IG5ldyBEYXRlKCtyZXN1bHRbM10sIHJlc3VsdFsyXSAtIDEsICtyZXN1bHRbMV0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVnVGVzdC50ZXN0KHZhbHVlKSAmJiAobWluRGF0ZSA/IHZhbHVlRGF0ZSA+PSBtaW5EYXRlIDogdHJ1ZSkgJiYgKG1heERhdGUgPyB2YWx1ZURhdGUgPD0gbWF4RGF0ZSA6IHRydWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgcnU6ICfQndC10LrQvtGA0YDQtdC60YLQvdCw0Y8g0LTQsNGC0LAnLFxyXG4gICAgICAgICAgICBlbjogJ0luY29ycmVjdCBkYXRlJ1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyDQpNCw0LnQuyDQvtCz0YDQsNC90LjRh9C10L3QvdC+0LPQviDRgNCw0LfQvNC10YDQsFxyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ2ZpbGVNYXhTaXplJywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSwgbWF4U2l6ZSwgcGFyc2xleUluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIGxldCBmaWxlcyA9IHBhcnNsZXlJbnN0YW5jZS4kZWxlbWVudFswXS5maWxlcztcclxuICAgICAgICAgICAgcmV0dXJuIGZpbGVzLmxlbmd0aCAhPSAxICB8fCBmaWxlc1swXS5zaXplIDw9IG1heFNpemUgKiAxMDI0O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVxdWlyZW1lbnRUeXBlOiAnaW50ZWdlcicsXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgcnU6ICfQpNCw0LnQuyDQtNC+0LvQttC10L0g0LLQtdGB0LjRgtGMINC90LUg0LHQvtC70LXQtSwg0YfQtdC8ICVzIEtiJyxcclxuICAgICAgICAgICAgZW46ICdGaWxlIHNpemUgY2FuXFwndCBiZSBtb3JlIHRoZW4gJXMgS2InXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0J7Qs9GA0LDQvdC40YfQtdC90LjRjyDRgNCw0YHRiNC40YDQtdC90LjQuSDRhNCw0LnQu9C+0LJcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdmaWxlRXh0ZW5zaW9uJywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSwgZm9ybWF0cykge1xyXG4gICAgICAgICAgICBsZXQgZmlsZUV4dGVuc2lvbiA9IHZhbHVlLnNwbGl0KCcuJykucG9wKCk7XHJcbiAgICAgICAgICAgIGxldCBmb3JtYXRzQXJyID0gZm9ybWF0cy5zcGxpdCgnLCAnKTtcclxuICAgICAgICAgICAgbGV0IHZhbGlkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZvcm1hdHNBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChmaWxlRXh0ZW5zaW9uID09PSBmb3JtYXRzQXJyW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdmFsaWQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBydTogJ9CU0L7Qv9GD0YHRgtC40LzRiyDRgtC+0LvRjNC60L4g0YTQsNC50LvRiyDRhNC+0YDQvNCw0YLQsCAlcycsXHJcbiAgICAgICAgICAgIGVuOiAnQXZhaWxhYmxlIGV4dGVuc2lvbnMgYXJlICVzJ1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCh0L7Qt9C00LDRkdGCINC60L7QvdGC0LXQudC90LXRgNGLINC00LvRjyDQvtGI0LjQsdC+0Log0YMg0L3QtdGC0LjQv9C40YfQvdGL0YUg0Y3Qu9C10LzQtdC90YLQvtCyXHJcbiAgICBQYXJzbGV5Lm9uKCdmaWVsZDppbml0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0ICRlbGVtZW50ID0gdGhpcy4kZWxlbWVudCxcclxuICAgICAgICAgICAgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcclxuICAgICAgICAgICAgJGJsb2NrID0gJCgnPGRpdi8+JykuYWRkQ2xhc3MoJ2Vycm9ycy1wbGFjZW1lbnQnKSxcclxuICAgICAgICAgICAgJGxhc3Q7XHJcblxyXG4gICAgICAgIGlmICh0eXBlID09ICdjaGVja2JveCcgfHwgdHlwZSA9PSAncmFkaW8nKSB7XHJcbiAgICAgICAgICAgICRsYXN0ID0gJChgW25hbWU9XCIkeyRlbGVtZW50LmF0dHIoJ25hbWUnKX1cIl06bGFzdCArIGxhYmVsYCk7XHJcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcclxuICAgICAgICAgICAgJGxhc3QgPSAkZWxlbWVudC5uZXh0KCcuc2VsZWN0MicpO1xyXG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09ICdmaWxlJykge1xyXG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50LmNsb3Nlc3QoJy5jdXN0b20tZmlsZScpO1xyXG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICgkZWxlbWVudC5jbG9zZXN0KCcuanMtZGF0ZXBpY2tlci1yYW5nZScpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50LmNsb3Nlc3QoJy5qcy1kYXRlcGlja2VyLXJhbmdlJyk7XHJcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50LmF0dHIoJ25hbWUnKSA9PSAnaXNfcmVjYXB0Y2hhX3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQucGFyZW50KCkubmV4dCgnLmctcmVjYXB0Y2hhJyk7XHJcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQmNC90LjRhtC40LjRgNGD0LXRgiDQstCw0LvQuNC00LDRhtC40Y4g0L3QsCDQstGC0L7RgNC+0Lwg0LrQsNC70LXQtNCw0YDQvdC+0Lwg0L/QvtC70LUg0LTQuNCw0L/QsNC30L7QvdCwXHJcbiAgICBQYXJzbGV5Lm9uKCdmaWVsZDp2YWxpZGF0ZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgJGVsZW1lbnQgPSAkKHRoaXMuZWxlbWVudCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCdmb3JtW2RhdGEtdmFsaWRhdGU9XCJ0cnVlXCJdJykucGFyc2xleSgpO1xyXG4gICAgLyoqXHJcbiAgICAgKiDQlNC+0LHQsNCy0LvRj9C10YIg0LzQsNGB0LrQuCDQsiDQv9C+0LvRjyDRhNC+0YDQvFxyXG4gICAgICogQHNlZSAgaHR0cHM6Ly9naXRodWIuY29tL1JvYmluSGVyYm90cy9JbnB1dG1hc2tcclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogPGlucHV0IGNsYXNzPVwianMtcGhvbmUtbWFza1wiIHR5cGU9XCJ0ZWxcIiBuYW1lPVwidGVsXCIgaWQ9XCJ0ZWxcIj5cclxuICAgICAqL1xyXG4gICAgJCgnLmpzLXBob25lLW1hc2snKS5pbnB1dG1hc2soJys3KDk5OSkgOTk5LTk5LTk5Jywge1xyXG4gICAgICAgIGNsZWFyTWFza09uTG9zdEZvY3VzOiB0cnVlLFxyXG4gICAgICAgIHNob3dNYXNrT25Ib3ZlcjogZmFsc2VcclxuICAgIH0pO1xyXG5cclxuICAgICQoIFwiLmZsYWdtYW4tcmVxdWVzdF9fZGF0ZVwiICkuZGF0ZXBpY2tlcigpO1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqINCa0L7RgdGC0YvQu9GMINC00LvRjyDQvtCx0L3QvtCy0LvQtdC90LjRjyB4bGluayDRgyBzdmct0LjQutC+0L3QvtC6INC/0L7RgdC70LUg0L7QsdC90L7QstC70LXQvdC40Y8gRE9NICjQtNC70Y8gSUUpXHJcbiAgICAgKiDRhNGD0L3QutGG0LjRjiDQvdGD0LbQvdC+INCy0YvQt9GL0LLQsNGC0Ywg0LIg0YHQvtCx0YvRgtC40Y/RhSwg0LrQvtGC0L7RgNGL0LUg0LLQvdC+0YHRj9GCINC40LfQvNC10L3QtdC90LjRjyDQsiDRjdC70LXQvNC10L3RgtGLINGD0LbQtSDQv9C+0YHQu9C1INGE0L7RgNC80LjRgNC+0LLQsNC90LjRjyBET00t0LBcclxuICAgICAqICjQvdCw0L/RgNC40LzQtdGALCDQv9C+0YHQu9C1INC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNC4INC60LDRgNGD0YHQtdC70Lgg0LjQu9C4INC+0YLQutGA0YvRgtC40Lgg0L/QvtC/0LDQv9CwKVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge0VsZW1lbnR9IGVsZW1lbnQg0Y3Qu9C10LzQtdC90YIsINCyINC60L7RgtC+0YDQvtC8INC90LXQvtCx0YXQvtC00LjQvNC+INC+0LHQvdC+0LLQuNGC0Ywgc3ZnICjQvdCw0L/RgNC40LwgJCgnI3NvbWUtcG9wdXAnKSlcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdXBkYXRlU3ZnKGVsZW1lbnQpIHtcclxuICAgICAgICBsZXQgJHVzZUVsZW1lbnQgPSBlbGVtZW50LmZpbmQoJ3VzZScpO1xyXG5cclxuICAgICAgICAkdXNlRWxlbWVudC5lYWNoKGZ1bmN0aW9uKCBpbmRleCApIHtcclxuICAgICAgICAgICAgaWYgKCR1c2VFbGVtZW50W2luZGV4XS5ocmVmICYmICR1c2VFbGVtZW50W2luZGV4XS5ocmVmLmJhc2VWYWwpIHtcclxuICAgICAgICAgICAgICAgICR1c2VFbGVtZW50W2luZGV4XS5ocmVmLmJhc2VWYWwgPSAkdXNlRWxlbWVudFtpbmRleF0uaHJlZi5iYXNlVmFsOyAvLyB0cmlnZ2VyIGZpeGluZyBvZiBocmVmXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGNvbnN0IGRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyA9IHtcclxuICAgICAgICBkYXRlRm9ybWF0OiAnZGQubW0ueXknLFxyXG4gICAgICAgIHNob3dPdGhlck1vbnRoczogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0LXQu9Cw0LXRgiDQstGL0L/QsNC00Y7RidC40LUg0LrQsNC70LXQvdC00LDRgNC40LrQuFxyXG4gICAgICogQHNlZSAgaHR0cDovL2FwaS5qcXVlcnl1aS5jb20vZGF0ZXBpY2tlci9cclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogLy8g0LIgZGF0YS1kYXRlLW1pbiDQuCBkYXRhLWRhdGUtbWF4INC80L7QttC90L4g0LfQsNC00LDRgtGMINC00LDRgtGDINCyINGE0L7RgNC80LDRgtC1IGRkLm1tLnl5eXlcclxuICAgICAqIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJkYXRlSW5wdXRcIiBpZD1cIlwiIGNsYXNzPVwianMtZGF0ZXBpY2tlclwiIGRhdGEtZGF0ZS1taW49XCIwNi4xMS4yMDE1XCIgZGF0YS1kYXRlLW1heD1cIjEwLjEyLjIwMTVcIj5cclxuICAgICAqL1xyXG4gICAgbGV0IERhdGVwaWNrZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgZGF0ZXBpY2tlciA9ICQoJy5qcy1kYXRlcGlja2VyJyk7XHJcblxyXG4gICAgICAgIGRhdGVwaWNrZXIuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBtaW5EYXRlID0gJCh0aGlzKS5kYXRhKCdkYXRlLW1pbicpO1xyXG4gICAgICAgICAgICBsZXQgbWF4RGF0ZSA9ICQodGhpcykuZGF0YSgnZGF0ZS1tYXgnKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBpdGVtT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIG1pbkRhdGU6IG1pbkRhdGUgfHwgbnVsbCxcclxuICAgICAgICAgICAgICAgIG1heERhdGU6IG1heERhdGUgfHwgbnVsbCxcclxuICAgICAgICAgICAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNoYW5nZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLmZpZWxkJykuYWRkQ2xhc3MoJ2lzLWZpbGxlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJC5leHRlbmQodHJ1ZSwgaXRlbU9wdGlvbnMsIGRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICAkKHRoaXMpLmRhdGVwaWNrZXIoaXRlbU9wdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgZGF0ZXBpY2tlciA9IG5ldyBEYXRlcGlja2VyKCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvLyDQlNC40LDQv9Cw0LfQvtC9INC00LDRglxyXG4gICAgbGV0IERhdGVwaWNrZXJSYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBkYXRlcGlja2VyUmFuZ2UgPSAkKCcuanMtZGF0ZXBpY2tlci1yYW5nZScpO1xyXG5cclxuICAgICAgICBkYXRlcGlja2VyUmFuZ2UuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBmcm9tSXRlbU9wdGlvbnMgPSB7fTtcclxuICAgICAgICAgICAgbGV0IHRvSXRlbU9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICQuZXh0ZW5kKHRydWUsIGZyb21JdGVtT3B0aW9ucywgZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zKTtcclxuICAgICAgICAgICAgJC5leHRlbmQodHJ1ZSwgdG9JdGVtT3B0aW9ucywgZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBkYXRlRnJvbSA9ICQodGhpcykuZmluZCgnLmpzLXJhbmdlLWZyb20nKS5kYXRlcGlja2VyKGZyb21JdGVtT3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZGF0ZVRvID0gJCh0aGlzKS5maW5kKCcuanMtcmFuZ2UtdG8nKS5kYXRlcGlja2VyKHRvSXRlbU9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgZGF0ZUZyb20ub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZGF0ZVRvLmRhdGVwaWNrZXIoJ29wdGlvbicsICdtaW5EYXRlJywgZ2V0RGF0ZSh0aGlzKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZGF0ZVRvLnByb3AoJ3JlcXVpcmVkJywgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ3BhcnNsZXktZXJyb3InKSAmJiAkKHRoaXMpLnBhcnNsZXkoKS5pc1ZhbGlkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcnNsZXkoKS52YWxpZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGRhdGVUby5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlRnJvbS5kYXRlcGlja2VyKCdvcHRpb24nLCAnbWF4RGF0ZScsIGdldERhdGUodGhpcykpO1xyXG5cclxuICAgICAgICAgICAgICAgIGRhdGVGcm9tLnByb3AoJ3JlcXVpcmVkJywgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ3BhcnNsZXktZXJyb3InKSAmJiAkKHRoaXMpLnBhcnNsZXkoKS5pc1ZhbGlkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcnNsZXkoKS52YWxpZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0RGF0ZShlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGxldCBkYXRlO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGRhdGUgPSAkLmRhdGVwaWNrZXIucGFyc2VEYXRlKGRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucy5kYXRlRm9ybWF0LCBlbGVtZW50LnZhbHVlKTtcclxuICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgZGF0ZSA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkYXRlO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbGV0IGRhdGVwaWNrZXJSYW5nZSA9IG5ldyBEYXRlcGlja2VyUmFuZ2UoKTtcclxuICAgIC8qKlxyXG4gICAgICog0KDQtdCw0LvQuNC30YPQtdGCINC/0LXRgNC10LrQu9GO0YfQtdC90LjQtSDRgtCw0LHQvtCyXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIDx1bCBjbGFzcz1cInRhYnMganMtdGFic1wiPlxyXG4gICAgICogICAgIDxsaSBjbGFzcz1cInRhYnNfX2l0ZW1cIj5cclxuICAgICAqICAgICAgICAgPHNwYW4gY2xhc3M9XCJpcy1hY3RpdmUgdGFic19fbGluayBqcy10YWItbGlua1wiPlRhYiBuYW1lPC9zcGFuPlxyXG4gICAgICogICAgICAgICA8ZGl2IGNsYXNzPVwidGFic19fY250XCI+XHJcbiAgICAgKiAgICAgICAgICAgICA8cD5UYWIgY29udGVudDwvcD5cclxuICAgICAqICAgICAgICAgPC9kaXY+XHJcbiAgICAgKiAgICAgPC9saT5cclxuICAgICAqIDwvdWw+XHJcbiAgICAgKi9cclxuICAgIGxldCBUYWJTd2l0Y2hlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGNvbnN0IHRhYnMgPSAkKCcuanMtdGFicycpO1xyXG5cclxuICAgICAgICB0YWJzLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuZmluZCgnLmpzLXRhYi1saW5rLmlzLWFjdGl2ZScpLm5leHQoKS5hZGRDbGFzcygnaXMtb3BlbicpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0YWJzLm9uKCdjbGljaycsICcuanMtdGFiLWxpbmsnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICBzZWxmLm9wZW4oJCh0aGlzKSwgZXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgLy8gcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQntGC0LrRgNGL0LLQsNC10YIg0YLQsNCxINC/0L4g0LrQu9C40LrRgyDQvdCwINC60LDQutC+0Lkt0YLQviDQtNGA0YPQs9C+0Lkg0Y3Qu9C10LzQtdC90YJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgICogPHNwYW4gZGF0YS10YWItb3Blbj1cIiN0YWItbG9naW5cIj5PcGVuIGxvZ2luIHRhYjwvc3Bhbj5cclxuICAgICAgICAgKi9cclxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnW2RhdGEtdGFiLW9wZW5dJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgY29uc3QgdGFiRWxlbSA9ICQodGhpcykuZGF0YSgndGFiLW9wZW4nKTtcclxuICAgICAgICAgICAgc2VsZi5vcGVuKCQodGFiRWxlbSksIGV2ZW50KTtcclxuXHJcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmRhdGEoJ3BvcHVwJykgPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0J7RgtC60YDRi9Cy0LDQtdGCINGC0LDQsVxyXG4gICAgICAgICAqIEBwYXJhbSAge0VsZW1lbnR9IGVsZW0g0Y3Qu9C10LzQtdC90YIgLmpzLXRhYi1saW5rLCDQvdCwINC60L7RgtC+0YDRi9C5INC90YPQttC90L4g0L/QtdGA0LXQutC70Y7Rh9C40YLRjFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAgKiAvLyDQstGL0LfQvtCyINC80LXRgtC+0LTQsCBvcGVuLCDQvtGC0LrRgNC+0LXRgiDRgtCw0LFcclxuICAgICAgICAgKiB0YWJTd2l0Y2hlci5vcGVuKCQoJyNzb21lLXRhYicpKTtcclxuICAgICAgICAgKi9cclxuICAgICAgICBzZWxmLm9wZW4gPSBmdW5jdGlvbihlbGVtLCBldmVudCkge1xyXG4gICAgICAgICAgICBpZiAoIWVsZW0uaGFzQ2xhc3MoJ2lzLWFjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhcmVudFRhYnMgPSBlbGVtLmNsb3Nlc3QodGFicyk7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRUYWJzLmZpbmQoJy5pcy1vcGVuJykucmVtb3ZlQ2xhc3MoJ2lzLW9wZW4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICBlbGVtLm5leHQoKS50b2dnbGVDbGFzcygnaXMtb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgcGFyZW50VGFicy5maW5kKCcuaXMtYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgZWxlbS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgbGV0IHRhYlN3aXRjaGVyID0gbmV3IFRhYlN3aXRjaGVyKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC60YDRi9Cy0LDQtdGCINGN0LvQtdC80LXQvdGCIGhpZGRlbkVsZW0g0L/RgNC4INC60LvQuNC60LUg0LfQsCDQv9GA0LXQtNC10LvQsNC80Lgg0Y3Qu9C10LzQtdC90YLQsCB0YXJnZXRFbGVtXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7RWxlbWVudH0gICB0YXJnZXRFbGVtXHJcbiAgICAgKiBAcGFyYW0gIHtFbGVtZW50fSAgIGhpZGRlbkVsZW1cclxuICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgW29wdGlvbmFsQ2JdINC+0YLRgNCw0LHQsNGC0YvQstCw0LXRgiDRgdGA0LDQt9GDINC90LUg0LTQvtC20LjQtNCw0Y/RgdGMINC30LDQstC10YDRiNC10L3QuNGPINCw0L3QuNC80LDRhtC40LhcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gb25PdXRzaWRlQ2xpY2tIaWRlKHRhcmdldEVsZW0sIGhpZGRlbkVsZW0sIG9wdGlvbmFsQ2IpIHtcclxuICAgICAgICAkKGRvY3VtZW50KS5iaW5kKCdtb3VzZXVwIHRvdWNoZW5kJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBpZiAoIXRhcmdldEVsZW0uaXMoZS50YXJnZXQpICYmICQoZS50YXJnZXQpLmNsb3Nlc3QodGFyZ2V0RWxlbSkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIGhpZGRlbkVsZW0uc3RvcCh0cnVlLCB0cnVlKS5mYWRlT3V0KGdsb2JhbE9wdGlvbnMudGltZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9uYWxDYikge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbmFsQ2IoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KXRjdC70L/QtdGAINC00LvRjyDQv9C+0LrQsNC30LAsINGB0LrRgNGL0YLQuNGPINC40LvQuCDRh9C10YDQtdC00L7QstCw0L3QuNGPINCy0LjQtNC40LzQvtGB0YLQuCDRjdC70LXQvNC10L3RgtC+0LJcclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS12aXNpYmlsaXR5PVwic2hvd1wiIGRhdGEtc2hvdz1cIiNlbGVtSWQxXCI+PC9idXR0b24+XHJcbiAgICAgKlxyXG4gICAgICog0LjQu9C4XHJcbiAgICAgKiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXZpc2liaWxpdHk9XCJoaWRlXCIgZGF0YS1oaWRlPVwiI2VsZW1JZDJcIj48L2J1dHRvbj5cclxuICAgICAqXHJcbiAgICAgKiDQuNC70LhcclxuICAgICAqIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtdmlzaWJpbGl0eT1cInRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiI2VsZW1JZDNcIj48L2J1dHRvbj5cclxuICAgICAqXHJcbiAgICAgKiDQuNC70LhcclxuICAgICAqIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtdmlzaWJpbGl0eT1cInNob3dcIiBkYXRhLXNob3c9XCIjZWxlbUlkMXwjZWxlbUlkM1wiPjwvYnV0dG9uPlxyXG4gICAgICpcclxuICAgICAqINC40LvQuFxyXG4gICAgICogLy8g0LXRgdC70Lgg0LXRgdGC0Ywg0LDRgtGA0LjQsdGD0YIgZGF0YS1xdWV1ZT1cInNob3dcIiwg0YLQviDQsdGD0LTQtdGCINGB0L3QsNGH0LDQu9CwINGB0LrRgNGL0YIg0Y3Qu9C10LzQtdC90YIgI2VsZW1JZDIsINCwINC/0L7RgtC+0Lwg0L/QvtC60LDQt9Cw0L0gI2VsZW1JZDFcclxuICAgICAqIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtdmlzaWJpbGl0eT1cInNob3dcIiBkYXRhLXNob3c9XCIjZWxlbUlkMVwiIGRhdGEtdmlzaWJpbGl0eT1cImhpZGVcIiBkYXRhLWhpZGU9XCIjZWxlbUlkMlwiIGRhdGEtcXVldWU9XCJzaG93XCI+PC9idXR0b24+XHJcbiAgICAgKlxyXG4gICAgICogPGRpdiBpZD1cImVsZW1JZDFcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+VGV4dDwvZGl2PlxyXG4gICAgICogPGRpdiBpZD1cImVsZW1JZDJcIj5UZXh0PC9kaXY+XHJcbiAgICAgKiA8ZGl2IGlkPVwiZWxlbUlkM1wiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj5UZXh0PC9kaXY+XHJcbiAgICAgKi9cclxuICAgIGxldCB2aXNpYmlsaXR5Q29udHJvbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBzZXR0aW5ncyA9IHtcclxuICAgICAgICAgICAgdHlwZXM6IFtcclxuICAgICAgICAgICAgICAgICdzaG93JyxcclxuICAgICAgICAgICAgICAgICdoaWRlJyxcclxuICAgICAgICAgICAgICAgICd0b2dnbGUnXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoJCgnW2RhdGEtdmlzaWJpbGl0eV0nKS5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnW2RhdGEtdmlzaWJpbGl0eV0nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGxldCBkYXRhVHlwZTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2V0dGluZ3MudHlwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZSA9IHNldHRpbmdzLnR5cGVzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5kYXRhKGRhdGFUeXBlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmlzaWJpbGl0eUxpc3QgPSAkKHRoaXMpLmRhdGEoZGF0YVR5cGUpLnNwbGl0KCd8JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxheSA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5kYXRhKCdxdWV1ZScpID09ICdzaG93Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsYXkgPSBnbG9iYWxPcHRpb25zLnRpbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxheSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VmlzaWJpbGl0eShkYXRhVHlwZSwgdmlzaWJpbGl0eUxpc3QsIGRlbGF5KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCEkKHRoaXMpLmhhc0NsYXNzKCd0YWJzX19saW5rJykgJiYgJCh0aGlzKS5hdHRyKCd0eXBlJykgIT0gJ3JhZGlvJyAmJiAkKHRoaXMpLmF0dHIoJ3R5cGUnKSAhPSAnY2hlY2tib3gnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiDQo9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDQstC40LTQuNC80L7RgdGC0YxcclxuICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9ICB2aXNpYmlsaXR5VHlwZSDRgtC40L8g0L7RgtC+0LHRgNCw0LbQtdC90LjRj1xyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSAgIGxpc3Qg0LzQsNGB0YHQuNCyINGN0LvQtdC80LXQvdGC0L7Qsiwg0YEg0LrQvtGC0L7RgNGL0Lwg0YDQsNCx0L7RgtCw0LXQvFxyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gIGRlbGF5INC30LDQtNC10YDQttC60LAg0L/RgNC4INC/0L7QutCw0LfQtSDRjdC70LXQvNC10L3RgtCwINCyIG1zXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBzZXRWaXNpYmlsaXR5KHZpc2liaWxpdHlUeXBlLCBsaXN0LCBkZWxheSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZpc2liaWxpdHlUeXBlID09IHNldHRpbmdzLnR5cGVzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQobGlzdFtpXSkuZGVsYXkoZGVsYXkpLmZhZGVJbihnbG9iYWxPcHRpb25zLnRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZpc2liaWxpdHlUeXBlID09IHNldHRpbmdzLnR5cGVzWzFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQobGlzdFtpXSkuZmFkZU91dChnbG9iYWxPcHRpb25zLnRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZpc2liaWxpdHlUeXBlID09IHNldHRpbmdzLnR5cGVzWzJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKGxpc3RbaV0pLmlzKCc6dmlzaWJsZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGxpc3RbaV0pLmZhZGVPdXQoZ2xvYmFsT3B0aW9ucy50aW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQobGlzdFtpXSkuZmFkZUluKGdsb2JhbE9wdGlvbnMudGltZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB2aXNpYmlsaXR5Q29udHJvbCgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQtdC70LDQtdGCINGB0LvQsNC50LTQtdGAXHJcbiAgICAgKiBAc2VlICBodHRwOi8vYXBpLmpxdWVyeXVpLmNvbS9zbGlkZXIvXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIC8vINCyIGRhdGEtbWluINC4IGRhdGEtbWF4INC30LDQtNCw0Y7RgtGB0Y8g0LzQuNC90LjQvNCw0LvRjNC90L7QtSDQuCDQvNCw0LrRgdC40LzQsNC70YzQvdC+0LUg0LfQvdCw0YfQtdC90LjQtVxyXG4gICAgICogLy8g0LIgZGF0YS1zdGVwINGI0LDQsyxcclxuICAgICAqIC8vINCyIGRhdGEtdmFsdWVzINC00LXRhNC+0LvRgtC90YvQtSDQt9C90LDRh9C10L3QuNGPIFwibWluLCBtYXhcIlxyXG4gICAgICogPGRpdiBjbGFzcz1cInNsaWRlciBqcy1yYW5nZVwiPlxyXG4gICAgICogICAgICA8ZGl2IGNsYXNzPVwic2xpZGVyX19yYW5nZVwiIGRhdGEtbWluPVwiMFwiIGRhdGEtbWF4PVwiMTAwXCIgZGF0YS1zdGVwPVwiMVwiIGRhdGEtdmFsdWVzPVwiMTAsIDU1XCI+PC9kaXY+XHJcbiAgICAgKiA8L2Rpdj5cclxuICAgICAqL1xyXG4gICAgbGV0IFNsaWRlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IHNsaWRlciA9ICQoJy5qcy1yYW5nZScpO1xyXG4gICAgICAgIGxldCBtaW4sXHJcbiAgICAgICAgICAgIG1heCxcclxuICAgICAgICAgICAgc3RlcCxcclxuICAgICAgICAgICAgdmFsdWVzO1xyXG5cclxuICAgICAgICBzbGlkZXIuZWFjaChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzZWxmID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICAgIHJhbmdlID0gc2VsZi5maW5kKCcuc2xpZGVyX19yYW5nZScpO1xyXG5cclxuICAgICAgICAgICAgbWluID0gcmFuZ2UuZGF0YSgnbWluJyk7XHJcbiAgICAgICAgICAgIG1heCA9IHJhbmdlLmRhdGEoJ21heCcpO1xyXG4gICAgICAgICAgICBzdGVwID0gcmFuZ2UuZGF0YSgnc3RlcCcpO1xyXG4gICAgICAgICAgICB2YWx1ZXMgPSByYW5nZS5kYXRhKCd2YWx1ZXMnKS5zcGxpdCgnLCAnKTtcclxuXHJcbiAgICAgICAgICAgIHJhbmdlLnNsaWRlcih7XHJcbiAgICAgICAgICAgICAgICByYW5nZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1pbjogbWluIHx8IG51bGwsXHJcbiAgICAgICAgICAgICAgICBtYXg6IG1heCB8fCBudWxsLFxyXG4gICAgICAgICAgICAgICAgc3RlcDogc3RlcCB8fCAxLFxyXG4gICAgICAgICAgICAgICAgdmFsdWVzOiB2YWx1ZXMsXHJcbiAgICAgICAgICAgICAgICBzbGlkZTogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5maW5kKCcudWktc2xpZGVyLWhhbmRsZScpLmNoaWxkcmVuKCdzcGFuJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5maW5kKCcudWktc2xpZGVyLWhhbmRsZTpudGgtY2hpbGQoMiknKS5hcHBlbmQoYDxzcGFuPiR7dWkudmFsdWVzWzBdfTwvc3Bhbj5gKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmZpbmQoJy51aS1zbGlkZXItaGFuZGxlOm50aC1jaGlsZCgzKScpLmFwcGVuZChgPHNwYW4+JHt1aS52YWx1ZXNbMV19PC9zcGFuPmApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuZmluZCgnLnVpLXNsaWRlci1oYW5kbGU6bnRoLWNoaWxkKDIpJykuYXBwZW5kKGA8c3Bhbj4ke3JhbmdlLnNsaWRlcigndmFsdWVzJywgMCl9PC9zcGFuPmApO1xyXG4gICAgICAgICAgICBzZWxmLmZpbmQoJy51aS1zbGlkZXItaGFuZGxlOm50aC1jaGlsZCgzKScpLmFwcGVuZChgPHNwYW4+JHtyYW5nZS5zbGlkZXIoJ3ZhbHVlcycsIDEpfTwvc3Bhbj5gKTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGxldCBzbGlkZXIgPSBuZXcgU2xpZGVyKCk7XHJcblxyXG4gICAgd2luZG93Lm9ubG9hZD1mdW5jdGlvbigpe1xyXG4gICAgICAgIGxldCBQZXJzb25zPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGVhbV9wZXJzb25zX3Bob3RvJyk7XHJcbiAgICAgICAgUGVyc29ucy5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIFBlcnNvbnMuZm9yRWFjaChub2RlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBub2RlLnN0eWxlLndpZHRoPScxMyUnO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnQ9ZWxlbWVudC50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50LnN0eWxlLndpZHRoPVwiMTglXCI7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Lm5leHRFbGVtZW50U2libGluZy5zdHlsZS53aWR0aD1cIjE2JVwiO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLnN0eWxlLndpZHRoPVwiMTYlXCI7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Lm5leHRFbGVtZW50U2libGluZy5uZXh0RWxlbWVudFNpYmxpbmcuc3R5bGUud2lkdGg9XCIxNCVcIjtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQucHJldmlvdXNFbGVtZW50U2libGluZy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLnN0eWxlLndpZHRoPVwiMTQlXCI7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgJChcIi5tb2RhbF9kaWFsb2dfY29udGVudF9pdGVtXCIpLm5vdChcIjpmaXJzdFwiKS5oaWRlKCk7XHJcbiAgICAkKFwiLm1vZGFsX2RpYWxvZ19jb250ZW50IC5tb2RhbF9idXR0b25cIikuY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICBcdCQoXCIubW9kYWxfZGlhbG9nX2NvbnRlbnQgLm1vZGFsX2J1dHRvblwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKS5lcSgkKHRoaXMpLmluZGV4KCkpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgXHQkKFwiLm1vZGFsX2RpYWxvZ19jb250ZW50X2l0ZW1cIikuaGlkZSgpLmVxKCQodGhpcykuaW5kZXgoKSkuZmFkZUluKClcclxuICAgIH0pLmVxKDApLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgY29uc3QgbW9kYWxDYWxsID0gJChcIltkYXRhLW1vZGFsXVwiKTtcclxuICAgIGNvbnN0IG1vZGFsQ2xvc2UgPSAkKFwiW2RhdGEtY2xvc2VdXCIpO1xyXG5cclxuICAgIG1vZGFsQ2FsbC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgbGV0ICR0aGlzID0gJCh0aGlzKTtcclxuICAgICAgICBsZXQgbW9kYWxJZCA9ICR0aGlzLmRhdGEoJ21vZGFsJyk7XHJcblxyXG4gICAgICAgICQobW9kYWxJZCkuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuICAgICAgICAkKFwiYm9keVwiKS5hZGRDbGFzcygnbm8tc2Nyb2xsJylcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJChtb2RhbElkKS5maW5kKFwiLmxvY2F0aW9uXCIpLmNzcyh7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IFwic2NhbGUoMSlcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LCAxMDApO1xyXG5cclxuICAgIFxyXG5cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBtb2RhbENsb3NlLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBsZXQgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgICAgIGxldCBtb2RhbFBhcmVudCA9ICR0aGlzLnBhcmVudHMoJy5tb2RhbCcpO1xyXG5cclxuICAgICAgICBtb2RhbFBhcmVudC5maW5kKFwiLmxvY2F0aW9uXCIpLmNzcyh7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogXCJzY2FsZSgwKVwiXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIG1vZGFsUGFyZW50LnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKCduby1zY3JvbGwnKTtcclxuICAgICAgICB9LCAxMDApO1xyXG5cclxuICAgIFxyXG5cclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIubW9kYWxcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIGxldCAkdGhpcyA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgICR0aGlzLmZpbmQoXCIubG9jYXRpb25cIikuY3NzKHtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiBcInNjYWxlKDApXCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJHRoaXMucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuICAgICAgICAgICAgJChcImJvZHlcIikucmVtb3ZlQ2xhc3MoJ25vLXNjcm9sbCcpO1xyXG4gICAgICAgIH0sIDIwMCk7XHJcbiBcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIubG9jYXRpb25cIikub24oXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSk7XHJcbiAgICBsZXQgZG9jPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY29udHInKTtcclxuICAgIGRvYy5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICBkb2MuZm9yRWFjaChub2RlID0+IHtcclxuICAgICAgICAgICAgICAgIG5vZGUuc3R5bGUud2lkdGg9JzIyM3B4JztcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgY3VycmVudD1lbGVtZW50LnRhcmdldDtcclxuICAgICAgICAgICAgY3VycmVudC5zdHlsZS53aWR0aD1cIjI4NHB4XCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgfSlcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICAkKCdhW2hyZWZePVwiI1wiXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgLy8g0L7RgtC80LXQvdGP0LXQvCDRgdGC0LDQvdC00LDRgNGC0L3QvtC1INC00LXQudGB0YLQstC40LVcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgXHJcbiAgICAgICAgdmFyIHNjID0gJCh0aGlzKS5hdHRyKFwiaHJlZlwiKSxcclxuICAgICAgICAgICAgZG4gPSAkKHNjKS5vZmZzZXQoKS50b3A7XHJcbiAgICAgICAgLypcclxuICAgICAgICAqIHNjIC0g0LIg0L/QtdGA0LXQvNC10L3QvdGD0Y4g0LfQsNC90L7RgdC40Lwg0LjQvdGE0L7RgNC80LDRhtC40Y4g0L4g0YLQvtC8LCDQuiDQutCw0LrQvtC80YMg0LHQu9C+0LrRgyDQvdCw0LTQviDQv9C10YDQtdC50YLQuFxyXG4gICAgICAgICogZG4gLSDQvtC/0YDQtdC00LXQu9GP0LXQvCDQv9C+0LvQvtC20LXQvdC40LUg0LHQu9C+0LrQsCDQvdCwINGB0YLRgNCw0L3QuNGG0LVcclxuICAgICAgICAqL1xyXG4gICAgXHJcbiAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe3Njcm9sbFRvcDogZG59LCAxMDAwKTtcclxuICAgIFxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgKiAxMDAwINGB0LrQvtGA0L7RgdGC0Ywg0L/QtdGA0LXRhdC+0LTQsCDQsiDQvNC40LvQu9C40YHQtdC60YPQvdC00LDRhVxyXG4gICAgICAgICovXHJcbiAgICB9KTtcclxuXHJcbiAgICAvKndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHdpbmRvdy5Ob2RlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXNlc19jb250ZW50X2l0ZW0nKTtcclxuICAgICAgICBsZXQgaSA9IC0xO1xyXG4gICAgICAgIGxldCBjb3VudCA9IDA7XHJcbiAgICAgICAgbGV0IGZsYWcgPSBmYWxzZTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cuc2Nyb2xsWSA+IE5vZGVzWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnkpIHtcclxuICAgICAgICAgICAgICAgIGZsYWcgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAge1xyXG4gICAgICAgICAgICBwYXNzaXZlOiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZmxhZyA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc2Nyb2xsJyArIHdpbmRvdy5zY3JvbGxZKTtcclxuICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjb3VudCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY291bnQgPiAxMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpIDwgTm9kZXMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE5vZGVzW2ldLnNjcm9sbEludG9WaWV3KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlaGF2aW9yOiAnc21vb3RoJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGFnPWZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBwYXNzaXZlOiBmYWxzZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgKi9cclxuICAgIC8vICQoXCIuY2FzZXNfc2lkZWJhcl9saXN0X2l0ZW1cIikuY2xpY2soZnVuY3Rpb24oZSkge1xyXG4gICAgLy8gICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIC8vICAgICAkKFwiLmNhc2VzX3NpZGViYXJfbGlzdF9pdGVtXCIpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgIC8vICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgIC8vIH0pO1xyXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICAgICAgICAkKFwiLmludHJvX2Nhc2VzXCIpLmhpZGUoKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAkKFwiI29wXCIpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgLy8gJChcIi5pbnRyb19pdGVtc1wiKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgLy8gJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgICAgIC8vICQoXCIuaW50cm9faXRlbXNcIikuYWRkQ2xhc3MoJ2Rpc3BsYXlfbm9uZScpO1xyXG4gICAgICAgICQoXCIuaW50cm9faXRlbXNcIikuaGlkZSgpO1xyXG4gICAgICAgICQoXCIuaW50cm9fY2FzZXNcIikuc2hvdygnc3BlZWQnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcbiAgICAvLyBcdCQoXCIjb3BcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuICAgIC8vIFx0XHQkKFwiLmludHJvX2l0ZW1zXCIpLnRvZ2dsZUNsYXNzKFwiZGlzcGxheV9ub25lXCIpOyByZXR1cm4gZmFsc2U7XHJcbiAgICAvLyBcdH0pO1xyXG4gICAgLy8gfSk7XHJcblxyXG5cclxuICAgIC8vICQoXCIjYnRuLWRyb3BcIikuY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICAvLyAgICAgaWYgKGZsYWdbJ2Ryb3AnXSA9ICFmbGFnWydkcm9wJ10pIHtcclxuICAgIC8vICAgICAgICAgJChcIiN0ZXN0LWRyb3BcIikuaGlkZShcImRyb3BcIiwgeyBkaXJlY3Rpb246IFwicmlnaHRcIiB9LCAxMDAwKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyAgICAgZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICQoXCIjdGVzdC1kcm9wXCIpLnNob3coXCJkcm9wXCIsIHsgZGlyZWN0aW9uOiBcImRvd25cIiB9LCA1MDApO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH0pO1xyXG4gICAgLyoqXHJcbiAgICAgKiDQpNC40LrRgdC40YDQvtCy0LDQvdC90YvQuSDRhdC10LTQtdGAXHJcbiAgICAgKi9cclxuXHJcbiAgICAvLyAkKHdpbmRvdykub24oJ3Njcm9sbCcsIHRvZ2dsZUZpeGVkSGVhZGVyKTtcclxuXHJcbiAgICAvLyBmdW5jdGlvbiB0b2dnbGVGaXhlZEhlYWRlcigpIHtcclxuICAgIC8vICAgICBjb25zdCAkaGVhZGVyID0gJCgnLmhlYWRlcicpO1xyXG4gICAgLy8gICAgIGNvbnN0ICRtYWluID0gJCgnLmhlYWRlcicpLm5leHQoKTtcclxuXHJcbiAgICAvLyAgICAgaWYgKHdpbmRvdy5wYWdlWU9mZnNldCA+IDApIHtcclxuICAgIC8vICAgICAgICAgJGhlYWRlci5hZGRDbGFzcygnaXMtZml4ZWQnKTtcclxuICAgIC8vICAgICAgICAgJG1haW4uY3NzKHsgbWFyZ2luVG9wOiAkaGVhZGVyLm91dGVySGVpZ2h0KCkgfSk7XHJcbiAgICAvLyAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgJGhlYWRlci5yZW1vdmVDbGFzcygnaXMtZml4ZWQnKTtcclxuICAgIC8vICAgICAgICAgJG1haW4uY3NzKHsgbWFyZ2luVG9wOiAwIH0pO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH1cclxuXHJcbiAgICAhZnVuY3Rpb24oaSl7XCJ1c2Ugc3RyaWN0XCI7XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJqcXVlcnlcIl0saSk6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9aShyZXF1aXJlKFwianF1ZXJ5XCIpKTppKGpRdWVyeSl9KGZ1bmN0aW9uKGkpe1widXNlIHN0cmljdFwiO3ZhciBlPXdpbmRvdy5TbGlja3x8e307KGU9ZnVuY3Rpb24oKXt2YXIgZT0wO3JldHVybiBmdW5jdGlvbih0LG8pe3ZhciBzLG49dGhpcztuLmRlZmF1bHRzPXthY2Nlc3NpYmlsaXR5OiEwLGFkYXB0aXZlSGVpZ2h0OiExLGFwcGVuZEFycm93czppKHQpLGFwcGVuZERvdHM6aSh0KSxhcnJvd3M6ITAsYXNOYXZGb3I6bnVsbCxwcmV2QXJyb3c6JzxidXR0b24gY2xhc3M9XCJzbGljay1wcmV2XCIgYXJpYS1sYWJlbD1cIlByZXZpb3VzXCIgdHlwZT1cImJ1dHRvblwiPlByZXZpb3VzPC9idXR0b24+JyxuZXh0QXJyb3c6JzxidXR0b24gY2xhc3M9XCJzbGljay1uZXh0XCIgYXJpYS1sYWJlbD1cIk5leHRcIiB0eXBlPVwiYnV0dG9uXCI+TmV4dDwvYnV0dG9uPicsYXV0b3BsYXk6ITEsYXV0b3BsYXlTcGVlZDozZTMsY2VudGVyTW9kZTohMSxjZW50ZXJQYWRkaW5nOlwiNTBweFwiLGNzc0Vhc2U6XCJlYXNlXCIsY3VzdG9tUGFnaW5nOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIGkoJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIC8+JykudGV4dCh0KzEpfSxkb3RzOiExLGRvdHNDbGFzczpcInNsaWNrLWRvdHNcIixkcmFnZ2FibGU6ITAsZWFzaW5nOlwibGluZWFyXCIsZWRnZUZyaWN0aW9uOi4zNSxmYWRlOiExLGZvY3VzT25TZWxlY3Q6ITEsZm9jdXNPbkNoYW5nZTohMSxpbmZpbml0ZTohMCxpbml0aWFsU2xpZGU6MCxsYXp5TG9hZDpcIm9uZGVtYW5kXCIsbW9iaWxlRmlyc3Q6ITEscGF1c2VPbkhvdmVyOiEwLHBhdXNlT25Gb2N1czohMCxwYXVzZU9uRG90c0hvdmVyOiExLHJlc3BvbmRUbzpcIndpbmRvd1wiLHJlc3BvbnNpdmU6bnVsbCxyb3dzOjEscnRsOiExLHNsaWRlOlwiXCIsc2xpZGVzUGVyUm93OjEsc2xpZGVzVG9TaG93OjEsc2xpZGVzVG9TY3JvbGw6MSxzcGVlZDo1MDAsc3dpcGU6ITAsc3dpcGVUb1NsaWRlOiExLHRvdWNoTW92ZTohMCx0b3VjaFRocmVzaG9sZDo1LHVzZUNTUzohMCx1c2VUcmFuc2Zvcm06ITAsdmFyaWFibGVXaWR0aDohMSx2ZXJ0aWNhbDohMSx2ZXJ0aWNhbFN3aXBpbmc6ITEsd2FpdEZvckFuaW1hdGU6ITAsekluZGV4OjFlM30sbi5pbml0aWFscz17YW5pbWF0aW5nOiExLGRyYWdnaW5nOiExLGF1dG9QbGF5VGltZXI6bnVsbCxjdXJyZW50RGlyZWN0aW9uOjAsY3VycmVudExlZnQ6bnVsbCxjdXJyZW50U2xpZGU6MCxkaXJlY3Rpb246MSwkZG90czpudWxsLGxpc3RXaWR0aDpudWxsLGxpc3RIZWlnaHQ6bnVsbCxsb2FkSW5kZXg6MCwkbmV4dEFycm93Om51bGwsJHByZXZBcnJvdzpudWxsLHNjcm9sbGluZzohMSxzbGlkZUNvdW50Om51bGwsc2xpZGVXaWR0aDpudWxsLCRzbGlkZVRyYWNrOm51bGwsJHNsaWRlczpudWxsLHNsaWRpbmc6ITEsc2xpZGVPZmZzZXQ6MCxzd2lwZUxlZnQ6bnVsbCxzd2lwaW5nOiExLCRsaXN0Om51bGwsdG91Y2hPYmplY3Q6e30sdHJhbnNmb3Jtc0VuYWJsZWQ6ITEsdW5zbGlja2VkOiExfSxpLmV4dGVuZChuLG4uaW5pdGlhbHMpLG4uYWN0aXZlQnJlYWtwb2ludD1udWxsLG4uYW5pbVR5cGU9bnVsbCxuLmFuaW1Qcm9wPW51bGwsbi5icmVha3BvaW50cz1bXSxuLmJyZWFrcG9pbnRTZXR0aW5ncz1bXSxuLmNzc1RyYW5zaXRpb25zPSExLG4uZm9jdXNzZWQ9ITEsbi5pbnRlcnJ1cHRlZD0hMSxuLmhpZGRlbj1cImhpZGRlblwiLG4ucGF1c2VkPSEwLG4ucG9zaXRpb25Qcm9wPW51bGwsbi5yZXNwb25kVG89bnVsbCxuLnJvd0NvdW50PTEsbi5zaG91bGRDbGljaz0hMCxuLiRzbGlkZXI9aSh0KSxuLiRzbGlkZXNDYWNoZT1udWxsLG4udHJhbnNmb3JtVHlwZT1udWxsLG4udHJhbnNpdGlvblR5cGU9bnVsbCxuLnZpc2liaWxpdHlDaGFuZ2U9XCJ2aXNpYmlsaXR5Y2hhbmdlXCIsbi53aW5kb3dXaWR0aD0wLG4ud2luZG93VGltZXI9bnVsbCxzPWkodCkuZGF0YShcInNsaWNrXCIpfHx7fSxuLm9wdGlvbnM9aS5leHRlbmQoe30sbi5kZWZhdWx0cyxvLHMpLG4uY3VycmVudFNsaWRlPW4ub3B0aW9ucy5pbml0aWFsU2xpZGUsbi5vcmlnaW5hbFNldHRpbmdzPW4ub3B0aW9ucyx2b2lkIDAhPT1kb2N1bWVudC5tb3pIaWRkZW4/KG4uaGlkZGVuPVwibW96SGlkZGVuXCIsbi52aXNpYmlsaXR5Q2hhbmdlPVwibW96dmlzaWJpbGl0eWNoYW5nZVwiKTp2b2lkIDAhPT1kb2N1bWVudC53ZWJraXRIaWRkZW4mJihuLmhpZGRlbj1cIndlYmtpdEhpZGRlblwiLG4udmlzaWJpbGl0eUNoYW5nZT1cIndlYmtpdHZpc2liaWxpdHljaGFuZ2VcIiksbi5hdXRvUGxheT1pLnByb3h5KG4uYXV0b1BsYXksbiksbi5hdXRvUGxheUNsZWFyPWkucHJveHkobi5hdXRvUGxheUNsZWFyLG4pLG4uYXV0b1BsYXlJdGVyYXRvcj1pLnByb3h5KG4uYXV0b1BsYXlJdGVyYXRvcixuKSxuLmNoYW5nZVNsaWRlPWkucHJveHkobi5jaGFuZ2VTbGlkZSxuKSxuLmNsaWNrSGFuZGxlcj1pLnByb3h5KG4uY2xpY2tIYW5kbGVyLG4pLG4uc2VsZWN0SGFuZGxlcj1pLnByb3h5KG4uc2VsZWN0SGFuZGxlcixuKSxuLnNldFBvc2l0aW9uPWkucHJveHkobi5zZXRQb3NpdGlvbixuKSxuLnN3aXBlSGFuZGxlcj1pLnByb3h5KG4uc3dpcGVIYW5kbGVyLG4pLG4uZHJhZ0hhbmRsZXI9aS5wcm94eShuLmRyYWdIYW5kbGVyLG4pLG4ua2V5SGFuZGxlcj1pLnByb3h5KG4ua2V5SGFuZGxlcixuKSxuLmluc3RhbmNlVWlkPWUrKyxuLmh0bWxFeHByPS9eKD86XFxzKig8W1xcd1xcV10rPilbXj5dKikkLyxuLnJlZ2lzdGVyQnJlYWtwb2ludHMoKSxuLmluaXQoITApfX0oKSkucHJvdG90eXBlLmFjdGl2YXRlQURBPWZ1bmN0aW9uKCl7dGhpcy4kc2xpZGVUcmFjay5maW5kKFwiLnNsaWNrLWFjdGl2ZVwiKS5hdHRyKHtcImFyaWEtaGlkZGVuXCI6XCJmYWxzZVwifSkuZmluZChcImEsIGlucHV0LCBidXR0b24sIHNlbGVjdFwiKS5hdHRyKHt0YWJpbmRleDpcIjBcIn0pfSxlLnByb3RvdHlwZS5hZGRTbGlkZT1lLnByb3RvdHlwZS5zbGlja0FkZD1mdW5jdGlvbihlLHQsbyl7dmFyIHM9dGhpcztpZihcImJvb2xlYW5cIj09dHlwZW9mIHQpbz10LHQ9bnVsbDtlbHNlIGlmKHQ8MHx8dD49cy5zbGlkZUNvdW50KXJldHVybiExO3MudW5sb2FkKCksXCJudW1iZXJcIj09dHlwZW9mIHQ/MD09PXQmJjA9PT1zLiRzbGlkZXMubGVuZ3RoP2koZSkuYXBwZW5kVG8ocy4kc2xpZGVUcmFjayk6bz9pKGUpLmluc2VydEJlZm9yZShzLiRzbGlkZXMuZXEodCkpOmkoZSkuaW5zZXJ0QWZ0ZXIocy4kc2xpZGVzLmVxKHQpKTohMD09PW8/aShlKS5wcmVwZW5kVG8ocy4kc2xpZGVUcmFjayk6aShlKS5hcHBlbmRUbyhzLiRzbGlkZVRyYWNrKSxzLiRzbGlkZXM9cy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLHMuJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5kZXRhY2goKSxzLiRzbGlkZVRyYWNrLmFwcGVuZChzLiRzbGlkZXMpLHMuJHNsaWRlcy5lYWNoKGZ1bmN0aW9uKGUsdCl7aSh0KS5hdHRyKFwiZGF0YS1zbGljay1pbmRleFwiLGUpfSkscy4kc2xpZGVzQ2FjaGU9cy4kc2xpZGVzLHMucmVpbml0KCl9LGUucHJvdG90eXBlLmFuaW1hdGVIZWlnaHQ9ZnVuY3Rpb24oKXt2YXIgaT10aGlzO2lmKDE9PT1pLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYhMD09PWkub3B0aW9ucy5hZGFwdGl2ZUhlaWdodCYmITE9PT1pLm9wdGlvbnMudmVydGljYWwpe3ZhciBlPWkuJHNsaWRlcy5lcShpLmN1cnJlbnRTbGlkZSkub3V0ZXJIZWlnaHQoITApO2kuJGxpc3QuYW5pbWF0ZSh7aGVpZ2h0OmV9LGkub3B0aW9ucy5zcGVlZCl9fSxlLnByb3RvdHlwZS5hbmltYXRlU2xpZGU9ZnVuY3Rpb24oZSx0KXt2YXIgbz17fSxzPXRoaXM7cy5hbmltYXRlSGVpZ2h0KCksITA9PT1zLm9wdGlvbnMucnRsJiYhMT09PXMub3B0aW9ucy52ZXJ0aWNhbCYmKGU9LWUpLCExPT09cy50cmFuc2Zvcm1zRW5hYmxlZD8hMT09PXMub3B0aW9ucy52ZXJ0aWNhbD9zLiRzbGlkZVRyYWNrLmFuaW1hdGUoe2xlZnQ6ZX0scy5vcHRpb25zLnNwZWVkLHMub3B0aW9ucy5lYXNpbmcsdCk6cy4kc2xpZGVUcmFjay5hbmltYXRlKHt0b3A6ZX0scy5vcHRpb25zLnNwZWVkLHMub3B0aW9ucy5lYXNpbmcsdCk6ITE9PT1zLmNzc1RyYW5zaXRpb25zPyghMD09PXMub3B0aW9ucy5ydGwmJihzLmN1cnJlbnRMZWZ0PS1zLmN1cnJlbnRMZWZ0KSxpKHthbmltU3RhcnQ6cy5jdXJyZW50TGVmdH0pLmFuaW1hdGUoe2FuaW1TdGFydDplfSx7ZHVyYXRpb246cy5vcHRpb25zLnNwZWVkLGVhc2luZzpzLm9wdGlvbnMuZWFzaW5nLHN0ZXA6ZnVuY3Rpb24oaSl7aT1NYXRoLmNlaWwoaSksITE9PT1zLm9wdGlvbnMudmVydGljYWw/KG9bcy5hbmltVHlwZV09XCJ0cmFuc2xhdGUoXCIraStcInB4LCAwcHgpXCIscy4kc2xpZGVUcmFjay5jc3MobykpOihvW3MuYW5pbVR5cGVdPVwidHJhbnNsYXRlKDBweCxcIitpK1wicHgpXCIscy4kc2xpZGVUcmFjay5jc3MobykpfSxjb21wbGV0ZTpmdW5jdGlvbigpe3QmJnQuY2FsbCgpfX0pKToocy5hcHBseVRyYW5zaXRpb24oKSxlPU1hdGguY2VpbChlKSwhMT09PXMub3B0aW9ucy52ZXJ0aWNhbD9vW3MuYW5pbVR5cGVdPVwidHJhbnNsYXRlM2QoXCIrZStcInB4LCAwcHgsIDBweClcIjpvW3MuYW5pbVR5cGVdPVwidHJhbnNsYXRlM2QoMHB4LFwiK2UrXCJweCwgMHB4KVwiLHMuJHNsaWRlVHJhY2suY3NzKG8pLHQmJnNldFRpbWVvdXQoZnVuY3Rpb24oKXtzLmRpc2FibGVUcmFuc2l0aW9uKCksdC5jYWxsKCl9LHMub3B0aW9ucy5zcGVlZCkpfSxlLnByb3RvdHlwZS5nZXROYXZUYXJnZXQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLHQ9ZS5vcHRpb25zLmFzTmF2Rm9yO3JldHVybiB0JiZudWxsIT09dCYmKHQ9aSh0KS5ub3QoZS4kc2xpZGVyKSksdH0sZS5wcm90b3R5cGUuYXNOYXZGb3I9ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcy5nZXROYXZUYXJnZXQoKTtudWxsIT09dCYmXCJvYmplY3RcIj09dHlwZW9mIHQmJnQuZWFjaChmdW5jdGlvbigpe3ZhciB0PWkodGhpcykuc2xpY2soXCJnZXRTbGlja1wiKTt0LnVuc2xpY2tlZHx8dC5zbGlkZUhhbmRsZXIoZSwhMCl9KX0sZS5wcm90b3R5cGUuYXBwbHlUcmFuc2l0aW9uPWZ1bmN0aW9uKGkpe3ZhciBlPXRoaXMsdD17fTshMT09PWUub3B0aW9ucy5mYWRlP3RbZS50cmFuc2l0aW9uVHlwZV09ZS50cmFuc2Zvcm1UeXBlK1wiIFwiK2Uub3B0aW9ucy5zcGVlZCtcIm1zIFwiK2Uub3B0aW9ucy5jc3NFYXNlOnRbZS50cmFuc2l0aW9uVHlwZV09XCJvcGFjaXR5IFwiK2Uub3B0aW9ucy5zcGVlZCtcIm1zIFwiK2Uub3B0aW9ucy5jc3NFYXNlLCExPT09ZS5vcHRpb25zLmZhZGU/ZS4kc2xpZGVUcmFjay5jc3ModCk6ZS4kc2xpZGVzLmVxKGkpLmNzcyh0KX0sZS5wcm90b3R5cGUuYXV0b1BsYXk9ZnVuY3Rpb24oKXt2YXIgaT10aGlzO2kuYXV0b1BsYXlDbGVhcigpLGkuc2xpZGVDb3VudD5pLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYoaS5hdXRvUGxheVRpbWVyPXNldEludGVydmFsKGkuYXV0b1BsYXlJdGVyYXRvcixpLm9wdGlvbnMuYXV0b3BsYXlTcGVlZCkpfSxlLnByb3RvdHlwZS5hdXRvUGxheUNsZWFyPWZ1bmN0aW9uKCl7dmFyIGk9dGhpcztpLmF1dG9QbGF5VGltZXImJmNsZWFySW50ZXJ2YWwoaS5hdXRvUGxheVRpbWVyKX0sZS5wcm90b3R5cGUuYXV0b1BsYXlJdGVyYXRvcj1mdW5jdGlvbigpe3ZhciBpPXRoaXMsZT1pLmN1cnJlbnRTbGlkZStpLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7aS5wYXVzZWR8fGkuaW50ZXJydXB0ZWR8fGkuZm9jdXNzZWR8fCghMT09PWkub3B0aW9ucy5pbmZpbml0ZSYmKDE9PT1pLmRpcmVjdGlvbiYmaS5jdXJyZW50U2xpZGUrMT09PWkuc2xpZGVDb3VudC0xP2kuZGlyZWN0aW9uPTA6MD09PWkuZGlyZWN0aW9uJiYoZT1pLmN1cnJlbnRTbGlkZS1pLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwsaS5jdXJyZW50U2xpZGUtMT09MCYmKGkuZGlyZWN0aW9uPTEpKSksaS5zbGlkZUhhbmRsZXIoZSkpfSxlLnByb3RvdHlwZS5idWlsZEFycm93cz1mdW5jdGlvbigpe3ZhciBlPXRoaXM7ITA9PT1lLm9wdGlvbnMuYXJyb3dzJiYoZS4kcHJldkFycm93PWkoZS5vcHRpb25zLnByZXZBcnJvdykuYWRkQ2xhc3MoXCJzbGljay1hcnJvd1wiKSxlLiRuZXh0QXJyb3c9aShlLm9wdGlvbnMubmV4dEFycm93KS5hZGRDbGFzcyhcInNsaWNrLWFycm93XCIpLGUuc2xpZGVDb3VudD5lLm9wdGlvbnMuc2xpZGVzVG9TaG93PyhlLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoXCJzbGljay1oaWRkZW5cIikucmVtb3ZlQXR0cihcImFyaWEtaGlkZGVuIHRhYmluZGV4XCIpLGUuJG5leHRBcnJvdy5yZW1vdmVDbGFzcyhcInNsaWNrLWhpZGRlblwiKS5yZW1vdmVBdHRyKFwiYXJpYS1oaWRkZW4gdGFiaW5kZXhcIiksZS5odG1sRXhwci50ZXN0KGUub3B0aW9ucy5wcmV2QXJyb3cpJiZlLiRwcmV2QXJyb3cucHJlcGVuZFRvKGUub3B0aW9ucy5hcHBlbmRBcnJvd3MpLGUuaHRtbEV4cHIudGVzdChlLm9wdGlvbnMubmV4dEFycm93KSYmZS4kbmV4dEFycm93LmFwcGVuZFRvKGUub3B0aW9ucy5hcHBlbmRBcnJvd3MpLCEwIT09ZS5vcHRpb25zLmluZmluaXRlJiZlLiRwcmV2QXJyb3cuYWRkQ2xhc3MoXCJzbGljay1kaXNhYmxlZFwiKS5hdHRyKFwiYXJpYS1kaXNhYmxlZFwiLFwidHJ1ZVwiKSk6ZS4kcHJldkFycm93LmFkZChlLiRuZXh0QXJyb3cpLmFkZENsYXNzKFwic2xpY2staGlkZGVuXCIpLmF0dHIoe1wiYXJpYS1kaXNhYmxlZFwiOlwidHJ1ZVwiLHRhYmluZGV4OlwiLTFcIn0pKX0sZS5wcm90b3R5cGUuYnVpbGREb3RzPWZ1bmN0aW9uKCl7dmFyIGUsdCxvPXRoaXM7aWYoITA9PT1vLm9wdGlvbnMuZG90cyl7Zm9yKG8uJHNsaWRlci5hZGRDbGFzcyhcInNsaWNrLWRvdHRlZFwiKSx0PWkoXCI8dWwgLz5cIikuYWRkQ2xhc3Moby5vcHRpb25zLmRvdHNDbGFzcyksZT0wO2U8PW8uZ2V0RG90Q291bnQoKTtlKz0xKXQuYXBwZW5kKGkoXCI8bGkgLz5cIikuYXBwZW5kKG8ub3B0aW9ucy5jdXN0b21QYWdpbmcuY2FsbCh0aGlzLG8sZSkpKTtvLiRkb3RzPXQuYXBwZW5kVG8oby5vcHRpb25zLmFwcGVuZERvdHMpLG8uJGRvdHMuZmluZChcImxpXCIpLmZpcnN0KCkuYWRkQ2xhc3MoXCJzbGljay1hY3RpdmVcIil9fSxlLnByb3RvdHlwZS5idWlsZE91dD1mdW5jdGlvbigpe3ZhciBlPXRoaXM7ZS4kc2xpZGVzPWUuJHNsaWRlci5jaGlsZHJlbihlLm9wdGlvbnMuc2xpZGUrXCI6bm90KC5zbGljay1jbG9uZWQpXCIpLmFkZENsYXNzKFwic2xpY2stc2xpZGVcIiksZS5zbGlkZUNvdW50PWUuJHNsaWRlcy5sZW5ndGgsZS4kc2xpZGVzLmVhY2goZnVuY3Rpb24oZSx0KXtpKHQpLmF0dHIoXCJkYXRhLXNsaWNrLWluZGV4XCIsZSkuZGF0YShcIm9yaWdpbmFsU3R5bGluZ1wiLGkodCkuYXR0cihcInN0eWxlXCIpfHxcIlwiKX0pLGUuJHNsaWRlci5hZGRDbGFzcyhcInNsaWNrLXNsaWRlclwiKSxlLiRzbGlkZVRyYWNrPTA9PT1lLnNsaWRlQ291bnQ/aSgnPGRpdiBjbGFzcz1cInNsaWNrLXRyYWNrXCIvPicpLmFwcGVuZFRvKGUuJHNsaWRlcik6ZS4kc2xpZGVzLndyYXBBbGwoJzxkaXYgY2xhc3M9XCJzbGljay10cmFja1wiLz4nKS5wYXJlbnQoKSxlLiRsaXN0PWUuJHNsaWRlVHJhY2sud3JhcCgnPGRpdiBjbGFzcz1cInNsaWNrLWxpc3RcIi8+JykucGFyZW50KCksZS4kc2xpZGVUcmFjay5jc3MoXCJvcGFjaXR5XCIsMCksITAhPT1lLm9wdGlvbnMuY2VudGVyTW9kZSYmITAhPT1lLm9wdGlvbnMuc3dpcGVUb1NsaWRlfHwoZS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsPTEpLGkoXCJpbWdbZGF0YS1sYXp5XVwiLGUuJHNsaWRlcikubm90KFwiW3NyY11cIikuYWRkQ2xhc3MoXCJzbGljay1sb2FkaW5nXCIpLGUuc2V0dXBJbmZpbml0ZSgpLGUuYnVpbGRBcnJvd3MoKSxlLmJ1aWxkRG90cygpLGUudXBkYXRlRG90cygpLGUuc2V0U2xpZGVDbGFzc2VzKFwibnVtYmVyXCI9PXR5cGVvZiBlLmN1cnJlbnRTbGlkZT9lLmN1cnJlbnRTbGlkZTowKSwhMD09PWUub3B0aW9ucy5kcmFnZ2FibGUmJmUuJGxpc3QuYWRkQ2xhc3MoXCJkcmFnZ2FibGVcIil9LGUucHJvdG90eXBlLmJ1aWxkUm93cz1mdW5jdGlvbigpe3ZhciBpLGUsdCxvLHMsbixyLGw9dGhpcztpZihvPWRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxuPWwuJHNsaWRlci5jaGlsZHJlbigpLGwub3B0aW9ucy5yb3dzPjEpe2ZvcihyPWwub3B0aW9ucy5zbGlkZXNQZXJSb3cqbC5vcHRpb25zLnJvd3Mscz1NYXRoLmNlaWwobi5sZW5ndGgvciksaT0wO2k8cztpKyspe3ZhciBkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7Zm9yKGU9MDtlPGwub3B0aW9ucy5yb3dzO2UrKyl7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtmb3IodD0wO3Q8bC5vcHRpb25zLnNsaWRlc1BlclJvdzt0Kyspe3ZhciBjPWkqcisoZSpsLm9wdGlvbnMuc2xpZGVzUGVyUm93K3QpO24uZ2V0KGMpJiZhLmFwcGVuZENoaWxkKG4uZ2V0KGMpKX1kLmFwcGVuZENoaWxkKGEpfW8uYXBwZW5kQ2hpbGQoZCl9bC4kc2xpZGVyLmVtcHR5KCkuYXBwZW5kKG8pLGwuJHNsaWRlci5jaGlsZHJlbigpLmNoaWxkcmVuKCkuY2hpbGRyZW4oKS5jc3Moe3dpZHRoOjEwMC9sLm9wdGlvbnMuc2xpZGVzUGVyUm93K1wiJVwiLGRpc3BsYXk6XCJpbmxpbmUtYmxvY2tcIn0pfX0sZS5wcm90b3R5cGUuY2hlY2tSZXNwb25zaXZlPWZ1bmN0aW9uKGUsdCl7dmFyIG8scyxuLHI9dGhpcyxsPSExLGQ9ci4kc2xpZGVyLndpZHRoKCksYT13aW5kb3cuaW5uZXJXaWR0aHx8aSh3aW5kb3cpLndpZHRoKCk7aWYoXCJ3aW5kb3dcIj09PXIucmVzcG9uZFRvP249YTpcInNsaWRlclwiPT09ci5yZXNwb25kVG8/bj1kOlwibWluXCI9PT1yLnJlc3BvbmRUbyYmKG49TWF0aC5taW4oYSxkKSksci5vcHRpb25zLnJlc3BvbnNpdmUmJnIub3B0aW9ucy5yZXNwb25zaXZlLmxlbmd0aCYmbnVsbCE9PXIub3B0aW9ucy5yZXNwb25zaXZlKXtzPW51bGw7Zm9yKG8gaW4gci5icmVha3BvaW50cylyLmJyZWFrcG9pbnRzLmhhc093blByb3BlcnR5KG8pJiYoITE9PT1yLm9yaWdpbmFsU2V0dGluZ3MubW9iaWxlRmlyc3Q/bjxyLmJyZWFrcG9pbnRzW29dJiYocz1yLmJyZWFrcG9pbnRzW29dKTpuPnIuYnJlYWtwb2ludHNbb10mJihzPXIuYnJlYWtwb2ludHNbb10pKTtudWxsIT09cz9udWxsIT09ci5hY3RpdmVCcmVha3BvaW50PyhzIT09ci5hY3RpdmVCcmVha3BvaW50fHx0KSYmKHIuYWN0aXZlQnJlYWtwb2ludD1zLFwidW5zbGlja1wiPT09ci5icmVha3BvaW50U2V0dGluZ3Nbc10/ci51bnNsaWNrKHMpOihyLm9wdGlvbnM9aS5leHRlbmQoe30sci5vcmlnaW5hbFNldHRpbmdzLHIuYnJlYWtwb2ludFNldHRpbmdzW3NdKSwhMD09PWUmJihyLmN1cnJlbnRTbGlkZT1yLm9wdGlvbnMuaW5pdGlhbFNsaWRlKSxyLnJlZnJlc2goZSkpLGw9cyk6KHIuYWN0aXZlQnJlYWtwb2ludD1zLFwidW5zbGlja1wiPT09ci5icmVha3BvaW50U2V0dGluZ3Nbc10/ci51bnNsaWNrKHMpOihyLm9wdGlvbnM9aS5leHRlbmQoe30sci5vcmlnaW5hbFNldHRpbmdzLHIuYnJlYWtwb2ludFNldHRpbmdzW3NdKSwhMD09PWUmJihyLmN1cnJlbnRTbGlkZT1yLm9wdGlvbnMuaW5pdGlhbFNsaWRlKSxyLnJlZnJlc2goZSkpLGw9cyk6bnVsbCE9PXIuYWN0aXZlQnJlYWtwb2ludCYmKHIuYWN0aXZlQnJlYWtwb2ludD1udWxsLHIub3B0aW9ucz1yLm9yaWdpbmFsU2V0dGluZ3MsITA9PT1lJiYoci5jdXJyZW50U2xpZGU9ci5vcHRpb25zLmluaXRpYWxTbGlkZSksci5yZWZyZXNoKGUpLGw9cyksZXx8ITE9PT1sfHxyLiRzbGlkZXIudHJpZ2dlcihcImJyZWFrcG9pbnRcIixbcixsXSl9fSxlLnByb3RvdHlwZS5jaGFuZ2VTbGlkZT1mdW5jdGlvbihlLHQpe3ZhciBvLHMsbixyPXRoaXMsbD1pKGUuY3VycmVudFRhcmdldCk7c3dpdGNoKGwuaXMoXCJhXCIpJiZlLnByZXZlbnREZWZhdWx0KCksbC5pcyhcImxpXCIpfHwobD1sLmNsb3Nlc3QoXCJsaVwiKSksbj1yLnNsaWRlQ291bnQlci5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIT0wLG89bj8wOihyLnNsaWRlQ291bnQtci5jdXJyZW50U2xpZGUpJXIub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCxlLmRhdGEubWVzc2FnZSl7Y2FzZVwicHJldmlvdXNcIjpzPTA9PT1vP3Iub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDpyLm9wdGlvbnMuc2xpZGVzVG9TaG93LW8sci5zbGlkZUNvdW50PnIub3B0aW9ucy5zbGlkZXNUb1Nob3cmJnIuc2xpZGVIYW5kbGVyKHIuY3VycmVudFNsaWRlLXMsITEsdCk7YnJlYWs7Y2FzZVwibmV4dFwiOnM9MD09PW8/ci5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsOm8sci5zbGlkZUNvdW50PnIub3B0aW9ucy5zbGlkZXNUb1Nob3cmJnIuc2xpZGVIYW5kbGVyKHIuY3VycmVudFNsaWRlK3MsITEsdCk7YnJlYWs7Y2FzZVwiaW5kZXhcIjp2YXIgZD0wPT09ZS5kYXRhLmluZGV4PzA6ZS5kYXRhLmluZGV4fHxsLmluZGV4KCkqci5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO3Iuc2xpZGVIYW5kbGVyKHIuY2hlY2tOYXZpZ2FibGUoZCksITEsdCksbC5jaGlsZHJlbigpLnRyaWdnZXIoXCJmb2N1c1wiKTticmVhaztkZWZhdWx0OnJldHVybn19LGUucHJvdG90eXBlLmNoZWNrTmF2aWdhYmxlPWZ1bmN0aW9uKGkpe3ZhciBlLHQ7aWYoZT10aGlzLmdldE5hdmlnYWJsZUluZGV4ZXMoKSx0PTAsaT5lW2UubGVuZ3RoLTFdKWk9ZVtlLmxlbmd0aC0xXTtlbHNlIGZvcih2YXIgbyBpbiBlKXtpZihpPGVbb10pe2k9dDticmVha310PWVbb119cmV0dXJuIGl9LGUucHJvdG90eXBlLmNsZWFuVXBFdmVudHM9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2Uub3B0aW9ucy5kb3RzJiZudWxsIT09ZS4kZG90cyYmKGkoXCJsaVwiLGUuJGRvdHMpLm9mZihcImNsaWNrLnNsaWNrXCIsZS5jaGFuZ2VTbGlkZSkub2ZmKFwibW91c2VlbnRlci5zbGlja1wiLGkucHJveHkoZS5pbnRlcnJ1cHQsZSwhMCkpLm9mZihcIm1vdXNlbGVhdmUuc2xpY2tcIixpLnByb3h5KGUuaW50ZXJydXB0LGUsITEpKSwhMD09PWUub3B0aW9ucy5hY2Nlc3NpYmlsaXR5JiZlLiRkb3RzLm9mZihcImtleWRvd24uc2xpY2tcIixlLmtleUhhbmRsZXIpKSxlLiRzbGlkZXIub2ZmKFwiZm9jdXMuc2xpY2sgYmx1ci5zbGlja1wiKSwhMD09PWUub3B0aW9ucy5hcnJvd3MmJmUuc2xpZGVDb3VudD5lLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYoZS4kcHJldkFycm93JiZlLiRwcmV2QXJyb3cub2ZmKFwiY2xpY2suc2xpY2tcIixlLmNoYW5nZVNsaWRlKSxlLiRuZXh0QXJyb3cmJmUuJG5leHRBcnJvdy5vZmYoXCJjbGljay5zbGlja1wiLGUuY2hhbmdlU2xpZGUpLCEwPT09ZS5vcHRpb25zLmFjY2Vzc2liaWxpdHkmJihlLiRwcmV2QXJyb3cmJmUuJHByZXZBcnJvdy5vZmYoXCJrZXlkb3duLnNsaWNrXCIsZS5rZXlIYW5kbGVyKSxlLiRuZXh0QXJyb3cmJmUuJG5leHRBcnJvdy5vZmYoXCJrZXlkb3duLnNsaWNrXCIsZS5rZXlIYW5kbGVyKSkpLGUuJGxpc3Qub2ZmKFwidG91Y2hzdGFydC5zbGljayBtb3VzZWRvd24uc2xpY2tcIixlLnN3aXBlSGFuZGxlciksZS4kbGlzdC5vZmYoXCJ0b3VjaG1vdmUuc2xpY2sgbW91c2Vtb3ZlLnNsaWNrXCIsZS5zd2lwZUhhbmRsZXIpLGUuJGxpc3Qub2ZmKFwidG91Y2hlbmQuc2xpY2sgbW91c2V1cC5zbGlja1wiLGUuc3dpcGVIYW5kbGVyKSxlLiRsaXN0Lm9mZihcInRvdWNoY2FuY2VsLnNsaWNrIG1vdXNlbGVhdmUuc2xpY2tcIixlLnN3aXBlSGFuZGxlciksZS4kbGlzdC5vZmYoXCJjbGljay5zbGlja1wiLGUuY2xpY2tIYW5kbGVyKSxpKGRvY3VtZW50KS5vZmYoZS52aXNpYmlsaXR5Q2hhbmdlLGUudmlzaWJpbGl0eSksZS5jbGVhblVwU2xpZGVFdmVudHMoKSwhMD09PWUub3B0aW9ucy5hY2Nlc3NpYmlsaXR5JiZlLiRsaXN0Lm9mZihcImtleWRvd24uc2xpY2tcIixlLmtleUhhbmRsZXIpLCEwPT09ZS5vcHRpb25zLmZvY3VzT25TZWxlY3QmJmkoZS4kc2xpZGVUcmFjaykuY2hpbGRyZW4oKS5vZmYoXCJjbGljay5zbGlja1wiLGUuc2VsZWN0SGFuZGxlciksaSh3aW5kb3cpLm9mZihcIm9yaWVudGF0aW9uY2hhbmdlLnNsaWNrLnNsaWNrLVwiK2UuaW5zdGFuY2VVaWQsZS5vcmllbnRhdGlvbkNoYW5nZSksaSh3aW5kb3cpLm9mZihcInJlc2l6ZS5zbGljay5zbGljay1cIitlLmluc3RhbmNlVWlkLGUucmVzaXplKSxpKFwiW2RyYWdnYWJsZSE9dHJ1ZV1cIixlLiRzbGlkZVRyYWNrKS5vZmYoXCJkcmFnc3RhcnRcIixlLnByZXZlbnREZWZhdWx0KSxpKHdpbmRvdykub2ZmKFwibG9hZC5zbGljay5zbGljay1cIitlLmluc3RhbmNlVWlkLGUuc2V0UG9zaXRpb24pfSxlLnByb3RvdHlwZS5jbGVhblVwU2xpZGVFdmVudHM9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2UuJGxpc3Qub2ZmKFwibW91c2VlbnRlci5zbGlja1wiLGkucHJveHkoZS5pbnRlcnJ1cHQsZSwhMCkpLGUuJGxpc3Qub2ZmKFwibW91c2VsZWF2ZS5zbGlja1wiLGkucHJveHkoZS5pbnRlcnJ1cHQsZSwhMSkpfSxlLnByb3RvdHlwZS5jbGVhblVwUm93cz1mdW5jdGlvbigpe3ZhciBpLGU9dGhpcztlLm9wdGlvbnMucm93cz4xJiYoKGk9ZS4kc2xpZGVzLmNoaWxkcmVuKCkuY2hpbGRyZW4oKSkucmVtb3ZlQXR0cihcInN0eWxlXCIpLGUuJHNsaWRlci5lbXB0eSgpLmFwcGVuZChpKSl9LGUucHJvdG90eXBlLmNsaWNrSGFuZGxlcj1mdW5jdGlvbihpKXshMT09PXRoaXMuc2hvdWxkQ2xpY2smJihpLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpLGkuc3RvcFByb3BhZ2F0aW9uKCksaS5wcmV2ZW50RGVmYXVsdCgpKX0sZS5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbihlKXt2YXIgdD10aGlzO3QuYXV0b1BsYXlDbGVhcigpLHQudG91Y2hPYmplY3Q9e30sdC5jbGVhblVwRXZlbnRzKCksaShcIi5zbGljay1jbG9uZWRcIix0LiRzbGlkZXIpLmRldGFjaCgpLHQuJGRvdHMmJnQuJGRvdHMucmVtb3ZlKCksdC4kcHJldkFycm93JiZ0LiRwcmV2QXJyb3cubGVuZ3RoJiYodC4kcHJldkFycm93LnJlbW92ZUNsYXNzKFwic2xpY2stZGlzYWJsZWQgc2xpY2stYXJyb3cgc2xpY2staGlkZGVuXCIpLnJlbW92ZUF0dHIoXCJhcmlhLWhpZGRlbiBhcmlhLWRpc2FibGVkIHRhYmluZGV4XCIpLmNzcyhcImRpc3BsYXlcIixcIlwiKSx0Lmh0bWxFeHByLnRlc3QodC5vcHRpb25zLnByZXZBcnJvdykmJnQuJHByZXZBcnJvdy5yZW1vdmUoKSksdC4kbmV4dEFycm93JiZ0LiRuZXh0QXJyb3cubGVuZ3RoJiYodC4kbmV4dEFycm93LnJlbW92ZUNsYXNzKFwic2xpY2stZGlzYWJsZWQgc2xpY2stYXJyb3cgc2xpY2staGlkZGVuXCIpLnJlbW92ZUF0dHIoXCJhcmlhLWhpZGRlbiBhcmlhLWRpc2FibGVkIHRhYmluZGV4XCIpLmNzcyhcImRpc3BsYXlcIixcIlwiKSx0Lmh0bWxFeHByLnRlc3QodC5vcHRpb25zLm5leHRBcnJvdykmJnQuJG5leHRBcnJvdy5yZW1vdmUoKSksdC4kc2xpZGVzJiYodC4kc2xpZGVzLnJlbW92ZUNsYXNzKFwic2xpY2stc2xpZGUgc2xpY2stYWN0aXZlIHNsaWNrLWNlbnRlciBzbGljay12aXNpYmxlIHNsaWNrLWN1cnJlbnRcIikucmVtb3ZlQXR0cihcImFyaWEtaGlkZGVuXCIpLnJlbW92ZUF0dHIoXCJkYXRhLXNsaWNrLWluZGV4XCIpLmVhY2goZnVuY3Rpb24oKXtpKHRoaXMpLmF0dHIoXCJzdHlsZVwiLGkodGhpcykuZGF0YShcIm9yaWdpbmFsU3R5bGluZ1wiKSl9KSx0LiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCksdC4kc2xpZGVUcmFjay5kZXRhY2goKSx0LiRsaXN0LmRldGFjaCgpLHQuJHNsaWRlci5hcHBlbmQodC4kc2xpZGVzKSksdC5jbGVhblVwUm93cygpLHQuJHNsaWRlci5yZW1vdmVDbGFzcyhcInNsaWNrLXNsaWRlclwiKSx0LiRzbGlkZXIucmVtb3ZlQ2xhc3MoXCJzbGljay1pbml0aWFsaXplZFwiKSx0LiRzbGlkZXIucmVtb3ZlQ2xhc3MoXCJzbGljay1kb3R0ZWRcIiksdC51bnNsaWNrZWQ9ITAsZXx8dC4kc2xpZGVyLnRyaWdnZXIoXCJkZXN0cm95XCIsW3RdKX0sZS5wcm90b3R5cGUuZGlzYWJsZVRyYW5zaXRpb249ZnVuY3Rpb24oaSl7dmFyIGU9dGhpcyx0PXt9O3RbZS50cmFuc2l0aW9uVHlwZV09XCJcIiwhMT09PWUub3B0aW9ucy5mYWRlP2UuJHNsaWRlVHJhY2suY3NzKHQpOmUuJHNsaWRlcy5lcShpKS5jc3ModCl9LGUucHJvdG90eXBlLmZhZGVTbGlkZT1mdW5jdGlvbihpLGUpe3ZhciB0PXRoaXM7ITE9PT10LmNzc1RyYW5zaXRpb25zPyh0LiRzbGlkZXMuZXEoaSkuY3NzKHt6SW5kZXg6dC5vcHRpb25zLnpJbmRleH0pLHQuJHNsaWRlcy5lcShpKS5hbmltYXRlKHtvcGFjaXR5OjF9LHQub3B0aW9ucy5zcGVlZCx0Lm9wdGlvbnMuZWFzaW5nLGUpKToodC5hcHBseVRyYW5zaXRpb24oaSksdC4kc2xpZGVzLmVxKGkpLmNzcyh7b3BhY2l0eToxLHpJbmRleDp0Lm9wdGlvbnMuekluZGV4fSksZSYmc2V0VGltZW91dChmdW5jdGlvbigpe3QuZGlzYWJsZVRyYW5zaXRpb24oaSksZS5jYWxsKCl9LHQub3B0aW9ucy5zcGVlZCkpfSxlLnByb3RvdHlwZS5mYWRlU2xpZGVPdXQ9ZnVuY3Rpb24oaSl7dmFyIGU9dGhpczshMT09PWUuY3NzVHJhbnNpdGlvbnM/ZS4kc2xpZGVzLmVxKGkpLmFuaW1hdGUoe29wYWNpdHk6MCx6SW5kZXg6ZS5vcHRpb25zLnpJbmRleC0yfSxlLm9wdGlvbnMuc3BlZWQsZS5vcHRpb25zLmVhc2luZyk6KGUuYXBwbHlUcmFuc2l0aW9uKGkpLGUuJHNsaWRlcy5lcShpKS5jc3Moe29wYWNpdHk6MCx6SW5kZXg6ZS5vcHRpb25zLnpJbmRleC0yfSkpfSxlLnByb3RvdHlwZS5maWx0ZXJTbGlkZXM9ZS5wcm90b3R5cGUuc2xpY2tGaWx0ZXI9ZnVuY3Rpb24oaSl7dmFyIGU9dGhpcztudWxsIT09aSYmKGUuJHNsaWRlc0NhY2hlPWUuJHNsaWRlcyxlLnVubG9hZCgpLGUuJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5kZXRhY2goKSxlLiRzbGlkZXNDYWNoZS5maWx0ZXIoaSkuYXBwZW5kVG8oZS4kc2xpZGVUcmFjayksZS5yZWluaXQoKSl9LGUucHJvdG90eXBlLmZvY3VzSGFuZGxlcj1mdW5jdGlvbigpe3ZhciBlPXRoaXM7ZS4kc2xpZGVyLm9mZihcImZvY3VzLnNsaWNrIGJsdXIuc2xpY2tcIikub24oXCJmb2N1cy5zbGljayBibHVyLnNsaWNrXCIsXCIqXCIsZnVuY3Rpb24odCl7dC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTt2YXIgbz1pKHRoaXMpO3NldFRpbWVvdXQoZnVuY3Rpb24oKXtlLm9wdGlvbnMucGF1c2VPbkZvY3VzJiYoZS5mb2N1c3NlZD1vLmlzKFwiOmZvY3VzXCIpLGUuYXV0b1BsYXkoKSl9LDApfSl9LGUucHJvdG90eXBlLmdldEN1cnJlbnQ9ZS5wcm90b3R5cGUuc2xpY2tDdXJyZW50U2xpZGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jdXJyZW50U2xpZGV9LGUucHJvdG90eXBlLmdldERvdENvdW50PWZ1bmN0aW9uKCl7dmFyIGk9dGhpcyxlPTAsdD0wLG89MDtpZighMD09PWkub3B0aW9ucy5pbmZpbml0ZSlpZihpLnNsaWRlQ291bnQ8PWkub3B0aW9ucy5zbGlkZXNUb1Nob3cpKytvO2Vsc2UgZm9yKDtlPGkuc2xpZGVDb3VudDspKytvLGU9dCtpLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwsdCs9aS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsPD1pLm9wdGlvbnMuc2xpZGVzVG9TaG93P2kub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDppLm9wdGlvbnMuc2xpZGVzVG9TaG93O2Vsc2UgaWYoITA9PT1pLm9wdGlvbnMuY2VudGVyTW9kZSlvPWkuc2xpZGVDb3VudDtlbHNlIGlmKGkub3B0aW9ucy5hc05hdkZvcilmb3IoO2U8aS5zbGlkZUNvdW50OykrK28sZT10K2kub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCx0Kz1pLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw8PWkub3B0aW9ucy5zbGlkZXNUb1Nob3c/aS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsOmkub3B0aW9ucy5zbGlkZXNUb1Nob3c7ZWxzZSBvPTErTWF0aC5jZWlsKChpLnNsaWRlQ291bnQtaS5vcHRpb25zLnNsaWRlc1RvU2hvdykvaS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKTtyZXR1cm4gby0xfSxlLnByb3RvdHlwZS5nZXRMZWZ0PWZ1bmN0aW9uKGkpe3ZhciBlLHQsbyxzLG49dGhpcyxyPTA7cmV0dXJuIG4uc2xpZGVPZmZzZXQ9MCx0PW4uJHNsaWRlcy5maXJzdCgpLm91dGVySGVpZ2h0KCEwKSwhMD09PW4ub3B0aW9ucy5pbmZpbml0ZT8obi5zbGlkZUNvdW50Pm4ub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihuLnNsaWRlT2Zmc2V0PW4uc2xpZGVXaWR0aCpuLm9wdGlvbnMuc2xpZGVzVG9TaG93Ki0xLHM9LTEsITA9PT1uLm9wdGlvbnMudmVydGljYWwmJiEwPT09bi5vcHRpb25zLmNlbnRlck1vZGUmJigyPT09bi5vcHRpb25zLnNsaWRlc1RvU2hvdz9zPS0xLjU6MT09PW4ub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihzPS0yKSkscj10Km4ub3B0aW9ucy5zbGlkZXNUb1Nob3cqcyksbi5zbGlkZUNvdW50JW4ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCE9MCYmaStuLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw+bi5zbGlkZUNvdW50JiZuLnNsaWRlQ291bnQ+bi5vcHRpb25zLnNsaWRlc1RvU2hvdyYmKGk+bi5zbGlkZUNvdW50PyhuLnNsaWRlT2Zmc2V0PShuLm9wdGlvbnMuc2xpZGVzVG9TaG93LShpLW4uc2xpZGVDb3VudCkpKm4uc2xpZGVXaWR0aCotMSxyPShuLm9wdGlvbnMuc2xpZGVzVG9TaG93LShpLW4uc2xpZGVDb3VudCkpKnQqLTEpOihuLnNsaWRlT2Zmc2V0PW4uc2xpZGVDb3VudCVuLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwqbi5zbGlkZVdpZHRoKi0xLHI9bi5zbGlkZUNvdW50JW4ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCp0Ki0xKSkpOmkrbi5vcHRpb25zLnNsaWRlc1RvU2hvdz5uLnNsaWRlQ291bnQmJihuLnNsaWRlT2Zmc2V0PShpK24ub3B0aW9ucy5zbGlkZXNUb1Nob3ctbi5zbGlkZUNvdW50KSpuLnNsaWRlV2lkdGgscj0oaStuLm9wdGlvbnMuc2xpZGVzVG9TaG93LW4uc2xpZGVDb3VudCkqdCksbi5zbGlkZUNvdW50PD1uLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYobi5zbGlkZU9mZnNldD0wLHI9MCksITA9PT1uLm9wdGlvbnMuY2VudGVyTW9kZSYmbi5zbGlkZUNvdW50PD1uLm9wdGlvbnMuc2xpZGVzVG9TaG93P24uc2xpZGVPZmZzZXQ9bi5zbGlkZVdpZHRoKk1hdGguZmxvb3Iobi5vcHRpb25zLnNsaWRlc1RvU2hvdykvMi1uLnNsaWRlV2lkdGgqbi5zbGlkZUNvdW50LzI6ITA9PT1uLm9wdGlvbnMuY2VudGVyTW9kZSYmITA9PT1uLm9wdGlvbnMuaW5maW5pdGU/bi5zbGlkZU9mZnNldCs9bi5zbGlkZVdpZHRoKk1hdGguZmxvb3Iobi5vcHRpb25zLnNsaWRlc1RvU2hvdy8yKS1uLnNsaWRlV2lkdGg6ITA9PT1uLm9wdGlvbnMuY2VudGVyTW9kZSYmKG4uc2xpZGVPZmZzZXQ9MCxuLnNsaWRlT2Zmc2V0Kz1uLnNsaWRlV2lkdGgqTWF0aC5mbG9vcihuLm9wdGlvbnMuc2xpZGVzVG9TaG93LzIpKSxlPSExPT09bi5vcHRpb25zLnZlcnRpY2FsP2kqbi5zbGlkZVdpZHRoKi0xK24uc2xpZGVPZmZzZXQ6aSp0Ki0xK3IsITA9PT1uLm9wdGlvbnMudmFyaWFibGVXaWR0aCYmKG89bi5zbGlkZUNvdW50PD1uLm9wdGlvbnMuc2xpZGVzVG9TaG93fHwhMT09PW4ub3B0aW9ucy5pbmZpbml0ZT9uLiRzbGlkZVRyYWNrLmNoaWxkcmVuKFwiLnNsaWNrLXNsaWRlXCIpLmVxKGkpOm4uJHNsaWRlVHJhY2suY2hpbGRyZW4oXCIuc2xpY2stc2xpZGVcIikuZXEoaStuLm9wdGlvbnMuc2xpZGVzVG9TaG93KSxlPSEwPT09bi5vcHRpb25zLnJ0bD9vWzBdPy0xKihuLiRzbGlkZVRyYWNrLndpZHRoKCktb1swXS5vZmZzZXRMZWZ0LW8ud2lkdGgoKSk6MDpvWzBdPy0xKm9bMF0ub2Zmc2V0TGVmdDowLCEwPT09bi5vcHRpb25zLmNlbnRlck1vZGUmJihvPW4uc2xpZGVDb3VudDw9bi5vcHRpb25zLnNsaWRlc1RvU2hvd3x8ITE9PT1uLm9wdGlvbnMuaW5maW5pdGU/bi4kc2xpZGVUcmFjay5jaGlsZHJlbihcIi5zbGljay1zbGlkZVwiKS5lcShpKTpuLiRzbGlkZVRyYWNrLmNoaWxkcmVuKFwiLnNsaWNrLXNsaWRlXCIpLmVxKGkrbi5vcHRpb25zLnNsaWRlc1RvU2hvdysxKSxlPSEwPT09bi5vcHRpb25zLnJ0bD9vWzBdPy0xKihuLiRzbGlkZVRyYWNrLndpZHRoKCktb1swXS5vZmZzZXRMZWZ0LW8ud2lkdGgoKSk6MDpvWzBdPy0xKm9bMF0ub2Zmc2V0TGVmdDowLGUrPShuLiRsaXN0LndpZHRoKCktby5vdXRlcldpZHRoKCkpLzIpKSxlfSxlLnByb3RvdHlwZS5nZXRPcHRpb249ZS5wcm90b3R5cGUuc2xpY2tHZXRPcHRpb249ZnVuY3Rpb24oaSl7cmV0dXJuIHRoaXMub3B0aW9uc1tpXX0sZS5wcm90b3R5cGUuZ2V0TmF2aWdhYmxlSW5kZXhlcz1mdW5jdGlvbigpe3ZhciBpLGU9dGhpcyx0PTAsbz0wLHM9W107Zm9yKCExPT09ZS5vcHRpb25zLmluZmluaXRlP2k9ZS5zbGlkZUNvdW50Oih0PS0xKmUub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCxvPS0xKmUub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCxpPTIqZS5zbGlkZUNvdW50KTt0PGk7KXMucHVzaCh0KSx0PW8rZS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsLG8rPWUub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDw9ZS5vcHRpb25zLnNsaWRlc1RvU2hvdz9lLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw6ZS5vcHRpb25zLnNsaWRlc1RvU2hvdztyZXR1cm4gc30sZS5wcm90b3R5cGUuZ2V0U2xpY2s9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30sZS5wcm90b3R5cGUuZ2V0U2xpZGVDb3VudD1mdW5jdGlvbigpe3ZhciBlLHQsbz10aGlzO3JldHVybiB0PSEwPT09by5vcHRpb25zLmNlbnRlck1vZGU/by5zbGlkZVdpZHRoKk1hdGguZmxvb3Ioby5vcHRpb25zLnNsaWRlc1RvU2hvdy8yKTowLCEwPT09by5vcHRpb25zLnN3aXBlVG9TbGlkZT8oby4kc2xpZGVUcmFjay5maW5kKFwiLnNsaWNrLXNsaWRlXCIpLmVhY2goZnVuY3Rpb24ocyxuKXtpZihuLm9mZnNldExlZnQtdCtpKG4pLm91dGVyV2lkdGgoKS8yPi0xKm8uc3dpcGVMZWZ0KXJldHVybiBlPW4sITF9KSxNYXRoLmFicyhpKGUpLmF0dHIoXCJkYXRhLXNsaWNrLWluZGV4XCIpLW8uY3VycmVudFNsaWRlKXx8MSk6by5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsfSxlLnByb3RvdHlwZS5nb1RvPWUucHJvdG90eXBlLnNsaWNrR29Ubz1mdW5jdGlvbihpLGUpe3RoaXMuY2hhbmdlU2xpZGUoe2RhdGE6e21lc3NhZ2U6XCJpbmRleFwiLGluZGV4OnBhcnNlSW50KGkpfX0sZSl9LGUucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcztpKHQuJHNsaWRlcikuaGFzQ2xhc3MoXCJzbGljay1pbml0aWFsaXplZFwiKXx8KGkodC4kc2xpZGVyKS5hZGRDbGFzcyhcInNsaWNrLWluaXRpYWxpemVkXCIpLHQuYnVpbGRSb3dzKCksdC5idWlsZE91dCgpLHQuc2V0UHJvcHMoKSx0LnN0YXJ0TG9hZCgpLHQubG9hZFNsaWRlcigpLHQuaW5pdGlhbGl6ZUV2ZW50cygpLHQudXBkYXRlQXJyb3dzKCksdC51cGRhdGVEb3RzKCksdC5jaGVja1Jlc3BvbnNpdmUoITApLHQuZm9jdXNIYW5kbGVyKCkpLGUmJnQuJHNsaWRlci50cmlnZ2VyKFwiaW5pdFwiLFt0XSksITA9PT10Lm9wdGlvbnMuYWNjZXNzaWJpbGl0eSYmdC5pbml0QURBKCksdC5vcHRpb25zLmF1dG9wbGF5JiYodC5wYXVzZWQ9ITEsdC5hdXRvUGxheSgpKX0sZS5wcm90b3R5cGUuaW5pdEFEQT1mdW5jdGlvbigpe3ZhciBlPXRoaXMsdD1NYXRoLmNlaWwoZS5zbGlkZUNvdW50L2Uub3B0aW9ucy5zbGlkZXNUb1Nob3cpLG89ZS5nZXROYXZpZ2FibGVJbmRleGVzKCkuZmlsdGVyKGZ1bmN0aW9uKGkpe3JldHVybiBpPj0wJiZpPGUuc2xpZGVDb3VudH0pO2UuJHNsaWRlcy5hZGQoZS4kc2xpZGVUcmFjay5maW5kKFwiLnNsaWNrLWNsb25lZFwiKSkuYXR0cih7XCJhcmlhLWhpZGRlblwiOlwidHJ1ZVwiLHRhYmluZGV4OlwiLTFcIn0pLmZpbmQoXCJhLCBpbnB1dCwgYnV0dG9uLCBzZWxlY3RcIikuYXR0cih7dGFiaW5kZXg6XCItMVwifSksbnVsbCE9PWUuJGRvdHMmJihlLiRzbGlkZXMubm90KGUuJHNsaWRlVHJhY2suZmluZChcIi5zbGljay1jbG9uZWRcIikpLmVhY2goZnVuY3Rpb24odCl7dmFyIHM9by5pbmRleE9mKHQpO2kodGhpcykuYXR0cih7cm9sZTpcInRhYnBhbmVsXCIsaWQ6XCJzbGljay1zbGlkZVwiK2UuaW5zdGFuY2VVaWQrdCx0YWJpbmRleDotMX0pLC0xIT09cyYmaSh0aGlzKS5hdHRyKHtcImFyaWEtZGVzY3JpYmVkYnlcIjpcInNsaWNrLXNsaWRlLWNvbnRyb2xcIitlLmluc3RhbmNlVWlkK3N9KX0pLGUuJGRvdHMuYXR0cihcInJvbGVcIixcInRhYmxpc3RcIikuZmluZChcImxpXCIpLmVhY2goZnVuY3Rpb24ocyl7dmFyIG49b1tzXTtpKHRoaXMpLmF0dHIoe3JvbGU6XCJwcmVzZW50YXRpb25cIn0pLGkodGhpcykuZmluZChcImJ1dHRvblwiKS5maXJzdCgpLmF0dHIoe3JvbGU6XCJ0YWJcIixpZDpcInNsaWNrLXNsaWRlLWNvbnRyb2xcIitlLmluc3RhbmNlVWlkK3MsXCJhcmlhLWNvbnRyb2xzXCI6XCJzbGljay1zbGlkZVwiK2UuaW5zdGFuY2VVaWQrbixcImFyaWEtbGFiZWxcIjpzKzErXCIgb2YgXCIrdCxcImFyaWEtc2VsZWN0ZWRcIjpudWxsLHRhYmluZGV4OlwiLTFcIn0pfSkuZXEoZS5jdXJyZW50U2xpZGUpLmZpbmQoXCJidXR0b25cIikuYXR0cih7XCJhcmlhLXNlbGVjdGVkXCI6XCJ0cnVlXCIsdGFiaW5kZXg6XCIwXCJ9KS5lbmQoKSk7Zm9yKHZhciBzPWUuY3VycmVudFNsaWRlLG49cytlLm9wdGlvbnMuc2xpZGVzVG9TaG93O3M8bjtzKyspZS4kc2xpZGVzLmVxKHMpLmF0dHIoXCJ0YWJpbmRleFwiLDApO2UuYWN0aXZhdGVBREEoKX0sZS5wcm90b3R5cGUuaW5pdEFycm93RXZlbnRzPWZ1bmN0aW9uKCl7dmFyIGk9dGhpczshMD09PWkub3B0aW9ucy5hcnJvd3MmJmkuc2xpZGVDb3VudD5pLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYoaS4kcHJldkFycm93Lm9mZihcImNsaWNrLnNsaWNrXCIpLm9uKFwiY2xpY2suc2xpY2tcIix7bWVzc2FnZTpcInByZXZpb3VzXCJ9LGkuY2hhbmdlU2xpZGUpLGkuJG5leHRBcnJvdy5vZmYoXCJjbGljay5zbGlja1wiKS5vbihcImNsaWNrLnNsaWNrXCIse21lc3NhZ2U6XCJuZXh0XCJ9LGkuY2hhbmdlU2xpZGUpLCEwPT09aS5vcHRpb25zLmFjY2Vzc2liaWxpdHkmJihpLiRwcmV2QXJyb3cub24oXCJrZXlkb3duLnNsaWNrXCIsaS5rZXlIYW5kbGVyKSxpLiRuZXh0QXJyb3cub24oXCJrZXlkb3duLnNsaWNrXCIsaS5rZXlIYW5kbGVyKSkpfSxlLnByb3RvdHlwZS5pbml0RG90RXZlbnRzPWZ1bmN0aW9uKCl7dmFyIGU9dGhpczshMD09PWUub3B0aW9ucy5kb3RzJiYoaShcImxpXCIsZS4kZG90cykub24oXCJjbGljay5zbGlja1wiLHttZXNzYWdlOlwiaW5kZXhcIn0sZS5jaGFuZ2VTbGlkZSksITA9PT1lLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSYmZS4kZG90cy5vbihcImtleWRvd24uc2xpY2tcIixlLmtleUhhbmRsZXIpKSwhMD09PWUub3B0aW9ucy5kb3RzJiYhMD09PWUub3B0aW9ucy5wYXVzZU9uRG90c0hvdmVyJiZpKFwibGlcIixlLiRkb3RzKS5vbihcIm1vdXNlZW50ZXIuc2xpY2tcIixpLnByb3h5KGUuaW50ZXJydXB0LGUsITApKS5vbihcIm1vdXNlbGVhdmUuc2xpY2tcIixpLnByb3h5KGUuaW50ZXJydXB0LGUsITEpKX0sZS5wcm90b3R5cGUuaW5pdFNsaWRlRXZlbnRzPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcztlLm9wdGlvbnMucGF1c2VPbkhvdmVyJiYoZS4kbGlzdC5vbihcIm1vdXNlZW50ZXIuc2xpY2tcIixpLnByb3h5KGUuaW50ZXJydXB0LGUsITApKSxlLiRsaXN0Lm9uKFwibW91c2VsZWF2ZS5zbGlja1wiLGkucHJveHkoZS5pbnRlcnJ1cHQsZSwhMSkpKX0sZS5wcm90b3R5cGUuaW5pdGlhbGl6ZUV2ZW50cz1mdW5jdGlvbigpe3ZhciBlPXRoaXM7ZS5pbml0QXJyb3dFdmVudHMoKSxlLmluaXREb3RFdmVudHMoKSxlLmluaXRTbGlkZUV2ZW50cygpLGUuJGxpc3Qub24oXCJ0b3VjaHN0YXJ0LnNsaWNrIG1vdXNlZG93bi5zbGlja1wiLHthY3Rpb246XCJzdGFydFwifSxlLnN3aXBlSGFuZGxlciksZS4kbGlzdC5vbihcInRvdWNobW92ZS5zbGljayBtb3VzZW1vdmUuc2xpY2tcIix7YWN0aW9uOlwibW92ZVwifSxlLnN3aXBlSGFuZGxlciksZS4kbGlzdC5vbihcInRvdWNoZW5kLnNsaWNrIG1vdXNldXAuc2xpY2tcIix7YWN0aW9uOlwiZW5kXCJ9LGUuc3dpcGVIYW5kbGVyKSxlLiRsaXN0Lm9uKFwidG91Y2hjYW5jZWwuc2xpY2sgbW91c2VsZWF2ZS5zbGlja1wiLHthY3Rpb246XCJlbmRcIn0sZS5zd2lwZUhhbmRsZXIpLGUuJGxpc3Qub24oXCJjbGljay5zbGlja1wiLGUuY2xpY2tIYW5kbGVyKSxpKGRvY3VtZW50KS5vbihlLnZpc2liaWxpdHlDaGFuZ2UsaS5wcm94eShlLnZpc2liaWxpdHksZSkpLCEwPT09ZS5vcHRpb25zLmFjY2Vzc2liaWxpdHkmJmUuJGxpc3Qub24oXCJrZXlkb3duLnNsaWNrXCIsZS5rZXlIYW5kbGVyKSwhMD09PWUub3B0aW9ucy5mb2N1c09uU2VsZWN0JiZpKGUuJHNsaWRlVHJhY2spLmNoaWxkcmVuKCkub24oXCJjbGljay5zbGlja1wiLGUuc2VsZWN0SGFuZGxlciksaSh3aW5kb3cpLm9uKFwib3JpZW50YXRpb25jaGFuZ2Uuc2xpY2suc2xpY2stXCIrZS5pbnN0YW5jZVVpZCxpLnByb3h5KGUub3JpZW50YXRpb25DaGFuZ2UsZSkpLGkod2luZG93KS5vbihcInJlc2l6ZS5zbGljay5zbGljay1cIitlLmluc3RhbmNlVWlkLGkucHJveHkoZS5yZXNpemUsZSkpLGkoXCJbZHJhZ2dhYmxlIT10cnVlXVwiLGUuJHNsaWRlVHJhY2spLm9uKFwiZHJhZ3N0YXJ0XCIsZS5wcmV2ZW50RGVmYXVsdCksaSh3aW5kb3cpLm9uKFwibG9hZC5zbGljay5zbGljay1cIitlLmluc3RhbmNlVWlkLGUuc2V0UG9zaXRpb24pLGkoZS5zZXRQb3NpdGlvbil9LGUucHJvdG90eXBlLmluaXRVST1mdW5jdGlvbigpe3ZhciBpPXRoaXM7ITA9PT1pLm9wdGlvbnMuYXJyb3dzJiZpLnNsaWRlQ291bnQ+aS5vcHRpb25zLnNsaWRlc1RvU2hvdyYmKGkuJHByZXZBcnJvdy5zaG93KCksaS4kbmV4dEFycm93LnNob3coKSksITA9PT1pLm9wdGlvbnMuZG90cyYmaS5zbGlkZUNvdW50Pmkub3B0aW9ucy5zbGlkZXNUb1Nob3cmJmkuJGRvdHMuc2hvdygpfSxlLnByb3RvdHlwZS5rZXlIYW5kbGVyPWZ1bmN0aW9uKGkpe3ZhciBlPXRoaXM7aS50YXJnZXQudGFnTmFtZS5tYXRjaChcIlRFWFRBUkVBfElOUFVUfFNFTEVDVFwiKXx8KDM3PT09aS5rZXlDb2RlJiYhMD09PWUub3B0aW9ucy5hY2Nlc3NpYmlsaXR5P2UuY2hhbmdlU2xpZGUoe2RhdGE6e21lc3NhZ2U6ITA9PT1lLm9wdGlvbnMucnRsP1wibmV4dFwiOlwicHJldmlvdXNcIn19KTozOT09PWkua2V5Q29kZSYmITA9PT1lLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSYmZS5jaGFuZ2VTbGlkZSh7ZGF0YTp7bWVzc2FnZTohMD09PWUub3B0aW9ucy5ydGw/XCJwcmV2aW91c1wiOlwibmV4dFwifX0pKX0sZS5wcm90b3R5cGUubGF6eUxvYWQ9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGUpe2koXCJpbWdbZGF0YS1sYXp5XVwiLGUpLmVhY2goZnVuY3Rpb24oKXt2YXIgZT1pKHRoaXMpLHQ9aSh0aGlzKS5hdHRyKFwiZGF0YS1sYXp5XCIpLG89aSh0aGlzKS5hdHRyKFwiZGF0YS1zcmNzZXRcIikscz1pKHRoaXMpLmF0dHIoXCJkYXRhLXNpemVzXCIpfHxuLiRzbGlkZXIuYXR0cihcImRhdGEtc2l6ZXNcIikscj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO3Iub25sb2FkPWZ1bmN0aW9uKCl7ZS5hbmltYXRlKHtvcGFjaXR5OjB9LDEwMCxmdW5jdGlvbigpe28mJihlLmF0dHIoXCJzcmNzZXRcIixvKSxzJiZlLmF0dHIoXCJzaXplc1wiLHMpKSxlLmF0dHIoXCJzcmNcIix0KS5hbmltYXRlKHtvcGFjaXR5OjF9LDIwMCxmdW5jdGlvbigpe2UucmVtb3ZlQXR0cihcImRhdGEtbGF6eSBkYXRhLXNyY3NldCBkYXRhLXNpemVzXCIpLnJlbW92ZUNsYXNzKFwic2xpY2stbG9hZGluZ1wiKX0pLG4uJHNsaWRlci50cmlnZ2VyKFwibGF6eUxvYWRlZFwiLFtuLGUsdF0pfSl9LHIub25lcnJvcj1mdW5jdGlvbigpe2UucmVtb3ZlQXR0cihcImRhdGEtbGF6eVwiKS5yZW1vdmVDbGFzcyhcInNsaWNrLWxvYWRpbmdcIikuYWRkQ2xhc3MoXCJzbGljay1sYXp5bG9hZC1lcnJvclwiKSxuLiRzbGlkZXIudHJpZ2dlcihcImxhenlMb2FkRXJyb3JcIixbbixlLHRdKX0sci5zcmM9dH0pfXZhciB0LG8scyxuPXRoaXM7aWYoITA9PT1uLm9wdGlvbnMuY2VudGVyTW9kZT8hMD09PW4ub3B0aW9ucy5pbmZpbml0ZT9zPShvPW4uY3VycmVudFNsaWRlKyhuLm9wdGlvbnMuc2xpZGVzVG9TaG93LzIrMSkpK24ub3B0aW9ucy5zbGlkZXNUb1Nob3crMjoobz1NYXRoLm1heCgwLG4uY3VycmVudFNsaWRlLShuLm9wdGlvbnMuc2xpZGVzVG9TaG93LzIrMSkpLHM9bi5vcHRpb25zLnNsaWRlc1RvU2hvdy8yKzErMituLmN1cnJlbnRTbGlkZSk6KG89bi5vcHRpb25zLmluZmluaXRlP24ub3B0aW9ucy5zbGlkZXNUb1Nob3crbi5jdXJyZW50U2xpZGU6bi5jdXJyZW50U2xpZGUscz1NYXRoLmNlaWwobytuLm9wdGlvbnMuc2xpZGVzVG9TaG93KSwhMD09PW4ub3B0aW9ucy5mYWRlJiYobz4wJiZvLS0sczw9bi5zbGlkZUNvdW50JiZzKyspKSx0PW4uJHNsaWRlci5maW5kKFwiLnNsaWNrLXNsaWRlXCIpLnNsaWNlKG8scyksXCJhbnRpY2lwYXRlZFwiPT09bi5vcHRpb25zLmxhenlMb2FkKWZvcih2YXIgcj1vLTEsbD1zLGQ9bi4kc2xpZGVyLmZpbmQoXCIuc2xpY2stc2xpZGVcIiksYT0wO2E8bi5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO2ErKylyPDAmJihyPW4uc2xpZGVDb3VudC0xKSx0PSh0PXQuYWRkKGQuZXEocikpKS5hZGQoZC5lcShsKSksci0tLGwrKztlKHQpLG4uc2xpZGVDb3VudDw9bi5vcHRpb25zLnNsaWRlc1RvU2hvdz9lKG4uJHNsaWRlci5maW5kKFwiLnNsaWNrLXNsaWRlXCIpKTpuLmN1cnJlbnRTbGlkZT49bi5zbGlkZUNvdW50LW4ub3B0aW9ucy5zbGlkZXNUb1Nob3c/ZShuLiRzbGlkZXIuZmluZChcIi5zbGljay1jbG9uZWRcIikuc2xpY2UoMCxuLm9wdGlvbnMuc2xpZGVzVG9TaG93KSk6MD09PW4uY3VycmVudFNsaWRlJiZlKG4uJHNsaWRlci5maW5kKFwiLnNsaWNrLWNsb25lZFwiKS5zbGljZSgtMSpuLm9wdGlvbnMuc2xpZGVzVG9TaG93KSl9LGUucHJvdG90eXBlLmxvYWRTbGlkZXI9ZnVuY3Rpb24oKXt2YXIgaT10aGlzO2kuc2V0UG9zaXRpb24oKSxpLiRzbGlkZVRyYWNrLmNzcyh7b3BhY2l0eToxfSksaS4kc2xpZGVyLnJlbW92ZUNsYXNzKFwic2xpY2stbG9hZGluZ1wiKSxpLmluaXRVSSgpLFwicHJvZ3Jlc3NpdmVcIj09PWkub3B0aW9ucy5sYXp5TG9hZCYmaS5wcm9ncmVzc2l2ZUxhenlMb2FkKCl9LGUucHJvdG90eXBlLm5leHQ9ZS5wcm90b3R5cGUuc2xpY2tOZXh0PWZ1bmN0aW9uKCl7dGhpcy5jaGFuZ2VTbGlkZSh7ZGF0YTp7bWVzc2FnZTpcIm5leHRcIn19KX0sZS5wcm90b3R5cGUub3JpZW50YXRpb25DaGFuZ2U9ZnVuY3Rpb24oKXt2YXIgaT10aGlzO2kuY2hlY2tSZXNwb25zaXZlKCksaS5zZXRQb3NpdGlvbigpfSxlLnByb3RvdHlwZS5wYXVzZT1lLnByb3RvdHlwZS5zbGlja1BhdXNlPWZ1bmN0aW9uKCl7dmFyIGk9dGhpcztpLmF1dG9QbGF5Q2xlYXIoKSxpLnBhdXNlZD0hMH0sZS5wcm90b3R5cGUucGxheT1lLnByb3RvdHlwZS5zbGlja1BsYXk9ZnVuY3Rpb24oKXt2YXIgaT10aGlzO2kuYXV0b1BsYXkoKSxpLm9wdGlvbnMuYXV0b3BsYXk9ITAsaS5wYXVzZWQ9ITEsaS5mb2N1c3NlZD0hMSxpLmludGVycnVwdGVkPSExfSxlLnByb3RvdHlwZS5wb3N0U2xpZGU9ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpczt0LnVuc2xpY2tlZHx8KHQuJHNsaWRlci50cmlnZ2VyKFwiYWZ0ZXJDaGFuZ2VcIixbdCxlXSksdC5hbmltYXRpbmc9ITEsdC5zbGlkZUNvdW50PnQub3B0aW9ucy5zbGlkZXNUb1Nob3cmJnQuc2V0UG9zaXRpb24oKSx0LnN3aXBlTGVmdD1udWxsLHQub3B0aW9ucy5hdXRvcGxheSYmdC5hdXRvUGxheSgpLCEwPT09dC5vcHRpb25zLmFjY2Vzc2liaWxpdHkmJih0LmluaXRBREEoKSx0Lm9wdGlvbnMuZm9jdXNPbkNoYW5nZSYmaSh0LiRzbGlkZXMuZ2V0KHQuY3VycmVudFNsaWRlKSkuYXR0cihcInRhYmluZGV4XCIsMCkuZm9jdXMoKSkpfSxlLnByb3RvdHlwZS5wcmV2PWUucHJvdG90eXBlLnNsaWNrUHJldj1mdW5jdGlvbigpe3RoaXMuY2hhbmdlU2xpZGUoe2RhdGE6e21lc3NhZ2U6XCJwcmV2aW91c1wifX0pfSxlLnByb3RvdHlwZS5wcmV2ZW50RGVmYXVsdD1mdW5jdGlvbihpKXtpLnByZXZlbnREZWZhdWx0KCl9LGUucHJvdG90eXBlLnByb2dyZXNzaXZlTGF6eUxvYWQ9ZnVuY3Rpb24oZSl7ZT1lfHwxO3ZhciB0LG8scyxuLHIsbD10aGlzLGQ9aShcImltZ1tkYXRhLWxhenldXCIsbC4kc2xpZGVyKTtkLmxlbmd0aD8odD1kLmZpcnN0KCksbz10LmF0dHIoXCJkYXRhLWxhenlcIikscz10LmF0dHIoXCJkYXRhLXNyY3NldFwiKSxuPXQuYXR0cihcImRhdGEtc2l6ZXNcIil8fGwuJHNsaWRlci5hdHRyKFwiZGF0YS1zaXplc1wiKSwocj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpKS5vbmxvYWQ9ZnVuY3Rpb24oKXtzJiYodC5hdHRyKFwic3Jjc2V0XCIscyksbiYmdC5hdHRyKFwic2l6ZXNcIixuKSksdC5hdHRyKFwic3JjXCIsbykucmVtb3ZlQXR0cihcImRhdGEtbGF6eSBkYXRhLXNyY3NldCBkYXRhLXNpemVzXCIpLnJlbW92ZUNsYXNzKFwic2xpY2stbG9hZGluZ1wiKSwhMD09PWwub3B0aW9ucy5hZGFwdGl2ZUhlaWdodCYmbC5zZXRQb3NpdGlvbigpLGwuJHNsaWRlci50cmlnZ2VyKFwibGF6eUxvYWRlZFwiLFtsLHQsb10pLGwucHJvZ3Jlc3NpdmVMYXp5TG9hZCgpfSxyLm9uZXJyb3I9ZnVuY3Rpb24oKXtlPDM/c2V0VGltZW91dChmdW5jdGlvbigpe2wucHJvZ3Jlc3NpdmVMYXp5TG9hZChlKzEpfSw1MDApOih0LnJlbW92ZUF0dHIoXCJkYXRhLWxhenlcIikucmVtb3ZlQ2xhc3MoXCJzbGljay1sb2FkaW5nXCIpLmFkZENsYXNzKFwic2xpY2stbGF6eWxvYWQtZXJyb3JcIiksbC4kc2xpZGVyLnRyaWdnZXIoXCJsYXp5TG9hZEVycm9yXCIsW2wsdCxvXSksbC5wcm9ncmVzc2l2ZUxhenlMb2FkKCkpfSxyLnNyYz1vKTpsLiRzbGlkZXIudHJpZ2dlcihcImFsbEltYWdlc0xvYWRlZFwiLFtsXSl9LGUucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oZSl7dmFyIHQsbyxzPXRoaXM7bz1zLnNsaWRlQ291bnQtcy5vcHRpb25zLnNsaWRlc1RvU2hvdywhcy5vcHRpb25zLmluZmluaXRlJiZzLmN1cnJlbnRTbGlkZT5vJiYocy5jdXJyZW50U2xpZGU9bykscy5zbGlkZUNvdW50PD1zLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYocy5jdXJyZW50U2xpZGU9MCksdD1zLmN1cnJlbnRTbGlkZSxzLmRlc3Ryb3koITApLGkuZXh0ZW5kKHMscy5pbml0aWFscyx7Y3VycmVudFNsaWRlOnR9KSxzLmluaXQoKSxlfHxzLmNoYW5nZVNsaWRlKHtkYXRhOnttZXNzYWdlOlwiaW5kZXhcIixpbmRleDp0fX0sITEpfSxlLnByb3RvdHlwZS5yZWdpc3RlckJyZWFrcG9pbnRzPWZ1bmN0aW9uKCl7dmFyIGUsdCxvLHM9dGhpcyxuPXMub3B0aW9ucy5yZXNwb25zaXZlfHxudWxsO2lmKFwiYXJyYXlcIj09PWkudHlwZShuKSYmbi5sZW5ndGgpe3MucmVzcG9uZFRvPXMub3B0aW9ucy5yZXNwb25kVG98fFwid2luZG93XCI7Zm9yKGUgaW4gbilpZihvPXMuYnJlYWtwb2ludHMubGVuZ3RoLTEsbi5oYXNPd25Qcm9wZXJ0eShlKSl7Zm9yKHQ9bltlXS5icmVha3BvaW50O28+PTA7KXMuYnJlYWtwb2ludHNbb10mJnMuYnJlYWtwb2ludHNbb109PT10JiZzLmJyZWFrcG9pbnRzLnNwbGljZShvLDEpLG8tLTtzLmJyZWFrcG9pbnRzLnB1c2godCkscy5icmVha3BvaW50U2V0dGluZ3NbdF09bltlXS5zZXR0aW5nc31zLmJyZWFrcG9pbnRzLnNvcnQoZnVuY3Rpb24oaSxlKXtyZXR1cm4gcy5vcHRpb25zLm1vYmlsZUZpcnN0P2ktZTplLWl9KX19LGUucHJvdG90eXBlLnJlaW5pdD1mdW5jdGlvbigpe3ZhciBlPXRoaXM7ZS4kc2xpZGVzPWUuJHNsaWRlVHJhY2suY2hpbGRyZW4oZS5vcHRpb25zLnNsaWRlKS5hZGRDbGFzcyhcInNsaWNrLXNsaWRlXCIpLGUuc2xpZGVDb3VudD1lLiRzbGlkZXMubGVuZ3RoLGUuY3VycmVudFNsaWRlPj1lLnNsaWRlQ291bnQmJjAhPT1lLmN1cnJlbnRTbGlkZSYmKGUuY3VycmVudFNsaWRlPWUuY3VycmVudFNsaWRlLWUub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCksZS5zbGlkZUNvdW50PD1lLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYoZS5jdXJyZW50U2xpZGU9MCksZS5yZWdpc3RlckJyZWFrcG9pbnRzKCksZS5zZXRQcm9wcygpLGUuc2V0dXBJbmZpbml0ZSgpLGUuYnVpbGRBcnJvd3MoKSxlLnVwZGF0ZUFycm93cygpLGUuaW5pdEFycm93RXZlbnRzKCksZS5idWlsZERvdHMoKSxlLnVwZGF0ZURvdHMoKSxlLmluaXREb3RFdmVudHMoKSxlLmNsZWFuVXBTbGlkZUV2ZW50cygpLGUuaW5pdFNsaWRlRXZlbnRzKCksZS5jaGVja1Jlc3BvbnNpdmUoITEsITApLCEwPT09ZS5vcHRpb25zLmZvY3VzT25TZWxlY3QmJmkoZS4kc2xpZGVUcmFjaykuY2hpbGRyZW4oKS5vbihcImNsaWNrLnNsaWNrXCIsZS5zZWxlY3RIYW5kbGVyKSxlLnNldFNsaWRlQ2xhc3NlcyhcIm51bWJlclwiPT10eXBlb2YgZS5jdXJyZW50U2xpZGU/ZS5jdXJyZW50U2xpZGU6MCksZS5zZXRQb3NpdGlvbigpLGUuZm9jdXNIYW5kbGVyKCksZS5wYXVzZWQ9IWUub3B0aW9ucy5hdXRvcGxheSxlLmF1dG9QbGF5KCksZS4kc2xpZGVyLnRyaWdnZXIoXCJyZUluaXRcIixbZV0pfSxlLnByb3RvdHlwZS5yZXNpemU9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2kod2luZG93KS53aWR0aCgpIT09ZS53aW5kb3dXaWR0aCYmKGNsZWFyVGltZW91dChlLndpbmRvd0RlbGF5KSxlLndpbmRvd0RlbGF5PXdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZS53aW5kb3dXaWR0aD1pKHdpbmRvdykud2lkdGgoKSxlLmNoZWNrUmVzcG9uc2l2ZSgpLGUudW5zbGlja2VkfHxlLnNldFBvc2l0aW9uKCl9LDUwKSl9LGUucHJvdG90eXBlLnJlbW92ZVNsaWRlPWUucHJvdG90eXBlLnNsaWNrUmVtb3ZlPWZ1bmN0aW9uKGksZSx0KXt2YXIgbz10aGlzO2lmKGk9XCJib29sZWFuXCI9PXR5cGVvZiBpPyEwPT09KGU9aSk/MDpvLnNsaWRlQ291bnQtMTohMD09PWU/LS1pOmksby5zbGlkZUNvdW50PDF8fGk8MHx8aT5vLnNsaWRlQ291bnQtMSlyZXR1cm4hMTtvLnVubG9hZCgpLCEwPT09dD9vLiRzbGlkZVRyYWNrLmNoaWxkcmVuKCkucmVtb3ZlKCk6by4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmVxKGkpLnJlbW92ZSgpLG8uJHNsaWRlcz1vLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSksby4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpLG8uJHNsaWRlVHJhY2suYXBwZW5kKG8uJHNsaWRlcyksby4kc2xpZGVzQ2FjaGU9by4kc2xpZGVzLG8ucmVpbml0KCl9LGUucHJvdG90eXBlLnNldENTUz1mdW5jdGlvbihpKXt2YXIgZSx0LG89dGhpcyxzPXt9OyEwPT09by5vcHRpb25zLnJ0bCYmKGk9LWkpLGU9XCJsZWZ0XCI9PW8ucG9zaXRpb25Qcm9wP01hdGguY2VpbChpKStcInB4XCI6XCIwcHhcIix0PVwidG9wXCI9PW8ucG9zaXRpb25Qcm9wP01hdGguY2VpbChpKStcInB4XCI6XCIwcHhcIixzW28ucG9zaXRpb25Qcm9wXT1pLCExPT09by50cmFuc2Zvcm1zRW5hYmxlZD9vLiRzbGlkZVRyYWNrLmNzcyhzKToocz17fSwhMT09PW8uY3NzVHJhbnNpdGlvbnM/KHNbby5hbmltVHlwZV09XCJ0cmFuc2xhdGUoXCIrZStcIiwgXCIrdCtcIilcIixvLiRzbGlkZVRyYWNrLmNzcyhzKSk6KHNbby5hbmltVHlwZV09XCJ0cmFuc2xhdGUzZChcIitlK1wiLCBcIit0K1wiLCAwcHgpXCIsby4kc2xpZGVUcmFjay5jc3MocykpKX0sZS5wcm90b3R5cGUuc2V0RGltZW5zaW9ucz1mdW5jdGlvbigpe3ZhciBpPXRoaXM7ITE9PT1pLm9wdGlvbnMudmVydGljYWw/ITA9PT1pLm9wdGlvbnMuY2VudGVyTW9kZSYmaS4kbGlzdC5jc3Moe3BhZGRpbmc6XCIwcHggXCIraS5vcHRpb25zLmNlbnRlclBhZGRpbmd9KTooaS4kbGlzdC5oZWlnaHQoaS4kc2xpZGVzLmZpcnN0KCkub3V0ZXJIZWlnaHQoITApKmkub3B0aW9ucy5zbGlkZXNUb1Nob3cpLCEwPT09aS5vcHRpb25zLmNlbnRlck1vZGUmJmkuJGxpc3QuY3NzKHtwYWRkaW5nOmkub3B0aW9ucy5jZW50ZXJQYWRkaW5nK1wiIDBweFwifSkpLGkubGlzdFdpZHRoPWkuJGxpc3Qud2lkdGgoKSxpLmxpc3RIZWlnaHQ9aS4kbGlzdC5oZWlnaHQoKSwhMT09PWkub3B0aW9ucy52ZXJ0aWNhbCYmITE9PT1pLm9wdGlvbnMudmFyaWFibGVXaWR0aD8oaS5zbGlkZVdpZHRoPU1hdGguY2VpbChpLmxpc3RXaWR0aC9pLm9wdGlvbnMuc2xpZGVzVG9TaG93KSxpLiRzbGlkZVRyYWNrLndpZHRoKE1hdGguY2VpbChpLnNsaWRlV2lkdGgqaS4kc2xpZGVUcmFjay5jaGlsZHJlbihcIi5zbGljay1zbGlkZVwiKS5sZW5ndGgpKSk6ITA9PT1pLm9wdGlvbnMudmFyaWFibGVXaWR0aD9pLiRzbGlkZVRyYWNrLndpZHRoKDVlMyppLnNsaWRlQ291bnQpOihpLnNsaWRlV2lkdGg9TWF0aC5jZWlsKGkubGlzdFdpZHRoKSxpLiRzbGlkZVRyYWNrLmhlaWdodChNYXRoLmNlaWwoaS4kc2xpZGVzLmZpcnN0KCkub3V0ZXJIZWlnaHQoITApKmkuJHNsaWRlVHJhY2suY2hpbGRyZW4oXCIuc2xpY2stc2xpZGVcIikubGVuZ3RoKSkpO3ZhciBlPWkuJHNsaWRlcy5maXJzdCgpLm91dGVyV2lkdGgoITApLWkuJHNsaWRlcy5maXJzdCgpLndpZHRoKCk7ITE9PT1pLm9wdGlvbnMudmFyaWFibGVXaWR0aCYmaS4kc2xpZGVUcmFjay5jaGlsZHJlbihcIi5zbGljay1zbGlkZVwiKS53aWR0aChpLnNsaWRlV2lkdGgtZSl9LGUucHJvdG90eXBlLnNldEZhZGU9ZnVuY3Rpb24oKXt2YXIgZSx0PXRoaXM7dC4kc2xpZGVzLmVhY2goZnVuY3Rpb24obyxzKXtlPXQuc2xpZGVXaWR0aCpvKi0xLCEwPT09dC5vcHRpb25zLnJ0bD9pKHMpLmNzcyh7cG9zaXRpb246XCJyZWxhdGl2ZVwiLHJpZ2h0OmUsdG9wOjAsekluZGV4OnQub3B0aW9ucy56SW5kZXgtMixvcGFjaXR5OjB9KTppKHMpLmNzcyh7cG9zaXRpb246XCJyZWxhdGl2ZVwiLGxlZnQ6ZSx0b3A6MCx6SW5kZXg6dC5vcHRpb25zLnpJbmRleC0yLG9wYWNpdHk6MH0pfSksdC4kc2xpZGVzLmVxKHQuY3VycmVudFNsaWRlKS5jc3Moe3pJbmRleDp0Lm9wdGlvbnMuekluZGV4LTEsb3BhY2l0eToxfSl9LGUucHJvdG90eXBlLnNldEhlaWdodD1mdW5jdGlvbigpe3ZhciBpPXRoaXM7aWYoMT09PWkub3B0aW9ucy5zbGlkZXNUb1Nob3cmJiEwPT09aS5vcHRpb25zLmFkYXB0aXZlSGVpZ2h0JiYhMT09PWkub3B0aW9ucy52ZXJ0aWNhbCl7dmFyIGU9aS4kc2xpZGVzLmVxKGkuY3VycmVudFNsaWRlKS5vdXRlckhlaWdodCghMCk7aS4kbGlzdC5jc3MoXCJoZWlnaHRcIixlKX19LGUucHJvdG90eXBlLnNldE9wdGlvbj1lLnByb3RvdHlwZS5zbGlja1NldE9wdGlvbj1mdW5jdGlvbigpe3ZhciBlLHQsbyxzLG4scj10aGlzLGw9ITE7aWYoXCJvYmplY3RcIj09PWkudHlwZShhcmd1bWVudHNbMF0pPyhvPWFyZ3VtZW50c1swXSxsPWFyZ3VtZW50c1sxXSxuPVwibXVsdGlwbGVcIik6XCJzdHJpbmdcIj09PWkudHlwZShhcmd1bWVudHNbMF0pJiYobz1hcmd1bWVudHNbMF0scz1hcmd1bWVudHNbMV0sbD1hcmd1bWVudHNbMl0sXCJyZXNwb25zaXZlXCI9PT1hcmd1bWVudHNbMF0mJlwiYXJyYXlcIj09PWkudHlwZShhcmd1bWVudHNbMV0pP249XCJyZXNwb25zaXZlXCI6dm9pZCAwIT09YXJndW1lbnRzWzFdJiYobj1cInNpbmdsZVwiKSksXCJzaW5nbGVcIj09PW4pci5vcHRpb25zW29dPXM7ZWxzZSBpZihcIm11bHRpcGxlXCI9PT1uKWkuZWFjaChvLGZ1bmN0aW9uKGksZSl7ci5vcHRpb25zW2ldPWV9KTtlbHNlIGlmKFwicmVzcG9uc2l2ZVwiPT09bilmb3IodCBpbiBzKWlmKFwiYXJyYXlcIiE9PWkudHlwZShyLm9wdGlvbnMucmVzcG9uc2l2ZSkpci5vcHRpb25zLnJlc3BvbnNpdmU9W3NbdF1dO2Vsc2V7Zm9yKGU9ci5vcHRpb25zLnJlc3BvbnNpdmUubGVuZ3RoLTE7ZT49MDspci5vcHRpb25zLnJlc3BvbnNpdmVbZV0uYnJlYWtwb2ludD09PXNbdF0uYnJlYWtwb2ludCYmci5vcHRpb25zLnJlc3BvbnNpdmUuc3BsaWNlKGUsMSksZS0tO3Iub3B0aW9ucy5yZXNwb25zaXZlLnB1c2goc1t0XSl9bCYmKHIudW5sb2FkKCksci5yZWluaXQoKSl9LGUucHJvdG90eXBlLnNldFBvc2l0aW9uPWZ1bmN0aW9uKCl7dmFyIGk9dGhpcztpLnNldERpbWVuc2lvbnMoKSxpLnNldEhlaWdodCgpLCExPT09aS5vcHRpb25zLmZhZGU/aS5zZXRDU1MoaS5nZXRMZWZ0KGkuY3VycmVudFNsaWRlKSk6aS5zZXRGYWRlKCksaS4kc2xpZGVyLnRyaWdnZXIoXCJzZXRQb3NpdGlvblwiLFtpXSl9LGUucHJvdG90eXBlLnNldFByb3BzPWZ1bmN0aW9uKCl7dmFyIGk9dGhpcyxlPWRvY3VtZW50LmJvZHkuc3R5bGU7aS5wb3NpdGlvblByb3A9ITA9PT1pLm9wdGlvbnMudmVydGljYWw/XCJ0b3BcIjpcImxlZnRcIixcInRvcFwiPT09aS5wb3NpdGlvblByb3A/aS4kc2xpZGVyLmFkZENsYXNzKFwic2xpY2stdmVydGljYWxcIik6aS4kc2xpZGVyLnJlbW92ZUNsYXNzKFwic2xpY2stdmVydGljYWxcIiksdm9pZCAwPT09ZS5XZWJraXRUcmFuc2l0aW9uJiZ2b2lkIDA9PT1lLk1velRyYW5zaXRpb24mJnZvaWQgMD09PWUubXNUcmFuc2l0aW9ufHwhMD09PWkub3B0aW9ucy51c2VDU1MmJihpLmNzc1RyYW5zaXRpb25zPSEwKSxpLm9wdGlvbnMuZmFkZSYmKFwibnVtYmVyXCI9PXR5cGVvZiBpLm9wdGlvbnMuekluZGV4P2kub3B0aW9ucy56SW5kZXg8MyYmKGkub3B0aW9ucy56SW5kZXg9Myk6aS5vcHRpb25zLnpJbmRleD1pLmRlZmF1bHRzLnpJbmRleCksdm9pZCAwIT09ZS5PVHJhbnNmb3JtJiYoaS5hbmltVHlwZT1cIk9UcmFuc2Zvcm1cIixpLnRyYW5zZm9ybVR5cGU9XCItby10cmFuc2Zvcm1cIixpLnRyYW5zaXRpb25UeXBlPVwiT1RyYW5zaXRpb25cIix2b2lkIDA9PT1lLnBlcnNwZWN0aXZlUHJvcGVydHkmJnZvaWQgMD09PWUud2Via2l0UGVyc3BlY3RpdmUmJihpLmFuaW1UeXBlPSExKSksdm9pZCAwIT09ZS5Nb3pUcmFuc2Zvcm0mJihpLmFuaW1UeXBlPVwiTW96VHJhbnNmb3JtXCIsaS50cmFuc2Zvcm1UeXBlPVwiLW1vei10cmFuc2Zvcm1cIixpLnRyYW5zaXRpb25UeXBlPVwiTW96VHJhbnNpdGlvblwiLHZvaWQgMD09PWUucGVyc3BlY3RpdmVQcm9wZXJ0eSYmdm9pZCAwPT09ZS5Nb3pQZXJzcGVjdGl2ZSYmKGkuYW5pbVR5cGU9ITEpKSx2b2lkIDAhPT1lLndlYmtpdFRyYW5zZm9ybSYmKGkuYW5pbVR5cGU9XCJ3ZWJraXRUcmFuc2Zvcm1cIixpLnRyYW5zZm9ybVR5cGU9XCItd2Via2l0LXRyYW5zZm9ybVwiLGkudHJhbnNpdGlvblR5cGU9XCJ3ZWJraXRUcmFuc2l0aW9uXCIsdm9pZCAwPT09ZS5wZXJzcGVjdGl2ZVByb3BlcnR5JiZ2b2lkIDA9PT1lLndlYmtpdFBlcnNwZWN0aXZlJiYoaS5hbmltVHlwZT0hMSkpLHZvaWQgMCE9PWUubXNUcmFuc2Zvcm0mJihpLmFuaW1UeXBlPVwibXNUcmFuc2Zvcm1cIixpLnRyYW5zZm9ybVR5cGU9XCItbXMtdHJhbnNmb3JtXCIsaS50cmFuc2l0aW9uVHlwZT1cIm1zVHJhbnNpdGlvblwiLHZvaWQgMD09PWUubXNUcmFuc2Zvcm0mJihpLmFuaW1UeXBlPSExKSksdm9pZCAwIT09ZS50cmFuc2Zvcm0mJiExIT09aS5hbmltVHlwZSYmKGkuYW5pbVR5cGU9XCJ0cmFuc2Zvcm1cIixpLnRyYW5zZm9ybVR5cGU9XCJ0cmFuc2Zvcm1cIixpLnRyYW5zaXRpb25UeXBlPVwidHJhbnNpdGlvblwiKSxpLnRyYW5zZm9ybXNFbmFibGVkPWkub3B0aW9ucy51c2VUcmFuc2Zvcm0mJm51bGwhPT1pLmFuaW1UeXBlJiYhMSE9PWkuYW5pbVR5cGV9LGUucHJvdG90eXBlLnNldFNsaWRlQ2xhc3Nlcz1mdW5jdGlvbihpKXt2YXIgZSx0LG8scyxuPXRoaXM7aWYodD1uLiRzbGlkZXIuZmluZChcIi5zbGljay1zbGlkZVwiKS5yZW1vdmVDbGFzcyhcInNsaWNrLWFjdGl2ZSBzbGljay1jZW50ZXIgc2xpY2stY3VycmVudFwiKS5hdHRyKFwiYXJpYS1oaWRkZW5cIixcInRydWVcIiksbi4kc2xpZGVzLmVxKGkpLmFkZENsYXNzKFwic2xpY2stY3VycmVudFwiKSwhMD09PW4ub3B0aW9ucy5jZW50ZXJNb2RlKXt2YXIgcj1uLm9wdGlvbnMuc2xpZGVzVG9TaG93JTI9PTA/MTowO2U9TWF0aC5mbG9vcihuLm9wdGlvbnMuc2xpZGVzVG9TaG93LzIpLCEwPT09bi5vcHRpb25zLmluZmluaXRlJiYoaT49ZSYmaTw9bi5zbGlkZUNvdW50LTEtZT9uLiRzbGlkZXMuc2xpY2UoaS1lK3IsaStlKzEpLmFkZENsYXNzKFwic2xpY2stYWN0aXZlXCIpLmF0dHIoXCJhcmlhLWhpZGRlblwiLFwiZmFsc2VcIik6KG89bi5vcHRpb25zLnNsaWRlc1RvU2hvdytpLHQuc2xpY2Uoby1lKzErcixvK2UrMikuYWRkQ2xhc3MoXCJzbGljay1hY3RpdmVcIikuYXR0cihcImFyaWEtaGlkZGVuXCIsXCJmYWxzZVwiKSksMD09PWk/dC5lcSh0Lmxlbmd0aC0xLW4ub3B0aW9ucy5zbGlkZXNUb1Nob3cpLmFkZENsYXNzKFwic2xpY2stY2VudGVyXCIpOmk9PT1uLnNsaWRlQ291bnQtMSYmdC5lcShuLm9wdGlvbnMuc2xpZGVzVG9TaG93KS5hZGRDbGFzcyhcInNsaWNrLWNlbnRlclwiKSksbi4kc2xpZGVzLmVxKGkpLmFkZENsYXNzKFwic2xpY2stY2VudGVyXCIpfWVsc2UgaT49MCYmaTw9bi5zbGlkZUNvdW50LW4ub3B0aW9ucy5zbGlkZXNUb1Nob3c/bi4kc2xpZGVzLnNsaWNlKGksaStuLm9wdGlvbnMuc2xpZGVzVG9TaG93KS5hZGRDbGFzcyhcInNsaWNrLWFjdGl2ZVwiKS5hdHRyKFwiYXJpYS1oaWRkZW5cIixcImZhbHNlXCIpOnQubGVuZ3RoPD1uLm9wdGlvbnMuc2xpZGVzVG9TaG93P3QuYWRkQ2xhc3MoXCJzbGljay1hY3RpdmVcIikuYXR0cihcImFyaWEtaGlkZGVuXCIsXCJmYWxzZVwiKToocz1uLnNsaWRlQ291bnQlbi5vcHRpb25zLnNsaWRlc1RvU2hvdyxvPSEwPT09bi5vcHRpb25zLmluZmluaXRlP24ub3B0aW9ucy5zbGlkZXNUb1Nob3craTppLG4ub3B0aW9ucy5zbGlkZXNUb1Nob3c9PW4ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCYmbi5zbGlkZUNvdW50LWk8bi5vcHRpb25zLnNsaWRlc1RvU2hvdz90LnNsaWNlKG8tKG4ub3B0aW9ucy5zbGlkZXNUb1Nob3ctcyksbytzKS5hZGRDbGFzcyhcInNsaWNrLWFjdGl2ZVwiKS5hdHRyKFwiYXJpYS1oaWRkZW5cIixcImZhbHNlXCIpOnQuc2xpY2UobyxvK24ub3B0aW9ucy5zbGlkZXNUb1Nob3cpLmFkZENsYXNzKFwic2xpY2stYWN0aXZlXCIpLmF0dHIoXCJhcmlhLWhpZGRlblwiLFwiZmFsc2VcIikpO1wib25kZW1hbmRcIiE9PW4ub3B0aW9ucy5sYXp5TG9hZCYmXCJhbnRpY2lwYXRlZFwiIT09bi5vcHRpb25zLmxhenlMb2FkfHxuLmxhenlMb2FkKCl9LGUucHJvdG90eXBlLnNldHVwSW5maW5pdGU9ZnVuY3Rpb24oKXt2YXIgZSx0LG8scz10aGlzO2lmKCEwPT09cy5vcHRpb25zLmZhZGUmJihzLm9wdGlvbnMuY2VudGVyTW9kZT0hMSksITA9PT1zLm9wdGlvbnMuaW5maW5pdGUmJiExPT09cy5vcHRpb25zLmZhZGUmJih0PW51bGwscy5zbGlkZUNvdW50PnMub3B0aW9ucy5zbGlkZXNUb1Nob3cpKXtmb3Iobz0hMD09PXMub3B0aW9ucy5jZW50ZXJNb2RlP3Mub3B0aW9ucy5zbGlkZXNUb1Nob3crMTpzLm9wdGlvbnMuc2xpZGVzVG9TaG93LGU9cy5zbGlkZUNvdW50O2U+cy5zbGlkZUNvdW50LW87ZS09MSl0PWUtMSxpKHMuJHNsaWRlc1t0XSkuY2xvbmUoITApLmF0dHIoXCJpZFwiLFwiXCIpLmF0dHIoXCJkYXRhLXNsaWNrLWluZGV4XCIsdC1zLnNsaWRlQ291bnQpLnByZXBlbmRUbyhzLiRzbGlkZVRyYWNrKS5hZGRDbGFzcyhcInNsaWNrLWNsb25lZFwiKTtmb3IoZT0wO2U8bytzLnNsaWRlQ291bnQ7ZSs9MSl0PWUsaShzLiRzbGlkZXNbdF0pLmNsb25lKCEwKS5hdHRyKFwiaWRcIixcIlwiKS5hdHRyKFwiZGF0YS1zbGljay1pbmRleFwiLHQrcy5zbGlkZUNvdW50KS5hcHBlbmRUbyhzLiRzbGlkZVRyYWNrKS5hZGRDbGFzcyhcInNsaWNrLWNsb25lZFwiKTtzLiRzbGlkZVRyYWNrLmZpbmQoXCIuc2xpY2stY2xvbmVkXCIpLmZpbmQoXCJbaWRdXCIpLmVhY2goZnVuY3Rpb24oKXtpKHRoaXMpLmF0dHIoXCJpZFwiLFwiXCIpfSl9fSxlLnByb3RvdHlwZS5pbnRlcnJ1cHQ9ZnVuY3Rpb24oaSl7dmFyIGU9dGhpcztpfHxlLmF1dG9QbGF5KCksZS5pbnRlcnJ1cHRlZD1pfSxlLnByb3RvdHlwZS5zZWxlY3RIYW5kbGVyPWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMsbz1pKGUudGFyZ2V0KS5pcyhcIi5zbGljay1zbGlkZVwiKT9pKGUudGFyZ2V0KTppKGUudGFyZ2V0KS5wYXJlbnRzKFwiLnNsaWNrLXNsaWRlXCIpLHM9cGFyc2VJbnQoby5hdHRyKFwiZGF0YS1zbGljay1pbmRleFwiKSk7c3x8KHM9MCksdC5zbGlkZUNvdW50PD10Lm9wdGlvbnMuc2xpZGVzVG9TaG93P3Quc2xpZGVIYW5kbGVyKHMsITEsITApOnQuc2xpZGVIYW5kbGVyKHMpfSxlLnByb3RvdHlwZS5zbGlkZUhhbmRsZXI9ZnVuY3Rpb24oaSxlLHQpe3ZhciBvLHMsbixyLGwsZD1udWxsLGE9dGhpcztpZihlPWV8fCExLCEoITA9PT1hLmFuaW1hdGluZyYmITA9PT1hLm9wdGlvbnMud2FpdEZvckFuaW1hdGV8fCEwPT09YS5vcHRpb25zLmZhZGUmJmEuY3VycmVudFNsaWRlPT09aSkpaWYoITE9PT1lJiZhLmFzTmF2Rm9yKGkpLG89aSxkPWEuZ2V0TGVmdChvKSxyPWEuZ2V0TGVmdChhLmN1cnJlbnRTbGlkZSksYS5jdXJyZW50TGVmdD1udWxsPT09YS5zd2lwZUxlZnQ/cjphLnN3aXBlTGVmdCwhMT09PWEub3B0aW9ucy5pbmZpbml0ZSYmITE9PT1hLm9wdGlvbnMuY2VudGVyTW9kZSYmKGk8MHx8aT5hLmdldERvdENvdW50KCkqYS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKSkhMT09PWEub3B0aW9ucy5mYWRlJiYobz1hLmN1cnJlbnRTbGlkZSwhMCE9PXQ/YS5hbmltYXRlU2xpZGUocixmdW5jdGlvbigpe2EucG9zdFNsaWRlKG8pfSk6YS5wb3N0U2xpZGUobykpO2Vsc2UgaWYoITE9PT1hLm9wdGlvbnMuaW5maW5pdGUmJiEwPT09YS5vcHRpb25zLmNlbnRlck1vZGUmJihpPDB8fGk+YS5zbGlkZUNvdW50LWEub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCkpITE9PT1hLm9wdGlvbnMuZmFkZSYmKG89YS5jdXJyZW50U2xpZGUsITAhPT10P2EuYW5pbWF0ZVNsaWRlKHIsZnVuY3Rpb24oKXthLnBvc3RTbGlkZShvKX0pOmEucG9zdFNsaWRlKG8pKTtlbHNle2lmKGEub3B0aW9ucy5hdXRvcGxheSYmY2xlYXJJbnRlcnZhbChhLmF1dG9QbGF5VGltZXIpLHM9bzwwP2Euc2xpZGVDb3VudCVhLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwhPTA/YS5zbGlkZUNvdW50LWEuc2xpZGVDb3VudCVhLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw6YS5zbGlkZUNvdW50K286bz49YS5zbGlkZUNvdW50P2Euc2xpZGVDb3VudCVhLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwhPTA/MDpvLWEuc2xpZGVDb3VudDpvLGEuYW5pbWF0aW5nPSEwLGEuJHNsaWRlci50cmlnZ2VyKFwiYmVmb3JlQ2hhbmdlXCIsW2EsYS5jdXJyZW50U2xpZGUsc10pLG49YS5jdXJyZW50U2xpZGUsYS5jdXJyZW50U2xpZGU9cyxhLnNldFNsaWRlQ2xhc3NlcyhhLmN1cnJlbnRTbGlkZSksYS5vcHRpb25zLmFzTmF2Rm9yJiYobD0obD1hLmdldE5hdlRhcmdldCgpKS5zbGljayhcImdldFNsaWNrXCIpKS5zbGlkZUNvdW50PD1sLm9wdGlvbnMuc2xpZGVzVG9TaG93JiZsLnNldFNsaWRlQ2xhc3NlcyhhLmN1cnJlbnRTbGlkZSksYS51cGRhdGVEb3RzKCksYS51cGRhdGVBcnJvd3MoKSwhMD09PWEub3B0aW9ucy5mYWRlKXJldHVybiEwIT09dD8oYS5mYWRlU2xpZGVPdXQobiksYS5mYWRlU2xpZGUocyxmdW5jdGlvbigpe2EucG9zdFNsaWRlKHMpfSkpOmEucG9zdFNsaWRlKHMpLHZvaWQgYS5hbmltYXRlSGVpZ2h0KCk7ITAhPT10P2EuYW5pbWF0ZVNsaWRlKGQsZnVuY3Rpb24oKXthLnBvc3RTbGlkZShzKX0pOmEucG9zdFNsaWRlKHMpfX0sZS5wcm90b3R5cGUuc3RhcnRMb2FkPWZ1bmN0aW9uKCl7dmFyIGk9dGhpczshMD09PWkub3B0aW9ucy5hcnJvd3MmJmkuc2xpZGVDb3VudD5pLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYoaS4kcHJldkFycm93LmhpZGUoKSxpLiRuZXh0QXJyb3cuaGlkZSgpKSwhMD09PWkub3B0aW9ucy5kb3RzJiZpLnNsaWRlQ291bnQ+aS5vcHRpb25zLnNsaWRlc1RvU2hvdyYmaS4kZG90cy5oaWRlKCksaS4kc2xpZGVyLmFkZENsYXNzKFwic2xpY2stbG9hZGluZ1wiKX0sZS5wcm90b3R5cGUuc3dpcGVEaXJlY3Rpb249ZnVuY3Rpb24oKXt2YXIgaSxlLHQsbyxzPXRoaXM7cmV0dXJuIGk9cy50b3VjaE9iamVjdC5zdGFydFgtcy50b3VjaE9iamVjdC5jdXJYLGU9cy50b3VjaE9iamVjdC5zdGFydFktcy50b3VjaE9iamVjdC5jdXJZLHQ9TWF0aC5hdGFuMihlLGkpLChvPU1hdGgucm91bmQoMTgwKnQvTWF0aC5QSSkpPDAmJihvPTM2MC1NYXRoLmFicyhvKSksbzw9NDUmJm8+PTA/ITE9PT1zLm9wdGlvbnMucnRsP1wibGVmdFwiOlwicmlnaHRcIjpvPD0zNjAmJm8+PTMxNT8hMT09PXMub3B0aW9ucy5ydGw/XCJsZWZ0XCI6XCJyaWdodFwiOm8+PTEzNSYmbzw9MjI1PyExPT09cy5vcHRpb25zLnJ0bD9cInJpZ2h0XCI6XCJsZWZ0XCI6ITA9PT1zLm9wdGlvbnMudmVydGljYWxTd2lwaW5nP28+PTM1JiZvPD0xMzU/XCJkb3duXCI6XCJ1cFwiOlwidmVydGljYWxcIn0sZS5wcm90b3R5cGUuc3dpcGVFbmQ9ZnVuY3Rpb24oaSl7dmFyIGUsdCxvPXRoaXM7aWYoby5kcmFnZ2luZz0hMSxvLnN3aXBpbmc9ITEsby5zY3JvbGxpbmcpcmV0dXJuIG8uc2Nyb2xsaW5nPSExLCExO2lmKG8uaW50ZXJydXB0ZWQ9ITEsby5zaG91bGRDbGljaz0hKG8udG91Y2hPYmplY3Quc3dpcGVMZW5ndGg+MTApLHZvaWQgMD09PW8udG91Y2hPYmplY3QuY3VyWClyZXR1cm4hMTtpZighMD09PW8udG91Y2hPYmplY3QuZWRnZUhpdCYmby4kc2xpZGVyLnRyaWdnZXIoXCJlZGdlXCIsW28sby5zd2lwZURpcmVjdGlvbigpXSksby50b3VjaE9iamVjdC5zd2lwZUxlbmd0aD49by50b3VjaE9iamVjdC5taW5Td2lwZSl7c3dpdGNoKHQ9by5zd2lwZURpcmVjdGlvbigpKXtjYXNlXCJsZWZ0XCI6Y2FzZVwiZG93blwiOmU9by5vcHRpb25zLnN3aXBlVG9TbGlkZT9vLmNoZWNrTmF2aWdhYmxlKG8uY3VycmVudFNsaWRlK28uZ2V0U2xpZGVDb3VudCgpKTpvLmN1cnJlbnRTbGlkZStvLmdldFNsaWRlQ291bnQoKSxvLmN1cnJlbnREaXJlY3Rpb249MDticmVhaztjYXNlXCJyaWdodFwiOmNhc2VcInVwXCI6ZT1vLm9wdGlvbnMuc3dpcGVUb1NsaWRlP28uY2hlY2tOYXZpZ2FibGUoby5jdXJyZW50U2xpZGUtby5nZXRTbGlkZUNvdW50KCkpOm8uY3VycmVudFNsaWRlLW8uZ2V0U2xpZGVDb3VudCgpLG8uY3VycmVudERpcmVjdGlvbj0xfVwidmVydGljYWxcIiE9dCYmKG8uc2xpZGVIYW5kbGVyKGUpLG8udG91Y2hPYmplY3Q9e30sby4kc2xpZGVyLnRyaWdnZXIoXCJzd2lwZVwiLFtvLHRdKSl9ZWxzZSBvLnRvdWNoT2JqZWN0LnN0YXJ0WCE9PW8udG91Y2hPYmplY3QuY3VyWCYmKG8uc2xpZGVIYW5kbGVyKG8uY3VycmVudFNsaWRlKSxvLnRvdWNoT2JqZWN0PXt9KX0sZS5wcm90b3R5cGUuc3dpcGVIYW5kbGVyPWZ1bmN0aW9uKGkpe3ZhciBlPXRoaXM7aWYoISghMT09PWUub3B0aW9ucy5zd2lwZXx8XCJvbnRvdWNoZW5kXCJpbiBkb2N1bWVudCYmITE9PT1lLm9wdGlvbnMuc3dpcGV8fCExPT09ZS5vcHRpb25zLmRyYWdnYWJsZSYmLTEhPT1pLnR5cGUuaW5kZXhPZihcIm1vdXNlXCIpKSlzd2l0Y2goZS50b3VjaE9iamVjdC5maW5nZXJDb3VudD1pLm9yaWdpbmFsRXZlbnQmJnZvaWQgMCE9PWkub3JpZ2luYWxFdmVudC50b3VjaGVzP2kub3JpZ2luYWxFdmVudC50b3VjaGVzLmxlbmd0aDoxLGUudG91Y2hPYmplY3QubWluU3dpcGU9ZS5saXN0V2lkdGgvZS5vcHRpb25zLnRvdWNoVGhyZXNob2xkLCEwPT09ZS5vcHRpb25zLnZlcnRpY2FsU3dpcGluZyYmKGUudG91Y2hPYmplY3QubWluU3dpcGU9ZS5saXN0SGVpZ2h0L2Uub3B0aW9ucy50b3VjaFRocmVzaG9sZCksaS5kYXRhLmFjdGlvbil7Y2FzZVwic3RhcnRcIjplLnN3aXBlU3RhcnQoaSk7YnJlYWs7Y2FzZVwibW92ZVwiOmUuc3dpcGVNb3ZlKGkpO2JyZWFrO2Nhc2VcImVuZFwiOmUuc3dpcGVFbmQoaSl9fSxlLnByb3RvdHlwZS5zd2lwZU1vdmU9ZnVuY3Rpb24oaSl7dmFyIGUsdCxvLHMsbixyLGw9dGhpcztyZXR1cm4gbj12b2lkIDAhPT1pLm9yaWdpbmFsRXZlbnQ/aS5vcmlnaW5hbEV2ZW50LnRvdWNoZXM6bnVsbCwhKCFsLmRyYWdnaW5nfHxsLnNjcm9sbGluZ3x8biYmMSE9PW4ubGVuZ3RoKSYmKGU9bC5nZXRMZWZ0KGwuY3VycmVudFNsaWRlKSxsLnRvdWNoT2JqZWN0LmN1clg9dm9pZCAwIT09bj9uWzBdLnBhZ2VYOmkuY2xpZW50WCxsLnRvdWNoT2JqZWN0LmN1clk9dm9pZCAwIT09bj9uWzBdLnBhZ2VZOmkuY2xpZW50WSxsLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoPU1hdGgucm91bmQoTWF0aC5zcXJ0KE1hdGgucG93KGwudG91Y2hPYmplY3QuY3VyWC1sLnRvdWNoT2JqZWN0LnN0YXJ0WCwyKSkpLHI9TWF0aC5yb3VuZChNYXRoLnNxcnQoTWF0aC5wb3cobC50b3VjaE9iamVjdC5jdXJZLWwudG91Y2hPYmplY3Quc3RhcnRZLDIpKSksIWwub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmcmJiFsLnN3aXBpbmcmJnI+ND8obC5zY3JvbGxpbmc9ITAsITEpOighMD09PWwub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmcmJihsLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoPXIpLHQ9bC5zd2lwZURpcmVjdGlvbigpLHZvaWQgMCE9PWkub3JpZ2luYWxFdmVudCYmbC50b3VjaE9iamVjdC5zd2lwZUxlbmd0aD40JiYobC5zd2lwaW5nPSEwLGkucHJldmVudERlZmF1bHQoKSkscz0oITE9PT1sLm9wdGlvbnMucnRsPzE6LTEpKihsLnRvdWNoT2JqZWN0LmN1clg+bC50b3VjaE9iamVjdC5zdGFydFg/MTotMSksITA9PT1sLm9wdGlvbnMudmVydGljYWxTd2lwaW5nJiYocz1sLnRvdWNoT2JqZWN0LmN1clk+bC50b3VjaE9iamVjdC5zdGFydFk/MTotMSksbz1sLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoLGwudG91Y2hPYmplY3QuZWRnZUhpdD0hMSwhMT09PWwub3B0aW9ucy5pbmZpbml0ZSYmKDA9PT1sLmN1cnJlbnRTbGlkZSYmXCJyaWdodFwiPT09dHx8bC5jdXJyZW50U2xpZGU+PWwuZ2V0RG90Q291bnQoKSYmXCJsZWZ0XCI9PT10KSYmKG89bC50b3VjaE9iamVjdC5zd2lwZUxlbmd0aCpsLm9wdGlvbnMuZWRnZUZyaWN0aW9uLGwudG91Y2hPYmplY3QuZWRnZUhpdD0hMCksITE9PT1sLm9wdGlvbnMudmVydGljYWw/bC5zd2lwZUxlZnQ9ZStvKnM6bC5zd2lwZUxlZnQ9ZStvKihsLiRsaXN0LmhlaWdodCgpL2wubGlzdFdpZHRoKSpzLCEwPT09bC5vcHRpb25zLnZlcnRpY2FsU3dpcGluZyYmKGwuc3dpcGVMZWZ0PWUrbypzKSwhMCE9PWwub3B0aW9ucy5mYWRlJiYhMSE9PWwub3B0aW9ucy50b3VjaE1vdmUmJighMD09PWwuYW5pbWF0aW5nPyhsLnN3aXBlTGVmdD1udWxsLCExKTp2b2lkIGwuc2V0Q1NTKGwuc3dpcGVMZWZ0KSkpKX0sZS5wcm90b3R5cGUuc3dpcGVTdGFydD1mdW5jdGlvbihpKXt2YXIgZSx0PXRoaXM7aWYodC5pbnRlcnJ1cHRlZD0hMCwxIT09dC50b3VjaE9iamVjdC5maW5nZXJDb3VudHx8dC5zbGlkZUNvdW50PD10Lm9wdGlvbnMuc2xpZGVzVG9TaG93KXJldHVybiB0LnRvdWNoT2JqZWN0PXt9LCExO3ZvaWQgMCE9PWkub3JpZ2luYWxFdmVudCYmdm9pZCAwIT09aS5vcmlnaW5hbEV2ZW50LnRvdWNoZXMmJihlPWkub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdKSx0LnRvdWNoT2JqZWN0LnN0YXJ0WD10LnRvdWNoT2JqZWN0LmN1clg9dm9pZCAwIT09ZT9lLnBhZ2VYOmkuY2xpZW50WCx0LnRvdWNoT2JqZWN0LnN0YXJ0WT10LnRvdWNoT2JqZWN0LmN1clk9dm9pZCAwIT09ZT9lLnBhZ2VZOmkuY2xpZW50WSx0LmRyYWdnaW5nPSEwfSxlLnByb3RvdHlwZS51bmZpbHRlclNsaWRlcz1lLnByb3RvdHlwZS5zbGlja1VuZmlsdGVyPWZ1bmN0aW9uKCl7dmFyIGk9dGhpcztudWxsIT09aS4kc2xpZGVzQ2FjaGUmJihpLnVubG9hZCgpLGkuJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5kZXRhY2goKSxpLiRzbGlkZXNDYWNoZS5hcHBlbmRUbyhpLiRzbGlkZVRyYWNrKSxpLnJlaW5pdCgpKX0sZS5wcm90b3R5cGUudW5sb2FkPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcztpKFwiLnNsaWNrLWNsb25lZFwiLGUuJHNsaWRlcikucmVtb3ZlKCksZS4kZG90cyYmZS4kZG90cy5yZW1vdmUoKSxlLiRwcmV2QXJyb3cmJmUuaHRtbEV4cHIudGVzdChlLm9wdGlvbnMucHJldkFycm93KSYmZS4kcHJldkFycm93LnJlbW92ZSgpLGUuJG5leHRBcnJvdyYmZS5odG1sRXhwci50ZXN0KGUub3B0aW9ucy5uZXh0QXJyb3cpJiZlLiRuZXh0QXJyb3cucmVtb3ZlKCksZS4kc2xpZGVzLnJlbW92ZUNsYXNzKFwic2xpY2stc2xpZGUgc2xpY2stYWN0aXZlIHNsaWNrLXZpc2libGUgc2xpY2stY3VycmVudFwiKS5hdHRyKFwiYXJpYS1oaWRkZW5cIixcInRydWVcIikuY3NzKFwid2lkdGhcIixcIlwiKX0sZS5wcm90b3R5cGUudW5zbGljaz1mdW5jdGlvbihpKXt2YXIgZT10aGlzO2UuJHNsaWRlci50cmlnZ2VyKFwidW5zbGlja1wiLFtlLGldKSxlLmRlc3Ryb3koKX0sZS5wcm90b3R5cGUudXBkYXRlQXJyb3dzPWZ1bmN0aW9uKCl7dmFyIGk9dGhpcztNYXRoLmZsb29yKGkub3B0aW9ucy5zbGlkZXNUb1Nob3cvMiksITA9PT1pLm9wdGlvbnMuYXJyb3dzJiZpLnNsaWRlQ291bnQ+aS5vcHRpb25zLnNsaWRlc1RvU2hvdyYmIWkub3B0aW9ucy5pbmZpbml0ZSYmKGkuJHByZXZBcnJvdy5yZW1vdmVDbGFzcyhcInNsaWNrLWRpc2FibGVkXCIpLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJmYWxzZVwiKSxpLiRuZXh0QXJyb3cucmVtb3ZlQ2xhc3MoXCJzbGljay1kaXNhYmxlZFwiKS5hdHRyKFwiYXJpYS1kaXNhYmxlZFwiLFwiZmFsc2VcIiksMD09PWkuY3VycmVudFNsaWRlPyhpLiRwcmV2QXJyb3cuYWRkQ2xhc3MoXCJzbGljay1kaXNhYmxlZFwiKS5hdHRyKFwiYXJpYS1kaXNhYmxlZFwiLFwidHJ1ZVwiKSxpLiRuZXh0QXJyb3cucmVtb3ZlQ2xhc3MoXCJzbGljay1kaXNhYmxlZFwiKS5hdHRyKFwiYXJpYS1kaXNhYmxlZFwiLFwiZmFsc2VcIikpOmkuY3VycmVudFNsaWRlPj1pLnNsaWRlQ291bnQtaS5vcHRpb25zLnNsaWRlc1RvU2hvdyYmITE9PT1pLm9wdGlvbnMuY2VudGVyTW9kZT8oaS4kbmV4dEFycm93LmFkZENsYXNzKFwic2xpY2stZGlzYWJsZWRcIikuYXR0cihcImFyaWEtZGlzYWJsZWRcIixcInRydWVcIiksaS4kcHJldkFycm93LnJlbW92ZUNsYXNzKFwic2xpY2stZGlzYWJsZWRcIikuYXR0cihcImFyaWEtZGlzYWJsZWRcIixcImZhbHNlXCIpKTppLmN1cnJlbnRTbGlkZT49aS5zbGlkZUNvdW50LTEmJiEwPT09aS5vcHRpb25zLmNlbnRlck1vZGUmJihpLiRuZXh0QXJyb3cuYWRkQ2xhc3MoXCJzbGljay1kaXNhYmxlZFwiKS5hdHRyKFwiYXJpYS1kaXNhYmxlZFwiLFwidHJ1ZVwiKSxpLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoXCJzbGljay1kaXNhYmxlZFwiKS5hdHRyKFwiYXJpYS1kaXNhYmxlZFwiLFwiZmFsc2VcIikpKX0sZS5wcm90b3R5cGUudXBkYXRlRG90cz1mdW5jdGlvbigpe3ZhciBpPXRoaXM7bnVsbCE9PWkuJGRvdHMmJihpLiRkb3RzLmZpbmQoXCJsaVwiKS5yZW1vdmVDbGFzcyhcInNsaWNrLWFjdGl2ZVwiKS5lbmQoKSxpLiRkb3RzLmZpbmQoXCJsaVwiKS5lcShNYXRoLmZsb29yKGkuY3VycmVudFNsaWRlL2kub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCkpLmFkZENsYXNzKFwic2xpY2stYWN0aXZlXCIpKX0sZS5wcm90b3R5cGUudmlzaWJpbGl0eT1mdW5jdGlvbigpe3ZhciBpPXRoaXM7aS5vcHRpb25zLmF1dG9wbGF5JiYoZG9jdW1lbnRbaS5oaWRkZW5dP2kuaW50ZXJydXB0ZWQ9ITA6aS5pbnRlcnJ1cHRlZD0hMSl9LGkuZm4uc2xpY2s9ZnVuY3Rpb24oKXt2YXIgaSx0LG89dGhpcyxzPWFyZ3VtZW50c1swXSxuPUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywxKSxyPW8ubGVuZ3RoO2ZvcihpPTA7aTxyO2krKylpZihcIm9iamVjdFwiPT10eXBlb2Ygc3x8dm9pZCAwPT09cz9vW2ldLnNsaWNrPW5ldyBlKG9baV0scyk6dD1vW2ldLnNsaWNrW3NdLmFwcGx5KG9baV0uc2xpY2ssbiksdm9pZCAwIT09dClyZXR1cm4gdDtyZXR1cm4gb319KTtcblxyXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICAgICAgICAkKCcuYmFubmVycy1zbGlkZXInKS5zbGljayh7XHJcbiAgICAgICAgICBpbmZpbml0ZTogZmFsc2UsXHJcbiAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgIHByZXZBcnJvdzogJzxidXR0b24gY2xhc3M9XCJwcmV2IGFycm93XCI+PC9idXR0b24+JyxcclxuICAgICAgICAgIG5leHRBcnJvdzogJzxidXR0b24gY2xhc3M9XCJuZXh0IGFycm93XCI+PC9idXR0b24+JyxcclxuICAgICAgICAgIHJlc3BvbnNpdmU6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogMTAyNCxcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgIC8vIHByZXZBcnJvdzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgIC8vIG5leHRBcnJvdzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBhdXRvcGxheTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgIGF1dG9wbGF5U3BlZWQ6IDMwMDAsXHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIHtcclxuICAgICAgICAgICAgLy8gICAgIGJyZWFrcG9pbnQ6IDYwMCxcclxuICAgICAgICAgICAgLy8gICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgIC8vICAgICBzbGlkZXNUb1Nob3c6IDIsXHJcbiAgICAgICAgICAgIC8vICAgICBzbGlkZXNUb1Njcm9sbDogMlxyXG4gICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiAzMjAsXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgcHJldkFycm93OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgbmV4dEFycm93OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gWW91IGNhbiB1bnNsaWNrIGF0IGEgZ2l2ZW4gYnJlYWtwb2ludCBub3cgYnkgYWRkaW5nOlxyXG4gICAgICAgICAgICAvLyBzZXR0aW5nczogXCJ1bnNsaWNrXCJcclxuICAgICAgICAgICAgLy8gaW5zdGVhZCBvZiBhIHNldHRpbmdzIG9iamVjdFxyXG4gICAgICAgIF1cclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG4gICAgICAgICQoJy5wcm9kdWN0LXNsaWRlcicpLnNsaWNrKHtcclxuICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vINC60LDRgdGC0L7QvNC90YvQtSDRgtC+0YfQutC4KNGG0LjRhNGA0YspIGN1c3RvbVBhZ2luZzogKHNsaWRlciwgaSkgPT4gYDxhPiR7aSArIDF9PC9hPmBcclxuICAgICAgICAgICAgLy8g0LrQvtC70L7QvdC60Lggcm93czpcclxuICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBzcGVlZDogNDAwLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDQsXHJcbiAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiA0LFxyXG4gICAgICAgICAgICBwcmV2QXJyb3c6ICc8YnV0dG9uIGNsYXNzPVwicHJldiBhcnJvd1wiPjwvYnV0dG9uPicsXHJcbiAgICAgICAgICAgIG5leHRBcnJvdzogJzxidXR0b24gY2xhc3M9XCJuZXh0IGFycm93XCI+PC9idXR0b24+JyxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDEyMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycm93czogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogOTkyLFxyXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNsaWRlc1RvU2hvdzogMyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3BlZWQ6IDMwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2VudGVyTW9kZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyb3dzOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgYnJlYWtwb2ludDogNDgwLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIGFycm93czogZmFsc2UgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gfSxcclxuXHJcbiAgICAgICAgICAgICAgICAvLyB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgYnJlYWtwb2ludDogMzIwLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgIHByZXZBcnJvdzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICBuZXh0QXJyb3c6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgYXJyb3dzOiBmYWxzZSAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAgICAgLy8gWW91IGNhbiB1bnNsaWNrIGF0IGEgZ2l2ZW4gYnJlYWtwb2ludCBub3cgYnkgYWRkaW5nOlxyXG4gICAgICAgICAgICAgICAgLy8gc2V0dGluZ3M6IFwidW5zbGlja1wiXHJcbiAgICAgICAgICAgICAgICAvLyBpbnN0ZWFkIG9mIGEgc2V0dGluZ3Mgb2JqZWN0XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnLlNPTUVjYXRlZ29yeS1zbGlkZXInKS5zbGljayh7XHJcbiAgICAgICAgICAgIHJvd3M6IDIsXHJcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgIGN1c3RvbVBhZ2luZzogKHNsaWRlciwgaSkgPT4gYDxhPiR7aSArIDF9PC9hPmAsXHJcbiAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcclxuICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcclxuICAgICAgICAgICAgc3BlZWQ6IDYwMCxcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAzLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogM1xyXG4gICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gIFxyXG4gICAgXHJcbiAgICAvLyAkKGZ1bmN0aW9uKCl7XHJcbiAgICAvLyAgICAgJCgnLnByb2R1Y3QtbGlzdC1leHBlbmQnKS5jbGljayhmdW5jdGlvbigpe1xyXG4gICAgLy8gICAgICAgICAkKCcucHJvZHVjdC1saXN0JykudG9nZ2xlQ2xhc3MoJ3Byb2R1Y3Qtc2xpZGVyJyk7XHJcbiAgICAvLyAgICAgfSk7XHJcbiAgICAvLyB9KTtcclxuICAgICQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoXCIjZmlsdGVyX19yYW5nZVwiKS5zbGlkZXIoe1xyXG4gICAgICAgICAgIG1pbjogMCxcclxuICAgICAgICAgICBtYXg6IDUwMDAwLFxyXG4gICAgICAgICAgIHZhbHVlczogWzI1MDAwLDM1MDAwXSxcclxuICAgICAgICAgICByYW5nZTogdHJ1ZSxcclxuICAgICAgICAgICBzdG9wOiBmdW5jdGlvbihldmVudCwgdWkpIHtcclxuICAgICAgICAgICAkKFwiaW5wdXQjcHJpY2VNaW5cIikudmFsKCQoXCIjZmlsdGVyX19yYW5nZVwiKS5zbGlkZXIoXCJ2YWx1ZXNcIiwwKSk7XHJcbiAgICAgICAgICAgJChcImlucHV0I3ByaWNlTWF4XCIpLnZhbCgkKFwiI2ZpbHRlcl9fcmFuZ2VcIikuc2xpZGVyKFwidmFsdWVzXCIsMSkpO1xyXG4gXHJcbiAgICAgICAgIH0sXHJcbiAgICAgICAgIHNsaWRlOiBmdW5jdGlvbihldmVudCwgdWkpe1xyXG4gICAgICAgICAgICQoXCJpbnB1dCNwcmljZU1pblwiKS52YWwoJChcIiNmaWx0ZXJfX3JhbmdlXCIpLnNsaWRlcihcInZhbHVlc1wiLDApKTtcclxuICAgICAgICAgICAkKFwiaW5wdXQjcHJpY2VNYXhcIikudmFsKCQoXCIjZmlsdGVyX19yYW5nZVwiKS5zbGlkZXIoXCJ2YWx1ZXNcIiwxKSk7XHJcbiBcclxuICAgICAgICAgfVxyXG4gICAgICAgfSk7XHJcbiBcclxuICAgICAgICQoXCJpbnB1dCNwcmljZU1pblwiKS5vbignY2hhbmdlJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICB2YXIgdmFsdWUxPSQoXCJpbnB1dCNwcmljZU1pblwiKS52YWwoKTtcclxuICAgICAgICAgICB2YXIgdmFsdWUyPSQoXCJpbnB1dCNwcmljZU1heFwiKS52YWwoKTtcclxuICAgICAgICAgaWYocGFyc2VJbnQodmFsdWUxKSA+IHBhcnNlSW50KHZhbHVlMikpe1xyXG4gICAgICAgICAgICAgICB2YWx1ZTEgPSB2YWx1ZTI7XHJcbiAgICAgICAgICAgICAgICQoXCJpbnB1dCNwcmljZU1pblwiKS52YWwodmFsdWUxKTtcclxuICAgICAgIFxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICAkKFwiI2ZpbHRlcl9fcmFuZ2VcIikuc2xpZGVyKFwidmFsdWVzXCIsIDAsIHZhbHVlMSk7XHJcbiAgICAgXHJcbiAgICAgICB9KTtcclxuIFxyXG4gICAgICAgJChcImlucHV0I3ByaWNlTWF4XCIpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgIHZhciB2YWx1ZTE9JChcImlucHV0I3ByaWNlTWluXCIpLnZhbCgpO1xyXG4gICAgICAgICAgIHZhciB2YWx1ZTI9JChcImlucHV0I3ByaWNlTWF4XCIpLnZhbCgpO1xyXG4gICAgICAgICAgIGlmICh2YWx1ZTIgPiA1MDAwMCkgeyB2YWx1ZTIgPSA1MDAwMDsgJChcImlucHV0I3ByaWNlTWF4XCIpLnZhbCg1MDAwMCl9XHJcbiAgICAgICAgICAgaWYocGFyc2VJbnQodmFsdWUxKSA+IHBhcnNlSW50KHZhbHVlMikpe1xyXG4gICAgICAgICAgICAgICB2YWx1ZTIgPSB2YWx1ZTE7XHJcbiAgICAgICAgICAgICAgICQoXCJpbnB1dCNwcmljZU1heFwiKS52YWwodmFsdWUyKTtcclxuICAgICBcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgJChcIiNmaWx0ZXJfX3JhbmdlXCIpLnNsaWRlcihcInZhbHVlc1wiLDEsdmFsdWUyKTtcclxuICAgXHJcbiAgICAgICB9KTtcclxuICAgICB9KTtcclxuICAgICQoJy5wcm9kLWRlc2NyaXB0aW9uLXBpY3R1cmVfX2ltZy1tYXgnKS5zbGljayh7XHJcbiAgICAgIHNsaWRlc1RvU2hvdzogMSxcclxuICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgIGFycm93czogdHJ1ZSxcclxuICAgICAgaW5maW5pdGU6IGZhbHNlLFxyXG4gICAgICBmYWRlOiB0cnVlLFxyXG4gICAgICBhc05hdkZvcjogJy5wcm9kLWRlc2NyaXB0aW9uLXBpY3R1cmVfX2ltZy1taW4nXHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCcucHJvZC1kZXNjcmlwdGlvbi1waWN0dXJlX19pbWctbWluJykuc2xpY2soe1xyXG4gICAgICBzbGlkZXNUb1Nob3c6IDQsXHJcbiAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICBpbmZpbml0ZTogZmFsc2UsXHJcbiAgICAgIGFzTmF2Rm9yOiAnLnByb2QtZGVzY3JpcHRpb24tcGljdHVyZV9faW1nLW1heCcsXHJcbiAgICAgIC8vIGFycm93czogdHJ1ZSxcclxuICAgICAgcHJldkFycm93OiAnPGJ1dHRvbiBjbGFzcz1cInByZXZfdXAgYXJyb3cgYXJyb3dfcHJvZHVjdFwiPjwvYnV0dG9uPicsXHJcbiAgICAgIG5leHRBcnJvdzogJzxidXR0b24gY2xhc3M9XCJuZXh0X2Rvd24gYXJyb3cgYXJyb3dfcHJvZHVjdFwiPjwvYnV0dG9uPicsXHJcbiAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICB2ZXJ0aWNhbDogdHJ1ZSxcclxuICAgICAgdmVydGljYWxTd2lwaW5nOiB0cnVlLFxyXG4gICAgICAvLyBjZW50ZXJNb2RlOiB0cnVlLFxyXG4gICAgICBmb2N1c09uU2VsZWN0OiB0cnVlXHJcbiAgICB9KTtcclxuXHJcblxyXG5cclxuICAgIC8vIGpRdWVyeShkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICAgIC8vICAgICBmdW5jdGlvbiBjbGFzc0Z1bmN0aW9uKCl7XHJcbiAgICAvLyAgICAgICBpZihqUXVlcnkoJ2JvZHknKS53aWR0aCgpPDcwMCl7IGpRdWVyeSgnLmZvb3Rlci1oZWFkZXInKS5yZW1vdmVDbGFzcygnZm9vdGVyLWhlYWRlcicpLmFkZENsYXNzKCd0YWItaGVhZGVyJyk7XHJcbiAgICAvLyAgICAgICBqUXVlcnkoJy5mb290ZXItY29udGVudCcpLnJlbW92ZUNsYXNzKCdmb290ZXItY29udGVudCcpLmFkZENsYXNzKCd0YWItY29udGVudCcpO1xyXG4gICAgLy8gICAgICAgfVxyXG4gICAgLy8gICAgICAgZWxzZXtcclxuICAgIC8vICAgICAgICAgalF1ZXJ5KCcudGFiLWhlYWRlcicpLnJlbW92ZUNsYXNzKCd0YWItaGVhZGVyJykuYWRkQ2xhc3MoJ2Zvb3Rlci1oZWFkZXInKTtcclxuICAgIC8vICAgICAgICAgalF1ZXJ5KCcudGFiLWNvbnRlbnQnKS5yZW1vdmVDbGFzcygndGFiLWNvbnRlbnQnKS5hZGRDbGFzcygnZm9vdGVyLWNvbnRlbnQnKTtcclxuICAgIC8vICAgICAgIH1cclxuICAgIC8vICAgICB9XHJcbiAgICBcclxuICAgIC8vICAgICBjbGFzc0Z1bmN0aW9uKCk7XHJcbiAgICAvLyAgICAgalF1ZXJ5KHdpbmRvdykucmVzaXplKGNsYXNzRnVuY3Rpb24pO1xyXG4gICAgLy8gfSlcclxuICAgIC8vINCb0LDQudC6XHJcblxyXG4gICAgJCgnLmJ0bi1saWtlJykub24oJ2NsaWNrJyxmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdDtcclxuICAgICAgICAkKCcuZmEtaGVhcnQnKS50b2dnbGVDbGFzcygnZmFzJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQmtCw0YLQtdCz0L7RgNC40LhcclxuICAgICQoJy5oZWFkZXJfX2NhdGFsb2ctYnRuJykub24oJ2NsaWNrJyxmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdDtcclxuICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdoZWFkZXJfX2NhdGFsb2ctYnRuX2FjdGl2ZScpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vINCQ0LrQutC+0YDQtNC10L7QvdCxINGB0LDQudC00LHQsNGALdGE0LjQu9GM0YLRgFxyXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAkKCcudGFiLWhlYWRlcicpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnY29sbGFwc2UtYnRuX19hY3RpdmUnKS5uZXh0KCkuc2xpZGVUb2dnbGUoKTtcclxuICAgICAgICAgICAgLy8gJCgnLnRhYi1oZWFkZXInKS5ub3QodGhpcykucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlLWJ0bl9fYWN0aXZlJykubmV4dCgpLnNsaWRlVXAoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8vICQoJy5maWx0ZXJfX21vcmUnKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8gICAgICQoJy5jdXN0b20tY2hlY2tib3gnKS50b2dnbGVDbGFzcygnY3VzdG9tLWNoZWNrYm94X19hY3RpdmUnKTtcclxuICAgICAgICAvLyAgICAgLy8gJCgnLnRhYi1oZWFkZXInKS5ub3QodGhpcykucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlLWJ0bl9fYWN0aXZlJykubmV4dCgpLnNsaWRlVXAoKTtcclxuICAgICAgICAvLyB9KTtcclxuXHJcblxyXG4gICAgICAgICQoJy5idG5fX21vcmUnKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykucHJldigpLnRvZ2dsZUNsYXNzKCdmaWx0ZXJfX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAvLyAkKCcudGFiLWhlYWRlcicpLm5vdCh0aGlzKS5yZW1vdmVDbGFzcygnY29sbGFwc2UtYnRuX19hY3RpdmUnKS5uZXh0KCkuc2xpZGVVcCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyBidXR0b24gcXVhbnRpdHlcclxuXHJcbiAgICAkKCcuYWRkJykuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICgkKHRoaXMpLnByZXYoKS52YWwoKSA8IDEwKSB7XHJcbiAgICAgICAgJCh0aGlzKS5wcmV2KCkudmFsKCskKHRoaXMpLnByZXYoKS52YWwoKSArIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgJCgnLnN1YicpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoJCh0aGlzKS5uZXh0KCkudmFsKCkgPiAxKSB7XHJcbiAgICAgICAgaWYgKCQodGhpcykubmV4dCgpLnZhbCgpID4gMSkgJCh0aGlzKS5uZXh0KCkudmFsKCskKHRoaXMpLm5leHQoKS52YWwoKSAtIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyDQodC80LXQvdGP0Y7RidCw0Y/RgdGPXHJcblxyXG4gICAgJCgnLmJ0bl9jaGFuZ2UnKS5jbGljayhmdW5jdGlvbigpIHtcclxuICAgICAgICAkKHRoaXMpLnRleHQoZnVuY3Rpb24oaSwgdGV4dCkge1xyXG4gICAgICAgICAgcmV0dXJuIHRleHQgPT09IFwi0J/QvtC60LDQt9Cw0YLRjCDQtdGJ0LVcIiA/IFwi0KHQutGA0YvRgtGMXCIgOiBcItCf0L7QutCw0LfQsNGC0Ywg0LXRidC1XCI7XHJcbiAgICAgICAgfSlcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAkKCcuYnRuX2Jhc2tldCcpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQodGhpcykudGV4dChmdW5jdGlvbihpLCB0ZXh0KSB7XHJcbiAgICAgICAgICByZXR1cm4gdGV4dCA9PT0gXCLQkiDQutC+0YDQt9C40L3Rg1wiID8gXCLQo9C00LDQu9C40YLRjCDQuNC3INC60L7RgNC30LjQvdGLXCIgOiBcItCSINC60L7RgNC30LjQvdGDXCI7XHJcbiAgICAgICAgfSlcclxuICAgIH0pO1xyXG4gICAgLy8gdmFyIHJhdGluZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdGFyJyksXHJcbiAgICAvLyAgICAgcmF0aW5nSXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdGFyLWl0ZW0nKTtcclxuXHJcbiAgICAvLyByYXRpbmcub25jbGljayA9IGZ1bmN0aW9uKGUpe1xyXG4gICAgLy8gICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQ7XHJcbiAgICAvLyAgIGlmKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3N0YXItaXRlbScpKXtcclxuICAgIC8vICAgICByZW1vdmVDbGFzcyhyYXRpbmdJdGVtLCdhY3RpdmUnKVxyXG4gICAgLy8gICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuICAgIC8vICAgfVxyXG4gICAgLy8gfTtcclxuXHJcbiAgICAvLyBmdW5jdGlvbiByZW1vdmVDbGFzcyhlbGVtZW50cywgY2xhc3NOYW1lKSB7XHJcbiAgICAvLyAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgIC8vICAgICAgZWxlbWVudHNbaV0uY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xyXG4gICAgLy8gICB9XHJcbiAgICAvLyB9O1xyXG4gICAgLy8gY29uc3QgY2lyY2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJhdGluZy1yaW5nX19jaXJjbGUnKTtcclxuICAgIC8vIGNvbnN0IHJhZGl1cyA9IGNpcmNsZS5yLmJhc2VWYWwudmFsdWU7XHJcbiAgICAvLyBjb25zdCBjaXJjdW1mZXJlbmNlID0gMiAqIE1hdGguUEkgKiByYWRpdXM7XHJcblxyXG4gICAgLy8gY2lyY2xlLnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSBjaXJjdW1mZXJlbmNlO1xyXG4gICAgLy8gY2lyY2xlLnN0eWxlLnN0cm9rZURhc2hhcnJheSA9IGNpcmN1bWZlcmVuY2U7XHJcblxyXG5cclxuICAgIC8vIGZ1bmN0aW9uIHNldFByb2dyZXNzKHBlcmNlbnQpIHtcclxuICAgIC8vICAgICBjb25zdCBvZmZzZXQgPSBjaXJjdW1mZXJlbmNlIC0gcGVyY2VudCAvIDEwMCAqIGNpcmN1bWZlcmVuY2U7XHJcbiAgICAvLyAgICAgY2lyY2xlLnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSBvZmZzZXQ7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gc2V0UHJvZ3Jlc3MoNjQpO1xyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQpNC40LrRgdC40YDQvtCy0LDQvdC90YvQuSDRhdC10LTQtdGAXHJcbiAgICAgKi9cclxuXHJcbiAgICAvLyAkKHdpbmRvdykub24oJ3Njcm9sbCcsIHRvZ2dsZUZpeGVkSGVhZGVyKTtcclxuXHJcbiAgICAvLyBmdW5jdGlvbiB0b2dnbGVGaXhlZEhlYWRlcigpIHtcclxuICAgIC8vICAgICBjb25zdCAkaGVhZGVyID0gJCgnLmhlYWRlcicpO1xyXG4gICAgLy8gICAgIGNvbnN0ICRtYWluID0gJCgnLmhlYWRlcicpLm5leHQoKTtcclxuXHJcbiAgICAvLyAgICAgaWYgKHdpbmRvdy5wYWdlWU9mZnNldCA+IDApIHtcclxuICAgIC8vICAgICAgICAgJGhlYWRlci5hZGRDbGFzcygnaXMtZml4ZWQnKTtcclxuICAgIC8vICAgICAgICAgJG1haW4uY3NzKHsgbWFyZ2luVG9wOiAkaGVhZGVyLm91dGVySGVpZ2h0KCkgfSk7XHJcbiAgICAvLyAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgJGhlYWRlci5yZW1vdmVDbGFzcygnaXMtZml4ZWQnKTtcclxuICAgIC8vICAgICAgICAgJG1haW4uY3NzKHsgbWFyZ2luVG9wOiAwIH0pO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH1cclxuXHJcblxyXG5cclxuXHJcbjtcclxuXHJcbn0pO1xyXG4iXSwiZmlsZSI6ImludGVybmFsLmpzIn0=
