const baseAPIUrl = 'https://chartertickets.com.ua'

let language = $('html').attr('lang')
if (language === '') {
  language = 'ru'
}

// TODO: polyfill for safari
function updateQueryParam (key, value) {
  const queryParam = new URLSearchParams(window.location.search)
  queryParam.set(key, value)

  // order of query parameters is very important!
  const keys = [
    'type',
    'country_from',
    'city_from',
    'country_to',
    'city_to',
    'date_from',
    'date_to',
    'adults',
    'children',
    'childes',
    'schema'
  ]
  let queryString = ''

  keys.forEach(key => {
    if (queryParam.has(key)) {
      queryString += `${key}=${queryParam.get(key)}&`
    }
  })

  queryString = queryString.slice(0, queryString.length - 1)

  history.replaceState(null, '', window.location.pathname + '?' + queryString)
}

function removeQueryParam (key) {
  const queryParam = new URLSearchParams(window.location.search)
  queryParam.delete(key)
  history.replaceState(null, '', window.location.pathname + '?' + queryParam.toString())
}

function sortByNameAlphabetically (a, b) {
  if (a.name < b.name) { return -1 }
  if (a.name > b.name) { return 1 }
  return 0
}

function getOldTripTypeName (type) {
  return (type === 'one_way' || type === 'one_trip') ? 'one_trip' : 'round_way'
}

// format 'yyyy-mm-dd'
function stringifyDate (date) {
  if (!date) {
    return ''
  }
  var e = date.getMonth() + 1
  var c = date.getDate()
  return date.getFullYear() + '-' + (e < 10 ? '0' : '') + e + '-' + (c < 10 ? '0' : '') + c
}

// format 'dd-mm-yyyy'
/* function stringifyDate2 (date) {
  var e = date.getMonth() + 1
  var c = date.getDate()
  return (c < 10 ? '0' : '') + c + '-' + (e < 10 ? '0' : '') + e + '-' + date.getFullYear()
} */

function stringToDate (string) {
  const date = new Date()
  try {
    const [year, month, day] = string.split('-')
    date.setUTCFullYear(+year)
    date.setUTCMonth(+month - 1)
    date.setUTCDate(+day)
    date.setUTCHours(0)
    return date
  } catch (e) {
    return null
  }
}

function submitRequest (buttonId) {
  if (document.getElementById(buttonId) == null ||
    document.getElementById(buttonId) === undefined) {
    return
  }
  if (document.getElementById(buttonId).dispatchEvent) {
    var e = document.createEvent('MouseEvents')
    e.initEvent('click', true, true)
    document.getElementById(buttonId).dispatchEvent(e)
  } else {
    document.getElementById(buttonId).click()
  }
}

const searchService = {
  getDirections (typeLabel) {
    const type = typeLabel === 'one_way' ? '1' : '2'
    return $.get(`${baseAPIUrl}/get-directions`, { type })
  },

  getDateDepartureTickets ({ tripType, departureCityAlias, arrivalCityAlias } = {}) {
    return $.ajax({
      url: baseAPIUrl + '/web-data/get-date-departure-tickets',
      type: 'GET',
      dataType: 'json',
      cache: false,
      data: {
        type: getOldTripTypeName(tripType),
        city_from: departureCityAlias,
        city_to: arrivalCityAlias
      }
    })
  },

  getDateArrivalTickets ({ departureDate, departureCityAlias, arrivalCityAlias } = {}) {
    return $.ajax({
      url: baseAPIUrl + '/web-data/get-date-arrival-tickets',
      type: 'GET',
      dataType: 'json',
      cache: false,
      data: {
        departureDate,
        city_from: departureCityAlias,
        city_to: arrivalCityAlias
      }
    })
  }
}

