const baseAPIUrl = 'https://chartertickets.com.ua'

const translations = {
  ru: {
    nutrition_modal_title: 'Выберите питание в самолет',
    submit: 'Ок',
    cancel: 'Отмена',
    UAH: 'грн'
  }
}

if (!('language' in window)) {
  let language = $('html').attr('lang')
  if (language === '') {
    language = 'ru'
  }
  window.language = language
}

if (!('$t' in window)) {
  window.$t = phrase => translations[language][phrase]
}

const getFlyId = fly => `${fly.fromAlias}-${fly.toAlias}`

const getFlyTabTemplate = (fly, { makeActive = false } = ({})) => {
  const flyAliases = getFlyId(fly)
  const flyLabel = `${fly.fromAlias} - ${fly.toAlias}`
  return `
<li class="nav-item">
  <a class="nav-link ${ makeActive ? 'active' : ''}" id="${flyAliases}-tab" data-toggle="tab" href="#${flyAliases}" role="tab" aria-controls="${flyAliases}" aria-selected="${makeActive}">${flyLabel}</a>
</li>
`
}

/* <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">

              </div> */

const getFlyTabContentTemplate = (fly, { makeActive = false } = ({})) => {
  const flyAliases = getFlyId(fly)
  return `
<div class="tab-pane fade ${makeActive ? 'show active' : ''}" id="${flyAliases}" role="tabpanel" aria-labelledby="${flyAliases}-tab">
<div class="row nutrition-list">
</div>
</div>
`
}

const getNutritionItemTemplate = item => `
<div class="col-md-3">
  <div class="nutrition-item" data-code="${item.code}">
    <div class="nutrition-image-wrapper">
      <img src="${baseAPIUrl}${item.image_url}" alt="" class="nutrition-item-image" />
    </div>
    <div class="text-center nutrition-description">
      ${item[`description_${language}`]}
    </div>

    <strong class="nutrition-price">
      ${item.price} ${$t('UAH')}
    </strong>

    <div class="nutrition-price-controls">
      <button class="decrease">-</button>
      <input type="number" data-price="${item.price}" class="form-control nutritions" value="0" min="0" max="4"/>
      <button class="increase">+</button>
    </div>
  </div>
</div>
`

const nutritionsService = {
  fetch({ flyId, flyHash } = ({})) {
    return $.get(
      `${baseAPIUrl}/web-data/additional-services`,
      {
        fly_property_id: flyId,
        hash: flyHash,
        additional_service: 'nutritions',
      }
    )
  }
}

