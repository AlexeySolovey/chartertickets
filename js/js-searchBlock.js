const tripList = {
    clear() {
        $('#result tbody').html('<tr><td colspan="5">' + lajax.t('Начните поиск.') + '</td></tr>')
    }
}

var _clickHandler = ('ontouchstart' in document.documentElement ? "touchstart" : "click");

var _t_from_country = _t_from_city = _t_to_country = _t_to_city = '';

var _data_rt_exist = _data_exist_ow = only_request = false;
var _data_op_exist_from = 0;

var searchPage = {};
var schema;

searchPage.init = function (schemaParam) {
    schema = schemaParam;
};

const baseAPIUrl = 'https://anytickets.com.ua/api'

let language = $('html').attr('lang')
if (language === '') {
    language = 'ru'
}

function saveQueryString(str) {
    window.document.queryStr = str;
}

function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        return uri + separator + key + "=" + value;
    }
}

$('.lang-selector a').on('click', function (e) {
    e.preventDefault();
    let url = new URL(this.href);
    let urlParams = new URLSearchParams(url.search.slice(1));


    if (window.document.queryStr) {
        let queryStringParams = new URLSearchParams(window.document.queryStr);
        queryStringParams.forEach(function (val, key) {
            urlParams.set(key, val);
        })
        window.document.location = url.origin + url.pathname + '?' + urlParams.toString();
    } else {
        window.document.location = url;
    }

})

// TODO: polyfill for safari

function setQueryParams(params){
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
        if (params.hasOwnProperty(key)) {
            queryString += `${key}=${params[key]}&`
        }
    })

    queryString = queryString.slice(0, queryString.length - 1)

    history.replaceState(null, '', window.location.pathname + '?' + queryString)
    saveQueryString(queryString)
}

function updateQueryParam(key, value) {
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
    saveQueryString(queryString)
}

function removeQueryParam(key) {
    const queryParam = new URLSearchParams(window.location.search)
    queryParam.delete(key)
    history.replaceState(null, '', window.location.pathname + '?' + queryParam.toString())
    saveQueryString(queryParam.toString())

}

function sortByNameAlphabetically(a, b) {
    return (a.name).localeCompare(b.name)
}

function getOldTripTypeName(type) {
    return (type === 'one_way' || type === 'one_trip') ? 'one_trip' : 'round_way'
}