const searchComponent = {
  cities: {},
  directions: {
    one_way: [],
    round_way: []
  },
  departureCountries: [],
  arrivalCountries: [],
  departureCountryAlias: '',
  departureCityCode: '',
  arrivalCountryAlias: '',
  arrivalCityCode: '',
  tripType: 'round_way',
  departureDate: undefined,
  arrivalDate: undefined,
  adultsTickets: 1,
  childrenTickets: 0,
  childesTickets: 0,
  _datesLoadPromise: null,
  lastOneWayDepartureDate: undefined, // is needed to restore departure date after changing trip type OW->RW->OW
  lastRoundWayDepartureDate: undefined, // is needed to restore departure date after changing trip type RW->OW->RW
  lastRoundWayArrivalDate: undefined, // is needed to restore arrival date after changing trip type RW->OW->RW

  init () {
    this._initEventHandlers()
    window.addEventListener('resize', () => this.onWindowResize())

    const urlParams = new URLSearchParams(window.location.search)

    const countryFrom = urlParams.get('country_from') || ''
    const countryTo = urlParams.get('country_to') || ''
    const cityFrom = urlParams.get('city_from')
    const cityTo = urlParams.get('city_to')
    let cityFromCode = ''
    let cityToCode = ''

    const dateFrom = urlParams.get('date_from')
    const dateTo = urlParams.get('date_to')

    const adults = urlParams.get('adults')
    if (adults !== null) {
      this.adultsTickets = +adults
    }
    $('.adults').val(this.adultsTickets)

    const children = urlParams.get('children')
    if (children !== null) {
      this.chidlrenTickets = +children
    }
    $('.children').val(this.childrenTickets)

    const childes = urlParams.get('childes')
    if (childes !== null) {
      this.childesTickets = +childes
    }
    $('.childes').val(this.childesTickets)
    this._updateTicketSum()

    const getDataPromise = $.get(`${baseAPIUrl}/get-data-translates`, response => {
      this.cities = response
      if (cityFrom !== null) {
        for (const city in this.cities) {
          if (this.cities[city].alias === cityFrom) {
            cityFromCode = city
            break
          }
        }
      }

      if (cityTo !== null) {
        for (const city in this.cities) {
          if (this.cities[city].alias === cityTo) {
            cityToCode = city
            break
          }
        }
      }
    })

    const type = urlParams.get('type')
    if (type !== null) {
      this.tripType = (type === 'one_way' || type === 'one_trip') ? 'one_way' : 'round_way'
      $(`.trip-type[value='${this.tripType}']`).prop('checked', true)
    } else {
      updateQueryParam('type', this.tripType)
      $(".trip-type[value='round_way']").prop('checked', true)
    }
    // set global variable to keep old code working
    trip_type = getOldTripTypeName(this.tripType)

    const getDirectionsPromise = searchService.getDirections(this.tripType)
      .done((response) => { this.directions[this.tripType] = response })

    this.showLoader()
    Promise.all([getDataPromise, getDirectionsPromise]).then(() => {
      this.setDepartureCountries()

      let showDepartureSelector = false
      if (countryFrom !== '') {
        this.selectDepartureCountry(countryFrom)

        if (cityFrom) {
          this.selectDepartureCity(cityFromCode)
        } else {
          showDepartureSelector = true
        }
      } else {
        showDepartureSelector = true
      }

      if (showDepartureSelector) {
        this.showDepartureSelector()
      }

      let showArrivalSelector = false
      if (countryTo !== '') {
        this.selectArrivalCountry(countryTo)

        if (cityToCode !== '') {
          this.selectArrivalCity(cityToCode)
        } else {
          showArrivalSelector = true
        }
      } else {
        showArrivalSelector = true
      }

      if (!showDepartureSelector && showArrivalSelector) {
        this.showArrivalSelector()
      }

      if (this.departureCountryAlias !== '' && this.departureCityCode !== '' && this.arrivalCountryAlias !== '' && this.arrivalCityCode !== '') {
        if (dateFrom !== null) {
          // save just in departureDate and arrivalDate instead of using
          // selectDepartureDate and selectArrivalDate methods to avoid
          // useless actions and save only to be able to restore in updateDateFields
          // where all needed actions are performed
          this.departureDate = stringToDate(dateFrom)
          if (dateTo !== null) {
            this.arrivalDate = stringToDate(dateTo)
          }
          /* // this.selectDepartureDate(stringToDate(dateFrom)).then(() => {
            if (dateTo !== null) {
              this.selectArrivalDate(stringToDate(dateTo))
            }
          }) */
        }
        this._updateDateFields().then(() => {
          if (this.validateSearch()) {
            $('#search').click()
          }
        })
      } else {
        this.hideLoader()
      }
    })
      .catch(() => this.hideLoader())
  },

  showDepartureSelector () {
    $('.popup.popup-from').removeClass('hide')
  },

  showArrivalSelector () {
    $('.popup.popup-to').removeClass('hide')
  },

  setDepartureCountries () {
    const departureCities = this.directions[this.tripType].map(item => item.split(';')[0])
    this._setCountriesByCities(departureCities, 'from')
  },

  /* _setMobileCities(cities, direction) {
    const citiesToShow = cities.map(cityCode => ({
      name: this.cities[cityCode][language],
      alias: this.cities[cityCode].alias,
      country: {
        name: this.cities[cityCode].country[language],
        alias: this.cities[cityCode].country.alias
      }
    }))
    citiesToShow.sort(sortByNameAlphabetically)
    $(`.popup-${direction} .city-container--mobile`).empty()

    for (const city in citiesToShow) {
      $(`.popup-${direction} .city-container--mobile`).append(
        `<li class="popup-pick-city-item--mobile city-${direction}" data-country="${city.country.alias}">${city.name}</li>`
      )
    }
  }, */

  selectDepartureCountry (countryAlias) {
    $('.country-from').removeClass('active')
    $(`.country-from[data-country='${countryAlias}']`).addClass('active')
    $('input#fly-to').val('')
    this.resetDatepicker()
    $('.date-fly-data').addClass('hide')

    this._setCitiesByCountry(countryAlias, 'from')

    updateQueryParam('country_from', countryAlias)
    this.departureCountryAlias = countryAlias
  },

  selectDepartureCity (departureCityCode) {
    $('.from').removeClass('active')
    $(`.popup-pick-city-item.from[data-city='${departureCityCode}']`).addClass('active')
    $('input#fly-from').val($(`.popup-pick-city-item.from[data-city='${departureCityCode}']`).text())
    this.resetDatepicker()
    $('input#fly-to').val('')
    $('.date-fly-data').addClass('hide')
    $('.popup-to .popup-pick-city').addClass('hide')

    const directionsFromDeparture = this.directions[this.tripType].filter(item => item.split(';')[0] === departureCityCode)
    const arrivalCities = directionsFromDeparture.map(item => item.split(';')[1])
    this._setCountriesByCities(arrivalCities, 'to')
    if (this.arrivalCountryAlias && arrivalCities.findIndex(c => this.cities[c].country.alias === this.arrivalCountryAlias)) {
      this.removeArrivalCountry()
      this.removeArrivalCity()
    }

    updateQueryParam('city_from', this.cities[departureCityCode].alias)
    this.departureCityCode = departureCityCode

    // set global variable to keep old code working
    t_from_city = this.cities[departureCityCode].alias
  },

  selectArrivalCountry (countryAlias) {
    $('.popup-to .popup-pick-city').removeClass('hide')
    $('.country-to').removeClass('active')
    $(`.country-to[data-country='${countryAlias}']`).addClass('active')
    this.resetDatepicker()
    $('.date-fly-data').addClass('hide')

    this._setCitiesByCountry(countryAlias, 'to')

    updateQueryParam('country_to', countryAlias)
    this.arrivalCountryAlias = countryAlias
  },

  selectArrivalCity (arrivalCityCode) {
    $('.to').removeClass('active')
    $(`.popup-pick-city-item.to[data-city='${arrivalCityCode}']`).addClass('active')
    $('input#fly-to').val($(`.popup-pick-city-item.to[data-city='${arrivalCityCode}']`).text())

    updateQueryParam('city_to', this.cities[arrivalCityCode].alias)
    this.arrivalCityCode = arrivalCityCode
    // set global variable to keep old code working
    t_to_city = this.cities[arrivalCityCode].alias

    this._updateDateFields({ resetDates: true })
  },

  removeDepartureCountry () {
    this.departureCountryAlias = ''
    $('.country-from').removeClass('active')
    removeQueryParam('country_from')
    this._updateDateFields()
  },

  removeDepartureCity (keepInput = false) {
    if (!keepInput) {
      $('input#fly-from').val('')
    }
    this.departureCityCode = ''
    $('.from').removeClass('active')
    removeQueryParam('city_from')
    this._updateDateFields()
  },

  removeArrivalCountry () {
    $('.country-to').removeClass('active')
    removeQueryParam('country_to')
    this.arrivalCountryAlias = ''
    this._updateDateFields()
  },

  removeArrivalCity (keepInput = false) {
    if (!keepInput) {
      $('input#fly-to').val()
    }
    $('.to').removeClass('active')
    removeQueryParam('city_to')
    this.arrivalCityCode = ''
    this._updateDateFields()
  },

  resetDatepicker () {
    this.selectDepartureDate(null)
    this.selectArrivalDate(null)
  },

  changeDirection () {
    const changeDirection = `${this.arrivalCityCode};${this.departureCityCode}`
    if (this.directions[this.tripType].includes(changeDirection)) {
      const oldDepartureCityCode = this.departureCityCode
      const oldArrivalCityCode = this.arrivalCityCode

      const oldDepartureCountryAlias = this.departureCountryAlias
      const oldArrivalCountryAlias = this.arrivalCountryAlias

      tripList.clear()
      this.selectDepartureCountry(oldArrivalCountryAlias)
      this.selectDepartureCity(oldArrivalCityCode)
      this.selectArrivalCountry(oldDepartureCountryAlias)
      this.selectArrivalCity(oldDepartureCityCode)
      this._updateDateFields()
    } else {
      $('#modal-info').modal('show')
    }
  },

  selectTripType (type) {
    if (this.tripType === type) {
      return
    };

    if (type === 'one_way') {
      removeQueryParam('date_to')
    }

    this.showLoader()
    tripList.clear()
    const oldType = this.tripType
    this.tripType = type
    updateQueryParam('type', this.tripType)
    // set global variable to keep old code working
    trip_type = getOldTripTypeName(type)

    if (this.directions[type].length === 0) {
      searchService.getDirections(type).done((response) => {
        this.directions[this.tripType] = response
        this.onDirectionsResponse(oldType)
      })
    } else {
      this.onDirectionsResponse(oldType)
    }
  },

  onDirectionsResponse (oldType) {
    this.setDepartureCountries()
    if (this.departureCityCode !== '' && this.arrivalCityCode !== '' && !this.directions[this.tripType].includes(`${this.departureCityCode};${this.arrivalCityCode}`)) {
      this.hideLoader()
      $('#modal-info').modal('show')
      this.tripType = oldType
      updateQueryParam('type', this.tripType)
      $(`.trip-type[value=${this.tripType}]`).prop('checked', true)
    } else {
      if (this.departureCityCode !== '') {
        // save arrivals because selectDepartureCity() overwrites them
        const arrivalCountryAlias = this.arrivalCountryAlias
        const arrivalCityCode = this.arrivalCityCode
        this.selectDepartureCountry(this.departureCountryAlias)
        this.selectDepartureCity(this.departureCityCode)
        // restore arrivals
        if (arrivalCountryAlias !== '') {
          this.selectArrivalCountry(arrivalCountryAlias)

          if (arrivalCityCode !== '') {
            this.selectArrivalCity(arrivalCityCode)
          }
        }
      }

      this._updateDateFields().then(() => {
        this.hideLoader()
      })
    }
  },

  onDepartureCityInput (event) {
    this.removeDepartureCountry()
    this.removeDepartureCity(true)
    this.removeArrivalCountry()
    this.removeArrivalCity(true)

    // find countries by cities
    let departureCities = this.directions[this.tripType].map(item => item.split(';')[0])

    departureCities = departureCities.filter(city => this._inputFilter(city, event.target.value))

    this._setCountriesByCities(departureCities, 'from')

    if (event.target.value === '') {
      this._setCitiesArray([], 'from')
      return
    }

    const citiesArray = [...(new Set(departureCities))].map(
      city => ({
        code: city,
        name: this.cities[city][language],
        alias: this.cities[city].alias,
        country: this.cities[city].country.alias
      })
    )
    this._setCitiesArray(citiesArray, 'from')

    if (citiesArray.length === 1 && event.target.value.toLowerCase() === citiesArray[0].name.toLowerCase()) {
      this.selectDepartureCountry(this.cities[citiesArray[0].code].country.alias)
      this.selectDepartureCity(citiesArray[0].code)
    }
  },

  onArrivalCityInput (event) {
    this.removeArrivalCountry()
    this.removeArrivalCity(true)

    if (this.departureCityCode === '') {
      return
    }

    // find countries by cities
    let arrivalCities = this.directions[this.tripType].filter(item => item.split(';')[0] === this.departureCityCode)
    arrivalCities = arrivalCities.map(item => item.split(';')[1])
    arrivalCities = arrivalCities.filter(key => this._inputFilter(key, event.target.value))

    this._setCountriesByCities(arrivalCities, 'to')

    if (event.target.value === '') {
      this._setCitiesArray([], 'to')
      return
    }

    const citiesArray = [...(new Set(arrivalCities))].map(
      city => ({
        code: city,
        name: this.cities[city][language],
        alias: this.cities[city].alias,
        country: this.cities[city].country.alias
      })
    )
    this._setCitiesArray(citiesArray, 'to')

    if (citiesArray.length === 1 && event.target.value.toLowerCase() === citiesArray[0].name.toLowerCase()) {
      this.selectArrivalCountry(this.cities[citiesArray[0].code].country.alias)
      this.selectArrivalCity(citiesArray[0].code)
    }
  },

  validateSearch () {
    if (this.departureCountryAlias === '' || this.departureCityCode === '' || this.arrivalCountryAlias === '' || this.arrivalCityCode === '') {
      $('#search').attr('disabled', 'disabled')
      return false
    }
    $('#search').removeAttr('disabled')
    return true
  },

  /*
   * @return Promise
   */
  selectDepartureDate (date) {
    // datetimepicker can emit with undefined on initialization
    if (date === undefined) {
      return Promise.resolve()
    }

    if (date === null) {
      this.departureDate = date
      removeQueryParam('date_from')
      $('#datepicker').datepicker('setDate', null)
      $('#datepicker').datepicker('remove')
      return Promise.resolve()
    }

    // even if date is equal this.departureDate, value in datepicker can be different
    // check it
    const dateInDatepicker = $('#datepicker').datepicker('getDate')
    if (!dateInDatepicker || (dateInDatepicker && dateInDatepicker.getTime() !== date.getTime())) {
      $('#datepicker').datepicker('update', date)
    }

    if (!(this.departureDate && this.departureDate.getTime() === date.getTime())) {
      this._saveDepartureDate(date)
    }

    const urlParams = new URLSearchParams(window.location.search)
    const dateFrom = urlParams.get('date_from')
    if (dateFrom !== stringifyDate(date)) {
      updateQueryParam('date_from', stringifyDate(date))
    }

    if (this.tripType === 'round_way') {
      return this.updateArrivalDates()
    }

    return Promise.resolve()
  },

  _saveDepartureDate (date) {
    this.departureDate = date
    if (this.tripType === 'one_way') {
      this.lastOneWayDepartureDate = date
    } else {
      this.lastRoundWayDepartureDate = date
    }
  },

  selectArrivalDate (date) {
    // datetimepicker can emit with undefined on initialization
    if (date === undefined) {
      return
    }

    if (date === null) {
      this.arrivalDate = date
      removeQueryParam('date_to')
      $('#datepicker2').datepicker('setDate', null)
      $('#datepicker2').datepicker('remove')
      return
    }

    // even if date is equal this.arrivalDate, value in datepicker can be different
    // check it
    const dateInDatepicker = $('#datepicker2').datepicker('getDate')
    if (!dateInDatepicker || (dateInDatepicker && dateInDatepicker.getTime() !== date.getTime())) {
      $('#datepicker2').datepicker('update', date)
    }

    if (!(this.departureDate && this.departureDate.getTime() === date.getTime())) {
      this._saveArrivalDate(date)
    }

    const urlParams = new URLSearchParams(window.location.search)
    const dateTo = urlParams.get('date_to')
    if (dateTo !== stringifyDate(date)) {
      updateQueryParam('date_to', stringifyDate(date))
    }
  },

  _saveArrivalDate (date) {
    this.arrivalDate = date
    if (this.tripType === 'one_way') {
      this.lastOneWayArrivalDate = date
    } else {
      this.lastRoundWayArrivalDate = date
    }
  },

  selectTickets (number, type) {
    if (number < 0) {
      return
    } else if (number === 0) {
      $(`#${type}-minus`).addClass('opacity')
    } else {
      $(`#${type}-minus`).removeClass('opacity')
    }

    this[`${type}Tickets`] = number
    updateQueryParam(type, number)
    $(`.${type}`).val(number)
    this._updateTicketSum()
  },

  showLoader () {
    $('#loader').removeClass('hide')
  },

  hideLoader () {
    $('#loader').addClass('hide')
  },

  /*
   * @return Promise
   */
  updateArrivalDates () {
    this.showLoader()
    // datepicker can generate useless events, data validation is required!
    if (!this.departureDate || this.departureCityCode === '' || this.arrivalCityCode === '') {
      return Promise.resolve()
    }

    if (this._saveArrivalDateChanges) {
      return Promise.resolve()
    }

    this._saveArrivalDateChanges = true
    return new Promise(resolve => {
      searchService.getDateArrivalTickets({
        departureDate: stringifyDate(this.departureDate),
        departureCityAlias: this.cities[this.departureCityCode].alias,
        arrivalCityAlias: this.cities[this.arrivalCityCode].alias
      }).done(response => {
        let dates = []
        if (Array.isArray(response)) {
          dates = response
        }
        this._handleArrivalDates(dates)
        this._saveArrivalDateChanges = false
        this.hideLoader()
        resolve()
      })
    })
  },

  /*
   * @param {string} direction - 'to' or 'from' (arrival or departure countries)
   */
  _setCountriesByCities (cities, direction) {
    // first create object to avoid duplicates
    const countries = {}
    cities.forEach(item => {
      countries[this.cities[item].country.alias] = this.cities[item].country
    })

    // create array and sort it
    const countriesArray = Object.keys(countries).map(key => ({ name: countries[key][language], alias: countries[key].alias }))
    countriesArray.sort(sortByNameAlphabetically)
    if (direction === 'from') {
      this.departureCountries = countriesArray;
    } else if (direction === 'to') {
      this.arrivalCountries = countriesArray;
    }

    $(`.popup-${direction} .popup-pick-country-container`).empty()

    for (const country of countriesArray) {
      $(`.popup-${direction} .popup-pick-country-container`).append(
        `<li class="popup-pick-country-item country-${direction}" data-country="${country.alias}"><a href="#" class="place_item">${country.name}</a></li>`
      )
    }

    this.updateCountriesLayout();
  },

  /*
  * @param {string} direction - 'to' or 'from' (arrival or departure countries)
  */
  _setCitiesByCountry (country, direction) {
    let filteredCityCodes = []
    if (direction === 'from') {
      filteredCityCodes = this.directions[this.tripType].map(item => item.split(';')[0])
    } else {
      const filteredDirections = this.directions[this.tripType].filter(item => item.split(';')[0] === this.departureCityCode)
      filteredCityCodes = filteredDirections.map(item => item.split(';')[1])
    }

    const citiesArray = []
    for (const city of new Set(filteredCityCodes)) {
      if (this.cities[city].country.alias === country) {
        citiesArray.push({
          code: city,
          name: this.cities[city][language],
          alias: this.cities[city].alias,
          country: this.cities[city].country.alias
        })
      }
    }

    // if there is selected and it is missed in new array, delete it
    if (direction === 'from') {
      if (this.departureCityCode !== '' && citiesArray.findIndex(c => c.code === this.departureCityCode) === -1) {
        this.removeDepartureCity()
        this.removeArrivalCountry()
        this.removeArrivalCity()
      }
    } else {
      if (this.arrivalCityCode !== '' && citiesArray.findIndex(c => c.code === this.arrivalCityCode) === -1) {
        this.removeArrivalCity()
      }
    }

    this._setCitiesArray(citiesArray, direction)
  },

  _setCitiesArray (citiesArray, direction) {
    citiesArray.sort(sortByNameAlphabetically)

    $(`.popup-${direction} .popup-pick-city`).removeClass('hide')
    $(`.popup-${direction} .popup-pick-city-container`).empty()

    for (const city of citiesArray) {
      $(`.popup-${direction} .popup-pick-city-container`).append(
        `<li class="popup-pick-city-item ${direction}" data-city="${city.code}" data-city-alias="${city.alias}" data-country="${city.country}"><a href="#" class="place_item">${city.name}</a></li>`
      )
    }
  },

  /*
   * @return Promise
   */
  _updateDateFields ({ resetDates = false } = {}) {
    if (!this.validateSearch()) {
      $('.date-fly-data').addClass('hide')
      removeQueryParam('adults')
      removeQueryParam('children')
      removeQueryParam('childes')
      removeQueryParam('date_from')
      removeQueryParam('date_to')
      return Promise.resolve()
    }

    if (resetDates) {
      this.departureDate = undefined
      this.arrivalDate = undefined
      this.lastOneWayDepartureDate = undefined
      this.lastRoundWayDepartureDate = undefined
      this.lastRoundWayArrivalDate = undefined
      tripList.clear()
    }
    updateQueryParam('adults', this.adultsTickets)
    updateQueryParam('children', this.childrenTickets)
    updateQueryParam('childes', this.childesTickets)

    if (this.tripType === 'round_way') {
      $('.date-to').show()
    } else {
      $('.date-to').hide()
    }

    $('.date-fly-data').removeClass('hide')

    if (this._datesLoadPromise) {
      return this._datesLoadPromise
    }

    this.showLoader()
    this._datesLoadPromise = new Promise((resolve, reject) => {
      searchService.getDateDepartureTickets({
        tripType: this.tripType,
        departureCityAlias: this.cities[this.departureCityCode].alias,
        arrivalCityAlias: this.cities[this.arrivalCityCode].alias
      }).done(response => {
        this._handleDepartureDates(response.data)
          .then(() => {
            this.validateSearch()
            resolve()
          })
          .catch(() => {
            resolve()
          })
        // arrival dates don't need to be handled manually here
        // instead are handled automatically in handleDepartureDates
      })
        .fail((e) => {
          reject(e)
        })
    }).then(() => {
      this._datesLoadPromise = null
    })
      .catch(e => {
        console.log(e)
      })
      .then(() => {
        this.hideLoader()
      })

    return this._datesLoadPromise
  },

  _updateTicketSum () {
    $('#passengers').val(this.adultsTickets + this.childrenTickets + this.childesTickets)
  },

  _inputFilter (city, searchString) {
    let cityName = false
    for (const key in this.cities[city]) {
      if (key !== 'country' && key !== 'alias') {
        cityName = cityName || this.cities[city][key].toLowerCase().startsWith(searchString.toLowerCase())
      }
    }

    const cityCode = city.toLowerCase().startsWith(searchString.toLowerCase())
    let countryName = false
    for (const key in this.cities[city].country) {
      if (key !== 'alias') {
        countryName = countryName || this.cities[city].country[key].toLowerCase().startsWith(searchString.toLowerCase())
      }
    }
    return (cityCode || cityName || countryName)
  },

  /*
   * @return Promise
   */
  _handleDepartureDates (dates) {
    let result = Promise.resolve()
    if (!dates) {
      this.resetDatepicker()
      return result
    }

    this._initDatepicker('#datepicker', dates)

    const dateIsAlreadySelected = !!this.departureDate
    const selectedDateFoundInDates = dateIsAlreadySelected && dates.includes(stringifyDate(this.departureDate))
    if (dateIsAlreadySelected && selectedDateFoundInDates) {
      // restore selected date(dates are cleared on init)
      this.selectDepartureDate(this.departureDate)
    } else {
      if (dates.length > 0) {
        let dateToRestore
        if (this.tripType === 'round_way') {
          dateToRestore = this.lastRoundWayDepartureDate || this.lastOneWayDepartureDate
        } else {
          dateToRestore = this.lastOneWayDepartureDate || this.lastRoundWayDepartureDate
        }

        const lastDateFoundInDates = dateToRestore && dates.includes(stringifyDate(dateToRestore))

        if (lastDateFoundInDates) {
          result = this.selectDepartureDate(dateToRestore)
        } else {
          this.lastRoundWayArrivalDate = undefined
          result = this.selectDepartureDate(stringToDate(dates[0]))
        }
      } else {
        result = this.selectDepartureDate(null)
      }
    }

    if (dates.length === 0) {
      no_dates_info()
    }

    if (this.tripType === 'one_way') {
      this.hideLoader()
    }

    return result
  },

  _handleArrivalDates (dates) {
    if (!dates) {
      this.selectArrivalDate(null)
      return
    }

    this._initDatepicker('#datepicker2', dates)

    const dateIsAlreadySelected = !!this.arrivalDate
    const selectedDateFoundInDates = dateIsAlreadySelected && dates.includes(stringifyDate(this.arrivalDate))
    if (dateIsAlreadySelected && selectedDateFoundInDates) {
      // restore selected date(dates are cleared on init)
      this.selectArrivalDate(this.arrivalDate)
    } else {
      if (dates.length > 0) {
        const lastDateFoundInDates = this.lastRoundWayArrivalDate && dates.includes(stringifyDate(this.lastRoundWayArrivalDate))
        if (lastDateFoundInDates) {
          this.selectArrivalDate(this.lastRoundWayArrivalDate)
        } else {
          // find the earliest
          const datesCopy = [...dates]
          datesCopy.sort((a, b) => a > b)
          this.selectArrivalDate(stringToDate(datesCopy[0]))
        }
      }
    }

    this.hideLoader()
  },

  _initDatepicker (selector, activeDates) {
    $(selector).datepicker('remove')
    $(selector).datepicker({
      language,
      format: 'dd-mm-yyyy',
      autoclose: true,
      startDate: 'today',
      orientation: 'bottom',
      beforeShowDay: date => activeDates.includes(stringifyDate(date)) ? 'highlight' : false
    })
  },

  _initEventHandlers () {
    $('.popup-from').on('click', '.country-from', event => {
      event.preventDefault()
      this.selectDepartureCountry(event.target.dataset.country)
    })
    $('.popup-from').on('click', '.popup-pick-city-item.from', event => {
      event.preventDefault()
      // if user selects city after manual search, list of countries should
      // be restored
      this.setDepartureCountries()
      // after that restore active country
      this.selectDepartureCountry(event.target.dataset.country)
      this.selectDepartureCity(event.target.dataset.city)
      $('.popup-from').addClass('hide')
      $('.popup-to').removeClass('hide')
      $('input#fly-to').focus()
    })
    $('.popup-to').on('click', '.popup-pick-country-item.country-to', event => {
      event.preventDefault()
      this.selectArrivalCountry(event.target.dataset.country)
    })
    $('.popup-to').on('click', '.popup-pick-city-item.to', event => {
      event.preventDefault()
      // if user selects city after manual search, list of countries should
      // be restored
      const directionsFromDeparture = this.directions[this.tripType].filter(item => item.split(';')[0] === this.departureCityCode)
      const arrivalCities = directionsFromDeparture.map(item => item.split(';')[1])
      this._setCountriesByCities(arrivalCities, 'to')
      // after that restore active country
      this.selectArrivalCountry(event.target.dataset.country)
      this.selectArrivalCity(event.target.dataset.city)
      $('.popup-to').addClass('hide')
    })

    $('.change-direction').on('click', () => { this.changeDirection() })

    $('.trip-type').on('click', event => { this.selectTripType(event.target.value) })

    $('input#fly-from').on('input', event => { this.onDepartureCityInput(event) })
    $('input#fly-to').on('input', event => { this.onArrivalCityInput(event) })

    $('#datepicker').on('changeDate', event => { this.selectDepartureDate(event.date) })
    $('#datepicker2').on('changeDate', event => { this.selectArrivalDate(event.date) })

    // $('.adults').on('input', event => { this.selectAdultTickets(event.target.value) })
    $('#adults-plus').on('click', () => { this.selectTickets(this.adultsTickets + 1, 'adults') })
    $('#adults-minus').on('click', () => { this.selectTickets(this.adultsTickets - 1, 'adults') })
    // $('.children').on('input', event => { this.selectChildrenTickets(event.target.value) })
    $('#children-plus').on('click', () => { this.selectTickets(this.childrenTickets + 1, 'children') })
    $('#children-minus').on('click', () => { this.selectTickets(this.childrenTickets - 1, 'children') })
    // $('.childes').on('input', event => { this.selectChildesTickets(event.target.value) })
    $('#childes-plus').on('click', () => { this.selectTickets(this.childesTickets + 1, 'childes') })
    $('#childes-minus').on('click', () => { this.selectTickets(this.childesTickets - 1, 'childes') })
  },

  updateCountriesLayout() {
    for (const direction of ['from', 'to']) {
      let countriesArray = [];
      if (direction === 'from') {
        countriesArray = this.departureCountries;
      } else if (direction === 'to') {
        countriesArray = this.arrivalCountries;
      }

      let columnsNumber = 3;
      let countriesNumber = countriesArray.length;
      if (countriesNumber < 9) {
        columnsNumber = 1;
      } else if (countriesNumber < 19) {
        columnsNumber = 2;
      }

      const windowWidth = (window.innerWidth || document.documentElement.clientWidth ||
        document.body.clientWidth);
      let maxColumns = 3;
      let limitMaxColumnWidth = false;
      if (windowWidth <= 600) {
        maxColumns = 1;
        limitMaxColumnWidth = true;
      } else if (windowWidth <= 1200) {
        maxColumns = 2;
        limitMaxColumnWidth = true;
      }
      if (columnsNumber > maxColumns) {
        columnsNumber = maxColumns;
      }

      const rowsNumber = Math.ceil(countriesNumber / columnsNumber);

      $(`.popup-${direction} .popup-pick-country-container`).css({
        'grid-template-rows': `repeat(${rowsNumber}, auto)`,
        'grid-template-columns': `repeat(${columnsNumber}, 1fr)`
      });
      
      $('.popup-pick-country-item').css({
        'max-width': limitMaxColumnWidth ? '150px' : 'auto',
        'white-space': limitMaxColumnWidth ? 'normal' : 'nowrap',
        padding: limitMaxColumnWidth ? '0 8px': '0 16px',
      });

      $('.popup .popup-pick-city-container').css({
        'padding-left': limitMaxColumnWidth ? '8px' : '1.5rem',
        'padding-right': limitMaxColumnWidth ? '8px' : '1.5rem',
      });
    }
  },

  onWindowResize() {
    this.updateCountriesLayout();
  }
}

const tripList = {
  clear () {
    $('#result tbody').html('<tr><td colspan="5">Начните поиск.</td></tr>')
  }
}

$(document).ready(() => {
  searchComponent.init()
})

// $('a.place_item').click(function (e) {
//   // prevent scroll to top
//   e.preventDefault()
// });