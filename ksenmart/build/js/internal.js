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
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          dots: false,
          arrows: false
        }
      }, {
        breakpoint: 600,
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
  }); // Лайк

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVybmFsLmpzIl0sIm5hbWVzIjpbIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiZ2xvYmFsT3B0aW9ucyIsInRpbWUiLCJkZXNrdG9wWGxTaXplIiwiZGVza3RvcExnU2l6ZSIsImRlc2t0b3BTaXplIiwidGFibGV0TGdTaXplIiwidGFibGV0U2l6ZSIsIm1vYmlsZUxnU2l6ZSIsIm1vYmlsZVNpemUiLCJwb3B1cHNCcmVha3BvaW50IiwicG9wdXBzRml4ZWRUaW1lb3V0IiwiaXNUb3VjaCIsImJyb3dzZXIiLCJtb2JpbGUiLCJsYW5nIiwiYXR0ciIsImJyZWFrcG9pbnRzIiwiYnJlYWtwb2ludERlc2t0b3BYbCIsIndpbmRvdyIsIm1hdGNoTWVkaWEiLCJicmVha3BvaW50RGVza3RvcExnIiwiYnJlYWtwb2ludERlc2t0b3AiLCJicmVha3BvaW50VGFibGV0TGciLCJicmVha3BvaW50VGFibGV0IiwiYnJlYWtwb2ludE1vYmlsZUxnU2l6ZSIsImJyZWFrcG9pbnRNb2JpbGUiLCJleHRlbmQiLCJsb2FkIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImZuIiwiYW5pbWF0ZUNzcyIsImFuaW1hdGlvbk5hbWUiLCJjYWxsYmFjayIsImFuaW1hdGlvbkVuZCIsImVsIiwiYW5pbWF0aW9ucyIsImFuaW1hdGlvbiIsIk9BbmltYXRpb24iLCJNb3pBbmltYXRpb24iLCJXZWJraXRBbmltYXRpb24iLCJ0Iiwic3R5bGUiLCJ1bmRlZmluZWQiLCJjcmVhdGVFbGVtZW50Iiwib25lIiwiQ3VzdG9tU2VsZWN0IiwiJGVsZW0iLCJzZWxmIiwiaW5pdCIsIiRpbml0RWxlbSIsImVhY2giLCJoYXNDbGFzcyIsInNlbGVjdFNlYXJjaCIsImRhdGEiLCJtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCIsIkluZmluaXR5Iiwic2VsZWN0MiIsInNlbGVjdE9uQmx1ciIsImRyb3Bkb3duQ3NzQ2xhc3MiLCJvbiIsImUiLCJmaW5kIiwiY29udGV4dCIsInZhbHVlIiwiY2xpY2siLCJ1cGRhdGUiLCIkdXBkYXRlRWxlbSIsImN1c3RvbUZpbGVJbnB1dCIsImkiLCJlbGVtIiwiYnV0dG9uV29yZCIsImNsYXNzTmFtZSIsIndyYXAiLCJwYXJlbnQiLCJwcmVwZW5kIiwiaHRtbCIsInByb21pc2UiLCJkb25lIiwibW91c2Vtb3ZlIiwiY3Vyc29yIiwiaW5wdXQiLCJ3cmFwcGVyIiwid3JhcHBlclgiLCJ3cmFwcGVyWSIsImlucHV0V2lkdGgiLCJpbnB1dEhlaWdodCIsImN1cnNvclgiLCJjdXJzb3JZIiwib2Zmc2V0IiwibGVmdCIsInRvcCIsIndpZHRoIiwiaGVpZ2h0IiwicGFnZVgiLCJwYWdlWSIsIm1vdmVJbnB1dFgiLCJtb3ZlSW5wdXRZIiwiY3NzIiwiZmlsZU5hbWUiLCJ2YWwiLCJuZXh0IiwicmVtb3ZlIiwicHJvcCIsImxlbmd0aCIsImZpbGVzIiwic3Vic3RyaW5nIiwibGFzdEluZGV4T2YiLCJzZWxlY3RlZEZpbGVOYW1lUGxhY2VtZW50Iiwic2libGluZ3MiLCJhZnRlciIsImN1c3RvbVNlbGVjdCIsImluZGV4IiwiZmllbGQiLCJ0cmltIiwiZXZlbnQiLCJsb2NhbGUiLCJQYXJzbGV5Iiwic2V0TG9jYWxlIiwib3B0aW9ucyIsInRyaWdnZXIiLCJ2YWxpZGF0aW9uVGhyZXNob2xkIiwiZXJyb3JzV3JhcHBlciIsImVycm9yVGVtcGxhdGUiLCJjbGFzc0hhbmRsZXIiLCJpbnN0YW5jZSIsIiRlbGVtZW50IiwidHlwZSIsIiRoYW5kbGVyIiwiZXJyb3JzQ29udGFpbmVyIiwiJGNvbnRhaW5lciIsImNsb3Nlc3QiLCJhZGRWYWxpZGF0b3IiLCJ2YWxpZGF0ZVN0cmluZyIsInRlc3QiLCJtZXNzYWdlcyIsInJ1IiwiZW4iLCJyZWdUZXN0IiwicmVnTWF0Y2giLCJtaW4iLCJhcmd1bWVudHMiLCJtYXgiLCJtaW5EYXRlIiwibWF4RGF0ZSIsInZhbHVlRGF0ZSIsInJlc3VsdCIsIm1hdGNoIiwiRGF0ZSIsIm1heFNpemUiLCJwYXJzbGV5SW5zdGFuY2UiLCJzaXplIiwicmVxdWlyZW1lbnRUeXBlIiwiZm9ybWF0cyIsImZpbGVFeHRlbnNpb24iLCJzcGxpdCIsInBvcCIsImZvcm1hdHNBcnIiLCJ2YWxpZCIsIiRibG9jayIsIiRsYXN0IiwiZWxlbWVudCIsInBhcnNsZXkiLCJpbnB1dG1hc2siLCJjbGVhck1hc2tPbkxvc3RGb2N1cyIsInNob3dNYXNrT25Ib3ZlciIsImRhdGVwaWNrZXIiLCJ1cGRhdGVTdmciLCIkdXNlRWxlbWVudCIsImhyZWYiLCJiYXNlVmFsIiwiZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zIiwiZGF0ZUZvcm1hdCIsInNob3dPdGhlck1vbnRocyIsIkRhdGVwaWNrZXIiLCJpdGVtT3B0aW9ucyIsIm9uU2VsZWN0IiwiY2hhbmdlIiwiRGF0ZXBpY2tlclJhbmdlIiwiZGF0ZXBpY2tlclJhbmdlIiwiZnJvbUl0ZW1PcHRpb25zIiwidG9JdGVtT3B0aW9ucyIsImRhdGVGcm9tIiwiZGF0ZVRvIiwiZ2V0RGF0ZSIsImlzVmFsaWQiLCJ2YWxpZGF0ZSIsImRhdGUiLCJwYXJzZURhdGUiLCJlcnJvciIsIlRhYlN3aXRjaGVyIiwidGFicyIsIm9wZW4iLCJ0YWJFbGVtIiwicHJldmVudERlZmF1bHQiLCJwYXJlbnRUYWJzIiwidG9nZ2xlQ2xhc3MiLCJ0YWJTd2l0Y2hlciIsIm9uT3V0c2lkZUNsaWNrSGlkZSIsInRhcmdldEVsZW0iLCJoaWRkZW5FbGVtIiwib3B0aW9uYWxDYiIsImJpbmQiLCJpcyIsInRhcmdldCIsInN0b3AiLCJmYWRlT3V0IiwidmlzaWJpbGl0eUNvbnRyb2wiLCJzZXR0aW5ncyIsInR5cGVzIiwic2V0VmlzaWJpbGl0eSIsInZpc2liaWxpdHlUeXBlIiwibGlzdCIsImRlbGF5IiwiZmFkZUluIiwiZGF0YVR5cGUiLCJ2aXNpYmlsaXR5TGlzdCIsIlNsaWRlciIsInNsaWRlciIsInN0ZXAiLCJ2YWx1ZXMiLCJyYW5nZSIsInNsaWRlIiwidWkiLCJjaGlsZHJlbiIsImFwcGVuZCIsIm9ubG9hZCIsIlBlcnNvbnMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsIm5vZGUiLCJhZGRFdmVudExpc3RlbmVyIiwiY3VycmVudCIsIm5leHRFbGVtZW50U2libGluZyIsInByZXZpb3VzRWxlbWVudFNpYmxpbmciLCJub3QiLCJoaWRlIiwiZXEiLCJtb2RhbENhbGwiLCJtb2RhbENsb3NlIiwiJHRoaXMiLCJtb2RhbElkIiwic2V0VGltZW91dCIsInRyYW5zZm9ybSIsIm1vZGFsUGFyZW50IiwicGFyZW50cyIsInN0b3BQcm9wYWdhdGlvbiIsImRvYyIsInNjIiwiZG4iLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwic2hvdyIsImRlZmluZSIsImFtZCIsImV4cG9ydHMiLCJtb2R1bGUiLCJyZXF1aXJlIiwialF1ZXJ5IiwiU2xpY2siLCJvIiwicyIsIm4iLCJkZWZhdWx0cyIsImFjY2Vzc2liaWxpdHkiLCJhZGFwdGl2ZUhlaWdodCIsImFwcGVuZEFycm93cyIsImFwcGVuZERvdHMiLCJhcnJvd3MiLCJhc05hdkZvciIsInByZXZBcnJvdyIsIm5leHRBcnJvdyIsImF1dG9wbGF5IiwiYXV0b3BsYXlTcGVlZCIsImNlbnRlck1vZGUiLCJjZW50ZXJQYWRkaW5nIiwiY3NzRWFzZSIsImN1c3RvbVBhZ2luZyIsInRleHQiLCJkb3RzIiwiZG90c0NsYXNzIiwiZHJhZ2dhYmxlIiwiZWFzaW5nIiwiZWRnZUZyaWN0aW9uIiwiZmFkZSIsImZvY3VzT25TZWxlY3QiLCJmb2N1c09uQ2hhbmdlIiwiaW5maW5pdGUiLCJpbml0aWFsU2xpZGUiLCJsYXp5TG9hZCIsIm1vYmlsZUZpcnN0IiwicGF1c2VPbkhvdmVyIiwicGF1c2VPbkZvY3VzIiwicGF1c2VPbkRvdHNIb3ZlciIsInJlc3BvbmRUbyIsInJlc3BvbnNpdmUiLCJyb3dzIiwicnRsIiwic2xpZGVzUGVyUm93Iiwic2xpZGVzVG9TaG93Iiwic2xpZGVzVG9TY3JvbGwiLCJzcGVlZCIsInN3aXBlIiwic3dpcGVUb1NsaWRlIiwidG91Y2hNb3ZlIiwidG91Y2hUaHJlc2hvbGQiLCJ1c2VDU1MiLCJ1c2VUcmFuc2Zvcm0iLCJ2YXJpYWJsZVdpZHRoIiwidmVydGljYWwiLCJ2ZXJ0aWNhbFN3aXBpbmciLCJ3YWl0Rm9yQW5pbWF0ZSIsInpJbmRleCIsImluaXRpYWxzIiwiYW5pbWF0aW5nIiwiZHJhZ2dpbmciLCJhdXRvUGxheVRpbWVyIiwiY3VycmVudERpcmVjdGlvbiIsImN1cnJlbnRMZWZ0IiwiY3VycmVudFNsaWRlIiwiZGlyZWN0aW9uIiwiJGRvdHMiLCJsaXN0V2lkdGgiLCJsaXN0SGVpZ2h0IiwibG9hZEluZGV4IiwiJG5leHRBcnJvdyIsIiRwcmV2QXJyb3ciLCJzY3JvbGxpbmciLCJzbGlkZUNvdW50Iiwic2xpZGVXaWR0aCIsIiRzbGlkZVRyYWNrIiwiJHNsaWRlcyIsInNsaWRpbmciLCJzbGlkZU9mZnNldCIsInN3aXBlTGVmdCIsInN3aXBpbmciLCIkbGlzdCIsInRvdWNoT2JqZWN0IiwidHJhbnNmb3Jtc0VuYWJsZWQiLCJ1bnNsaWNrZWQiLCJhY3RpdmVCcmVha3BvaW50IiwiYW5pbVR5cGUiLCJhbmltUHJvcCIsImJyZWFrcG9pbnRTZXR0aW5ncyIsImNzc1RyYW5zaXRpb25zIiwiZm9jdXNzZWQiLCJpbnRlcnJ1cHRlZCIsImhpZGRlbiIsInBhdXNlZCIsInBvc2l0aW9uUHJvcCIsInJvd0NvdW50Iiwic2hvdWxkQ2xpY2siLCIkc2xpZGVyIiwiJHNsaWRlc0NhY2hlIiwidHJhbnNmb3JtVHlwZSIsInRyYW5zaXRpb25UeXBlIiwidmlzaWJpbGl0eUNoYW5nZSIsIndpbmRvd1dpZHRoIiwid2luZG93VGltZXIiLCJvcmlnaW5hbFNldHRpbmdzIiwibW96SGlkZGVuIiwid2Via2l0SGlkZGVuIiwiYXV0b1BsYXkiLCJwcm94eSIsImF1dG9QbGF5Q2xlYXIiLCJhdXRvUGxheUl0ZXJhdG9yIiwiY2hhbmdlU2xpZGUiLCJjbGlja0hhbmRsZXIiLCJzZWxlY3RIYW5kbGVyIiwic2V0UG9zaXRpb24iLCJzd2lwZUhhbmRsZXIiLCJkcmFnSGFuZGxlciIsImtleUhhbmRsZXIiLCJpbnN0YW5jZVVpZCIsImh0bWxFeHByIiwicmVnaXN0ZXJCcmVha3BvaW50cyIsInByb3RvdHlwZSIsImFjdGl2YXRlQURBIiwidGFiaW5kZXgiLCJhZGRTbGlkZSIsInNsaWNrQWRkIiwidW5sb2FkIiwiYXBwZW5kVG8iLCJpbnNlcnRCZWZvcmUiLCJpbnNlcnRBZnRlciIsInByZXBlbmRUbyIsImRldGFjaCIsInJlaW5pdCIsImFuaW1hdGVIZWlnaHQiLCJvdXRlckhlaWdodCIsImFuaW1hdGVTbGlkZSIsImFuaW1TdGFydCIsImR1cmF0aW9uIiwiTWF0aCIsImNlaWwiLCJjb21wbGV0ZSIsImNhbGwiLCJhcHBseVRyYW5zaXRpb24iLCJkaXNhYmxlVHJhbnNpdGlvbiIsImdldE5hdlRhcmdldCIsInNsaWNrIiwic2xpZGVIYW5kbGVyIiwic2V0SW50ZXJ2YWwiLCJjbGVhckludGVydmFsIiwiYnVpbGRBcnJvd3MiLCJyZW1vdmVBdHRyIiwiYWRkIiwiYnVpbGREb3RzIiwiZ2V0RG90Q291bnQiLCJmaXJzdCIsImJ1aWxkT3V0Iiwid3JhcEFsbCIsInNldHVwSW5maW5pdGUiLCJ1cGRhdGVEb3RzIiwic2V0U2xpZGVDbGFzc2VzIiwiYnVpbGRSb3dzIiwiciIsImwiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50IiwiZCIsImEiLCJjIiwiZ2V0IiwiYXBwZW5kQ2hpbGQiLCJlbXB0eSIsImRpc3BsYXkiLCJjaGVja1Jlc3BvbnNpdmUiLCJpbm5lcldpZHRoIiwiaGFzT3duUHJvcGVydHkiLCJ1bnNsaWNrIiwicmVmcmVzaCIsImN1cnJlbnRUYXJnZXQiLCJtZXNzYWdlIiwiY2hlY2tOYXZpZ2FibGUiLCJnZXROYXZpZ2FibGVJbmRleGVzIiwiY2xlYW5VcEV2ZW50cyIsIm9mZiIsImludGVycnVwdCIsInZpc2liaWxpdHkiLCJjbGVhblVwU2xpZGVFdmVudHMiLCJvcmllbnRhdGlvbkNoYW5nZSIsInJlc2l6ZSIsImNsZWFuVXBSb3dzIiwic3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uIiwiZGVzdHJveSIsImZhZGVTbGlkZSIsIm9wYWNpdHkiLCJmYWRlU2xpZGVPdXQiLCJmaWx0ZXJTbGlkZXMiLCJzbGlja0ZpbHRlciIsImZpbHRlciIsImZvY3VzSGFuZGxlciIsImdldEN1cnJlbnQiLCJzbGlja0N1cnJlbnRTbGlkZSIsImdldExlZnQiLCJmbG9vciIsIm9mZnNldExlZnQiLCJvdXRlcldpZHRoIiwiZ2V0T3B0aW9uIiwic2xpY2tHZXRPcHRpb24iLCJwdXNoIiwiZ2V0U2xpY2siLCJnZXRTbGlkZUNvdW50IiwiYWJzIiwiZ29UbyIsInNsaWNrR29UbyIsInBhcnNlSW50Iiwic2V0UHJvcHMiLCJzdGFydExvYWQiLCJsb2FkU2xpZGVyIiwiaW5pdGlhbGl6ZUV2ZW50cyIsInVwZGF0ZUFycm93cyIsImluaXRBREEiLCJpbmRleE9mIiwicm9sZSIsImlkIiwiZW5kIiwiaW5pdEFycm93RXZlbnRzIiwiaW5pdERvdEV2ZW50cyIsImluaXRTbGlkZUV2ZW50cyIsImFjdGlvbiIsImluaXRVSSIsInRhZ05hbWUiLCJrZXlDb2RlIiwib25lcnJvciIsInNyYyIsInNsaWNlIiwicHJvZ3Jlc3NpdmVMYXp5TG9hZCIsInNsaWNrTmV4dCIsInBhdXNlIiwic2xpY2tQYXVzZSIsInBsYXkiLCJzbGlja1BsYXkiLCJwb3N0U2xpZGUiLCJmb2N1cyIsInByZXYiLCJzbGlja1ByZXYiLCJicmVha3BvaW50Iiwic3BsaWNlIiwic29ydCIsImNsZWFyVGltZW91dCIsIndpbmRvd0RlbGF5IiwicmVtb3ZlU2xpZGUiLCJzbGlja1JlbW92ZSIsInNldENTUyIsInNldERpbWVuc2lvbnMiLCJwYWRkaW5nIiwic2V0RmFkZSIsInBvc2l0aW9uIiwicmlnaHQiLCJzZXRIZWlnaHQiLCJzZXRPcHRpb24iLCJzbGlja1NldE9wdGlvbiIsImJvZHkiLCJXZWJraXRUcmFuc2l0aW9uIiwiTW96VHJhbnNpdGlvbiIsIm1zVHJhbnNpdGlvbiIsIk9UcmFuc2Zvcm0iLCJwZXJzcGVjdGl2ZVByb3BlcnR5Iiwid2Via2l0UGVyc3BlY3RpdmUiLCJNb3pUcmFuc2Zvcm0iLCJNb3pQZXJzcGVjdGl2ZSIsIndlYmtpdFRyYW5zZm9ybSIsIm1zVHJhbnNmb3JtIiwiY2xvbmUiLCJzd2lwZURpcmVjdGlvbiIsInN0YXJ0WCIsImN1clgiLCJzdGFydFkiLCJjdXJZIiwiYXRhbjIiLCJyb3VuZCIsIlBJIiwic3dpcGVFbmQiLCJzd2lwZUxlbmd0aCIsImVkZ2VIaXQiLCJtaW5Td2lwZSIsImZpbmdlckNvdW50Iiwib3JpZ2luYWxFdmVudCIsInRvdWNoZXMiLCJzd2lwZVN0YXJ0Iiwic3dpcGVNb3ZlIiwiY2xpZW50WCIsImNsaWVudFkiLCJzcXJ0IiwicG93IiwidW5maWx0ZXJTbGlkZXMiLCJzbGlja1VuZmlsdGVyIiwiQXJyYXkiLCJhcHBseSIsInZhbHVlMSIsInZhbHVlMiIsInNsaWRlVG9nZ2xlIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVlDLEtBQVosQ0FBa0IsWUFBVztBQUN6Qjs7O0FBR0EsTUFBSUMsYUFBYSxHQUFHO0FBQ2hCO0FBQ0FDLElBQUFBLElBQUksRUFBRyxHQUZTO0FBSWhCO0FBQ0FDLElBQUFBLGFBQWEsRUFBRSxJQUxDO0FBTWhCQyxJQUFBQSxhQUFhLEVBQUUsSUFOQztBQU9oQkMsSUFBQUEsV0FBVyxFQUFJLElBUEM7QUFRaEJDLElBQUFBLFlBQVksRUFBSSxJQVJBO0FBU2hCQyxJQUFBQSxVQUFVLEVBQU0sR0FUQTtBQVVoQkMsSUFBQUEsWUFBWSxFQUFJLEdBVkE7QUFXaEJDLElBQUFBLFVBQVUsRUFBTSxHQVhBO0FBYWhCO0FBQ0FDLElBQUFBLGdCQUFnQixFQUFFLEdBZEY7QUFnQmhCO0FBQ0FDLElBQUFBLGtCQUFrQixFQUFFLElBakJKO0FBbUJoQjtBQUNBQyxJQUFBQSxPQUFPLEVBQUVkLENBQUMsQ0FBQ2UsT0FBRixDQUFVQyxNQXBCSDtBQXNCaEJDLElBQUFBLElBQUksRUFBRWpCLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVWtCLElBQVYsQ0FBZSxNQUFmO0FBdEJVLEdBQXBC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QztBQUNELEtBRkQ7QUFHSCxHQUpEO0FBT0F6UixFQUFBQSxDQUFDLENBQUMsYUFBRCxDQUFELENBQWlCb0UsS0FBakIsQ0FBdUIsWUFBVztBQUM5QnBFLElBQUFBLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUXlSLElBQVIsQ0FBYSxVQUFTak4sQ0FBVCxFQUFZaU4sSUFBWixFQUFrQjtBQUM3QixhQUFPQSxJQUFJLEtBQUssV0FBVCxHQUF1QixvQkFBdkIsR0FBOEMsV0FBckQ7QUFDRCxLQUZEO0FBR0gsR0FKRCxFQXh6Q3lCLENBNnpDekI7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUlBOzs7QUFJQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBS0o7QUFFQyxDQXQzQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgIC8qKlxyXG4gICAgICog0JPQu9C+0LHQsNC70YzQvdGL0LUg0L/QtdGA0LXQvNC10L3QvdGL0LUsINC60L7RgtC+0YDRi9C1INC40YHQv9C+0LvRjNC30YPRjtGC0YHRjyDQvNC90L7Qs9C+0LrRgNCw0YLQvdC+XHJcbiAgICAgKi9cclxuICAgIGxldCBnbG9iYWxPcHRpb25zID0ge1xyXG4gICAgICAgIC8vINCS0YDQtdC80Y8g0LTQu9GPINCw0L3QuNC80LDRhtC40LlcclxuICAgICAgICB0aW1lOiAgMjAwLFxyXG5cclxuICAgICAgICAvLyDQmtC+0L3RgtGA0L7Qu9GM0L3Ri9C1INGC0L7Rh9C60Lgg0LDQtNCw0L/RgtC40LLQsFxyXG4gICAgICAgIGRlc2t0b3BYbFNpemU6IDE5MjAsXHJcbiAgICAgICAgZGVza3RvcExnU2l6ZTogMTYwMCxcclxuICAgICAgICBkZXNrdG9wU2l6ZTogICAxMjgwLFxyXG4gICAgICAgIHRhYmxldExnU2l6ZTogICAxMDI0LFxyXG4gICAgICAgIHRhYmxldFNpemU6ICAgICA3NjgsXHJcbiAgICAgICAgbW9iaWxlTGdTaXplOiAgIDY0MCxcclxuICAgICAgICBtb2JpbGVTaXplOiAgICAgNDgwLFxyXG5cclxuICAgICAgICAvLyDQotC+0YfQutCwINC/0LXRgNC10YXQvtC00LAg0L/QvtC/0LDQv9C+0LIg0L3QsCDRhNGD0LvRgdC60YDQuNC9XHJcbiAgICAgICAgcG9wdXBzQnJlYWtwb2ludDogNzY4LFxyXG5cclxuICAgICAgICAvLyDQktGA0LXQvNGPINC00L4g0YHQvtC60YDRi9GC0LjRjyDRhNC40LrRgdC40YDQvtCy0LDQvdC90YvRhSDQv9C+0L/QsNC/0L7QslxyXG4gICAgICAgIHBvcHVwc0ZpeGVkVGltZW91dDogNTAwMCxcclxuXHJcbiAgICAgICAgLy8g0J/RgNC+0LLQtdGA0LrQsCB0b3VjaCDRg9GB0YLRgNC+0LnRgdGC0LJcclxuICAgICAgICBpc1RvdWNoOiAkLmJyb3dzZXIubW9iaWxlLFxyXG5cclxuICAgICAgICBsYW5nOiAkKCdodG1sJykuYXR0cignbGFuZycpXHJcbiAgICB9O1xyXG5cclxuICAgIC8vINCR0YDQtdC50LrQv9C+0LjQvdGC0Ysg0LDQtNCw0L/RgtC40LLQsFxyXG4gICAgLy8gQGV4YW1wbGUgaWYgKGdsb2JhbE9wdGlvbnMuYnJlYWtwb2ludFRhYmxldC5tYXRjaGVzKSB7fSBlbHNlIHt9XHJcbiAgICBjb25zdCBicmVha3BvaW50cyA9IHtcclxuICAgICAgICBicmVha3BvaW50RGVza3RvcFhsOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLmRlc2t0b3BYbFNpemUgLSAxfXB4KWApLFxyXG4gICAgICAgIGJyZWFrcG9pbnREZXNrdG9wTGc6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMuZGVza3RvcExnU2l6ZSAtIDF9cHgpYCksXHJcbiAgICAgICAgYnJlYWtwb2ludERlc2t0b3A6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMuZGVza3RvcFNpemUgLSAxfXB4KWApLFxyXG4gICAgICAgIGJyZWFrcG9pbnRUYWJsZXRMZzogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy50YWJsZXRMZ1NpemUgLSAxfXB4KWApLFxyXG4gICAgICAgIGJyZWFrcG9pbnRUYWJsZXQ6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMudGFibGV0U2l6ZSAtIDF9cHgpYCksXHJcbiAgICAgICAgYnJlYWtwb2ludE1vYmlsZUxnU2l6ZTogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5tb2JpbGVMZ1NpemUgLSAxfXB4KWApLFxyXG4gICAgICAgIGJyZWFrcG9pbnRNb2JpbGU6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMubW9iaWxlU2l6ZSAtIDF9cHgpYClcclxuICAgIH07XHJcblxyXG4gICAgJC5leHRlbmQodHJ1ZSwgZ2xvYmFsT3B0aW9ucywgYnJlYWtwb2ludHMpO1xyXG5cclxuXHJcblxyXG5cclxuICAgICQod2luZG93KS5sb2FkKCgpID0+IHtcclxuICAgICAgICBpZiAoZ2xvYmFsT3B0aW9ucy5pc1RvdWNoKSB7XHJcbiAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygndG91Y2gnKS5yZW1vdmVDbGFzcygnbm8tdG91Y2gnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ25vLXRvdWNoJykucmVtb3ZlQ2xhc3MoJ3RvdWNoJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBpZiAoJCgndGV4dGFyZWEnKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgLy8gICAgIGF1dG9zaXplKCQoJ3RleHRhcmVhJykpO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0L7QtNC60LvRjtGH0LXQvdC40LUganMgcGFydGlhbHNcclxuICAgICAqL1xyXG4gICAgLyogZm9ybV9zdHlsZS5qcyDQtNC+0LvQttC10L0g0LHRi9GC0Ywg0LLRi9C/0L7Qu9C90LXQvSDQv9C10YDQtdC0IGZvcm1fdmFsaWRhdGlvbi5qcyAqL1xyXG4gICAgLyoqXHJcbiAgICAgKiDQoNCw0YHRiNC40YDQtdC90LjQtSBhbmltYXRlLmNzc1xyXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBhbmltYXRpb25OYW1lINC90LDQt9Cy0LDQvdC40LUg0LDQvdC40LzQsNGG0LjQuFxyXG4gICAgICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrINGE0YPQvdC60YbQuNGPLCDQutC+0YLQvtGA0LDRjyDQvtGC0YDQsNCx0L7RgtCw0LXRgiDQv9C+0YHQu9C1INC30LDQstC10YDRiNC10L3QuNGPINCw0L3QuNC80LDRhtC40LhcclxuICAgICAqIEByZXR1cm4ge09iamVjdH0g0L7QsdGK0LXQutGCINCw0L3QuNC80LDRhtC40LhcclxuICAgICAqIFxyXG4gICAgICogQHNlZSAgaHR0cHM6Ly9kYW5lZGVuLmdpdGh1Yi5pby9hbmltYXRlLmNzcy9cclxuICAgICAqIFxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqICQoJyN5b3VyRWxlbWVudCcpLmFuaW1hdGVDc3MoJ2JvdW5jZScpO1xyXG4gICAgICogXHJcbiAgICAgKiAkKCcjeW91ckVsZW1lbnQnKS5hbmltYXRlQ3NzKCdib3VuY2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAqICAgICAvLyDQlNC10LvQsNC10Lwg0YfRgtC+LdGC0L4g0L/QvtGB0LvQtSDQt9Cw0LLQtdGA0YjQtdC90LjRjyDQsNC90LjQvNCw0YbQuNC4XHJcbiAgICAgKiB9KTtcclxuICAgICAqL1xyXG4gICAgJC5mbi5leHRlbmQoe1xyXG4gICAgICAgIGFuaW1hdGVDc3M6IGZ1bmN0aW9uKGFuaW1hdGlvbk5hbWUsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGxldCBhbmltYXRpb25FbmQgPSAoZnVuY3Rpb24oZWwpIHtcclxuICAgICAgICAgICAgICAgIGxldCBhbmltYXRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogJ2FuaW1hdGlvbmVuZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgT0FuaW1hdGlvbjogJ29BbmltYXRpb25FbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgIE1vekFuaW1hdGlvbjogJ21vekFuaW1hdGlvbkVuZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgV2Via2l0QW5pbWF0aW9uOiAnd2Via2l0QW5pbWF0aW9uRW5kJyxcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdCBpbiBhbmltYXRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsLnN0eWxlW3RdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFuaW1hdGlvbnNbdF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KShkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZENsYXNzKCdhbmltYXRlZCAnICsgYW5pbWF0aW9uTmFtZSkub25lKGFuaW1hdGlvbkVuZCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdhbmltYXRlZCAnICsgYW5pbWF0aW9uTmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIC8qKlxyXG4gICAgICog0KHRgtC40LvQuNC30YPQtdGCINGB0LXQu9C10LrRgtGLINGBINC/0L7QvNC+0YnRjNGOINC/0LvQsNCz0LjQvdCwIHNlbGVjdDJcclxuICAgICAqIGh0dHBzOi8vc2VsZWN0Mi5naXRodWIuaW9cclxuICAgICAqL1xyXG4gICAgbGV0IEN1c3RvbVNlbGVjdCA9IGZ1bmN0aW9uKCRlbGVtKSB7XHJcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLmluaXQgPSBmdW5jdGlvbigkaW5pdEVsZW0pIHtcclxuICAgICAgICAgICAgJGluaXRFbGVtLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0U2VhcmNoID0gJCh0aGlzKS5kYXRhKCdzZWFyY2gnKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RTZWFyY2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2ggPSAxOyAvLyDQv9C+0LrQsNC30YvQstCw0LXQvCDQv9C+0LvQtSDQv9C+0LjRgdC60LBcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCA9IEluZmluaXR5OyAvLyDQvdC1INC/0L7QutCw0LfRi9Cy0LDQtdC8INC/0L7Qu9C1INC/0L7QuNGB0LrQsFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5zZWxlY3QyKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RPbkJsdXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyb3Bkb3duQ3NzQ2xhc3M6ICdlcnJvcidcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5vbignY2hhbmdlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDQvdGD0LbQvdC+INC00LvRjyDQstGL0LvQuNC00LDRhtC40Lgg0L3QsCDQu9C10YLRg1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoYG9wdGlvblt2YWx1ZT1cIiR7JCh0aGlzKS5jb250ZXh0LnZhbHVlfVwiXWApLmNsaWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlID0gZnVuY3Rpb24oJHVwZGF0ZUVsZW0pIHtcclxuICAgICAgICAgICAgJHVwZGF0ZUVsZW0uc2VsZWN0MignZGVzdHJveScpO1xyXG4gICAgICAgICAgICBzZWxmLmluaXQoJHVwZGF0ZUVsZW0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuaW5pdCgkZWxlbSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHRgtC40LvQuNC30YPQtdGCIGZpbGUgaW5wdXRcclxuICAgICAqIGh0dHA6Ly9ncmVncGlrZS5uZXQvZGVtb3MvYm9vdHN0cmFwLWZpbGUtaW5wdXQvZGVtby5odG1sXHJcbiAgICAgKi9cclxuICAgICQuZm4uY3VzdG9tRmlsZUlucHV0ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbihpLCBlbGVtKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCAkZWxlbSA9ICQoZWxlbSk7XHJcblxyXG4gICAgICAgICAgICAvLyBNYXliZSBzb21lIGZpZWxkcyBkb24ndCBuZWVkIHRvIGJlIHN0YW5kYXJkaXplZC5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiAkZWxlbS5hdHRyKCdkYXRhLWJmaS1kaXNhYmxlZCcpICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgdGhlIHdvcmQgdG8gYmUgZGlzcGxheWVkIG9uIHRoZSBidXR0b25cclxuICAgICAgICAgICAgbGV0IGJ1dHRvbldvcmQgPSAnQnJvd3NlJztcclxuICAgICAgICAgICAgbGV0IGNsYXNzTmFtZSA9ICcnO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiAkZWxlbS5hdHRyKCd0aXRsZScpICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uV29yZCA9ICRlbGVtLmF0dHIoJ3RpdGxlJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghISRlbGVtLmF0dHIoJ2NsYXNzJykpIHtcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZSA9ICcgJyArICRlbGVtLmF0dHIoJ2NsYXNzJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIE5vdyB3ZSdyZSBnb2luZyB0byB3cmFwIHRoYXQgaW5wdXQgZmllbGQgd2l0aCBhIGJ1dHRvbi5cclxuICAgICAgICAgICAgLy8gVGhlIGlucHV0IHdpbGwgYWN0dWFsbHkgc3RpbGwgYmUgdGhlcmUsIGl0IHdpbGwganVzdCBiZSBmbG9hdCBhYm92ZSBhbmQgdHJhbnNwYXJlbnQgKGRvbmUgd2l0aCB0aGUgQ1NTKS5cclxuICAgICAgICAgICAgJGVsZW0ud3JhcChgPGRpdiBjbGFzcz1cImN1c3RvbS1maWxlXCI+PGEgY2xhc3M9XCJidG4gJHtjbGFzc05hbWV9XCI+PC9hPjwvZGl2PmApLnBhcmVudCgpLnByZXBlbmQoJCgnPHNwYW4+PC9zcGFuPicpLmh0bWwoYnV0dG9uV29yZCkpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8vIEFmdGVyIHdlIGhhdmUgZm91bmQgYWxsIG9mIHRoZSBmaWxlIGlucHV0cyBsZXQncyBhcHBseSBhIGxpc3RlbmVyIGZvciB0cmFja2luZyB0aGUgbW91c2UgbW92ZW1lbnQuXHJcbiAgICAgICAgLy8gVGhpcyBpcyBpbXBvcnRhbnQgYmVjYXVzZSB0aGUgaW4gb3JkZXIgdG8gZ2l2ZSB0aGUgaWxsdXNpb24gdGhhdCB0aGlzIGlzIGEgYnV0dG9uIGluIEZGIHdlIGFjdHVhbGx5IG5lZWQgdG8gbW92ZSB0aGUgYnV0dG9uIGZyb20gdGhlIGZpbGUgaW5wdXQgdW5kZXIgdGhlIGN1cnNvci4gVWdoLlxyXG4gICAgICAgIC5wcm9taXNlKCkuZG9uZShmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEFzIHRoZSBjdXJzb3IgbW92ZXMgb3ZlciBvdXIgbmV3IGJ1dHRvbiB3ZSBuZWVkIHRvIGFkanVzdCB0aGUgcG9zaXRpb24gb2YgdGhlIGludmlzaWJsZSBmaWxlIGlucHV0IEJyb3dzZSBidXR0b24gdG8gYmUgdW5kZXIgdGhlIGN1cnNvci5cclxuICAgICAgICAgICAgLy8gVGhpcyBnaXZlcyB1cyB0aGUgcG9pbnRlciBjdXJzb3IgdGhhdCBGRiBkZW5pZXMgdXNcclxuICAgICAgICAgICAgJCgnLmN1c3RvbS1maWxlJykubW91c2Vtb3ZlKGZ1bmN0aW9uKGN1cnNvcikge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpbnB1dCwgd3JhcHBlcixcclxuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyWCwgd3JhcHBlclksXHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRXaWR0aCwgaW5wdXRIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yWCwgY3Vyc29yWTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUaGlzIHdyYXBwZXIgZWxlbWVudCAodGhlIGJ1dHRvbiBzdXJyb3VuZCB0aGlzIGZpbGUgaW5wdXQpXHJcbiAgICAgICAgICAgICAgICB3cmFwcGVyID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIC8vIFRoZSBpbnZpc2libGUgZmlsZSBpbnB1dCBlbGVtZW50XHJcbiAgICAgICAgICAgICAgICBpbnB1dCA9IHdyYXBwZXIuZmluZCgnaW5wdXQnKTtcclxuICAgICAgICAgICAgICAgIC8vIFRoZSBsZWZ0LW1vc3QgcG9zaXRpb24gb2YgdGhlIHdyYXBwZXJcclxuICAgICAgICAgICAgICAgIHdyYXBwZXJYID0gd3JhcHBlci5vZmZzZXQoKS5sZWZ0O1xyXG4gICAgICAgICAgICAgICAgLy8gVGhlIHRvcC1tb3N0IHBvc2l0aW9uIG9mIHRoZSB3cmFwcGVyXHJcbiAgICAgICAgICAgICAgICB3cmFwcGVyWSA9IHdyYXBwZXIub2Zmc2V0KCkudG9wO1xyXG4gICAgICAgICAgICAgICAgLy8gVGhlIHdpdGggb2YgdGhlIGJyb3dzZXJzIGlucHV0IGZpZWxkXHJcbiAgICAgICAgICAgICAgICBpbnB1dFdpZHRoID0gaW5wdXQud2lkdGgoKTtcclxuICAgICAgICAgICAgICAgIC8vIFRoZSBoZWlnaHQgb2YgdGhlIGJyb3dzZXJzIGlucHV0IGZpZWxkXHJcbiAgICAgICAgICAgICAgICBpbnB1dEhlaWdodCA9IGlucHV0LmhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgLy9UaGUgcG9zaXRpb24gb2YgdGhlIGN1cnNvciBpbiB0aGUgd3JhcHBlclxyXG4gICAgICAgICAgICAgICAgY3Vyc29yWCA9IGN1cnNvci5wYWdlWDtcclxuICAgICAgICAgICAgICAgIGN1cnNvclkgPSBjdXJzb3IucGFnZVk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9UaGUgcG9zaXRpb25zIHdlIGFyZSB0byBtb3ZlIHRoZSBpbnZpc2libGUgZmlsZSBpbnB1dFxyXG4gICAgICAgICAgICAgICAgLy8gVGhlIDIwIGF0IHRoZSBlbmQgaXMgYW4gYXJiaXRyYXJ5IG51bWJlciBvZiBwaXhlbHMgdGhhdCB3ZSBjYW4gc2hpZnQgdGhlIGlucHV0IHN1Y2ggdGhhdCBjdXJzb3IgaXMgbm90IHBvaW50aW5nIGF0IHRoZSBlbmQgb2YgdGhlIEJyb3dzZSBidXR0b24gYnV0IHNvbWV3aGVyZSBuZWFyZXIgdGhlIG1pZGRsZVxyXG4gICAgICAgICAgICAgICAgbW92ZUlucHV0WCA9IGN1cnNvclggLSB3cmFwcGVyWCAtIGlucHV0V2lkdGggKyAyMDtcclxuICAgICAgICAgICAgICAgIC8vIFNsaWRlcyB0aGUgaW52aXNpYmxlIGlucHV0IEJyb3dzZSBidXR0b24gdG8gYmUgcG9zaXRpb25lZCBtaWRkbGUgdW5kZXIgdGhlIGN1cnNvclxyXG4gICAgICAgICAgICAgICAgbW92ZUlucHV0WSA9IGN1cnNvclkgLSB3cmFwcGVyWSAtIChpbnB1dEhlaWdodCAvIDIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEFwcGx5IHRoZSBwb3NpdGlvbmluZyBzdHlsZXMgdG8gYWN0dWFsbHkgbW92ZSB0aGUgaW52aXNpYmxlIGZpbGUgaW5wdXRcclxuICAgICAgICAgICAgICAgIGlucHV0LmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogbW92ZUlucHV0WCxcclxuICAgICAgICAgICAgICAgICAgICB0b3A6IG1vdmVJbnB1dFlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICQoJ2JvZHknKS5vbignY2hhbmdlJywgJy5jdXN0b20tZmlsZSBpbnB1dFt0eXBlPWZpbGVdJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGZpbGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgZmlsZU5hbWUgPSAkKHRoaXMpLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBhbnkgcHJldmlvdXMgZmlsZSBuYW1lc1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5uZXh0KCcuY3VzdG9tLWZpbGVfX25hbWUnKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIGlmICghISQodGhpcykucHJvcCgnZmlsZXMnKSAmJiAkKHRoaXMpLnByb3AoJ2ZpbGVzJykubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lID0gJCh0aGlzKVswXS5maWxlcy5sZW5ndGggKyAnIGZpbGVzJztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWUgPSBmaWxlTmFtZS5zdWJzdHJpbmcoZmlsZU5hbWUubGFzdEluZGV4T2YoJ1xcXFwnKSArIDEsIGZpbGVOYW1lLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gRG9uJ3QgdHJ5IHRvIHNob3cgdGhlIG5hbWUgaWYgdGhlcmUgaXMgbm9uZVxyXG4gICAgICAgICAgICAgICAgaWYgKCFmaWxlTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWRGaWxlTmFtZVBsYWNlbWVudCA9ICQodGhpcykuZGF0YSgnZmlsZW5hbWUtcGxhY2VtZW50Jyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRGaWxlTmFtZVBsYWNlbWVudCA9PT0gJ2luc2lkZScpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBQcmludCB0aGUgZmlsZU5hbWUgaW5zaWRlXHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnc3BhbicpLmh0bWwoZmlsZU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cigndGl0bGUnLCBmaWxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFByaW50IHRoZSBmaWxlTmFtZSBhc2lkZSAocmlnaHQgYWZ0ZXIgdGhlIHRoZSBidXR0b24pXHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5hZnRlcihgPHNwYW4gY2xhc3M9XCJjdXN0b20tZmlsZV9fbmFtZVwiPiR7ZmlsZU5hbWV9IDwvc3Bhbj5gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgJCgnaW5wdXRbdHlwZT1cImZpbGVcIl0nKS5jdXN0b21GaWxlSW5wdXQoKTtcclxuICAgIC8vICQoJ3NlbGVjdCcpLmN1c3RvbVNlbGVjdCgpO1xyXG4gICAgdmFyIGN1c3RvbVNlbGVjdCA9IG5ldyBDdXN0b21TZWxlY3QoJCgnc2VsZWN0JykpO1xyXG5cclxuICAgIGlmICgkKCcuanMtbGFiZWwtYW5pbWF0aW9uJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINCQ0L3QuNC80LDRhtC40Y8g0Y3Qu9C10LzQtdC90YLQsCBsYWJlbCDQv9GA0Lgg0YTQvtC60YPRgdC1INC/0L7Qu9C10Lkg0YTQvtGA0LzRi1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgICQoJy5qcy1sYWJlbC1hbmltYXRpb24nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xyXG4gICAgICAgICAgICBjb25zdCBmaWVsZCA9ICQoZWwpLmZpbmQoJ2lucHV0LCB0ZXh0YXJlYScpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCQoZmllbGQpLnZhbCgpLnRyaW0oKSAhPSAnJykge1xyXG4gICAgICAgICAgICAgICAgJChlbCkuYWRkQ2xhc3MoJ2lzLWZpbGxlZCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkKGZpZWxkKS5vbignZm9jdXMnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgJChlbCkuYWRkQ2xhc3MoJ2lzLWZpbGxlZCcpO1xyXG4gICAgICAgICAgICB9KS5vbignYmx1cicsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS52YWwoKS50cmltKCkgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChlbCkucmVtb3ZlQ2xhc3MoJ2lzLWZpbGxlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbG9jYWxlID0gZ2xvYmFsT3B0aW9ucy5sYW5nID09ICdydS1SVScgPyAncnUnIDogJ2VuJztcclxuXHJcbiAgICBQYXJzbGV5LnNldExvY2FsZShsb2NhbGUpO1xyXG5cclxuICAgIC8qINCd0LDRgdGC0YDQvtC50LrQuCBQYXJzbGV5ICovXHJcbiAgICAkLmV4dGVuZChQYXJzbGV5Lm9wdGlvbnMsIHtcclxuICAgICAgICB0cmlnZ2VyOiAnYmx1ciBjaGFuZ2UnLCAvLyBjaGFuZ2Ug0L3Rg9C20LXQvSDQtNC70Y8gc2VsZWN0J9CwXHJcbiAgICAgICAgdmFsaWRhdGlvblRocmVzaG9sZDogJzAnLFxyXG4gICAgICAgIGVycm9yc1dyYXBwZXI6ICc8ZGl2PjwvZGl2PicsXHJcbiAgICAgICAgZXJyb3JUZW1wbGF0ZTogJzxwIGNsYXNzPVwicGFyc2xleS1lcnJvci1tZXNzYWdlXCI+PC9wPicsXHJcbiAgICAgICAgY2xhc3NIYW5kbGVyOiBmdW5jdGlvbihpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICBjb25zdCAkZWxlbWVudCA9IGluc3RhbmNlLiRlbGVtZW50O1xyXG4gICAgICAgICAgICBsZXQgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcclxuICAgICAgICAgICAgICAgICRoYW5kbGVyO1xyXG4gICAgICAgICAgICBpZiAodHlwZSA9PSAnY2hlY2tib3gnIHx8IHR5cGUgPT0gJ3JhZGlvJykge1xyXG4gICAgICAgICAgICAgICAgJGhhbmRsZXIgPSAkZWxlbWVudDsgLy8g0YLQviDQtdGB0YLRjCDQvdC40YfQtdCz0L4g0L3QtSDQstGL0LTQtdC70Y/QtdC8IChpbnB1dCDRgdC60YDRi9GCKSwg0LjQvdCw0YfQtSDQstGL0LTQtdC70Y/QtdGCINGA0L7QtNC40YLQtdC70YzRgdC60LjQuSDQsdC70L7QulxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcclxuICAgICAgICAgICAgICAgICRoYW5kbGVyID0gJCgnLnNlbGVjdDItc2VsZWN0aW9uLS1zaW5nbGUnLCAkZWxlbWVudC5uZXh0KCcuc2VsZWN0MicpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRoYW5kbGVyO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXJyb3JzQ29udGFpbmVyOiBmdW5jdGlvbihpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICBjb25zdCAkZWxlbWVudCA9IGluc3RhbmNlLiRlbGVtZW50O1xyXG4gICAgICAgICAgICBsZXQgdHlwZSA9ICRlbGVtZW50LmF0dHIoJ3R5cGUnKSxcclxuICAgICAgICAgICAgICAgICRjb250YWluZXI7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAodHlwZSA9PSAnY2hlY2tib3gnIHx8IHR5cGUgPT0gJ3JhZGlvJykge1xyXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICQoYFtuYW1lPVwiJHskZWxlbWVudC5hdHRyKCduYW1lJyl9XCJdOmxhc3QgKyBsYWJlbGApLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoJGVsZW1lbnQuaGFzQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKSkge1xyXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50Lm5leHQoJy5zZWxlY3QyJykubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlID09ICdmaWxlJykge1xyXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICRlbGVtZW50LmNsb3Nlc3QoJy5jdXN0b20tZmlsZScpLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkZWxlbWVudC5jbG9zZXN0KCcuanMtZGF0ZXBpY2tlci1yYW5nZScpLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoJGVsZW1lbnQuYXR0cignbmFtZScpID09ICdpc19yZWNhcHRjaGFfc3VjY2VzcycpIHtcclxuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkZWxlbWVudC5wYXJlbnQoKS5uZXh0KCcuZy1yZWNhcHRjaGEnKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGNvbnRhaW5lcjtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQmtCw0YHRgtC+0LzQvdGL0LUg0LLQsNC70LjQtNCw0YLQvtGA0YtcclxuXHJcbiAgICAvLyDQotC+0LvRjNC60L4g0YDRg9GB0YHQutC40LUg0LHRg9C60LLRiywg0YLQuNGA0LUsINC/0YDQvtCx0LXQu9GLXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbmFtZVJ1Jywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gL15b0LAt0Y/RkVxcLSBdKiQvaS50ZXN0KHZhbHVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyDQkC3Qrywg0LAt0Y8sIFwiIFwiLCBcIi1cIicsXHJcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJ1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCi0L7Qu9GM0LrQviDQu9Cw0YLQuNC90YHQutC40LUg0LHRg9C60LLRiywg0YLQuNGA0LUsINC/0YDQvtCx0LXQu9GLXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbmFtZUVuJywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gL15bYS16XFwtIF0qJC9pLnRlc3QodmFsdWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLIEEtWiwgYS16LCBcIiBcIiwgXCItXCInLFxyXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyBBLVosIGEteiwgXCIgXCIsIFwiLVwiJ1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCi0L7Qu9GM0LrQviDQu9Cw0YLQuNC90YHQutC40LUg0Lgg0YDRg9GB0YHQutC40LUg0LHRg9C60LLRiywg0YLQuNGA0LUsINC/0YDQvtCx0LXQu9GLXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbmFtZScsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFhLXpcXC0gXSokL2kudGVzdCh2YWx1ZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJyxcclxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgXCIgXCIsIFwiLVwiJ1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCi0L7Qu9GM0LrQviDRhtC40YTRgNGLINC4INGA0YPRgdGB0LrQuNC1INCx0YPQutCy0YtcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdudW1MZXR0ZXJSdScsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC9eWzAtOdCwLdGP0ZFdKiQvaS50ZXN0KHZhbHVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyDQkC3Qrywg0LAt0Y8sIDAtOScsXHJcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzINCQLdCvLCDQsC3RjywgMC05J1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCi0L7Qu9GM0LrQviDRhtC40YTRgNGLLCDQu9Cw0YLQuNC90YHQutC40LUg0Lgg0YDRg9GB0YHQutC40LUg0LHRg9C60LLRi1xyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ251bUxldHRlcicsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFhLXowLTldKiQvaS50ZXN0KHZhbHVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCAwLTknLFxyXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyBBLVosIGEteiwg0JAt0K8sINCwLdGPLCAwLTknXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0KLQtdC70LXRhNC+0L3QvdGL0Lkg0L3QvtC80LXRgFxyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ3Bob25lJywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gL15bLSswLTkoKSBdKiQvaS50ZXN0KHZhbHVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAn0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5INGC0LXQu9C10YTQvtC90L3Ri9C5INC90L7QvNC10YAnLFxyXG4gICAgICAgICAgICBlbjogJ0luY29ycmVjdCBwaG9uZSBudW1iZXInXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0KLQvtC70YzQutC+INGG0LjRhNGA0YtcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdudW1iZXInLCB7XHJcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAvXlswLTldKiQvaS50ZXN0KHZhbHVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyAwLTknLFxyXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyAwLTknXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0J/QvtGH0YLQsCDQsdC10Lcg0LrQuNGA0LjQu9C70LjRhtGLXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZW1haWwnLCB7XHJcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAvXihbQS1aYS160JAt0K/QsC3RjzAtOVxcLV0oXFwufF98LSl7MCwxfSkrW0EtWmEtetCQLdCv0LAt0Y8wLTlcXC1dXFxAKFtBLVphLXrQkC3Qr9CwLdGPMC05XFwtXSkrKChcXC4pezAsMX1bQS1aYS160JAt0K/QsC3RjzAtOVxcLV0pezEsfVxcLlthLXrQsC3RjzAtOVxcLV17Mix9JC8udGVzdCh2YWx1ZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBydTogJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDQv9C+0YfRgtC+0LLRi9C5INCw0LTRgNC10YEnLFxyXG4gICAgICAgICAgICBlbjogJ0luY29ycmVjdCBlbWFpbCBhZGRyZXNzJ1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCk0L7RgNC80LDRgiDQtNCw0YLRiyBERC5NTS5ZWVlZXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZGF0ZScsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgbGV0IHJlZ1Rlc3QgPSAvXig/Oig/OjMxKFxcLikoPzowP1sxMzU3OF18MVswMl0pKVxcMXwoPzooPzoyOXwzMCkoXFwuKSg/OjA/WzEsMy05XXwxWzAtMl0pXFwyKSkoPzooPzoxWzYtOV18WzItOV1cXGQpP1xcZHsyfSkkfF4oPzoyOShcXC4pMD8yXFwzKD86KD86KD86MVs2LTldfFsyLTldXFxkKT8oPzowWzQ4XXxbMjQ2OF1bMDQ4XXxbMTM1NzldWzI2XSl8KD86KD86MTZ8WzI0NjhdWzA0OF18WzM1NzldWzI2XSkwMCkpKSkkfF4oPzowP1sxLTldfDFcXGR8MlswLThdKShcXC4pKD86KD86MD9bMS05XSl8KD86MVswLTJdKSlcXDQoPzooPzoxWzYtOV18WzItOV1cXGQpP1xcZHs0fSkkLyxcclxuICAgICAgICAgICAgICAgIHJlZ01hdGNoID0gLyhcXGR7MSwyfSlcXC4oXFxkezEsMn0pXFwuKFxcZHs0fSkvLFxyXG4gICAgICAgICAgICAgICAgbWluID0gYXJndW1lbnRzWzJdLiRlbGVtZW50LmRhdGEoJ2RhdGVNaW4nKSxcclxuICAgICAgICAgICAgICAgIG1heCA9IGFyZ3VtZW50c1syXS4kZWxlbWVudC5kYXRhKCdkYXRlTWF4JyksXHJcbiAgICAgICAgICAgICAgICBtaW5EYXRlLCBtYXhEYXRlLCB2YWx1ZURhdGUsIHJlc3VsdDtcclxuXHJcbiAgICAgICAgICAgIGlmIChtaW4gJiYgKHJlc3VsdCA9IG1pbi5tYXRjaChyZWdNYXRjaCkpKSB7XHJcbiAgICAgICAgICAgICAgICBtaW5EYXRlID0gbmV3IERhdGUoK3Jlc3VsdFszXSwgcmVzdWx0WzJdIC0gMSwgK3Jlc3VsdFsxXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG1heCAmJiAocmVzdWx0ID0gbWF4Lm1hdGNoKHJlZ01hdGNoKSkpIHtcclxuICAgICAgICAgICAgICAgIG1heERhdGUgPSBuZXcgRGF0ZSgrcmVzdWx0WzNdLCByZXN1bHRbMl0gLSAxLCArcmVzdWx0WzFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocmVzdWx0ID0gdmFsdWUubWF0Y2gocmVnTWF0Y2gpKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZURhdGUgPSBuZXcgRGF0ZSgrcmVzdWx0WzNdLCByZXN1bHRbMl0gLSAxLCArcmVzdWx0WzFdKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlZ1Rlc3QudGVzdCh2YWx1ZSkgJiYgKG1pbkRhdGUgPyB2YWx1ZURhdGUgPj0gbWluRGF0ZSA6IHRydWUpICYmIChtYXhEYXRlID8gdmFsdWVEYXRlIDw9IG1heERhdGUgOiB0cnVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAn0J3QtdC60L7RgNGA0LXQutGC0L3QsNGPINC00LDRgtCwJyxcclxuICAgICAgICAgICAgZW46ICdJbmNvcnJlY3QgZGF0ZSdcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLy8g0KTQsNC50Lsg0L7Qs9GA0LDQvdC40YfQtdC90L3QvtCz0L4g0YDQsNC30LzQtdGA0LBcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdmaWxlTWF4U2l6ZScsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUsIG1heFNpemUsIHBhcnNsZXlJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICBsZXQgZmlsZXMgPSBwYXJzbGV5SW5zdGFuY2UuJGVsZW1lbnRbMF0uZmlsZXM7XHJcbiAgICAgICAgICAgIHJldHVybiBmaWxlcy5sZW5ndGggIT0gMSAgfHwgZmlsZXNbMF0uc2l6ZSA8PSBtYXhTaXplICogMTAyNDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlcXVpcmVtZW50VHlwZTogJ2ludGVnZXInLFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAn0KTQsNC50Lsg0LTQvtC70LbQtdC9INCy0LXRgdC40YLRjCDQvdC1INCx0L7Qu9C10LUsINGH0LXQvCAlcyBLYicsXHJcbiAgICAgICAgICAgIGVuOiAnRmlsZSBzaXplIGNhblxcJ3QgYmUgbW9yZSB0aGVuICVzIEtiJ1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCe0LPRgNCw0L3QuNGH0LXQvdC40Y8g0YDQsNGB0YjQuNGA0LXQvdC40Lkg0YTQsNC50LvQvtCyXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZmlsZUV4dGVuc2lvbicsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUsIGZvcm1hdHMpIHtcclxuICAgICAgICAgICAgbGV0IGZpbGVFeHRlbnNpb24gPSB2YWx1ZS5zcGxpdCgnLicpLnBvcCgpO1xyXG4gICAgICAgICAgICBsZXQgZm9ybWF0c0FyciA9IGZvcm1hdHMuc3BsaXQoJywgJyk7XHJcbiAgICAgICAgICAgIGxldCB2YWxpZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmb3JtYXRzQXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmlsZUV4dGVuc2lvbiA9PT0gZm9ybWF0c0FycltpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgcnU6ICfQlNC+0L/Rg9GB0YLQuNC80Ysg0YLQvtC70YzQutC+INGE0LDQudC70Ysg0YTQvtGA0LzQsNGC0LAgJXMnLFxyXG4gICAgICAgICAgICBlbjogJ0F2YWlsYWJsZSBleHRlbnNpb25zIGFyZSAlcydcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQodC+0LfQtNCw0ZHRgiDQutC+0L3RgtC10LnQvdC10YDRiyDQtNC70Y8g0L7RiNC40LHQvtC6INGDINC90LXRgtC40L/QuNGH0L3Ri9GFINGN0LvQtdC80LXQvdGC0L7QslxyXG4gICAgUGFyc2xleS5vbignZmllbGQ6aW5pdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCAkZWxlbWVudCA9IHRoaXMuJGVsZW1lbnQsXHJcbiAgICAgICAgICAgIHR5cGUgPSAkZWxlbWVudC5hdHRyKCd0eXBlJyksXHJcbiAgICAgICAgICAgICRibG9jayA9ICQoJzxkaXYvPicpLmFkZENsYXNzKCdlcnJvcnMtcGxhY2VtZW50JyksXHJcbiAgICAgICAgICAgICRsYXN0O1xyXG5cclxuICAgICAgICBpZiAodHlwZSA9PSAnY2hlY2tib3gnIHx8IHR5cGUgPT0gJ3JhZGlvJykge1xyXG4gICAgICAgICAgICAkbGFzdCA9ICQoYFtuYW1lPVwiJHskZWxlbWVudC5hdHRyKCduYW1lJyl9XCJdOmxhc3QgKyBsYWJlbGApO1xyXG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICgkZWxlbWVudC5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpKSB7XHJcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQubmV4dCgnLnNlbGVjdDInKTtcclxuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnZmlsZScpIHtcclxuICAgICAgICAgICAgJGxhc3QgPSAkZWxlbWVudC5jbG9zZXN0KCcuY3VzdG9tLWZpbGUnKTtcclxuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJGxhc3QgPSAkZWxlbWVudC5jbG9zZXN0KCcuanMtZGF0ZXBpY2tlci1yYW5nZScpO1xyXG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICgkZWxlbWVudC5hdHRyKCduYW1lJykgPT0gJ2lzX3JlY2FwdGNoYV9zdWNjZXNzJykge1xyXG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50LnBhcmVudCgpLm5leHQoJy5nLXJlY2FwdGNoYScpO1xyXG4gICAgICAgICAgICBpZiAoISRsYXN0Lm5leHQoJy5lcnJvcnMtcGxhY2VtZW50JykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAkbGFzdC5hZnRlcigkYmxvY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0JjQvdC40YbQuNC40YDRg9C10YIg0LLQsNC70LjQtNCw0YbQuNGOINC90LAg0LLRgtC+0YDQvtC8INC60LDQu9C10LTQsNGA0L3QvtC8INC/0L7Qu9C1INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgUGFyc2xleS5vbignZmllbGQ6dmFsaWRhdGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0ICRlbGVtZW50ID0gJCh0aGlzLmVsZW1lbnQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnZm9ybVtkYXRhLXZhbGlkYXRlPVwidHJ1ZVwiXScpLnBhcnNsZXkoKTtcclxuICAgIC8qKlxyXG4gICAgICog0JTQvtCx0LDQstC70Y/QtdGCINC80LDRgdC60Lgg0LIg0L/QvtC70Y8g0YTQvtGA0LxcclxuICAgICAqIEBzZWUgIGh0dHBzOi8vZ2l0aHViLmNvbS9Sb2JpbkhlcmJvdHMvSW5wdXRtYXNrXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIDxpbnB1dCBjbGFzcz1cImpzLXBob25lLW1hc2tcIiB0eXBlPVwidGVsXCIgbmFtZT1cInRlbFwiIGlkPVwidGVsXCI+XHJcbiAgICAgKi9cclxuICAgICQoJy5qcy1waG9uZS1tYXNrJykuaW5wdXRtYXNrKCcrNyg5OTkpIDk5OS05OS05OScsIHtcclxuICAgICAgICBjbGVhck1hc2tPbkxvc3RGb2N1czogdHJ1ZSxcclxuICAgICAgICBzaG93TWFza09uSG92ZXI6IGZhbHNlXHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCBcIi5mbGFnbWFuLXJlcXVlc3RfX2RhdGVcIiApLmRhdGVwaWNrZXIoKTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmtC+0YHRgtGL0LvRjCDQtNC70Y8g0L7QsdC90L7QstC70LXQvdC40Y8geGxpbmsg0YMgc3ZnLdC40LrQvtC90L7QuiDQv9C+0YHQu9C1INC+0LHQvdC+0LLQu9C10L3QuNGPIERPTSAo0LTQu9GPIElFKVxyXG4gICAgICog0YTRg9C90LrRhtC40Y4g0L3Rg9C20L3QviDQstGL0LfRi9Cy0LDRgtGMINCyINGB0L7QsdGL0YLQuNGP0YUsINC60L7RgtC+0YDRi9C1INCy0L3QvtGB0Y/RgiDQuNC30LzQtdC90LXQvdC40Y8g0LIg0Y3Qu9C10LzQtdC90YLRiyDRg9C20LUg0L/QvtGB0LvQtSDRhNC+0YDQvNC40YDQvtCy0LDQvdC40Y8gRE9NLdCwXHJcbiAgICAgKiAo0L3QsNC/0YDQuNC80LXRgCwg0L/QvtGB0LvQtSDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjQuCDQutCw0YDRg9GB0LXQu9C4INC40LvQuCDQvtGC0LrRgNGL0YLQuNC4INC/0L7Qv9Cw0L/QsClcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtFbGVtZW50fSBlbGVtZW50INGN0LvQtdC80LXQvdGCLCDQsiDQutC+0YLQvtGA0L7QvCDQvdC10L7QsdGF0L7QtNC40LzQviDQvtCx0L3QvtCy0LjRgtGMIHN2ZyAo0L3QsNC/0YDQuNC8ICQoJyNzb21lLXBvcHVwJykpXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVN2ZyhlbGVtZW50KSB7XHJcbiAgICAgICAgbGV0ICR1c2VFbGVtZW50ID0gZWxlbWVudC5maW5kKCd1c2UnKTtcclxuXHJcbiAgICAgICAgJHVzZUVsZW1lbnQuZWFjaChmdW5jdGlvbiggaW5kZXggKSB7XHJcbiAgICAgICAgICAgIGlmICgkdXNlRWxlbWVudFtpbmRleF0uaHJlZiAmJiAkdXNlRWxlbWVudFtpbmRleF0uaHJlZi5iYXNlVmFsKSB7XHJcbiAgICAgICAgICAgICAgICAkdXNlRWxlbWVudFtpbmRleF0uaHJlZi5iYXNlVmFsID0gJHVzZUVsZW1lbnRbaW5kZXhdLmhyZWYuYmFzZVZhbDsgLy8gdHJpZ2dlciBmaXhpbmcgb2YgaHJlZlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBkYXRlcGlja2VyRGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgZGF0ZUZvcm1hdDogJ2RkLm1tLnl5JyxcclxuICAgICAgICBzaG93T3RoZXJNb250aHM6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQlNC10LvQsNC10YIg0LLRi9C/0LDQtNGO0YnQuNC1INC60LDQu9C10L3QtNCw0YDQuNC60LhcclxuICAgICAqIEBzZWUgIGh0dHA6Ly9hcGkuanF1ZXJ5dWkuY29tL2RhdGVwaWNrZXIvXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIC8vINCyIGRhdGEtZGF0ZS1taW4g0LggZGF0YS1kYXRlLW1heCDQvNC+0LbQvdC+INC30LDQtNCw0YLRjCDQtNCw0YLRgyDQsiDRhNC+0YDQvNCw0YLQtSBkZC5tbS55eXl5XHJcbiAgICAgKiA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZGF0ZUlucHV0XCIgaWQ9XCJcIiBjbGFzcz1cImpzLWRhdGVwaWNrZXJcIiBkYXRhLWRhdGUtbWluPVwiMDYuMTEuMjAxNVwiIGRhdGEtZGF0ZS1tYXg9XCIxMC4xMi4yMDE1XCI+XHJcbiAgICAgKi9cclxuICAgIGxldCBEYXRlcGlja2VyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IGRhdGVwaWNrZXIgPSAkKCcuanMtZGF0ZXBpY2tlcicpO1xyXG5cclxuICAgICAgICBkYXRlcGlja2VyLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsZXQgbWluRGF0ZSA9ICQodGhpcykuZGF0YSgnZGF0ZS1taW4nKTtcclxuICAgICAgICAgICAgbGV0IG1heERhdGUgPSAkKHRoaXMpLmRhdGEoJ2RhdGUtbWF4Jyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgaXRlbU9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBtaW5EYXRlOiBtaW5EYXRlIHx8IG51bGwsXHJcbiAgICAgICAgICAgICAgICBtYXhEYXRlOiBtYXhEYXRlIHx8IG51bGwsXHJcbiAgICAgICAgICAgICAgICBvblNlbGVjdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jaGFuZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5maWVsZCcpLmFkZENsYXNzKCdpcy1maWxsZWQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICQuZXh0ZW5kKHRydWUsIGl0ZW1PcHRpb25zLCBkYXRlcGlja2VyRGVmYXVsdE9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgJCh0aGlzKS5kYXRlcGlja2VyKGl0ZW1PcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgbGV0IGRhdGVwaWNrZXIgPSBuZXcgRGF0ZXBpY2tlcigpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLy8g0JTQuNCw0L/QsNC30L7QvSDQtNCw0YJcclxuICAgIGxldCBEYXRlcGlja2VyUmFuZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgZGF0ZXBpY2tlclJhbmdlID0gJCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKTtcclxuXHJcbiAgICAgICAgZGF0ZXBpY2tlclJhbmdlLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsZXQgZnJvbUl0ZW1PcHRpb25zID0ge307XHJcbiAgICAgICAgICAgIGxldCB0b0l0ZW1PcHRpb25zID0ge307XHJcblxyXG4gICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBmcm9tSXRlbU9wdGlvbnMsIGRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyk7XHJcbiAgICAgICAgICAgICQuZXh0ZW5kKHRydWUsIHRvSXRlbU9wdGlvbnMsIGRhdGVwaWNrZXJEZWZhdWx0T3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZGF0ZUZyb20gPSAkKHRoaXMpLmZpbmQoJy5qcy1yYW5nZS1mcm9tJykuZGF0ZXBpY2tlcihmcm9tSXRlbU9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGRhdGVUbyA9ICQodGhpcykuZmluZCgnLmpzLXJhbmdlLXRvJykuZGF0ZXBpY2tlcih0b0l0ZW1PcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGRhdGVGcm9tLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGRhdGVUby5kYXRlcGlja2VyKCdvcHRpb24nLCAnbWluRGF0ZScsIGdldERhdGUodGhpcykpO1xyXG5cclxuICAgICAgICAgICAgICAgIGRhdGVUby5wcm9wKCdyZXF1aXJlZCcsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdwYXJzbGV5LWVycm9yJykgJiYgJCh0aGlzKS5wYXJzbGV5KCkuaXNWYWxpZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJzbGV5KCkudmFsaWRhdGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBkYXRlVG8ub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZGF0ZUZyb20uZGF0ZXBpY2tlcignb3B0aW9uJywgJ21heERhdGUnLCBnZXREYXRlKHRoaXMpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkYXRlRnJvbS5wcm9wKCdyZXF1aXJlZCcsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdwYXJzbGV5LWVycm9yJykgJiYgJCh0aGlzKS5wYXJzbGV5KCkuaXNWYWxpZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJzbGV5KCkudmFsaWRhdGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldERhdGUoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBsZXQgZGF0ZTtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlID0gJC5kYXRlcGlja2VyLnBhcnNlRGF0ZShkYXRlcGlja2VyRGVmYXVsdE9wdGlvbnMuZGF0ZUZvcm1hdCwgZWxlbWVudC52YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGRhdGUgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGF0ZTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGxldCBkYXRlcGlja2VyUmFuZ2UgPSBuZXcgRGF0ZXBpY2tlclJhbmdlKCk7XHJcbiAgICAvKipcclxuICAgICAqINCg0LXQsNC70LjQt9GD0LXRgiDQv9C10YDQtdC60LvRjtGH0LXQvdC40LUg0YLQsNCx0L7QslxyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiA8dWwgY2xhc3M9XCJ0YWJzIGpzLXRhYnNcIj5cclxuICAgICAqICAgICA8bGkgY2xhc3M9XCJ0YWJzX19pdGVtXCI+XHJcbiAgICAgKiAgICAgICAgIDxzcGFuIGNsYXNzPVwiaXMtYWN0aXZlIHRhYnNfX2xpbmsganMtdGFiLWxpbmtcIj5UYWIgbmFtZTwvc3Bhbj5cclxuICAgICAqICAgICAgICAgPGRpdiBjbGFzcz1cInRhYnNfX2NudFwiPlxyXG4gICAgICogICAgICAgICAgICAgPHA+VGFiIGNvbnRlbnQ8L3A+XHJcbiAgICAgKiAgICAgICAgIDwvZGl2PlxyXG4gICAgICogICAgIDwvbGk+XHJcbiAgICAgKiA8L3VsPlxyXG4gICAgICovXHJcbiAgICBsZXQgVGFiU3dpdGNoZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgICAgICBjb25zdCB0YWJzID0gJCgnLmpzLXRhYnMnKTtcclxuXHJcbiAgICAgICAgdGFicy5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy5qcy10YWItbGluay5pcy1hY3RpdmUnKS5uZXh0KCkuYWRkQ2xhc3MoJ2lzLW9wZW4nKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGFicy5vbignY2xpY2snLCAnLmpzLXRhYi1saW5rJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgc2VsZi5vcGVuKCQodGhpcyksIGV2ZW50KTtcclxuXHJcbiAgICAgICAgICAgIC8vIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0J7RgtC60YDRi9Cy0LDQtdGCINGC0LDQsSDQv9C+INC60LvQuNC60YMg0L3QsCDQutCw0LrQvtC5LdGC0L4g0LTRgNGD0LPQvtC5INGN0LvQtdC80LXQvdGCXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICAqIDxzcGFuIGRhdGEtdGFiLW9wZW49XCIjdGFiLWxvZ2luXCI+T3BlbiBsb2dpbiB0YWI8L3NwYW4+XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJ1tkYXRhLXRhYi1vcGVuXScsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhYkVsZW0gPSAkKHRoaXMpLmRhdGEoJ3RhYi1vcGVuJyk7XHJcbiAgICAgICAgICAgIHNlbGYub3BlbigkKHRhYkVsZW0pLCBldmVudCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5kYXRhKCdwb3B1cCcpID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINCe0YLQutGA0YvQstCw0LXRgiDRgtCw0LFcclxuICAgICAgICAgKiBAcGFyYW0gIHtFbGVtZW50fSBlbGVtINGN0LvQtdC80LXQvdGCIC5qcy10YWItbGluaywg0L3QsCDQutC+0YLQvtGA0YvQuSDQvdGD0LbQvdC+INC/0LXRgNC10LrQu9GO0YfQuNGC0YxcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBleGFtcGxlXHJcbiAgICAgICAgICogLy8g0LLRi9C30L7QsiDQvNC10YLQvtC00LAgb3Blbiwg0L7RgtC60YDQvtC10YIg0YLQsNCxXHJcbiAgICAgICAgICogdGFiU3dpdGNoZXIub3BlbigkKCcjc29tZS10YWInKSk7XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc2VsZi5vcGVuID0gZnVuY3Rpb24oZWxlbSwgZXZlbnQpIHtcclxuICAgICAgICAgICAgaWYgKCFlbGVtLmhhc0NsYXNzKCdpcy1hY3RpdmUnKSkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJlbnRUYWJzID0gZWxlbS5jbG9zZXN0KHRhYnMpO1xyXG4gICAgICAgICAgICAgICAgcGFyZW50VGFicy5maW5kKCcuaXMtb3BlbicpLnJlbW92ZUNsYXNzKCdpcy1vcGVuJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgZWxlbS5uZXh0KCkudG9nZ2xlQ2xhc3MoJ2lzLW9wZW4nKTtcclxuICAgICAgICAgICAgICAgIHBhcmVudFRhYnMuZmluZCgnLmlzLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgIGVsZW0uYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIGxldCB0YWJTd2l0Y2hlciA9IG5ldyBUYWJTd2l0Y2hlcigpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQutGA0YvQstCw0LXRgiDRjdC70LXQvNC10L3RgiBoaWRkZW5FbGVtINC/0YDQuCDQutC70LjQutC1INC30LAg0L/RgNC10LTQtdC70LDQvNC4INGN0LvQtdC80LXQvdGC0LAgdGFyZ2V0RWxlbVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge0VsZW1lbnR9ICAgdGFyZ2V0RWxlbVxyXG4gICAgICogQHBhcmFtICB7RWxlbWVudH0gICBoaWRkZW5FbGVtXHJcbiAgICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gIFtvcHRpb25hbENiXSDQvtGC0YDQsNCx0LDRgtGL0LLQsNC10YIg0YHRgNCw0LfRgyDQvdC1INC00L7QttC40LTQsNGP0YHRjCDQt9Cw0LLQtdGA0YjQtdC90LjRjyDQsNC90LjQvNCw0YbQuNC4XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG9uT3V0c2lkZUNsaWNrSGlkZSh0YXJnZXRFbGVtLCBoaWRkZW5FbGVtLCBvcHRpb25hbENiKSB7XHJcbiAgICAgICAgJChkb2N1bWVudCkuYmluZCgnbW91c2V1cCB0b3VjaGVuZCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgaWYgKCF0YXJnZXRFbGVtLmlzKGUudGFyZ2V0KSAmJiAkKGUudGFyZ2V0KS5jbG9zZXN0KHRhcmdldEVsZW0pLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBoaWRkZW5FbGVtLnN0b3AodHJ1ZSwgdHJ1ZSkuZmFkZU91dChnbG9iYWxPcHRpb25zLnRpbWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbmFsQ2IpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25hbENiKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCl0Y3Qu9C/0LXRgCDQtNC70Y8g0L/QvtC60LDQt9CwLCDRgdC60YDRi9GC0LjRjyDQuNC70Lgg0YfQtdGA0LXQtNC+0LLQsNC90LjRjyDQstC40LTQuNC80L7RgdGC0Lgg0Y3Qu9C10LzQtdC90YLQvtCyXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtdmlzaWJpbGl0eT1cInNob3dcIiBkYXRhLXNob3c9XCIjZWxlbUlkMVwiPjwvYnV0dG9uPlxyXG4gICAgICpcclxuICAgICAqINC40LvQuFxyXG4gICAgICogPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS12aXNpYmlsaXR5PVwiaGlkZVwiIGRhdGEtaGlkZT1cIiNlbGVtSWQyXCI+PC9idXR0b24+XHJcbiAgICAgKlxyXG4gICAgICog0LjQu9C4XHJcbiAgICAgKiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXZpc2liaWxpdHk9XCJ0b2dnbGVcIiBkYXRhLXRvZ2dsZT1cIiNlbGVtSWQzXCI+PC9idXR0b24+XHJcbiAgICAgKlxyXG4gICAgICog0LjQu9C4XHJcbiAgICAgKiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXZpc2liaWxpdHk9XCJzaG93XCIgZGF0YS1zaG93PVwiI2VsZW1JZDF8I2VsZW1JZDNcIj48L2J1dHRvbj5cclxuICAgICAqXHJcbiAgICAgKiDQuNC70LhcclxuICAgICAqIC8vINC10YHQu9C4INC10YHRgtGMINCw0YLRgNC40LHRg9GCIGRhdGEtcXVldWU9XCJzaG93XCIsINGC0L4g0LHRg9C00LXRgiDRgdC90LDRh9Cw0LvQsCDRgdC60YDRi9GCINGN0LvQtdC80LXQvdGCICNlbGVtSWQyLCDQsCDQv9C+0YLQvtC8INC/0L7QutCw0LfQsNC9ICNlbGVtSWQxXHJcbiAgICAgKiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXZpc2liaWxpdHk9XCJzaG93XCIgZGF0YS1zaG93PVwiI2VsZW1JZDFcIiBkYXRhLXZpc2liaWxpdHk9XCJoaWRlXCIgZGF0YS1oaWRlPVwiI2VsZW1JZDJcIiBkYXRhLXF1ZXVlPVwic2hvd1wiPjwvYnV0dG9uPlxyXG4gICAgICpcclxuICAgICAqIDxkaXYgaWQ9XCJlbGVtSWQxXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPlRleHQ8L2Rpdj5cclxuICAgICAqIDxkaXYgaWQ9XCJlbGVtSWQyXCI+VGV4dDwvZGl2PlxyXG4gICAgICogPGRpdiBpZD1cImVsZW1JZDNcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+VGV4dDwvZGl2PlxyXG4gICAgICovXHJcbiAgICBsZXQgdmlzaWJpbGl0eUNvbnRyb2wgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgc2V0dGluZ3MgPSB7XHJcbiAgICAgICAgICAgIHR5cGVzOiBbXHJcbiAgICAgICAgICAgICAgICAnc2hvdycsXHJcbiAgICAgICAgICAgICAgICAnaGlkZScsXHJcbiAgICAgICAgICAgICAgICAndG9nZ2xlJ1xyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKCQoJ1tkYXRhLXZpc2liaWxpdHldJykubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJ1tkYXRhLXZpc2liaWxpdHldJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGF0YVR5cGU7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNldHRpbmdzLnR5cGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGUgPSBzZXR0aW5ncy50eXBlc1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuZGF0YShkYXRhVHlwZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZpc2liaWxpdHlMaXN0ID0gJCh0aGlzKS5kYXRhKGRhdGFUeXBlKS5zcGxpdCgnfCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsYXkgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuZGF0YSgncXVldWUnKSA9PSAnc2hvdycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5ID0gZ2xvYmFsT3B0aW9ucy50aW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsYXkgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFZpc2liaWxpdHkoZGF0YVR5cGUsIHZpc2liaWxpdHlMaXN0LCBkZWxheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghJCh0aGlzKS5oYXNDbGFzcygndGFic19fbGluaycpICYmICQodGhpcykuYXR0cigndHlwZScpICE9ICdyYWRpbycgJiYgJCh0aGlzKS5hdHRyKCd0eXBlJykgIT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICog0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0LLQuNC00LjQvNC+0YHRgtGMXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgdmlzaWJpbGl0eVR5cGUg0YLQuNC/INC+0YLQvtCx0YDQsNC20LXQvdC40Y9cclxuICAgICAgICAgICAgICogQHBhcmFtIHtBcnJheX0gICBsaXN0INC80LDRgdGB0LjQsiDRjdC70LXQvNC10L3RgtC+0LIsINGBINC60L7RgtC+0YDRi9C8INGA0LDQsdC+0YLQsNC10LxcclxuICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9ICBkZWxheSDQt9Cw0LTQtdGA0LbQutCwINC/0YDQuCDQv9C+0LrQsNC30LUg0Y3Qu9C10LzQtdC90YLQsCDQsiBtc1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gc2V0VmlzaWJpbGl0eSh2aXNpYmlsaXR5VHlwZSwgbGlzdCwgZGVsYXkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2aXNpYmlsaXR5VHlwZSA9PSBzZXR0aW5ncy50eXBlc1swXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKGxpc3RbaV0pLmRlbGF5KGRlbGF5KS5mYWRlSW4oZ2xvYmFsT3B0aW9ucy50aW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2aXNpYmlsaXR5VHlwZSA9PSBzZXR0aW5ncy50eXBlc1sxXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKGxpc3RbaV0pLmZhZGVPdXQoZ2xvYmFsT3B0aW9ucy50aW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2aXNpYmlsaXR5VHlwZSA9PSBzZXR0aW5ncy50eXBlc1syXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJChsaXN0W2ldKS5pcygnOnZpc2libGUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChsaXN0W2ldKS5mYWRlT3V0KGdsb2JhbE9wdGlvbnMudGltZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGxpc3RbaV0pLmZhZGVJbihnbG9iYWxPcHRpb25zLnRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdmlzaWJpbGl0eUNvbnRyb2woKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0LXQu9Cw0LXRgiDRgdC70LDQudC00LXRgFxyXG4gICAgICogQHNlZSAgaHR0cDovL2FwaS5qcXVlcnl1aS5jb20vc2xpZGVyL1xyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiAvLyDQsiBkYXRhLW1pbiDQuCBkYXRhLW1heCDQt9Cw0LTQsNGO0YLRgdGPINC80LjQvdC40LzQsNC70YzQvdC+0LUg0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3QvtC1INC30L3QsNGH0LXQvdC40LVcclxuICAgICAqIC8vINCyIGRhdGEtc3RlcCDRiNCw0LMsXHJcbiAgICAgKiAvLyDQsiBkYXRhLXZhbHVlcyDQtNC10YTQvtC70YLQvdGL0LUg0LfQvdCw0YfQtdC90LjRjyBcIm1pbiwgbWF4XCJcclxuICAgICAqIDxkaXYgY2xhc3M9XCJzbGlkZXIganMtcmFuZ2VcIj5cclxuICAgICAqICAgICAgPGRpdiBjbGFzcz1cInNsaWRlcl9fcmFuZ2VcIiBkYXRhLW1pbj1cIjBcIiBkYXRhLW1heD1cIjEwMFwiIGRhdGEtc3RlcD1cIjFcIiBkYXRhLXZhbHVlcz1cIjEwLCA1NVwiPjwvZGl2PlxyXG4gICAgICogPC9kaXY+XHJcbiAgICAgKi9cclxuICAgIGxldCBTbGlkZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBzbGlkZXIgPSAkKCcuanMtcmFuZ2UnKTtcclxuICAgICAgICBsZXQgbWluLFxyXG4gICAgICAgICAgICBtYXgsXHJcbiAgICAgICAgICAgIHN0ZXAsXHJcbiAgICAgICAgICAgIHZhbHVlcztcclxuXHJcbiAgICAgICAgc2xpZGVyLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2VsZiA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICByYW5nZSA9IHNlbGYuZmluZCgnLnNsaWRlcl9fcmFuZ2UnKTtcclxuXHJcbiAgICAgICAgICAgIG1pbiA9IHJhbmdlLmRhdGEoJ21pbicpO1xyXG4gICAgICAgICAgICBtYXggPSByYW5nZS5kYXRhKCdtYXgnKTtcclxuICAgICAgICAgICAgc3RlcCA9IHJhbmdlLmRhdGEoJ3N0ZXAnKTtcclxuICAgICAgICAgICAgdmFsdWVzID0gcmFuZ2UuZGF0YSgndmFsdWVzJykuc3BsaXQoJywgJyk7XHJcblxyXG4gICAgICAgICAgICByYW5nZS5zbGlkZXIoe1xyXG4gICAgICAgICAgICAgICAgcmFuZ2U6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtaW46IG1pbiB8fCBudWxsLFxyXG4gICAgICAgICAgICAgICAgbWF4OiBtYXggfHwgbnVsbCxcclxuICAgICAgICAgICAgICAgIHN0ZXA6IHN0ZXAgfHwgMSxcclxuICAgICAgICAgICAgICAgIHZhbHVlczogdmFsdWVzLFxyXG4gICAgICAgICAgICAgICAgc2xpZGU6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZmluZCgnLnVpLXNsaWRlci1oYW5kbGUnKS5jaGlsZHJlbignc3BhbicpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZmluZCgnLnVpLXNsaWRlci1oYW5kbGU6bnRoLWNoaWxkKDIpJykuYXBwZW5kKGA8c3Bhbj4ke3VpLnZhbHVlc1swXX08L3NwYW4+YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5maW5kKCcudWktc2xpZGVyLWhhbmRsZTpudGgtY2hpbGQoMyknKS5hcHBlbmQoYDxzcGFuPiR7dWkudmFsdWVzWzFdfTwvc3Bhbj5gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLmZpbmQoJy51aS1zbGlkZXItaGFuZGxlOm50aC1jaGlsZCgyKScpLmFwcGVuZChgPHNwYW4+JHtyYW5nZS5zbGlkZXIoJ3ZhbHVlcycsIDApfTwvc3Bhbj5gKTtcclxuICAgICAgICAgICAgc2VsZi5maW5kKCcudWktc2xpZGVyLWhhbmRsZTpudGgtY2hpbGQoMyknKS5hcHBlbmQoYDxzcGFuPiR7cmFuZ2Uuc2xpZGVyKCd2YWx1ZXMnLCAxKX08L3NwYW4+YCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgc2xpZGVyID0gbmV3IFNsaWRlcigpO1xyXG5cclxuICAgIHdpbmRvdy5vbmxvYWQ9ZnVuY3Rpb24oKXtcclxuICAgICAgICBsZXQgUGVyc29ucz0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRlYW1fcGVyc29uc19waG90bycpO1xyXG4gICAgICAgIFBlcnNvbnMuZm9yRWFjaChub2RlID0+IHtcclxuICAgICAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBQZXJzb25zLmZvckVhY2gobm9kZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5zdHlsZS53aWR0aD0nMTMlJztcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50PWVsZW1lbnQudGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgY3VycmVudC5zdHlsZS53aWR0aD1cIjE4JVwiO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudC5uZXh0RWxlbWVudFNpYmxpbmcuc3R5bGUud2lkdGg9XCIxNiVcIjtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQucHJldmlvdXNFbGVtZW50U2libGluZy5zdHlsZS53aWR0aD1cIjE2JVwiO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudC5uZXh0RWxlbWVudFNpYmxpbmcubmV4dEVsZW1lbnRTaWJsaW5nLnN0eWxlLndpZHRoPVwiMTQlXCI7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmcucHJldmlvdXNFbGVtZW50U2libGluZy5zdHlsZS53aWR0aD1cIjE0JVwiO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICQoXCIubW9kYWxfZGlhbG9nX2NvbnRlbnRfaXRlbVwiKS5ub3QoXCI6Zmlyc3RcIikuaGlkZSgpO1xyXG4gICAgJChcIi5tb2RhbF9kaWFsb2dfY29udGVudCAubW9kYWxfYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgXHQkKFwiLm1vZGFsX2RpYWxvZ19jb250ZW50IC5tb2RhbF9idXR0b25cIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIikuZXEoJCh0aGlzKS5pbmRleCgpKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgIFx0JChcIi5tb2RhbF9kaWFsb2dfY29udGVudF9pdGVtXCIpLmhpZGUoKS5lcSgkKHRoaXMpLmluZGV4KCkpLmZhZGVJbigpXHJcbiAgICB9KS5lcSgwKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgIGNvbnN0IG1vZGFsQ2FsbCA9ICQoXCJbZGF0YS1tb2RhbF1cIik7XHJcbiAgICBjb25zdCBtb2RhbENsb3NlID0gJChcIltkYXRhLWNsb3NlXVwiKTtcclxuXHJcbiAgICBtb2RhbENhbGwub24oXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIGxldCAkdGhpcyA9ICQodGhpcyk7XHJcbiAgICAgICAgbGV0IG1vZGFsSWQgPSAkdGhpcy5kYXRhKCdtb2RhbCcpO1xyXG5cclxuICAgICAgICAkKG1vZGFsSWQpLmFkZENsYXNzKCdzaG93Jyk7XHJcbiAgICAgICAgJChcImJvZHlcIikuYWRkQ2xhc3MoJ25vLXNjcm9sbCcpXHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQobW9kYWxJZCkuZmluZChcIi5sb2NhdGlvblwiKS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBcInNjYWxlKDEpXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSwgMTAwKTtcclxuXHJcbiAgICBcclxuXHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgbW9kYWxDbG9zZS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgbGV0ICR0aGlzID0gJCh0aGlzKTtcclxuICAgICAgICBsZXQgbW9kYWxQYXJlbnQgPSAkdGhpcy5wYXJlbnRzKCcubW9kYWwnKTtcclxuXHJcbiAgICAgICAgbW9kYWxQYXJlbnQuZmluZChcIi5sb2NhdGlvblwiKS5jc3Moe1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IFwic2NhbGUoMClcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBtb2RhbFBhcmVudC5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG4gICAgICAgICAgICAkKFwiYm9keVwiKS5yZW1vdmVDbGFzcygnbm8tc2Nyb2xsJyk7XHJcbiAgICAgICAgfSwgMTAwKTtcclxuXHJcbiAgICBcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiLm1vZGFsXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBsZXQgJHRoaXMgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAkdGhpcy5maW5kKFwiLmxvY2F0aW9uXCIpLmNzcyh7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogXCJzY2FsZSgwKVwiXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICR0aGlzLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKCduby1zY3JvbGwnKTtcclxuICAgICAgICB9LCAyMDApO1xyXG4gXHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiLmxvY2F0aW9uXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH0pO1xyXG4gICAgbGV0IGRvYz0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNvbnRyJyk7XHJcbiAgICBkb2MuZm9yRWFjaChub2RlID0+IHtcclxuICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgZG9jLmZvckVhY2gobm9kZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBub2RlLnN0eWxlLndpZHRoPScyMjNweCc7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGN1cnJlbnQ9ZWxlbWVudC50YXJnZXQ7XHJcbiAgICAgICAgICAgIGN1cnJlbnQuc3R5bGUud2lkdGg9XCIyODRweFwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIH0pXHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgJCgnYVtocmVmXj1cIiNcIl0nKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIC8vINC+0YLQvNC10L3Rj9C10Lwg0YHRgtCw0L3QtNCw0YDRgtC90L7QtSDQtNC10LnRgdGC0LLQuNC1XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIFxyXG4gICAgICAgIHZhciBzYyA9ICQodGhpcykuYXR0cihcImhyZWZcIiksXHJcbiAgICAgICAgICAgIGRuID0gJChzYykub2Zmc2V0KCkudG9wO1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgKiBzYyAtINCyINC/0LXRgNC10LzQtdC90L3Rg9GOINC30LDQvdC+0YHQuNC8INC40L3RhNC+0YDQvNCw0YbQuNGOINC+INGC0L7QvCwg0Log0LrQsNC60L7QvNGDINCx0LvQvtC60YMg0L3QsNC00L4g0L/QtdGA0LXQudGC0LhcclxuICAgICAgICAqIGRuIC0g0L7Qv9GA0LXQtNC10LvRj9C10Lwg0L/QvtC70L7QttC10L3QuNC1INCx0LvQvtC60LAg0L3QsCDRgdGC0YDQsNC90LjRhtC1XHJcbiAgICAgICAgKi9cclxuICAgIFxyXG4gICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtzY3JvbGxUb3A6IGRufSwgMTAwMCk7XHJcbiAgICBcclxuICAgICAgICAvKlxyXG4gICAgICAgICogMTAwMCDRgdC60L7RgNC+0YHRgtGMINC/0LXRgNC10YXQvtC00LAg0LIg0LzQuNC70LvQuNGB0LXQutGD0L3QtNCw0YVcclxuICAgICAgICAqL1xyXG4gICAgfSk7XHJcblxyXG4gICAgLyp3aW5kb3cub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB3aW5kb3cuTm9kZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2FzZXNfY29udGVudF9pdGVtJyk7XHJcbiAgICAgICAgbGV0IGkgPSAtMTtcclxuICAgICAgICBsZXQgY291bnQgPSAwO1xyXG4gICAgICAgIGxldCBmbGFnID0gZmFsc2U7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAod2luZG93LnNjcm9sbFkgPiBOb2Rlc1swXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS55KSB7XHJcbiAgICAgICAgICAgICAgICBmbGFnID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgIHtcclxuICAgICAgICAgICAgcGFzc2l2ZTogZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGZsYWcgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3Njcm9sbCcgKyB3aW5kb3cuc2Nyb2xsWSk7XHJcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY291bnQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ID4gMTApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaSA8IE5vZGVzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBOb2Rlc1tpXS5zY3JvbGxJbnRvVmlldyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWhhdmlvcjogJ3Ntb290aCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhZz1mYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgcGFzc2l2ZTogZmFsc2VcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgICovXHJcbiAgICAvLyAkKFwiLmNhc2VzX3NpZGViYXJfbGlzdF9pdGVtXCIpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuICAgIC8vICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAvLyAgICAgJChcIi5jYXNlc19zaWRlYmFyX2xpc3RfaXRlbVwiKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAvLyAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAvLyB9KTtcclxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJChcIi5pbnRyb19jYXNlc1wiKS5oaWRlKCk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgJChcIiNvcFwiKS5jbGljayhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIC8vICQoXCIuaW50cm9faXRlbXNcIikucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgIC8vICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuICAgICAgICAvLyAkKFwiLmludHJvX2l0ZW1zXCIpLmFkZENsYXNzKCdkaXNwbGF5X25vbmUnKTtcclxuICAgICAgICAkKFwiLmludHJvX2l0ZW1zXCIpLmhpZGUoKTtcclxuICAgICAgICAkKFwiLmludHJvX2Nhc2VzXCIpLnNob3coJ3NwZWVkJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG4gICAgLy8gXHQkKFwiI29wXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICAvLyBcdFx0JChcIi5pbnRyb19pdGVtc1wiKS50b2dnbGVDbGFzcyhcImRpc3BsYXlfbm9uZVwiKTsgcmV0dXJuIGZhbHNlO1xyXG4gICAgLy8gXHR9KTtcclxuICAgIC8vIH0pO1xyXG5cclxuXHJcbiAgICAvLyAkKFwiI2J0bi1kcm9wXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gICAgIGlmIChmbGFnWydkcm9wJ10gPSAhZmxhZ1snZHJvcCddKSB7XHJcbiAgICAvLyAgICAgICAgICQoXCIjdGVzdC1kcm9wXCIpLmhpZGUoXCJkcm9wXCIsIHsgZGlyZWN0aW9uOiBcInJpZ2h0XCIgfSwgMTAwMCk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgIGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAkKFwiI3Rlc3QtZHJvcFwiKS5zaG93KFwiZHJvcFwiLCB7IGRpcmVjdGlvbjogXCJkb3duXCIgfSwgNTAwKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9KTtcclxuICAgIC8qKlxyXG4gICAgICog0KTQuNC60YHQuNGA0L7QstCw0L3QvdGL0Lkg0YXQtdC00LXRgFxyXG4gICAgICovXHJcblxyXG4gICAgLy8gJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCB0b2dnbGVGaXhlZEhlYWRlcik7XHJcblxyXG4gICAgLy8gZnVuY3Rpb24gdG9nZ2xlRml4ZWRIZWFkZXIoKSB7XHJcbiAgICAvLyAgICAgY29uc3QgJGhlYWRlciA9ICQoJy5oZWFkZXInKTtcclxuICAgIC8vICAgICBjb25zdCAkbWFpbiA9ICQoJy5oZWFkZXInKS5uZXh0KCk7XHJcblxyXG4gICAgLy8gICAgIGlmICh3aW5kb3cucGFnZVlPZmZzZXQgPiAwKSB7XHJcbiAgICAvLyAgICAgICAgICRoZWFkZXIuYWRkQ2xhc3MoJ2lzLWZpeGVkJyk7XHJcbiAgICAvLyAgICAgICAgICRtYWluLmNzcyh7IG1hcmdpblRvcDogJGhlYWRlci5vdXRlckhlaWdodCgpIH0pO1xyXG4gICAgLy8gICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICRoZWFkZXIucmVtb3ZlQ2xhc3MoJ2lzLWZpeGVkJyk7XHJcbiAgICAvLyAgICAgICAgICRtYWluLmNzcyh7IG1hcmdpblRvcDogMCB9KTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9XHJcblxyXG4gICAgIWZ1bmN0aW9uKGkpe1widXNlIHN0cmljdFwiO1wiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wianF1ZXJ5XCJdLGkpOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBleHBvcnRzP21vZHVsZS5leHBvcnRzPWkocmVxdWlyZShcImpxdWVyeVwiKSk6aShqUXVlcnkpfShmdW5jdGlvbihpKXtcInVzZSBzdHJpY3RcIjt2YXIgZT13aW5kb3cuU2xpY2t8fHt9OyhlPWZ1bmN0aW9uKCl7dmFyIGU9MDtyZXR1cm4gZnVuY3Rpb24odCxvKXt2YXIgcyxuPXRoaXM7bi5kZWZhdWx0cz17YWNjZXNzaWJpbGl0eTohMCxhZGFwdGl2ZUhlaWdodDohMSxhcHBlbmRBcnJvd3M6aSh0KSxhcHBlbmREb3RzOmkodCksYXJyb3dzOiEwLGFzTmF2Rm9yOm51bGwscHJldkFycm93Oic8YnV0dG9uIGNsYXNzPVwic2xpY2stcHJldlwiIGFyaWEtbGFiZWw9XCJQcmV2aW91c1wiIHR5cGU9XCJidXR0b25cIj5QcmV2aW91czwvYnV0dG9uPicsbmV4dEFycm93Oic8YnV0dG9uIGNsYXNzPVwic2xpY2stbmV4dFwiIGFyaWEtbGFiZWw9XCJOZXh0XCIgdHlwZT1cImJ1dHRvblwiPk5leHQ8L2J1dHRvbj4nLGF1dG9wbGF5OiExLGF1dG9wbGF5U3BlZWQ6M2UzLGNlbnRlck1vZGU6ITEsY2VudGVyUGFkZGluZzpcIjUwcHhcIixjc3NFYXNlOlwiZWFzZVwiLGN1c3RvbVBhZ2luZzpmdW5jdGlvbihlLHQpe3JldHVybiBpKCc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiAvPicpLnRleHQodCsxKX0sZG90czohMSxkb3RzQ2xhc3M6XCJzbGljay1kb3RzXCIsZHJhZ2dhYmxlOiEwLGVhc2luZzpcImxpbmVhclwiLGVkZ2VGcmljdGlvbjouMzUsZmFkZTohMSxmb2N1c09uU2VsZWN0OiExLGZvY3VzT25DaGFuZ2U6ITEsaW5maW5pdGU6ITAsaW5pdGlhbFNsaWRlOjAsbGF6eUxvYWQ6XCJvbmRlbWFuZFwiLG1vYmlsZUZpcnN0OiExLHBhdXNlT25Ib3ZlcjohMCxwYXVzZU9uRm9jdXM6ITAscGF1c2VPbkRvdHNIb3ZlcjohMSxyZXNwb25kVG86XCJ3aW5kb3dcIixyZXNwb25zaXZlOm51bGwscm93czoxLHJ0bDohMSxzbGlkZTpcIlwiLHNsaWRlc1BlclJvdzoxLHNsaWRlc1RvU2hvdzoxLHNsaWRlc1RvU2Nyb2xsOjEsc3BlZWQ6NTAwLHN3aXBlOiEwLHN3aXBlVG9TbGlkZTohMSx0b3VjaE1vdmU6ITAsdG91Y2hUaHJlc2hvbGQ6NSx1c2VDU1M6ITAsdXNlVHJhbnNmb3JtOiEwLHZhcmlhYmxlV2lkdGg6ITEsdmVydGljYWw6ITEsdmVydGljYWxTd2lwaW5nOiExLHdhaXRGb3JBbmltYXRlOiEwLHpJbmRleDoxZTN9LG4uaW5pdGlhbHM9e2FuaW1hdGluZzohMSxkcmFnZ2luZzohMSxhdXRvUGxheVRpbWVyOm51bGwsY3VycmVudERpcmVjdGlvbjowLGN1cnJlbnRMZWZ0Om51bGwsY3VycmVudFNsaWRlOjAsZGlyZWN0aW9uOjEsJGRvdHM6bnVsbCxsaXN0V2lkdGg6bnVsbCxsaXN0SGVpZ2h0Om51bGwsbG9hZEluZGV4OjAsJG5leHRBcnJvdzpudWxsLCRwcmV2QXJyb3c6bnVsbCxzY3JvbGxpbmc6ITEsc2xpZGVDb3VudDpudWxsLHNsaWRlV2lkdGg6bnVsbCwkc2xpZGVUcmFjazpudWxsLCRzbGlkZXM6bnVsbCxzbGlkaW5nOiExLHNsaWRlT2Zmc2V0OjAsc3dpcGVMZWZ0Om51bGwsc3dpcGluZzohMSwkbGlzdDpudWxsLHRvdWNoT2JqZWN0Ont9LHRyYW5zZm9ybXNFbmFibGVkOiExLHVuc2xpY2tlZDohMX0saS5leHRlbmQobixuLmluaXRpYWxzKSxuLmFjdGl2ZUJyZWFrcG9pbnQ9bnVsbCxuLmFuaW1UeXBlPW51bGwsbi5hbmltUHJvcD1udWxsLG4uYnJlYWtwb2ludHM9W10sbi5icmVha3BvaW50U2V0dGluZ3M9W10sbi5jc3NUcmFuc2l0aW9ucz0hMSxuLmZvY3Vzc2VkPSExLG4uaW50ZXJydXB0ZWQ9ITEsbi5oaWRkZW49XCJoaWRkZW5cIixuLnBhdXNlZD0hMCxuLnBvc2l0aW9uUHJvcD1udWxsLG4ucmVzcG9uZFRvPW51bGwsbi5yb3dDb3VudD0xLG4uc2hvdWxkQ2xpY2s9ITAsbi4kc2xpZGVyPWkodCksbi4kc2xpZGVzQ2FjaGU9bnVsbCxuLnRyYW5zZm9ybVR5cGU9bnVsbCxuLnRyYW5zaXRpb25UeXBlPW51bGwsbi52aXNpYmlsaXR5Q2hhbmdlPVwidmlzaWJpbGl0eWNoYW5nZVwiLG4ud2luZG93V2lkdGg9MCxuLndpbmRvd1RpbWVyPW51bGwscz1pKHQpLmRhdGEoXCJzbGlja1wiKXx8e30sbi5vcHRpb25zPWkuZXh0ZW5kKHt9LG4uZGVmYXVsdHMsbyxzKSxuLmN1cnJlbnRTbGlkZT1uLm9wdGlvbnMuaW5pdGlhbFNsaWRlLG4ub3JpZ2luYWxTZXR0aW5ncz1uLm9wdGlvbnMsdm9pZCAwIT09ZG9jdW1lbnQubW96SGlkZGVuPyhuLmhpZGRlbj1cIm1vekhpZGRlblwiLG4udmlzaWJpbGl0eUNoYW5nZT1cIm1venZpc2liaWxpdHljaGFuZ2VcIik6dm9pZCAwIT09ZG9jdW1lbnQud2Via2l0SGlkZGVuJiYobi5oaWRkZW49XCJ3ZWJraXRIaWRkZW5cIixuLnZpc2liaWxpdHlDaGFuZ2U9XCJ3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlXCIpLG4uYXV0b1BsYXk9aS5wcm94eShuLmF1dG9QbGF5LG4pLG4uYXV0b1BsYXlDbGVhcj1pLnByb3h5KG4uYXV0b1BsYXlDbGVhcixuKSxuLmF1dG9QbGF5SXRlcmF0b3I9aS5wcm94eShuLmF1dG9QbGF5SXRlcmF0b3Isbiksbi5jaGFuZ2VTbGlkZT1pLnByb3h5KG4uY2hhbmdlU2xpZGUsbiksbi5jbGlja0hhbmRsZXI9aS5wcm94eShuLmNsaWNrSGFuZGxlcixuKSxuLnNlbGVjdEhhbmRsZXI9aS5wcm94eShuLnNlbGVjdEhhbmRsZXIsbiksbi5zZXRQb3NpdGlvbj1pLnByb3h5KG4uc2V0UG9zaXRpb24sbiksbi5zd2lwZUhhbmRsZXI9aS5wcm94eShuLnN3aXBlSGFuZGxlcixuKSxuLmRyYWdIYW5kbGVyPWkucHJveHkobi5kcmFnSGFuZGxlcixuKSxuLmtleUhhbmRsZXI9aS5wcm94eShuLmtleUhhbmRsZXIsbiksbi5pbnN0YW5jZVVpZD1lKyssbi5odG1sRXhwcj0vXig/OlxccyooPFtcXHdcXFddKz4pW14+XSopJC8sbi5yZWdpc3RlckJyZWFrcG9pbnRzKCksbi5pbml0KCEwKX19KCkpLnByb3RvdHlwZS5hY3RpdmF0ZUFEQT1mdW5jdGlvbigpe3RoaXMuJHNsaWRlVHJhY2suZmluZChcIi5zbGljay1hY3RpdmVcIikuYXR0cih7XCJhcmlhLWhpZGRlblwiOlwiZmFsc2VcIn0pLmZpbmQoXCJhLCBpbnB1dCwgYnV0dG9uLCBzZWxlY3RcIikuYXR0cih7dGFiaW5kZXg6XCIwXCJ9KX0sZS5wcm90b3R5cGUuYWRkU2xpZGU9ZS5wcm90b3R5cGUuc2xpY2tBZGQ9ZnVuY3Rpb24oZSx0LG8pe3ZhciBzPXRoaXM7aWYoXCJib29sZWFuXCI9PXR5cGVvZiB0KW89dCx0PW51bGw7ZWxzZSBpZih0PDB8fHQ+PXMuc2xpZGVDb3VudClyZXR1cm4hMTtzLnVubG9hZCgpLFwibnVtYmVyXCI9PXR5cGVvZiB0PzA9PT10JiYwPT09cy4kc2xpZGVzLmxlbmd0aD9pKGUpLmFwcGVuZFRvKHMuJHNsaWRlVHJhY2spOm8/aShlKS5pbnNlcnRCZWZvcmUocy4kc2xpZGVzLmVxKHQpKTppKGUpLmluc2VydEFmdGVyKHMuJHNsaWRlcy5lcSh0KSk6ITA9PT1vP2koZSkucHJlcGVuZFRvKHMuJHNsaWRlVHJhY2spOmkoZSkuYXBwZW5kVG8ocy4kc2xpZGVUcmFjaykscy4kc2xpZGVzPXMuJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKSxzLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCkscy4kc2xpZGVUcmFjay5hcHBlbmQocy4kc2xpZGVzKSxzLiRzbGlkZXMuZWFjaChmdW5jdGlvbihlLHQpe2kodCkuYXR0cihcImRhdGEtc2xpY2staW5kZXhcIixlKX0pLHMuJHNsaWRlc0NhY2hlPXMuJHNsaWRlcyxzLnJlaW5pdCgpfSxlLnByb3RvdHlwZS5hbmltYXRlSGVpZ2h0PWZ1bmN0aW9uKCl7dmFyIGk9dGhpcztpZigxPT09aS5vcHRpb25zLnNsaWRlc1RvU2hvdyYmITA9PT1pLm9wdGlvbnMuYWRhcHRpdmVIZWlnaHQmJiExPT09aS5vcHRpb25zLnZlcnRpY2FsKXt2YXIgZT1pLiRzbGlkZXMuZXEoaS5jdXJyZW50U2xpZGUpLm91dGVySGVpZ2h0KCEwKTtpLiRsaXN0LmFuaW1hdGUoe2hlaWdodDplfSxpLm9wdGlvbnMuc3BlZWQpfX0sZS5wcm90b3R5cGUuYW5pbWF0ZVNsaWRlPWZ1bmN0aW9uKGUsdCl7dmFyIG89e30scz10aGlzO3MuYW5pbWF0ZUhlaWdodCgpLCEwPT09cy5vcHRpb25zLnJ0bCYmITE9PT1zLm9wdGlvbnMudmVydGljYWwmJihlPS1lKSwhMT09PXMudHJhbnNmb3Jtc0VuYWJsZWQ/ITE9PT1zLm9wdGlvbnMudmVydGljYWw/cy4kc2xpZGVUcmFjay5hbmltYXRlKHtsZWZ0OmV9LHMub3B0aW9ucy5zcGVlZCxzLm9wdGlvbnMuZWFzaW5nLHQpOnMuJHNsaWRlVHJhY2suYW5pbWF0ZSh7dG9wOmV9LHMub3B0aW9ucy5zcGVlZCxzLm9wdGlvbnMuZWFzaW5nLHQpOiExPT09cy5jc3NUcmFuc2l0aW9ucz8oITA9PT1zLm9wdGlvbnMucnRsJiYocy5jdXJyZW50TGVmdD0tcy5jdXJyZW50TGVmdCksaSh7YW5pbVN0YXJ0OnMuY3VycmVudExlZnR9KS5hbmltYXRlKHthbmltU3RhcnQ6ZX0se2R1cmF0aW9uOnMub3B0aW9ucy5zcGVlZCxlYXNpbmc6cy5vcHRpb25zLmVhc2luZyxzdGVwOmZ1bmN0aW9uKGkpe2k9TWF0aC5jZWlsKGkpLCExPT09cy5vcHRpb25zLnZlcnRpY2FsPyhvW3MuYW5pbVR5cGVdPVwidHJhbnNsYXRlKFwiK2krXCJweCwgMHB4KVwiLHMuJHNsaWRlVHJhY2suY3NzKG8pKToob1tzLmFuaW1UeXBlXT1cInRyYW5zbGF0ZSgwcHgsXCIraStcInB4KVwiLHMuJHNsaWRlVHJhY2suY3NzKG8pKX0sY29tcGxldGU6ZnVuY3Rpb24oKXt0JiZ0LmNhbGwoKX19KSk6KHMuYXBwbHlUcmFuc2l0aW9uKCksZT1NYXRoLmNlaWwoZSksITE9PT1zLm9wdGlvbnMudmVydGljYWw/b1tzLmFuaW1UeXBlXT1cInRyYW5zbGF0ZTNkKFwiK2UrXCJweCwgMHB4LCAwcHgpXCI6b1tzLmFuaW1UeXBlXT1cInRyYW5zbGF0ZTNkKDBweCxcIitlK1wicHgsIDBweClcIixzLiRzbGlkZVRyYWNrLmNzcyhvKSx0JiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7cy5kaXNhYmxlVHJhbnNpdGlvbigpLHQuY2FsbCgpfSxzLm9wdGlvbnMuc3BlZWQpKX0sZS5wcm90b3R5cGUuZ2V0TmF2VGFyZ2V0PWZ1bmN0aW9uKCl7dmFyIGU9dGhpcyx0PWUub3B0aW9ucy5hc05hdkZvcjtyZXR1cm4gdCYmbnVsbCE9PXQmJih0PWkodCkubm90KGUuJHNsaWRlcikpLHR9LGUucHJvdG90eXBlLmFzTmF2Rm9yPWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMuZ2V0TmF2VGFyZ2V0KCk7bnVsbCE9PXQmJlwib2JqZWN0XCI9PXR5cGVvZiB0JiZ0LmVhY2goZnVuY3Rpb24oKXt2YXIgdD1pKHRoaXMpLnNsaWNrKFwiZ2V0U2xpY2tcIik7dC51bnNsaWNrZWR8fHQuc2xpZGVIYW5kbGVyKGUsITApfSl9LGUucHJvdG90eXBlLmFwcGx5VHJhbnNpdGlvbj1mdW5jdGlvbihpKXt2YXIgZT10aGlzLHQ9e307ITE9PT1lLm9wdGlvbnMuZmFkZT90W2UudHJhbnNpdGlvblR5cGVdPWUudHJhbnNmb3JtVHlwZStcIiBcIitlLm9wdGlvbnMuc3BlZWQrXCJtcyBcIitlLm9wdGlvbnMuY3NzRWFzZTp0W2UudHJhbnNpdGlvblR5cGVdPVwib3BhY2l0eSBcIitlLm9wdGlvbnMuc3BlZWQrXCJtcyBcIitlLm9wdGlvbnMuY3NzRWFzZSwhMT09PWUub3B0aW9ucy5mYWRlP2UuJHNsaWRlVHJhY2suY3NzKHQpOmUuJHNsaWRlcy5lcShpKS5jc3ModCl9LGUucHJvdG90eXBlLmF1dG9QbGF5PWZ1bmN0aW9uKCl7dmFyIGk9dGhpcztpLmF1dG9QbGF5Q2xlYXIoKSxpLnNsaWRlQ291bnQ+aS5vcHRpb25zLnNsaWRlc1RvU2hvdyYmKGkuYXV0b1BsYXlUaW1lcj1zZXRJbnRlcnZhbChpLmF1dG9QbGF5SXRlcmF0b3IsaS5vcHRpb25zLmF1dG9wbGF5U3BlZWQpKX0sZS5wcm90b3R5cGUuYXV0b1BsYXlDbGVhcj1mdW5jdGlvbigpe3ZhciBpPXRoaXM7aS5hdXRvUGxheVRpbWVyJiZjbGVhckludGVydmFsKGkuYXV0b1BsYXlUaW1lcil9LGUucHJvdG90eXBlLmF1dG9QbGF5SXRlcmF0b3I9ZnVuY3Rpb24oKXt2YXIgaT10aGlzLGU9aS5jdXJyZW50U2xpZGUraS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO2kucGF1c2VkfHxpLmludGVycnVwdGVkfHxpLmZvY3Vzc2VkfHwoITE9PT1pLm9wdGlvbnMuaW5maW5pdGUmJigxPT09aS5kaXJlY3Rpb24mJmkuY3VycmVudFNsaWRlKzE9PT1pLnNsaWRlQ291bnQtMT9pLmRpcmVjdGlvbj0wOjA9PT1pLmRpcmVjdGlvbiYmKGU9aS5jdXJyZW50U2xpZGUtaS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsLGkuY3VycmVudFNsaWRlLTE9PTAmJihpLmRpcmVjdGlvbj0xKSkpLGkuc2xpZGVIYW5kbGVyKGUpKX0sZS5wcm90b3R5cGUuYnVpbGRBcnJvd3M9ZnVuY3Rpb24oKXt2YXIgZT10aGlzOyEwPT09ZS5vcHRpb25zLmFycm93cyYmKGUuJHByZXZBcnJvdz1pKGUub3B0aW9ucy5wcmV2QXJyb3cpLmFkZENsYXNzKFwic2xpY2stYXJyb3dcIiksZS4kbmV4dEFycm93PWkoZS5vcHRpb25zLm5leHRBcnJvdykuYWRkQ2xhc3MoXCJzbGljay1hcnJvd1wiKSxlLnNsaWRlQ291bnQ+ZS5vcHRpb25zLnNsaWRlc1RvU2hvdz8oZS4kcHJldkFycm93LnJlbW92ZUNsYXNzKFwic2xpY2staGlkZGVuXCIpLnJlbW92ZUF0dHIoXCJhcmlhLWhpZGRlbiB0YWJpbmRleFwiKSxlLiRuZXh0QXJyb3cucmVtb3ZlQ2xhc3MoXCJzbGljay1oaWRkZW5cIikucmVtb3ZlQXR0cihcImFyaWEtaGlkZGVuIHRhYmluZGV4XCIpLGUuaHRtbEV4cHIudGVzdChlLm9wdGlvbnMucHJldkFycm93KSYmZS4kcHJldkFycm93LnByZXBlbmRUbyhlLm9wdGlvbnMuYXBwZW5kQXJyb3dzKSxlLmh0bWxFeHByLnRlc3QoZS5vcHRpb25zLm5leHRBcnJvdykmJmUuJG5leHRBcnJvdy5hcHBlbmRUbyhlLm9wdGlvbnMuYXBwZW5kQXJyb3dzKSwhMCE9PWUub3B0aW9ucy5pbmZpbml0ZSYmZS4kcHJldkFycm93LmFkZENsYXNzKFwic2xpY2stZGlzYWJsZWRcIikuYXR0cihcImFyaWEtZGlzYWJsZWRcIixcInRydWVcIikpOmUuJHByZXZBcnJvdy5hZGQoZS4kbmV4dEFycm93KS5hZGRDbGFzcyhcInNsaWNrLWhpZGRlblwiKS5hdHRyKHtcImFyaWEtZGlzYWJsZWRcIjpcInRydWVcIix0YWJpbmRleDpcIi0xXCJ9KSl9LGUucHJvdG90eXBlLmJ1aWxkRG90cz1mdW5jdGlvbigpe3ZhciBlLHQsbz10aGlzO2lmKCEwPT09by5vcHRpb25zLmRvdHMpe2ZvcihvLiRzbGlkZXIuYWRkQ2xhc3MoXCJzbGljay1kb3R0ZWRcIiksdD1pKFwiPHVsIC8+XCIpLmFkZENsYXNzKG8ub3B0aW9ucy5kb3RzQ2xhc3MpLGU9MDtlPD1vLmdldERvdENvdW50KCk7ZSs9MSl0LmFwcGVuZChpKFwiPGxpIC8+XCIpLmFwcGVuZChvLm9wdGlvbnMuY3VzdG9tUGFnaW5nLmNhbGwodGhpcyxvLGUpKSk7by4kZG90cz10LmFwcGVuZFRvKG8ub3B0aW9ucy5hcHBlbmREb3RzKSxvLiRkb3RzLmZpbmQoXCJsaVwiKS5maXJzdCgpLmFkZENsYXNzKFwic2xpY2stYWN0aXZlXCIpfX0sZS5wcm90b3R5cGUuYnVpbGRPdXQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2UuJHNsaWRlcz1lLiRzbGlkZXIuY2hpbGRyZW4oZS5vcHRpb25zLnNsaWRlK1wiOm5vdCguc2xpY2stY2xvbmVkKVwiKS5hZGRDbGFzcyhcInNsaWNrLXNsaWRlXCIpLGUuc2xpZGVDb3VudD1lLiRzbGlkZXMubGVuZ3RoLGUuJHNsaWRlcy5lYWNoKGZ1bmN0aW9uKGUsdCl7aSh0KS5hdHRyKFwiZGF0YS1zbGljay1pbmRleFwiLGUpLmRhdGEoXCJvcmlnaW5hbFN0eWxpbmdcIixpKHQpLmF0dHIoXCJzdHlsZVwiKXx8XCJcIil9KSxlLiRzbGlkZXIuYWRkQ2xhc3MoXCJzbGljay1zbGlkZXJcIiksZS4kc2xpZGVUcmFjaz0wPT09ZS5zbGlkZUNvdW50P2koJzxkaXYgY2xhc3M9XCJzbGljay10cmFja1wiLz4nKS5hcHBlbmRUbyhlLiRzbGlkZXIpOmUuJHNsaWRlcy53cmFwQWxsKCc8ZGl2IGNsYXNzPVwic2xpY2stdHJhY2tcIi8+JykucGFyZW50KCksZS4kbGlzdD1lLiRzbGlkZVRyYWNrLndyYXAoJzxkaXYgY2xhc3M9XCJzbGljay1saXN0XCIvPicpLnBhcmVudCgpLGUuJHNsaWRlVHJhY2suY3NzKFwib3BhY2l0eVwiLDApLCEwIT09ZS5vcHRpb25zLmNlbnRlck1vZGUmJiEwIT09ZS5vcHRpb25zLnN3aXBlVG9TbGlkZXx8KGUub3B0aW9ucy5zbGlkZXNUb1Njcm9sbD0xKSxpKFwiaW1nW2RhdGEtbGF6eV1cIixlLiRzbGlkZXIpLm5vdChcIltzcmNdXCIpLmFkZENsYXNzKFwic2xpY2stbG9hZGluZ1wiKSxlLnNldHVwSW5maW5pdGUoKSxlLmJ1aWxkQXJyb3dzKCksZS5idWlsZERvdHMoKSxlLnVwZGF0ZURvdHMoKSxlLnNldFNsaWRlQ2xhc3NlcyhcIm51bWJlclwiPT10eXBlb2YgZS5jdXJyZW50U2xpZGU/ZS5jdXJyZW50U2xpZGU6MCksITA9PT1lLm9wdGlvbnMuZHJhZ2dhYmxlJiZlLiRsaXN0LmFkZENsYXNzKFwiZHJhZ2dhYmxlXCIpfSxlLnByb3RvdHlwZS5idWlsZFJvd3M9ZnVuY3Rpb24oKXt2YXIgaSxlLHQsbyxzLG4scixsPXRoaXM7aWYobz1kb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksbj1sLiRzbGlkZXIuY2hpbGRyZW4oKSxsLm9wdGlvbnMucm93cz4xKXtmb3Iocj1sLm9wdGlvbnMuc2xpZGVzUGVyUm93Kmwub3B0aW9ucy5yb3dzLHM9TWF0aC5jZWlsKG4ubGVuZ3RoL3IpLGk9MDtpPHM7aSsrKXt2YXIgZD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2ZvcihlPTA7ZTxsLm9wdGlvbnMucm93cztlKyspe3ZhciBhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7Zm9yKHQ9MDt0PGwub3B0aW9ucy5zbGlkZXNQZXJSb3c7dCsrKXt2YXIgYz1pKnIrKGUqbC5vcHRpb25zLnNsaWRlc1BlclJvdyt0KTtuLmdldChjKSYmYS5hcHBlbmRDaGlsZChuLmdldChjKSl9ZC5hcHBlbmRDaGlsZChhKX1vLmFwcGVuZENoaWxkKGQpfWwuJHNsaWRlci5lbXB0eSgpLmFwcGVuZChvKSxsLiRzbGlkZXIuY2hpbGRyZW4oKS5jaGlsZHJlbigpLmNoaWxkcmVuKCkuY3NzKHt3aWR0aDoxMDAvbC5vcHRpb25zLnNsaWRlc1BlclJvdytcIiVcIixkaXNwbGF5OlwiaW5saW5lLWJsb2NrXCJ9KX19LGUucHJvdG90eXBlLmNoZWNrUmVzcG9uc2l2ZT1mdW5jdGlvbihlLHQpe3ZhciBvLHMsbixyPXRoaXMsbD0hMSxkPXIuJHNsaWRlci53aWR0aCgpLGE9d2luZG93LmlubmVyV2lkdGh8fGkod2luZG93KS53aWR0aCgpO2lmKFwid2luZG93XCI9PT1yLnJlc3BvbmRUbz9uPWE6XCJzbGlkZXJcIj09PXIucmVzcG9uZFRvP249ZDpcIm1pblwiPT09ci5yZXNwb25kVG8mJihuPU1hdGgubWluKGEsZCkpLHIub3B0aW9ucy5yZXNwb25zaXZlJiZyLm9wdGlvbnMucmVzcG9uc2l2ZS5sZW5ndGgmJm51bGwhPT1yLm9wdGlvbnMucmVzcG9uc2l2ZSl7cz1udWxsO2ZvcihvIGluIHIuYnJlYWtwb2ludHMpci5icmVha3BvaW50cy5oYXNPd25Qcm9wZXJ0eShvKSYmKCExPT09ci5vcmlnaW5hbFNldHRpbmdzLm1vYmlsZUZpcnN0P248ci5icmVha3BvaW50c1tvXSYmKHM9ci5icmVha3BvaW50c1tvXSk6bj5yLmJyZWFrcG9pbnRzW29dJiYocz1yLmJyZWFrcG9pbnRzW29dKSk7bnVsbCE9PXM/bnVsbCE9PXIuYWN0aXZlQnJlYWtwb2ludD8ocyE9PXIuYWN0aXZlQnJlYWtwb2ludHx8dCkmJihyLmFjdGl2ZUJyZWFrcG9pbnQ9cyxcInVuc2xpY2tcIj09PXIuYnJlYWtwb2ludFNldHRpbmdzW3NdP3IudW5zbGljayhzKTooci5vcHRpb25zPWkuZXh0ZW5kKHt9LHIub3JpZ2luYWxTZXR0aW5ncyxyLmJyZWFrcG9pbnRTZXR0aW5nc1tzXSksITA9PT1lJiYoci5jdXJyZW50U2xpZGU9ci5vcHRpb25zLmluaXRpYWxTbGlkZSksci5yZWZyZXNoKGUpKSxsPXMpOihyLmFjdGl2ZUJyZWFrcG9pbnQ9cyxcInVuc2xpY2tcIj09PXIuYnJlYWtwb2ludFNldHRpbmdzW3NdP3IudW5zbGljayhzKTooci5vcHRpb25zPWkuZXh0ZW5kKHt9LHIub3JpZ2luYWxTZXR0aW5ncyxyLmJyZWFrcG9pbnRTZXR0aW5nc1tzXSksITA9PT1lJiYoci5jdXJyZW50U2xpZGU9ci5vcHRpb25zLmluaXRpYWxTbGlkZSksci5yZWZyZXNoKGUpKSxsPXMpOm51bGwhPT1yLmFjdGl2ZUJyZWFrcG9pbnQmJihyLmFjdGl2ZUJyZWFrcG9pbnQ9bnVsbCxyLm9wdGlvbnM9ci5vcmlnaW5hbFNldHRpbmdzLCEwPT09ZSYmKHIuY3VycmVudFNsaWRlPXIub3B0aW9ucy5pbml0aWFsU2xpZGUpLHIucmVmcmVzaChlKSxsPXMpLGV8fCExPT09bHx8ci4kc2xpZGVyLnRyaWdnZXIoXCJicmVha3BvaW50XCIsW3IsbF0pfX0sZS5wcm90b3R5cGUuY2hhbmdlU2xpZGU9ZnVuY3Rpb24oZSx0KXt2YXIgbyxzLG4scj10aGlzLGw9aShlLmN1cnJlbnRUYXJnZXQpO3N3aXRjaChsLmlzKFwiYVwiKSYmZS5wcmV2ZW50RGVmYXVsdCgpLGwuaXMoXCJsaVwiKXx8KGw9bC5jbG9zZXN0KFwibGlcIikpLG49ci5zbGlkZUNvdW50JXIub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCE9MCxvPW4/MDooci5zbGlkZUNvdW50LXIuY3VycmVudFNsaWRlKSVyLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwsZS5kYXRhLm1lc3NhZ2Upe2Nhc2VcInByZXZpb3VzXCI6cz0wPT09bz9yLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw6ci5vcHRpb25zLnNsaWRlc1RvU2hvdy1vLHIuc2xpZGVDb3VudD5yLm9wdGlvbnMuc2xpZGVzVG9TaG93JiZyLnNsaWRlSGFuZGxlcihyLmN1cnJlbnRTbGlkZS1zLCExLHQpO2JyZWFrO2Nhc2VcIm5leHRcIjpzPTA9PT1vP3Iub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDpvLHIuc2xpZGVDb3VudD5yLm9wdGlvbnMuc2xpZGVzVG9TaG93JiZyLnNsaWRlSGFuZGxlcihyLmN1cnJlbnRTbGlkZStzLCExLHQpO2JyZWFrO2Nhc2VcImluZGV4XCI6dmFyIGQ9MD09PWUuZGF0YS5pbmRleD8wOmUuZGF0YS5pbmRleHx8bC5pbmRleCgpKnIub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtyLnNsaWRlSGFuZGxlcihyLmNoZWNrTmF2aWdhYmxlKGQpLCExLHQpLGwuY2hpbGRyZW4oKS50cmlnZ2VyKFwiZm9jdXNcIik7YnJlYWs7ZGVmYXVsdDpyZXR1cm59fSxlLnByb3RvdHlwZS5jaGVja05hdmlnYWJsZT1mdW5jdGlvbihpKXt2YXIgZSx0O2lmKGU9dGhpcy5nZXROYXZpZ2FibGVJbmRleGVzKCksdD0wLGk+ZVtlLmxlbmd0aC0xXSlpPWVbZS5sZW5ndGgtMV07ZWxzZSBmb3IodmFyIG8gaW4gZSl7aWYoaTxlW29dKXtpPXQ7YnJlYWt9dD1lW29dfXJldHVybiBpfSxlLnByb3RvdHlwZS5jbGVhblVwRXZlbnRzPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcztlLm9wdGlvbnMuZG90cyYmbnVsbCE9PWUuJGRvdHMmJihpKFwibGlcIixlLiRkb3RzKS5vZmYoXCJjbGljay5zbGlja1wiLGUuY2hhbmdlU2xpZGUpLm9mZihcIm1vdXNlZW50ZXIuc2xpY2tcIixpLnByb3h5KGUuaW50ZXJydXB0LGUsITApKS5vZmYoXCJtb3VzZWxlYXZlLnNsaWNrXCIsaS5wcm94eShlLmludGVycnVwdCxlLCExKSksITA9PT1lLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSYmZS4kZG90cy5vZmYoXCJrZXlkb3duLnNsaWNrXCIsZS5rZXlIYW5kbGVyKSksZS4kc2xpZGVyLm9mZihcImZvY3VzLnNsaWNrIGJsdXIuc2xpY2tcIiksITA9PT1lLm9wdGlvbnMuYXJyb3dzJiZlLnNsaWRlQ291bnQ+ZS5vcHRpb25zLnNsaWRlc1RvU2hvdyYmKGUuJHByZXZBcnJvdyYmZS4kcHJldkFycm93Lm9mZihcImNsaWNrLnNsaWNrXCIsZS5jaGFuZ2VTbGlkZSksZS4kbmV4dEFycm93JiZlLiRuZXh0QXJyb3cub2ZmKFwiY2xpY2suc2xpY2tcIixlLmNoYW5nZVNsaWRlKSwhMD09PWUub3B0aW9ucy5hY2Nlc3NpYmlsaXR5JiYoZS4kcHJldkFycm93JiZlLiRwcmV2QXJyb3cub2ZmKFwia2V5ZG93bi5zbGlja1wiLGUua2V5SGFuZGxlciksZS4kbmV4dEFycm93JiZlLiRuZXh0QXJyb3cub2ZmKFwia2V5ZG93bi5zbGlja1wiLGUua2V5SGFuZGxlcikpKSxlLiRsaXN0Lm9mZihcInRvdWNoc3RhcnQuc2xpY2sgbW91c2Vkb3duLnNsaWNrXCIsZS5zd2lwZUhhbmRsZXIpLGUuJGxpc3Qub2ZmKFwidG91Y2htb3ZlLnNsaWNrIG1vdXNlbW92ZS5zbGlja1wiLGUuc3dpcGVIYW5kbGVyKSxlLiRsaXN0Lm9mZihcInRvdWNoZW5kLnNsaWNrIG1vdXNldXAuc2xpY2tcIixlLnN3aXBlSGFuZGxlciksZS4kbGlzdC5vZmYoXCJ0b3VjaGNhbmNlbC5zbGljayBtb3VzZWxlYXZlLnNsaWNrXCIsZS5zd2lwZUhhbmRsZXIpLGUuJGxpc3Qub2ZmKFwiY2xpY2suc2xpY2tcIixlLmNsaWNrSGFuZGxlciksaShkb2N1bWVudCkub2ZmKGUudmlzaWJpbGl0eUNoYW5nZSxlLnZpc2liaWxpdHkpLGUuY2xlYW5VcFNsaWRlRXZlbnRzKCksITA9PT1lLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSYmZS4kbGlzdC5vZmYoXCJrZXlkb3duLnNsaWNrXCIsZS5rZXlIYW5kbGVyKSwhMD09PWUub3B0aW9ucy5mb2N1c09uU2VsZWN0JiZpKGUuJHNsaWRlVHJhY2spLmNoaWxkcmVuKCkub2ZmKFwiY2xpY2suc2xpY2tcIixlLnNlbGVjdEhhbmRsZXIpLGkod2luZG93KS5vZmYoXCJvcmllbnRhdGlvbmNoYW5nZS5zbGljay5zbGljay1cIitlLmluc3RhbmNlVWlkLGUub3JpZW50YXRpb25DaGFuZ2UpLGkod2luZG93KS5vZmYoXCJyZXNpemUuc2xpY2suc2xpY2stXCIrZS5pbnN0YW5jZVVpZCxlLnJlc2l6ZSksaShcIltkcmFnZ2FibGUhPXRydWVdXCIsZS4kc2xpZGVUcmFjaykub2ZmKFwiZHJhZ3N0YXJ0XCIsZS5wcmV2ZW50RGVmYXVsdCksaSh3aW5kb3cpLm9mZihcImxvYWQuc2xpY2suc2xpY2stXCIrZS5pbnN0YW5jZVVpZCxlLnNldFBvc2l0aW9uKX0sZS5wcm90b3R5cGUuY2xlYW5VcFNsaWRlRXZlbnRzPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcztlLiRsaXN0Lm9mZihcIm1vdXNlZW50ZXIuc2xpY2tcIixpLnByb3h5KGUuaW50ZXJydXB0LGUsITApKSxlLiRsaXN0Lm9mZihcIm1vdXNlbGVhdmUuc2xpY2tcIixpLnByb3h5KGUuaW50ZXJydXB0LGUsITEpKX0sZS5wcm90b3R5cGUuY2xlYW5VcFJvd3M9ZnVuY3Rpb24oKXt2YXIgaSxlPXRoaXM7ZS5vcHRpb25zLnJvd3M+MSYmKChpPWUuJHNsaWRlcy5jaGlsZHJlbigpLmNoaWxkcmVuKCkpLnJlbW92ZUF0dHIoXCJzdHlsZVwiKSxlLiRzbGlkZXIuZW1wdHkoKS5hcHBlbmQoaSkpfSxlLnByb3RvdHlwZS5jbGlja0hhbmRsZXI9ZnVuY3Rpb24oaSl7ITE9PT10aGlzLnNob3VsZENsaWNrJiYoaS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKSxpLnN0b3BQcm9wYWdhdGlvbigpLGkucHJldmVudERlZmF1bHQoKSl9LGUucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpczt0LmF1dG9QbGF5Q2xlYXIoKSx0LnRvdWNoT2JqZWN0PXt9LHQuY2xlYW5VcEV2ZW50cygpLGkoXCIuc2xpY2stY2xvbmVkXCIsdC4kc2xpZGVyKS5kZXRhY2goKSx0LiRkb3RzJiZ0LiRkb3RzLnJlbW92ZSgpLHQuJHByZXZBcnJvdyYmdC4kcHJldkFycm93Lmxlbmd0aCYmKHQuJHByZXZBcnJvdy5yZW1vdmVDbGFzcyhcInNsaWNrLWRpc2FibGVkIHNsaWNrLWFycm93IHNsaWNrLWhpZGRlblwiKS5yZW1vdmVBdHRyKFwiYXJpYS1oaWRkZW4gYXJpYS1kaXNhYmxlZCB0YWJpbmRleFwiKS5jc3MoXCJkaXNwbGF5XCIsXCJcIiksdC5odG1sRXhwci50ZXN0KHQub3B0aW9ucy5wcmV2QXJyb3cpJiZ0LiRwcmV2QXJyb3cucmVtb3ZlKCkpLHQuJG5leHRBcnJvdyYmdC4kbmV4dEFycm93Lmxlbmd0aCYmKHQuJG5leHRBcnJvdy5yZW1vdmVDbGFzcyhcInNsaWNrLWRpc2FibGVkIHNsaWNrLWFycm93IHNsaWNrLWhpZGRlblwiKS5yZW1vdmVBdHRyKFwiYXJpYS1oaWRkZW4gYXJpYS1kaXNhYmxlZCB0YWJpbmRleFwiKS5jc3MoXCJkaXNwbGF5XCIsXCJcIiksdC5odG1sRXhwci50ZXN0KHQub3B0aW9ucy5uZXh0QXJyb3cpJiZ0LiRuZXh0QXJyb3cucmVtb3ZlKCkpLHQuJHNsaWRlcyYmKHQuJHNsaWRlcy5yZW1vdmVDbGFzcyhcInNsaWNrLXNsaWRlIHNsaWNrLWFjdGl2ZSBzbGljay1jZW50ZXIgc2xpY2stdmlzaWJsZSBzbGljay1jdXJyZW50XCIpLnJlbW92ZUF0dHIoXCJhcmlhLWhpZGRlblwiKS5yZW1vdmVBdHRyKFwiZGF0YS1zbGljay1pbmRleFwiKS5lYWNoKGZ1bmN0aW9uKCl7aSh0aGlzKS5hdHRyKFwic3R5bGVcIixpKHRoaXMpLmRhdGEoXCJvcmlnaW5hbFN0eWxpbmdcIikpfSksdC4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpLHQuJHNsaWRlVHJhY2suZGV0YWNoKCksdC4kbGlzdC5kZXRhY2goKSx0LiRzbGlkZXIuYXBwZW5kKHQuJHNsaWRlcykpLHQuY2xlYW5VcFJvd3MoKSx0LiRzbGlkZXIucmVtb3ZlQ2xhc3MoXCJzbGljay1zbGlkZXJcIiksdC4kc2xpZGVyLnJlbW92ZUNsYXNzKFwic2xpY2staW5pdGlhbGl6ZWRcIiksdC4kc2xpZGVyLnJlbW92ZUNsYXNzKFwic2xpY2stZG90dGVkXCIpLHQudW5zbGlja2VkPSEwLGV8fHQuJHNsaWRlci50cmlnZ2VyKFwiZGVzdHJveVwiLFt0XSl9LGUucHJvdG90eXBlLmRpc2FibGVUcmFuc2l0aW9uPWZ1bmN0aW9uKGkpe3ZhciBlPXRoaXMsdD17fTt0W2UudHJhbnNpdGlvblR5cGVdPVwiXCIsITE9PT1lLm9wdGlvbnMuZmFkZT9lLiRzbGlkZVRyYWNrLmNzcyh0KTplLiRzbGlkZXMuZXEoaSkuY3NzKHQpfSxlLnByb3RvdHlwZS5mYWRlU2xpZGU9ZnVuY3Rpb24oaSxlKXt2YXIgdD10aGlzOyExPT09dC5jc3NUcmFuc2l0aW9ucz8odC4kc2xpZGVzLmVxKGkpLmNzcyh7ekluZGV4OnQub3B0aW9ucy56SW5kZXh9KSx0LiRzbGlkZXMuZXEoaSkuYW5pbWF0ZSh7b3BhY2l0eToxfSx0Lm9wdGlvbnMuc3BlZWQsdC5vcHRpb25zLmVhc2luZyxlKSk6KHQuYXBwbHlUcmFuc2l0aW9uKGkpLHQuJHNsaWRlcy5lcShpKS5jc3Moe29wYWNpdHk6MSx6SW5kZXg6dC5vcHRpb25zLnpJbmRleH0pLGUmJnNldFRpbWVvdXQoZnVuY3Rpb24oKXt0LmRpc2FibGVUcmFuc2l0aW9uKGkpLGUuY2FsbCgpfSx0Lm9wdGlvbnMuc3BlZWQpKX0sZS5wcm90b3R5cGUuZmFkZVNsaWRlT3V0PWZ1bmN0aW9uKGkpe3ZhciBlPXRoaXM7ITE9PT1lLmNzc1RyYW5zaXRpb25zP2UuJHNsaWRlcy5lcShpKS5hbmltYXRlKHtvcGFjaXR5OjAsekluZGV4OmUub3B0aW9ucy56SW5kZXgtMn0sZS5vcHRpb25zLnNwZWVkLGUub3B0aW9ucy5lYXNpbmcpOihlLmFwcGx5VHJhbnNpdGlvbihpKSxlLiRzbGlkZXMuZXEoaSkuY3NzKHtvcGFjaXR5OjAsekluZGV4OmUub3B0aW9ucy56SW5kZXgtMn0pKX0sZS5wcm90b3R5cGUuZmlsdGVyU2xpZGVzPWUucHJvdG90eXBlLnNsaWNrRmlsdGVyPWZ1bmN0aW9uKGkpe3ZhciBlPXRoaXM7bnVsbCE9PWkmJihlLiRzbGlkZXNDYWNoZT1lLiRzbGlkZXMsZS51bmxvYWQoKSxlLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCksZS4kc2xpZGVzQ2FjaGUuZmlsdGVyKGkpLmFwcGVuZFRvKGUuJHNsaWRlVHJhY2spLGUucmVpbml0KCkpfSxlLnByb3RvdHlwZS5mb2N1c0hhbmRsZXI9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2UuJHNsaWRlci5vZmYoXCJmb2N1cy5zbGljayBibHVyLnNsaWNrXCIpLm9uKFwiZm9jdXMuc2xpY2sgYmx1ci5zbGlja1wiLFwiKlwiLGZ1bmN0aW9uKHQpe3Quc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7dmFyIG89aSh0aGlzKTtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZS5vcHRpb25zLnBhdXNlT25Gb2N1cyYmKGUuZm9jdXNzZWQ9by5pcyhcIjpmb2N1c1wiKSxlLmF1dG9QbGF5KCkpfSwwKX0pfSxlLnByb3RvdHlwZS5nZXRDdXJyZW50PWUucHJvdG90eXBlLnNsaWNrQ3VycmVudFNsaWRlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY3VycmVudFNsaWRlfSxlLnByb3RvdHlwZS5nZXREb3RDb3VudD1mdW5jdGlvbigpe3ZhciBpPXRoaXMsZT0wLHQ9MCxvPTA7aWYoITA9PT1pLm9wdGlvbnMuaW5maW5pdGUpaWYoaS5zbGlkZUNvdW50PD1pLm9wdGlvbnMuc2xpZGVzVG9TaG93KSsrbztlbHNlIGZvcig7ZTxpLnNsaWRlQ291bnQ7KSsrbyxlPXQraS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsLHQrPWkub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDw9aS5vcHRpb25zLnNsaWRlc1RvU2hvdz9pLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw6aS5vcHRpb25zLnNsaWRlc1RvU2hvdztlbHNlIGlmKCEwPT09aS5vcHRpb25zLmNlbnRlck1vZGUpbz1pLnNsaWRlQ291bnQ7ZWxzZSBpZihpLm9wdGlvbnMuYXNOYXZGb3IpZm9yKDtlPGkuc2xpZGVDb3VudDspKytvLGU9dCtpLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwsdCs9aS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsPD1pLm9wdGlvbnMuc2xpZGVzVG9TaG93P2kub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDppLm9wdGlvbnMuc2xpZGVzVG9TaG93O2Vsc2Ugbz0xK01hdGguY2VpbCgoaS5zbGlkZUNvdW50LWkub3B0aW9ucy5zbGlkZXNUb1Nob3cpL2kub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCk7cmV0dXJuIG8tMX0sZS5wcm90b3R5cGUuZ2V0TGVmdD1mdW5jdGlvbihpKXt2YXIgZSx0LG8scyxuPXRoaXMscj0wO3JldHVybiBuLnNsaWRlT2Zmc2V0PTAsdD1uLiRzbGlkZXMuZmlyc3QoKS5vdXRlckhlaWdodCghMCksITA9PT1uLm9wdGlvbnMuaW5maW5pdGU/KG4uc2xpZGVDb3VudD5uLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYobi5zbGlkZU9mZnNldD1uLnNsaWRlV2lkdGgqbi5vcHRpb25zLnNsaWRlc1RvU2hvdyotMSxzPS0xLCEwPT09bi5vcHRpb25zLnZlcnRpY2FsJiYhMD09PW4ub3B0aW9ucy5jZW50ZXJNb2RlJiYoMj09PW4ub3B0aW9ucy5zbGlkZXNUb1Nob3c/cz0tMS41OjE9PT1uLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYocz0tMikpLHI9dCpuLm9wdGlvbnMuc2xpZGVzVG9TaG93KnMpLG4uc2xpZGVDb3VudCVuLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwhPTAmJmkrbi5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsPm4uc2xpZGVDb3VudCYmbi5zbGlkZUNvdW50Pm4ub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihpPm4uc2xpZGVDb3VudD8obi5zbGlkZU9mZnNldD0obi5vcHRpb25zLnNsaWRlc1RvU2hvdy0oaS1uLnNsaWRlQ291bnQpKSpuLnNsaWRlV2lkdGgqLTEscj0obi5vcHRpb25zLnNsaWRlc1RvU2hvdy0oaS1uLnNsaWRlQ291bnQpKSp0Ki0xKToobi5zbGlkZU9mZnNldD1uLnNsaWRlQ291bnQlbi5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKm4uc2xpZGVXaWR0aCotMSxyPW4uc2xpZGVDb3VudCVuLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwqdCotMSkpKTppK24ub3B0aW9ucy5zbGlkZXNUb1Nob3c+bi5zbGlkZUNvdW50JiYobi5zbGlkZU9mZnNldD0oaStuLm9wdGlvbnMuc2xpZGVzVG9TaG93LW4uc2xpZGVDb3VudCkqbi5zbGlkZVdpZHRoLHI9KGkrbi5vcHRpb25zLnNsaWRlc1RvU2hvdy1uLnNsaWRlQ291bnQpKnQpLG4uc2xpZGVDb3VudDw9bi5vcHRpb25zLnNsaWRlc1RvU2hvdyYmKG4uc2xpZGVPZmZzZXQ9MCxyPTApLCEwPT09bi5vcHRpb25zLmNlbnRlck1vZGUmJm4uc2xpZGVDb3VudDw9bi5vcHRpb25zLnNsaWRlc1RvU2hvdz9uLnNsaWRlT2Zmc2V0PW4uc2xpZGVXaWR0aCpNYXRoLmZsb29yKG4ub3B0aW9ucy5zbGlkZXNUb1Nob3cpLzItbi5zbGlkZVdpZHRoKm4uc2xpZGVDb3VudC8yOiEwPT09bi5vcHRpb25zLmNlbnRlck1vZGUmJiEwPT09bi5vcHRpb25zLmluZmluaXRlP24uc2xpZGVPZmZzZXQrPW4uc2xpZGVXaWR0aCpNYXRoLmZsb29yKG4ub3B0aW9ucy5zbGlkZXNUb1Nob3cvMiktbi5zbGlkZVdpZHRoOiEwPT09bi5vcHRpb25zLmNlbnRlck1vZGUmJihuLnNsaWRlT2Zmc2V0PTAsbi5zbGlkZU9mZnNldCs9bi5zbGlkZVdpZHRoKk1hdGguZmxvb3Iobi5vcHRpb25zLnNsaWRlc1RvU2hvdy8yKSksZT0hMT09PW4ub3B0aW9ucy52ZXJ0aWNhbD9pKm4uc2xpZGVXaWR0aCotMStuLnNsaWRlT2Zmc2V0OmkqdCotMStyLCEwPT09bi5vcHRpb25zLnZhcmlhYmxlV2lkdGgmJihvPW4uc2xpZGVDb3VudDw9bi5vcHRpb25zLnNsaWRlc1RvU2hvd3x8ITE9PT1uLm9wdGlvbnMuaW5maW5pdGU/bi4kc2xpZGVUcmFjay5jaGlsZHJlbihcIi5zbGljay1zbGlkZVwiKS5lcShpKTpuLiRzbGlkZVRyYWNrLmNoaWxkcmVuKFwiLnNsaWNrLXNsaWRlXCIpLmVxKGkrbi5vcHRpb25zLnNsaWRlc1RvU2hvdyksZT0hMD09PW4ub3B0aW9ucy5ydGw/b1swXT8tMSoobi4kc2xpZGVUcmFjay53aWR0aCgpLW9bMF0ub2Zmc2V0TGVmdC1vLndpZHRoKCkpOjA6b1swXT8tMSpvWzBdLm9mZnNldExlZnQ6MCwhMD09PW4ub3B0aW9ucy5jZW50ZXJNb2RlJiYobz1uLnNsaWRlQ291bnQ8PW4ub3B0aW9ucy5zbGlkZXNUb1Nob3d8fCExPT09bi5vcHRpb25zLmluZmluaXRlP24uJHNsaWRlVHJhY2suY2hpbGRyZW4oXCIuc2xpY2stc2xpZGVcIikuZXEoaSk6bi4kc2xpZGVUcmFjay5jaGlsZHJlbihcIi5zbGljay1zbGlkZVwiKS5lcShpK24ub3B0aW9ucy5zbGlkZXNUb1Nob3crMSksZT0hMD09PW4ub3B0aW9ucy5ydGw/b1swXT8tMSoobi4kc2xpZGVUcmFjay53aWR0aCgpLW9bMF0ub2Zmc2V0TGVmdC1vLndpZHRoKCkpOjA6b1swXT8tMSpvWzBdLm9mZnNldExlZnQ6MCxlKz0obi4kbGlzdC53aWR0aCgpLW8ub3V0ZXJXaWR0aCgpKS8yKSksZX0sZS5wcm90b3R5cGUuZ2V0T3B0aW9uPWUucHJvdG90eXBlLnNsaWNrR2V0T3B0aW9uPWZ1bmN0aW9uKGkpe3JldHVybiB0aGlzLm9wdGlvbnNbaV19LGUucHJvdG90eXBlLmdldE5hdmlnYWJsZUluZGV4ZXM9ZnVuY3Rpb24oKXt2YXIgaSxlPXRoaXMsdD0wLG89MCxzPVtdO2ZvcighMT09PWUub3B0aW9ucy5pbmZpbml0ZT9pPWUuc2xpZGVDb3VudDoodD0tMSplLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwsbz0tMSplLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwsaT0yKmUuc2xpZGVDb3VudCk7dDxpOylzLnB1c2godCksdD1vK2Uub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCxvKz1lLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw8PWUub3B0aW9ucy5zbGlkZXNUb1Nob3c/ZS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsOmUub3B0aW9ucy5zbGlkZXNUb1Nob3c7cmV0dXJuIHN9LGUucHJvdG90eXBlLmdldFNsaWNrPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9LGUucHJvdG90eXBlLmdldFNsaWRlQ291bnQ9ZnVuY3Rpb24oKXt2YXIgZSx0LG89dGhpcztyZXR1cm4gdD0hMD09PW8ub3B0aW9ucy5jZW50ZXJNb2RlP28uc2xpZGVXaWR0aCpNYXRoLmZsb29yKG8ub3B0aW9ucy5zbGlkZXNUb1Nob3cvMik6MCwhMD09PW8ub3B0aW9ucy5zd2lwZVRvU2xpZGU/KG8uJHNsaWRlVHJhY2suZmluZChcIi5zbGljay1zbGlkZVwiKS5lYWNoKGZ1bmN0aW9uKHMsbil7aWYobi5vZmZzZXRMZWZ0LXQraShuKS5vdXRlcldpZHRoKCkvMj4tMSpvLnN3aXBlTGVmdClyZXR1cm4gZT1uLCExfSksTWF0aC5hYnMoaShlKS5hdHRyKFwiZGF0YS1zbGljay1pbmRleFwiKS1vLmN1cnJlbnRTbGlkZSl8fDEpOm8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbH0sZS5wcm90b3R5cGUuZ29Ubz1lLnByb3RvdHlwZS5zbGlja0dvVG89ZnVuY3Rpb24oaSxlKXt0aGlzLmNoYW5nZVNsaWRlKHtkYXRhOnttZXNzYWdlOlwiaW5kZXhcIixpbmRleDpwYXJzZUludChpKX19LGUpfSxlLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXM7aSh0LiRzbGlkZXIpLmhhc0NsYXNzKFwic2xpY2staW5pdGlhbGl6ZWRcIil8fChpKHQuJHNsaWRlcikuYWRkQ2xhc3MoXCJzbGljay1pbml0aWFsaXplZFwiKSx0LmJ1aWxkUm93cygpLHQuYnVpbGRPdXQoKSx0LnNldFByb3BzKCksdC5zdGFydExvYWQoKSx0LmxvYWRTbGlkZXIoKSx0LmluaXRpYWxpemVFdmVudHMoKSx0LnVwZGF0ZUFycm93cygpLHQudXBkYXRlRG90cygpLHQuY2hlY2tSZXNwb25zaXZlKCEwKSx0LmZvY3VzSGFuZGxlcigpKSxlJiZ0LiRzbGlkZXIudHJpZ2dlcihcImluaXRcIixbdF0pLCEwPT09dC5vcHRpb25zLmFjY2Vzc2liaWxpdHkmJnQuaW5pdEFEQSgpLHQub3B0aW9ucy5hdXRvcGxheSYmKHQucGF1c2VkPSExLHQuYXV0b1BsYXkoKSl9LGUucHJvdG90eXBlLmluaXRBREE9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLHQ9TWF0aC5jZWlsKGUuc2xpZGVDb3VudC9lLm9wdGlvbnMuc2xpZGVzVG9TaG93KSxvPWUuZ2V0TmF2aWdhYmxlSW5kZXhlcygpLmZpbHRlcihmdW5jdGlvbihpKXtyZXR1cm4gaT49MCYmaTxlLnNsaWRlQ291bnR9KTtlLiRzbGlkZXMuYWRkKGUuJHNsaWRlVHJhY2suZmluZChcIi5zbGljay1jbG9uZWRcIikpLmF0dHIoe1wiYXJpYS1oaWRkZW5cIjpcInRydWVcIix0YWJpbmRleDpcIi0xXCJ9KS5maW5kKFwiYSwgaW5wdXQsIGJ1dHRvbiwgc2VsZWN0XCIpLmF0dHIoe3RhYmluZGV4OlwiLTFcIn0pLG51bGwhPT1lLiRkb3RzJiYoZS4kc2xpZGVzLm5vdChlLiRzbGlkZVRyYWNrLmZpbmQoXCIuc2xpY2stY2xvbmVkXCIpKS5lYWNoKGZ1bmN0aW9uKHQpe3ZhciBzPW8uaW5kZXhPZih0KTtpKHRoaXMpLmF0dHIoe3JvbGU6XCJ0YWJwYW5lbFwiLGlkOlwic2xpY2stc2xpZGVcIitlLmluc3RhbmNlVWlkK3QsdGFiaW5kZXg6LTF9KSwtMSE9PXMmJmkodGhpcykuYXR0cih7XCJhcmlhLWRlc2NyaWJlZGJ5XCI6XCJzbGljay1zbGlkZS1jb250cm9sXCIrZS5pbnN0YW5jZVVpZCtzfSl9KSxlLiRkb3RzLmF0dHIoXCJyb2xlXCIsXCJ0YWJsaXN0XCIpLmZpbmQoXCJsaVwiKS5lYWNoKGZ1bmN0aW9uKHMpe3ZhciBuPW9bc107aSh0aGlzKS5hdHRyKHtyb2xlOlwicHJlc2VudGF0aW9uXCJ9KSxpKHRoaXMpLmZpbmQoXCJidXR0b25cIikuZmlyc3QoKS5hdHRyKHtyb2xlOlwidGFiXCIsaWQ6XCJzbGljay1zbGlkZS1jb250cm9sXCIrZS5pbnN0YW5jZVVpZCtzLFwiYXJpYS1jb250cm9sc1wiOlwic2xpY2stc2xpZGVcIitlLmluc3RhbmNlVWlkK24sXCJhcmlhLWxhYmVsXCI6cysxK1wiIG9mIFwiK3QsXCJhcmlhLXNlbGVjdGVkXCI6bnVsbCx0YWJpbmRleDpcIi0xXCJ9KX0pLmVxKGUuY3VycmVudFNsaWRlKS5maW5kKFwiYnV0dG9uXCIpLmF0dHIoe1wiYXJpYS1zZWxlY3RlZFwiOlwidHJ1ZVwiLHRhYmluZGV4OlwiMFwifSkuZW5kKCkpO2Zvcih2YXIgcz1lLmN1cnJlbnRTbGlkZSxuPXMrZS5vcHRpb25zLnNsaWRlc1RvU2hvdztzPG47cysrKWUuJHNsaWRlcy5lcShzKS5hdHRyKFwidGFiaW5kZXhcIiwwKTtlLmFjdGl2YXRlQURBKCl9LGUucHJvdG90eXBlLmluaXRBcnJvd0V2ZW50cz1mdW5jdGlvbigpe3ZhciBpPXRoaXM7ITA9PT1pLm9wdGlvbnMuYXJyb3dzJiZpLnNsaWRlQ291bnQ+aS5vcHRpb25zLnNsaWRlc1RvU2hvdyYmKGkuJHByZXZBcnJvdy5vZmYoXCJjbGljay5zbGlja1wiKS5vbihcImNsaWNrLnNsaWNrXCIse21lc3NhZ2U6XCJwcmV2aW91c1wifSxpLmNoYW5nZVNsaWRlKSxpLiRuZXh0QXJyb3cub2ZmKFwiY2xpY2suc2xpY2tcIikub24oXCJjbGljay5zbGlja1wiLHttZXNzYWdlOlwibmV4dFwifSxpLmNoYW5nZVNsaWRlKSwhMD09PWkub3B0aW9ucy5hY2Nlc3NpYmlsaXR5JiYoaS4kcHJldkFycm93Lm9uKFwia2V5ZG93bi5zbGlja1wiLGkua2V5SGFuZGxlciksaS4kbmV4dEFycm93Lm9uKFwia2V5ZG93bi5zbGlja1wiLGkua2V5SGFuZGxlcikpKX0sZS5wcm90b3R5cGUuaW5pdERvdEV2ZW50cz1mdW5jdGlvbigpe3ZhciBlPXRoaXM7ITA9PT1lLm9wdGlvbnMuZG90cyYmKGkoXCJsaVwiLGUuJGRvdHMpLm9uKFwiY2xpY2suc2xpY2tcIix7bWVzc2FnZTpcImluZGV4XCJ9LGUuY2hhbmdlU2xpZGUpLCEwPT09ZS5vcHRpb25zLmFjY2Vzc2liaWxpdHkmJmUuJGRvdHMub24oXCJrZXlkb3duLnNsaWNrXCIsZS5rZXlIYW5kbGVyKSksITA9PT1lLm9wdGlvbnMuZG90cyYmITA9PT1lLm9wdGlvbnMucGF1c2VPbkRvdHNIb3ZlciYmaShcImxpXCIsZS4kZG90cykub24oXCJtb3VzZWVudGVyLnNsaWNrXCIsaS5wcm94eShlLmludGVycnVwdCxlLCEwKSkub24oXCJtb3VzZWxlYXZlLnNsaWNrXCIsaS5wcm94eShlLmludGVycnVwdCxlLCExKSl9LGUucHJvdG90eXBlLmluaXRTbGlkZUV2ZW50cz1mdW5jdGlvbigpe3ZhciBlPXRoaXM7ZS5vcHRpb25zLnBhdXNlT25Ib3ZlciYmKGUuJGxpc3Qub24oXCJtb3VzZWVudGVyLnNsaWNrXCIsaS5wcm94eShlLmludGVycnVwdCxlLCEwKSksZS4kbGlzdC5vbihcIm1vdXNlbGVhdmUuc2xpY2tcIixpLnByb3h5KGUuaW50ZXJydXB0LGUsITEpKSl9LGUucHJvdG90eXBlLmluaXRpYWxpemVFdmVudHM9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2UuaW5pdEFycm93RXZlbnRzKCksZS5pbml0RG90RXZlbnRzKCksZS5pbml0U2xpZGVFdmVudHMoKSxlLiRsaXN0Lm9uKFwidG91Y2hzdGFydC5zbGljayBtb3VzZWRvd24uc2xpY2tcIix7YWN0aW9uOlwic3RhcnRcIn0sZS5zd2lwZUhhbmRsZXIpLGUuJGxpc3Qub24oXCJ0b3VjaG1vdmUuc2xpY2sgbW91c2Vtb3ZlLnNsaWNrXCIse2FjdGlvbjpcIm1vdmVcIn0sZS5zd2lwZUhhbmRsZXIpLGUuJGxpc3Qub24oXCJ0b3VjaGVuZC5zbGljayBtb3VzZXVwLnNsaWNrXCIse2FjdGlvbjpcImVuZFwifSxlLnN3aXBlSGFuZGxlciksZS4kbGlzdC5vbihcInRvdWNoY2FuY2VsLnNsaWNrIG1vdXNlbGVhdmUuc2xpY2tcIix7YWN0aW9uOlwiZW5kXCJ9LGUuc3dpcGVIYW5kbGVyKSxlLiRsaXN0Lm9uKFwiY2xpY2suc2xpY2tcIixlLmNsaWNrSGFuZGxlciksaShkb2N1bWVudCkub24oZS52aXNpYmlsaXR5Q2hhbmdlLGkucHJveHkoZS52aXNpYmlsaXR5LGUpKSwhMD09PWUub3B0aW9ucy5hY2Nlc3NpYmlsaXR5JiZlLiRsaXN0Lm9uKFwia2V5ZG93bi5zbGlja1wiLGUua2V5SGFuZGxlciksITA9PT1lLm9wdGlvbnMuZm9jdXNPblNlbGVjdCYmaShlLiRzbGlkZVRyYWNrKS5jaGlsZHJlbigpLm9uKFwiY2xpY2suc2xpY2tcIixlLnNlbGVjdEhhbmRsZXIpLGkod2luZG93KS5vbihcIm9yaWVudGF0aW9uY2hhbmdlLnNsaWNrLnNsaWNrLVwiK2UuaW5zdGFuY2VVaWQsaS5wcm94eShlLm9yaWVudGF0aW9uQ2hhbmdlLGUpKSxpKHdpbmRvdykub24oXCJyZXNpemUuc2xpY2suc2xpY2stXCIrZS5pbnN0YW5jZVVpZCxpLnByb3h5KGUucmVzaXplLGUpKSxpKFwiW2RyYWdnYWJsZSE9dHJ1ZV1cIixlLiRzbGlkZVRyYWNrKS5vbihcImRyYWdzdGFydFwiLGUucHJldmVudERlZmF1bHQpLGkod2luZG93KS5vbihcImxvYWQuc2xpY2suc2xpY2stXCIrZS5pbnN0YW5jZVVpZCxlLnNldFBvc2l0aW9uKSxpKGUuc2V0UG9zaXRpb24pfSxlLnByb3RvdHlwZS5pbml0VUk9ZnVuY3Rpb24oKXt2YXIgaT10aGlzOyEwPT09aS5vcHRpb25zLmFycm93cyYmaS5zbGlkZUNvdW50Pmkub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihpLiRwcmV2QXJyb3cuc2hvdygpLGkuJG5leHRBcnJvdy5zaG93KCkpLCEwPT09aS5vcHRpb25zLmRvdHMmJmkuc2xpZGVDb3VudD5pLm9wdGlvbnMuc2xpZGVzVG9TaG93JiZpLiRkb3RzLnNob3coKX0sZS5wcm90b3R5cGUua2V5SGFuZGxlcj1mdW5jdGlvbihpKXt2YXIgZT10aGlzO2kudGFyZ2V0LnRhZ05hbWUubWF0Y2goXCJURVhUQVJFQXxJTlBVVHxTRUxFQ1RcIil8fCgzNz09PWkua2V5Q29kZSYmITA9PT1lLm9wdGlvbnMuYWNjZXNzaWJpbGl0eT9lLmNoYW5nZVNsaWRlKHtkYXRhOnttZXNzYWdlOiEwPT09ZS5vcHRpb25zLnJ0bD9cIm5leHRcIjpcInByZXZpb3VzXCJ9fSk6Mzk9PT1pLmtleUNvZGUmJiEwPT09ZS5vcHRpb25zLmFjY2Vzc2liaWxpdHkmJmUuY2hhbmdlU2xpZGUoe2RhdGE6e21lc3NhZ2U6ITA9PT1lLm9wdGlvbnMucnRsP1wicHJldmlvdXNcIjpcIm5leHRcIn19KSl9LGUucHJvdG90eXBlLmxhenlMb2FkPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlKXtpKFwiaW1nW2RhdGEtbGF6eV1cIixlKS5lYWNoKGZ1bmN0aW9uKCl7dmFyIGU9aSh0aGlzKSx0PWkodGhpcykuYXR0cihcImRhdGEtbGF6eVwiKSxvPWkodGhpcykuYXR0cihcImRhdGEtc3Jjc2V0XCIpLHM9aSh0aGlzKS5hdHRyKFwiZGF0YS1zaXplc1wiKXx8bi4kc2xpZGVyLmF0dHIoXCJkYXRhLXNpemVzXCIpLHI9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtyLm9ubG9hZD1mdW5jdGlvbigpe2UuYW5pbWF0ZSh7b3BhY2l0eTowfSwxMDAsZnVuY3Rpb24oKXtvJiYoZS5hdHRyKFwic3Jjc2V0XCIsbykscyYmZS5hdHRyKFwic2l6ZXNcIixzKSksZS5hdHRyKFwic3JjXCIsdCkuYW5pbWF0ZSh7b3BhY2l0eToxfSwyMDAsZnVuY3Rpb24oKXtlLnJlbW92ZUF0dHIoXCJkYXRhLWxhenkgZGF0YS1zcmNzZXQgZGF0YS1zaXplc1wiKS5yZW1vdmVDbGFzcyhcInNsaWNrLWxvYWRpbmdcIil9KSxuLiRzbGlkZXIudHJpZ2dlcihcImxhenlMb2FkZWRcIixbbixlLHRdKX0pfSxyLm9uZXJyb3I9ZnVuY3Rpb24oKXtlLnJlbW92ZUF0dHIoXCJkYXRhLWxhenlcIikucmVtb3ZlQ2xhc3MoXCJzbGljay1sb2FkaW5nXCIpLmFkZENsYXNzKFwic2xpY2stbGF6eWxvYWQtZXJyb3JcIiksbi4kc2xpZGVyLnRyaWdnZXIoXCJsYXp5TG9hZEVycm9yXCIsW24sZSx0XSl9LHIuc3JjPXR9KX12YXIgdCxvLHMsbj10aGlzO2lmKCEwPT09bi5vcHRpb25zLmNlbnRlck1vZGU/ITA9PT1uLm9wdGlvbnMuaW5maW5pdGU/cz0obz1uLmN1cnJlbnRTbGlkZSsobi5vcHRpb25zLnNsaWRlc1RvU2hvdy8yKzEpKStuLm9wdGlvbnMuc2xpZGVzVG9TaG93KzI6KG89TWF0aC5tYXgoMCxuLmN1cnJlbnRTbGlkZS0obi5vcHRpb25zLnNsaWRlc1RvU2hvdy8yKzEpKSxzPW4ub3B0aW9ucy5zbGlkZXNUb1Nob3cvMisxKzIrbi5jdXJyZW50U2xpZGUpOihvPW4ub3B0aW9ucy5pbmZpbml0ZT9uLm9wdGlvbnMuc2xpZGVzVG9TaG93K24uY3VycmVudFNsaWRlOm4uY3VycmVudFNsaWRlLHM9TWF0aC5jZWlsKG8rbi5vcHRpb25zLnNsaWRlc1RvU2hvdyksITA9PT1uLm9wdGlvbnMuZmFkZSYmKG8+MCYmby0tLHM8PW4uc2xpZGVDb3VudCYmcysrKSksdD1uLiRzbGlkZXIuZmluZChcIi5zbGljay1zbGlkZVwiKS5zbGljZShvLHMpLFwiYW50aWNpcGF0ZWRcIj09PW4ub3B0aW9ucy5sYXp5TG9hZClmb3IodmFyIHI9by0xLGw9cyxkPW4uJHNsaWRlci5maW5kKFwiLnNsaWNrLXNsaWRlXCIpLGE9MDthPG4ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDthKyspcjwwJiYocj1uLnNsaWRlQ291bnQtMSksdD0odD10LmFkZChkLmVxKHIpKSkuYWRkKGQuZXEobCkpLHItLSxsKys7ZSh0KSxuLnNsaWRlQ291bnQ8PW4ub3B0aW9ucy5zbGlkZXNUb1Nob3c/ZShuLiRzbGlkZXIuZmluZChcIi5zbGljay1zbGlkZVwiKSk6bi5jdXJyZW50U2xpZGU+PW4uc2xpZGVDb3VudC1uLm9wdGlvbnMuc2xpZGVzVG9TaG93P2Uobi4kc2xpZGVyLmZpbmQoXCIuc2xpY2stY2xvbmVkXCIpLnNsaWNlKDAsbi5vcHRpb25zLnNsaWRlc1RvU2hvdykpOjA9PT1uLmN1cnJlbnRTbGlkZSYmZShuLiRzbGlkZXIuZmluZChcIi5zbGljay1jbG9uZWRcIikuc2xpY2UoLTEqbi5vcHRpb25zLnNsaWRlc1RvU2hvdykpfSxlLnByb3RvdHlwZS5sb2FkU2xpZGVyPWZ1bmN0aW9uKCl7dmFyIGk9dGhpcztpLnNldFBvc2l0aW9uKCksaS4kc2xpZGVUcmFjay5jc3Moe29wYWNpdHk6MX0pLGkuJHNsaWRlci5yZW1vdmVDbGFzcyhcInNsaWNrLWxvYWRpbmdcIiksaS5pbml0VUkoKSxcInByb2dyZXNzaXZlXCI9PT1pLm9wdGlvbnMubGF6eUxvYWQmJmkucHJvZ3Jlc3NpdmVMYXp5TG9hZCgpfSxlLnByb3RvdHlwZS5uZXh0PWUucHJvdG90eXBlLnNsaWNrTmV4dD1mdW5jdGlvbigpe3RoaXMuY2hhbmdlU2xpZGUoe2RhdGE6e21lc3NhZ2U6XCJuZXh0XCJ9fSl9LGUucHJvdG90eXBlLm9yaWVudGF0aW9uQ2hhbmdlPWZ1bmN0aW9uKCl7dmFyIGk9dGhpcztpLmNoZWNrUmVzcG9uc2l2ZSgpLGkuc2V0UG9zaXRpb24oKX0sZS5wcm90b3R5cGUucGF1c2U9ZS5wcm90b3R5cGUuc2xpY2tQYXVzZT1mdW5jdGlvbigpe3ZhciBpPXRoaXM7aS5hdXRvUGxheUNsZWFyKCksaS5wYXVzZWQ9ITB9LGUucHJvdG90eXBlLnBsYXk9ZS5wcm90b3R5cGUuc2xpY2tQbGF5PWZ1bmN0aW9uKCl7dmFyIGk9dGhpcztpLmF1dG9QbGF5KCksaS5vcHRpb25zLmF1dG9wbGF5PSEwLGkucGF1c2VkPSExLGkuZm9jdXNzZWQ9ITEsaS5pbnRlcnJ1cHRlZD0hMX0sZS5wcm90b3R5cGUucG9zdFNsaWRlPWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXM7dC51bnNsaWNrZWR8fCh0LiRzbGlkZXIudHJpZ2dlcihcImFmdGVyQ2hhbmdlXCIsW3QsZV0pLHQuYW5pbWF0aW5nPSExLHQuc2xpZGVDb3VudD50Lm9wdGlvbnMuc2xpZGVzVG9TaG93JiZ0LnNldFBvc2l0aW9uKCksdC5zd2lwZUxlZnQ9bnVsbCx0Lm9wdGlvbnMuYXV0b3BsYXkmJnQuYXV0b1BsYXkoKSwhMD09PXQub3B0aW9ucy5hY2Nlc3NpYmlsaXR5JiYodC5pbml0QURBKCksdC5vcHRpb25zLmZvY3VzT25DaGFuZ2UmJmkodC4kc2xpZGVzLmdldCh0LmN1cnJlbnRTbGlkZSkpLmF0dHIoXCJ0YWJpbmRleFwiLDApLmZvY3VzKCkpKX0sZS5wcm90b3R5cGUucHJldj1lLnByb3RvdHlwZS5zbGlja1ByZXY9ZnVuY3Rpb24oKXt0aGlzLmNoYW5nZVNsaWRlKHtkYXRhOnttZXNzYWdlOlwicHJldmlvdXNcIn19KX0sZS5wcm90b3R5cGUucHJldmVudERlZmF1bHQ9ZnVuY3Rpb24oaSl7aS5wcmV2ZW50RGVmYXVsdCgpfSxlLnByb3RvdHlwZS5wcm9ncmVzc2l2ZUxhenlMb2FkPWZ1bmN0aW9uKGUpe2U9ZXx8MTt2YXIgdCxvLHMsbixyLGw9dGhpcyxkPWkoXCJpbWdbZGF0YS1sYXp5XVwiLGwuJHNsaWRlcik7ZC5sZW5ndGg/KHQ9ZC5maXJzdCgpLG89dC5hdHRyKFwiZGF0YS1sYXp5XCIpLHM9dC5hdHRyKFwiZGF0YS1zcmNzZXRcIiksbj10LmF0dHIoXCJkYXRhLXNpemVzXCIpfHxsLiRzbGlkZXIuYXR0cihcImRhdGEtc2l6ZXNcIiksKHI9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKSkub25sb2FkPWZ1bmN0aW9uKCl7cyYmKHQuYXR0cihcInNyY3NldFwiLHMpLG4mJnQuYXR0cihcInNpemVzXCIsbikpLHQuYXR0cihcInNyY1wiLG8pLnJlbW92ZUF0dHIoXCJkYXRhLWxhenkgZGF0YS1zcmNzZXQgZGF0YS1zaXplc1wiKS5yZW1vdmVDbGFzcyhcInNsaWNrLWxvYWRpbmdcIiksITA9PT1sLm9wdGlvbnMuYWRhcHRpdmVIZWlnaHQmJmwuc2V0UG9zaXRpb24oKSxsLiRzbGlkZXIudHJpZ2dlcihcImxhenlMb2FkZWRcIixbbCx0LG9dKSxsLnByb2dyZXNzaXZlTGF6eUxvYWQoKX0sci5vbmVycm9yPWZ1bmN0aW9uKCl7ZTwzP3NldFRpbWVvdXQoZnVuY3Rpb24oKXtsLnByb2dyZXNzaXZlTGF6eUxvYWQoZSsxKX0sNTAwKToodC5yZW1vdmVBdHRyKFwiZGF0YS1sYXp5XCIpLnJlbW92ZUNsYXNzKFwic2xpY2stbG9hZGluZ1wiKS5hZGRDbGFzcyhcInNsaWNrLWxhenlsb2FkLWVycm9yXCIpLGwuJHNsaWRlci50cmlnZ2VyKFwibGF6eUxvYWRFcnJvclwiLFtsLHQsb10pLGwucHJvZ3Jlc3NpdmVMYXp5TG9hZCgpKX0sci5zcmM9byk6bC4kc2xpZGVyLnRyaWdnZXIoXCJhbGxJbWFnZXNMb2FkZWRcIixbbF0pfSxlLnByb3RvdHlwZS5yZWZyZXNoPWZ1bmN0aW9uKGUpe3ZhciB0LG8scz10aGlzO289cy5zbGlkZUNvdW50LXMub3B0aW9ucy5zbGlkZXNUb1Nob3csIXMub3B0aW9ucy5pbmZpbml0ZSYmcy5jdXJyZW50U2xpZGU+byYmKHMuY3VycmVudFNsaWRlPW8pLHMuc2xpZGVDb3VudDw9cy5vcHRpb25zLnNsaWRlc1RvU2hvdyYmKHMuY3VycmVudFNsaWRlPTApLHQ9cy5jdXJyZW50U2xpZGUscy5kZXN0cm95KCEwKSxpLmV4dGVuZChzLHMuaW5pdGlhbHMse2N1cnJlbnRTbGlkZTp0fSkscy5pbml0KCksZXx8cy5jaGFuZ2VTbGlkZSh7ZGF0YTp7bWVzc2FnZTpcImluZGV4XCIsaW5kZXg6dH19LCExKX0sZS5wcm90b3R5cGUucmVnaXN0ZXJCcmVha3BvaW50cz1mdW5jdGlvbigpe3ZhciBlLHQsbyxzPXRoaXMsbj1zLm9wdGlvbnMucmVzcG9uc2l2ZXx8bnVsbDtpZihcImFycmF5XCI9PT1pLnR5cGUobikmJm4ubGVuZ3RoKXtzLnJlc3BvbmRUbz1zLm9wdGlvbnMucmVzcG9uZFRvfHxcIndpbmRvd1wiO2ZvcihlIGluIG4paWYobz1zLmJyZWFrcG9pbnRzLmxlbmd0aC0xLG4uaGFzT3duUHJvcGVydHkoZSkpe2Zvcih0PW5bZV0uYnJlYWtwb2ludDtvPj0wOylzLmJyZWFrcG9pbnRzW29dJiZzLmJyZWFrcG9pbnRzW29dPT09dCYmcy5icmVha3BvaW50cy5zcGxpY2UobywxKSxvLS07cy5icmVha3BvaW50cy5wdXNoKHQpLHMuYnJlYWtwb2ludFNldHRpbmdzW3RdPW5bZV0uc2V0dGluZ3N9cy5icmVha3BvaW50cy5zb3J0KGZ1bmN0aW9uKGksZSl7cmV0dXJuIHMub3B0aW9ucy5tb2JpbGVGaXJzdD9pLWU6ZS1pfSl9fSxlLnByb3RvdHlwZS5yZWluaXQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2UuJHNsaWRlcz1lLiRzbGlkZVRyYWNrLmNoaWxkcmVuKGUub3B0aW9ucy5zbGlkZSkuYWRkQ2xhc3MoXCJzbGljay1zbGlkZVwiKSxlLnNsaWRlQ291bnQ9ZS4kc2xpZGVzLmxlbmd0aCxlLmN1cnJlbnRTbGlkZT49ZS5zbGlkZUNvdW50JiYwIT09ZS5jdXJyZW50U2xpZGUmJihlLmN1cnJlbnRTbGlkZT1lLmN1cnJlbnRTbGlkZS1lLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpLGUuc2xpZGVDb3VudDw9ZS5vcHRpb25zLnNsaWRlc1RvU2hvdyYmKGUuY3VycmVudFNsaWRlPTApLGUucmVnaXN0ZXJCcmVha3BvaW50cygpLGUuc2V0UHJvcHMoKSxlLnNldHVwSW5maW5pdGUoKSxlLmJ1aWxkQXJyb3dzKCksZS51cGRhdGVBcnJvd3MoKSxlLmluaXRBcnJvd0V2ZW50cygpLGUuYnVpbGREb3RzKCksZS51cGRhdGVEb3RzKCksZS5pbml0RG90RXZlbnRzKCksZS5jbGVhblVwU2xpZGVFdmVudHMoKSxlLmluaXRTbGlkZUV2ZW50cygpLGUuY2hlY2tSZXNwb25zaXZlKCExLCEwKSwhMD09PWUub3B0aW9ucy5mb2N1c09uU2VsZWN0JiZpKGUuJHNsaWRlVHJhY2spLmNoaWxkcmVuKCkub24oXCJjbGljay5zbGlja1wiLGUuc2VsZWN0SGFuZGxlciksZS5zZXRTbGlkZUNsYXNzZXMoXCJudW1iZXJcIj09dHlwZW9mIGUuY3VycmVudFNsaWRlP2UuY3VycmVudFNsaWRlOjApLGUuc2V0UG9zaXRpb24oKSxlLmZvY3VzSGFuZGxlcigpLGUucGF1c2VkPSFlLm9wdGlvbnMuYXV0b3BsYXksZS5hdXRvUGxheSgpLGUuJHNsaWRlci50cmlnZ2VyKFwicmVJbml0XCIsW2VdKX0sZS5wcm90b3R5cGUucmVzaXplPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcztpKHdpbmRvdykud2lkdGgoKSE9PWUud2luZG93V2lkdGgmJihjbGVhclRpbWVvdXQoZS53aW5kb3dEZWxheSksZS53aW5kb3dEZWxheT13aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe2Uud2luZG93V2lkdGg9aSh3aW5kb3cpLndpZHRoKCksZS5jaGVja1Jlc3BvbnNpdmUoKSxlLnVuc2xpY2tlZHx8ZS5zZXRQb3NpdGlvbigpfSw1MCkpfSxlLnByb3RvdHlwZS5yZW1vdmVTbGlkZT1lLnByb3RvdHlwZS5zbGlja1JlbW92ZT1mdW5jdGlvbihpLGUsdCl7dmFyIG89dGhpcztpZihpPVwiYm9vbGVhblwiPT10eXBlb2YgaT8hMD09PShlPWkpPzA6by5zbGlkZUNvdW50LTE6ITA9PT1lPy0taTppLG8uc2xpZGVDb3VudDwxfHxpPDB8fGk+by5zbGlkZUNvdW50LTEpcmV0dXJuITE7by51bmxvYWQoKSwhMD09PXQ/by4kc2xpZGVUcmFjay5jaGlsZHJlbigpLnJlbW92ZSgpOm8uJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5lcShpKS5yZW1vdmUoKSxvLiRzbGlkZXM9by4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLG8uJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5kZXRhY2goKSxvLiRzbGlkZVRyYWNrLmFwcGVuZChvLiRzbGlkZXMpLG8uJHNsaWRlc0NhY2hlPW8uJHNsaWRlcyxvLnJlaW5pdCgpfSxlLnByb3RvdHlwZS5zZXRDU1M9ZnVuY3Rpb24oaSl7dmFyIGUsdCxvPXRoaXMscz17fTshMD09PW8ub3B0aW9ucy5ydGwmJihpPS1pKSxlPVwibGVmdFwiPT1vLnBvc2l0aW9uUHJvcD9NYXRoLmNlaWwoaSkrXCJweFwiOlwiMHB4XCIsdD1cInRvcFwiPT1vLnBvc2l0aW9uUHJvcD9NYXRoLmNlaWwoaSkrXCJweFwiOlwiMHB4XCIsc1tvLnBvc2l0aW9uUHJvcF09aSwhMT09PW8udHJhbnNmb3Jtc0VuYWJsZWQ/by4kc2xpZGVUcmFjay5jc3Mocyk6KHM9e30sITE9PT1vLmNzc1RyYW5zaXRpb25zPyhzW28uYW5pbVR5cGVdPVwidHJhbnNsYXRlKFwiK2UrXCIsIFwiK3QrXCIpXCIsby4kc2xpZGVUcmFjay5jc3MocykpOihzW28uYW5pbVR5cGVdPVwidHJhbnNsYXRlM2QoXCIrZStcIiwgXCIrdCtcIiwgMHB4KVwiLG8uJHNsaWRlVHJhY2suY3NzKHMpKSl9LGUucHJvdG90eXBlLnNldERpbWVuc2lvbnM9ZnVuY3Rpb24oKXt2YXIgaT10aGlzOyExPT09aS5vcHRpb25zLnZlcnRpY2FsPyEwPT09aS5vcHRpb25zLmNlbnRlck1vZGUmJmkuJGxpc3QuY3NzKHtwYWRkaW5nOlwiMHB4IFwiK2kub3B0aW9ucy5jZW50ZXJQYWRkaW5nfSk6KGkuJGxpc3QuaGVpZ2h0KGkuJHNsaWRlcy5maXJzdCgpLm91dGVySGVpZ2h0KCEwKSppLm9wdGlvbnMuc2xpZGVzVG9TaG93KSwhMD09PWkub3B0aW9ucy5jZW50ZXJNb2RlJiZpLiRsaXN0LmNzcyh7cGFkZGluZzppLm9wdGlvbnMuY2VudGVyUGFkZGluZytcIiAwcHhcIn0pKSxpLmxpc3RXaWR0aD1pLiRsaXN0LndpZHRoKCksaS5saXN0SGVpZ2h0PWkuJGxpc3QuaGVpZ2h0KCksITE9PT1pLm9wdGlvbnMudmVydGljYWwmJiExPT09aS5vcHRpb25zLnZhcmlhYmxlV2lkdGg/KGkuc2xpZGVXaWR0aD1NYXRoLmNlaWwoaS5saXN0V2lkdGgvaS5vcHRpb25zLnNsaWRlc1RvU2hvdyksaS4kc2xpZGVUcmFjay53aWR0aChNYXRoLmNlaWwoaS5zbGlkZVdpZHRoKmkuJHNsaWRlVHJhY2suY2hpbGRyZW4oXCIuc2xpY2stc2xpZGVcIikubGVuZ3RoKSkpOiEwPT09aS5vcHRpb25zLnZhcmlhYmxlV2lkdGg/aS4kc2xpZGVUcmFjay53aWR0aCg1ZTMqaS5zbGlkZUNvdW50KTooaS5zbGlkZVdpZHRoPU1hdGguY2VpbChpLmxpc3RXaWR0aCksaS4kc2xpZGVUcmFjay5oZWlnaHQoTWF0aC5jZWlsKGkuJHNsaWRlcy5maXJzdCgpLm91dGVySGVpZ2h0KCEwKSppLiRzbGlkZVRyYWNrLmNoaWxkcmVuKFwiLnNsaWNrLXNsaWRlXCIpLmxlbmd0aCkpKTt2YXIgZT1pLiRzbGlkZXMuZmlyc3QoKS5vdXRlcldpZHRoKCEwKS1pLiRzbGlkZXMuZmlyc3QoKS53aWR0aCgpOyExPT09aS5vcHRpb25zLnZhcmlhYmxlV2lkdGgmJmkuJHNsaWRlVHJhY2suY2hpbGRyZW4oXCIuc2xpY2stc2xpZGVcIikud2lkdGgoaS5zbGlkZVdpZHRoLWUpfSxlLnByb3RvdHlwZS5zZXRGYWRlPWZ1bmN0aW9uKCl7dmFyIGUsdD10aGlzO3QuJHNsaWRlcy5lYWNoKGZ1bmN0aW9uKG8scyl7ZT10LnNsaWRlV2lkdGgqbyotMSwhMD09PXQub3B0aW9ucy5ydGw/aShzKS5jc3Moe3Bvc2l0aW9uOlwicmVsYXRpdmVcIixyaWdodDplLHRvcDowLHpJbmRleDp0Lm9wdGlvbnMuekluZGV4LTIsb3BhY2l0eTowfSk6aShzKS5jc3Moe3Bvc2l0aW9uOlwicmVsYXRpdmVcIixsZWZ0OmUsdG9wOjAsekluZGV4OnQub3B0aW9ucy56SW5kZXgtMixvcGFjaXR5OjB9KX0pLHQuJHNsaWRlcy5lcSh0LmN1cnJlbnRTbGlkZSkuY3NzKHt6SW5kZXg6dC5vcHRpb25zLnpJbmRleC0xLG9wYWNpdHk6MX0pfSxlLnByb3RvdHlwZS5zZXRIZWlnaHQ9ZnVuY3Rpb24oKXt2YXIgaT10aGlzO2lmKDE9PT1pLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYhMD09PWkub3B0aW9ucy5hZGFwdGl2ZUhlaWdodCYmITE9PT1pLm9wdGlvbnMudmVydGljYWwpe3ZhciBlPWkuJHNsaWRlcy5lcShpLmN1cnJlbnRTbGlkZSkub3V0ZXJIZWlnaHQoITApO2kuJGxpc3QuY3NzKFwiaGVpZ2h0XCIsZSl9fSxlLnByb3RvdHlwZS5zZXRPcHRpb249ZS5wcm90b3R5cGUuc2xpY2tTZXRPcHRpb249ZnVuY3Rpb24oKXt2YXIgZSx0LG8scyxuLHI9dGhpcyxsPSExO2lmKFwib2JqZWN0XCI9PT1pLnR5cGUoYXJndW1lbnRzWzBdKT8obz1hcmd1bWVudHNbMF0sbD1hcmd1bWVudHNbMV0sbj1cIm11bHRpcGxlXCIpOlwic3RyaW5nXCI9PT1pLnR5cGUoYXJndW1lbnRzWzBdKSYmKG89YXJndW1lbnRzWzBdLHM9YXJndW1lbnRzWzFdLGw9YXJndW1lbnRzWzJdLFwicmVzcG9uc2l2ZVwiPT09YXJndW1lbnRzWzBdJiZcImFycmF5XCI9PT1pLnR5cGUoYXJndW1lbnRzWzFdKT9uPVwicmVzcG9uc2l2ZVwiOnZvaWQgMCE9PWFyZ3VtZW50c1sxXSYmKG49XCJzaW5nbGVcIikpLFwic2luZ2xlXCI9PT1uKXIub3B0aW9uc1tvXT1zO2Vsc2UgaWYoXCJtdWx0aXBsZVwiPT09bilpLmVhY2gobyxmdW5jdGlvbihpLGUpe3Iub3B0aW9uc1tpXT1lfSk7ZWxzZSBpZihcInJlc3BvbnNpdmVcIj09PW4pZm9yKHQgaW4gcylpZihcImFycmF5XCIhPT1pLnR5cGUoci5vcHRpb25zLnJlc3BvbnNpdmUpKXIub3B0aW9ucy5yZXNwb25zaXZlPVtzW3RdXTtlbHNle2ZvcihlPXIub3B0aW9ucy5yZXNwb25zaXZlLmxlbmd0aC0xO2U+PTA7KXIub3B0aW9ucy5yZXNwb25zaXZlW2VdLmJyZWFrcG9pbnQ9PT1zW3RdLmJyZWFrcG9pbnQmJnIub3B0aW9ucy5yZXNwb25zaXZlLnNwbGljZShlLDEpLGUtLTtyLm9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKHNbdF0pfWwmJihyLnVubG9hZCgpLHIucmVpbml0KCkpfSxlLnByb3RvdHlwZS5zZXRQb3NpdGlvbj1mdW5jdGlvbigpe3ZhciBpPXRoaXM7aS5zZXREaW1lbnNpb25zKCksaS5zZXRIZWlnaHQoKSwhMT09PWkub3B0aW9ucy5mYWRlP2kuc2V0Q1NTKGkuZ2V0TGVmdChpLmN1cnJlbnRTbGlkZSkpOmkuc2V0RmFkZSgpLGkuJHNsaWRlci50cmlnZ2VyKFwic2V0UG9zaXRpb25cIixbaV0pfSxlLnByb3RvdHlwZS5zZXRQcm9wcz1mdW5jdGlvbigpe3ZhciBpPXRoaXMsZT1kb2N1bWVudC5ib2R5LnN0eWxlO2kucG9zaXRpb25Qcm9wPSEwPT09aS5vcHRpb25zLnZlcnRpY2FsP1widG9wXCI6XCJsZWZ0XCIsXCJ0b3BcIj09PWkucG9zaXRpb25Qcm9wP2kuJHNsaWRlci5hZGRDbGFzcyhcInNsaWNrLXZlcnRpY2FsXCIpOmkuJHNsaWRlci5yZW1vdmVDbGFzcyhcInNsaWNrLXZlcnRpY2FsXCIpLHZvaWQgMD09PWUuV2Via2l0VHJhbnNpdGlvbiYmdm9pZCAwPT09ZS5Nb3pUcmFuc2l0aW9uJiZ2b2lkIDA9PT1lLm1zVHJhbnNpdGlvbnx8ITA9PT1pLm9wdGlvbnMudXNlQ1NTJiYoaS5jc3NUcmFuc2l0aW9ucz0hMCksaS5vcHRpb25zLmZhZGUmJihcIm51bWJlclwiPT10eXBlb2YgaS5vcHRpb25zLnpJbmRleD9pLm9wdGlvbnMuekluZGV4PDMmJihpLm9wdGlvbnMuekluZGV4PTMpOmkub3B0aW9ucy56SW5kZXg9aS5kZWZhdWx0cy56SW5kZXgpLHZvaWQgMCE9PWUuT1RyYW5zZm9ybSYmKGkuYW5pbVR5cGU9XCJPVHJhbnNmb3JtXCIsaS50cmFuc2Zvcm1UeXBlPVwiLW8tdHJhbnNmb3JtXCIsaS50cmFuc2l0aW9uVHlwZT1cIk9UcmFuc2l0aW9uXCIsdm9pZCAwPT09ZS5wZXJzcGVjdGl2ZVByb3BlcnR5JiZ2b2lkIDA9PT1lLndlYmtpdFBlcnNwZWN0aXZlJiYoaS5hbmltVHlwZT0hMSkpLHZvaWQgMCE9PWUuTW96VHJhbnNmb3JtJiYoaS5hbmltVHlwZT1cIk1velRyYW5zZm9ybVwiLGkudHJhbnNmb3JtVHlwZT1cIi1tb3otdHJhbnNmb3JtXCIsaS50cmFuc2l0aW9uVHlwZT1cIk1velRyYW5zaXRpb25cIix2b2lkIDA9PT1lLnBlcnNwZWN0aXZlUHJvcGVydHkmJnZvaWQgMD09PWUuTW96UGVyc3BlY3RpdmUmJihpLmFuaW1UeXBlPSExKSksdm9pZCAwIT09ZS53ZWJraXRUcmFuc2Zvcm0mJihpLmFuaW1UeXBlPVwid2Via2l0VHJhbnNmb3JtXCIsaS50cmFuc2Zvcm1UeXBlPVwiLXdlYmtpdC10cmFuc2Zvcm1cIixpLnRyYW5zaXRpb25UeXBlPVwid2Via2l0VHJhbnNpdGlvblwiLHZvaWQgMD09PWUucGVyc3BlY3RpdmVQcm9wZXJ0eSYmdm9pZCAwPT09ZS53ZWJraXRQZXJzcGVjdGl2ZSYmKGkuYW5pbVR5cGU9ITEpKSx2b2lkIDAhPT1lLm1zVHJhbnNmb3JtJiYoaS5hbmltVHlwZT1cIm1zVHJhbnNmb3JtXCIsaS50cmFuc2Zvcm1UeXBlPVwiLW1zLXRyYW5zZm9ybVwiLGkudHJhbnNpdGlvblR5cGU9XCJtc1RyYW5zaXRpb25cIix2b2lkIDA9PT1lLm1zVHJhbnNmb3JtJiYoaS5hbmltVHlwZT0hMSkpLHZvaWQgMCE9PWUudHJhbnNmb3JtJiYhMSE9PWkuYW5pbVR5cGUmJihpLmFuaW1UeXBlPVwidHJhbnNmb3JtXCIsaS50cmFuc2Zvcm1UeXBlPVwidHJhbnNmb3JtXCIsaS50cmFuc2l0aW9uVHlwZT1cInRyYW5zaXRpb25cIiksaS50cmFuc2Zvcm1zRW5hYmxlZD1pLm9wdGlvbnMudXNlVHJhbnNmb3JtJiZudWxsIT09aS5hbmltVHlwZSYmITEhPT1pLmFuaW1UeXBlfSxlLnByb3RvdHlwZS5zZXRTbGlkZUNsYXNzZXM9ZnVuY3Rpb24oaSl7dmFyIGUsdCxvLHMsbj10aGlzO2lmKHQ9bi4kc2xpZGVyLmZpbmQoXCIuc2xpY2stc2xpZGVcIikucmVtb3ZlQ2xhc3MoXCJzbGljay1hY3RpdmUgc2xpY2stY2VudGVyIHNsaWNrLWN1cnJlbnRcIikuYXR0cihcImFyaWEtaGlkZGVuXCIsXCJ0cnVlXCIpLG4uJHNsaWRlcy5lcShpKS5hZGRDbGFzcyhcInNsaWNrLWN1cnJlbnRcIiksITA9PT1uLm9wdGlvbnMuY2VudGVyTW9kZSl7dmFyIHI9bi5vcHRpb25zLnNsaWRlc1RvU2hvdyUyPT0wPzE6MDtlPU1hdGguZmxvb3Iobi5vcHRpb25zLnNsaWRlc1RvU2hvdy8yKSwhMD09PW4ub3B0aW9ucy5pbmZpbml0ZSYmKGk+PWUmJmk8PW4uc2xpZGVDb3VudC0xLWU/bi4kc2xpZGVzLnNsaWNlKGktZStyLGkrZSsxKS5hZGRDbGFzcyhcInNsaWNrLWFjdGl2ZVwiKS5hdHRyKFwiYXJpYS1oaWRkZW5cIixcImZhbHNlXCIpOihvPW4ub3B0aW9ucy5zbGlkZXNUb1Nob3craSx0LnNsaWNlKG8tZSsxK3IsbytlKzIpLmFkZENsYXNzKFwic2xpY2stYWN0aXZlXCIpLmF0dHIoXCJhcmlhLWhpZGRlblwiLFwiZmFsc2VcIikpLDA9PT1pP3QuZXEodC5sZW5ndGgtMS1uLm9wdGlvbnMuc2xpZGVzVG9TaG93KS5hZGRDbGFzcyhcInNsaWNrLWNlbnRlclwiKTppPT09bi5zbGlkZUNvdW50LTEmJnQuZXEobi5vcHRpb25zLnNsaWRlc1RvU2hvdykuYWRkQ2xhc3MoXCJzbGljay1jZW50ZXJcIikpLG4uJHNsaWRlcy5lcShpKS5hZGRDbGFzcyhcInNsaWNrLWNlbnRlclwiKX1lbHNlIGk+PTAmJmk8PW4uc2xpZGVDb3VudC1uLm9wdGlvbnMuc2xpZGVzVG9TaG93P24uJHNsaWRlcy5zbGljZShpLGkrbi5vcHRpb25zLnNsaWRlc1RvU2hvdykuYWRkQ2xhc3MoXCJzbGljay1hY3RpdmVcIikuYXR0cihcImFyaWEtaGlkZGVuXCIsXCJmYWxzZVwiKTp0Lmxlbmd0aDw9bi5vcHRpb25zLnNsaWRlc1RvU2hvdz90LmFkZENsYXNzKFwic2xpY2stYWN0aXZlXCIpLmF0dHIoXCJhcmlhLWhpZGRlblwiLFwiZmFsc2VcIik6KHM9bi5zbGlkZUNvdW50JW4ub3B0aW9ucy5zbGlkZXNUb1Nob3csbz0hMD09PW4ub3B0aW9ucy5pbmZpbml0ZT9uLm9wdGlvbnMuc2xpZGVzVG9TaG93K2k6aSxuLm9wdGlvbnMuc2xpZGVzVG9TaG93PT1uLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwmJm4uc2xpZGVDb3VudC1pPG4ub3B0aW9ucy5zbGlkZXNUb1Nob3c/dC5zbGljZShvLShuLm9wdGlvbnMuc2xpZGVzVG9TaG93LXMpLG8rcykuYWRkQ2xhc3MoXCJzbGljay1hY3RpdmVcIikuYXR0cihcImFyaWEtaGlkZGVuXCIsXCJmYWxzZVwiKTp0LnNsaWNlKG8sbytuLm9wdGlvbnMuc2xpZGVzVG9TaG93KS5hZGRDbGFzcyhcInNsaWNrLWFjdGl2ZVwiKS5hdHRyKFwiYXJpYS1oaWRkZW5cIixcImZhbHNlXCIpKTtcIm9uZGVtYW5kXCIhPT1uLm9wdGlvbnMubGF6eUxvYWQmJlwiYW50aWNpcGF0ZWRcIiE9PW4ub3B0aW9ucy5sYXp5TG9hZHx8bi5sYXp5TG9hZCgpfSxlLnByb3RvdHlwZS5zZXR1cEluZmluaXRlPWZ1bmN0aW9uKCl7dmFyIGUsdCxvLHM9dGhpcztpZighMD09PXMub3B0aW9ucy5mYWRlJiYocy5vcHRpb25zLmNlbnRlck1vZGU9ITEpLCEwPT09cy5vcHRpb25zLmluZmluaXRlJiYhMT09PXMub3B0aW9ucy5mYWRlJiYodD1udWxsLHMuc2xpZGVDb3VudD5zLm9wdGlvbnMuc2xpZGVzVG9TaG93KSl7Zm9yKG89ITA9PT1zLm9wdGlvbnMuY2VudGVyTW9kZT9zLm9wdGlvbnMuc2xpZGVzVG9TaG93KzE6cy5vcHRpb25zLnNsaWRlc1RvU2hvdyxlPXMuc2xpZGVDb3VudDtlPnMuc2xpZGVDb3VudC1vO2UtPTEpdD1lLTEsaShzLiRzbGlkZXNbdF0pLmNsb25lKCEwKS5hdHRyKFwiaWRcIixcIlwiKS5hdHRyKFwiZGF0YS1zbGljay1pbmRleFwiLHQtcy5zbGlkZUNvdW50KS5wcmVwZW5kVG8ocy4kc2xpZGVUcmFjaykuYWRkQ2xhc3MoXCJzbGljay1jbG9uZWRcIik7Zm9yKGU9MDtlPG8rcy5zbGlkZUNvdW50O2UrPTEpdD1lLGkocy4kc2xpZGVzW3RdKS5jbG9uZSghMCkuYXR0cihcImlkXCIsXCJcIikuYXR0cihcImRhdGEtc2xpY2staW5kZXhcIix0K3Muc2xpZGVDb3VudCkuYXBwZW5kVG8ocy4kc2xpZGVUcmFjaykuYWRkQ2xhc3MoXCJzbGljay1jbG9uZWRcIik7cy4kc2xpZGVUcmFjay5maW5kKFwiLnNsaWNrLWNsb25lZFwiKS5maW5kKFwiW2lkXVwiKS5lYWNoKGZ1bmN0aW9uKCl7aSh0aGlzKS5hdHRyKFwiaWRcIixcIlwiKX0pfX0sZS5wcm90b3R5cGUuaW50ZXJydXB0PWZ1bmN0aW9uKGkpe3ZhciBlPXRoaXM7aXx8ZS5hdXRvUGxheSgpLGUuaW50ZXJydXB0ZWQ9aX0sZS5wcm90b3R5cGUuc2VsZWN0SGFuZGxlcj1mdW5jdGlvbihlKXt2YXIgdD10aGlzLG89aShlLnRhcmdldCkuaXMoXCIuc2xpY2stc2xpZGVcIik/aShlLnRhcmdldCk6aShlLnRhcmdldCkucGFyZW50cyhcIi5zbGljay1zbGlkZVwiKSxzPXBhcnNlSW50KG8uYXR0cihcImRhdGEtc2xpY2staW5kZXhcIikpO3N8fChzPTApLHQuc2xpZGVDb3VudDw9dC5vcHRpb25zLnNsaWRlc1RvU2hvdz90LnNsaWRlSGFuZGxlcihzLCExLCEwKTp0LnNsaWRlSGFuZGxlcihzKX0sZS5wcm90b3R5cGUuc2xpZGVIYW5kbGVyPWZ1bmN0aW9uKGksZSx0KXt2YXIgbyxzLG4scixsLGQ9bnVsbCxhPXRoaXM7aWYoZT1lfHwhMSwhKCEwPT09YS5hbmltYXRpbmcmJiEwPT09YS5vcHRpb25zLndhaXRGb3JBbmltYXRlfHwhMD09PWEub3B0aW9ucy5mYWRlJiZhLmN1cnJlbnRTbGlkZT09PWkpKWlmKCExPT09ZSYmYS5hc05hdkZvcihpKSxvPWksZD1hLmdldExlZnQobykscj1hLmdldExlZnQoYS5jdXJyZW50U2xpZGUpLGEuY3VycmVudExlZnQ9bnVsbD09PWEuc3dpcGVMZWZ0P3I6YS5zd2lwZUxlZnQsITE9PT1hLm9wdGlvbnMuaW5maW5pdGUmJiExPT09YS5vcHRpb25zLmNlbnRlck1vZGUmJihpPDB8fGk+YS5nZXREb3RDb3VudCgpKmEub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCkpITE9PT1hLm9wdGlvbnMuZmFkZSYmKG89YS5jdXJyZW50U2xpZGUsITAhPT10P2EuYW5pbWF0ZVNsaWRlKHIsZnVuY3Rpb24oKXthLnBvc3RTbGlkZShvKX0pOmEucG9zdFNsaWRlKG8pKTtlbHNlIGlmKCExPT09YS5vcHRpb25zLmluZmluaXRlJiYhMD09PWEub3B0aW9ucy5jZW50ZXJNb2RlJiYoaTwwfHxpPmEuc2xpZGVDb3VudC1hLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpKSExPT09YS5vcHRpb25zLmZhZGUmJihvPWEuY3VycmVudFNsaWRlLCEwIT09dD9hLmFuaW1hdGVTbGlkZShyLGZ1bmN0aW9uKCl7YS5wb3N0U2xpZGUobyl9KTphLnBvc3RTbGlkZShvKSk7ZWxzZXtpZihhLm9wdGlvbnMuYXV0b3BsYXkmJmNsZWFySW50ZXJ2YWwoYS5hdXRvUGxheVRpbWVyKSxzPW88MD9hLnNsaWRlQ291bnQlYS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIT0wP2Euc2xpZGVDb3VudC1hLnNsaWRlQ291bnQlYS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsOmEuc2xpZGVDb3VudCtvOm8+PWEuc2xpZGVDb3VudD9hLnNsaWRlQ291bnQlYS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIT0wPzA6by1hLnNsaWRlQ291bnQ6byxhLmFuaW1hdGluZz0hMCxhLiRzbGlkZXIudHJpZ2dlcihcImJlZm9yZUNoYW5nZVwiLFthLGEuY3VycmVudFNsaWRlLHNdKSxuPWEuY3VycmVudFNsaWRlLGEuY3VycmVudFNsaWRlPXMsYS5zZXRTbGlkZUNsYXNzZXMoYS5jdXJyZW50U2xpZGUpLGEub3B0aW9ucy5hc05hdkZvciYmKGw9KGw9YS5nZXROYXZUYXJnZXQoKSkuc2xpY2soXCJnZXRTbGlja1wiKSkuc2xpZGVDb3VudDw9bC5vcHRpb25zLnNsaWRlc1RvU2hvdyYmbC5zZXRTbGlkZUNsYXNzZXMoYS5jdXJyZW50U2xpZGUpLGEudXBkYXRlRG90cygpLGEudXBkYXRlQXJyb3dzKCksITA9PT1hLm9wdGlvbnMuZmFkZSlyZXR1cm4hMCE9PXQ/KGEuZmFkZVNsaWRlT3V0KG4pLGEuZmFkZVNsaWRlKHMsZnVuY3Rpb24oKXthLnBvc3RTbGlkZShzKX0pKTphLnBvc3RTbGlkZShzKSx2b2lkIGEuYW5pbWF0ZUhlaWdodCgpOyEwIT09dD9hLmFuaW1hdGVTbGlkZShkLGZ1bmN0aW9uKCl7YS5wb3N0U2xpZGUocyl9KTphLnBvc3RTbGlkZShzKX19LGUucHJvdG90eXBlLnN0YXJ0TG9hZD1mdW5jdGlvbigpe3ZhciBpPXRoaXM7ITA9PT1pLm9wdGlvbnMuYXJyb3dzJiZpLnNsaWRlQ291bnQ+aS5vcHRpb25zLnNsaWRlc1RvU2hvdyYmKGkuJHByZXZBcnJvdy5oaWRlKCksaS4kbmV4dEFycm93LmhpZGUoKSksITA9PT1pLm9wdGlvbnMuZG90cyYmaS5zbGlkZUNvdW50Pmkub3B0aW9ucy5zbGlkZXNUb1Nob3cmJmkuJGRvdHMuaGlkZSgpLGkuJHNsaWRlci5hZGRDbGFzcyhcInNsaWNrLWxvYWRpbmdcIil9LGUucHJvdG90eXBlLnN3aXBlRGlyZWN0aW9uPWZ1bmN0aW9uKCl7dmFyIGksZSx0LG8scz10aGlzO3JldHVybiBpPXMudG91Y2hPYmplY3Quc3RhcnRYLXMudG91Y2hPYmplY3QuY3VyWCxlPXMudG91Y2hPYmplY3Quc3RhcnRZLXMudG91Y2hPYmplY3QuY3VyWSx0PU1hdGguYXRhbjIoZSxpKSwobz1NYXRoLnJvdW5kKDE4MCp0L01hdGguUEkpKTwwJiYobz0zNjAtTWF0aC5hYnMobykpLG88PTQ1JiZvPj0wPyExPT09cy5vcHRpb25zLnJ0bD9cImxlZnRcIjpcInJpZ2h0XCI6bzw9MzYwJiZvPj0zMTU/ITE9PT1zLm9wdGlvbnMucnRsP1wibGVmdFwiOlwicmlnaHRcIjpvPj0xMzUmJm88PTIyNT8hMT09PXMub3B0aW9ucy5ydGw/XCJyaWdodFwiOlwibGVmdFwiOiEwPT09cy5vcHRpb25zLnZlcnRpY2FsU3dpcGluZz9vPj0zNSYmbzw9MTM1P1wiZG93blwiOlwidXBcIjpcInZlcnRpY2FsXCJ9LGUucHJvdG90eXBlLnN3aXBlRW5kPWZ1bmN0aW9uKGkpe3ZhciBlLHQsbz10aGlzO2lmKG8uZHJhZ2dpbmc9ITEsby5zd2lwaW5nPSExLG8uc2Nyb2xsaW5nKXJldHVybiBvLnNjcm9sbGluZz0hMSwhMTtpZihvLmludGVycnVwdGVkPSExLG8uc2hvdWxkQ2xpY2s9IShvLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoPjEwKSx2b2lkIDA9PT1vLnRvdWNoT2JqZWN0LmN1clgpcmV0dXJuITE7aWYoITA9PT1vLnRvdWNoT2JqZWN0LmVkZ2VIaXQmJm8uJHNsaWRlci50cmlnZ2VyKFwiZWRnZVwiLFtvLG8uc3dpcGVEaXJlY3Rpb24oKV0pLG8udG91Y2hPYmplY3Quc3dpcGVMZW5ndGg+PW8udG91Y2hPYmplY3QubWluU3dpcGUpe3N3aXRjaCh0PW8uc3dpcGVEaXJlY3Rpb24oKSl7Y2FzZVwibGVmdFwiOmNhc2VcImRvd25cIjplPW8ub3B0aW9ucy5zd2lwZVRvU2xpZGU/by5jaGVja05hdmlnYWJsZShvLmN1cnJlbnRTbGlkZStvLmdldFNsaWRlQ291bnQoKSk6by5jdXJyZW50U2xpZGUrby5nZXRTbGlkZUNvdW50KCksby5jdXJyZW50RGlyZWN0aW9uPTA7YnJlYWs7Y2FzZVwicmlnaHRcIjpjYXNlXCJ1cFwiOmU9by5vcHRpb25zLnN3aXBlVG9TbGlkZT9vLmNoZWNrTmF2aWdhYmxlKG8uY3VycmVudFNsaWRlLW8uZ2V0U2xpZGVDb3VudCgpKTpvLmN1cnJlbnRTbGlkZS1vLmdldFNsaWRlQ291bnQoKSxvLmN1cnJlbnREaXJlY3Rpb249MX1cInZlcnRpY2FsXCIhPXQmJihvLnNsaWRlSGFuZGxlcihlKSxvLnRvdWNoT2JqZWN0PXt9LG8uJHNsaWRlci50cmlnZ2VyKFwic3dpcGVcIixbbyx0XSkpfWVsc2Ugby50b3VjaE9iamVjdC5zdGFydFghPT1vLnRvdWNoT2JqZWN0LmN1clgmJihvLnNsaWRlSGFuZGxlcihvLmN1cnJlbnRTbGlkZSksby50b3VjaE9iamVjdD17fSl9LGUucHJvdG90eXBlLnN3aXBlSGFuZGxlcj1mdW5jdGlvbihpKXt2YXIgZT10aGlzO2lmKCEoITE9PT1lLm9wdGlvbnMuc3dpcGV8fFwib250b3VjaGVuZFwiaW4gZG9jdW1lbnQmJiExPT09ZS5vcHRpb25zLnN3aXBlfHwhMT09PWUub3B0aW9ucy5kcmFnZ2FibGUmJi0xIT09aS50eXBlLmluZGV4T2YoXCJtb3VzZVwiKSkpc3dpdGNoKGUudG91Y2hPYmplY3QuZmluZ2VyQ291bnQ9aS5vcmlnaW5hbEV2ZW50JiZ2b2lkIDAhPT1pLm9yaWdpbmFsRXZlbnQudG91Y2hlcz9pLm9yaWdpbmFsRXZlbnQudG91Y2hlcy5sZW5ndGg6MSxlLnRvdWNoT2JqZWN0Lm1pblN3aXBlPWUubGlzdFdpZHRoL2Uub3B0aW9ucy50b3VjaFRocmVzaG9sZCwhMD09PWUub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmcmJihlLnRvdWNoT2JqZWN0Lm1pblN3aXBlPWUubGlzdEhlaWdodC9lLm9wdGlvbnMudG91Y2hUaHJlc2hvbGQpLGkuZGF0YS5hY3Rpb24pe2Nhc2VcInN0YXJ0XCI6ZS5zd2lwZVN0YXJ0KGkpO2JyZWFrO2Nhc2VcIm1vdmVcIjplLnN3aXBlTW92ZShpKTticmVhaztjYXNlXCJlbmRcIjplLnN3aXBlRW5kKGkpfX0sZS5wcm90b3R5cGUuc3dpcGVNb3ZlPWZ1bmN0aW9uKGkpe3ZhciBlLHQsbyxzLG4scixsPXRoaXM7cmV0dXJuIG49dm9pZCAwIT09aS5vcmlnaW5hbEV2ZW50P2kub3JpZ2luYWxFdmVudC50b3VjaGVzOm51bGwsISghbC5kcmFnZ2luZ3x8bC5zY3JvbGxpbmd8fG4mJjEhPT1uLmxlbmd0aCkmJihlPWwuZ2V0TGVmdChsLmN1cnJlbnRTbGlkZSksbC50b3VjaE9iamVjdC5jdXJYPXZvaWQgMCE9PW4/blswXS5wYWdlWDppLmNsaWVudFgsbC50b3VjaE9iamVjdC5jdXJZPXZvaWQgMCE9PW4/blswXS5wYWdlWTppLmNsaWVudFksbC50b3VjaE9iamVjdC5zd2lwZUxlbmd0aD1NYXRoLnJvdW5kKE1hdGguc3FydChNYXRoLnBvdyhsLnRvdWNoT2JqZWN0LmN1clgtbC50b3VjaE9iamVjdC5zdGFydFgsMikpKSxyPU1hdGgucm91bmQoTWF0aC5zcXJ0KE1hdGgucG93KGwudG91Y2hPYmplY3QuY3VyWS1sLnRvdWNoT2JqZWN0LnN0YXJ0WSwyKSkpLCFsLm9wdGlvbnMudmVydGljYWxTd2lwaW5nJiYhbC5zd2lwaW5nJiZyPjQ/KGwuc2Nyb2xsaW5nPSEwLCExKTooITA9PT1sLm9wdGlvbnMudmVydGljYWxTd2lwaW5nJiYobC50b3VjaE9iamVjdC5zd2lwZUxlbmd0aD1yKSx0PWwuc3dpcGVEaXJlY3Rpb24oKSx2b2lkIDAhPT1pLm9yaWdpbmFsRXZlbnQmJmwudG91Y2hPYmplY3Quc3dpcGVMZW5ndGg+NCYmKGwuc3dpcGluZz0hMCxpLnByZXZlbnREZWZhdWx0KCkpLHM9KCExPT09bC5vcHRpb25zLnJ0bD8xOi0xKSoobC50b3VjaE9iamVjdC5jdXJYPmwudG91Y2hPYmplY3Quc3RhcnRYPzE6LTEpLCEwPT09bC5vcHRpb25zLnZlcnRpY2FsU3dpcGluZyYmKHM9bC50b3VjaE9iamVjdC5jdXJZPmwudG91Y2hPYmplY3Quc3RhcnRZPzE6LTEpLG89bC50b3VjaE9iamVjdC5zd2lwZUxlbmd0aCxsLnRvdWNoT2JqZWN0LmVkZ2VIaXQ9ITEsITE9PT1sLm9wdGlvbnMuaW5maW5pdGUmJigwPT09bC5jdXJyZW50U2xpZGUmJlwicmlnaHRcIj09PXR8fGwuY3VycmVudFNsaWRlPj1sLmdldERvdENvdW50KCkmJlwibGVmdFwiPT09dCkmJihvPWwudG91Y2hPYmplY3Quc3dpcGVMZW5ndGgqbC5vcHRpb25zLmVkZ2VGcmljdGlvbixsLnRvdWNoT2JqZWN0LmVkZ2VIaXQ9ITApLCExPT09bC5vcHRpb25zLnZlcnRpY2FsP2wuc3dpcGVMZWZ0PWUrbypzOmwuc3dpcGVMZWZ0PWUrbyoobC4kbGlzdC5oZWlnaHQoKS9sLmxpc3RXaWR0aCkqcywhMD09PWwub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmcmJihsLnN3aXBlTGVmdD1lK28qcyksITAhPT1sLm9wdGlvbnMuZmFkZSYmITEhPT1sLm9wdGlvbnMudG91Y2hNb3ZlJiYoITA9PT1sLmFuaW1hdGluZz8obC5zd2lwZUxlZnQ9bnVsbCwhMSk6dm9pZCBsLnNldENTUyhsLnN3aXBlTGVmdCkpKSl9LGUucHJvdG90eXBlLnN3aXBlU3RhcnQ9ZnVuY3Rpb24oaSl7dmFyIGUsdD10aGlzO2lmKHQuaW50ZXJydXB0ZWQ9ITAsMSE9PXQudG91Y2hPYmplY3QuZmluZ2VyQ291bnR8fHQuc2xpZGVDb3VudDw9dC5vcHRpb25zLnNsaWRlc1RvU2hvdylyZXR1cm4gdC50b3VjaE9iamVjdD17fSwhMTt2b2lkIDAhPT1pLm9yaWdpbmFsRXZlbnQmJnZvaWQgMCE9PWkub3JpZ2luYWxFdmVudC50b3VjaGVzJiYoZT1pLm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXSksdC50b3VjaE9iamVjdC5zdGFydFg9dC50b3VjaE9iamVjdC5jdXJYPXZvaWQgMCE9PWU/ZS5wYWdlWDppLmNsaWVudFgsdC50b3VjaE9iamVjdC5zdGFydFk9dC50b3VjaE9iamVjdC5jdXJZPXZvaWQgMCE9PWU/ZS5wYWdlWTppLmNsaWVudFksdC5kcmFnZ2luZz0hMH0sZS5wcm90b3R5cGUudW5maWx0ZXJTbGlkZXM9ZS5wcm90b3R5cGUuc2xpY2tVbmZpbHRlcj1mdW5jdGlvbigpe3ZhciBpPXRoaXM7bnVsbCE9PWkuJHNsaWRlc0NhY2hlJiYoaS51bmxvYWQoKSxpLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCksaS4kc2xpZGVzQ2FjaGUuYXBwZW5kVG8oaS4kc2xpZGVUcmFjayksaS5yZWluaXQoKSl9LGUucHJvdG90eXBlLnVubG9hZD1mdW5jdGlvbigpe3ZhciBlPXRoaXM7aShcIi5zbGljay1jbG9uZWRcIixlLiRzbGlkZXIpLnJlbW92ZSgpLGUuJGRvdHMmJmUuJGRvdHMucmVtb3ZlKCksZS4kcHJldkFycm93JiZlLmh0bWxFeHByLnRlc3QoZS5vcHRpb25zLnByZXZBcnJvdykmJmUuJHByZXZBcnJvdy5yZW1vdmUoKSxlLiRuZXh0QXJyb3cmJmUuaHRtbEV4cHIudGVzdChlLm9wdGlvbnMubmV4dEFycm93KSYmZS4kbmV4dEFycm93LnJlbW92ZSgpLGUuJHNsaWRlcy5yZW1vdmVDbGFzcyhcInNsaWNrLXNsaWRlIHNsaWNrLWFjdGl2ZSBzbGljay12aXNpYmxlIHNsaWNrLWN1cnJlbnRcIikuYXR0cihcImFyaWEtaGlkZGVuXCIsXCJ0cnVlXCIpLmNzcyhcIndpZHRoXCIsXCJcIil9LGUucHJvdG90eXBlLnVuc2xpY2s9ZnVuY3Rpb24oaSl7dmFyIGU9dGhpcztlLiRzbGlkZXIudHJpZ2dlcihcInVuc2xpY2tcIixbZSxpXSksZS5kZXN0cm95KCl9LGUucHJvdG90eXBlLnVwZGF0ZUFycm93cz1mdW5jdGlvbigpe3ZhciBpPXRoaXM7TWF0aC5mbG9vcihpLm9wdGlvbnMuc2xpZGVzVG9TaG93LzIpLCEwPT09aS5vcHRpb25zLmFycm93cyYmaS5zbGlkZUNvdW50Pmkub3B0aW9ucy5zbGlkZXNUb1Nob3cmJiFpLm9wdGlvbnMuaW5maW5pdGUmJihpLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoXCJzbGljay1kaXNhYmxlZFwiKS5hdHRyKFwiYXJpYS1kaXNhYmxlZFwiLFwiZmFsc2VcIiksaS4kbmV4dEFycm93LnJlbW92ZUNsYXNzKFwic2xpY2stZGlzYWJsZWRcIikuYXR0cihcImFyaWEtZGlzYWJsZWRcIixcImZhbHNlXCIpLDA9PT1pLmN1cnJlbnRTbGlkZT8oaS4kcHJldkFycm93LmFkZENsYXNzKFwic2xpY2stZGlzYWJsZWRcIikuYXR0cihcImFyaWEtZGlzYWJsZWRcIixcInRydWVcIiksaS4kbmV4dEFycm93LnJlbW92ZUNsYXNzKFwic2xpY2stZGlzYWJsZWRcIikuYXR0cihcImFyaWEtZGlzYWJsZWRcIixcImZhbHNlXCIpKTppLmN1cnJlbnRTbGlkZT49aS5zbGlkZUNvdW50LWkub3B0aW9ucy5zbGlkZXNUb1Nob3cmJiExPT09aS5vcHRpb25zLmNlbnRlck1vZGU/KGkuJG5leHRBcnJvdy5hZGRDbGFzcyhcInNsaWNrLWRpc2FibGVkXCIpLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJ0cnVlXCIpLGkuJHByZXZBcnJvdy5yZW1vdmVDbGFzcyhcInNsaWNrLWRpc2FibGVkXCIpLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJmYWxzZVwiKSk6aS5jdXJyZW50U2xpZGU+PWkuc2xpZGVDb3VudC0xJiYhMD09PWkub3B0aW9ucy5jZW50ZXJNb2RlJiYoaS4kbmV4dEFycm93LmFkZENsYXNzKFwic2xpY2stZGlzYWJsZWRcIikuYXR0cihcImFyaWEtZGlzYWJsZWRcIixcInRydWVcIiksaS4kcHJldkFycm93LnJlbW92ZUNsYXNzKFwic2xpY2stZGlzYWJsZWRcIikuYXR0cihcImFyaWEtZGlzYWJsZWRcIixcImZhbHNlXCIpKSl9LGUucHJvdG90eXBlLnVwZGF0ZURvdHM9ZnVuY3Rpb24oKXt2YXIgaT10aGlzO251bGwhPT1pLiRkb3RzJiYoaS4kZG90cy5maW5kKFwibGlcIikucmVtb3ZlQ2xhc3MoXCJzbGljay1hY3RpdmVcIikuZW5kKCksaS4kZG90cy5maW5kKFwibGlcIikuZXEoTWF0aC5mbG9vcihpLmN1cnJlbnRTbGlkZS9pLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpKS5hZGRDbGFzcyhcInNsaWNrLWFjdGl2ZVwiKSl9LGUucHJvdG90eXBlLnZpc2liaWxpdHk9ZnVuY3Rpb24oKXt2YXIgaT10aGlzO2kub3B0aW9ucy5hdXRvcGxheSYmKGRvY3VtZW50W2kuaGlkZGVuXT9pLmludGVycnVwdGVkPSEwOmkuaW50ZXJydXB0ZWQ9ITEpfSxpLmZuLnNsaWNrPWZ1bmN0aW9uKCl7dmFyIGksdCxvPXRoaXMscz1hcmd1bWVudHNbMF0sbj1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMSkscj1vLmxlbmd0aDtmb3IoaT0wO2k8cjtpKyspaWYoXCJvYmplY3RcIj09dHlwZW9mIHN8fHZvaWQgMD09PXM/b1tpXS5zbGljaz1uZXcgZShvW2ldLHMpOnQ9b1tpXS5zbGlja1tzXS5hcHBseShvW2ldLnNsaWNrLG4pLHZvaWQgMCE9PXQpcmV0dXJuIHQ7cmV0dXJuIG99fSk7XG5cclxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJCgnLmJhbm5lcnMtc2xpZGVyJykuc2xpY2soe1xyXG4gICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxyXG4gICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICBwcmV2QXJyb3c6ICc8YnV0dG9uIGNsYXNzPVwicHJldiBhcnJvd1wiPjwvYnV0dG9uPicsXHJcbiAgICAgICAgICBuZXh0QXJyb3c6ICc8YnV0dG9uIGNsYXNzPVwibmV4dCBhcnJvd1wiPjwvYnV0dG9uPicsXHJcbiAgICAgICAgICByZXNwb25zaXZlOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDEwMjQsXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAvLyBwcmV2QXJyb3c6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAvLyBuZXh0QXJyb3c6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgYXV0b3BsYXk6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICBhdXRvcGxheVNwZWVkOiAzMDAwLFxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyB7XHJcbiAgICAgICAgICAgIC8vICAgICBicmVha3BvaW50OiA2MDAsXHJcbiAgICAgICAgICAgIC8vICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAvLyAgICAgc2xpZGVzVG9TaG93OiAyLFxyXG4gICAgICAgICAgICAvLyAgICAgc2xpZGVzVG9TY3JvbGw6IDJcclxuICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogMzIwLFxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgIHByZXZBcnJvdzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgIG5leHRBcnJvdzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIFlvdSBjYW4gdW5zbGljayBhdCBhIGdpdmVuIGJyZWFrcG9pbnQgbm93IGJ5IGFkZGluZzpcclxuICAgICAgICAgICAgLy8gc2V0dGluZ3M6IFwidW5zbGlja1wiXHJcbiAgICAgICAgICAgIC8vIGluc3RlYWQgb2YgYSBzZXR0aW5ncyBvYmplY3RcclxuICAgICAgICBdXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICAgICAgICAkKCcucHJvZHVjdC1zbGlkZXInKS5zbGljayh7XHJcbiAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyDQutCw0YHRgtC+0LzQvdGL0LUg0YLQvtGH0LrQuCjRhtC40YTRgNGLKSBjdXN0b21QYWdpbmc6IChzbGlkZXIsIGkpID0+IGA8YT4ke2kgKyAxfTwvYT5gXHJcbiAgICAgICAgICAgIC8vINC60L7Qu9C+0L3QutC4IHJvd3M6XHJcbiAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcclxuICAgICAgICAgICAgc3BlZWQ6IDQwMCxcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiA0LFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogNCxcclxuICAgICAgICAgICAgcHJldkFycm93OiAnPGJ1dHRvbiBjbGFzcz1cInByZXYgYXJyb3dcIj48L2J1dHRvbj4nLFxyXG4gICAgICAgICAgICBuZXh0QXJyb3c6ICc8YnV0dG9uIGNsYXNzPVwibmV4dCBhcnJvd1wiPjwvYnV0dG9uPicsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiAxMDI0LFxyXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiA2MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzbGlkZXNUb1Nob3c6IDMsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHNwZWVkOiAzMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNlbnRlck1vZGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICBicmVha3BvaW50OiA0ODAsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgYXJyb3dzOiBmYWxzZSAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyB9LFxyXG5cclxuICAgICAgICAgICAgICAgIC8vIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICBicmVha3BvaW50OiAzMjAsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgcHJldkFycm93OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgIG5leHRBcnJvdzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICBhcnJvd3M6IGZhbHNlICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICAvLyBZb3UgY2FuIHVuc2xpY2sgYXQgYSBnaXZlbiBicmVha3BvaW50IG5vdyBieSBhZGRpbmc6XHJcbiAgICAgICAgICAgICAgICAvLyBzZXR0aW5nczogXCJ1bnNsaWNrXCJcclxuICAgICAgICAgICAgICAgIC8vIGluc3RlYWQgb2YgYSBzZXR0aW5ncyBvYmplY3RcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcuU09NRWNhdGVnb3J5LXNsaWRlcicpLnNsaWNrKHtcclxuICAgICAgICAgICAgcm93czogMixcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgY3VzdG9tUGFnaW5nOiAoc2xpZGVyLCBpKSA9PiBgPGE+JHtpICsgMX08L2E+YCxcclxuICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxyXG4gICAgICAgICAgICBzcGVlZDogNjAwLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDMsXHJcbiAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAzXHJcbiAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgXHJcbiAgICBcclxuICAgIC8vICQoZnVuY3Rpb24oKXtcclxuICAgIC8vICAgICAkKCcucHJvZHVjdC1saXN0LWV4cGVuZCcpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICAvLyAgICAgICAgICQoJy5wcm9kdWN0LWxpc3QnKS50b2dnbGVDbGFzcygncHJvZHVjdC1zbGlkZXInKTtcclxuICAgIC8vICAgICB9KTtcclxuICAgIC8vIH0pO1xyXG4gICAgJChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJChcIiNmaWx0ZXJfX3JhbmdlXCIpLnNsaWRlcih7XHJcbiAgICAgICAgICAgbWluOiAwLFxyXG4gICAgICAgICAgIG1heDogNTAwMDAsXHJcbiAgICAgICAgICAgdmFsdWVzOiBbMjUwMDAsMzUwMDBdLFxyXG4gICAgICAgICAgIHJhbmdlOiB0cnVlLFxyXG4gICAgICAgICAgIHN0b3A6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xyXG4gICAgICAgICAgICQoXCJpbnB1dCNwcmljZU1pblwiKS52YWwoJChcIiNmaWx0ZXJfX3JhbmdlXCIpLnNsaWRlcihcInZhbHVlc1wiLDApKTtcclxuICAgICAgICAgICAkKFwiaW5wdXQjcHJpY2VNYXhcIikudmFsKCQoXCIjZmlsdGVyX19yYW5nZVwiKS5zbGlkZXIoXCJ2YWx1ZXNcIiwxKSk7XHJcbiBcclxuICAgICAgICAgfSxcclxuICAgICAgICAgc2xpZGU6IGZ1bmN0aW9uKGV2ZW50LCB1aSl7XHJcbiAgICAgICAgICAgJChcImlucHV0I3ByaWNlTWluXCIpLnZhbCgkKFwiI2ZpbHRlcl9fcmFuZ2VcIikuc2xpZGVyKFwidmFsdWVzXCIsMCkpO1xyXG4gICAgICAgICAgICQoXCJpbnB1dCNwcmljZU1heFwiKS52YWwoJChcIiNmaWx0ZXJfX3JhbmdlXCIpLnNsaWRlcihcInZhbHVlc1wiLDEpKTtcclxuIFxyXG4gICAgICAgICB9XHJcbiAgICAgICB9KTtcclxuIFxyXG4gICAgICAgJChcImlucHV0I3ByaWNlTWluXCIpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgIHZhciB2YWx1ZTE9JChcImlucHV0I3ByaWNlTWluXCIpLnZhbCgpO1xyXG4gICAgICAgICAgIHZhciB2YWx1ZTI9JChcImlucHV0I3ByaWNlTWF4XCIpLnZhbCgpO1xyXG4gICAgICAgICBpZihwYXJzZUludCh2YWx1ZTEpID4gcGFyc2VJbnQodmFsdWUyKSl7XHJcbiAgICAgICAgICAgICAgIHZhbHVlMSA9IHZhbHVlMjtcclxuICAgICAgICAgICAgICAgJChcImlucHV0I3ByaWNlTWluXCIpLnZhbCh2YWx1ZTEpO1xyXG4gICAgICAgXHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgICQoXCIjZmlsdGVyX19yYW5nZVwiKS5zbGlkZXIoXCJ2YWx1ZXNcIiwgMCwgdmFsdWUxKTtcclxuICAgICBcclxuICAgICAgIH0pO1xyXG4gXHJcbiAgICAgICAkKFwiaW5wdXQjcHJpY2VNYXhcIikub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgdmFyIHZhbHVlMT0kKFwiaW5wdXQjcHJpY2VNaW5cIikudmFsKCk7XHJcbiAgICAgICAgICAgdmFyIHZhbHVlMj0kKFwiaW5wdXQjcHJpY2VNYXhcIikudmFsKCk7XHJcbiAgICAgICAgICAgaWYgKHZhbHVlMiA+IDUwMDAwKSB7IHZhbHVlMiA9IDUwMDAwOyAkKFwiaW5wdXQjcHJpY2VNYXhcIikudmFsKDUwMDAwKX1cclxuICAgICAgICAgICBpZihwYXJzZUludCh2YWx1ZTEpID4gcGFyc2VJbnQodmFsdWUyKSl7XHJcbiAgICAgICAgICAgICAgIHZhbHVlMiA9IHZhbHVlMTtcclxuICAgICAgICAgICAgICAgJChcImlucHV0I3ByaWNlTWF4XCIpLnZhbCh2YWx1ZTIpO1xyXG4gICAgIFxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICAkKFwiI2ZpbHRlcl9fcmFuZ2VcIikuc2xpZGVyKFwidmFsdWVzXCIsMSx2YWx1ZTIpO1xyXG4gICBcclxuICAgICAgIH0pO1xyXG4gICAgIH0pO1xyXG4gICAgJCgnLnByb2QtZGVzY3JpcHRpb24tcGljdHVyZV9faW1nLW1heCcpLnNsaWNrKHtcclxuICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgYXJyb3dzOiB0cnVlLFxyXG4gICAgICBpbmZpbml0ZTogZmFsc2UsXHJcbiAgICAgIGZhZGU6IHRydWUsXHJcbiAgICAgIGFzTmF2Rm9yOiAnLnByb2QtZGVzY3JpcHRpb24tcGljdHVyZV9faW1nLW1pbidcclxuICAgIH0pO1xyXG5cclxuICAgICQoJy5wcm9kLWRlc2NyaXB0aW9uLXBpY3R1cmVfX2ltZy1taW4nKS5zbGljayh7XHJcbiAgICAgIHNsaWRlc1RvU2hvdzogNCxcclxuICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgIGluZmluaXRlOiBmYWxzZSxcclxuICAgICAgYXNOYXZGb3I6ICcucHJvZC1kZXNjcmlwdGlvbi1waWN0dXJlX19pbWctbWF4JyxcclxuICAgICAgLy8gYXJyb3dzOiB0cnVlLFxyXG4gICAgICBwcmV2QXJyb3c6ICc8YnV0dG9uIGNsYXNzPVwicHJldl91cCBhcnJvdyBhcnJvd19wcm9kdWN0XCI+PC9idXR0b24+JyxcclxuICAgICAgbmV4dEFycm93OiAnPGJ1dHRvbiBjbGFzcz1cIm5leHRfZG93biBhcnJvdyBhcnJvd19wcm9kdWN0XCI+PC9idXR0b24+JyxcclxuICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgIHZlcnRpY2FsOiB0cnVlLFxyXG4gICAgICB2ZXJ0aWNhbFN3aXBpbmc6IHRydWUsXHJcbiAgICAgIC8vIGNlbnRlck1vZGU6IHRydWUsXHJcbiAgICAgIGZvY3VzT25TZWxlY3Q6IHRydWVcclxuICAgIH0pO1xyXG5cclxuXHJcblxyXG4gICAgLy8g0JvQsNC50LpcclxuXHJcbiAgICAkKCcuYnRuLWxpa2UnKS5vbignY2xpY2snLGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0O1xyXG4gICAgICAgICQoJy5mYS1oZWFydCcpLnRvZ2dsZUNsYXNzKCdmYXMnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCa0LDRgtC10LPQvtGA0LjQuFxyXG4gICAgJCgnLmhlYWRlcl9fY2F0YWxvZy1idG4nKS5vbignY2xpY2snLGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0O1xyXG4gICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2hlYWRlcl9fY2F0YWxvZy1idG5fYWN0aXZlJyk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLy8g0JDQutC60L7RgNC00LXQvtC90LEg0YHQsNC50LTQsdCw0YAt0YTQuNC70YzRgtGAXHJcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICQoJy50YWItaGVhZGVyJykuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdjb2xsYXBzZS1idG5fX2FjdGl2ZScpLm5leHQoKS5zbGlkZVRvZ2dsZSgpO1xyXG4gICAgICAgICAgICAvLyAkKCcudGFiLWhlYWRlcicpLm5vdCh0aGlzKS5yZW1vdmVDbGFzcygnY29sbGFwc2UtYnRuX19hY3RpdmUnKS5uZXh0KCkuc2xpZGVVcCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG5cclxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgLy8gJCgnLmZpbHRlcl9fbW9yZScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyAgICAgJCgnLmN1c3RvbS1jaGVja2JveCcpLnRvZ2dsZUNsYXNzKCdjdXN0b20tY2hlY2tib3hfX2FjdGl2ZScpO1xyXG4gICAgICAgIC8vICAgICAvLyAkKCcudGFiLWhlYWRlcicpLm5vdCh0aGlzKS5yZW1vdmVDbGFzcygnY29sbGFwc2UtYnRuX19hY3RpdmUnKS5uZXh0KCkuc2xpZGVVcCgpO1xyXG4gICAgICAgIC8vIH0pO1xyXG5cclxuXHJcbiAgICAgICAgJCgnLmJ0bl9fbW9yZScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5wcmV2KCkudG9nZ2xlQ2xhc3MoJ2ZpbHRlcl9fYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIC8vICQoJy50YWItaGVhZGVyJykubm90KHRoaXMpLnJlbW92ZUNsYXNzKCdjb2xsYXBzZS1idG5fX2FjdGl2ZScpLm5leHQoKS5zbGlkZVVwKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vIGJ1dHRvbiBxdWFudGl0eVxyXG5cclxuICAgICQoJy5hZGQnKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCQodGhpcykucHJldigpLnZhbCgpIDwgMTApIHtcclxuICAgICAgICAkKHRoaXMpLnByZXYoKS52YWwoKyQodGhpcykucHJldigpLnZhbCgpICsgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAkKCcuc3ViJykuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICgkKHRoaXMpLm5leHQoKS52YWwoKSA+IDEpIHtcclxuICAgICAgICBpZiAoJCh0aGlzKS5uZXh0KCkudmFsKCkgPiAxKSAkKHRoaXMpLm5leHQoKS52YWwoKyQodGhpcykubmV4dCgpLnZhbCgpIC0gMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vINCh0LzQtdC90Y/RjtGJ0LDRj9GB0Y9cclxuXHJcbiAgICAkKCcuYnRuX2NoYW5nZScpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQodGhpcykudGV4dChmdW5jdGlvbihpLCB0ZXh0KSB7XHJcbiAgICAgICAgICByZXR1cm4gdGV4dCA9PT0gXCLQn9C+0LrQsNC30LDRgtGMINC10YnQtVwiID8gXCLQodC60YDRi9GC0YxcIiA6IFwi0J/QvtC60LDQt9Cw0YLRjCDQtdGJ0LVcIjtcclxuICAgICAgICB9KVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgICQoJy5idG5fYmFza2V0JykuY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzKS50ZXh0KGZ1bmN0aW9uKGksIHRleHQpIHtcclxuICAgICAgICAgIHJldHVybiB0ZXh0ID09PSBcItCSINC60L7RgNC30LjQvdGDXCIgPyBcItCj0LTQsNC70LjRgtGMINC40Lcg0LrQvtGA0LfQuNC90YtcIiA6IFwi0JIg0LrQvtGA0LfQuNC90YNcIjtcclxuICAgICAgICB9KVxyXG4gICAgfSk7XHJcbiAgICAvLyB2YXIgcmF0aW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN0YXInKSxcclxuICAgIC8vICAgICByYXRpbmdJdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnN0YXItaXRlbScpO1xyXG5cclxuICAgIC8vIHJhdGluZy5vbmNsaWNrID0gZnVuY3Rpb24oZSl7XHJcbiAgICAvLyAgIHZhciB0YXJnZXQgPSBlLnRhcmdldDtcclxuICAgIC8vICAgaWYodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnc3Rhci1pdGVtJykpe1xyXG4gICAgLy8gICAgIHJlbW92ZUNsYXNzKHJhdGluZ0l0ZW0sJ2FjdGl2ZScpXHJcbiAgICAvLyAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgLy8gICB9XHJcbiAgICAvLyB9O1xyXG5cclxuICAgIC8vIGZ1bmN0aW9uIHJlbW92ZUNsYXNzKGVsZW1lbnRzLCBjbGFzc05hbWUpIHtcclxuICAgIC8vICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgLy8gICAgICBlbGVtZW50c1tpXS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XHJcbiAgICAvLyAgIH1cclxuICAgIC8vIH07XHJcbiAgICAvLyBjb25zdCBjaXJjbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmF0aW5nLXJpbmdfX2NpcmNsZScpO1xyXG4gICAgLy8gY29uc3QgcmFkaXVzID0gY2lyY2xlLnIuYmFzZVZhbC52YWx1ZTtcclxuICAgIC8vIGNvbnN0IGNpcmN1bWZlcmVuY2UgPSAyICogTWF0aC5QSSAqIHJhZGl1cztcclxuXHJcbiAgICAvLyBjaXJjbGUuc3R5bGUuc3Ryb2tlRGFzaG9mZnNldCA9IGNpcmN1bWZlcmVuY2U7XHJcbiAgICAvLyBjaXJjbGUuc3R5bGUuc3Ryb2tlRGFzaGFycmF5ID0gY2lyY3VtZmVyZW5jZTtcclxuXHJcblxyXG4gICAgLy8gZnVuY3Rpb24gc2V0UHJvZ3Jlc3MocGVyY2VudCkge1xyXG4gICAgLy8gICAgIGNvbnN0IG9mZnNldCA9IGNpcmN1bWZlcmVuY2UgLSBwZXJjZW50IC8gMTAwICogY2lyY3VtZmVyZW5jZTtcclxuICAgIC8vICAgICBjaXJjbGUuc3R5bGUuc3Ryb2tlRGFzaG9mZnNldCA9IG9mZnNldDtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBzZXRQcm9ncmVzcyg2NCk7XHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqINCk0LjQutGB0LjRgNC+0LLQsNC90L3Ri9C5INGF0LXQtNC10YBcclxuICAgICAqL1xyXG5cclxuICAgIC8vICQod2luZG93KS5vbignc2Nyb2xsJywgdG9nZ2xlRml4ZWRIZWFkZXIpO1xyXG5cclxuICAgIC8vIGZ1bmN0aW9uIHRvZ2dsZUZpeGVkSGVhZGVyKCkge1xyXG4gICAgLy8gICAgIGNvbnN0ICRoZWFkZXIgPSAkKCcuaGVhZGVyJyk7XHJcbiAgICAvLyAgICAgY29uc3QgJG1haW4gPSAkKCcuaGVhZGVyJykubmV4dCgpO1xyXG5cclxuICAgIC8vICAgICBpZiAod2luZG93LnBhZ2VZT2Zmc2V0ID4gMCkge1xyXG4gICAgLy8gICAgICAgICAkaGVhZGVyLmFkZENsYXNzKCdpcy1maXhlZCcpO1xyXG4gICAgLy8gICAgICAgICAkbWFpbi5jc3MoeyBtYXJnaW5Ub3A6ICRoZWFkZXIub3V0ZXJIZWlnaHQoKSB9KTtcclxuICAgIC8vICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAkaGVhZGVyLnJlbW92ZUNsYXNzKCdpcy1maXhlZCcpO1xyXG4gICAgLy8gICAgICAgICAkbWFpbi5jc3MoeyBtYXJnaW5Ub3A6IDAgfSk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG5cclxuXHJcblxyXG5cclxuO1xyXG5cclxufSk7XHJcbiJdLCJmaWxlIjoiaW50ZXJuYWwuanMifQ==