const nutritionsList = {
  init({ flyId, flyHash, existsFlightBack, operator }) {
    this.flyId = flyId
    this.flyHash = flyHash
    this.existsFlightBack = existsFlightBack
    this.operator = operator

    $(document).on('click', '#nutrition-ok', this.submit);
    $(document).on('click', '.nutrition-btn', this.onNutritionButtonClick);

    this.addFlyTabs()
    this.getNutritions({ flyId, flyHash, existsFlightBack })
  },

  async getNutritions() {
    nutritionsService.fetch({ flyId: this.flyId, flyHash: this.flyHash }).done((nutritions) => {

      const directions = ['from']
      if (this.existsFlightBack) {
        directions.push('to')
      }

      for (direction of directions) {
        $(`.nutrition-list--${direction}`).empty()
        nutritions.nutritions.forEach(item => {
          this.addNutrition(item, direction)
        })
      }
    })
  },

  addFlyTabs() {
    const [ cityOne, cityTwo ] = this.flyHash.split('_')
    this.addFlyTab({
      fromAlias: cityOne,
      toAlias: cityTwo
    }, { makeActive: true })

    if (this.existsFlightBack) {
      this.addFlyTab({
        fromAlias: cityTwo,
        toAlias: cityOne
      })
    }
  },

  addFlyTab(fly, options = { makeActive: false }) {
    $('#directionTabs').append(getFlyTabTemplate(fly, options))
    $('#directionTabsContent').append(getFlyTabContentTemplate(fly, options))
  },

  addNutrition(nutrition, direction) {
    // TODO: fly id
    $(`.nutrition-list`).append(getNutritionItemTemplate(nutrition))
    $(`.nutrition-item[data-code=${nutrition.code}] .decrease`).on('click', (event) => {
      if (number === 0) {
        $(`#${type}-minus`).addClass('opacity')
      } else {
        $(`#${type}-minus`).removeClass('opacity')
      }
    })
  },

  submit() {
    if (typeof nutrition_data[work_name_nutrition] === 'undefined') {
      nutrition_data[work_name_nutrition] = {};
    }
    if (typeof nutrition_data[work_name_nutrition][index_nutrition] === 'undefined') {
      nutrition_data[work_name_nutrition][index_nutrition] = {};
    }
    var new_val = 0;
    $.each($('.nutritions'), function (index, value) {
      nutrition_data[work_name_nutrition][index_nutrition][index] = value.value;
    });
    $.each(nutrition_data[work_name_nutrition], function (index_p, pass) {
      $.each($('.nutritions'), function (index, value) {
        if (!(typeof nutrition_data[work_name_nutrition] === 'undefined' || typeof nutrition_data[work_name_nutrition][index_p] === 'undefined')) {
          new_val += $(value).data('price') * nutrition_data[work_name_nutrition][index_p][index];
        }
      });
    });

    if (work_name_nutrition_back != '') {
      if (typeof nutrition_data[work_name_nutrition_back] === 'undefined') {
        nutrition_data[work_name_nutrition_back] = {};
      }
      if (typeof nutrition_data[work_name_nutrition_back][index_nutrition] === 'undefined') {
        nutrition_data[work_name_nutrition_back][index_nutrition] = {};
      }
      $.each($('.nutritions_back'), function (index, value) {
        nutrition_data[work_name_nutrition_back][index_nutrition][index] = value.value;
      });
      $.each(nutrition_data[work_name_nutrition_back], function (index_p, pass) {
        $.each($('.nutritions'), function (index, value) {
          if (!(typeof nutrition_data[work_name_nutrition_back] === 'undefined' || typeof nutrition_data[work_name_nutrition_back][index_p] === 'undefined')) {
            new_val += $(value).data('price') * nutrition_data[work_name_nutrition_back][index_p][index];
          }
        });
      });
    }
    $('.service-price').data('price_service_digits', new_val);
    if (new_val == 0) {
      $('.service-block').hide();
    } else {
      $('.service-block').show();
    }
    $('.service-price').text(number_format(new_val, 0, '', ' ') + ' грн');
  },

  onNutritionButtonClick() {
    work_name_nutrition = $(this).data("id_to");
    work_name_nutrition_back = $(this).data("id_back");
    index_nutrition = $(this).data("n_index");
    $.each($('.nutritions'), function (index, value) {
      if (typeof nutrition_data[work_name_nutrition] === 'undefined' || typeof nutrition_data[work_name_nutrition][index_nutrition] === 'undefined') {
        value.value = 0;
      } else {
        value.value = nutrition_data[work_name_nutrition][index_nutrition][index];
      }
    });
    if (work_name_nutrition_back != '') {
      $.each($('.nutritions_back'), function (index, value) {
        if (typeof nutrition_data[work_name_nutrition_back] === 'undefined' || typeof nutrition_data[work_name_nutrition_back][index_nutrition] === 'undefined') {
          value.value = 0;
        } else {
          value.value = nutrition_data[work_name_nutrition_back][index_nutrition][index];
        }
      });
    }
    $('#nutritionModal').modal('show');
  }
}

$(document).ready(() => {
  nutritionsList.init({
    flyId: 62578015,
    flyHash: 'KBP_TBS',
    existsFlightBack: true,
    operator: 'SKYUP',
  })
})
