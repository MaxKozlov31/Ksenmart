"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
          dots: true,
          // prevArrow: false,
          // nextArrow: false,
          arrows: false
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
          dots: true,
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
      infinite: false,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 4,
      prevArrow: '<button class="prev arrow"></button>',
      nextArrow: '<button class="next arrow"></button>',
      responsive: [{
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          dots: true
        }
      }, {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }, {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false
        }
      }, {
        breakpoint: 320,
        settings: {
          dots: true,
          prevArrow: false,
          nextArrow: false,
          arrows: false
        }
      } // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
      ]
    });
  }); // $(function(){
  //     $('.product-list-expend').click(function(){
  //         $('.product-list').toggleClass('product-slider');
  //     });
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

  ;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVybmFsLmpzIl0sIm5hbWVzIjpbIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiZ2xvYmFsT3B0aW9ucyIsInRpbWUiLCJkZXNrdG9wWGxTaXplIiwiZGVza3RvcExnU2l6ZSIsImRlc2t0b3BTaXplIiwidGFibGV0TGdTaXplIiwidGFibGV0U2l6ZSIsIm1vYmlsZUxnU2l6ZSIsIm1vYmlsZVNpemUiLCJwb3B1cHNCcmVha3BvaW50IiwicG9wdXBzRml4ZWRUaW1lb3V0IiwiaXNUb3VjaCIsImJyb3dzZXIiLCJtb2JpbGUiLCJsYW5nIiwiYXR0ciIsImJyZWFrcG9pbnRzIiwiYnJlYWtwb2ludERlc2t0b3BYbCIsIndpbmRvdyIsIm1hdGNoTWVkaWEiLCJicmVha3BvaW50RGVza3RvcExnIiwiYnJlYWtwb2ludERlc2t0b3AiLCJicmVha3BvaW50VGFibGV0TGciLCJicmVha3BvaW50VGFibGV0IiwiYnJlYWtwb2ludE1vYmlsZUxnU2l6ZSIsImJyZWFrcG9pbnRNb2JpbGUiLCJleHRlbmQiLCJsb2FkIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImZuIiwiYW5pbWF0ZUNzcyIsImFuaW1hdGlvbk5hbWUiLCJjYWxsYmFjayIsImFuaW1hdGlvbkVuZCIsImVsIiwiYW5pbWF0aW9ucyIsImFuaW1hdGlvbiIsIk9BbmltYXRpb24iLCJNb3pBbmltYXRpb24iLCJXZWJraXRBbmltYXRpb24iLCJ0Iiwic3R5bGUiLCJ1bmRlZmluZWQiLCJjcmVhdGVFbGVtZW50Iiwib25lIiwiQ3VzdG9tU2VsZWN0IiwiJGVsZW0iLCJzZWxmIiwiaW5pdCIsIiRpbml0RWxlbSIsImVhY2giLCJoYXNDbGFzcyIsInNlbGVjdFNlYXJjaCIsImRhdGEiLCJtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCIsIkluZmluaXR5Iiwic2VsZWN0MiIsInNlbGVjdE9uQmx1ciIsImRyb3Bkb3duQ3NzQ2xhc3MiLCJvbiIsImUiLCJmaW5kIiwiY29udGV4dCIsInZhbHVlIiwiY2xpY2siLCJ1cGRhdGUiLCIkdXBkYXRlRWxlbSIsImN1c3RvbUZpbGVJbnB1dCIsImkiLCJlbGVtIiwiYnV0dG9uV29yZCIsImNsYXNzTmFtZSIsIndyYXAiLCJwYXJlbnQiLCJwcmVwZW5kIiwiaHRtbCIsInByb21pc2UiLCJkb25lIiwibW91c2Vtb3ZlIiwiY3Vyc29yIiwiaW5wdXQiLCJ3cmFwcGVyIiwid3JhcHBlclgiLCJ3cmFwcGVyWSIsImlucHV0V2lkdGgiLCJpbnB1dEhlaWdodCIsImN1cnNvclgiLCJjdXJzb3JZIiwib2Zmc2V0IiwibGVmdCIsInRvcCIsIndpZHRoIiwiaGVpZ2h0IiwicGFnZVgiLCJwYWdlWSIsIm1vdmVJbnB1dFgiLCJtb3ZlSW5wdXRZIiwiY3NzIiwiZmlsZU5hbWUiLCJ2YWwiLCJuZXh0IiwicmVtb3ZlIiwicHJvcCIsImxlbmd0aCIsImZpbGVzIiwic3Vic3RyaW5nIiwibGFzdEluZGV4T2YiLCJzZWxlY3RlZEZpbGVOYW1lUGxhY2VtZW50Iiwic2libGluZ3MiLCJhZnRlciIsImN1c3RvbVNlbGVjdCIsImluZGV4IiwiZmllbGQiLCJ0cmltIiwiZXZlbnQiLCJsb2NhbGUiLCJQYXJzbGV5Iiwic2V0TG9jYWxlIiwib3B0aW9ucyIsInRyaWdnZXIiLCJ2YWxpZGF0aW9uVGhyZXNob2xkIiwiZXJyb3JzV3JhcHBlciIsImVycm9yVGVtcGxhdGUiLCJjbGFzc0hhbmRsZXIiLCJpbnN0YW5jZSIsIiRlbGVtZW50IiwidHlwZSIsIiRoYW5kbGVyIiwiZXJyb3JzQ29udGFpbmVyIiwiJGNvbnRhaW5lciIsImNsb3Nlc3QiLCJhZGRWYWxpZGF0b3IiLCJ2YWxpZGF0ZVN0cmluZyIsInRlc3QiLCJtZXNzYWdlcyIsInJ1IiwiZW4iLCJyZWdUZXN0IiwicmVnTWF0Y2giLCJtaW4iLCJhcmd1bWVudHMiLCJtYXgiLCJtaW5EYXRlIiwibWF4RGF0ZSIsInZhbHVlRGF0ZSIsInJlc3VsdCIsIm1hdGNoIiwiRGF0ZSIsIm1heFNpemUiLCJwYXJzbGV5SW5zdGFuY2UiLCJzaXplIiwicmVxdWlyZW1lbnRUeXBlIiwiZm9ybWF0cyIsImZpbGVFeHRlbnNpb24iLCJzcGxpdCIsInBvcCIsImZvcm1hdHNBcnIiLCJ2YWxpZCIsIiRibG9jayIsIiRsYXN0IiwiZWxlbWVudCIsInBhcnNsZXkiLCJpbnB1dG1hc2siLCJjbGVhck1hc2tPbkxvc3RGb2N1cyIsInNob3dNYXNrT25Ib3ZlciIsImRhdGVwaWNrZXIiLCJ1cGRhdGVTdmciLCIkdXNlRWxlbWVudCIsImhyZWYiLCJiYXNlVmFsIiwiZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zIiwiZGF0ZUZvcm1hdCIsInNob3dPdGhlck1vbnRocyIsIkRhdGVwaWNrZXIiLCJpdGVtT3B0aW9ucyIsIm9uU2VsZWN0IiwiY2hhbmdlIiwiRGF0ZXBpY2tlclJhbmdlIiwiZGF0ZXBpY2tlclJhbmdlIiwiZnJvbUl0ZW1PcHRpb25zIiwidG9JdGVtT3B0aW9ucyIsImRhdGVGcm9tIiwiZGF0ZVRvIiwiZ2V0RGF0ZSIsImlzVmFsaWQiLCJ2YWxpZGF0ZSIsImRhdGUiLCJwYXJzZURhdGUiLCJlcnJvciIsIlRhYlN3aXRjaGVyIiwidGFicyIsIm9wZW4iLCJ0YWJFbGVtIiwicHJldmVudERlZmF1bHQiLCJwYXJlbnRUYWJzIiwidG9nZ2xlQ2xhc3MiLCJ0YWJTd2l0Y2hlciIsIm9uT3V0c2lkZUNsaWNrSGlkZSIsInRhcmdldEVsZW0iLCJoaWRkZW5FbGVtIiwib3B0aW9uYWxDYiIsImJpbmQiLCJpcyIsInRhcmdldCIsInN0b3AiLCJmYWRlT3V0IiwidmlzaWJpbGl0eUNvbnRyb2wiLCJzZXR0aW5ncyIsInR5cGVzIiwic2V0VmlzaWJpbGl0eSIsInZpc2liaWxpdHlUeXBlIiwibGlzdCIsImRlbGF5IiwiZmFkZUluIiwiZGF0YVR5cGUiLCJ2aXNpYmlsaXR5TGlzdCIsIlNsaWRlciIsInNsaWRlciIsInN0ZXAiLCJ2YWx1ZXMiLCJyYW5nZSIsInNsaWRlIiwidWkiLCJjaGlsZHJlbiIsImFwcGVuZCIsIm9ubG9hZCIsIlBlcnNvbnMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsIm5vZGUiLCJhZGRFdmVudExpc3RlbmVyIiwiY3VycmVudCIsIm5leHRFbGVtZW50U2libGluZyIsInByZXZpb3VzRWxlbWVudFNpYmxpbmciLCJub3QiLCJoaWRlIiwiZXEiLCJtb2RhbENhbGwiLCJtb2RhbENsb3NlIiwiJHRoaXMiLCJtb2RhbElkIiwic2V0VGltZW91dCIsInRyYW5zZm9ybSIsIm1vZGFsUGFyZW50IiwicGFyZW50cyIsInN0b3BQcm9wYWdhdGlvbiIsImRvYyIsInNjIiwiZG4iLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwic2hvdyIsImRlZmluZSIsImFtZCIsImV4cG9ydHMiLCJtb2R1bGUiLCJyZXF1aXJlIiwialF1ZXJ5IiwiU2xpY2siLCJvIiwicyIsIm4iLCJkZWZhdWx0cyIsImFjY2Vzc2liaWxpdHkiLCJhZGFwdGl2ZUhlaWdodCIsImFwcGVuZEFycm93cyIsImFwcGVuZERvdHMiLCJhcnJvd3MiLCJhc05hdkZvciIsInByZXZBcnJvdyIsIm5leHRBcnJvdyIsImF1dG9wbGF5IiwiYXV0b3BsYXlTcGVlZCIsImNlbnRlck1vZGUiLCJjZW50ZXJQYWRkaW5nIiwiY3NzRWFzZSIsImN1c3RvbVBhZ2luZyIsInRleHQiLCJkb3RzIiwiZG90c0NsYXNzIiwiZHJhZ2dhYmxlIiwiZWFzaW5nIiwiZWRnZUZyaWN0aW9uIiwiZmFkZSIsImZvY3VzT25TZWxlY3QiLCJmb2N1c09uQ2hhbmdlIiwiaW5maW5pdGUiLCJpbml0aWFsU2xpZGUiLCJsYXp5TG9hZCIsIm1vYmlsZUZpcnN0IiwicGF1c2VPbkhvdmVyIiwicGF1c2VPbkZvY3VzIiwicGF1c2VPbkRvdHNIb3ZlciIsInJlc3BvbmRUbyIsInJlc3BvbnNpdmUiLCJyb3dzIiwicnRsIiwic2xpZGVzUGVyUm93Iiwic2xpZGVzVG9TaG93Iiwic2xpZGVzVG9TY3JvbGwiLCJzcGVlZCIsInN3aXBlIiwic3dpcGVUb1NsaWRlIiwidG91Y2hNb3ZlIiwidG91Y2hUaHJlc2hvbGQiLCJ1c2VDU1MiLCJ1c2VUcmFuc2Zvcm0iLCJ2YXJpYWJsZVdpZHRoIiwidmVydGljYWwiLCJ2ZXJ0aWNhbFN3aXBpbmciLCJ3YWl0Rm9yQW5pbWF0ZSIsInpJbmRleCIsImluaXRpYWxzIiwiYW5pbWF0aW5nIiwiZHJhZ2dpbmciLCJhdXRvUGxheVRpbWVyIiwiY3VycmVudERpcmVjdGlvbiIsImN1cnJlbnRMZWZ0IiwiY3VycmVudFNsaWRlIiwiZGlyZWN0aW9uIiwiJGRvdHMiLCJsaXN0V2lkdGgiLCJsaXN0SGVpZ2h0IiwibG9hZEluZGV4IiwiJG5leHRBcnJvdyIsIiRwcmV2QXJyb3ciLCJzY3JvbGxpbmciLCJzbGlkZUNvdW50Iiwic2xpZGVXaWR0aCIsIiRzbGlkZVRyYWNrIiwiJHNsaWRlcyIsInNsaWRpbmciLCJzbGlkZU9mZnNldCIsInN3aXBlTGVmdCIsInN3aXBpbmciLCIkbGlzdCIsInRvdWNoT2JqZWN0IiwidHJhbnNmb3Jtc0VuYWJsZWQiLCJ1bnNsaWNrZWQiLCJhY3RpdmVCcmVha3BvaW50IiwiYW5pbVR5cGUiLCJhbmltUHJvcCIsImJyZWFrcG9pbnRTZXR0aW5ncyIsImNzc1RyYW5zaXRpb25zIiwiZm9jdXNzZWQiLCJpbnRlcnJ1cHRlZCIsImhpZGRlbiIsInBhdXNlZCIsInBvc2l0aW9uUHJvcCIsInJvd0NvdW50Iiwic2hvdWxkQ2xpY2siLCIkc2xpZGVyIiwiJHNsaWRlc0NhY2hlIiwidHJhbnNmb3JtVHlwZSIsInRyYW5zaXRpb25UeXBlIiwidmlzaWJpbGl0eUNoYW5nZSIsIndpbmRvd1dpZHRoIiwid2luZG93VGltZXIiLCJvcmlnaW5hbFNldHRpbmdzIiwibW96SGlkZGVuIiwid2Via2l0SGlkZGVuIiwiYXV0b1BsYXkiLCJwcm94eSIsImF1dG9QbGF5Q2xlYXIiLCJhdXRvUGxheUl0ZXJhdG9yIiwiY2hhbmdlU2xpZGUiLCJjbGlja0hhbmRsZXIiLCJzZWxlY3RIYW5kbGVyIiwic2V0UG9zaXRpb24iLCJzd2lwZUhhbmRsZXIiLCJkcmFnSGFuZGxlciIsImtleUhhbmRsZXIiLCJpbnN0YW5jZVVpZCIsImh0bWxFeHByIiwicmVnaXN0ZXJCcmVha3BvaW50cyIsInByb3RvdHlwZSIsImFjdGl2YXRlQURBIiwidGFiaW5kZXgiLCJhZGRTbGlkZSIsInNsaWNrQWRkIiwidW5sb2FkIiwiYXBwZW5kVG8iLCJpbnNlcnRCZWZvcmUiLCJpbnNlcnRBZnRlciIsInByZXBlbmRUbyIsImRldGFjaCIsInJlaW5pdCIsImFuaW1hdGVIZWlnaHQiLCJvdXRlckhlaWdodCIsImFuaW1hdGVTbGlkZSIsImFuaW1TdGFydCIsImR1cmF0aW9uIiwiTWF0aCIsImNlaWwiLCJjb21wbGV0ZSIsImNhbGwiLCJhcHBseVRyYW5zaXRpb24iLCJkaXNhYmxlVHJhbnNpdGlvbiIsImdldE5hdlRhcmdldCIsInNsaWNrIiwic2xpZGVIYW5kbGVyIiwic2V0SW50ZXJ2YWwiLCJjbGVhckludGVydmFsIiwiYnVpbGRBcnJvd3MiLCJyZW1vdmVBdHRyIiwiYWRkIiwiYnVpbGREb3RzIiwiZ2V0RG90Q291bnQiLCJmaXJzdCIsImJ1aWxkT3V0Iiwid3JhcEFsbCIsInNldHVwSW5maW5pdGUiLCJ1cGRhdGVEb3RzIiwic2V0U2xpZGVDbGFzc2VzIiwiYnVpbGRSb3dzIiwiciIsImwiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50IiwiZCIsImEiLCJjIiwiZ2V0IiwiYXBwZW5kQ2hpbGQiLCJlbXB0eSIsImRpc3BsYXkiLCJjaGVja1Jlc3BvbnNpdmUiLCJpbm5lcldpZHRoIiwiaGFzT3duUHJvcGVydHkiLCJ1bnNsaWNrIiwicmVmcmVzaCIsImN1cnJlbnRUYXJnZXQiLCJtZXNzYWdlIiwiY2hlY2tOYXZpZ2FibGUiLCJnZXROYXZpZ2FibGVJbmRleGVzIiwiY2xlYW5VcEV2ZW50cyIsIm9mZiIsImludGVycnVwdCIsInZpc2liaWxpdHkiLCJjbGVhblVwU2xpZGVFdmVudHMiLCJvcmllbnRhdGlvbkNoYW5nZSIsInJlc2l6ZSIsImNsZWFuVXBSb3dzIiwic3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uIiwiZGVzdHJveSIsImZhZGVTbGlkZSIsIm9wYWNpdHkiLCJmYWRlU2xpZGVPdXQiLCJmaWx0ZXJTbGlkZXMiLCJzbGlja0ZpbHRlciIsImZpbHRlciIsImZvY3VzSGFuZGxlciIsImdldEN1cnJlbnQiLCJzbGlja0N1cnJlbnRTbGlkZSIsImdldExlZnQiLCJmbG9vciIsIm9mZnNldExlZnQiLCJvdXRlcldpZHRoIiwiZ2V0T3B0aW9uIiwic2xpY2tHZXRPcHRpb24iLCJwdXNoIiwiZ2V0U2xpY2siLCJnZXRTbGlkZUNvdW50IiwiYWJzIiwiZ29UbyIsInNsaWNrR29UbyIsInBhcnNlSW50Iiwic2V0UHJvcHMiLCJzdGFydExvYWQiLCJsb2FkU2xpZGVyIiwiaW5pdGlhbGl6ZUV2ZW50cyIsInVwZGF0ZUFycm93cyIsImluaXRBREEiLCJpbmRleE9mIiwicm9sZSIsImlkIiwiZW5kIiwiaW5pdEFycm93RXZlbnRzIiwiaW5pdERvdEV2ZW50cyIsImluaXRTbGlkZUV2ZW50cyIsImFjdGlvbiIsImluaXRVSSIsInRhZ05hbWUiLCJrZXlDb2RlIiwib25lcnJvciIsInNyYyIsInNsaWNlIiwicHJvZ3Jlc3NpdmVMYXp5TG9hZCIsInNsaWNrTmV4dCIsInBhdXNlIiwic2xpY2tQYXVzZSIsInBsYXkiLCJzbGlja1BsYXkiLCJwb3N0U2xpZGUiLCJmb2N1cyIsInByZXYiLCJzbGlja1ByZXYiLCJicmVha3BvaW50Iiwic3BsaWNlIiwic29ydCIsImNsZWFyVGltZW91dCIsIndpbmRvd0RlbGF5IiwicmVtb3ZlU2xpZGUiLCJzbGlja1JlbW92ZSIsInNldENTUyIsInNldERpbWVuc2lvbnMiLCJwYWRkaW5nIiwic2V0RmFkZSIsInBvc2l0aW9uIiwicmlnaHQiLCJzZXRIZWlnaHQiLCJzZXRPcHRpb24iLCJzbGlja1NldE9wdGlvbiIsImJvZHkiLCJXZWJraXRUcmFuc2l0aW9uIiwiTW96VHJhbnNpdGlvbiIsIm1zVHJhbnNpdGlvbiIsIk9UcmFuc2Zvcm0iLCJwZXJzcGVjdGl2ZVByb3BlcnR5Iiwid2Via2l0UGVyc3BlY3RpdmUiLCJNb3pUcmFuc2Zvcm0iLCJNb3pQZXJzcGVjdGl2ZSIsIndlYmtpdFRyYW5zZm9ybSIsIm1zVHJhbnNmb3JtIiwiY2xvbmUiLCJzd2lwZURpcmVjdGlvbiIsInN0YXJ0WCIsImN1clgiLCJzdGFydFkiLCJjdXJZIiwiYXRhbjIiLCJyb3VuZCIsIlBJIiwic3dpcGVFbmQiLCJzd2lwZUxlbmd0aCIsImVkZ2VIaXQiLCJtaW5Td2lwZSIsImZpbmdlckNvdW50Iiwib3JpZ2luYWxFdmVudCIsInRvdWNoZXMiLCJzd2lwZVN0YXJ0Iiwic3dpcGVNb3ZlIiwiY2xpZW50WCIsImNsaWVudFkiLCJzcXJ0IiwicG93IiwidW5maWx0ZXJTbGlkZXMiLCJzbGlja1VuZmlsdGVyIiwiQXJyYXkiLCJhcHBseSJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBQSxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZQyxLQUFaLENBQWtCLFlBQVc7QUFDekI7OztBQUdBLE1BQUlDLGFBQWEsR0FBRztBQUNoQjtBQUNBQyxJQUFBQSxJQUFJLEVBQUcsR0FGUztBQUloQjtBQUNBQyxJQUFBQSxhQUFhLEVBQUUsSUFMQztBQU1oQkMsSUFBQUEsYUFBYSxFQUFFLElBTkM7QUFPaEJDLElBQUFBLFdBQVcsRUFBSSxJQVBDO0FBUWhCQyxJQUFBQSxZQUFZLEVBQUksSUFSQTtBQVNoQkMsSUFBQUEsVUFBVSxFQUFNLEdBVEE7QUFVaEJDLElBQUFBLFlBQVksRUFBSSxHQVZBO0FBV2hCQyxJQUFBQSxVQUFVLEVBQU0sR0FYQTtBQWFoQjtBQUNBQyxJQUFBQSxnQkFBZ0IsRUFBRSxHQWRGO0FBZ0JoQjtBQUNBQyxJQUFBQSxrQkFBa0IsRUFBRSxJQWpCSjtBQW1CaEI7QUFDQUMsSUFBQUEsT0FBTyxFQUFFZCxDQUFDLENBQUNlLE9BQUYsQ0FBVUMsTUFwQkg7QUFzQmhCQyxJQUFBQSxJQUFJLEVBQUVqQixDQUFDLENBQUMsTUFBRCxDQUFELENBQVVrQixJQUFWLENBQWUsTUFBZjtBQXRCVSxHQUFwQixDQUp5QixDQTZCekI7QUFDQTs7QUFDQSxNQUFNQyxX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XHJcbiAgICAvKipcclxuICAgICAqINCT0LvQvtCx0LDQu9GM0L3Ri9C1INC/0LXRgNC10LzQtdC90L3Ri9C1LCDQutC+0YLQvtGA0YvQtSDQuNGB0L/QvtC70YzQt9GD0Y7RgtGB0Y8g0LzQvdC+0LPQvtC60YDQsNGC0L3QvlxyXG4gICAgICovXHJcbiAgICBsZXQgZ2xvYmFsT3B0aW9ucyA9IHtcclxuICAgICAgICAvLyDQktGA0LXQvNGPINC00LvRjyDQsNC90LjQvNCw0YbQuNC5XHJcbiAgICAgICAgdGltZTogIDIwMCxcclxuXHJcbiAgICAgICAgLy8g0JrQvtC90YLRgNC+0LvRjNC90YvQtSDRgtC+0YfQutC4INCw0LTQsNC/0YLQuNCy0LBcclxuICAgICAgICBkZXNrdG9wWGxTaXplOiAxOTIwLFxyXG4gICAgICAgIGRlc2t0b3BMZ1NpemU6IDE2MDAsXHJcbiAgICAgICAgZGVza3RvcFNpemU6ICAgMTI4MCxcclxuICAgICAgICB0YWJsZXRMZ1NpemU6ICAgMTAyNCxcclxuICAgICAgICB0YWJsZXRTaXplOiAgICAgNzY4LFxyXG4gICAgICAgIG1vYmlsZUxnU2l6ZTogICA2NDAsXHJcbiAgICAgICAgbW9iaWxlU2l6ZTogICAgIDQ4MCxcclxuXHJcbiAgICAgICAgLy8g0KLQvtGH0LrQsCDQv9C10YDQtdGF0L7QtNCwINC/0L7Qv9Cw0L/QvtCyINC90LAg0YTRg9C70YHQutGA0LjQvVxyXG4gICAgICAgIHBvcHVwc0JyZWFrcG9pbnQ6IDc2OCxcclxuXHJcbiAgICAgICAgLy8g0JLRgNC10LzRjyDQtNC+INGB0L7QutGA0YvRgtC40Y8g0YTQuNC60YHQuNGA0L7QstCw0L3QvdGL0YUg0L/QvtC/0LDQv9C+0LJcclxuICAgICAgICBwb3B1cHNGaXhlZFRpbWVvdXQ6IDUwMDAsXHJcblxyXG4gICAgICAgIC8vINCf0YDQvtCy0LXRgNC60LAgdG91Y2gg0YPRgdGC0YDQvtC50YHRgtCyXHJcbiAgICAgICAgaXNUb3VjaDogJC5icm93c2VyLm1vYmlsZSxcclxuXHJcbiAgICAgICAgbGFuZzogJCgnaHRtbCcpLmF0dHIoJ2xhbmcnKVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyDQkdGA0LXQudC60L/QvtC40L3RgtGLINCw0LTQsNC/0YLQuNCy0LBcclxuICAgIC8vIEBleGFtcGxlIGlmIChnbG9iYWxPcHRpb25zLmJyZWFrcG9pbnRUYWJsZXQubWF0Y2hlcykge30gZWxzZSB7fVxyXG4gICAgY29uc3QgYnJlYWtwb2ludHMgPSB7XHJcbiAgICAgICAgYnJlYWtwb2ludERlc2t0b3BYbDogd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7Z2xvYmFsT3B0aW9ucy5kZXNrdG9wWGxTaXplIC0gMX1weClgKSxcclxuICAgICAgICBicmVha3BvaW50RGVza3RvcExnOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLmRlc2t0b3BMZ1NpemUgLSAxfXB4KWApLFxyXG4gICAgICAgIGJyZWFrcG9pbnREZXNrdG9wOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLmRlc2t0b3BTaXplIC0gMX1weClgKSxcclxuICAgICAgICBicmVha3BvaW50VGFibGV0TGc6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMudGFibGV0TGdTaXplIC0gMX1weClgKSxcclxuICAgICAgICBicmVha3BvaW50VGFibGV0OiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLnRhYmxldFNpemUgLSAxfXB4KWApLFxyXG4gICAgICAgIGJyZWFrcG9pbnRNb2JpbGVMZ1NpemU6IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke2dsb2JhbE9wdGlvbnMubW9iaWxlTGdTaXplIC0gMX1weClgKSxcclxuICAgICAgICBicmVha3BvaW50TW9iaWxlOiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtnbG9iYWxPcHRpb25zLm1vYmlsZVNpemUgLSAxfXB4KWApXHJcbiAgICB9O1xyXG5cclxuICAgICQuZXh0ZW5kKHRydWUsIGdsb2JhbE9wdGlvbnMsIGJyZWFrcG9pbnRzKTtcclxuXHJcblxyXG5cclxuXHJcbiAgICAkKHdpbmRvdykubG9hZCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKGdsb2JhbE9wdGlvbnMuaXNUb3VjaCkge1xyXG4gICAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3RvdWNoJykucmVtb3ZlQ2xhc3MoJ25vLXRvdWNoJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCduby10b3VjaCcpLnJlbW92ZUNsYXNzKCd0b3VjaCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaWYgKCQoJ3RleHRhcmVhJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIC8vICAgICBhdXRvc2l6ZSgkKCd0ZXh0YXJlYScpKTtcclxuICAgICAgICAvLyB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9C+0LTQutC70Y7Rh9C10L3QuNC1IGpzIHBhcnRpYWxzXHJcbiAgICAgKi9cclxuICAgIC8qIGZvcm1fc3R5bGUuanMg0LTQvtC70LbQtdC9INCx0YvRgtGMINCy0YvQv9C+0LvQvdC10L0g0L/QtdGA0LXQtCBmb3JtX3ZhbGlkYXRpb24uanMgKi9cclxuICAgIC8qKlxyXG4gICAgICog0KDQsNGB0YjQuNGA0LXQvdC40LUgYW5pbWF0ZS5jc3NcclxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gYW5pbWF0aW9uTmFtZSDQvdCw0LfQstCw0L3QuNC1INCw0L3QuNC80LDRhtC40LhcclxuICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFjayDRhNGD0L3QutGG0LjRjywg0LrQvtGC0L7RgNCw0Y8g0L7RgtGA0LDQsdC+0YLQsNC10YIg0L/QvtGB0LvQtSDQt9Cw0LLQtdGA0YjQtdC90LjRjyDQsNC90LjQvNCw0YbQuNC4XHJcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9INC+0LHRitC10LrRgiDQsNC90LjQvNCw0YbQuNC4XHJcbiAgICAgKiBcclxuICAgICAqIEBzZWUgIGh0dHBzOi8vZGFuZWRlbi5naXRodWIuaW8vYW5pbWF0ZS5jc3MvXHJcbiAgICAgKiBcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiAkKCcjeW91ckVsZW1lbnQnKS5hbmltYXRlQ3NzKCdib3VuY2UnKTtcclxuICAgICAqIFxyXG4gICAgICogJCgnI3lvdXJFbGVtZW50JykuYW5pbWF0ZUNzcygnYm91bmNlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgKiAgICAgLy8g0JTQtdC70LDQtdC8INGH0YLQvi3RgtC+INC/0L7RgdC70LUg0LfQsNCy0LXRgNGI0LXQvdC40Y8g0LDQvdC40LzQsNGG0LjQuFxyXG4gICAgICogfSk7XHJcbiAgICAgKi9cclxuICAgICQuZm4uZXh0ZW5kKHtcclxuICAgICAgICBhbmltYXRlQ3NzOiBmdW5jdGlvbihhbmltYXRpb25OYW1lLCBjYWxsYmFjaykge1xyXG4gICAgICAgICAgICBsZXQgYW5pbWF0aW9uRW5kID0gKGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYW5pbWF0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb246ICdhbmltYXRpb25lbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgIE9BbmltYXRpb246ICdvQW5pbWF0aW9uRW5kJyxcclxuICAgICAgICAgICAgICAgICAgICBNb3pBbmltYXRpb246ICdtb3pBbmltYXRpb25FbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgIFdlYmtpdEFuaW1hdGlvbjogJ3dlYmtpdEFuaW1hdGlvbkVuZCcsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHQgaW4gYW5pbWF0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbC5zdHlsZVt0XSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhbmltYXRpb25zW3RdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hZGRDbGFzcygnYW5pbWF0ZWQgJyArIGFuaW1hdGlvbk5hbWUpLm9uZShhbmltYXRpb25FbmQsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnYW5pbWF0ZWQgJyArIGFuaW1hdGlvbk5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAvKipcclxuICAgICAqINCh0YLQuNC70LjQt9GD0LXRgiDRgdC10LvQtdC60YLRiyDRgSDQv9C+0LzQvtGJ0YzRjiDQv9C70LDQs9C40L3QsCBzZWxlY3QyXHJcbiAgICAgKiBodHRwczovL3NlbGVjdDIuZ2l0aHViLmlvXHJcbiAgICAgKi9cclxuICAgIGxldCBDdXN0b21TZWxlY3QgPSBmdW5jdGlvbigkZWxlbSkge1xyXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5pbml0ID0gZnVuY3Rpb24oJGluaXRFbGVtKSB7XHJcbiAgICAgICAgICAgICRpbml0RWxlbS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdFNlYXJjaCA9ICQodGhpcykuZGF0YSgnc2VhcmNoJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0U2VhcmNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoID0gMTsgLy8g0L/QvtC60LDQt9GL0LLQsNC10Lwg0L/QvtC70LUg0L/QvtC40YHQutCwXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2ggPSBJbmZpbml0eTsgLy8g0L3QtSDQv9C+0LrQsNC30YvQstCw0LXQvCDQv9C+0LvQtSDQv9C+0LjRgdC60LBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuc2VsZWN0Mih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0T25CbHVyOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkcm9wZG93bkNzc0NsYXNzOiAnZXJyb3InXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykub24oJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g0L3Rg9C20L3QviDQtNC70Y8g0LLRi9C70LjQtNCw0YbQuNC4INC90LAg0LvQtdGC0YNcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKGBvcHRpb25bdmFsdWU9XCIkeyQodGhpcykuY29udGV4dC52YWx1ZX1cIl1gKS5jbGljaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZSA9IGZ1bmN0aW9uKCR1cGRhdGVFbGVtKSB7XHJcbiAgICAgICAgICAgICR1cGRhdGVFbGVtLnNlbGVjdDIoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgc2VsZi5pbml0KCR1cGRhdGVFbGVtKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmluaXQoJGVsZW0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0YLQuNC70LjQt9GD0LXRgiBmaWxlIGlucHV0XHJcbiAgICAgKiBodHRwOi8vZ3JlZ3Bpa2UubmV0L2RlbW9zL2Jvb3RzdHJhcC1maWxlLWlucHV0L2RlbW8uaHRtbFxyXG4gICAgICovXHJcbiAgICAkLmZuLmN1c3RvbUZpbGVJbnB1dCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oaSwgZWxlbSkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgJGVsZW0gPSAkKGVsZW0pO1xyXG5cclxuICAgICAgICAgICAgLy8gTWF5YmUgc29tZSBmaWVsZHMgZG9uJ3QgbmVlZCB0byBiZSBzdGFuZGFyZGl6ZWQuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgJGVsZW0uYXR0cignZGF0YS1iZmktZGlzYWJsZWQnKSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gU2V0IHRoZSB3b3JkIHRvIGJlIGRpc3BsYXllZCBvbiB0aGUgYnV0dG9uXHJcbiAgICAgICAgICAgIGxldCBidXR0b25Xb3JkID0gJ0Jyb3dzZSc7XHJcbiAgICAgICAgICAgIGxldCBjbGFzc05hbWUgPSAnJztcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgJGVsZW0uYXR0cigndGl0bGUnKSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbldvcmQgPSAkZWxlbS5hdHRyKCd0aXRsZScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoISEkZWxlbS5hdHRyKCdjbGFzcycpKSB7XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgPSAnICcgKyAkZWxlbS5hdHRyKCdjbGFzcycpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBOb3cgd2UncmUgZ29pbmcgdG8gd3JhcCB0aGF0IGlucHV0IGZpZWxkIHdpdGggYSBidXR0b24uXHJcbiAgICAgICAgICAgIC8vIFRoZSBpbnB1dCB3aWxsIGFjdHVhbGx5IHN0aWxsIGJlIHRoZXJlLCBpdCB3aWxsIGp1c3QgYmUgZmxvYXQgYWJvdmUgYW5kIHRyYW5zcGFyZW50IChkb25lIHdpdGggdGhlIENTUykuXHJcbiAgICAgICAgICAgICRlbGVtLndyYXAoYDxkaXYgY2xhc3M9XCJjdXN0b20tZmlsZVwiPjxhIGNsYXNzPVwiYnRuICR7Y2xhc3NOYW1lfVwiPjwvYT48L2Rpdj5gKS5wYXJlbnQoKS5wcmVwZW5kKCQoJzxzcGFuPjwvc3Bhbj4nKS5odG1sKGJ1dHRvbldvcmQpKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvLyBBZnRlciB3ZSBoYXZlIGZvdW5kIGFsbCBvZiB0aGUgZmlsZSBpbnB1dHMgbGV0J3MgYXBwbHkgYSBsaXN0ZW5lciBmb3IgdHJhY2tpbmcgdGhlIG1vdXNlIG1vdmVtZW50LlxyXG4gICAgICAgIC8vIFRoaXMgaXMgaW1wb3J0YW50IGJlY2F1c2UgdGhlIGluIG9yZGVyIHRvIGdpdmUgdGhlIGlsbHVzaW9uIHRoYXQgdGhpcyBpcyBhIGJ1dHRvbiBpbiBGRiB3ZSBhY3R1YWxseSBuZWVkIHRvIG1vdmUgdGhlIGJ1dHRvbiBmcm9tIHRoZSBmaWxlIGlucHV0IHVuZGVyIHRoZSBjdXJzb3IuIFVnaC5cclxuICAgICAgICAucHJvbWlzZSgpLmRvbmUoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBBcyB0aGUgY3Vyc29yIG1vdmVzIG92ZXIgb3VyIG5ldyBidXR0b24gd2UgbmVlZCB0byBhZGp1c3QgdGhlIHBvc2l0aW9uIG9mIHRoZSBpbnZpc2libGUgZmlsZSBpbnB1dCBCcm93c2UgYnV0dG9uIHRvIGJlIHVuZGVyIHRoZSBjdXJzb3IuXHJcbiAgICAgICAgICAgIC8vIFRoaXMgZ2l2ZXMgdXMgdGhlIHBvaW50ZXIgY3Vyc29yIHRoYXQgRkYgZGVuaWVzIHVzXHJcbiAgICAgICAgICAgICQoJy5jdXN0b20tZmlsZScpLm1vdXNlbW92ZShmdW5jdGlvbihjdXJzb3IpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXQsIHdyYXBwZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlclgsIHdyYXBwZXJZLFxyXG4gICAgICAgICAgICAgICAgICAgIGlucHV0V2lkdGgsIGlucHV0SGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvclgsIGN1cnNvclk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVGhpcyB3cmFwcGVyIGVsZW1lbnQgKHRoZSBidXR0b24gc3Vycm91bmQgdGhpcyBmaWxlIGlucHV0KVxyXG4gICAgICAgICAgICAgICAgd3JhcHBlciA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAvLyBUaGUgaW52aXNpYmxlIGZpbGUgaW5wdXQgZWxlbWVudFxyXG4gICAgICAgICAgICAgICAgaW5wdXQgPSB3cmFwcGVyLmZpbmQoJ2lucHV0Jyk7XHJcbiAgICAgICAgICAgICAgICAvLyBUaGUgbGVmdC1tb3N0IHBvc2l0aW9uIG9mIHRoZSB3cmFwcGVyXHJcbiAgICAgICAgICAgICAgICB3cmFwcGVyWCA9IHdyYXBwZXIub2Zmc2V0KCkubGVmdDtcclxuICAgICAgICAgICAgICAgIC8vIFRoZSB0b3AtbW9zdCBwb3NpdGlvbiBvZiB0aGUgd3JhcHBlclxyXG4gICAgICAgICAgICAgICAgd3JhcHBlclkgPSB3cmFwcGVyLm9mZnNldCgpLnRvcDtcclxuICAgICAgICAgICAgICAgIC8vIFRoZSB3aXRoIG9mIHRoZSBicm93c2VycyBpbnB1dCBmaWVsZFxyXG4gICAgICAgICAgICAgICAgaW5wdXRXaWR0aCA9IGlucHV0LndpZHRoKCk7XHJcbiAgICAgICAgICAgICAgICAvLyBUaGUgaGVpZ2h0IG9mIHRoZSBicm93c2VycyBpbnB1dCBmaWVsZFxyXG4gICAgICAgICAgICAgICAgaW5wdXRIZWlnaHQgPSBpbnB1dC5oZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgIC8vVGhlIHBvc2l0aW9uIG9mIHRoZSBjdXJzb3IgaW4gdGhlIHdyYXBwZXJcclxuICAgICAgICAgICAgICAgIGN1cnNvclggPSBjdXJzb3IucGFnZVg7XHJcbiAgICAgICAgICAgICAgICBjdXJzb3JZID0gY3Vyc29yLnBhZ2VZO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vVGhlIHBvc2l0aW9ucyB3ZSBhcmUgdG8gbW92ZSB0aGUgaW52aXNpYmxlIGZpbGUgaW5wdXRcclxuICAgICAgICAgICAgICAgIC8vIFRoZSAyMCBhdCB0aGUgZW5kIGlzIGFuIGFyYml0cmFyeSBudW1iZXIgb2YgcGl4ZWxzIHRoYXQgd2UgY2FuIHNoaWZ0IHRoZSBpbnB1dCBzdWNoIHRoYXQgY3Vyc29yIGlzIG5vdCBwb2ludGluZyBhdCB0aGUgZW5kIG9mIHRoZSBCcm93c2UgYnV0dG9uIGJ1dCBzb21ld2hlcmUgbmVhcmVyIHRoZSBtaWRkbGVcclxuICAgICAgICAgICAgICAgIG1vdmVJbnB1dFggPSBjdXJzb3JYIC0gd3JhcHBlclggLSBpbnB1dFdpZHRoICsgMjA7XHJcbiAgICAgICAgICAgICAgICAvLyBTbGlkZXMgdGhlIGludmlzaWJsZSBpbnB1dCBCcm93c2UgYnV0dG9uIHRvIGJlIHBvc2l0aW9uZWQgbWlkZGxlIHVuZGVyIHRoZSBjdXJzb3JcclxuICAgICAgICAgICAgICAgIG1vdmVJbnB1dFkgPSBjdXJzb3JZIC0gd3JhcHBlclkgLSAoaW5wdXRIZWlnaHQgLyAyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBcHBseSB0aGUgcG9zaXRpb25pbmcgc3R5bGVzIHRvIGFjdHVhbGx5IG1vdmUgdGhlIGludmlzaWJsZSBmaWxlIGlucHV0XHJcbiAgICAgICAgICAgICAgICBpbnB1dC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IG1vdmVJbnB1dFgsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiBtb3ZlSW5wdXRZXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkKCdib2R5Jykub24oJ2NoYW5nZScsICcuY3VzdG9tLWZpbGUgaW5wdXRbdHlwZT1maWxlXScsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBmaWxlTmFtZTtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lID0gJCh0aGlzKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgYW55IHByZXZpb3VzIGZpbGUgbmFtZXNcclxuICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkubmV4dCgnLmN1c3RvbS1maWxlX19uYW1lJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoISEkKHRoaXMpLnByb3AoJ2ZpbGVzJykgJiYgJCh0aGlzKS5wcm9wKCdmaWxlcycpLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZSA9ICQodGhpcylbMF0uZmlsZXMubGVuZ3RoICsgJyBmaWxlcyc7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lID0gZmlsZU5hbWUuc3Vic3RyaW5nKGZpbGVOYW1lLmxhc3RJbmRleE9mKCdcXFxcJykgKyAxLCBmaWxlTmFtZS5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIERvbid0IHRyeSB0byBzaG93IHRoZSBuYW1lIGlmIHRoZXJlIGlzIG5vbmVcclxuICAgICAgICAgICAgICAgIGlmICghZmlsZU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkRmlsZU5hbWVQbGFjZW1lbnQgPSAkKHRoaXMpLmRhdGEoJ2ZpbGVuYW1lLXBsYWNlbWVudCcpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkRmlsZU5hbWVQbGFjZW1lbnQgPT09ICdpbnNpZGUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gUHJpbnQgdGhlIGZpbGVOYW1lIGluc2lkZVxyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuc2libGluZ3MoJ3NwYW4nKS5odG1sKGZpbGVOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ3RpdGxlJywgZmlsZU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBQcmludCB0aGUgZmlsZU5hbWUgYXNpZGUgKHJpZ2h0IGFmdGVyIHRoZSB0aGUgYnV0dG9uKVxyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkuYWZ0ZXIoYDxzcGFuIGNsYXNzPVwiY3VzdG9tLWZpbGVfX25hbWVcIj4ke2ZpbGVOYW1lfSA8L3NwYW4+YCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgICQoJ2lucHV0W3R5cGU9XCJmaWxlXCJdJykuY3VzdG9tRmlsZUlucHV0KCk7XHJcbiAgICAvLyAkKCdzZWxlY3QnKS5jdXN0b21TZWxlY3QoKTtcclxuICAgIHZhciBjdXN0b21TZWxlY3QgPSBuZXcgQ3VzdG9tU2VsZWN0KCQoJ3NlbGVjdCcpKTtcclxuXHJcbiAgICBpZiAoJCgnLmpzLWxhYmVsLWFuaW1hdGlvbicpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQkNC90LjQvNCw0YbQuNGPINGN0LvQtdC80LXQvdGC0LAgbGFiZWwg0L/RgNC4INGE0L7QutGD0YHQtSDQv9C+0LvQtdC5INGE0L7RgNC80YtcclxuICAgICAgICAgKi9cclxuICAgICAgICAkKCcuanMtbGFiZWwtYW5pbWF0aW9uJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcclxuICAgICAgICAgICAgY29uc3QgZmllbGQgPSAkKGVsKS5maW5kKCdpbnB1dCwgdGV4dGFyZWEnKTtcclxuXHJcbiAgICAgICAgICAgIGlmICgkKGZpZWxkKS52YWwoKS50cmltKCkgIT0gJycpIHtcclxuICAgICAgICAgICAgICAgICQoZWwpLmFkZENsYXNzKCdpcy1maWxsZWQnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJChmaWVsZCkub24oJ2ZvY3VzJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICQoZWwpLmFkZENsYXNzKCdpcy1maWxsZWQnKTtcclxuICAgICAgICAgICAgfSkub24oJ2JsdXInLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykudmFsKCkudHJpbSgpID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZWwpLnJlbW92ZUNsYXNzKCdpcy1maWxsZWQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxvY2FsZSA9IGdsb2JhbE9wdGlvbnMubGFuZyA9PSAncnUtUlUnID8gJ3J1JyA6ICdlbic7XHJcblxyXG4gICAgUGFyc2xleS5zZXRMb2NhbGUobG9jYWxlKTtcclxuXHJcbiAgICAvKiDQndCw0YHRgtGA0L7QudC60LggUGFyc2xleSAqL1xyXG4gICAgJC5leHRlbmQoUGFyc2xleS5vcHRpb25zLCB7XHJcbiAgICAgICAgdHJpZ2dlcjogJ2JsdXIgY2hhbmdlJywgLy8gY2hhbmdlINC90YPQttC10L0g0LTQu9GPIHNlbGVjdCfQsFxyXG4gICAgICAgIHZhbGlkYXRpb25UaHJlc2hvbGQ6ICcwJyxcclxuICAgICAgICBlcnJvcnNXcmFwcGVyOiAnPGRpdj48L2Rpdj4nLFxyXG4gICAgICAgIGVycm9yVGVtcGxhdGU6ICc8cCBjbGFzcz1cInBhcnNsZXktZXJyb3ItbWVzc2FnZVwiPjwvcD4nLFxyXG4gICAgICAgIGNsYXNzSGFuZGxlcjogZnVuY3Rpb24oaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgY29uc3QgJGVsZW1lbnQgPSBpbnN0YW5jZS4kZWxlbWVudDtcclxuICAgICAgICAgICAgbGV0IHR5cGUgPSAkZWxlbWVudC5hdHRyKCd0eXBlJyksXHJcbiAgICAgICAgICAgICAgICAkaGFuZGxlcjtcclxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gJ2NoZWNrYm94JyB8fCB0eXBlID09ICdyYWRpbycpIHtcclxuICAgICAgICAgICAgICAgICRoYW5kbGVyID0gJGVsZW1lbnQ7IC8vINGC0L4g0LXRgdGC0Ywg0L3QuNGH0LXQs9C+INC90LUg0LLRi9C00LXQu9GP0LXQvCAoaW5wdXQg0YHQutGA0YvRgiksINC40L3QsNGH0LUg0LLRi9C00LXQu9GP0LXRgiDRgNC+0LTQuNGC0LXQu9GM0YHQutC40Lkg0LHQu9C+0LpcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICgkZWxlbWVudC5oYXNDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpKSB7XHJcbiAgICAgICAgICAgICAgICAkaGFuZGxlciA9ICQoJy5zZWxlY3QyLXNlbGVjdGlvbi0tc2luZ2xlJywgJGVsZW1lbnQubmV4dCgnLnNlbGVjdDInKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkaGFuZGxlcjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVycm9yc0NvbnRhaW5lcjogZnVuY3Rpb24oaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgY29uc3QgJGVsZW1lbnQgPSBpbnN0YW5jZS4kZWxlbWVudDtcclxuICAgICAgICAgICAgbGV0IHR5cGUgPSAkZWxlbWVudC5hdHRyKCd0eXBlJyksXHJcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gJ2NoZWNrYm94JyB8fCB0eXBlID09ICdyYWRpbycpIHtcclxuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkKGBbbmFtZT1cIiR7JGVsZW1lbnQuYXR0cignbmFtZScpfVwiXTpsYXN0ICsgbGFiZWxgKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykpIHtcclxuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkZWxlbWVudC5uZXh0KCcuc2VsZWN0MicpLm5leHQoJy5lcnJvcnMtcGxhY2VtZW50Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PSAnZmlsZScpIHtcclxuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkZWxlbWVudC5jbG9zZXN0KCcuY3VzdG9tLWZpbGUnKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCRlbGVtZW50LmNsb3Nlc3QoJy5qcy1kYXRlcGlja2VyLXJhbmdlJykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKS5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCRlbGVtZW50LmF0dHIoJ25hbWUnKSA9PSAnaXNfcmVjYXB0Y2hhX3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJGVsZW1lbnQucGFyZW50KCkubmV4dCgnLmctcmVjYXB0Y2hhJykubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRjb250YWluZXI7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0JrQsNGB0YLQvtC80L3Ri9C1INCy0LDQu9C40LTQsNGC0L7RgNGLXHJcblxyXG4gICAgLy8g0KLQvtC70YzQutC+INGA0YPRgdGB0LrQuNC1INCx0YPQutCy0YssINGC0LjRgNC1LCDQv9GA0L7QsdC10LvRi1xyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ25hbWVSdScsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC9eW9CwLdGP0ZFcXC0gXSokL2kudGVzdCh2YWx1ZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70Ysg0JAt0K8sINCwLdGPLCBcIiBcIiwgXCItXCInLFxyXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyDQkC3Qrywg0LAt0Y8sIFwiIFwiLCBcIi1cIidcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQotC+0LvRjNC60L4g0LvQsNGC0LjQvdGB0LrQuNC1INCx0YPQutCy0YssINGC0LjRgNC1LCDQv9GA0L7QsdC10LvRi1xyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ25hbWVFbicsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC9eW2EtelxcLSBdKiQvaS50ZXN0KHZhbHVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAnQ9C40LzQstC+0LvRiyBBLVosIGEteiwgXCIgXCIsIFwiLVwiJyxcclxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosIFwiIFwiLCBcIi1cIidcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQotC+0LvRjNC60L4g0LvQsNGC0LjQvdGB0LrQuNC1INC4INGA0YPRgdGB0LrQuNC1INCx0YPQutCy0YssINGC0LjRgNC1LCDQv9GA0L7QsdC10LvRi1xyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ25hbWUnLCB7XHJcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAvXlvQsC3Rj9GRYS16XFwtIF0qJC9pLnRlc3QodmFsdWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgcnU6ICdD0LjQvNCy0L7Qu9GLIEEtWiwgYS16LCDQkC3Qrywg0LAt0Y8sIFwiIFwiLCBcIi1cIicsXHJcbiAgICAgICAgICAgIGVuOiAnT25seSBzaW1ib2xzIEEtWiwgYS16LCDQkC3Qrywg0LAt0Y8sIFwiIFwiLCBcIi1cIidcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQotC+0LvRjNC60L4g0YbQuNGE0YDRiyDQuCDRgNGD0YHRgdC60LjQtSDQsdGD0LrQstGLXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbnVtTGV0dGVyUnUnLCB7XHJcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAvXlswLTnQsC3Rj9GRXSokL2kudGVzdCh2YWx1ZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70Ysg0JAt0K8sINCwLdGPLCAwLTknLFxyXG4gICAgICAgICAgICBlbjogJ09ubHkgc2ltYm9scyDQkC3Qrywg0LAt0Y8sIDAtOSdcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQotC+0LvRjNC60L4g0YbQuNGE0YDRiywg0LvQsNGC0LjQvdGB0LrQuNC1INC4INGA0YPRgdGB0LrQuNC1INCx0YPQutCy0YtcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdudW1MZXR0ZXInLCB7XHJcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAvXlvQsC3Rj9GRYS16MC05XSokL2kudGVzdCh2YWx1ZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgMC05JyxcclxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgQS1aLCBhLXosINCQLdCvLCDQsC3RjywgMC05J1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCi0LXQu9C10YTQvtC90L3Ri9C5INC90L7QvNC10YBcclxuICAgIFBhcnNsZXkuYWRkVmFsaWRhdG9yKCdwaG9uZScsIHtcclxuICAgICAgICB2YWxpZGF0ZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC9eWy0rMC05KCkgXSokL2kudGVzdCh2YWx1ZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBydTogJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDRgtC10LvQtdGE0L7QvdC90YvQuSDQvdC+0LzQtdGAJyxcclxuICAgICAgICAgICAgZW46ICdJbmNvcnJlY3QgcGhvbmUgbnVtYmVyJ1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCi0L7Qu9GM0LrQviDRhtC40YTRgNGLXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignbnVtYmVyJywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gL15bMC05XSokL2kudGVzdCh2YWx1ZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBydTogJ0PQuNC80LLQvtC70YsgMC05JyxcclxuICAgICAgICAgICAgZW46ICdPbmx5IHNpbWJvbHMgMC05J1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCf0L7Rh9GC0LAg0LHQtdC3INC60LjRgNC40LvQu9C40YbRi1xyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ2VtYWlsJywge1xyXG4gICAgICAgIHZhbGlkYXRlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gL14oW0EtWmEtetCQLdCv0LAt0Y8wLTlcXC1dKFxcLnxffC0pezAsMX0pK1tBLVphLXrQkC3Qr9CwLdGPMC05XFwtXVxcQChbQS1aYS160JAt0K/QsC3RjzAtOVxcLV0pKygoXFwuKXswLDF9W0EtWmEtetCQLdCv0LAt0Y8wLTlcXC1dKXsxLH1cXC5bYS160LAt0Y8wLTlcXC1dezIsfSQvLnRlc3QodmFsdWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgcnU6ICfQndC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0L/QvtGH0YLQvtCy0YvQuSDQsNC00YDQtdGBJyxcclxuICAgICAgICAgICAgZW46ICdJbmNvcnJlY3QgZW1haWwgYWRkcmVzcydcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQpNC+0YDQvNCw0YIg0LTQsNGC0YsgREQuTU0uWVlZWVxyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ2RhdGUnLCB7XHJcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGxldCByZWdUZXN0ID0gL14oPzooPzozMShcXC4pKD86MD9bMTM1NzhdfDFbMDJdKSlcXDF8KD86KD86Mjl8MzApKFxcLikoPzowP1sxLDMtOV18MVswLTJdKVxcMikpKD86KD86MVs2LTldfFsyLTldXFxkKT9cXGR7Mn0pJHxeKD86MjkoXFwuKTA/MlxcMyg/Oig/Oig/OjFbNi05XXxbMi05XVxcZCk/KD86MFs0OF18WzI0NjhdWzA0OF18WzEzNTc5XVsyNl0pfCg/Oig/OjE2fFsyNDY4XVswNDhdfFszNTc5XVsyNl0pMDApKSkpJHxeKD86MD9bMS05XXwxXFxkfDJbMC04XSkoXFwuKSg/Oig/OjA/WzEtOV0pfCg/OjFbMC0yXSkpXFw0KD86KD86MVs2LTldfFsyLTldXFxkKT9cXGR7NH0pJC8sXHJcbiAgICAgICAgICAgICAgICByZWdNYXRjaCA9IC8oXFxkezEsMn0pXFwuKFxcZHsxLDJ9KVxcLihcXGR7NH0pLyxcclxuICAgICAgICAgICAgICAgIG1pbiA9IGFyZ3VtZW50c1syXS4kZWxlbWVudC5kYXRhKCdkYXRlTWluJyksXHJcbiAgICAgICAgICAgICAgICBtYXggPSBhcmd1bWVudHNbMl0uJGVsZW1lbnQuZGF0YSgnZGF0ZU1heCcpLFxyXG4gICAgICAgICAgICAgICAgbWluRGF0ZSwgbWF4RGF0ZSwgdmFsdWVEYXRlLCByZXN1bHQ7XHJcblxyXG4gICAgICAgICAgICBpZiAobWluICYmIChyZXN1bHQgPSBtaW4ubWF0Y2gocmVnTWF0Y2gpKSkge1xyXG4gICAgICAgICAgICAgICAgbWluRGF0ZSA9IG5ldyBEYXRlKCtyZXN1bHRbM10sIHJlc3VsdFsyXSAtIDEsICtyZXN1bHRbMV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChtYXggJiYgKHJlc3VsdCA9IG1heC5tYXRjaChyZWdNYXRjaCkpKSB7XHJcbiAgICAgICAgICAgICAgICBtYXhEYXRlID0gbmV3IERhdGUoK3Jlc3VsdFszXSwgcmVzdWx0WzJdIC0gMSwgK3Jlc3VsdFsxXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHJlc3VsdCA9IHZhbHVlLm1hdGNoKHJlZ01hdGNoKSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWVEYXRlID0gbmV3IERhdGUoK3Jlc3VsdFszXSwgcmVzdWx0WzJdIC0gMSwgK3Jlc3VsdFsxXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZWdUZXN0LnRlc3QodmFsdWUpICYmIChtaW5EYXRlID8gdmFsdWVEYXRlID49IG1pbkRhdGUgOiB0cnVlKSAmJiAobWF4RGF0ZSA/IHZhbHVlRGF0ZSA8PSBtYXhEYXRlIDogdHJ1ZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBydTogJ9Cd0LXQutC+0YDRgNC10LrRgtC90LDRjyDQtNCw0YLQsCcsXHJcbiAgICAgICAgICAgIGVuOiAnSW5jb3JyZWN0IGRhdGUnXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vINCk0LDQudC7INC+0LPRgNCw0L3QuNGH0LXQvdC90L7Qs9C+INGA0LDQt9C80LXRgNCwXHJcbiAgICBQYXJzbGV5LmFkZFZhbGlkYXRvcignZmlsZU1heFNpemUnLCB7XHJcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlLCBtYXhTaXplLCBwYXJzbGV5SW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgbGV0IGZpbGVzID0gcGFyc2xleUluc3RhbmNlLiRlbGVtZW50WzBdLmZpbGVzO1xyXG4gICAgICAgICAgICByZXR1cm4gZmlsZXMubGVuZ3RoICE9IDEgIHx8IGZpbGVzWzBdLnNpemUgPD0gbWF4U2l6ZSAqIDEwMjQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXF1aXJlbWVudFR5cGU6ICdpbnRlZ2VyJyxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBydTogJ9Ck0LDQudC7INC00L7Qu9C20LXQvSDQstC10YHQuNGC0Ywg0L3QtSDQsdC+0LvQtdC1LCDRh9C10LwgJXMgS2InLFxyXG4gICAgICAgICAgICBlbjogJ0ZpbGUgc2l6ZSBjYW5cXCd0IGJlIG1vcmUgdGhlbiAlcyBLYidcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQntCz0YDQsNC90LjRh9C10L3QuNGPINGA0LDRgdGI0LjRgNC10L3QuNC5INGE0LDQudC70L7QslxyXG4gICAgUGFyc2xleS5hZGRWYWxpZGF0b3IoJ2ZpbGVFeHRlbnNpb24nLCB7XHJcbiAgICAgICAgdmFsaWRhdGVTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlLCBmb3JtYXRzKSB7XHJcbiAgICAgICAgICAgIGxldCBmaWxlRXh0ZW5zaW9uID0gdmFsdWUuc3BsaXQoJy4nKS5wb3AoKTtcclxuICAgICAgICAgICAgbGV0IGZvcm1hdHNBcnIgPSBmb3JtYXRzLnNwbGl0KCcsICcpO1xyXG4gICAgICAgICAgICBsZXQgdmFsaWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZm9ybWF0c0Fyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGZpbGVFeHRlbnNpb24gPT09IGZvcm1hdHNBcnJbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB2YWxpZDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIHJ1OiAn0JTQvtC/0YPRgdGC0LjQvNGLINGC0L7Qu9GM0LrQviDRhNCw0LnQu9GLINGE0L7RgNC80LDRgtCwICVzJyxcclxuICAgICAgICAgICAgZW46ICdBdmFpbGFibGUgZXh0ZW5zaW9ucyBhcmUgJXMnXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0KHQvtC30LTQsNGR0YIg0LrQvtC90YLQtdC50L3QtdGA0Ysg0LTQu9GPINC+0YjQuNCx0L7QuiDRgyDQvdC10YLQuNC/0LjRh9C90YvRhSDRjdC70LXQvNC10L3RgtC+0LJcclxuICAgIFBhcnNsZXkub24oJ2ZpZWxkOmluaXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgJGVsZW1lbnQgPSB0aGlzLiRlbGVtZW50LFxyXG4gICAgICAgICAgICB0eXBlID0gJGVsZW1lbnQuYXR0cigndHlwZScpLFxyXG4gICAgICAgICAgICAkYmxvY2sgPSAkKCc8ZGl2Lz4nKS5hZGRDbGFzcygnZXJyb3JzLXBsYWNlbWVudCcpLFxyXG4gICAgICAgICAgICAkbGFzdDtcclxuXHJcbiAgICAgICAgaWYgKHR5cGUgPT0gJ2NoZWNrYm94JyB8fCB0eXBlID09ICdyYWRpbycpIHtcclxuICAgICAgICAgICAgJGxhc3QgPSAkKGBbbmFtZT1cIiR7JGVsZW1lbnQuYXR0cignbmFtZScpfVwiXTpsYXN0ICsgbGFiZWxgKTtcclxuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQuaGFzQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKSkge1xyXG4gICAgICAgICAgICAkbGFzdCA9ICRlbGVtZW50Lm5leHQoJy5zZWxlY3QyJyk7XHJcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ2ZpbGUnKSB7XHJcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQuY2xvc2VzdCgnLmN1c3RvbS1maWxlJyk7XHJcbiAgICAgICAgICAgIGlmICghJGxhc3QubmV4dCgnLmVycm9ycy1wbGFjZW1lbnQnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICRsYXN0LmFmdGVyKCRibG9jayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50LmNsb3Nlc3QoJy5qcy1kYXRlcGlja2VyLXJhbmdlJykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICRsYXN0ID0gJGVsZW1lbnQuY2xvc2VzdCgnLmpzLWRhdGVwaWNrZXItcmFuZ2UnKTtcclxuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQuYXR0cignbmFtZScpID09ICdpc19yZWNhcHRjaGFfc3VjY2VzcycpIHtcclxuICAgICAgICAgICAgJGxhc3QgPSAkZWxlbWVudC5wYXJlbnQoKS5uZXh0KCcuZy1yZWNhcHRjaGEnKTtcclxuICAgICAgICAgICAgaWYgKCEkbGFzdC5uZXh0KCcuZXJyb3JzLXBsYWNlbWVudCcpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgJGxhc3QuYWZ0ZXIoJGJsb2NrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCY0L3QuNGG0LjQuNGA0YPQtdGCINCy0LDQu9C40LTQsNGG0LjRjiDQvdCwINCy0YLQvtGA0L7QvCDQutCw0LvQtdC00LDRgNC90L7QvCDQv9C+0LvQtSDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgIFBhcnNsZXkub24oJ2ZpZWxkOnZhbGlkYXRlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCAkZWxlbWVudCA9ICQodGhpcy5lbGVtZW50KTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoJ2Zvcm1bZGF0YS12YWxpZGF0ZT1cInRydWVcIl0nKS5wYXJzbGV5KCk7XHJcbiAgICAvKipcclxuICAgICAqINCU0L7QsdCw0LLQu9GP0LXRgiDQvNCw0YHQutC4INCyINC/0L7Qu9GPINGE0L7RgNC8XHJcbiAgICAgKiBAc2VlICBodHRwczovL2dpdGh1Yi5jb20vUm9iaW5IZXJib3RzL0lucHV0bWFza1xyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiA8aW5wdXQgY2xhc3M9XCJqcy1waG9uZS1tYXNrXCIgdHlwZT1cInRlbFwiIG5hbWU9XCJ0ZWxcIiBpZD1cInRlbFwiPlxyXG4gICAgICovXHJcbiAgICAkKCcuanMtcGhvbmUtbWFzaycpLmlucHV0bWFzaygnKzcoOTk5KSA5OTktOTktOTknLCB7XHJcbiAgICAgICAgY2xlYXJNYXNrT25Mb3N0Rm9jdXM6IHRydWUsXHJcbiAgICAgICAgc2hvd01hc2tPbkhvdmVyOiBmYWxzZVxyXG4gICAgfSk7XHJcblxyXG4gICAgJCggXCIuZmxhZ21hbi1yZXF1ZXN0X19kYXRlXCIgKS5kYXRlcGlja2VyKCk7XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQvtGB0YLRi9C70Ywg0LTQu9GPINC+0LHQvdC+0LLQu9C10L3QuNGPIHhsaW5rINGDIHN2Zy3QuNC60L7QvdC+0Log0L/QvtGB0LvQtSDQvtCx0L3QvtCy0LvQtdC90LjRjyBET00gKNC00LvRjyBJRSlcclxuICAgICAqINGE0YPQvdC60YbQuNGOINC90YPQttC90L4g0LLRi9C30YvQstCw0YLRjCDQsiDRgdC+0LHRi9GC0LjRj9GFLCDQutC+0YLQvtGA0YvQtSDQstC90L7RgdGP0YIg0LjQt9C80LXQvdC10L3QuNGPINCyINGN0LvQtdC80LXQvdGC0Ysg0YPQttC1INC/0L7RgdC70LUg0YTQvtGA0LzQuNGA0L7QstCw0L3QuNGPIERPTS3QsFxyXG4gICAgICogKNC90LDQv9GA0LjQvNC10YAsINC/0L7RgdC70LUg0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Lgg0LrQsNGA0YPRgdC10LvQuCDQuNC70Lgg0L7RgtC60YDRi9GC0LjQuCDQv9C+0L/QsNC/0LApXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7RWxlbWVudH0gZWxlbWVudCDRjdC70LXQvNC10L3Rgiwg0LIg0LrQvtGC0L7RgNC+0Lwg0L3QtdC+0LHRhdC+0LTQuNC80L4g0L7QsdC90L7QstC40YLRjCBzdmcgKNC90LDQv9GA0LjQvCAkKCcjc29tZS1wb3B1cCcpKVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVTdmcoZWxlbWVudCkge1xyXG4gICAgICAgIGxldCAkdXNlRWxlbWVudCA9IGVsZW1lbnQuZmluZCgndXNlJyk7XHJcblxyXG4gICAgICAgICR1c2VFbGVtZW50LmVhY2goZnVuY3Rpb24oIGluZGV4ICkge1xyXG4gICAgICAgICAgICBpZiAoJHVzZUVsZW1lbnRbaW5kZXhdLmhyZWYgJiYgJHVzZUVsZW1lbnRbaW5kZXhdLmhyZWYuYmFzZVZhbCkge1xyXG4gICAgICAgICAgICAgICAgJHVzZUVsZW1lbnRbaW5kZXhdLmhyZWYuYmFzZVZhbCA9ICR1c2VFbGVtZW50W2luZGV4XS5ocmVmLmJhc2VWYWw7IC8vIHRyaWdnZXIgZml4aW5nIG9mIGhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zID0ge1xyXG4gICAgICAgIGRhdGVGb3JtYXQ6ICdkZC5tbS55eScsXHJcbiAgICAgICAgc2hvd090aGVyTW9udGhzOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQtdC70LDQtdGCINCy0YvQv9Cw0LTRjtGJ0LjQtSDQutCw0LvQtdC90LTQsNGA0LjQutC4XHJcbiAgICAgKiBAc2VlICBodHRwOi8vYXBpLmpxdWVyeXVpLmNvbS9kYXRlcGlja2VyL1xyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiAvLyDQsiBkYXRhLWRhdGUtbWluINC4IGRhdGEtZGF0ZS1tYXgg0LzQvtC20L3QviDQt9Cw0LTQsNGC0Ywg0LTQsNGC0YMg0LIg0YTQvtGA0LzQsNGC0LUgZGQubW0ueXl5eVxyXG4gICAgICogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImRhdGVJbnB1dFwiIGlkPVwiXCIgY2xhc3M9XCJqcy1kYXRlcGlja2VyXCIgZGF0YS1kYXRlLW1pbj1cIjA2LjExLjIwMTVcIiBkYXRhLWRhdGUtbWF4PVwiMTAuMTIuMjAxNVwiPlxyXG4gICAgICovXHJcbiAgICBsZXQgRGF0ZXBpY2tlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBkYXRlcGlja2VyID0gJCgnLmpzLWRhdGVwaWNrZXInKTtcclxuXHJcbiAgICAgICAgZGF0ZXBpY2tlci5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IG1pbkRhdGUgPSAkKHRoaXMpLmRhdGEoJ2RhdGUtbWluJyk7XHJcbiAgICAgICAgICAgIGxldCBtYXhEYXRlID0gJCh0aGlzKS5kYXRhKCdkYXRlLW1heCcpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGl0ZW1PcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgbWluRGF0ZTogbWluRGF0ZSB8fCBudWxsLFxyXG4gICAgICAgICAgICAgICAgbWF4RGF0ZTogbWF4RGF0ZSB8fCBudWxsLFxyXG4gICAgICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY2hhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuZmllbGQnKS5hZGRDbGFzcygnaXMtZmlsbGVkJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBpdGVtT3B0aW9ucywgZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgICQodGhpcykuZGF0ZXBpY2tlcihpdGVtT3B0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGxldCBkYXRlcGlja2VyID0gbmV3IERhdGVwaWNrZXIoKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8vINCU0LjQsNC/0LDQt9C+0L0g0LTQsNGCXHJcbiAgICBsZXQgRGF0ZXBpY2tlclJhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IGRhdGVwaWNrZXJSYW5nZSA9ICQoJy5qcy1kYXRlcGlja2VyLXJhbmdlJyk7XHJcblxyXG4gICAgICAgIGRhdGVwaWNrZXJSYW5nZS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IGZyb21JdGVtT3B0aW9ucyA9IHt9O1xyXG4gICAgICAgICAgICBsZXQgdG9JdGVtT3B0aW9ucyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgJC5leHRlbmQodHJ1ZSwgZnJvbUl0ZW1PcHRpb25zLCBkYXRlcGlja2VyRGVmYXVsdE9wdGlvbnMpO1xyXG4gICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCB0b0l0ZW1PcHRpb25zLCBkYXRlcGlja2VyRGVmYXVsdE9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGRhdGVGcm9tID0gJCh0aGlzKS5maW5kKCcuanMtcmFuZ2UtZnJvbScpLmRhdGVwaWNrZXIoZnJvbUl0ZW1PcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBkYXRlVG8gPSAkKHRoaXMpLmZpbmQoJy5qcy1yYW5nZS10bycpLmRhdGVwaWNrZXIodG9JdGVtT3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICBkYXRlRnJvbS5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlVG8uZGF0ZXBpY2tlcignb3B0aW9uJywgJ21pbkRhdGUnLCBnZXREYXRlKHRoaXMpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkYXRlVG8ucHJvcCgncmVxdWlyZWQnLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygncGFyc2xleS1lcnJvcicpICYmICQodGhpcykucGFyc2xleSgpLmlzVmFsaWQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyc2xleSgpLnZhbGlkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZGF0ZVRvLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGRhdGVGcm9tLmRhdGVwaWNrZXIoJ29wdGlvbicsICdtYXhEYXRlJywgZ2V0RGF0ZSh0aGlzKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZGF0ZUZyb20ucHJvcCgncmVxdWlyZWQnLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygncGFyc2xleS1lcnJvcicpICYmICQodGhpcykucGFyc2xleSgpLmlzVmFsaWQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyc2xleSgpLnZhbGlkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXREYXRlKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgbGV0IGRhdGU7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgZGF0ZSA9ICQuZGF0ZXBpY2tlci5wYXJzZURhdGUoZGF0ZXBpY2tlckRlZmF1bHRPcHRpb25zLmRhdGVGb3JtYXQsIGVsZW1lbnQudmFsdWUpO1xyXG4gICAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRhdGU7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgZGF0ZXBpY2tlclJhbmdlID0gbmV3IERhdGVwaWNrZXJSYW5nZSgpO1xyXG4gICAgLyoqXHJcbiAgICAgKiDQoNC10LDQu9C40LfRg9C10YIg0L/QtdGA0LXQutC70Y7Rh9C10L3QuNC1INGC0LDQsdC+0LJcclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogPHVsIGNsYXNzPVwidGFicyBqcy10YWJzXCI+XHJcbiAgICAgKiAgICAgPGxpIGNsYXNzPVwidGFic19faXRlbVwiPlxyXG4gICAgICogICAgICAgICA8c3BhbiBjbGFzcz1cImlzLWFjdGl2ZSB0YWJzX19saW5rIGpzLXRhYi1saW5rXCI+VGFiIG5hbWU8L3NwYW4+XHJcbiAgICAgKiAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJzX19jbnRcIj5cclxuICAgICAqICAgICAgICAgICAgIDxwPlRhYiBjb250ZW50PC9wPlxyXG4gICAgICogICAgICAgICA8L2Rpdj5cclxuICAgICAqICAgICA8L2xpPlxyXG4gICAgICogPC91bD5cclxuICAgICAqL1xyXG4gICAgbGV0IFRhYlN3aXRjaGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgY29uc3QgdGFicyA9ICQoJy5qcy10YWJzJyk7XHJcblxyXG4gICAgICAgIHRhYnMuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcuanMtdGFiLWxpbmsuaXMtYWN0aXZlJykubmV4dCgpLmFkZENsYXNzKCdpcy1vcGVuJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRhYnMub24oJ2NsaWNrJywgJy5qcy10YWItbGluaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIHNlbGYub3BlbigkKHRoaXMpLCBldmVudCk7XHJcblxyXG4gICAgICAgICAgICAvLyByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINCe0YLQutGA0YvQstCw0LXRgiDRgtCw0LEg0L/QviDQutC70LjQutGDINC90LAg0LrQsNC60L7QuS3RgtC+INC00YDRg9Cz0L7QuSDRjdC70LXQvNC10L3RglxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQGV4YW1wbGVcclxuICAgICAgICAgKiA8c3BhbiBkYXRhLXRhYi1vcGVuPVwiI3RhYi1sb2dpblwiPk9wZW4gbG9naW4gdGFiPC9zcGFuPlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICdbZGF0YS10YWItb3Blbl0nLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICBjb25zdCB0YWJFbGVtID0gJCh0aGlzKS5kYXRhKCd0YWItb3BlbicpO1xyXG4gICAgICAgICAgICBzZWxmLm9wZW4oJCh0YWJFbGVtKSwgZXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCQodGhpcykuZGF0YSgncG9wdXAnKSA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQntGC0LrRgNGL0LLQsNC10YIg0YLQsNCxXHJcbiAgICAgICAgICogQHBhcmFtICB7RWxlbWVudH0gZWxlbSDRjdC70LXQvNC10L3RgiAuanMtdGFiLWxpbmssINC90LAg0LrQvtGC0L7RgNGL0Lkg0L3Rg9C20L3QviDQv9C10YDQtdC60LvRjtGH0LjRgtGMXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICAqIC8vINCy0YvQt9C+0LIg0LzQtdGC0L7QtNCwIG9wZW4sINC+0YLQutGA0L7QtdGCINGC0LDQsVxyXG4gICAgICAgICAqIHRhYlN3aXRjaGVyLm9wZW4oJCgnI3NvbWUtdGFiJykpO1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHNlbGYub3BlbiA9IGZ1bmN0aW9uKGVsZW0sIGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGlmICghZWxlbS5oYXNDbGFzcygnaXMtYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50VGFicyA9IGVsZW0uY2xvc2VzdCh0YWJzKTtcclxuICAgICAgICAgICAgICAgIHBhcmVudFRhYnMuZmluZCgnLmlzLW9wZW4nKS5yZW1vdmVDbGFzcygnaXMtb3BlbicpO1xyXG5cclxuICAgICAgICAgICAgICAgIGVsZW0ubmV4dCgpLnRvZ2dsZUNsYXNzKCdpcy1vcGVuJyk7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRUYWJzLmZpbmQoJy5pcy1hY3RpdmUnKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICBlbGVtLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgdGFiU3dpdGNoZXIgPSBuZXcgVGFiU3dpdGNoZXIoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0LrRgNGL0LLQsNC10YIg0Y3Qu9C10LzQtdC90YIgaGlkZGVuRWxlbSDQv9GA0Lgg0LrQu9C40LrQtSDQt9CwINC/0YDQtdC00LXQu9Cw0LzQuCDRjdC70LXQvNC10L3RgtCwIHRhcmdldEVsZW1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtFbGVtZW50fSAgIHRhcmdldEVsZW1cclxuICAgICAqIEBwYXJhbSAge0VsZW1lbnR9ICAgaGlkZGVuRWxlbVxyXG4gICAgICogQHBhcmFtICB7RnVuY3Rpb259ICBbb3B0aW9uYWxDYl0g0L7RgtGA0LDQsdCw0YLRi9Cy0LDQtdGCINGB0YDQsNC30YMg0L3QtSDQtNC+0LbQuNC00LDRj9GB0Ywg0LfQsNCy0LXRgNGI0LXQvdC40Y8g0LDQvdC40LzQsNGG0LjQuFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBvbk91dHNpZGVDbGlja0hpZGUodGFyZ2V0RWxlbSwgaGlkZGVuRWxlbSwgb3B0aW9uYWxDYikge1xyXG4gICAgICAgICQoZG9jdW1lbnQpLmJpbmQoJ21vdXNldXAgdG91Y2hlbmQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGlmICghdGFyZ2V0RWxlbS5pcyhlLnRhcmdldCkgJiYgJChlLnRhcmdldCkuY2xvc2VzdCh0YXJnZXRFbGVtKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgaGlkZGVuRWxlbS5zdG9wKHRydWUsIHRydWUpLmZhZGVPdXQoZ2xvYmFsT3B0aW9ucy50aW1lKTtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25hbENiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uYWxDYigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQpdGN0LvQv9C10YAg0LTQu9GPINC/0L7QutCw0LfQsCwg0YHQutGA0YvRgtC40Y8g0LjQu9C4INGH0LXRgNC10LTQvtCy0LDQvdC40Y8g0LLQuNC00LjQvNC+0YHRgtC4INGN0LvQtdC80LXQvdGC0L7QslxyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXZpc2liaWxpdHk9XCJzaG93XCIgZGF0YS1zaG93PVwiI2VsZW1JZDFcIj48L2J1dHRvbj5cclxuICAgICAqXHJcbiAgICAgKiDQuNC70LhcclxuICAgICAqIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtdmlzaWJpbGl0eT1cImhpZGVcIiBkYXRhLWhpZGU9XCIjZWxlbUlkMlwiPjwvYnV0dG9uPlxyXG4gICAgICpcclxuICAgICAqINC40LvQuFxyXG4gICAgICogPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS12aXNpYmlsaXR5PVwidG9nZ2xlXCIgZGF0YS10b2dnbGU9XCIjZWxlbUlkM1wiPjwvYnV0dG9uPlxyXG4gICAgICpcclxuICAgICAqINC40LvQuFxyXG4gICAgICogPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS12aXNpYmlsaXR5PVwic2hvd1wiIGRhdGEtc2hvdz1cIiNlbGVtSWQxfCNlbGVtSWQzXCI+PC9idXR0b24+XHJcbiAgICAgKlxyXG4gICAgICog0LjQu9C4XHJcbiAgICAgKiAvLyDQtdGB0LvQuCDQtdGB0YLRjCDQsNGC0YDQuNCx0YPRgiBkYXRhLXF1ZXVlPVwic2hvd1wiLCDRgtC+INCx0YPQtNC10YIg0YHQvdCw0YfQsNC70LAg0YHQutGA0YvRgiDRjdC70LXQvNC10L3RgiAjZWxlbUlkMiwg0LAg0L/QvtGC0L7QvCDQv9C+0LrQsNC30LDQvSAjZWxlbUlkMVxyXG4gICAgICogPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS12aXNpYmlsaXR5PVwic2hvd1wiIGRhdGEtc2hvdz1cIiNlbGVtSWQxXCIgZGF0YS12aXNpYmlsaXR5PVwiaGlkZVwiIGRhdGEtaGlkZT1cIiNlbGVtSWQyXCIgZGF0YS1xdWV1ZT1cInNob3dcIj48L2J1dHRvbj5cclxuICAgICAqXHJcbiAgICAgKiA8ZGl2IGlkPVwiZWxlbUlkMVwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj5UZXh0PC9kaXY+XHJcbiAgICAgKiA8ZGl2IGlkPVwiZWxlbUlkMlwiPlRleHQ8L2Rpdj5cclxuICAgICAqIDxkaXYgaWQ9XCJlbGVtSWQzXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPlRleHQ8L2Rpdj5cclxuICAgICAqL1xyXG4gICAgbGV0IHZpc2liaWxpdHlDb250cm9sID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IHNldHRpbmdzID0ge1xyXG4gICAgICAgICAgICB0eXBlczogW1xyXG4gICAgICAgICAgICAgICAgJ3Nob3cnLFxyXG4gICAgICAgICAgICAgICAgJ2hpZGUnLFxyXG4gICAgICAgICAgICAgICAgJ3RvZ2dsZSdcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICgkKCdbZGF0YS12aXNpYmlsaXR5XScpLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICdbZGF0YS12aXNpYmlsaXR5XScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGRhdGFUeXBlO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZXR0aW5ncy50eXBlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlID0gc2V0dGluZ3MudHlwZXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmRhdGEoZGF0YVR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2aXNpYmlsaXR5TGlzdCA9ICQodGhpcykuZGF0YShkYXRhVHlwZSkuc3BsaXQoJ3wnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5ID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmRhdGEoJ3F1ZXVlJykgPT0gJ3Nob3cnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxheSA9IGdsb2JhbE9wdGlvbnMudGltZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRWaXNpYmlsaXR5KGRhdGFUeXBlLCB2aXNpYmlsaXR5TGlzdCwgZGVsYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoISQodGhpcykuaGFzQ2xhc3MoJ3RhYnNfX2xpbmsnKSAmJiAkKHRoaXMpLmF0dHIoJ3R5cGUnKSAhPSAncmFkaW8nICYmICQodGhpcykuYXR0cigndHlwZScpICE9ICdjaGVja2JveCcpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINCy0LjQtNC40LzQvtGB0YLRjFxyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gIHZpc2liaWxpdHlUeXBlINGC0LjQvyDQvtGC0L7QsdGA0LDQttC10L3QuNGPXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7QXJyYXl9ICAgbGlzdCDQvNCw0YHRgdC40LIg0Y3Qu9C10LzQtdC90YLQvtCyLCDRgSDQutC+0YLQvtGA0YvQvCDRgNCw0LHQvtGC0LDQtdC8XHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSAgZGVsYXkg0LfQsNC00LXRgNC20LrQsCDQv9GA0Lgg0L/QvtC60LDQt9C1INGN0LvQtdC80LXQvdGC0LAg0LIgbXNcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNldFZpc2liaWxpdHkodmlzaWJpbGl0eVR5cGUsIGxpc3QsIGRlbGF5KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmlzaWJpbGl0eVR5cGUgPT0gc2V0dGluZ3MudHlwZXNbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJChsaXN0W2ldKS5kZWxheShkZWxheSkuZmFkZUluKGdsb2JhbE9wdGlvbnMudGltZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodmlzaWJpbGl0eVR5cGUgPT0gc2V0dGluZ3MudHlwZXNbMV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJChsaXN0W2ldKS5mYWRlT3V0KGdsb2JhbE9wdGlvbnMudGltZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodmlzaWJpbGl0eVR5cGUgPT0gc2V0dGluZ3MudHlwZXNbMl0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQobGlzdFtpXSkuaXMoJzp2aXNpYmxlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQobGlzdFtpXSkuZmFkZU91dChnbG9iYWxPcHRpb25zLnRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChsaXN0W2ldKS5mYWRlSW4oZ2xvYmFsT3B0aW9ucy50aW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHZpc2liaWxpdHlDb250cm9sKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQlNC10LvQsNC10YIg0YHQu9Cw0LnQtNC10YBcclxuICAgICAqIEBzZWUgIGh0dHA6Ly9hcGkuanF1ZXJ5dWkuY29tL3NsaWRlci9cclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogLy8g0LIgZGF0YS1taW4g0LggZGF0YS1tYXgg0LfQsNC00LDRjtGC0YHRjyDQvNC40L3QuNC80LDQu9GM0L3QvtC1INC4INC80LDQutGB0LjQvNCw0LvRjNC90L7QtSDQt9C90LDRh9C10L3QuNC1XHJcbiAgICAgKiAvLyDQsiBkYXRhLXN0ZXAg0YjQsNCzLFxyXG4gICAgICogLy8g0LIgZGF0YS12YWx1ZXMg0LTQtdGE0L7Qu9GC0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8gXCJtaW4sIG1heFwiXHJcbiAgICAgKiA8ZGl2IGNsYXNzPVwic2xpZGVyIGpzLXJhbmdlXCI+XHJcbiAgICAgKiAgICAgIDxkaXYgY2xhc3M9XCJzbGlkZXJfX3JhbmdlXCIgZGF0YS1taW49XCIwXCIgZGF0YS1tYXg9XCIxMDBcIiBkYXRhLXN0ZXA9XCIxXCIgZGF0YS12YWx1ZXM9XCIxMCwgNTVcIj48L2Rpdj5cclxuICAgICAqIDwvZGl2PlxyXG4gICAgICovXHJcbiAgICBsZXQgU2xpZGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3Qgc2xpZGVyID0gJCgnLmpzLXJhbmdlJyk7XHJcbiAgICAgICAgbGV0IG1pbixcclxuICAgICAgICAgICAgbWF4LFxyXG4gICAgICAgICAgICBzdGVwLFxyXG4gICAgICAgICAgICB2YWx1ZXM7XHJcblxyXG4gICAgICAgIHNsaWRlci5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNlbGYgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgcmFuZ2UgPSBzZWxmLmZpbmQoJy5zbGlkZXJfX3JhbmdlJyk7XHJcblxyXG4gICAgICAgICAgICBtaW4gPSByYW5nZS5kYXRhKCdtaW4nKTtcclxuICAgICAgICAgICAgbWF4ID0gcmFuZ2UuZGF0YSgnbWF4Jyk7XHJcbiAgICAgICAgICAgIHN0ZXAgPSByYW5nZS5kYXRhKCdzdGVwJyk7XHJcbiAgICAgICAgICAgIHZhbHVlcyA9IHJhbmdlLmRhdGEoJ3ZhbHVlcycpLnNwbGl0KCcsICcpO1xyXG5cclxuICAgICAgICAgICAgcmFuZ2Uuc2xpZGVyKHtcclxuICAgICAgICAgICAgICAgIHJhbmdlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbWluOiBtaW4gfHwgbnVsbCxcclxuICAgICAgICAgICAgICAgIG1heDogbWF4IHx8IG51bGwsXHJcbiAgICAgICAgICAgICAgICBzdGVwOiBzdGVwIHx8IDEsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZXM6IHZhbHVlcyxcclxuICAgICAgICAgICAgICAgIHNsaWRlOiBmdW5jdGlvbihldmVudCwgdWkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmZpbmQoJy51aS1zbGlkZXItaGFuZGxlJykuY2hpbGRyZW4oJ3NwYW4nKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmZpbmQoJy51aS1zbGlkZXItaGFuZGxlOm50aC1jaGlsZCgyKScpLmFwcGVuZChgPHNwYW4+JHt1aS52YWx1ZXNbMF19PC9zcGFuPmApO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZmluZCgnLnVpLXNsaWRlci1oYW5kbGU6bnRoLWNoaWxkKDMpJykuYXBwZW5kKGA8c3Bhbj4ke3VpLnZhbHVlc1sxXX08L3NwYW4+YCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5maW5kKCcudWktc2xpZGVyLWhhbmRsZTpudGgtY2hpbGQoMiknKS5hcHBlbmQoYDxzcGFuPiR7cmFuZ2Uuc2xpZGVyKCd2YWx1ZXMnLCAwKX08L3NwYW4+YCk7XHJcbiAgICAgICAgICAgIHNlbGYuZmluZCgnLnVpLXNsaWRlci1oYW5kbGU6bnRoLWNoaWxkKDMpJykuYXBwZW5kKGA8c3Bhbj4ke3JhbmdlLnNsaWRlcigndmFsdWVzJywgMSl9PC9zcGFuPmApO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgbGV0IHNsaWRlciA9IG5ldyBTbGlkZXIoKTtcclxuXHJcbiAgICB3aW5kb3cub25sb2FkPWZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbGV0IFBlcnNvbnM9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50ZWFtX3BlcnNvbnNfcGhvdG8nKTtcclxuICAgICAgICBQZXJzb25zLmZvckVhY2gobm9kZSA9PiB7XHJcbiAgICAgICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgUGVyc29ucy5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuc3R5bGUud2lkdGg9JzEzJSc7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudD1lbGVtZW50LnRhcmdldDtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQuc3R5bGUud2lkdGg9XCIxOCVcIjtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQubmV4dEVsZW1lbnRTaWJsaW5nLnN0eWxlLndpZHRoPVwiMTYlXCI7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmcuc3R5bGUud2lkdGg9XCIxNiVcIjtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQubmV4dEVsZW1lbnRTaWJsaW5nLm5leHRFbGVtZW50U2libGluZy5zdHlsZS53aWR0aD1cIjE0JVwiO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuc3R5bGUud2lkdGg9XCIxNCVcIjtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAkKFwiLm1vZGFsX2RpYWxvZ19jb250ZW50X2l0ZW1cIikubm90KFwiOmZpcnN0XCIpLmhpZGUoKTtcclxuICAgICQoXCIubW9kYWxfZGlhbG9nX2NvbnRlbnQgLm1vZGFsX2J1dHRvblwiKS5jbGljayhmdW5jdGlvbigpIHtcclxuICAgIFx0JChcIi5tb2RhbF9kaWFsb2dfY29udGVudCAubW9kYWxfYnV0dG9uXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpLmVxKCQodGhpcykuaW5kZXgoKSkuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICBcdCQoXCIubW9kYWxfZGlhbG9nX2NvbnRlbnRfaXRlbVwiKS5oaWRlKCkuZXEoJCh0aGlzKS5pbmRleCgpKS5mYWRlSW4oKVxyXG4gICAgfSkuZXEoMCkuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICBjb25zdCBtb2RhbENhbGwgPSAkKFwiW2RhdGEtbW9kYWxdXCIpO1xyXG4gICAgY29uc3QgbW9kYWxDbG9zZSA9ICQoXCJbZGF0YS1jbG9zZV1cIik7XHJcblxyXG4gICAgbW9kYWxDYWxsLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBsZXQgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgICAgIGxldCBtb2RhbElkID0gJHRoaXMuZGF0YSgnbW9kYWwnKTtcclxuXHJcbiAgICAgICAgJChtb2RhbElkKS5hZGRDbGFzcygnc2hvdycpO1xyXG4gICAgICAgICQoXCJib2R5XCIpLmFkZENsYXNzKCduby1zY3JvbGwnKVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKG1vZGFsSWQpLmZpbmQoXCIubG9jYXRpb25cIikuY3NzKHtcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogXCJzY2FsZSgxKVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sIDEwMCk7XHJcblxyXG4gICAgXHJcblxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIG1vZGFsQ2xvc2Uub24oXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIGxldCAkdGhpcyA9ICQodGhpcyk7XHJcbiAgICAgICAgbGV0IG1vZGFsUGFyZW50ID0gJHRoaXMucGFyZW50cygnLm1vZGFsJyk7XHJcblxyXG4gICAgICAgIG1vZGFsUGFyZW50LmZpbmQoXCIubG9jYXRpb25cIikuY3NzKHtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiBcInNjYWxlKDApXCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbW9kYWxQYXJlbnQucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuICAgICAgICAgICAgJChcImJvZHlcIikucmVtb3ZlQ2xhc3MoJ25vLXNjcm9sbCcpO1xyXG4gICAgICAgIH0sIDEwMCk7XHJcblxyXG4gICAgXHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIi5tb2RhbFwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgbGV0ICR0aGlzID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgJHRoaXMuZmluZChcIi5sb2NhdGlvblwiKS5jc3Moe1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IFwic2NhbGUoMClcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkdGhpcy5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG4gICAgICAgICAgICAkKFwiYm9keVwiKS5yZW1vdmVDbGFzcygnbm8tc2Nyb2xsJyk7XHJcbiAgICAgICAgfSwgMjAwKTtcclxuIFxyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIi5sb2NhdGlvblwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9KTtcclxuICAgIGxldCBkb2M9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jb250cicpO1xyXG4gICAgZG9jLmZvckVhY2gobm9kZSA9PiB7XHJcbiAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGRvYy5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgbm9kZS5zdHlsZS53aWR0aD0nMjIzcHgnO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50PWVsZW1lbnQudGFyZ2V0O1xyXG4gICAgICAgICAgICBjdXJyZW50LnN0eWxlLndpZHRoPVwiMjg0cHhcIjtcclxuICAgICAgICBcclxuICAgICAgICB9KVxyXG4gICAgfSk7XHJcbiAgICBcclxuICAgICQoJ2FbaHJlZl49XCIjXCJdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAvLyDQvtGC0LzQtdC90Y/QtdC8INGB0YLQsNC90LTQsNGA0YLQvdC+0LUg0LTQtdC50YHRgtCy0LjQtVxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBcclxuICAgICAgICB2YXIgc2MgPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpLFxyXG4gICAgICAgICAgICBkbiA9ICQoc2MpLm9mZnNldCgpLnRvcDtcclxuICAgICAgICAvKlxyXG4gICAgICAgICogc2MgLSDQsiDQv9C10YDQtdC80LXQvdC90YPRjiDQt9Cw0L3QvtGB0LjQvCDQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDRgtC+0LwsINC6INC60LDQutC+0LzRgyDQsdC70L7QutGDINC90LDQtNC+INC/0LXRgNC10LnRgtC4XHJcbiAgICAgICAgKiBkbiAtINC+0L/RgNC10LTQtdC70Y/QtdC8INC/0L7Qu9C+0LbQtdC90LjQtSDQsdC70L7QutCwINC90LAg0YHRgtGA0LDQvdC40YbQtVxyXG4gICAgICAgICovXHJcbiAgICBcclxuICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiBkbn0sIDEwMDApO1xyXG4gICAgXHJcbiAgICAgICAgLypcclxuICAgICAgICAqIDEwMDAg0YHQutC+0YDQvtGB0YLRjCDQv9C10YDQtdGF0L7QtNCwINCyINC80LjQu9C70LjRgdC10LrRg9C90LTQsNGFXHJcbiAgICAgICAgKi9cclxuICAgIH0pO1xyXG5cclxuICAgIC8qd2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgd2luZG93Lk5vZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhc2VzX2NvbnRlbnRfaXRlbScpO1xyXG4gICAgICAgIGxldCBpID0gLTE7XHJcbiAgICAgICAgbGV0IGNvdW50ID0gMDtcclxuICAgICAgICBsZXQgZmxhZyA9IGZhbHNlO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5zY3JvbGxZID4gTm9kZXNbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueSkge1xyXG4gICAgICAgICAgICAgICAgZmxhZyA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgICB7XHJcbiAgICAgICAgICAgIHBhc3NpdmU6IGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChmbGFnID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzY3JvbGwnICsgd2luZG93LnNjcm9sbFkpO1xyXG4gICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvdW50KTtcclxuICAgICAgICAgICAgICAgIGlmIChjb3VudCA+IDEwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPCBOb2Rlcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgTm9kZXNbaV0uc2Nyb2xsSW50b1ZpZXcoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYWc9ZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHBhc3NpdmU6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAqL1xyXG4gICAgLy8gJChcIi5jYXNlc19zaWRlYmFyX2xpc3RfaXRlbVwiKS5jbGljayhmdW5jdGlvbihlKSB7XHJcbiAgICAvLyAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgLy8gICAgICQoXCIuY2FzZXNfc2lkZWJhcl9saXN0X2l0ZW1cIikucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgLy8gICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgLy8gfSk7XHJcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG4gICAgICAgICQoXCIuaW50cm9fY2FzZXNcIikuaGlkZSgpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgICQoXCIjb3BcIikuY2xpY2soZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAvLyAkKFwiLmludHJvX2l0ZW1zXCIpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAvLyAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICAgICAgLy8gJChcIi5pbnRyb19pdGVtc1wiKS5hZGRDbGFzcygnZGlzcGxheV9ub25lJyk7XHJcbiAgICAgICAgJChcIi5pbnRyb19pdGVtc1wiKS5oaWRlKCk7XHJcbiAgICAgICAgJChcIi5pbnRyb19jYXNlc1wiKS5zaG93KCdzcGVlZCcpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICAgIC8vIFx0JChcIiNvcFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG4gICAgLy8gXHRcdCQoXCIuaW50cm9faXRlbXNcIikudG9nZ2xlQ2xhc3MoXCJkaXNwbGF5X25vbmVcIik7IHJldHVybiBmYWxzZTtcclxuICAgIC8vIFx0fSk7XHJcbiAgICAvLyB9KTtcclxuXHJcblxyXG4gICAgLy8gJChcIiNidG4tZHJvcFwiKS5jbGljayhmdW5jdGlvbigpIHtcclxuICAgIC8vICAgICBpZiAoZmxhZ1snZHJvcCddID0gIWZsYWdbJ2Ryb3AnXSkge1xyXG4gICAgLy8gICAgICAgICAkKFwiI3Rlc3QtZHJvcFwiKS5oaWRlKFwiZHJvcFwiLCB7IGRpcmVjdGlvbjogXCJyaWdodFwiIH0sIDEwMDApO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgICBlbHNlIHtcclxuICAgIC8vICAgICAgICAgJChcIiN0ZXN0LWRyb3BcIikuc2hvdyhcImRyb3BcIiwgeyBkaXJlY3Rpb246IFwiZG93blwiIH0sIDUwMCk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfSk7XHJcbiAgICAvKipcclxuICAgICAqINCk0LjQutGB0LjRgNC+0LLQsNC90L3Ri9C5INGF0LXQtNC10YBcclxuICAgICAqL1xyXG5cclxuICAgIC8vICQod2luZG93KS5vbignc2Nyb2xsJywgdG9nZ2xlRml4ZWRIZWFkZXIpO1xyXG5cclxuICAgIC8vIGZ1bmN0aW9uIHRvZ2dsZUZpeGVkSGVhZGVyKCkge1xyXG4gICAgLy8gICAgIGNvbnN0ICRoZWFkZXIgPSAkKCcuaGVhZGVyJyk7XHJcbiAgICAvLyAgICAgY29uc3QgJG1haW4gPSAkKCcuaGVhZGVyJykubmV4dCgpO1xyXG5cclxuICAgIC8vICAgICBpZiAod2luZG93LnBhZ2VZT2Zmc2V0ID4gMCkge1xyXG4gICAgLy8gICAgICAgICAkaGVhZGVyLmFkZENsYXNzKCdpcy1maXhlZCcpO1xyXG4gICAgLy8gICAgICAgICAkbWFpbi5jc3MoeyBtYXJnaW5Ub3A6ICRoZWFkZXIub3V0ZXJIZWlnaHQoKSB9KTtcclxuICAgIC8vICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAkaGVhZGVyLnJlbW92ZUNsYXNzKCdpcy1maXhlZCcpO1xyXG4gICAgLy8gICAgICAgICAkbWFpbi5jc3MoeyBtYXJnaW5Ub3A6IDAgfSk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG5cclxuICAgICFmdW5jdGlvbihpKXtcInVzZSBzdHJpY3RcIjtcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImpxdWVyeVwiXSxpKTpcInVuZGVmaW5lZFwiIT10eXBlb2YgZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1pKHJlcXVpcmUoXCJqcXVlcnlcIikpOmkoalF1ZXJ5KX0oZnVuY3Rpb24oaSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9d2luZG93LlNsaWNrfHx7fTsoZT1mdW5jdGlvbigpe3ZhciBlPTA7cmV0dXJuIGZ1bmN0aW9uKHQsbyl7dmFyIHMsbj10aGlzO24uZGVmYXVsdHM9e2FjY2Vzc2liaWxpdHk6ITAsYWRhcHRpdmVIZWlnaHQ6ITEsYXBwZW5kQXJyb3dzOmkodCksYXBwZW5kRG90czppKHQpLGFycm93czohMCxhc05hdkZvcjpudWxsLHByZXZBcnJvdzonPGJ1dHRvbiBjbGFzcz1cInNsaWNrLXByZXZcIiBhcmlhLWxhYmVsPVwiUHJldmlvdXNcIiB0eXBlPVwiYnV0dG9uXCI+UHJldmlvdXM8L2J1dHRvbj4nLG5leHRBcnJvdzonPGJ1dHRvbiBjbGFzcz1cInNsaWNrLW5leHRcIiBhcmlhLWxhYmVsPVwiTmV4dFwiIHR5cGU9XCJidXR0b25cIj5OZXh0PC9idXR0b24+JyxhdXRvcGxheTohMSxhdXRvcGxheVNwZWVkOjNlMyxjZW50ZXJNb2RlOiExLGNlbnRlclBhZGRpbmc6XCI1MHB4XCIsY3NzRWFzZTpcImVhc2VcIixjdXN0b21QYWdpbmc6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gaSgnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgLz4nKS50ZXh0KHQrMSl9LGRvdHM6ITEsZG90c0NsYXNzOlwic2xpY2stZG90c1wiLGRyYWdnYWJsZTohMCxlYXNpbmc6XCJsaW5lYXJcIixlZGdlRnJpY3Rpb246LjM1LGZhZGU6ITEsZm9jdXNPblNlbGVjdDohMSxmb2N1c09uQ2hhbmdlOiExLGluZmluaXRlOiEwLGluaXRpYWxTbGlkZTowLGxhenlMb2FkOlwib25kZW1hbmRcIixtb2JpbGVGaXJzdDohMSxwYXVzZU9uSG92ZXI6ITAscGF1c2VPbkZvY3VzOiEwLHBhdXNlT25Eb3RzSG92ZXI6ITEscmVzcG9uZFRvOlwid2luZG93XCIscmVzcG9uc2l2ZTpudWxsLHJvd3M6MSxydGw6ITEsc2xpZGU6XCJcIixzbGlkZXNQZXJSb3c6MSxzbGlkZXNUb1Nob3c6MSxzbGlkZXNUb1Njcm9sbDoxLHNwZWVkOjUwMCxzd2lwZTohMCxzd2lwZVRvU2xpZGU6ITEsdG91Y2hNb3ZlOiEwLHRvdWNoVGhyZXNob2xkOjUsdXNlQ1NTOiEwLHVzZVRyYW5zZm9ybTohMCx2YXJpYWJsZVdpZHRoOiExLHZlcnRpY2FsOiExLHZlcnRpY2FsU3dpcGluZzohMSx3YWl0Rm9yQW5pbWF0ZTohMCx6SW5kZXg6MWUzfSxuLmluaXRpYWxzPXthbmltYXRpbmc6ITEsZHJhZ2dpbmc6ITEsYXV0b1BsYXlUaW1lcjpudWxsLGN1cnJlbnREaXJlY3Rpb246MCxjdXJyZW50TGVmdDpudWxsLGN1cnJlbnRTbGlkZTowLGRpcmVjdGlvbjoxLCRkb3RzOm51bGwsbGlzdFdpZHRoOm51bGwsbGlzdEhlaWdodDpudWxsLGxvYWRJbmRleDowLCRuZXh0QXJyb3c6bnVsbCwkcHJldkFycm93Om51bGwsc2Nyb2xsaW5nOiExLHNsaWRlQ291bnQ6bnVsbCxzbGlkZVdpZHRoOm51bGwsJHNsaWRlVHJhY2s6bnVsbCwkc2xpZGVzOm51bGwsc2xpZGluZzohMSxzbGlkZU9mZnNldDowLHN3aXBlTGVmdDpudWxsLHN3aXBpbmc6ITEsJGxpc3Q6bnVsbCx0b3VjaE9iamVjdDp7fSx0cmFuc2Zvcm1zRW5hYmxlZDohMSx1bnNsaWNrZWQ6ITF9LGkuZXh0ZW5kKG4sbi5pbml0aWFscyksbi5hY3RpdmVCcmVha3BvaW50PW51bGwsbi5hbmltVHlwZT1udWxsLG4uYW5pbVByb3A9bnVsbCxuLmJyZWFrcG9pbnRzPVtdLG4uYnJlYWtwb2ludFNldHRpbmdzPVtdLG4uY3NzVHJhbnNpdGlvbnM9ITEsbi5mb2N1c3NlZD0hMSxuLmludGVycnVwdGVkPSExLG4uaGlkZGVuPVwiaGlkZGVuXCIsbi5wYXVzZWQ9ITAsbi5wb3NpdGlvblByb3A9bnVsbCxuLnJlc3BvbmRUbz1udWxsLG4ucm93Q291bnQ9MSxuLnNob3VsZENsaWNrPSEwLG4uJHNsaWRlcj1pKHQpLG4uJHNsaWRlc0NhY2hlPW51bGwsbi50cmFuc2Zvcm1UeXBlPW51bGwsbi50cmFuc2l0aW9uVHlwZT1udWxsLG4udmlzaWJpbGl0eUNoYW5nZT1cInZpc2liaWxpdHljaGFuZ2VcIixuLndpbmRvd1dpZHRoPTAsbi53aW5kb3dUaW1lcj1udWxsLHM9aSh0KS5kYXRhKFwic2xpY2tcIil8fHt9LG4ub3B0aW9ucz1pLmV4dGVuZCh7fSxuLmRlZmF1bHRzLG8scyksbi5jdXJyZW50U2xpZGU9bi5vcHRpb25zLmluaXRpYWxTbGlkZSxuLm9yaWdpbmFsU2V0dGluZ3M9bi5vcHRpb25zLHZvaWQgMCE9PWRvY3VtZW50Lm1vekhpZGRlbj8obi5oaWRkZW49XCJtb3pIaWRkZW5cIixuLnZpc2liaWxpdHlDaGFuZ2U9XCJtb3p2aXNpYmlsaXR5Y2hhbmdlXCIpOnZvaWQgMCE9PWRvY3VtZW50LndlYmtpdEhpZGRlbiYmKG4uaGlkZGVuPVwid2Via2l0SGlkZGVuXCIsbi52aXNpYmlsaXR5Q2hhbmdlPVwid2Via2l0dmlzaWJpbGl0eWNoYW5nZVwiKSxuLmF1dG9QbGF5PWkucHJveHkobi5hdXRvUGxheSxuKSxuLmF1dG9QbGF5Q2xlYXI9aS5wcm94eShuLmF1dG9QbGF5Q2xlYXIsbiksbi5hdXRvUGxheUl0ZXJhdG9yPWkucHJveHkobi5hdXRvUGxheUl0ZXJhdG9yLG4pLG4uY2hhbmdlU2xpZGU9aS5wcm94eShuLmNoYW5nZVNsaWRlLG4pLG4uY2xpY2tIYW5kbGVyPWkucHJveHkobi5jbGlja0hhbmRsZXIsbiksbi5zZWxlY3RIYW5kbGVyPWkucHJveHkobi5zZWxlY3RIYW5kbGVyLG4pLG4uc2V0UG9zaXRpb249aS5wcm94eShuLnNldFBvc2l0aW9uLG4pLG4uc3dpcGVIYW5kbGVyPWkucHJveHkobi5zd2lwZUhhbmRsZXIsbiksbi5kcmFnSGFuZGxlcj1pLnByb3h5KG4uZHJhZ0hhbmRsZXIsbiksbi5rZXlIYW5kbGVyPWkucHJveHkobi5rZXlIYW5kbGVyLG4pLG4uaW5zdGFuY2VVaWQ9ZSsrLG4uaHRtbEV4cHI9L14oPzpcXHMqKDxbXFx3XFxXXSs+KVtePl0qKSQvLG4ucmVnaXN0ZXJCcmVha3BvaW50cygpLG4uaW5pdCghMCl9fSgpKS5wcm90b3R5cGUuYWN0aXZhdGVBREE9ZnVuY3Rpb24oKXt0aGlzLiRzbGlkZVRyYWNrLmZpbmQoXCIuc2xpY2stYWN0aXZlXCIpLmF0dHIoe1wiYXJpYS1oaWRkZW5cIjpcImZhbHNlXCJ9KS5maW5kKFwiYSwgaW5wdXQsIGJ1dHRvbiwgc2VsZWN0XCIpLmF0dHIoe3RhYmluZGV4OlwiMFwifSl9LGUucHJvdG90eXBlLmFkZFNsaWRlPWUucHJvdG90eXBlLnNsaWNrQWRkPWZ1bmN0aW9uKGUsdCxvKXt2YXIgcz10aGlzO2lmKFwiYm9vbGVhblwiPT10eXBlb2YgdClvPXQsdD1udWxsO2Vsc2UgaWYodDwwfHx0Pj1zLnNsaWRlQ291bnQpcmV0dXJuITE7cy51bmxvYWQoKSxcIm51bWJlclwiPT10eXBlb2YgdD8wPT09dCYmMD09PXMuJHNsaWRlcy5sZW5ndGg/aShlKS5hcHBlbmRUbyhzLiRzbGlkZVRyYWNrKTpvP2koZSkuaW5zZXJ0QmVmb3JlKHMuJHNsaWRlcy5lcSh0KSk6aShlKS5pbnNlcnRBZnRlcihzLiRzbGlkZXMuZXEodCkpOiEwPT09bz9pKGUpLnByZXBlbmRUbyhzLiRzbGlkZVRyYWNrKTppKGUpLmFwcGVuZFRvKHMuJHNsaWRlVHJhY2spLHMuJHNsaWRlcz1zLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkscy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpLHMuJHNsaWRlVHJhY2suYXBwZW5kKHMuJHNsaWRlcykscy4kc2xpZGVzLmVhY2goZnVuY3Rpb24oZSx0KXtpKHQpLmF0dHIoXCJkYXRhLXNsaWNrLWluZGV4XCIsZSl9KSxzLiRzbGlkZXNDYWNoZT1zLiRzbGlkZXMscy5yZWluaXQoKX0sZS5wcm90b3R5cGUuYW5pbWF0ZUhlaWdodD1mdW5jdGlvbigpe3ZhciBpPXRoaXM7aWYoMT09PWkub3B0aW9ucy5zbGlkZXNUb1Nob3cmJiEwPT09aS5vcHRpb25zLmFkYXB0aXZlSGVpZ2h0JiYhMT09PWkub3B0aW9ucy52ZXJ0aWNhbCl7dmFyIGU9aS4kc2xpZGVzLmVxKGkuY3VycmVudFNsaWRlKS5vdXRlckhlaWdodCghMCk7aS4kbGlzdC5hbmltYXRlKHtoZWlnaHQ6ZX0saS5vcHRpb25zLnNwZWVkKX19LGUucHJvdG90eXBlLmFuaW1hdGVTbGlkZT1mdW5jdGlvbihlLHQpe3ZhciBvPXt9LHM9dGhpcztzLmFuaW1hdGVIZWlnaHQoKSwhMD09PXMub3B0aW9ucy5ydGwmJiExPT09cy5vcHRpb25zLnZlcnRpY2FsJiYoZT0tZSksITE9PT1zLnRyYW5zZm9ybXNFbmFibGVkPyExPT09cy5vcHRpb25zLnZlcnRpY2FsP3MuJHNsaWRlVHJhY2suYW5pbWF0ZSh7bGVmdDplfSxzLm9wdGlvbnMuc3BlZWQscy5vcHRpb25zLmVhc2luZyx0KTpzLiRzbGlkZVRyYWNrLmFuaW1hdGUoe3RvcDplfSxzLm9wdGlvbnMuc3BlZWQscy5vcHRpb25zLmVhc2luZyx0KTohMT09PXMuY3NzVHJhbnNpdGlvbnM/KCEwPT09cy5vcHRpb25zLnJ0bCYmKHMuY3VycmVudExlZnQ9LXMuY3VycmVudExlZnQpLGkoe2FuaW1TdGFydDpzLmN1cnJlbnRMZWZ0fSkuYW5pbWF0ZSh7YW5pbVN0YXJ0OmV9LHtkdXJhdGlvbjpzLm9wdGlvbnMuc3BlZWQsZWFzaW5nOnMub3B0aW9ucy5lYXNpbmcsc3RlcDpmdW5jdGlvbihpKXtpPU1hdGguY2VpbChpKSwhMT09PXMub3B0aW9ucy52ZXJ0aWNhbD8ob1tzLmFuaW1UeXBlXT1cInRyYW5zbGF0ZShcIitpK1wicHgsIDBweClcIixzLiRzbGlkZVRyYWNrLmNzcyhvKSk6KG9bcy5hbmltVHlwZV09XCJ0cmFuc2xhdGUoMHB4LFwiK2krXCJweClcIixzLiRzbGlkZVRyYWNrLmNzcyhvKSl9LGNvbXBsZXRlOmZ1bmN0aW9uKCl7dCYmdC5jYWxsKCl9fSkpOihzLmFwcGx5VHJhbnNpdGlvbigpLGU9TWF0aC5jZWlsKGUpLCExPT09cy5vcHRpb25zLnZlcnRpY2FsP29bcy5hbmltVHlwZV09XCJ0cmFuc2xhdGUzZChcIitlK1wicHgsIDBweCwgMHB4KVwiOm9bcy5hbmltVHlwZV09XCJ0cmFuc2xhdGUzZCgwcHgsXCIrZStcInB4LCAwcHgpXCIscy4kc2xpZGVUcmFjay5jc3MobyksdCYmc2V0VGltZW91dChmdW5jdGlvbigpe3MuZGlzYWJsZVRyYW5zaXRpb24oKSx0LmNhbGwoKX0scy5vcHRpb25zLnNwZWVkKSl9LGUucHJvdG90eXBlLmdldE5hdlRhcmdldD1mdW5jdGlvbigpe3ZhciBlPXRoaXMsdD1lLm9wdGlvbnMuYXNOYXZGb3I7cmV0dXJuIHQmJm51bGwhPT10JiYodD1pKHQpLm5vdChlLiRzbGlkZXIpKSx0fSxlLnByb3RvdHlwZS5hc05hdkZvcj1mdW5jdGlvbihlKXt2YXIgdD10aGlzLmdldE5hdlRhcmdldCgpO251bGwhPT10JiZcIm9iamVjdFwiPT10eXBlb2YgdCYmdC5lYWNoKGZ1bmN0aW9uKCl7dmFyIHQ9aSh0aGlzKS5zbGljayhcImdldFNsaWNrXCIpO3QudW5zbGlja2VkfHx0LnNsaWRlSGFuZGxlcihlLCEwKX0pfSxlLnByb3RvdHlwZS5hcHBseVRyYW5zaXRpb249ZnVuY3Rpb24oaSl7dmFyIGU9dGhpcyx0PXt9OyExPT09ZS5vcHRpb25zLmZhZGU/dFtlLnRyYW5zaXRpb25UeXBlXT1lLnRyYW5zZm9ybVR5cGUrXCIgXCIrZS5vcHRpb25zLnNwZWVkK1wibXMgXCIrZS5vcHRpb25zLmNzc0Vhc2U6dFtlLnRyYW5zaXRpb25UeXBlXT1cIm9wYWNpdHkgXCIrZS5vcHRpb25zLnNwZWVkK1wibXMgXCIrZS5vcHRpb25zLmNzc0Vhc2UsITE9PT1lLm9wdGlvbnMuZmFkZT9lLiRzbGlkZVRyYWNrLmNzcyh0KTplLiRzbGlkZXMuZXEoaSkuY3NzKHQpfSxlLnByb3RvdHlwZS5hdXRvUGxheT1mdW5jdGlvbigpe3ZhciBpPXRoaXM7aS5hdXRvUGxheUNsZWFyKCksaS5zbGlkZUNvdW50Pmkub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihpLmF1dG9QbGF5VGltZXI9c2V0SW50ZXJ2YWwoaS5hdXRvUGxheUl0ZXJhdG9yLGkub3B0aW9ucy5hdXRvcGxheVNwZWVkKSl9LGUucHJvdG90eXBlLmF1dG9QbGF5Q2xlYXI9ZnVuY3Rpb24oKXt2YXIgaT10aGlzO2kuYXV0b1BsYXlUaW1lciYmY2xlYXJJbnRlcnZhbChpLmF1dG9QbGF5VGltZXIpfSxlLnByb3RvdHlwZS5hdXRvUGxheUl0ZXJhdG9yPWZ1bmN0aW9uKCl7dmFyIGk9dGhpcyxlPWkuY3VycmVudFNsaWRlK2kub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtpLnBhdXNlZHx8aS5pbnRlcnJ1cHRlZHx8aS5mb2N1c3NlZHx8KCExPT09aS5vcHRpb25zLmluZmluaXRlJiYoMT09PWkuZGlyZWN0aW9uJiZpLmN1cnJlbnRTbGlkZSsxPT09aS5zbGlkZUNvdW50LTE/aS5kaXJlY3Rpb249MDowPT09aS5kaXJlY3Rpb24mJihlPWkuY3VycmVudFNsaWRlLWkub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCxpLmN1cnJlbnRTbGlkZS0xPT0wJiYoaS5kaXJlY3Rpb249MSkpKSxpLnNsaWRlSGFuZGxlcihlKSl9LGUucHJvdG90eXBlLmJ1aWxkQXJyb3dzPWZ1bmN0aW9uKCl7dmFyIGU9dGhpczshMD09PWUub3B0aW9ucy5hcnJvd3MmJihlLiRwcmV2QXJyb3c9aShlLm9wdGlvbnMucHJldkFycm93KS5hZGRDbGFzcyhcInNsaWNrLWFycm93XCIpLGUuJG5leHRBcnJvdz1pKGUub3B0aW9ucy5uZXh0QXJyb3cpLmFkZENsYXNzKFwic2xpY2stYXJyb3dcIiksZS5zbGlkZUNvdW50PmUub3B0aW9ucy5zbGlkZXNUb1Nob3c/KGUuJHByZXZBcnJvdy5yZW1vdmVDbGFzcyhcInNsaWNrLWhpZGRlblwiKS5yZW1vdmVBdHRyKFwiYXJpYS1oaWRkZW4gdGFiaW5kZXhcIiksZS4kbmV4dEFycm93LnJlbW92ZUNsYXNzKFwic2xpY2staGlkZGVuXCIpLnJlbW92ZUF0dHIoXCJhcmlhLWhpZGRlbiB0YWJpbmRleFwiKSxlLmh0bWxFeHByLnRlc3QoZS5vcHRpb25zLnByZXZBcnJvdykmJmUuJHByZXZBcnJvdy5wcmVwZW5kVG8oZS5vcHRpb25zLmFwcGVuZEFycm93cyksZS5odG1sRXhwci50ZXN0KGUub3B0aW9ucy5uZXh0QXJyb3cpJiZlLiRuZXh0QXJyb3cuYXBwZW5kVG8oZS5vcHRpb25zLmFwcGVuZEFycm93cyksITAhPT1lLm9wdGlvbnMuaW5maW5pdGUmJmUuJHByZXZBcnJvdy5hZGRDbGFzcyhcInNsaWNrLWRpc2FibGVkXCIpLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJ0cnVlXCIpKTplLiRwcmV2QXJyb3cuYWRkKGUuJG5leHRBcnJvdykuYWRkQ2xhc3MoXCJzbGljay1oaWRkZW5cIikuYXR0cih7XCJhcmlhLWRpc2FibGVkXCI6XCJ0cnVlXCIsdGFiaW5kZXg6XCItMVwifSkpfSxlLnByb3RvdHlwZS5idWlsZERvdHM9ZnVuY3Rpb24oKXt2YXIgZSx0LG89dGhpcztpZighMD09PW8ub3B0aW9ucy5kb3RzKXtmb3Ioby4kc2xpZGVyLmFkZENsYXNzKFwic2xpY2stZG90dGVkXCIpLHQ9aShcIjx1bCAvPlwiKS5hZGRDbGFzcyhvLm9wdGlvbnMuZG90c0NsYXNzKSxlPTA7ZTw9by5nZXREb3RDb3VudCgpO2UrPTEpdC5hcHBlbmQoaShcIjxsaSAvPlwiKS5hcHBlbmQoby5vcHRpb25zLmN1c3RvbVBhZ2luZy5jYWxsKHRoaXMsbyxlKSkpO28uJGRvdHM9dC5hcHBlbmRUbyhvLm9wdGlvbnMuYXBwZW5kRG90cyksby4kZG90cy5maW5kKFwibGlcIikuZmlyc3QoKS5hZGRDbGFzcyhcInNsaWNrLWFjdGl2ZVwiKX19LGUucHJvdG90eXBlLmJ1aWxkT3V0PWZ1bmN0aW9uKCl7dmFyIGU9dGhpcztlLiRzbGlkZXM9ZS4kc2xpZGVyLmNoaWxkcmVuKGUub3B0aW9ucy5zbGlkZStcIjpub3QoLnNsaWNrLWNsb25lZClcIikuYWRkQ2xhc3MoXCJzbGljay1zbGlkZVwiKSxlLnNsaWRlQ291bnQ9ZS4kc2xpZGVzLmxlbmd0aCxlLiRzbGlkZXMuZWFjaChmdW5jdGlvbihlLHQpe2kodCkuYXR0cihcImRhdGEtc2xpY2staW5kZXhcIixlKS5kYXRhKFwib3JpZ2luYWxTdHlsaW5nXCIsaSh0KS5hdHRyKFwic3R5bGVcIil8fFwiXCIpfSksZS4kc2xpZGVyLmFkZENsYXNzKFwic2xpY2stc2xpZGVyXCIpLGUuJHNsaWRlVHJhY2s9MD09PWUuc2xpZGVDb3VudD9pKCc8ZGl2IGNsYXNzPVwic2xpY2stdHJhY2tcIi8+JykuYXBwZW5kVG8oZS4kc2xpZGVyKTplLiRzbGlkZXMud3JhcEFsbCgnPGRpdiBjbGFzcz1cInNsaWNrLXRyYWNrXCIvPicpLnBhcmVudCgpLGUuJGxpc3Q9ZS4kc2xpZGVUcmFjay53cmFwKCc8ZGl2IGNsYXNzPVwic2xpY2stbGlzdFwiLz4nKS5wYXJlbnQoKSxlLiRzbGlkZVRyYWNrLmNzcyhcIm9wYWNpdHlcIiwwKSwhMCE9PWUub3B0aW9ucy5jZW50ZXJNb2RlJiYhMCE9PWUub3B0aW9ucy5zd2lwZVRvU2xpZGV8fChlLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw9MSksaShcImltZ1tkYXRhLWxhenldXCIsZS4kc2xpZGVyKS5ub3QoXCJbc3JjXVwiKS5hZGRDbGFzcyhcInNsaWNrLWxvYWRpbmdcIiksZS5zZXR1cEluZmluaXRlKCksZS5idWlsZEFycm93cygpLGUuYnVpbGREb3RzKCksZS51cGRhdGVEb3RzKCksZS5zZXRTbGlkZUNsYXNzZXMoXCJudW1iZXJcIj09dHlwZW9mIGUuY3VycmVudFNsaWRlP2UuY3VycmVudFNsaWRlOjApLCEwPT09ZS5vcHRpb25zLmRyYWdnYWJsZSYmZS4kbGlzdC5hZGRDbGFzcyhcImRyYWdnYWJsZVwiKX0sZS5wcm90b3R5cGUuYnVpbGRSb3dzPWZ1bmN0aW9uKCl7dmFyIGksZSx0LG8scyxuLHIsbD10aGlzO2lmKG89ZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLG49bC4kc2xpZGVyLmNoaWxkcmVuKCksbC5vcHRpb25zLnJvd3M+MSl7Zm9yKHI9bC5vcHRpb25zLnNsaWRlc1BlclJvdypsLm9wdGlvbnMucm93cyxzPU1hdGguY2VpbChuLmxlbmd0aC9yKSxpPTA7aTxzO2krKyl7dmFyIGQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtmb3IoZT0wO2U8bC5vcHRpb25zLnJvd3M7ZSsrKXt2YXIgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2Zvcih0PTA7dDxsLm9wdGlvbnMuc2xpZGVzUGVyUm93O3QrKyl7dmFyIGM9aSpyKyhlKmwub3B0aW9ucy5zbGlkZXNQZXJSb3crdCk7bi5nZXQoYykmJmEuYXBwZW5kQ2hpbGQobi5nZXQoYykpfWQuYXBwZW5kQ2hpbGQoYSl9by5hcHBlbmRDaGlsZChkKX1sLiRzbGlkZXIuZW1wdHkoKS5hcHBlbmQobyksbC4kc2xpZGVyLmNoaWxkcmVuKCkuY2hpbGRyZW4oKS5jaGlsZHJlbigpLmNzcyh7d2lkdGg6MTAwL2wub3B0aW9ucy5zbGlkZXNQZXJSb3crXCIlXCIsZGlzcGxheTpcImlubGluZS1ibG9ja1wifSl9fSxlLnByb3RvdHlwZS5jaGVja1Jlc3BvbnNpdmU9ZnVuY3Rpb24oZSx0KXt2YXIgbyxzLG4scj10aGlzLGw9ITEsZD1yLiRzbGlkZXIud2lkdGgoKSxhPXdpbmRvdy5pbm5lcldpZHRofHxpKHdpbmRvdykud2lkdGgoKTtpZihcIndpbmRvd1wiPT09ci5yZXNwb25kVG8/bj1hOlwic2xpZGVyXCI9PT1yLnJlc3BvbmRUbz9uPWQ6XCJtaW5cIj09PXIucmVzcG9uZFRvJiYobj1NYXRoLm1pbihhLGQpKSxyLm9wdGlvbnMucmVzcG9uc2l2ZSYmci5vcHRpb25zLnJlc3BvbnNpdmUubGVuZ3RoJiZudWxsIT09ci5vcHRpb25zLnJlc3BvbnNpdmUpe3M9bnVsbDtmb3IobyBpbiByLmJyZWFrcG9pbnRzKXIuYnJlYWtwb2ludHMuaGFzT3duUHJvcGVydHkobykmJighMT09PXIub3JpZ2luYWxTZXR0aW5ncy5tb2JpbGVGaXJzdD9uPHIuYnJlYWtwb2ludHNbb10mJihzPXIuYnJlYWtwb2ludHNbb10pOm4+ci5icmVha3BvaW50c1tvXSYmKHM9ci5icmVha3BvaW50c1tvXSkpO251bGwhPT1zP251bGwhPT1yLmFjdGl2ZUJyZWFrcG9pbnQ/KHMhPT1yLmFjdGl2ZUJyZWFrcG9pbnR8fHQpJiYoci5hY3RpdmVCcmVha3BvaW50PXMsXCJ1bnNsaWNrXCI9PT1yLmJyZWFrcG9pbnRTZXR0aW5nc1tzXT9yLnVuc2xpY2socyk6KHIub3B0aW9ucz1pLmV4dGVuZCh7fSxyLm9yaWdpbmFsU2V0dGluZ3Msci5icmVha3BvaW50U2V0dGluZ3Nbc10pLCEwPT09ZSYmKHIuY3VycmVudFNsaWRlPXIub3B0aW9ucy5pbml0aWFsU2xpZGUpLHIucmVmcmVzaChlKSksbD1zKTooci5hY3RpdmVCcmVha3BvaW50PXMsXCJ1bnNsaWNrXCI9PT1yLmJyZWFrcG9pbnRTZXR0aW5nc1tzXT9yLnVuc2xpY2socyk6KHIub3B0aW9ucz1pLmV4dGVuZCh7fSxyLm9yaWdpbmFsU2V0dGluZ3Msci5icmVha3BvaW50U2V0dGluZ3Nbc10pLCEwPT09ZSYmKHIuY3VycmVudFNsaWRlPXIub3B0aW9ucy5pbml0aWFsU2xpZGUpLHIucmVmcmVzaChlKSksbD1zKTpudWxsIT09ci5hY3RpdmVCcmVha3BvaW50JiYoci5hY3RpdmVCcmVha3BvaW50PW51bGwsci5vcHRpb25zPXIub3JpZ2luYWxTZXR0aW5ncywhMD09PWUmJihyLmN1cnJlbnRTbGlkZT1yLm9wdGlvbnMuaW5pdGlhbFNsaWRlKSxyLnJlZnJlc2goZSksbD1zKSxlfHwhMT09PWx8fHIuJHNsaWRlci50cmlnZ2VyKFwiYnJlYWtwb2ludFwiLFtyLGxdKX19LGUucHJvdG90eXBlLmNoYW5nZVNsaWRlPWZ1bmN0aW9uKGUsdCl7dmFyIG8scyxuLHI9dGhpcyxsPWkoZS5jdXJyZW50VGFyZ2V0KTtzd2l0Y2gobC5pcyhcImFcIikmJmUucHJldmVudERlZmF1bHQoKSxsLmlzKFwibGlcIil8fChsPWwuY2xvc2VzdChcImxpXCIpKSxuPXIuc2xpZGVDb3VudCVyLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwhPTAsbz1uPzA6KHIuc2xpZGVDb3VudC1yLmN1cnJlbnRTbGlkZSklci5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsLGUuZGF0YS5tZXNzYWdlKXtjYXNlXCJwcmV2aW91c1wiOnM9MD09PW8/ci5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsOnIub3B0aW9ucy5zbGlkZXNUb1Nob3ctbyxyLnNsaWRlQ291bnQ+ci5vcHRpb25zLnNsaWRlc1RvU2hvdyYmci5zbGlkZUhhbmRsZXIoci5jdXJyZW50U2xpZGUtcywhMSx0KTticmVhaztjYXNlXCJuZXh0XCI6cz0wPT09bz9yLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw6byxyLnNsaWRlQ291bnQ+ci5vcHRpb25zLnNsaWRlc1RvU2hvdyYmci5zbGlkZUhhbmRsZXIoci5jdXJyZW50U2xpZGUrcywhMSx0KTticmVhaztjYXNlXCJpbmRleFwiOnZhciBkPTA9PT1lLmRhdGEuaW5kZXg/MDplLmRhdGEuaW5kZXh8fGwuaW5kZXgoKSpyLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7ci5zbGlkZUhhbmRsZXIoci5jaGVja05hdmlnYWJsZShkKSwhMSx0KSxsLmNoaWxkcmVuKCkudHJpZ2dlcihcImZvY3VzXCIpO2JyZWFrO2RlZmF1bHQ6cmV0dXJufX0sZS5wcm90b3R5cGUuY2hlY2tOYXZpZ2FibGU9ZnVuY3Rpb24oaSl7dmFyIGUsdDtpZihlPXRoaXMuZ2V0TmF2aWdhYmxlSW5kZXhlcygpLHQ9MCxpPmVbZS5sZW5ndGgtMV0paT1lW2UubGVuZ3RoLTFdO2Vsc2UgZm9yKHZhciBvIGluIGUpe2lmKGk8ZVtvXSl7aT10O2JyZWFrfXQ9ZVtvXX1yZXR1cm4gaX0sZS5wcm90b3R5cGUuY2xlYW5VcEV2ZW50cz1mdW5jdGlvbigpe3ZhciBlPXRoaXM7ZS5vcHRpb25zLmRvdHMmJm51bGwhPT1lLiRkb3RzJiYoaShcImxpXCIsZS4kZG90cykub2ZmKFwiY2xpY2suc2xpY2tcIixlLmNoYW5nZVNsaWRlKS5vZmYoXCJtb3VzZWVudGVyLnNsaWNrXCIsaS5wcm94eShlLmludGVycnVwdCxlLCEwKSkub2ZmKFwibW91c2VsZWF2ZS5zbGlja1wiLGkucHJveHkoZS5pbnRlcnJ1cHQsZSwhMSkpLCEwPT09ZS5vcHRpb25zLmFjY2Vzc2liaWxpdHkmJmUuJGRvdHMub2ZmKFwia2V5ZG93bi5zbGlja1wiLGUua2V5SGFuZGxlcikpLGUuJHNsaWRlci5vZmYoXCJmb2N1cy5zbGljayBibHVyLnNsaWNrXCIpLCEwPT09ZS5vcHRpb25zLmFycm93cyYmZS5zbGlkZUNvdW50PmUub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihlLiRwcmV2QXJyb3cmJmUuJHByZXZBcnJvdy5vZmYoXCJjbGljay5zbGlja1wiLGUuY2hhbmdlU2xpZGUpLGUuJG5leHRBcnJvdyYmZS4kbmV4dEFycm93Lm9mZihcImNsaWNrLnNsaWNrXCIsZS5jaGFuZ2VTbGlkZSksITA9PT1lLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSYmKGUuJHByZXZBcnJvdyYmZS4kcHJldkFycm93Lm9mZihcImtleWRvd24uc2xpY2tcIixlLmtleUhhbmRsZXIpLGUuJG5leHRBcnJvdyYmZS4kbmV4dEFycm93Lm9mZihcImtleWRvd24uc2xpY2tcIixlLmtleUhhbmRsZXIpKSksZS4kbGlzdC5vZmYoXCJ0b3VjaHN0YXJ0LnNsaWNrIG1vdXNlZG93bi5zbGlja1wiLGUuc3dpcGVIYW5kbGVyKSxlLiRsaXN0Lm9mZihcInRvdWNobW92ZS5zbGljayBtb3VzZW1vdmUuc2xpY2tcIixlLnN3aXBlSGFuZGxlciksZS4kbGlzdC5vZmYoXCJ0b3VjaGVuZC5zbGljayBtb3VzZXVwLnNsaWNrXCIsZS5zd2lwZUhhbmRsZXIpLGUuJGxpc3Qub2ZmKFwidG91Y2hjYW5jZWwuc2xpY2sgbW91c2VsZWF2ZS5zbGlja1wiLGUuc3dpcGVIYW5kbGVyKSxlLiRsaXN0Lm9mZihcImNsaWNrLnNsaWNrXCIsZS5jbGlja0hhbmRsZXIpLGkoZG9jdW1lbnQpLm9mZihlLnZpc2liaWxpdHlDaGFuZ2UsZS52aXNpYmlsaXR5KSxlLmNsZWFuVXBTbGlkZUV2ZW50cygpLCEwPT09ZS5vcHRpb25zLmFjY2Vzc2liaWxpdHkmJmUuJGxpc3Qub2ZmKFwia2V5ZG93bi5zbGlja1wiLGUua2V5SGFuZGxlciksITA9PT1lLm9wdGlvbnMuZm9jdXNPblNlbGVjdCYmaShlLiRzbGlkZVRyYWNrKS5jaGlsZHJlbigpLm9mZihcImNsaWNrLnNsaWNrXCIsZS5zZWxlY3RIYW5kbGVyKSxpKHdpbmRvdykub2ZmKFwib3JpZW50YXRpb25jaGFuZ2Uuc2xpY2suc2xpY2stXCIrZS5pbnN0YW5jZVVpZCxlLm9yaWVudGF0aW9uQ2hhbmdlKSxpKHdpbmRvdykub2ZmKFwicmVzaXplLnNsaWNrLnNsaWNrLVwiK2UuaW5zdGFuY2VVaWQsZS5yZXNpemUpLGkoXCJbZHJhZ2dhYmxlIT10cnVlXVwiLGUuJHNsaWRlVHJhY2spLm9mZihcImRyYWdzdGFydFwiLGUucHJldmVudERlZmF1bHQpLGkod2luZG93KS5vZmYoXCJsb2FkLnNsaWNrLnNsaWNrLVwiK2UuaW5zdGFuY2VVaWQsZS5zZXRQb3NpdGlvbil9LGUucHJvdG90eXBlLmNsZWFuVXBTbGlkZUV2ZW50cz1mdW5jdGlvbigpe3ZhciBlPXRoaXM7ZS4kbGlzdC5vZmYoXCJtb3VzZWVudGVyLnNsaWNrXCIsaS5wcm94eShlLmludGVycnVwdCxlLCEwKSksZS4kbGlzdC5vZmYoXCJtb3VzZWxlYXZlLnNsaWNrXCIsaS5wcm94eShlLmludGVycnVwdCxlLCExKSl9LGUucHJvdG90eXBlLmNsZWFuVXBSb3dzPWZ1bmN0aW9uKCl7dmFyIGksZT10aGlzO2Uub3B0aW9ucy5yb3dzPjEmJigoaT1lLiRzbGlkZXMuY2hpbGRyZW4oKS5jaGlsZHJlbigpKS5yZW1vdmVBdHRyKFwic3R5bGVcIiksZS4kc2xpZGVyLmVtcHR5KCkuYXBwZW5kKGkpKX0sZS5wcm90b3R5cGUuY2xpY2tIYW5kbGVyPWZ1bmN0aW9uKGkpeyExPT09dGhpcy5zaG91bGRDbGljayYmKGkuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCksaS5zdG9wUHJvcGFnYXRpb24oKSxpLnByZXZlbnREZWZhdWx0KCkpfSxlLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXM7dC5hdXRvUGxheUNsZWFyKCksdC50b3VjaE9iamVjdD17fSx0LmNsZWFuVXBFdmVudHMoKSxpKFwiLnNsaWNrLWNsb25lZFwiLHQuJHNsaWRlcikuZGV0YWNoKCksdC4kZG90cyYmdC4kZG90cy5yZW1vdmUoKSx0LiRwcmV2QXJyb3cmJnQuJHByZXZBcnJvdy5sZW5ndGgmJih0LiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoXCJzbGljay1kaXNhYmxlZCBzbGljay1hcnJvdyBzbGljay1oaWRkZW5cIikucmVtb3ZlQXR0cihcImFyaWEtaGlkZGVuIGFyaWEtZGlzYWJsZWQgdGFiaW5kZXhcIikuY3NzKFwiZGlzcGxheVwiLFwiXCIpLHQuaHRtbEV4cHIudGVzdCh0Lm9wdGlvbnMucHJldkFycm93KSYmdC4kcHJldkFycm93LnJlbW92ZSgpKSx0LiRuZXh0QXJyb3cmJnQuJG5leHRBcnJvdy5sZW5ndGgmJih0LiRuZXh0QXJyb3cucmVtb3ZlQ2xhc3MoXCJzbGljay1kaXNhYmxlZCBzbGljay1hcnJvdyBzbGljay1oaWRkZW5cIikucmVtb3ZlQXR0cihcImFyaWEtaGlkZGVuIGFyaWEtZGlzYWJsZWQgdGFiaW5kZXhcIikuY3NzKFwiZGlzcGxheVwiLFwiXCIpLHQuaHRtbEV4cHIudGVzdCh0Lm9wdGlvbnMubmV4dEFycm93KSYmdC4kbmV4dEFycm93LnJlbW92ZSgpKSx0LiRzbGlkZXMmJih0LiRzbGlkZXMucmVtb3ZlQ2xhc3MoXCJzbGljay1zbGlkZSBzbGljay1hY3RpdmUgc2xpY2stY2VudGVyIHNsaWNrLXZpc2libGUgc2xpY2stY3VycmVudFwiKS5yZW1vdmVBdHRyKFwiYXJpYS1oaWRkZW5cIikucmVtb3ZlQXR0cihcImRhdGEtc2xpY2staW5kZXhcIikuZWFjaChmdW5jdGlvbigpe2kodGhpcykuYXR0cihcInN0eWxlXCIsaSh0aGlzKS5kYXRhKFwib3JpZ2luYWxTdHlsaW5nXCIpKX0pLHQuJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5kZXRhY2goKSx0LiRzbGlkZVRyYWNrLmRldGFjaCgpLHQuJGxpc3QuZGV0YWNoKCksdC4kc2xpZGVyLmFwcGVuZCh0LiRzbGlkZXMpKSx0LmNsZWFuVXBSb3dzKCksdC4kc2xpZGVyLnJlbW92ZUNsYXNzKFwic2xpY2stc2xpZGVyXCIpLHQuJHNsaWRlci5yZW1vdmVDbGFzcyhcInNsaWNrLWluaXRpYWxpemVkXCIpLHQuJHNsaWRlci5yZW1vdmVDbGFzcyhcInNsaWNrLWRvdHRlZFwiKSx0LnVuc2xpY2tlZD0hMCxlfHx0LiRzbGlkZXIudHJpZ2dlcihcImRlc3Ryb3lcIixbdF0pfSxlLnByb3RvdHlwZS5kaXNhYmxlVHJhbnNpdGlvbj1mdW5jdGlvbihpKXt2YXIgZT10aGlzLHQ9e307dFtlLnRyYW5zaXRpb25UeXBlXT1cIlwiLCExPT09ZS5vcHRpb25zLmZhZGU/ZS4kc2xpZGVUcmFjay5jc3ModCk6ZS4kc2xpZGVzLmVxKGkpLmNzcyh0KX0sZS5wcm90b3R5cGUuZmFkZVNsaWRlPWZ1bmN0aW9uKGksZSl7dmFyIHQ9dGhpczshMT09PXQuY3NzVHJhbnNpdGlvbnM/KHQuJHNsaWRlcy5lcShpKS5jc3Moe3pJbmRleDp0Lm9wdGlvbnMuekluZGV4fSksdC4kc2xpZGVzLmVxKGkpLmFuaW1hdGUoe29wYWNpdHk6MX0sdC5vcHRpb25zLnNwZWVkLHQub3B0aW9ucy5lYXNpbmcsZSkpOih0LmFwcGx5VHJhbnNpdGlvbihpKSx0LiRzbGlkZXMuZXEoaSkuY3NzKHtvcGFjaXR5OjEsekluZGV4OnQub3B0aW9ucy56SW5kZXh9KSxlJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dC5kaXNhYmxlVHJhbnNpdGlvbihpKSxlLmNhbGwoKX0sdC5vcHRpb25zLnNwZWVkKSl9LGUucHJvdG90eXBlLmZhZGVTbGlkZU91dD1mdW5jdGlvbihpKXt2YXIgZT10aGlzOyExPT09ZS5jc3NUcmFuc2l0aW9ucz9lLiRzbGlkZXMuZXEoaSkuYW5pbWF0ZSh7b3BhY2l0eTowLHpJbmRleDplLm9wdGlvbnMuekluZGV4LTJ9LGUub3B0aW9ucy5zcGVlZCxlLm9wdGlvbnMuZWFzaW5nKTooZS5hcHBseVRyYW5zaXRpb24oaSksZS4kc2xpZGVzLmVxKGkpLmNzcyh7b3BhY2l0eTowLHpJbmRleDplLm9wdGlvbnMuekluZGV4LTJ9KSl9LGUucHJvdG90eXBlLmZpbHRlclNsaWRlcz1lLnByb3RvdHlwZS5zbGlja0ZpbHRlcj1mdW5jdGlvbihpKXt2YXIgZT10aGlzO251bGwhPT1pJiYoZS4kc2xpZGVzQ2FjaGU9ZS4kc2xpZGVzLGUudW5sb2FkKCksZS4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpLGUuJHNsaWRlc0NhY2hlLmZpbHRlcihpKS5hcHBlbmRUbyhlLiRzbGlkZVRyYWNrKSxlLnJlaW5pdCgpKX0sZS5wcm90b3R5cGUuZm9jdXNIYW5kbGVyPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcztlLiRzbGlkZXIub2ZmKFwiZm9jdXMuc2xpY2sgYmx1ci5zbGlja1wiKS5vbihcImZvY3VzLnNsaWNrIGJsdXIuc2xpY2tcIixcIipcIixmdW5jdGlvbih0KXt0LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO3ZhciBvPWkodGhpcyk7c2V0VGltZW91dChmdW5jdGlvbigpe2Uub3B0aW9ucy5wYXVzZU9uRm9jdXMmJihlLmZvY3Vzc2VkPW8uaXMoXCI6Zm9jdXNcIiksZS5hdXRvUGxheSgpKX0sMCl9KX0sZS5wcm90b3R5cGUuZ2V0Q3VycmVudD1lLnByb3RvdHlwZS5zbGlja0N1cnJlbnRTbGlkZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmN1cnJlbnRTbGlkZX0sZS5wcm90b3R5cGUuZ2V0RG90Q291bnQ9ZnVuY3Rpb24oKXt2YXIgaT10aGlzLGU9MCx0PTAsbz0wO2lmKCEwPT09aS5vcHRpb25zLmluZmluaXRlKWlmKGkuc2xpZGVDb3VudDw9aS5vcHRpb25zLnNsaWRlc1RvU2hvdykrK287ZWxzZSBmb3IoO2U8aS5zbGlkZUNvdW50OykrK28sZT10K2kub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCx0Kz1pLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw8PWkub3B0aW9ucy5zbGlkZXNUb1Nob3c/aS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsOmkub3B0aW9ucy5zbGlkZXNUb1Nob3c7ZWxzZSBpZighMD09PWkub3B0aW9ucy5jZW50ZXJNb2RlKW89aS5zbGlkZUNvdW50O2Vsc2UgaWYoaS5vcHRpb25zLmFzTmF2Rm9yKWZvcig7ZTxpLnNsaWRlQ291bnQ7KSsrbyxlPXQraS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsLHQrPWkub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDw9aS5vcHRpb25zLnNsaWRlc1RvU2hvdz9pLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw6aS5vcHRpb25zLnNsaWRlc1RvU2hvdztlbHNlIG89MStNYXRoLmNlaWwoKGkuc2xpZGVDb3VudC1pLm9wdGlvbnMuc2xpZGVzVG9TaG93KS9pLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpO3JldHVybiBvLTF9LGUucHJvdG90eXBlLmdldExlZnQ9ZnVuY3Rpb24oaSl7dmFyIGUsdCxvLHMsbj10aGlzLHI9MDtyZXR1cm4gbi5zbGlkZU9mZnNldD0wLHQ9bi4kc2xpZGVzLmZpcnN0KCkub3V0ZXJIZWlnaHQoITApLCEwPT09bi5vcHRpb25zLmluZmluaXRlPyhuLnNsaWRlQ291bnQ+bi5vcHRpb25zLnNsaWRlc1RvU2hvdyYmKG4uc2xpZGVPZmZzZXQ9bi5zbGlkZVdpZHRoKm4ub3B0aW9ucy5zbGlkZXNUb1Nob3cqLTEscz0tMSwhMD09PW4ub3B0aW9ucy52ZXJ0aWNhbCYmITA9PT1uLm9wdGlvbnMuY2VudGVyTW9kZSYmKDI9PT1uLm9wdGlvbnMuc2xpZGVzVG9TaG93P3M9LTEuNToxPT09bi5vcHRpb25zLnNsaWRlc1RvU2hvdyYmKHM9LTIpKSxyPXQqbi5vcHRpb25zLnNsaWRlc1RvU2hvdypzKSxuLnNsaWRlQ291bnQlbi5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIT0wJiZpK24ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbD5uLnNsaWRlQ291bnQmJm4uc2xpZGVDb3VudD5uLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYoaT5uLnNsaWRlQ291bnQ/KG4uc2xpZGVPZmZzZXQ9KG4ub3B0aW9ucy5zbGlkZXNUb1Nob3ctKGktbi5zbGlkZUNvdW50KSkqbi5zbGlkZVdpZHRoKi0xLHI9KG4ub3B0aW9ucy5zbGlkZXNUb1Nob3ctKGktbi5zbGlkZUNvdW50KSkqdCotMSk6KG4uc2xpZGVPZmZzZXQ9bi5zbGlkZUNvdW50JW4ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCpuLnNsaWRlV2lkdGgqLTEscj1uLnNsaWRlQ291bnQlbi5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKnQqLTEpKSk6aStuLm9wdGlvbnMuc2xpZGVzVG9TaG93Pm4uc2xpZGVDb3VudCYmKG4uc2xpZGVPZmZzZXQ9KGkrbi5vcHRpb25zLnNsaWRlc1RvU2hvdy1uLnNsaWRlQ291bnQpKm4uc2xpZGVXaWR0aCxyPShpK24ub3B0aW9ucy5zbGlkZXNUb1Nob3ctbi5zbGlkZUNvdW50KSp0KSxuLnNsaWRlQ291bnQ8PW4ub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihuLnNsaWRlT2Zmc2V0PTAscj0wKSwhMD09PW4ub3B0aW9ucy5jZW50ZXJNb2RlJiZuLnNsaWRlQ291bnQ8PW4ub3B0aW9ucy5zbGlkZXNUb1Nob3c/bi5zbGlkZU9mZnNldD1uLnNsaWRlV2lkdGgqTWF0aC5mbG9vcihuLm9wdGlvbnMuc2xpZGVzVG9TaG93KS8yLW4uc2xpZGVXaWR0aCpuLnNsaWRlQ291bnQvMjohMD09PW4ub3B0aW9ucy5jZW50ZXJNb2RlJiYhMD09PW4ub3B0aW9ucy5pbmZpbml0ZT9uLnNsaWRlT2Zmc2V0Kz1uLnNsaWRlV2lkdGgqTWF0aC5mbG9vcihuLm9wdGlvbnMuc2xpZGVzVG9TaG93LzIpLW4uc2xpZGVXaWR0aDohMD09PW4ub3B0aW9ucy5jZW50ZXJNb2RlJiYobi5zbGlkZU9mZnNldD0wLG4uc2xpZGVPZmZzZXQrPW4uc2xpZGVXaWR0aCpNYXRoLmZsb29yKG4ub3B0aW9ucy5zbGlkZXNUb1Nob3cvMikpLGU9ITE9PT1uLm9wdGlvbnMudmVydGljYWw/aSpuLnNsaWRlV2lkdGgqLTErbi5zbGlkZU9mZnNldDppKnQqLTErciwhMD09PW4ub3B0aW9ucy52YXJpYWJsZVdpZHRoJiYobz1uLnNsaWRlQ291bnQ8PW4ub3B0aW9ucy5zbGlkZXNUb1Nob3d8fCExPT09bi5vcHRpb25zLmluZmluaXRlP24uJHNsaWRlVHJhY2suY2hpbGRyZW4oXCIuc2xpY2stc2xpZGVcIikuZXEoaSk6bi4kc2xpZGVUcmFjay5jaGlsZHJlbihcIi5zbGljay1zbGlkZVwiKS5lcShpK24ub3B0aW9ucy5zbGlkZXNUb1Nob3cpLGU9ITA9PT1uLm9wdGlvbnMucnRsP29bMF0/LTEqKG4uJHNsaWRlVHJhY2sud2lkdGgoKS1vWzBdLm9mZnNldExlZnQtby53aWR0aCgpKTowOm9bMF0/LTEqb1swXS5vZmZzZXRMZWZ0OjAsITA9PT1uLm9wdGlvbnMuY2VudGVyTW9kZSYmKG89bi5zbGlkZUNvdW50PD1uLm9wdGlvbnMuc2xpZGVzVG9TaG93fHwhMT09PW4ub3B0aW9ucy5pbmZpbml0ZT9uLiRzbGlkZVRyYWNrLmNoaWxkcmVuKFwiLnNsaWNrLXNsaWRlXCIpLmVxKGkpOm4uJHNsaWRlVHJhY2suY2hpbGRyZW4oXCIuc2xpY2stc2xpZGVcIikuZXEoaStuLm9wdGlvbnMuc2xpZGVzVG9TaG93KzEpLGU9ITA9PT1uLm9wdGlvbnMucnRsP29bMF0/LTEqKG4uJHNsaWRlVHJhY2sud2lkdGgoKS1vWzBdLm9mZnNldExlZnQtby53aWR0aCgpKTowOm9bMF0/LTEqb1swXS5vZmZzZXRMZWZ0OjAsZSs9KG4uJGxpc3Qud2lkdGgoKS1vLm91dGVyV2lkdGgoKSkvMikpLGV9LGUucHJvdG90eXBlLmdldE9wdGlvbj1lLnByb3RvdHlwZS5zbGlja0dldE9wdGlvbj1mdW5jdGlvbihpKXtyZXR1cm4gdGhpcy5vcHRpb25zW2ldfSxlLnByb3RvdHlwZS5nZXROYXZpZ2FibGVJbmRleGVzPWZ1bmN0aW9uKCl7dmFyIGksZT10aGlzLHQ9MCxvPTAscz1bXTtmb3IoITE9PT1lLm9wdGlvbnMuaW5maW5pdGU/aT1lLnNsaWRlQ291bnQ6KHQ9LTEqZS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsLG89LTEqZS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsLGk9MiplLnNsaWRlQ291bnQpO3Q8aTspcy5wdXNoKHQpLHQ9bytlLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwsbys9ZS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsPD1lLm9wdGlvbnMuc2xpZGVzVG9TaG93P2Uub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDplLm9wdGlvbnMuc2xpZGVzVG9TaG93O3JldHVybiBzfSxlLnByb3RvdHlwZS5nZXRTbGljaz1mdW5jdGlvbigpe3JldHVybiB0aGlzfSxlLnByb3RvdHlwZS5nZXRTbGlkZUNvdW50PWZ1bmN0aW9uKCl7dmFyIGUsdCxvPXRoaXM7cmV0dXJuIHQ9ITA9PT1vLm9wdGlvbnMuY2VudGVyTW9kZT9vLnNsaWRlV2lkdGgqTWF0aC5mbG9vcihvLm9wdGlvbnMuc2xpZGVzVG9TaG93LzIpOjAsITA9PT1vLm9wdGlvbnMuc3dpcGVUb1NsaWRlPyhvLiRzbGlkZVRyYWNrLmZpbmQoXCIuc2xpY2stc2xpZGVcIikuZWFjaChmdW5jdGlvbihzLG4pe2lmKG4ub2Zmc2V0TGVmdC10K2kobikub3V0ZXJXaWR0aCgpLzI+LTEqby5zd2lwZUxlZnQpcmV0dXJuIGU9biwhMX0pLE1hdGguYWJzKGkoZSkuYXR0cihcImRhdGEtc2xpY2staW5kZXhcIiktby5jdXJyZW50U2xpZGUpfHwxKTpvLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGx9LGUucHJvdG90eXBlLmdvVG89ZS5wcm90b3R5cGUuc2xpY2tHb1RvPWZ1bmN0aW9uKGksZSl7dGhpcy5jaGFuZ2VTbGlkZSh7ZGF0YTp7bWVzc2FnZTpcImluZGV4XCIsaW5kZXg6cGFyc2VJbnQoaSl9fSxlKX0sZS5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbihlKXt2YXIgdD10aGlzO2kodC4kc2xpZGVyKS5oYXNDbGFzcyhcInNsaWNrLWluaXRpYWxpemVkXCIpfHwoaSh0LiRzbGlkZXIpLmFkZENsYXNzKFwic2xpY2staW5pdGlhbGl6ZWRcIiksdC5idWlsZFJvd3MoKSx0LmJ1aWxkT3V0KCksdC5zZXRQcm9wcygpLHQuc3RhcnRMb2FkKCksdC5sb2FkU2xpZGVyKCksdC5pbml0aWFsaXplRXZlbnRzKCksdC51cGRhdGVBcnJvd3MoKSx0LnVwZGF0ZURvdHMoKSx0LmNoZWNrUmVzcG9uc2l2ZSghMCksdC5mb2N1c0hhbmRsZXIoKSksZSYmdC4kc2xpZGVyLnRyaWdnZXIoXCJpbml0XCIsW3RdKSwhMD09PXQub3B0aW9ucy5hY2Nlc3NpYmlsaXR5JiZ0LmluaXRBREEoKSx0Lm9wdGlvbnMuYXV0b3BsYXkmJih0LnBhdXNlZD0hMSx0LmF1dG9QbGF5KCkpfSxlLnByb3RvdHlwZS5pbml0QURBPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcyx0PU1hdGguY2VpbChlLnNsaWRlQ291bnQvZS5vcHRpb25zLnNsaWRlc1RvU2hvdyksbz1lLmdldE5hdmlnYWJsZUluZGV4ZXMoKS5maWx0ZXIoZnVuY3Rpb24oaSl7cmV0dXJuIGk+PTAmJmk8ZS5zbGlkZUNvdW50fSk7ZS4kc2xpZGVzLmFkZChlLiRzbGlkZVRyYWNrLmZpbmQoXCIuc2xpY2stY2xvbmVkXCIpKS5hdHRyKHtcImFyaWEtaGlkZGVuXCI6XCJ0cnVlXCIsdGFiaW5kZXg6XCItMVwifSkuZmluZChcImEsIGlucHV0LCBidXR0b24sIHNlbGVjdFwiKS5hdHRyKHt0YWJpbmRleDpcIi0xXCJ9KSxudWxsIT09ZS4kZG90cyYmKGUuJHNsaWRlcy5ub3QoZS4kc2xpZGVUcmFjay5maW5kKFwiLnNsaWNrLWNsb25lZFwiKSkuZWFjaChmdW5jdGlvbih0KXt2YXIgcz1vLmluZGV4T2YodCk7aSh0aGlzKS5hdHRyKHtyb2xlOlwidGFicGFuZWxcIixpZDpcInNsaWNrLXNsaWRlXCIrZS5pbnN0YW5jZVVpZCt0LHRhYmluZGV4Oi0xfSksLTEhPT1zJiZpKHRoaXMpLmF0dHIoe1wiYXJpYS1kZXNjcmliZWRieVwiOlwic2xpY2stc2xpZGUtY29udHJvbFwiK2UuaW5zdGFuY2VVaWQrc30pfSksZS4kZG90cy5hdHRyKFwicm9sZVwiLFwidGFibGlzdFwiKS5maW5kKFwibGlcIikuZWFjaChmdW5jdGlvbihzKXt2YXIgbj1vW3NdO2kodGhpcykuYXR0cih7cm9sZTpcInByZXNlbnRhdGlvblwifSksaSh0aGlzKS5maW5kKFwiYnV0dG9uXCIpLmZpcnN0KCkuYXR0cih7cm9sZTpcInRhYlwiLGlkOlwic2xpY2stc2xpZGUtY29udHJvbFwiK2UuaW5zdGFuY2VVaWQrcyxcImFyaWEtY29udHJvbHNcIjpcInNsaWNrLXNsaWRlXCIrZS5pbnN0YW5jZVVpZCtuLFwiYXJpYS1sYWJlbFwiOnMrMStcIiBvZiBcIit0LFwiYXJpYS1zZWxlY3RlZFwiOm51bGwsdGFiaW5kZXg6XCItMVwifSl9KS5lcShlLmN1cnJlbnRTbGlkZSkuZmluZChcImJ1dHRvblwiKS5hdHRyKHtcImFyaWEtc2VsZWN0ZWRcIjpcInRydWVcIix0YWJpbmRleDpcIjBcIn0pLmVuZCgpKTtmb3IodmFyIHM9ZS5jdXJyZW50U2xpZGUsbj1zK2Uub3B0aW9ucy5zbGlkZXNUb1Nob3c7czxuO3MrKyllLiRzbGlkZXMuZXEocykuYXR0cihcInRhYmluZGV4XCIsMCk7ZS5hY3RpdmF0ZUFEQSgpfSxlLnByb3RvdHlwZS5pbml0QXJyb3dFdmVudHM9ZnVuY3Rpb24oKXt2YXIgaT10aGlzOyEwPT09aS5vcHRpb25zLmFycm93cyYmaS5zbGlkZUNvdW50Pmkub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihpLiRwcmV2QXJyb3cub2ZmKFwiY2xpY2suc2xpY2tcIikub24oXCJjbGljay5zbGlja1wiLHttZXNzYWdlOlwicHJldmlvdXNcIn0saS5jaGFuZ2VTbGlkZSksaS4kbmV4dEFycm93Lm9mZihcImNsaWNrLnNsaWNrXCIpLm9uKFwiY2xpY2suc2xpY2tcIix7bWVzc2FnZTpcIm5leHRcIn0saS5jaGFuZ2VTbGlkZSksITA9PT1pLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSYmKGkuJHByZXZBcnJvdy5vbihcImtleWRvd24uc2xpY2tcIixpLmtleUhhbmRsZXIpLGkuJG5leHRBcnJvdy5vbihcImtleWRvd24uc2xpY2tcIixpLmtleUhhbmRsZXIpKSl9LGUucHJvdG90eXBlLmluaXREb3RFdmVudHM9ZnVuY3Rpb24oKXt2YXIgZT10aGlzOyEwPT09ZS5vcHRpb25zLmRvdHMmJihpKFwibGlcIixlLiRkb3RzKS5vbihcImNsaWNrLnNsaWNrXCIse21lc3NhZ2U6XCJpbmRleFwifSxlLmNoYW5nZVNsaWRlKSwhMD09PWUub3B0aW9ucy5hY2Nlc3NpYmlsaXR5JiZlLiRkb3RzLm9uKFwia2V5ZG93bi5zbGlja1wiLGUua2V5SGFuZGxlcikpLCEwPT09ZS5vcHRpb25zLmRvdHMmJiEwPT09ZS5vcHRpb25zLnBhdXNlT25Eb3RzSG92ZXImJmkoXCJsaVwiLGUuJGRvdHMpLm9uKFwibW91c2VlbnRlci5zbGlja1wiLGkucHJveHkoZS5pbnRlcnJ1cHQsZSwhMCkpLm9uKFwibW91c2VsZWF2ZS5zbGlja1wiLGkucHJveHkoZS5pbnRlcnJ1cHQsZSwhMSkpfSxlLnByb3RvdHlwZS5pbml0U2xpZGVFdmVudHM9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2Uub3B0aW9ucy5wYXVzZU9uSG92ZXImJihlLiRsaXN0Lm9uKFwibW91c2VlbnRlci5zbGlja1wiLGkucHJveHkoZS5pbnRlcnJ1cHQsZSwhMCkpLGUuJGxpc3Qub24oXCJtb3VzZWxlYXZlLnNsaWNrXCIsaS5wcm94eShlLmludGVycnVwdCxlLCExKSkpfSxlLnByb3RvdHlwZS5pbml0aWFsaXplRXZlbnRzPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcztlLmluaXRBcnJvd0V2ZW50cygpLGUuaW5pdERvdEV2ZW50cygpLGUuaW5pdFNsaWRlRXZlbnRzKCksZS4kbGlzdC5vbihcInRvdWNoc3RhcnQuc2xpY2sgbW91c2Vkb3duLnNsaWNrXCIse2FjdGlvbjpcInN0YXJ0XCJ9LGUuc3dpcGVIYW5kbGVyKSxlLiRsaXN0Lm9uKFwidG91Y2htb3ZlLnNsaWNrIG1vdXNlbW92ZS5zbGlja1wiLHthY3Rpb246XCJtb3ZlXCJ9LGUuc3dpcGVIYW5kbGVyKSxlLiRsaXN0Lm9uKFwidG91Y2hlbmQuc2xpY2sgbW91c2V1cC5zbGlja1wiLHthY3Rpb246XCJlbmRcIn0sZS5zd2lwZUhhbmRsZXIpLGUuJGxpc3Qub24oXCJ0b3VjaGNhbmNlbC5zbGljayBtb3VzZWxlYXZlLnNsaWNrXCIse2FjdGlvbjpcImVuZFwifSxlLnN3aXBlSGFuZGxlciksZS4kbGlzdC5vbihcImNsaWNrLnNsaWNrXCIsZS5jbGlja0hhbmRsZXIpLGkoZG9jdW1lbnQpLm9uKGUudmlzaWJpbGl0eUNoYW5nZSxpLnByb3h5KGUudmlzaWJpbGl0eSxlKSksITA9PT1lLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSYmZS4kbGlzdC5vbihcImtleWRvd24uc2xpY2tcIixlLmtleUhhbmRsZXIpLCEwPT09ZS5vcHRpb25zLmZvY3VzT25TZWxlY3QmJmkoZS4kc2xpZGVUcmFjaykuY2hpbGRyZW4oKS5vbihcImNsaWNrLnNsaWNrXCIsZS5zZWxlY3RIYW5kbGVyKSxpKHdpbmRvdykub24oXCJvcmllbnRhdGlvbmNoYW5nZS5zbGljay5zbGljay1cIitlLmluc3RhbmNlVWlkLGkucHJveHkoZS5vcmllbnRhdGlvbkNoYW5nZSxlKSksaSh3aW5kb3cpLm9uKFwicmVzaXplLnNsaWNrLnNsaWNrLVwiK2UuaW5zdGFuY2VVaWQsaS5wcm94eShlLnJlc2l6ZSxlKSksaShcIltkcmFnZ2FibGUhPXRydWVdXCIsZS4kc2xpZGVUcmFjaykub24oXCJkcmFnc3RhcnRcIixlLnByZXZlbnREZWZhdWx0KSxpKHdpbmRvdykub24oXCJsb2FkLnNsaWNrLnNsaWNrLVwiK2UuaW5zdGFuY2VVaWQsZS5zZXRQb3NpdGlvbiksaShlLnNldFBvc2l0aW9uKX0sZS5wcm90b3R5cGUuaW5pdFVJPWZ1bmN0aW9uKCl7dmFyIGk9dGhpczshMD09PWkub3B0aW9ucy5hcnJvd3MmJmkuc2xpZGVDb3VudD5pLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYoaS4kcHJldkFycm93LnNob3coKSxpLiRuZXh0QXJyb3cuc2hvdygpKSwhMD09PWkub3B0aW9ucy5kb3RzJiZpLnNsaWRlQ291bnQ+aS5vcHRpb25zLnNsaWRlc1RvU2hvdyYmaS4kZG90cy5zaG93KCl9LGUucHJvdG90eXBlLmtleUhhbmRsZXI9ZnVuY3Rpb24oaSl7dmFyIGU9dGhpcztpLnRhcmdldC50YWdOYW1lLm1hdGNoKFwiVEVYVEFSRUF8SU5QVVR8U0VMRUNUXCIpfHwoMzc9PT1pLmtleUNvZGUmJiEwPT09ZS5vcHRpb25zLmFjY2Vzc2liaWxpdHk/ZS5jaGFuZ2VTbGlkZSh7ZGF0YTp7bWVzc2FnZTohMD09PWUub3B0aW9ucy5ydGw/XCJuZXh0XCI6XCJwcmV2aW91c1wifX0pOjM5PT09aS5rZXlDb2RlJiYhMD09PWUub3B0aW9ucy5hY2Nlc3NpYmlsaXR5JiZlLmNoYW5nZVNsaWRlKHtkYXRhOnttZXNzYWdlOiEwPT09ZS5vcHRpb25zLnJ0bD9cInByZXZpb3VzXCI6XCJuZXh0XCJ9fSkpfSxlLnByb3RvdHlwZS5sYXp5TG9hZD1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoZSl7aShcImltZ1tkYXRhLWxhenldXCIsZSkuZWFjaChmdW5jdGlvbigpe3ZhciBlPWkodGhpcyksdD1pKHRoaXMpLmF0dHIoXCJkYXRhLWxhenlcIiksbz1pKHRoaXMpLmF0dHIoXCJkYXRhLXNyY3NldFwiKSxzPWkodGhpcykuYXR0cihcImRhdGEtc2l6ZXNcIil8fG4uJHNsaWRlci5hdHRyKFwiZGF0YS1zaXplc1wiKSxyPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7ci5vbmxvYWQ9ZnVuY3Rpb24oKXtlLmFuaW1hdGUoe29wYWNpdHk6MH0sMTAwLGZ1bmN0aW9uKCl7byYmKGUuYXR0cihcInNyY3NldFwiLG8pLHMmJmUuYXR0cihcInNpemVzXCIscykpLGUuYXR0cihcInNyY1wiLHQpLmFuaW1hdGUoe29wYWNpdHk6MX0sMjAwLGZ1bmN0aW9uKCl7ZS5yZW1vdmVBdHRyKFwiZGF0YS1sYXp5IGRhdGEtc3Jjc2V0IGRhdGEtc2l6ZXNcIikucmVtb3ZlQ2xhc3MoXCJzbGljay1sb2FkaW5nXCIpfSksbi4kc2xpZGVyLnRyaWdnZXIoXCJsYXp5TG9hZGVkXCIsW24sZSx0XSl9KX0sci5vbmVycm9yPWZ1bmN0aW9uKCl7ZS5yZW1vdmVBdHRyKFwiZGF0YS1sYXp5XCIpLnJlbW92ZUNsYXNzKFwic2xpY2stbG9hZGluZ1wiKS5hZGRDbGFzcyhcInNsaWNrLWxhenlsb2FkLWVycm9yXCIpLG4uJHNsaWRlci50cmlnZ2VyKFwibGF6eUxvYWRFcnJvclwiLFtuLGUsdF0pfSxyLnNyYz10fSl9dmFyIHQsbyxzLG49dGhpcztpZighMD09PW4ub3B0aW9ucy5jZW50ZXJNb2RlPyEwPT09bi5vcHRpb25zLmluZmluaXRlP3M9KG89bi5jdXJyZW50U2xpZGUrKG4ub3B0aW9ucy5zbGlkZXNUb1Nob3cvMisxKSkrbi5vcHRpb25zLnNsaWRlc1RvU2hvdysyOihvPU1hdGgubWF4KDAsbi5jdXJyZW50U2xpZGUtKG4ub3B0aW9ucy5zbGlkZXNUb1Nob3cvMisxKSkscz1uLm9wdGlvbnMuc2xpZGVzVG9TaG93LzIrMSsyK24uY3VycmVudFNsaWRlKToobz1uLm9wdGlvbnMuaW5maW5pdGU/bi5vcHRpb25zLnNsaWRlc1RvU2hvdytuLmN1cnJlbnRTbGlkZTpuLmN1cnJlbnRTbGlkZSxzPU1hdGguY2VpbChvK24ub3B0aW9ucy5zbGlkZXNUb1Nob3cpLCEwPT09bi5vcHRpb25zLmZhZGUmJihvPjAmJm8tLSxzPD1uLnNsaWRlQ291bnQmJnMrKykpLHQ9bi4kc2xpZGVyLmZpbmQoXCIuc2xpY2stc2xpZGVcIikuc2xpY2UobyxzKSxcImFudGljaXBhdGVkXCI9PT1uLm9wdGlvbnMubGF6eUxvYWQpZm9yKHZhciByPW8tMSxsPXMsZD1uLiRzbGlkZXIuZmluZChcIi5zbGljay1zbGlkZVwiKSxhPTA7YTxuLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7YSsrKXI8MCYmKHI9bi5zbGlkZUNvdW50LTEpLHQ9KHQ9dC5hZGQoZC5lcShyKSkpLmFkZChkLmVxKGwpKSxyLS0sbCsrO2UodCksbi5zbGlkZUNvdW50PD1uLm9wdGlvbnMuc2xpZGVzVG9TaG93P2Uobi4kc2xpZGVyLmZpbmQoXCIuc2xpY2stc2xpZGVcIikpOm4uY3VycmVudFNsaWRlPj1uLnNsaWRlQ291bnQtbi5vcHRpb25zLnNsaWRlc1RvU2hvdz9lKG4uJHNsaWRlci5maW5kKFwiLnNsaWNrLWNsb25lZFwiKS5zbGljZSgwLG4ub3B0aW9ucy5zbGlkZXNUb1Nob3cpKTowPT09bi5jdXJyZW50U2xpZGUmJmUobi4kc2xpZGVyLmZpbmQoXCIuc2xpY2stY2xvbmVkXCIpLnNsaWNlKC0xKm4ub3B0aW9ucy5zbGlkZXNUb1Nob3cpKX0sZS5wcm90b3R5cGUubG9hZFNsaWRlcj1mdW5jdGlvbigpe3ZhciBpPXRoaXM7aS5zZXRQb3NpdGlvbigpLGkuJHNsaWRlVHJhY2suY3NzKHtvcGFjaXR5OjF9KSxpLiRzbGlkZXIucmVtb3ZlQ2xhc3MoXCJzbGljay1sb2FkaW5nXCIpLGkuaW5pdFVJKCksXCJwcm9ncmVzc2l2ZVwiPT09aS5vcHRpb25zLmxhenlMb2FkJiZpLnByb2dyZXNzaXZlTGF6eUxvYWQoKX0sZS5wcm90b3R5cGUubmV4dD1lLnByb3RvdHlwZS5zbGlja05leHQ9ZnVuY3Rpb24oKXt0aGlzLmNoYW5nZVNsaWRlKHtkYXRhOnttZXNzYWdlOlwibmV4dFwifX0pfSxlLnByb3RvdHlwZS5vcmllbnRhdGlvbkNoYW5nZT1mdW5jdGlvbigpe3ZhciBpPXRoaXM7aS5jaGVja1Jlc3BvbnNpdmUoKSxpLnNldFBvc2l0aW9uKCl9LGUucHJvdG90eXBlLnBhdXNlPWUucHJvdG90eXBlLnNsaWNrUGF1c2U9ZnVuY3Rpb24oKXt2YXIgaT10aGlzO2kuYXV0b1BsYXlDbGVhcigpLGkucGF1c2VkPSEwfSxlLnByb3RvdHlwZS5wbGF5PWUucHJvdG90eXBlLnNsaWNrUGxheT1mdW5jdGlvbigpe3ZhciBpPXRoaXM7aS5hdXRvUGxheSgpLGkub3B0aW9ucy5hdXRvcGxheT0hMCxpLnBhdXNlZD0hMSxpLmZvY3Vzc2VkPSExLGkuaW50ZXJydXB0ZWQ9ITF9LGUucHJvdG90eXBlLnBvc3RTbGlkZT1mdW5jdGlvbihlKXt2YXIgdD10aGlzO3QudW5zbGlja2VkfHwodC4kc2xpZGVyLnRyaWdnZXIoXCJhZnRlckNoYW5nZVwiLFt0LGVdKSx0LmFuaW1hdGluZz0hMSx0LnNsaWRlQ291bnQ+dC5vcHRpb25zLnNsaWRlc1RvU2hvdyYmdC5zZXRQb3NpdGlvbigpLHQuc3dpcGVMZWZ0PW51bGwsdC5vcHRpb25zLmF1dG9wbGF5JiZ0LmF1dG9QbGF5KCksITA9PT10Lm9wdGlvbnMuYWNjZXNzaWJpbGl0eSYmKHQuaW5pdEFEQSgpLHQub3B0aW9ucy5mb2N1c09uQ2hhbmdlJiZpKHQuJHNsaWRlcy5nZXQodC5jdXJyZW50U2xpZGUpKS5hdHRyKFwidGFiaW5kZXhcIiwwKS5mb2N1cygpKSl9LGUucHJvdG90eXBlLnByZXY9ZS5wcm90b3R5cGUuc2xpY2tQcmV2PWZ1bmN0aW9uKCl7dGhpcy5jaGFuZ2VTbGlkZSh7ZGF0YTp7bWVzc2FnZTpcInByZXZpb3VzXCJ9fSl9LGUucHJvdG90eXBlLnByZXZlbnREZWZhdWx0PWZ1bmN0aW9uKGkpe2kucHJldmVudERlZmF1bHQoKX0sZS5wcm90b3R5cGUucHJvZ3Jlc3NpdmVMYXp5TG9hZD1mdW5jdGlvbihlKXtlPWV8fDE7dmFyIHQsbyxzLG4scixsPXRoaXMsZD1pKFwiaW1nW2RhdGEtbGF6eV1cIixsLiRzbGlkZXIpO2QubGVuZ3RoPyh0PWQuZmlyc3QoKSxvPXQuYXR0cihcImRhdGEtbGF6eVwiKSxzPXQuYXR0cihcImRhdGEtc3Jjc2V0XCIpLG49dC5hdHRyKFwiZGF0YS1zaXplc1wiKXx8bC4kc2xpZGVyLmF0dHIoXCJkYXRhLXNpemVzXCIpLChyPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIikpLm9ubG9hZD1mdW5jdGlvbigpe3MmJih0LmF0dHIoXCJzcmNzZXRcIixzKSxuJiZ0LmF0dHIoXCJzaXplc1wiLG4pKSx0LmF0dHIoXCJzcmNcIixvKS5yZW1vdmVBdHRyKFwiZGF0YS1sYXp5IGRhdGEtc3Jjc2V0IGRhdGEtc2l6ZXNcIikucmVtb3ZlQ2xhc3MoXCJzbGljay1sb2FkaW5nXCIpLCEwPT09bC5vcHRpb25zLmFkYXB0aXZlSGVpZ2h0JiZsLnNldFBvc2l0aW9uKCksbC4kc2xpZGVyLnRyaWdnZXIoXCJsYXp5TG9hZGVkXCIsW2wsdCxvXSksbC5wcm9ncmVzc2l2ZUxhenlMb2FkKCl9LHIub25lcnJvcj1mdW5jdGlvbigpe2U8Mz9zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bC5wcm9ncmVzc2l2ZUxhenlMb2FkKGUrMSl9LDUwMCk6KHQucmVtb3ZlQXR0cihcImRhdGEtbGF6eVwiKS5yZW1vdmVDbGFzcyhcInNsaWNrLWxvYWRpbmdcIikuYWRkQ2xhc3MoXCJzbGljay1sYXp5bG9hZC1lcnJvclwiKSxsLiRzbGlkZXIudHJpZ2dlcihcImxhenlMb2FkRXJyb3JcIixbbCx0LG9dKSxsLnByb2dyZXNzaXZlTGF6eUxvYWQoKSl9LHIuc3JjPW8pOmwuJHNsaWRlci50cmlnZ2VyKFwiYWxsSW1hZ2VzTG9hZGVkXCIsW2xdKX0sZS5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbihlKXt2YXIgdCxvLHM9dGhpcztvPXMuc2xpZGVDb3VudC1zLm9wdGlvbnMuc2xpZGVzVG9TaG93LCFzLm9wdGlvbnMuaW5maW5pdGUmJnMuY3VycmVudFNsaWRlPm8mJihzLmN1cnJlbnRTbGlkZT1vKSxzLnNsaWRlQ291bnQ8PXMub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihzLmN1cnJlbnRTbGlkZT0wKSx0PXMuY3VycmVudFNsaWRlLHMuZGVzdHJveSghMCksaS5leHRlbmQocyxzLmluaXRpYWxzLHtjdXJyZW50U2xpZGU6dH0pLHMuaW5pdCgpLGV8fHMuY2hhbmdlU2xpZGUoe2RhdGE6e21lc3NhZ2U6XCJpbmRleFwiLGluZGV4OnR9fSwhMSl9LGUucHJvdG90eXBlLnJlZ2lzdGVyQnJlYWtwb2ludHM9ZnVuY3Rpb24oKXt2YXIgZSx0LG8scz10aGlzLG49cy5vcHRpb25zLnJlc3BvbnNpdmV8fG51bGw7aWYoXCJhcnJheVwiPT09aS50eXBlKG4pJiZuLmxlbmd0aCl7cy5yZXNwb25kVG89cy5vcHRpb25zLnJlc3BvbmRUb3x8XCJ3aW5kb3dcIjtmb3IoZSBpbiBuKWlmKG89cy5icmVha3BvaW50cy5sZW5ndGgtMSxuLmhhc093blByb3BlcnR5KGUpKXtmb3IodD1uW2VdLmJyZWFrcG9pbnQ7bz49MDspcy5icmVha3BvaW50c1tvXSYmcy5icmVha3BvaW50c1tvXT09PXQmJnMuYnJlYWtwb2ludHMuc3BsaWNlKG8sMSksby0tO3MuYnJlYWtwb2ludHMucHVzaCh0KSxzLmJyZWFrcG9pbnRTZXR0aW5nc1t0XT1uW2VdLnNldHRpbmdzfXMuYnJlYWtwb2ludHMuc29ydChmdW5jdGlvbihpLGUpe3JldHVybiBzLm9wdGlvbnMubW9iaWxlRmlyc3Q/aS1lOmUtaX0pfX0sZS5wcm90b3R5cGUucmVpbml0PWZ1bmN0aW9uKCl7dmFyIGU9dGhpcztlLiRzbGlkZXM9ZS4kc2xpZGVUcmFjay5jaGlsZHJlbihlLm9wdGlvbnMuc2xpZGUpLmFkZENsYXNzKFwic2xpY2stc2xpZGVcIiksZS5zbGlkZUNvdW50PWUuJHNsaWRlcy5sZW5ndGgsZS5jdXJyZW50U2xpZGU+PWUuc2xpZGVDb3VudCYmMCE9PWUuY3VycmVudFNsaWRlJiYoZS5jdXJyZW50U2xpZGU9ZS5jdXJyZW50U2xpZGUtZS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKSxlLnNsaWRlQ291bnQ8PWUub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihlLmN1cnJlbnRTbGlkZT0wKSxlLnJlZ2lzdGVyQnJlYWtwb2ludHMoKSxlLnNldFByb3BzKCksZS5zZXR1cEluZmluaXRlKCksZS5idWlsZEFycm93cygpLGUudXBkYXRlQXJyb3dzKCksZS5pbml0QXJyb3dFdmVudHMoKSxlLmJ1aWxkRG90cygpLGUudXBkYXRlRG90cygpLGUuaW5pdERvdEV2ZW50cygpLGUuY2xlYW5VcFNsaWRlRXZlbnRzKCksZS5pbml0U2xpZGVFdmVudHMoKSxlLmNoZWNrUmVzcG9uc2l2ZSghMSwhMCksITA9PT1lLm9wdGlvbnMuZm9jdXNPblNlbGVjdCYmaShlLiRzbGlkZVRyYWNrKS5jaGlsZHJlbigpLm9uKFwiY2xpY2suc2xpY2tcIixlLnNlbGVjdEhhbmRsZXIpLGUuc2V0U2xpZGVDbGFzc2VzKFwibnVtYmVyXCI9PXR5cGVvZiBlLmN1cnJlbnRTbGlkZT9lLmN1cnJlbnRTbGlkZTowKSxlLnNldFBvc2l0aW9uKCksZS5mb2N1c0hhbmRsZXIoKSxlLnBhdXNlZD0hZS5vcHRpb25zLmF1dG9wbGF5LGUuYXV0b1BsYXkoKSxlLiRzbGlkZXIudHJpZ2dlcihcInJlSW5pdFwiLFtlXSl9LGUucHJvdG90eXBlLnJlc2l6ZT1mdW5jdGlvbigpe3ZhciBlPXRoaXM7aSh3aW5kb3cpLndpZHRoKCkhPT1lLndpbmRvd1dpZHRoJiYoY2xlYXJUaW1lb3V0KGUud2luZG93RGVsYXkpLGUud2luZG93RGVsYXk9d2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtlLndpbmRvd1dpZHRoPWkod2luZG93KS53aWR0aCgpLGUuY2hlY2tSZXNwb25zaXZlKCksZS51bnNsaWNrZWR8fGUuc2V0UG9zaXRpb24oKX0sNTApKX0sZS5wcm90b3R5cGUucmVtb3ZlU2xpZGU9ZS5wcm90b3R5cGUuc2xpY2tSZW1vdmU9ZnVuY3Rpb24oaSxlLHQpe3ZhciBvPXRoaXM7aWYoaT1cImJvb2xlYW5cIj09dHlwZW9mIGk/ITA9PT0oZT1pKT8wOm8uc2xpZGVDb3VudC0xOiEwPT09ZT8tLWk6aSxvLnNsaWRlQ291bnQ8MXx8aTwwfHxpPm8uc2xpZGVDb3VudC0xKXJldHVybiExO28udW5sb2FkKCksITA9PT10P28uJHNsaWRlVHJhY2suY2hpbGRyZW4oKS5yZW1vdmUoKTpvLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZXEoaSkucmVtb3ZlKCksby4kc2xpZGVzPW8uJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKSxvLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCksby4kc2xpZGVUcmFjay5hcHBlbmQoby4kc2xpZGVzKSxvLiRzbGlkZXNDYWNoZT1vLiRzbGlkZXMsby5yZWluaXQoKX0sZS5wcm90b3R5cGUuc2V0Q1NTPWZ1bmN0aW9uKGkpe3ZhciBlLHQsbz10aGlzLHM9e307ITA9PT1vLm9wdGlvbnMucnRsJiYoaT0taSksZT1cImxlZnRcIj09by5wb3NpdGlvblByb3A/TWF0aC5jZWlsKGkpK1wicHhcIjpcIjBweFwiLHQ9XCJ0b3BcIj09by5wb3NpdGlvblByb3A/TWF0aC5jZWlsKGkpK1wicHhcIjpcIjBweFwiLHNbby5wb3NpdGlvblByb3BdPWksITE9PT1vLnRyYW5zZm9ybXNFbmFibGVkP28uJHNsaWRlVHJhY2suY3NzKHMpOihzPXt9LCExPT09by5jc3NUcmFuc2l0aW9ucz8oc1tvLmFuaW1UeXBlXT1cInRyYW5zbGF0ZShcIitlK1wiLCBcIit0K1wiKVwiLG8uJHNsaWRlVHJhY2suY3NzKHMpKTooc1tvLmFuaW1UeXBlXT1cInRyYW5zbGF0ZTNkKFwiK2UrXCIsIFwiK3QrXCIsIDBweClcIixvLiRzbGlkZVRyYWNrLmNzcyhzKSkpfSxlLnByb3RvdHlwZS5zZXREaW1lbnNpb25zPWZ1bmN0aW9uKCl7dmFyIGk9dGhpczshMT09PWkub3B0aW9ucy52ZXJ0aWNhbD8hMD09PWkub3B0aW9ucy5jZW50ZXJNb2RlJiZpLiRsaXN0LmNzcyh7cGFkZGluZzpcIjBweCBcIitpLm9wdGlvbnMuY2VudGVyUGFkZGluZ30pOihpLiRsaXN0LmhlaWdodChpLiRzbGlkZXMuZmlyc3QoKS5vdXRlckhlaWdodCghMCkqaS5vcHRpb25zLnNsaWRlc1RvU2hvdyksITA9PT1pLm9wdGlvbnMuY2VudGVyTW9kZSYmaS4kbGlzdC5jc3Moe3BhZGRpbmc6aS5vcHRpb25zLmNlbnRlclBhZGRpbmcrXCIgMHB4XCJ9KSksaS5saXN0V2lkdGg9aS4kbGlzdC53aWR0aCgpLGkubGlzdEhlaWdodD1pLiRsaXN0LmhlaWdodCgpLCExPT09aS5vcHRpb25zLnZlcnRpY2FsJiYhMT09PWkub3B0aW9ucy52YXJpYWJsZVdpZHRoPyhpLnNsaWRlV2lkdGg9TWF0aC5jZWlsKGkubGlzdFdpZHRoL2kub3B0aW9ucy5zbGlkZXNUb1Nob3cpLGkuJHNsaWRlVHJhY2sud2lkdGgoTWF0aC5jZWlsKGkuc2xpZGVXaWR0aCppLiRzbGlkZVRyYWNrLmNoaWxkcmVuKFwiLnNsaWNrLXNsaWRlXCIpLmxlbmd0aCkpKTohMD09PWkub3B0aW9ucy52YXJpYWJsZVdpZHRoP2kuJHNsaWRlVHJhY2sud2lkdGgoNWUzKmkuc2xpZGVDb3VudCk6KGkuc2xpZGVXaWR0aD1NYXRoLmNlaWwoaS5saXN0V2lkdGgpLGkuJHNsaWRlVHJhY2suaGVpZ2h0KE1hdGguY2VpbChpLiRzbGlkZXMuZmlyc3QoKS5vdXRlckhlaWdodCghMCkqaS4kc2xpZGVUcmFjay5jaGlsZHJlbihcIi5zbGljay1zbGlkZVwiKS5sZW5ndGgpKSk7dmFyIGU9aS4kc2xpZGVzLmZpcnN0KCkub3V0ZXJXaWR0aCghMCktaS4kc2xpZGVzLmZpcnN0KCkud2lkdGgoKTshMT09PWkub3B0aW9ucy52YXJpYWJsZVdpZHRoJiZpLiRzbGlkZVRyYWNrLmNoaWxkcmVuKFwiLnNsaWNrLXNsaWRlXCIpLndpZHRoKGkuc2xpZGVXaWR0aC1lKX0sZS5wcm90b3R5cGUuc2V0RmFkZT1mdW5jdGlvbigpe3ZhciBlLHQ9dGhpczt0LiRzbGlkZXMuZWFjaChmdW5jdGlvbihvLHMpe2U9dC5zbGlkZVdpZHRoKm8qLTEsITA9PT10Lm9wdGlvbnMucnRsP2kocykuY3NzKHtwb3NpdGlvbjpcInJlbGF0aXZlXCIscmlnaHQ6ZSx0b3A6MCx6SW5kZXg6dC5vcHRpb25zLnpJbmRleC0yLG9wYWNpdHk6MH0pOmkocykuY3NzKHtwb3NpdGlvbjpcInJlbGF0aXZlXCIsbGVmdDplLHRvcDowLHpJbmRleDp0Lm9wdGlvbnMuekluZGV4LTIsb3BhY2l0eTowfSl9KSx0LiRzbGlkZXMuZXEodC5jdXJyZW50U2xpZGUpLmNzcyh7ekluZGV4OnQub3B0aW9ucy56SW5kZXgtMSxvcGFjaXR5OjF9KX0sZS5wcm90b3R5cGUuc2V0SGVpZ2h0PWZ1bmN0aW9uKCl7dmFyIGk9dGhpcztpZigxPT09aS5vcHRpb25zLnNsaWRlc1RvU2hvdyYmITA9PT1pLm9wdGlvbnMuYWRhcHRpdmVIZWlnaHQmJiExPT09aS5vcHRpb25zLnZlcnRpY2FsKXt2YXIgZT1pLiRzbGlkZXMuZXEoaS5jdXJyZW50U2xpZGUpLm91dGVySGVpZ2h0KCEwKTtpLiRsaXN0LmNzcyhcImhlaWdodFwiLGUpfX0sZS5wcm90b3R5cGUuc2V0T3B0aW9uPWUucHJvdG90eXBlLnNsaWNrU2V0T3B0aW9uPWZ1bmN0aW9uKCl7dmFyIGUsdCxvLHMsbixyPXRoaXMsbD0hMTtpZihcIm9iamVjdFwiPT09aS50eXBlKGFyZ3VtZW50c1swXSk/KG89YXJndW1lbnRzWzBdLGw9YXJndW1lbnRzWzFdLG49XCJtdWx0aXBsZVwiKTpcInN0cmluZ1wiPT09aS50eXBlKGFyZ3VtZW50c1swXSkmJihvPWFyZ3VtZW50c1swXSxzPWFyZ3VtZW50c1sxXSxsPWFyZ3VtZW50c1syXSxcInJlc3BvbnNpdmVcIj09PWFyZ3VtZW50c1swXSYmXCJhcnJheVwiPT09aS50eXBlKGFyZ3VtZW50c1sxXSk/bj1cInJlc3BvbnNpdmVcIjp2b2lkIDAhPT1hcmd1bWVudHNbMV0mJihuPVwic2luZ2xlXCIpKSxcInNpbmdsZVwiPT09bilyLm9wdGlvbnNbb109cztlbHNlIGlmKFwibXVsdGlwbGVcIj09PW4paS5lYWNoKG8sZnVuY3Rpb24oaSxlKXtyLm9wdGlvbnNbaV09ZX0pO2Vsc2UgaWYoXCJyZXNwb25zaXZlXCI9PT1uKWZvcih0IGluIHMpaWYoXCJhcnJheVwiIT09aS50eXBlKHIub3B0aW9ucy5yZXNwb25zaXZlKSlyLm9wdGlvbnMucmVzcG9uc2l2ZT1bc1t0XV07ZWxzZXtmb3IoZT1yLm9wdGlvbnMucmVzcG9uc2l2ZS5sZW5ndGgtMTtlPj0wOylyLm9wdGlvbnMucmVzcG9uc2l2ZVtlXS5icmVha3BvaW50PT09c1t0XS5icmVha3BvaW50JiZyLm9wdGlvbnMucmVzcG9uc2l2ZS5zcGxpY2UoZSwxKSxlLS07ci5vcHRpb25zLnJlc3BvbnNpdmUucHVzaChzW3RdKX1sJiYoci51bmxvYWQoKSxyLnJlaW5pdCgpKX0sZS5wcm90b3R5cGUuc2V0UG9zaXRpb249ZnVuY3Rpb24oKXt2YXIgaT10aGlzO2kuc2V0RGltZW5zaW9ucygpLGkuc2V0SGVpZ2h0KCksITE9PT1pLm9wdGlvbnMuZmFkZT9pLnNldENTUyhpLmdldExlZnQoaS5jdXJyZW50U2xpZGUpKTppLnNldEZhZGUoKSxpLiRzbGlkZXIudHJpZ2dlcihcInNldFBvc2l0aW9uXCIsW2ldKX0sZS5wcm90b3R5cGUuc2V0UHJvcHM9ZnVuY3Rpb24oKXt2YXIgaT10aGlzLGU9ZG9jdW1lbnQuYm9keS5zdHlsZTtpLnBvc2l0aW9uUHJvcD0hMD09PWkub3B0aW9ucy52ZXJ0aWNhbD9cInRvcFwiOlwibGVmdFwiLFwidG9wXCI9PT1pLnBvc2l0aW9uUHJvcD9pLiRzbGlkZXIuYWRkQ2xhc3MoXCJzbGljay12ZXJ0aWNhbFwiKTppLiRzbGlkZXIucmVtb3ZlQ2xhc3MoXCJzbGljay12ZXJ0aWNhbFwiKSx2b2lkIDA9PT1lLldlYmtpdFRyYW5zaXRpb24mJnZvaWQgMD09PWUuTW96VHJhbnNpdGlvbiYmdm9pZCAwPT09ZS5tc1RyYW5zaXRpb258fCEwPT09aS5vcHRpb25zLnVzZUNTUyYmKGkuY3NzVHJhbnNpdGlvbnM9ITApLGkub3B0aW9ucy5mYWRlJiYoXCJudW1iZXJcIj09dHlwZW9mIGkub3B0aW9ucy56SW5kZXg/aS5vcHRpb25zLnpJbmRleDwzJiYoaS5vcHRpb25zLnpJbmRleD0zKTppLm9wdGlvbnMuekluZGV4PWkuZGVmYXVsdHMuekluZGV4KSx2b2lkIDAhPT1lLk9UcmFuc2Zvcm0mJihpLmFuaW1UeXBlPVwiT1RyYW5zZm9ybVwiLGkudHJhbnNmb3JtVHlwZT1cIi1vLXRyYW5zZm9ybVwiLGkudHJhbnNpdGlvblR5cGU9XCJPVHJhbnNpdGlvblwiLHZvaWQgMD09PWUucGVyc3BlY3RpdmVQcm9wZXJ0eSYmdm9pZCAwPT09ZS53ZWJraXRQZXJzcGVjdGl2ZSYmKGkuYW5pbVR5cGU9ITEpKSx2b2lkIDAhPT1lLk1velRyYW5zZm9ybSYmKGkuYW5pbVR5cGU9XCJNb3pUcmFuc2Zvcm1cIixpLnRyYW5zZm9ybVR5cGU9XCItbW96LXRyYW5zZm9ybVwiLGkudHJhbnNpdGlvblR5cGU9XCJNb3pUcmFuc2l0aW9uXCIsdm9pZCAwPT09ZS5wZXJzcGVjdGl2ZVByb3BlcnR5JiZ2b2lkIDA9PT1lLk1velBlcnNwZWN0aXZlJiYoaS5hbmltVHlwZT0hMSkpLHZvaWQgMCE9PWUud2Via2l0VHJhbnNmb3JtJiYoaS5hbmltVHlwZT1cIndlYmtpdFRyYW5zZm9ybVwiLGkudHJhbnNmb3JtVHlwZT1cIi13ZWJraXQtdHJhbnNmb3JtXCIsaS50cmFuc2l0aW9uVHlwZT1cIndlYmtpdFRyYW5zaXRpb25cIix2b2lkIDA9PT1lLnBlcnNwZWN0aXZlUHJvcGVydHkmJnZvaWQgMD09PWUud2Via2l0UGVyc3BlY3RpdmUmJihpLmFuaW1UeXBlPSExKSksdm9pZCAwIT09ZS5tc1RyYW5zZm9ybSYmKGkuYW5pbVR5cGU9XCJtc1RyYW5zZm9ybVwiLGkudHJhbnNmb3JtVHlwZT1cIi1tcy10cmFuc2Zvcm1cIixpLnRyYW5zaXRpb25UeXBlPVwibXNUcmFuc2l0aW9uXCIsdm9pZCAwPT09ZS5tc1RyYW5zZm9ybSYmKGkuYW5pbVR5cGU9ITEpKSx2b2lkIDAhPT1lLnRyYW5zZm9ybSYmITEhPT1pLmFuaW1UeXBlJiYoaS5hbmltVHlwZT1cInRyYW5zZm9ybVwiLGkudHJhbnNmb3JtVHlwZT1cInRyYW5zZm9ybVwiLGkudHJhbnNpdGlvblR5cGU9XCJ0cmFuc2l0aW9uXCIpLGkudHJhbnNmb3Jtc0VuYWJsZWQ9aS5vcHRpb25zLnVzZVRyYW5zZm9ybSYmbnVsbCE9PWkuYW5pbVR5cGUmJiExIT09aS5hbmltVHlwZX0sZS5wcm90b3R5cGUuc2V0U2xpZGVDbGFzc2VzPWZ1bmN0aW9uKGkpe3ZhciBlLHQsbyxzLG49dGhpcztpZih0PW4uJHNsaWRlci5maW5kKFwiLnNsaWNrLXNsaWRlXCIpLnJlbW92ZUNsYXNzKFwic2xpY2stYWN0aXZlIHNsaWNrLWNlbnRlciBzbGljay1jdXJyZW50XCIpLmF0dHIoXCJhcmlhLWhpZGRlblwiLFwidHJ1ZVwiKSxuLiRzbGlkZXMuZXEoaSkuYWRkQ2xhc3MoXCJzbGljay1jdXJyZW50XCIpLCEwPT09bi5vcHRpb25zLmNlbnRlck1vZGUpe3ZhciByPW4ub3B0aW9ucy5zbGlkZXNUb1Nob3clMj09MD8xOjA7ZT1NYXRoLmZsb29yKG4ub3B0aW9ucy5zbGlkZXNUb1Nob3cvMiksITA9PT1uLm9wdGlvbnMuaW5maW5pdGUmJihpPj1lJiZpPD1uLnNsaWRlQ291bnQtMS1lP24uJHNsaWRlcy5zbGljZShpLWUrcixpK2UrMSkuYWRkQ2xhc3MoXCJzbGljay1hY3RpdmVcIikuYXR0cihcImFyaWEtaGlkZGVuXCIsXCJmYWxzZVwiKToobz1uLm9wdGlvbnMuc2xpZGVzVG9TaG93K2ksdC5zbGljZShvLWUrMStyLG8rZSsyKS5hZGRDbGFzcyhcInNsaWNrLWFjdGl2ZVwiKS5hdHRyKFwiYXJpYS1oaWRkZW5cIixcImZhbHNlXCIpKSwwPT09aT90LmVxKHQubGVuZ3RoLTEtbi5vcHRpb25zLnNsaWRlc1RvU2hvdykuYWRkQ2xhc3MoXCJzbGljay1jZW50ZXJcIik6aT09PW4uc2xpZGVDb3VudC0xJiZ0LmVxKG4ub3B0aW9ucy5zbGlkZXNUb1Nob3cpLmFkZENsYXNzKFwic2xpY2stY2VudGVyXCIpKSxuLiRzbGlkZXMuZXEoaSkuYWRkQ2xhc3MoXCJzbGljay1jZW50ZXJcIil9ZWxzZSBpPj0wJiZpPD1uLnNsaWRlQ291bnQtbi5vcHRpb25zLnNsaWRlc1RvU2hvdz9uLiRzbGlkZXMuc2xpY2UoaSxpK24ub3B0aW9ucy5zbGlkZXNUb1Nob3cpLmFkZENsYXNzKFwic2xpY2stYWN0aXZlXCIpLmF0dHIoXCJhcmlhLWhpZGRlblwiLFwiZmFsc2VcIik6dC5sZW5ndGg8PW4ub3B0aW9ucy5zbGlkZXNUb1Nob3c/dC5hZGRDbGFzcyhcInNsaWNrLWFjdGl2ZVwiKS5hdHRyKFwiYXJpYS1oaWRkZW5cIixcImZhbHNlXCIpOihzPW4uc2xpZGVDb3VudCVuLm9wdGlvbnMuc2xpZGVzVG9TaG93LG89ITA9PT1uLm9wdGlvbnMuaW5maW5pdGU/bi5vcHRpb25zLnNsaWRlc1RvU2hvdytpOmksbi5vcHRpb25zLnNsaWRlc1RvU2hvdz09bi5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsJiZuLnNsaWRlQ291bnQtaTxuLm9wdGlvbnMuc2xpZGVzVG9TaG93P3Quc2xpY2Uoby0obi5vcHRpb25zLnNsaWRlc1RvU2hvdy1zKSxvK3MpLmFkZENsYXNzKFwic2xpY2stYWN0aXZlXCIpLmF0dHIoXCJhcmlhLWhpZGRlblwiLFwiZmFsc2VcIik6dC5zbGljZShvLG8rbi5vcHRpb25zLnNsaWRlc1RvU2hvdykuYWRkQ2xhc3MoXCJzbGljay1hY3RpdmVcIikuYXR0cihcImFyaWEtaGlkZGVuXCIsXCJmYWxzZVwiKSk7XCJvbmRlbWFuZFwiIT09bi5vcHRpb25zLmxhenlMb2FkJiZcImFudGljaXBhdGVkXCIhPT1uLm9wdGlvbnMubGF6eUxvYWR8fG4ubGF6eUxvYWQoKX0sZS5wcm90b3R5cGUuc2V0dXBJbmZpbml0ZT1mdW5jdGlvbigpe3ZhciBlLHQsbyxzPXRoaXM7aWYoITA9PT1zLm9wdGlvbnMuZmFkZSYmKHMub3B0aW9ucy5jZW50ZXJNb2RlPSExKSwhMD09PXMub3B0aW9ucy5pbmZpbml0ZSYmITE9PT1zLm9wdGlvbnMuZmFkZSYmKHQ9bnVsbCxzLnNsaWRlQ291bnQ+cy5vcHRpb25zLnNsaWRlc1RvU2hvdykpe2ZvcihvPSEwPT09cy5vcHRpb25zLmNlbnRlck1vZGU/cy5vcHRpb25zLnNsaWRlc1RvU2hvdysxOnMub3B0aW9ucy5zbGlkZXNUb1Nob3csZT1zLnNsaWRlQ291bnQ7ZT5zLnNsaWRlQ291bnQtbztlLT0xKXQ9ZS0xLGkocy4kc2xpZGVzW3RdKS5jbG9uZSghMCkuYXR0cihcImlkXCIsXCJcIikuYXR0cihcImRhdGEtc2xpY2staW5kZXhcIix0LXMuc2xpZGVDb3VudCkucHJlcGVuZFRvKHMuJHNsaWRlVHJhY2spLmFkZENsYXNzKFwic2xpY2stY2xvbmVkXCIpO2ZvcihlPTA7ZTxvK3Muc2xpZGVDb3VudDtlKz0xKXQ9ZSxpKHMuJHNsaWRlc1t0XSkuY2xvbmUoITApLmF0dHIoXCJpZFwiLFwiXCIpLmF0dHIoXCJkYXRhLXNsaWNrLWluZGV4XCIsdCtzLnNsaWRlQ291bnQpLmFwcGVuZFRvKHMuJHNsaWRlVHJhY2spLmFkZENsYXNzKFwic2xpY2stY2xvbmVkXCIpO3MuJHNsaWRlVHJhY2suZmluZChcIi5zbGljay1jbG9uZWRcIikuZmluZChcIltpZF1cIikuZWFjaChmdW5jdGlvbigpe2kodGhpcykuYXR0cihcImlkXCIsXCJcIil9KX19LGUucHJvdG90eXBlLmludGVycnVwdD1mdW5jdGlvbihpKXt2YXIgZT10aGlzO2l8fGUuYXV0b1BsYXkoKSxlLmludGVycnVwdGVkPWl9LGUucHJvdG90eXBlLnNlbGVjdEhhbmRsZXI9ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcyxvPWkoZS50YXJnZXQpLmlzKFwiLnNsaWNrLXNsaWRlXCIpP2koZS50YXJnZXQpOmkoZS50YXJnZXQpLnBhcmVudHMoXCIuc2xpY2stc2xpZGVcIikscz1wYXJzZUludChvLmF0dHIoXCJkYXRhLXNsaWNrLWluZGV4XCIpKTtzfHwocz0wKSx0LnNsaWRlQ291bnQ8PXQub3B0aW9ucy5zbGlkZXNUb1Nob3c/dC5zbGlkZUhhbmRsZXIocywhMSwhMCk6dC5zbGlkZUhhbmRsZXIocyl9LGUucHJvdG90eXBlLnNsaWRlSGFuZGxlcj1mdW5jdGlvbihpLGUsdCl7dmFyIG8scyxuLHIsbCxkPW51bGwsYT10aGlzO2lmKGU9ZXx8ITEsISghMD09PWEuYW5pbWF0aW5nJiYhMD09PWEub3B0aW9ucy53YWl0Rm9yQW5pbWF0ZXx8ITA9PT1hLm9wdGlvbnMuZmFkZSYmYS5jdXJyZW50U2xpZGU9PT1pKSlpZighMT09PWUmJmEuYXNOYXZGb3IoaSksbz1pLGQ9YS5nZXRMZWZ0KG8pLHI9YS5nZXRMZWZ0KGEuY3VycmVudFNsaWRlKSxhLmN1cnJlbnRMZWZ0PW51bGw9PT1hLnN3aXBlTGVmdD9yOmEuc3dpcGVMZWZ0LCExPT09YS5vcHRpb25zLmluZmluaXRlJiYhMT09PWEub3B0aW9ucy5jZW50ZXJNb2RlJiYoaTwwfHxpPmEuZ2V0RG90Q291bnQoKSphLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpKSExPT09YS5vcHRpb25zLmZhZGUmJihvPWEuY3VycmVudFNsaWRlLCEwIT09dD9hLmFuaW1hdGVTbGlkZShyLGZ1bmN0aW9uKCl7YS5wb3N0U2xpZGUobyl9KTphLnBvc3RTbGlkZShvKSk7ZWxzZSBpZighMT09PWEub3B0aW9ucy5pbmZpbml0ZSYmITA9PT1hLm9wdGlvbnMuY2VudGVyTW9kZSYmKGk8MHx8aT5hLnNsaWRlQ291bnQtYS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKSkhMT09PWEub3B0aW9ucy5mYWRlJiYobz1hLmN1cnJlbnRTbGlkZSwhMCE9PXQ/YS5hbmltYXRlU2xpZGUocixmdW5jdGlvbigpe2EucG9zdFNsaWRlKG8pfSk6YS5wb3N0U2xpZGUobykpO2Vsc2V7aWYoYS5vcHRpb25zLmF1dG9wbGF5JiZjbGVhckludGVydmFsKGEuYXV0b1BsYXlUaW1lcikscz1vPDA/YS5zbGlkZUNvdW50JWEub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCE9MD9hLnNsaWRlQ291bnQtYS5zbGlkZUNvdW50JWEub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDphLnNsaWRlQ291bnQrbzpvPj1hLnNsaWRlQ291bnQ/YS5zbGlkZUNvdW50JWEub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCE9MD8wOm8tYS5zbGlkZUNvdW50Om8sYS5hbmltYXRpbmc9ITAsYS4kc2xpZGVyLnRyaWdnZXIoXCJiZWZvcmVDaGFuZ2VcIixbYSxhLmN1cnJlbnRTbGlkZSxzXSksbj1hLmN1cnJlbnRTbGlkZSxhLmN1cnJlbnRTbGlkZT1zLGEuc2V0U2xpZGVDbGFzc2VzKGEuY3VycmVudFNsaWRlKSxhLm9wdGlvbnMuYXNOYXZGb3ImJihsPShsPWEuZ2V0TmF2VGFyZ2V0KCkpLnNsaWNrKFwiZ2V0U2xpY2tcIikpLnNsaWRlQ291bnQ8PWwub3B0aW9ucy5zbGlkZXNUb1Nob3cmJmwuc2V0U2xpZGVDbGFzc2VzKGEuY3VycmVudFNsaWRlKSxhLnVwZGF0ZURvdHMoKSxhLnVwZGF0ZUFycm93cygpLCEwPT09YS5vcHRpb25zLmZhZGUpcmV0dXJuITAhPT10PyhhLmZhZGVTbGlkZU91dChuKSxhLmZhZGVTbGlkZShzLGZ1bmN0aW9uKCl7YS5wb3N0U2xpZGUocyl9KSk6YS5wb3N0U2xpZGUocyksdm9pZCBhLmFuaW1hdGVIZWlnaHQoKTshMCE9PXQ/YS5hbmltYXRlU2xpZGUoZCxmdW5jdGlvbigpe2EucG9zdFNsaWRlKHMpfSk6YS5wb3N0U2xpZGUocyl9fSxlLnByb3RvdHlwZS5zdGFydExvYWQ9ZnVuY3Rpb24oKXt2YXIgaT10aGlzOyEwPT09aS5vcHRpb25zLmFycm93cyYmaS5zbGlkZUNvdW50Pmkub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihpLiRwcmV2QXJyb3cuaGlkZSgpLGkuJG5leHRBcnJvdy5oaWRlKCkpLCEwPT09aS5vcHRpb25zLmRvdHMmJmkuc2xpZGVDb3VudD5pLm9wdGlvbnMuc2xpZGVzVG9TaG93JiZpLiRkb3RzLmhpZGUoKSxpLiRzbGlkZXIuYWRkQ2xhc3MoXCJzbGljay1sb2FkaW5nXCIpfSxlLnByb3RvdHlwZS5zd2lwZURpcmVjdGlvbj1mdW5jdGlvbigpe3ZhciBpLGUsdCxvLHM9dGhpcztyZXR1cm4gaT1zLnRvdWNoT2JqZWN0LnN0YXJ0WC1zLnRvdWNoT2JqZWN0LmN1clgsZT1zLnRvdWNoT2JqZWN0LnN0YXJ0WS1zLnRvdWNoT2JqZWN0LmN1clksdD1NYXRoLmF0YW4yKGUsaSksKG89TWF0aC5yb3VuZCgxODAqdC9NYXRoLlBJKSk8MCYmKG89MzYwLU1hdGguYWJzKG8pKSxvPD00NSYmbz49MD8hMT09PXMub3B0aW9ucy5ydGw/XCJsZWZ0XCI6XCJyaWdodFwiOm88PTM2MCYmbz49MzE1PyExPT09cy5vcHRpb25zLnJ0bD9cImxlZnRcIjpcInJpZ2h0XCI6bz49MTM1JiZvPD0yMjU/ITE9PT1zLm9wdGlvbnMucnRsP1wicmlnaHRcIjpcImxlZnRcIjohMD09PXMub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmc/bz49MzUmJm88PTEzNT9cImRvd25cIjpcInVwXCI6XCJ2ZXJ0aWNhbFwifSxlLnByb3RvdHlwZS5zd2lwZUVuZD1mdW5jdGlvbihpKXt2YXIgZSx0LG89dGhpcztpZihvLmRyYWdnaW5nPSExLG8uc3dpcGluZz0hMSxvLnNjcm9sbGluZylyZXR1cm4gby5zY3JvbGxpbmc9ITEsITE7aWYoby5pbnRlcnJ1cHRlZD0hMSxvLnNob3VsZENsaWNrPSEoby50b3VjaE9iamVjdC5zd2lwZUxlbmd0aD4xMCksdm9pZCAwPT09by50b3VjaE9iamVjdC5jdXJYKXJldHVybiExO2lmKCEwPT09by50b3VjaE9iamVjdC5lZGdlSGl0JiZvLiRzbGlkZXIudHJpZ2dlcihcImVkZ2VcIixbbyxvLnN3aXBlRGlyZWN0aW9uKCldKSxvLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoPj1vLnRvdWNoT2JqZWN0Lm1pblN3aXBlKXtzd2l0Y2godD1vLnN3aXBlRGlyZWN0aW9uKCkpe2Nhc2VcImxlZnRcIjpjYXNlXCJkb3duXCI6ZT1vLm9wdGlvbnMuc3dpcGVUb1NsaWRlP28uY2hlY2tOYXZpZ2FibGUoby5jdXJyZW50U2xpZGUrby5nZXRTbGlkZUNvdW50KCkpOm8uY3VycmVudFNsaWRlK28uZ2V0U2xpZGVDb3VudCgpLG8uY3VycmVudERpcmVjdGlvbj0wO2JyZWFrO2Nhc2VcInJpZ2h0XCI6Y2FzZVwidXBcIjplPW8ub3B0aW9ucy5zd2lwZVRvU2xpZGU/by5jaGVja05hdmlnYWJsZShvLmN1cnJlbnRTbGlkZS1vLmdldFNsaWRlQ291bnQoKSk6by5jdXJyZW50U2xpZGUtby5nZXRTbGlkZUNvdW50KCksby5jdXJyZW50RGlyZWN0aW9uPTF9XCJ2ZXJ0aWNhbFwiIT10JiYoby5zbGlkZUhhbmRsZXIoZSksby50b3VjaE9iamVjdD17fSxvLiRzbGlkZXIudHJpZ2dlcihcInN3aXBlXCIsW28sdF0pKX1lbHNlIG8udG91Y2hPYmplY3Quc3RhcnRYIT09by50b3VjaE9iamVjdC5jdXJYJiYoby5zbGlkZUhhbmRsZXIoby5jdXJyZW50U2xpZGUpLG8udG91Y2hPYmplY3Q9e30pfSxlLnByb3RvdHlwZS5zd2lwZUhhbmRsZXI9ZnVuY3Rpb24oaSl7dmFyIGU9dGhpcztpZighKCExPT09ZS5vcHRpb25zLnN3aXBlfHxcIm9udG91Y2hlbmRcImluIGRvY3VtZW50JiYhMT09PWUub3B0aW9ucy5zd2lwZXx8ITE9PT1lLm9wdGlvbnMuZHJhZ2dhYmxlJiYtMSE9PWkudHlwZS5pbmRleE9mKFwibW91c2VcIikpKXN3aXRjaChlLnRvdWNoT2JqZWN0LmZpbmdlckNvdW50PWkub3JpZ2luYWxFdmVudCYmdm9pZCAwIT09aS5vcmlnaW5hbEV2ZW50LnRvdWNoZXM/aS5vcmlnaW5hbEV2ZW50LnRvdWNoZXMubGVuZ3RoOjEsZS50b3VjaE9iamVjdC5taW5Td2lwZT1lLmxpc3RXaWR0aC9lLm9wdGlvbnMudG91Y2hUaHJlc2hvbGQsITA9PT1lLm9wdGlvbnMudmVydGljYWxTd2lwaW5nJiYoZS50b3VjaE9iamVjdC5taW5Td2lwZT1lLmxpc3RIZWlnaHQvZS5vcHRpb25zLnRvdWNoVGhyZXNob2xkKSxpLmRhdGEuYWN0aW9uKXtjYXNlXCJzdGFydFwiOmUuc3dpcGVTdGFydChpKTticmVhaztjYXNlXCJtb3ZlXCI6ZS5zd2lwZU1vdmUoaSk7YnJlYWs7Y2FzZVwiZW5kXCI6ZS5zd2lwZUVuZChpKX19LGUucHJvdG90eXBlLnN3aXBlTW92ZT1mdW5jdGlvbihpKXt2YXIgZSx0LG8scyxuLHIsbD10aGlzO3JldHVybiBuPXZvaWQgMCE9PWkub3JpZ2luYWxFdmVudD9pLm9yaWdpbmFsRXZlbnQudG91Y2hlczpudWxsLCEoIWwuZHJhZ2dpbmd8fGwuc2Nyb2xsaW5nfHxuJiYxIT09bi5sZW5ndGgpJiYoZT1sLmdldExlZnQobC5jdXJyZW50U2xpZGUpLGwudG91Y2hPYmplY3QuY3VyWD12b2lkIDAhPT1uP25bMF0ucGFnZVg6aS5jbGllbnRYLGwudG91Y2hPYmplY3QuY3VyWT12b2lkIDAhPT1uP25bMF0ucGFnZVk6aS5jbGllbnRZLGwudG91Y2hPYmplY3Quc3dpcGVMZW5ndGg9TWF0aC5yb3VuZChNYXRoLnNxcnQoTWF0aC5wb3cobC50b3VjaE9iamVjdC5jdXJYLWwudG91Y2hPYmplY3Quc3RhcnRYLDIpKSkscj1NYXRoLnJvdW5kKE1hdGguc3FydChNYXRoLnBvdyhsLnRvdWNoT2JqZWN0LmN1clktbC50b3VjaE9iamVjdC5zdGFydFksMikpKSwhbC5vcHRpb25zLnZlcnRpY2FsU3dpcGluZyYmIWwuc3dpcGluZyYmcj40PyhsLnNjcm9sbGluZz0hMCwhMSk6KCEwPT09bC5vcHRpb25zLnZlcnRpY2FsU3dpcGluZyYmKGwudG91Y2hPYmplY3Quc3dpcGVMZW5ndGg9ciksdD1sLnN3aXBlRGlyZWN0aW9uKCksdm9pZCAwIT09aS5vcmlnaW5hbEV2ZW50JiZsLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoPjQmJihsLnN3aXBpbmc9ITAsaS5wcmV2ZW50RGVmYXVsdCgpKSxzPSghMT09PWwub3B0aW9ucy5ydGw/MTotMSkqKGwudG91Y2hPYmplY3QuY3VyWD5sLnRvdWNoT2JqZWN0LnN0YXJ0WD8xOi0xKSwhMD09PWwub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmcmJihzPWwudG91Y2hPYmplY3QuY3VyWT5sLnRvdWNoT2JqZWN0LnN0YXJ0WT8xOi0xKSxvPWwudG91Y2hPYmplY3Quc3dpcGVMZW5ndGgsbC50b3VjaE9iamVjdC5lZGdlSGl0PSExLCExPT09bC5vcHRpb25zLmluZmluaXRlJiYoMD09PWwuY3VycmVudFNsaWRlJiZcInJpZ2h0XCI9PT10fHxsLmN1cnJlbnRTbGlkZT49bC5nZXREb3RDb3VudCgpJiZcImxlZnRcIj09PXQpJiYobz1sLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoKmwub3B0aW9ucy5lZGdlRnJpY3Rpb24sbC50b3VjaE9iamVjdC5lZGdlSGl0PSEwKSwhMT09PWwub3B0aW9ucy52ZXJ0aWNhbD9sLnN3aXBlTGVmdD1lK28qczpsLnN3aXBlTGVmdD1lK28qKGwuJGxpc3QuaGVpZ2h0KCkvbC5saXN0V2lkdGgpKnMsITA9PT1sLm9wdGlvbnMudmVydGljYWxTd2lwaW5nJiYobC5zd2lwZUxlZnQ9ZStvKnMpLCEwIT09bC5vcHRpb25zLmZhZGUmJiExIT09bC5vcHRpb25zLnRvdWNoTW92ZSYmKCEwPT09bC5hbmltYXRpbmc/KGwuc3dpcGVMZWZ0PW51bGwsITEpOnZvaWQgbC5zZXRDU1MobC5zd2lwZUxlZnQpKSkpfSxlLnByb3RvdHlwZS5zd2lwZVN0YXJ0PWZ1bmN0aW9uKGkpe3ZhciBlLHQ9dGhpcztpZih0LmludGVycnVwdGVkPSEwLDEhPT10LnRvdWNoT2JqZWN0LmZpbmdlckNvdW50fHx0LnNsaWRlQ291bnQ8PXQub3B0aW9ucy5zbGlkZXNUb1Nob3cpcmV0dXJuIHQudG91Y2hPYmplY3Q9e30sITE7dm9pZCAwIT09aS5vcmlnaW5hbEV2ZW50JiZ2b2lkIDAhPT1pLm9yaWdpbmFsRXZlbnQudG91Y2hlcyYmKGU9aS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF0pLHQudG91Y2hPYmplY3Quc3RhcnRYPXQudG91Y2hPYmplY3QuY3VyWD12b2lkIDAhPT1lP2UucGFnZVg6aS5jbGllbnRYLHQudG91Y2hPYmplY3Quc3RhcnRZPXQudG91Y2hPYmplY3QuY3VyWT12b2lkIDAhPT1lP2UucGFnZVk6aS5jbGllbnRZLHQuZHJhZ2dpbmc9ITB9LGUucHJvdG90eXBlLnVuZmlsdGVyU2xpZGVzPWUucHJvdG90eXBlLnNsaWNrVW5maWx0ZXI9ZnVuY3Rpb24oKXt2YXIgaT10aGlzO251bGwhPT1pLiRzbGlkZXNDYWNoZSYmKGkudW5sb2FkKCksaS4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpLGkuJHNsaWRlc0NhY2hlLmFwcGVuZFRvKGkuJHNsaWRlVHJhY2spLGkucmVpbml0KCkpfSxlLnByb3RvdHlwZS51bmxvYWQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2koXCIuc2xpY2stY2xvbmVkXCIsZS4kc2xpZGVyKS5yZW1vdmUoKSxlLiRkb3RzJiZlLiRkb3RzLnJlbW92ZSgpLGUuJHByZXZBcnJvdyYmZS5odG1sRXhwci50ZXN0KGUub3B0aW9ucy5wcmV2QXJyb3cpJiZlLiRwcmV2QXJyb3cucmVtb3ZlKCksZS4kbmV4dEFycm93JiZlLmh0bWxFeHByLnRlc3QoZS5vcHRpb25zLm5leHRBcnJvdykmJmUuJG5leHRBcnJvdy5yZW1vdmUoKSxlLiRzbGlkZXMucmVtb3ZlQ2xhc3MoXCJzbGljay1zbGlkZSBzbGljay1hY3RpdmUgc2xpY2stdmlzaWJsZSBzbGljay1jdXJyZW50XCIpLmF0dHIoXCJhcmlhLWhpZGRlblwiLFwidHJ1ZVwiKS5jc3MoXCJ3aWR0aFwiLFwiXCIpfSxlLnByb3RvdHlwZS51bnNsaWNrPWZ1bmN0aW9uKGkpe3ZhciBlPXRoaXM7ZS4kc2xpZGVyLnRyaWdnZXIoXCJ1bnNsaWNrXCIsW2UsaV0pLGUuZGVzdHJveSgpfSxlLnByb3RvdHlwZS51cGRhdGVBcnJvd3M9ZnVuY3Rpb24oKXt2YXIgaT10aGlzO01hdGguZmxvb3IoaS5vcHRpb25zLnNsaWRlc1RvU2hvdy8yKSwhMD09PWkub3B0aW9ucy5hcnJvd3MmJmkuc2xpZGVDb3VudD5pLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYhaS5vcHRpb25zLmluZmluaXRlJiYoaS4kcHJldkFycm93LnJlbW92ZUNsYXNzKFwic2xpY2stZGlzYWJsZWRcIikuYXR0cihcImFyaWEtZGlzYWJsZWRcIixcImZhbHNlXCIpLGkuJG5leHRBcnJvdy5yZW1vdmVDbGFzcyhcInNsaWNrLWRpc2FibGVkXCIpLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJmYWxzZVwiKSwwPT09aS5jdXJyZW50U2xpZGU/KGkuJHByZXZBcnJvdy5hZGRDbGFzcyhcInNsaWNrLWRpc2FibGVkXCIpLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJ0cnVlXCIpLGkuJG5leHRBcnJvdy5yZW1vdmVDbGFzcyhcInNsaWNrLWRpc2FibGVkXCIpLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJmYWxzZVwiKSk6aS5jdXJyZW50U2xpZGU+PWkuc2xpZGVDb3VudC1pLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYhMT09PWkub3B0aW9ucy5jZW50ZXJNb2RlPyhpLiRuZXh0QXJyb3cuYWRkQ2xhc3MoXCJzbGljay1kaXNhYmxlZFwiKS5hdHRyKFwiYXJpYS1kaXNhYmxlZFwiLFwidHJ1ZVwiKSxpLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoXCJzbGljay1kaXNhYmxlZFwiKS5hdHRyKFwiYXJpYS1kaXNhYmxlZFwiLFwiZmFsc2VcIikpOmkuY3VycmVudFNsaWRlPj1pLnNsaWRlQ291bnQtMSYmITA9PT1pLm9wdGlvbnMuY2VudGVyTW9kZSYmKGkuJG5leHRBcnJvdy5hZGRDbGFzcyhcInNsaWNrLWRpc2FibGVkXCIpLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJ0cnVlXCIpLGkuJHByZXZBcnJvdy5yZW1vdmVDbGFzcyhcInNsaWNrLWRpc2FibGVkXCIpLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJmYWxzZVwiKSkpfSxlLnByb3RvdHlwZS51cGRhdGVEb3RzPWZ1bmN0aW9uKCl7dmFyIGk9dGhpcztudWxsIT09aS4kZG90cyYmKGkuJGRvdHMuZmluZChcImxpXCIpLnJlbW92ZUNsYXNzKFwic2xpY2stYWN0aXZlXCIpLmVuZCgpLGkuJGRvdHMuZmluZChcImxpXCIpLmVxKE1hdGguZmxvb3IoaS5jdXJyZW50U2xpZGUvaS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKSkuYWRkQ2xhc3MoXCJzbGljay1hY3RpdmVcIikpfSxlLnByb3RvdHlwZS52aXNpYmlsaXR5PWZ1bmN0aW9uKCl7dmFyIGk9dGhpcztpLm9wdGlvbnMuYXV0b3BsYXkmJihkb2N1bWVudFtpLmhpZGRlbl0/aS5pbnRlcnJ1cHRlZD0hMDppLmludGVycnVwdGVkPSExKX0saS5mbi5zbGljaz1mdW5jdGlvbigpe3ZhciBpLHQsbz10aGlzLHM9YXJndW1lbnRzWzBdLG49QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpLHI9by5sZW5ndGg7Zm9yKGk9MDtpPHI7aSsrKWlmKFwib2JqZWN0XCI9PXR5cGVvZiBzfHx2b2lkIDA9PT1zP29baV0uc2xpY2s9bmV3IGUob1tpXSxzKTp0PW9baV0uc2xpY2tbc10uYXBwbHkob1tpXS5zbGljayxuKSx2b2lkIDAhPT10KXJldHVybiB0O3JldHVybiBvfX0pO1xuXHJcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG4gICAgICAgICQoJy5iYW5uZXJzLXNsaWRlcicpLnNsaWNrKHtcclxuICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcclxuICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgcHJldkFycm93OiAnPGJ1dHRvbiBjbGFzcz1cInByZXYgYXJyb3dcIj48L2J1dHRvbj4nLFxyXG4gICAgICAgICAgbmV4dEFycm93OiAnPGJ1dHRvbiBjbGFzcz1cIm5leHQgYXJyb3dcIj48L2J1dHRvbj4nLFxyXG4gICAgICAgICAgcmVzcG9uc2l2ZTogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiAxMDI0LFxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAvLyBwcmV2QXJyb3c6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAvLyBuZXh0QXJyb3c6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlXHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIHtcclxuICAgICAgICAgICAgLy8gICAgIGJyZWFrcG9pbnQ6IDYwMCxcclxuICAgICAgICAgICAgLy8gICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgIC8vICAgICBzbGlkZXNUb1Nob3c6IDIsXHJcbiAgICAgICAgICAgIC8vICAgICBzbGlkZXNUb1Njcm9sbDogMlxyXG4gICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiAzMjAsXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBwcmV2QXJyb3c6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICBuZXh0QXJyb3c6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBZb3UgY2FuIHVuc2xpY2sgYXQgYSBnaXZlbiBicmVha3BvaW50IG5vdyBieSBhZGRpbmc6XHJcbiAgICAgICAgICAgIC8vIHNldHRpbmdzOiBcInVuc2xpY2tcIlxyXG4gICAgICAgICAgICAvLyBpbnN0ZWFkIG9mIGEgc2V0dGluZ3Mgb2JqZWN0XHJcbiAgICAgICAgXVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJCgnLnByb2R1Y3Qtc2xpZGVyJykuc2xpY2soe1xyXG4gICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBzcGVlZDogMzAwLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDQsXHJcbiAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiA0LFxyXG4gICAgICAgICAgICBwcmV2QXJyb3c6ICc8YnV0dG9uIGNsYXNzPVwicHJldiBhcnJvd1wiPjwvYnV0dG9uPicsXHJcbiAgICAgICAgICAgIG5leHRBcnJvdzogJzxidXR0b24gY2xhc3M9XCJuZXh0IGFycm93XCI+PC9idXR0b24+JyxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDEwMjQsXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDYwMCxcclxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMixcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNDgwLFxyXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogMzIwLFxyXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgcHJldkFycm93OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgIG5leHRBcnJvdzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBZb3UgY2FuIHVuc2xpY2sgYXQgYSBnaXZlbiBicmVha3BvaW50IG5vdyBieSBhZGRpbmc6XHJcbiAgICAgICAgICAgICAgICAvLyBzZXR0aW5nczogXCJ1bnNsaWNrXCJcclxuICAgICAgICAgICAgICAgIC8vIGluc3RlYWQgb2YgYSBzZXR0aW5ncyBvYmplY3RcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gIFxyXG4gICAgXHJcbiAgICAvLyAkKGZ1bmN0aW9uKCl7XHJcbiAgICAvLyAgICAgJCgnLnByb2R1Y3QtbGlzdC1leHBlbmQnKS5jbGljayhmdW5jdGlvbigpe1xyXG4gICAgLy8gICAgICAgICAkKCcucHJvZHVjdC1saXN0JykudG9nZ2xlQ2xhc3MoJ3Byb2R1Y3Qtc2xpZGVyJyk7XHJcbiAgICAvLyAgICAgfSk7XHJcbiAgICAvLyB9KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqINCk0LjQutGB0LjRgNC+0LLQsNC90L3Ri9C5INGF0LXQtNC10YBcclxuICAgICAqL1xyXG5cclxuICAgIC8vICQod2luZG93KS5vbignc2Nyb2xsJywgdG9nZ2xlRml4ZWRIZWFkZXIpO1xyXG5cclxuICAgIC8vIGZ1bmN0aW9uIHRvZ2dsZUZpeGVkSGVhZGVyKCkge1xyXG4gICAgLy8gICAgIGNvbnN0ICRoZWFkZXIgPSAkKCcuaGVhZGVyJyk7XHJcbiAgICAvLyAgICAgY29uc3QgJG1haW4gPSAkKCcuaGVhZGVyJykubmV4dCgpO1xyXG5cclxuICAgIC8vICAgICBpZiAod2luZG93LnBhZ2VZT2Zmc2V0ID4gMCkge1xyXG4gICAgLy8gICAgICAgICAkaGVhZGVyLmFkZENsYXNzKCdpcy1maXhlZCcpO1xyXG4gICAgLy8gICAgICAgICAkbWFpbi5jc3MoeyBtYXJnaW5Ub3A6ICRoZWFkZXIub3V0ZXJIZWlnaHQoKSB9KTtcclxuICAgIC8vICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAkaGVhZGVyLnJlbW92ZUNsYXNzKCdpcy1maXhlZCcpO1xyXG4gICAgLy8gICAgICAgICAkbWFpbi5jc3MoeyBtYXJnaW5Ub3A6IDAgfSk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG5cclxuXHJcblxyXG5cclxuO1xyXG5cclxufSk7XHJcbiJdLCJmaWxlIjoiaW50ZXJuYWwuanMifQ==