// format 'yyyy-mm-dd'
function stringifyDate(date) {
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

function stringToDate(string) {
    const date = new Date()
    try {
        const [year, month, day] = string.split('-')
        date.setUTCFullYear(+year, (+month - 1), +day)
        date.setUTCHours(0)
        return date
    } catch (e) {
        return null
    }
}

function submitRequest(buttonId) {
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
    getDirections(typeLabel) {
        const type = typeLabel === 'one_way' ? '1' : '2'
        return $.get(`${baseAPIUrl}/get-directions`, {type})
    },

    getDateDepartureTickets({tripType, departureCityAlias, arrivalCityAlias} = {}) {
        return $.ajax({
            url     : baseAPIUrl + '/get-date-departure-tickets',
            type    : 'GET',
            dataType: 'json',
            cache   : false,
            data    : {
                type     : getOldTripTypeName(tripType),
                city_from: departureCityAlias,
                city_to  : arrivalCityAlias
            }
        })
    },

    getDateArrivalTickets({departureDate, departureCityAlias, arrivalCityAlias} = {}) {
        return $.ajax({
            url     : baseAPIUrl + '/get-date-departure-tickets',
            type    : 'GET',
            dataType: 'json',
            cache   : false,
            data    : {
                departureDate,
                city_from: arrivalCityAlias,
                city_to  : departureCityAlias
            }
        })
    }
}

const searchComponent = {
    cities                   : {},
    directions               : {
        one_way  : [],
        round_way: []
    },
    departureCountries       : [],
    arrivalCountries         : [],
    departureCountryAlias    : '',
    departureCityCode        : '',
    arrivalCountryAlias      : '',
    arrivalCityCode          : '',
    tripType                 : 'round_way',
    departureDate            : undefined,
    arrivalDate              : undefined,
    adultsTickets            : 1,
    childrenTickets          : 0,
    childesTickets           : 0,
    _datesLoadPromise        : null,
    lastOneWayDepartureDate  : undefined, // is needed to restore departure date after changing trip type OW->RW->OW
    lastRoundWayDepartureDate: undefined, // is needed to restore departure date after changing trip type RW->OW->RW
    lastRoundWayArrivalDate  : undefined, // is needed to restore arrival date after changing trip type RW->OW->RW

    init() {
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
            .done((response) => {
                this.directions[this.tripType] = response
            })

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

    showDepartureSelector() {
        $('.popup.popup-from').removeClass('hide')
    },

    showArrivalSelector() {
        $('.popup.popup-to').removeClass('hide')
    },

    setDepartureCountries() {
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

    selectDepartureCountry(countryAlias) {
        $('.country-from').removeClass('active')
        $(`.country-from[data-country='${countryAlias}']`).addClass('active')
        $('input#fly-to').val('')
        this.resetDatepicker()
        $('.date-fly-data').addClass('hide')

        this._setCitiesByCountry(countryAlias, 'from')

        updateQueryParam('country_from', countryAlias)
        this.departureCountryAlias = countryAlias
    },

    selectDepartureCity(departureCityCode) {
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

    selectArrivalCountry(countryAlias) {
        $('.popup-to .popup-pick-city').removeClass('hide')
        $('.country-to').removeClass('active')
        $(`.country-to[data-country='${countryAlias}']`).addClass('active')
        this.resetDatepicker()
        $('.date-fly-data').addClass('hide')

        this._setCitiesByCountry(countryAlias, 'to')

        updateQueryParam('country_to', countryAlias)
        this.arrivalCountryAlias = countryAlias
    },

    selectArrivalCity(arrivalCityCode) {
        $('.to').removeClass('active')
        $(`.popup-pick-city-item.to[data-city='${arrivalCityCode}']`).addClass('active')
        $('input#fly-to').val($(`.popup-pick-city-item.to[data-city='${arrivalCityCode}']`).text())
        updateQueryParam('city_to', this.cities[arrivalCityCode].alias)
        this.arrivalCityCode = arrivalCityCode
        // set global variable to keep old code working
        t_to_city = this.cities[arrivalCityCode].alias
        this._updateDateFields({resetDates: true})
    },

    removeDepartureCountry() {
        this.departureCountryAlias = ''
        $('.country-from').removeClass('active')
        removeQueryParam('country_from')
        this._updateDateFields()
    },

    removeDepartureCity(keepInput = false) {
        if (!keepInput) {
            $('input#fly-from').val('')
        }
        this.departureCityCode = ''
        $('.from').removeClass('active')
        removeQueryParam('city_from')
        this._updateDateFields()
    },

    removeArrivalCountry() {
        $('.country-to').removeClass('active')
        removeQueryParam('country_to')
        this.arrivalCountryAlias = ''
        this._updateDateFields()
    },

    removeArrivalCity(keepInput = false) {
        if (!keepInput) {
            $('input#fly-to').val()
        }
        $('.to').removeClass('active')
        removeQueryParam('city_to')
        this.arrivalCityCode = ''
        this._updateDateFields()
    },

    resetDatepicker() {
        this.selectDepartureDate(null)
        this.selectArrivalDate(null)
    },

    changeDirection() {
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

    selectTripType(type) {
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

    onDirectionsResponse(oldType) {
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

    onDepartureCityInput(elValue) {
        this.removeDepartureCountry()
        this.removeDepartureCity(true)
        this.removeArrivalCountry()
        this.removeArrivalCity(true)

        // find countries by cities
        let departureCities = this.directions[this.tripType].map(item => item.split(';')[0])

        departureCities = departureCities.filter(city => this._inputFilter(city, elValue))

        this._setCountriesByCities(departureCities, 'from')

        if (elValue === '') {
            this._setCitiesArray([], 'from')
            return
        }

        const citiesArray = [...(new Set(departureCities))].map(
            city => ({
                code   : city,
                name   : this.cities[city][language],
                alias  : this.cities[city].alias,
                country: this.cities[city].country.alias
            })
        )
        this._setCitiesArray(citiesArray, 'from')

        if (citiesArray.length === 1 && elValue.toLowerCase() === citiesArray[0].name.toLowerCase()) {
            this.selectDepartureCountry(this.cities[citiesArray[0].code].country.alias)
            this.selectDepartureCity(citiesArray[0].code)
        }
    },

    onArrivalCityInput(elValue) {
        this.removeArrivalCountry()
        this.removeArrivalCity(true)

        if (this.departureCityCode === '') {
            return
        }

        // find countries by cities
        let arrivalCities = this.directions[this.tripType].filter(item => item.split(';')[0] === this.departureCityCode)
        arrivalCities = arrivalCities.map(item => item.split(';')[1])
        arrivalCities = arrivalCities.filter(key => this._inputFilter(key, elValue))

        this._setCountriesByCities(arrivalCities, 'to')

        if (elValue === '') {
            this._setCitiesArray([], 'to')
            return
        }

        const citiesArray = [...(new Set(arrivalCities))].map(
            city => ({
                code   : city,
                name   : this.cities[city][language],
                alias  : this.cities[city].alias,
                country: this.cities[city].country.alias
            })
        )
        this._setCitiesArray(citiesArray, 'to')

        if (citiesArray.length === 1 && elValue.toLowerCase() === citiesArray[0].name.toLowerCase()) {
            this.selectArrivalCountry(this.cities[citiesArray[0].code].country.alias)
            this.selectArrivalCity(citiesArray[0].code)
        }
    },

    validateSearch() {
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
    selectDepartureDate(date) {
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

    _saveDepartureDate(date) {
        this.departureDate = date
        if (this.tripType === 'one_way') {
            this.lastOneWayDepartureDate = date
        } else {
            this.lastRoundWayDepartureDate = date
        }
    },

    selectArrivalDate(date) {
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

    _saveArrivalDate(date) {
        this.arrivalDate = date
        if (this.tripType === 'one_way') {
            this.lastOneWayArrivalDate = date
        } else {
            this.lastRoundWayArrivalDate = date
        }
    },

    selectTickets(number, type) {
        let min = 0;
        if (type == 'adults')
            min = 1;
        if (number < min) {
            return
        } else if (number === min) {
            $(`#${type}-minus`).addClass('opacity')
        } else {
            $(`#${type}-minus`).removeClass('opacity')
        }

        this[`${type}Tickets`] = number
        updateQueryParam(type, number)
        $(`.${type}`).val(number)
        this._updateTicketSum()
    },

    showLoader() {
        $('#loader').removeClass('hide')
    },

    hideLoader() {
        $('#loader').addClass('hide')
    },

    /*
     * @return Promise
     */
    updateArrivalDates() {
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
                departureDate     : stringifyDate(this.departureDate),
                departureCityAlias: this.cities[this.departureCityCode].alias,
                arrivalCityAlias  : this.cities[this.arrivalCityCode].alias
            }).done(response => {
                let dates = []
                if (Array.isArray(response) || response instanceof Object) {
                    dates = response.data;
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
    _setCountriesByCities(cities, direction) {
        // first create object to avoid duplicates
        const countries = {}
        cities.forEach(item => {
            countries[this.cities[item].country.alias] = this.cities[item].country
        })

        // create array and sort it
        const countriesArray = Object.keys(countries).map(key => ({name: countries[key][language], alias: countries[key].alias}))
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
    _setCitiesByCountry(country, direction) {
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
                    code   : city,
                    name   : this.cities[city][language],
                    alias  : this.cities[city].alias,
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

    _setCitiesArray(citiesArray, direction) {
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
    _updateDateFields({resetDates = false} = {}) {
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
                tripType          : this.tripType,
                departureCityAlias: this.cities[this.departureCityCode].alias,
                arrivalCityAlias  : this.cities[this.arrivalCityCode].alias
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

    _updateTicketSum() {
        let sum = this.adultsTickets + this.childrenTickets + this.childesTickets;
        if (sum > 8 && !$('#modal-group-order').attr('data-viewed')) {
            $('#modal-group-order').attr('data-viewed', true);
            $('#modal-group-order').modal('show')
        }
        $('#passengers').val(sum)
    },

    _inputFilter(city, searchString) {
        let cityName = false
        for (const key in this.cities[city]) {
            if (key !== 'country' && key !== 'alias' && key !== 'airports') {
                cityName = cityName || this.cities[city][key].toLowerCase().startsWith(searchString.toLowerCase())
            }
        }

        const cityCode = city.toLowerCase().startsWith(searchString.toLowerCase())

        let airportName = false
        this.cities[city].airports.forEach(function (airport) {
            for (const key in airport) {
                if (key == 'code' || key == 'name') {
                    airportName = airportName || airport[key].toLowerCase().startsWith(searchString.toLowerCase())
                }
            }
        })


        let countryName = false
        for (const key in this.cities[city].country) {
            if (key !== 'alias') {
                countryName = countryName || this.cities[city].country[key].toLowerCase().startsWith(searchString.toLowerCase())
            }
        }
        return (cityCode || cityName || airportName || countryName)
    },

    /*
     * @return Promise
     */
    _handleDepartureDates(dates) {
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

    _handleArrivalDates(dates) {
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

    _initDatepicker(selector, activeDates) {
        $(selector).datepicker('remove')
        $(selector).datepicker({
            language,
            format       : 'dd-mm-yyyy',
            autoclose    : true,
            startDate    : 'today',
            orientation  : 'bottom',
            beforeShowDay: date => activeDates.includes(stringifyDate(date)) ? 'highlight' : false
        })
    },

    _initEventHandlers() {
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

        // $('.change-direction').on('click', () => {
        //     this.changeDirection()
        // })

        $('.trip-type').on('click', event => {
            this.selectTripType(event.target.value)
        })

        //$('input#fly-from').on('change', event => {
        //    this.onDepartureCityInput(event)
        //})
        $('input#fly-to').on('input', event => {
            this.onArrivalCityInput(event)
        })

        $('#datepicker').on('changeDate', event => {
            this.selectDepartureDate(event.date)
        })
        $('#datepicker2').on('changeDate', event => {
            this.selectArrivalDate(event.date)
        })

        // $('.adults').on('input', event => { this.selectAdultTickets(event.target.value) })
        $('#adults-plus').on('click', () => {
            this.selectTickets(this.adultsTickets + 1, 'adults')
        })
        $('#adults-minus').on('click', () => {
            this.selectTickets(this.adultsTickets - 1, 'adults')
        })
        // $('.children').on('input', event => { this.selectChildrenTickets(event.target.value) })
        $('#children-plus').on('click', () => {
            this.selectTickets(this.childrenTickets + 1, 'children')
        })
        $('#children-minus').on('click', () => {
            this.selectTickets(this.childrenTickets - 1, 'children')
        })
        // $('.childes').on('input', event => { this.selectChildesTickets(event.target.value) })
        $('#childes-plus').on('click', () => {
            this.selectTickets(this.childesTickets + 1, 'childes')
        })
        $('#childes-minus').on('click', () => {
            this.selectTickets(this.childesTickets - 1, 'childes')
        })

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
                'grid-template-rows'   : `repeat(${rowsNumber}, auto)`,
                'grid-template-columns': `repeat(${columnsNumber}, 1fr)`
            });

            $('.popup-pick-country-item').css({
                'max-width'  : limitMaxColumnWidth ? '150px' : 'auto',
                'white-space': limitMaxColumnWidth ? 'normal' : 'nowrap',
                padding      : limitMaxColumnWidth ? '0 8px' : '0 16px',
            });

            $('.popup .popup-pick-city-container').css({
                'padding-left' : limitMaxColumnWidth ? '8px' : '1.5rem',
                'padding-right': limitMaxColumnWidth ? '8px' : '1.5rem',
            });
        }
    },

    onWindowResize() {
        this.updateCountriesLayout();
    }
}

function getNotFoundHtml() {
    return '<tr><td colspan="5">'+lajax.t('По вашему запросу ничего не найдено')+'</td></tr>';
}

function getNoPlaceHtml() {
    return '<div class="no-seats">' + lajax.t('Нет мест') + '</div>';
}

function getBuyHtml() {
    return '<input type="submit" class="btn btn-primary buy" value="' + lajax.t('Купить') + '">';
}

function getEcenomHtml() {
    return lajax.t('Эконом');
}

function get_round_trip(data) {
    var items = [];
    _data_rt_exist = false;
    if (typeof data != 'undefined' && !jQuery.isEmptyObject(data)) {
        $.each(data, function (index, value) {
            var item = new Object();
            if (value.BlockStatusIn != 'NotAvailable' && value.BlockStatusOut != 'NotAvailable') {
                item.finButton = getBuyHtml();
                _data_rt_exist = true;
            } else {
                item.finButton = getNoPlaceHtml();
            }
            item.BlockStatusIn = value.BlockStatusIn;
            item.BlockStatusOut = value.BlockStatusOut;
            item.departureLocation = flyPropertyArray['departureLocation'];
            item.destinationCity = flyPropertyArray['destinationCity'];
            item.SrcPortName = value.SrcPortName;
            item.TrgPortName = value.TrgPortName;
            item.SrcPortNameBack = value.SrcPortNameBack;
            item.TrgPortNameBack = value.TrgPortNameBack;
            item.PartnerInName = value.PartnerInName;
            item.PartnerOutName = value.PartnerOutName;
            item.TrgPortName = value.TrgPortName;
            item.FreightName = value.FreightName;
            item.Baggage = value.Baggage;
            item.BaggageBack = value.BaggageBack;
            item.FreightNameBack = value.FreightNameBack;
            item.SrcTime = value.SrcTime;
            item.TrgTime = value.TrgTime;
            item.FlyTimeTo = value.FlyTimeTo;
            item.SrcTimeBack = value.SrcTimeBack;
            item.TrgTimeBack = value.TrgTimeBack;
            item.FlyTimeBack = value.FlyTimeBack;
            item.code_class = getEcenomHtml();
            item.price = value.price;
            item.operator = value.operator;
            item.fly_from_id = value.fly_id;
            item.fly_to_id = 0;
            item.type_to = value.type_to;
            item.type_back = value.type_back;
            if (item.operator == 5) {
                if (item.PartnerInName == item.PartnerOutName) {
                    items.push(item);
                }
            } else {
                items.push(item);
            }
        });
    } else {
        $('#result tbody').html(getNotFoundHtml());
    }
    return items;
}

function get_ow(data) {
    var items_from = [];
    _data_exist_ow = false;
    if (typeof data != 'undefined' && !jQuery.isEmptyObject(data)) {
        $.each(data, function (index, value) {
            if (value.BlockStatusIn != 'NotAvailable') {
                _data_exist_ow = true;
                var item = new Object();
                item.finButton = getBuyHtml();
                item.BlockStatusIn = value.BlockStatusIn;
                item.departureLocation = flyPropertyArray['departureLocation'];
                item.destinationCity = flyPropertyArray['destinationCity'];
                item.SrcPortName = value.SrcPortName;
                item.TrgPortName = value.TrgPortName;
                item.PartnerInName = value.PartnerInName;
                item.FreightName = value.FreightName;
                item.Baggage = value.Baggage;
                item.SrcTime = value.SrcTime;
                item.TrgTime = value.TrgTime;
                item.FlyTimeTo = value.FlyTimeTo;
                item.code_class = getEcenomHtml();
                item.price = value.price;
                item.operator = value.operator;
                item.fly_id = value.fly_id;
                item.type_to = value.type_to;

                items_from.push(item);
                if (value.operator != 10)
                    _data_op_exist_from = 1;
            }
        });
    }
    return items_from;
}

$(document).on('click', '#search', function (e) {
    e.preventDefault();
    //SAVE CURRENT FLY 1
    flyPropertyArray = [];
    flyPropertyArray['departureCountry'] = $('.popup-from .country-from.active').text();
    flyPropertyArray['departureLocation'] = $('.popup-from .from.active').text();
    flyPropertyArray['destinationCountry'] = $('.popup-to .country-to.active').text();
    flyPropertyArray['destinationCity'] = $('.popup-to .to.active').text();
    flyPropertyArray['adults'] = $('.adults').val();
    flyPropertyArray['children'] = $('.children').val();
    flyPropertyArray['infants'] = $('.childes').val();

    //value
    destinationCityId = $(".popup-to .to.active").data("city-alias");
    departureCityId = $(".popup-from .from.active").data("city-alias");

    OutgoingDepartureDates = stringifyDate(searchComponent.departureDate);
    ReturnDepartureDates = stringifyDate(searchComponent.arrivalDate);

    adults = $('.adults').val();
    children = $('.children').val();
    infants = $('.childes').val();

    //show loader
    $('#loader').removeClass('hide');
    $.ajax({
        url     : baseAPIUrl+'/get-flight-online',
        type    : 'POST',
        dataType: 'json',
        cache   : false,
        data    : {
            'departureCityId'       : departureCityId,
            'destinationCityId'     : destinationCityId,
            'OutgoingDepartureDates': OutgoingDepartureDates,
            'ReturnDepartureDates'  : ReturnDepartureDates,
            'adults'                : adults,
            'children'              : children,
            'infants'               : infants,
            'type'                  : trip_type,
            'schema'                : schema,
        },
        success : function (json) {
            no_result();
            var items;
            if (trip_type === 'round_way') {
                items = get_round_trip(json);
                var items_from = [];
                no_result();
                items = items.sort(function (a, b) {
                    var x = a.price;
                    var y = b.price;
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                });
                items.forEach(function (item) {
                    if (!(_data_rt_exist && (item.BlockStatusIn == 'NotAvailable' || item.BlockStatusOut == 'NotAvailable'))) {
                        get_view_rt(item);
                        $('#loader').addClass('hide');
                    }
                });
                if (items.length == 0) {
                    no_result(getNotFoundHtml());
                }
            } else {
                items = get_ow(json);
                items = items.sort(function (a, b) {
                    var x = a.price;
                    var y = b.price;
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                });
                items.forEach(function (item) {
                    if (!(_data_exist_ow && item.BlockStatusIn == 'NotAvailable')) {
                        get_view_ow(item);
                        $('#loader').addClass('hide');
                    }
                });
                if (items.length == 0) {
                    no_result(getNotFoundHtml());
                }
            }
        },
        error   : function (data) {
            no_result(getNotFoundHtml());
        }
    });
});

$(document).on('click', '.buy', function () {
    correctButtonBuy = $(this).closest('tr');
    if ($(this).closest('.buy-button-mobile').length > 0) {
        if (trip_type === 'round_way') {
            correctButtonBuy = $(this).closest('.buy-button-mobile').prev('tr').prev('tr');
        } else {
            correctButtonBuy = $(this).closest('.buy-button-mobile').prev('tr');
        }
    }
    if (trip_type === 'round_way') {
        flyPropertyArray['fly_from_id'] = correctButtonBuy.next('tr').find('.fly_from_id span').text();
        flyPropertyArray['fly_to_id'] = correctButtonBuy.next('tr').find('.fly_to_id span').text();
    } else {
        flyPropertyArray['fly_from_id'] = correctButtonBuy.find('.fly_from_id span').text();
    }
    $.ajax({
        url     : 'https://anytickets.com.ua/orders/fly-in-session',
        data    : {'flyPropertyArray': $.extend({}, flyPropertyArray), 'schema': schema},
        dataType: 'JSON',
        cache   : false,
        type    : 'POST',
        success : function (data) {
            $('#fly-from').val('');
            $('#fly-to').val('');
            if (data.result == 'success') {
                document.location = data.link;
            }
        }
    });
});

function no_result(not_found) {
    if (typeof not_found !== 'undefined') {
        $('#result tbody').html(not_found);
        $('#loader').addClass('hide');
    } else {
        $('#result tbody').html('');
    }
    $('#rowResult .load-filters').hide();
    $('#rowResult .resultBackOpacity').hide();
}

$(document).mouseup(function (e) {
    touch_end(e);
}).bind("touchend", function (e) {
    touch_end(e);
    var container = $(".datepicker");
    if (container.has(e.target).length === 0) {
        container.datepicker().hide()
    }
    var container = $(".datepicker2");
    if (container.has(e.target).length === 0) {
        container.datepicker().hide()
    }
});

function touch_end(e) {
    var container = $(".popup-from");
    if (container.has(e.target).length === 0 && e.target.id !== 'fly-from' && !container.hasClass('hide')) {
        container.addClass('hide');
    }
    var container = $(".popup-to");
    if (container.has(e.target).length === 0 && e.target.id !== 'fly-to' && !container.hasClass('hide')) {
        container.addClass('hide');
    }
    var container = $(".popup-passengers");
    if (container.has(e.target).length === 0 && e.target.id !== 'passengers' && !container.hasClass('hide')) {
        container.addClass('hide');
    }
}

$('#modal-info').on('click', '.change-trip', function () {
    if (trip_type === 'round_way') {
        $('#radio02').prop('checked', true);
        $('.date-to').hide();
        trip_type = 'one_trip';
    } else {
        $('#radio01').prop('checked', true);
        $('.date-to').show();
        trip_type = 'round_way';
    }
    searchComponent.tripType = trip_type;
    setQueryParams({'type': trip_type});


    $('.date-fly-data').addClass('hide');
    $('input#fly-from').val('');
    $('input#fly-to').val('');
    $('#result tbody').html(getNotFoundHtml());
    _t_from_city = _t_to_country = _t_from_country = _t_to_city = '';
    $('.popup-from .popup-pick-city-container').html('');
    $('.popup-to .popup-pick-city-container').html('');
    $('#datepicker').datepicker('setDate', null);
    $('#datepicker2').datepicker('setDate', null);
    $('#datepicker').datepicker('remove');
    $('#datepicker2').datepicker('remove');
});

function no_dates_info() {

    var message = lajax.t('В данный момент у нас нет предложений на рейсах {b_start}{from} - {to}{b_end} {trip_type}. Всё равно перейти в поиск билетов {trip_type_2}?',
        {
            b_start    : '<b>',
            b_end      : '</b>',
            from       : $('input#fly-from').val(),
            to         : $('input#fly-to').val(),
            trip_type  : trip_type === 'round_way' ? lajax.t('в две стороны') : lajax.t('в одну сторону'),
            trip_type_2: trip_type === 'round_way' ? lajax.t('в две стороны') : lajax.t('в одну сторону')
        });
    $('#text-info').html(message);
    $('#modal-info').modal('show');
    if ($('#result tbody').html() === '') {
        $('.date-fly-data').addClass('hide');
        $('input#fly-from').val('');
        $('input#fly-to').val('');
        _t_from_city = _t_to_country = _t_from_country = _t_to_city = '';
        $('.popup-from .popup-pick-city-container').html('');
        $('.popup-from .popup-pick-country-container').html('');
    } else {
        if (trip_type === 'round_way') {
            $('#radio02').prop('checked', true);
            $('.date-to').hide();
            trip_type = 'one_trip';
        } else {
            $('#radio01').prop('checked', true);
            $('.date-to').show();
            trip_type = 'round_way';
        }
    }

}


/*
 * Count passangers
 */
$('#passengers').bind(_clickHandler, function (e) {
    $('.popup-passengers').hasClass('hide') ? $('.popup-passengers').removeClass('hide') : $('.popup-passengers').addClass('hide');
});
$('#adults-plus').click(function () {
    passengersPlus($('.adults'), $('#adults-minus'));
});
$('#adults-minus').click(function () {
    if (Number($('.adults').val()) === 1) {
        return true;
    } else {
        passengersMinus($('.adults'), $('#adults-minus'));
    }
});
$('#children-plus').click(function () {
    passengersPlus($('.children'), $('#children-minus'));
});
$('#children-minus').click(function () {
    passengersMinus($('.children'), $('#children-minus'));
});
$('#childes-plus').click(function () {
    passengersPlus($('.childes'), $('#childes-minus'));
});
$('#childes-minus').click(function () {
    passengersMinus($('.childes'), $('#childes-minus'));
});


function handleCommonCount() {
    passengersCount = Number($('.adults').val()) + Number($('.children').val()) + Number($('.childes').val());
    $('#passengers').val(passengersCount);
}

function passengersMinus(elementInput, currentEl) {
    if (elementInput.val() > 0) {
        currentEl.removeClass('opacity');
        var count = Number(elementInput.val());
        elementInput.val(String(count - 1));
        handleCommonCount();
    }

    if (elementInput.val() == 0) {
        currentEl.addClass('opacity');
    }
}

function passengersPlus(elementInput, elemMinus) {
    elemMinus.removeClass('opacity');

    var count = Number(elementInput.val());
    elementInput.val(String(count + 1));
    handleCommonCount();
}

$(window).click(function (event) {
    if ($(event.target).closest('.passengers-block').length == 0) {
        $('.popup-passengers').addClass('hide');
    }
});

//----------------FROM----------------
$('#fly-from').bind(_clickHandler, function (e) {
    $('.popup-from').removeClass('hide');
});

function setArrivalCountries(countries) {
    arrivalCountries = $('.popup-to .popup-pick-country-container');
    arrivalCountries.html('');
    Object.keys(countries).sort().forEach(function (v) {
        arrivalCountries.append('<div class="popup-pick-country-item country-to" data-country=' + countries[v] + '>' + v + '</div>');
    });
}

//----------------TO----------------
$('#fly-to').bind(_clickHandler, function (e) {
    touch_end(e);
    $('.popup-to').removeClass('hide');
});


function get_view_rt(item) {
    $('#result tbody').append('<tr>' +
        '<td class="direction-icon-block" >' +
        '<i class="fa fa-plane fa-lg ' + item.BlockStatusIn + '"></i>' +
        '<span class="direction-icon-block-label">' + item.departureLocation + ' - ' + item.destinationCity + '</span>' +
        '</td>' +
        '<td>' +
        '<span class="table-header-mobile">' + lajax.t('Рейс') + '</span>' +
        '<div class="direction-icon-block">' +
        '<i class="fa fa-plane ' + item.BlockStatusIn + ' icon-hide"></i>' +
        '<span class="outgoing-flight-code" data-outgoing-airport="' + item.SrcPortName + '" data-outgoing-airport2="' + item.SrcPortNameBack + '">' + item.FreightName + '</span>' +
        '<span class="PartnerInName" style="display: none;">' + item.PartnerInName + '</div>' +
        '</div>' +
        '</td>' +
        '<td>' +
        '<span class="table-header-mobile">' + lajax.t('Вылет') + '</span>' +
        '<div class="outgoing-departure-datetime">' + item.SrcTime + '</div>' +
        '</td>' +
        '<td>' +
        '<span class="table-header-mobile">' + lajax.t('Прибытие') + '</span>' +
        '<div class="outgoing-arrival-datetime">' + item.TrgTime + '</div>' +
        '</td>' +
        '<td>' +
        '<span class="table-header-mobile">' + lajax.t('Время в пути') + '</span>' +
        '<div>' +
        '<div class="outgoing-legTime" >' + item.FlyTimeTo + (item.type_to === 1 ? '<br/>(' + lajax.t('с пересадкой') + ')' : '') + '</div>' +
        '</div>' +
        '</td>' +
        '<td>' +
        '<span class="table-header-mobile">' + lajax.t('Класс') + '</span>' +
        '<div>' +
        '<div>' + item.code_class + '</div>' +
        '</div>' +
        '</td>' +
        '<td>' +
        '<span class="table-header-mobile">' + lajax.t('Багаж') + '</span>' +
        '<div>' +
        '<div>' + (item.Baggage > 0
            ? (lajax.t('1 место') + ', ' + item.Baggage + ' ' + lajax.t('кг'))
            : (((item.operator.toString()).indexOf('14') >= 0 && (item.operator.toString()).indexOf('14') <= 1)
                ? lajax.t('Только ручная кладь (40см x 20см x 25см)')
                : ((item.operator.toString()).indexOf('16') >= 0 && (item.operator.toString()).indexOf('16') <= 1)
                    ? lajax.t('Только ручная кладь (55х35х25см, 10 кг)')
                    : ((item.operator.toString()).indexOf('17') >= 0 && (item.operator.toString()).indexOf('17') <= 1)
                        ? lajax.t('Только ручная кладь (40х30х20см, 10 кг)')
                        : lajax.t('Только ручная кладь (7 кг.)'))) + '</div>' +
        '</div>' +
        '</td>' +
        '<td class="price-row-two-direction hide-small">' +
        '<span class="table-header-mobile hide-medium">' + lajax.t('Цена') + '</span>' +
        '<div class="hide-medium">' +
        '<div>' + item.price + '/div>' +
        '</div>' +
        '</td>' +
        '<td rowspan="2" style="vertical-align: middle" class="buy-button-desk">' +
        item.finButton +
        '</td>' +
        '</tr>' +
        '<tr class="separate-line">' +
        '<td class="direction-icon-block">' +
        '<i class="fa fa-plane fa-lg fa-rotate-180 ' + item.BlockStatusOut + '"></i>' +
        '<span class="direction-icon-block-label">' + item.destinationCity + ' - ' + item.departureLocation + '</span>' +
        '</td>' +
        '<td>' +
        '<span class="table-header-mobile">' + lajax.t('Рейс') + '</span>' +
        '<div class="direction-icon-block">' +
        '<i class="fa fa-plane fa-flip-horizontal ' + item.BlockStatusOut + ' icon-hide"></i>' +
        '<span class="return-flight-code" data-return-airport="' + item.TrgPortName + '" data-return-airport2="' + item.TrgPortNameBack + '">' + item.FreightNameBack + '</span>' +
        '<span class="PartnerOutName" style="display: none;">' + item.PartnerOutName + '</div>' +
        '</div>' +
        '</td>' +
        '<td>' +
        '<span class="table-header-mobile">' + lajax.t('Вылет') + '</span>' +
        '<div class="return-departure-datetime">' + item.SrcTimeBack + '</div>' +
        '</td>' +
        '<td>' +
        '<span class="table-header-mobile">' + lajax.t('Прибытие') + '</span>' +
        '<div class="return-arrival-datetime">' + item.TrgTimeBack + '</div>' +
        '</td>' +
        '<td>' +
        '<span class="table-header-mobile">' + lajax.t('Время в пути') + '</span>' +
        '<div>' +
        '<div class="return-legTime" >' + item.FlyTimeBack + (item.type_back == 1 ? '<br/>' + lajax.t('(с пересадкой)') : '') + '</div>' +
        '</div>' +
        '</td>' +
        '<td>' +
        '<span class="table-header-mobile">' + lajax.t('Класс') + '</span>' +
        '<div>' +
        '<div>' + item.code_class + '</div>' +
        '</div>' +
        '</td>' +
        '<td>' +
        '<span class="table-header-mobile">' + lajax.t('Багаж') + '</span>' +
        '<div>' +
        '<div>' + (item.BaggageBack > 0
            ? (lajax.t('1 место') + ', ' + item.BaggageBack + ' ' + lajax.t('кг'))
            : ((
                ((item.operator.toString()).indexOf('14') >= 3 && (item.operator.toString()).indexOf('14') <= 4)
                || ((item.operator.toString()).length === 2 && (item.operator.toString()).indexOf('14') >= 0 && (item.operator.toString()).indexOf('14') <= 1)
            )
                ? lajax.t('Только ручная кладь (40см x 20см x 25см)')
                : ((
                    ((item.operator.toString()).indexOf('16') >= 3 && (item.operator.toString()).indexOf('16') <= 4)
                    || ((item.operator.toString()).length === 2 && (item.operator.toString()).indexOf('16') >= 0 && (item.operator.toString()).indexOf('16') <= 1)
                )
                    ? lajax.t('Только ручная кладь (55х35х25см, 10 кг)')
                    : ((
                        ((item.operator.toString()).indexOf('17') >= 3 && (item.operator.toString()).indexOf('17') <= 4)
                        || ((item.operator.toString()).length === 2 && (item.operator.toString()).indexOf('17') >= 0 && (item.operator.toString()).indexOf('17') <= 1)
                    )
                        ? lajax.t('Только ручная кладь (40х30х20см, 10 кг)')
                        : lajax.t('Только ручная кладь (7 кг.)'))))) + '</div>' +
        '</div>' +
        '</td>' +
        '<td class="price-row-two-direction hide-small">' +
        '<span class="table-header-mobile">' + lajax.t('Цена') + '</span>' +
        '<div>' +
        '<div class="price"><span>' + item.price + '</span> ' + lajax.t('грн') + '</div>' +
        '<div class="operator" style="display: none;"><span>' + item.operator + '</span></div>' +
        '<div class="fly_from_id" style="display: none;"><span>' + item.fly_from_id + '</span></div>' +
        '<div class="fly_to_id" style="display: none;"><span>' + item.fly_to_id + '</span></div>' +
        '</div>' +
        '</td>' +
        '</tr>' +
        '<tr class="buy-button-mobile">' +
        '<td>' +
        '<span class="price-small">' + lajax.t('Цена') + ': ' + item.price + '</span>' +
        item.finButton +
        '</td>' +
        '</tr>');
}

function get_view_ow(item) {
    $('#result tbody').append('<tr class="separate-line">' +
        '<td class="direction-icon-block">' +
        '<i class="fa fa-plane fa-lg ' + item.BlockStatusIn + '"></i>' +
        '<span class="direction-icon-block-label">' + item.departureLocation + ' - ' + item.destinationCity + '</span>' +
        '</td>' +
        '<td>' +
        '<span class="table-header-mobile">' + lajax.t('Рейс') + '</span>' +
        '<div class="direction-icon-block">' +
        '<i class="fa fa-plane ' + item.BlockStatusIn + ' icon-hide"></i>' +
        '<span class="outgoing-flight-code" data-outgoing-airport="' + item.SrcPortName + '" data-return-airport="' + item.TrgPortName + '">' + item.FreightName + '</span>' +
        '<span class="PartnerInName" style="display: none;">' + item.PartnerInName + '</span>' +
        '</div>' +
        '</td>' +
        '<td>' +
        '<span class="table-header-mobile">' + lajax.t('Вылет') + '</span>' +
        '<div class="outgoing-departure-datetime">' + item.SrcTime + '</div>' +
        '</td>' +
        '<td>' +
        '<span class="table-header-mobile">' + lajax.t('Прибытие') + '</span>' +
        '<div class="outgoing-arrival-datetime">' + item.TrgTime + '</div>' +
        '</td>' +
        '<td>' +
        '<span class="table-header-mobile">' + lajax.t('Время в пути') + '</span>' +
        '<div>' +
        '<div class="outgoing-legTime">' + item.FlyTimeTo + '</div>' +
        '</div>' +
        '</td>' +
        '<td>' +
        '<span class="table-header-mobile">' + lajax.t('Класс') + '</span>' +
        '<div>' +
        '<div>' + item.code_class + '</div>' +
        '</div>' +
        '</td>' +
        '<td>' +
        '<span class="table-header-mobile">' + lajax.t('Багаж') + '</span>' +
        '<div>' +
        '<div>' + (item.Baggage > 0
            ? (lajax.t('1 место') + ', ' + item.Baggage + ' ' + lajax.t('кг'))
            : ((item.operator === 14)
                ? lajax.t('Только ручная кладь (40см x 20см x 25см)')
                : ((item.operator === 16)
                    ? lajax.t('Только ручная кладь (55х35х25см, 10 кг)')
                    : ((item.operator === 17)
                        ? lajax.t('Только ручная кладь (40х30х20см, 10 кг)')
                        : lajax.t('Только ручная кладь (7 кг.)'))))) + '</div>' +
        '</div>' +
        '</td>' +
        '<td class="price-row hide-small">' +
        '<span class="table-header-mobile">' + lajax.t('Цена') + '</span>' +
        '<div>' +
        '<div class="price"><span>' + item.price + '</span> ' + lajax.t('грн') + '</div>' +
        '<div class="operator" style="display: none;">><span>' + item.operator + '</span></div>' +
        '<div class="fly_from_id" style="display: none;"><span>' + item.fly_id + '</span></div>' +
        '</div>' +
        '</td>' +
        '<td class="buy-button-desk">'
        + item.finButton +
        '</td>' +
        '</tr>' +
        '<tr class="buy-button-mobile">' +
        '<td>' +
        '<span class="price-small">' + lajax.t('Цена') + ': ' + item.price + '</span>' + item.finButton +
        '</td>' +
        '</tr>');
}

$(document).ready(() => {
    searchComponent.init()
})

// $('a.place_item').click(function (e) {
//   // prevent scroll to top
//   e.preventDefault()
// });
