import CALENDAR from './calendar.js'

class Calendar {
	constructor({
		date,
		selected,
		startDate,
		endDate,
		range
	} = {}) {
		// 当前日期
		this.date = this.getDate(new Date()) // 当前初入日期
		// 打点信息
		this.selected = selected || [];
		// 范围開始
		this.startDate = startDate
		// 范围結束
		this.endDate = endDate
		this.range = range
		// 多选状态
		this.cleanMultipleStatus()
		// 每周日期
		this.weeks = {}
		// this._getWeek(this.date.fullDate)
	}
	/**
	 * 設置日期
	 * @param {Object} date
	 */
	setDate(date) {
		this.selectDate = this.getDate(date)
		this._getWeek(this.selectDate.fullDate)
	}

	/**
	 * 清理多选状态
	 */
	cleanMultipleStatus() {
		this.multipleStatus = {
			before: '',
			after: '',
			data: []
		}
	}

	/**
	 * 重置開始日期
	 */
	resetSatrtDate(startDate) {
		// 范围開始
		this.startDate = startDate

	}

	/**
	 * 重置結束日期
	 */
	resetEndDate(endDate) {
		// 范围結束
		this.endDate = endDate
	}

	/**
	 * 獲取任意时間
	 */
	getDate(date, AddDayCount = 0, str = 'day') {
		if (!date) {
			date = new Date()
		}
		if (typeof date !== 'object') {
			date = date.replace(/-/g, '/')
		}
		const dd = new Date(date)
		switch (str) {
			case 'day':
				dd.setDate(dd.getDate() + AddDayCount) // 獲取AddDayCount天後的日期
				break
			case 'month':
				if (dd.getDate() === 31) {
					dd.setDate(dd.getDate() + AddDayCount)
				} else {
					dd.setMonth(dd.getMonth() + AddDayCount) // 獲取AddDayCount天後的日期
				}
				break
			case 'year':
				dd.setFullYear(dd.getFullYear() + AddDayCount) // 獲取AddDayCount天後的日期
				break
		}
		const y = dd.getFullYear()
		const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 獲取当前月份的日期，不足10补0
		const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 獲取当前几號，不足10补0
		return {
			fullDate: y + '-' + m + '-' + d,
			year: y,
			month: m,
			date: d,
			day: dd.getDay()
		}
	}


	/**
	 * 獲取上月剩余天數
	 */
	_getLastMonthDays(firstDay, full) {
		let dateArr = []
		for (let i = firstDay; i > 0; i--) {
			const beforeDate = new Date(full.year, full.month - 1, -i + 1).getDate()
			dateArr.push({
				date: beforeDate,
				month: full.month - 1,
				lunar: this.getlunar(full.year, full.month - 1, beforeDate),
				disable: true
			})
		}
		return dateArr
	}
	/**
	 * 獲取本月天數
	 */
	_currentMonthDys(dateData, full) {
		let dateArr = []
		let fullDate = this.date.fullDate
		for (let i = 1; i <= dateData; i++) {
			let isinfo = false
			let nowDate = full.year + '-' + (full.month < 10 ?
				full.month : full.month) + '-' + (i < 10 ?
				'0' + i : i)
			// 是否今天
			let isDay = fullDate === nowDate
			// 獲取打点信息
			let info = this.selected && this.selected.find((item) => {
				if (this.dateEqual(nowDate, item.date)) {
					return item
				}
			})

			// 日期禁用
			let disableBefore = true
			let disableAfter = true
			if (this.startDate) {
				let dateCompBefore = this.dateCompare(this.startDate, fullDate)
				disableBefore = this.dateCompare(dateCompBefore ? this.startDate : fullDate, nowDate)
			}

			if (this.endDate) {
				let dateCompAfter = this.dateCompare(fullDate, this.endDate)
				disableAfter = this.dateCompare(nowDate, dateCompAfter ? this.endDate : fullDate)
			}
			let multiples = this.multipleStatus.data
			let checked = false
			let multiplesStatus = -1
			if (this.range) {
				if (multiples) {
					multiplesStatus = multiples.findIndex((item) => {
						return this.dateEqual(item, nowDate)
					})
				}
				if (multiplesStatus !== -1) {
					checked = true
				}
			}
			let data = {
				fullDate: nowDate,
				year: full.year,
				date: i,
				multiple: this.range ? checked : false,
				beforeMultiple: this.dateEqual(this.multipleStatus.before, nowDate),
				afterMultiple: this.dateEqual(this.multipleStatus.after, nowDate),
				month: full.month,
				lunar: this.getlunar(full.year, full.month, i),
				disable: !disableBefore || !disableAfter,
				isDay
			}
			if (info) {
				data.extraInfo = info
			}

			dateArr.push(data)
		}
		return dateArr
	}
	/**
	 * 獲取下月天數
	 */
	_getNextMonthDays(surplus, full) {
		let dateArr = []
		for (let i = 1; i < surplus + 1; i++) {
			dateArr.push({
				date: i,
				month: Number(full.month) + 1,
				lunar: this.getlunar(full.year, Number(full.month) + 1, i),
				disable: true
			})
		}
		return dateArr
	}

	/**
	 * 獲取当前日期詳情
	 * @param {Object} date
	 */
	getInfo(date) {
		if (!date) {
			date = new Date()
		}
		const dateInfo = this.canlender.find(item => item.fullDate === this.getDate(date).fullDate)
		return dateInfo
	}

	/**
	 * 比较时間大小
	 */
	dateCompare(startDate, endDate) {
		// 計算截止时間
		startDate = new Date(startDate.replace('-', '/').replace('-', '/'))
		// 計算詳細项的截止时間
		endDate = new Date(endDate.replace('-', '/').replace('-', '/'))
		if (startDate <= endDate) {
			return true
		} else {
			return false
		}
	}

	/**
	 * 比较时間是否相等
	 */
	dateEqual(before, after) {
		// 計算截止时間
		before = new Date(before.replace('-', '/').replace('-', '/'))
		// 計算詳細项的截止时間
		after = new Date(after.replace('-', '/').replace('-', '/'))
		if (before.getTime() - after.getTime() === 0) {
			return true
		} else {
			return false
		}
	}


	/**
	 * 獲取日期范围内所有日期
	 * @param {Object} begin
	 * @param {Object} end
	 */
	geDateAll(begin, end) {
		var arr = []
		var ab = begin.split('-')
		var ae = end.split('-')
		var db = new Date()
		db.setFullYear(ab[0], ab[1] - 1, ab[2])
		var de = new Date()
		de.setFullYear(ae[0], ae[1] - 1, ae[2])
		var unixDb = db.getTime() - 24 * 60 * 60 * 1000
		var unixDe = de.getTime() - 24 * 60 * 60 * 1000
		for (var k = unixDb; k <= unixDe;) {
			k = k + 24 * 60 * 60 * 1000
			arr.push(this.getDate(new Date(parseInt(k))).fullDate)
		}
		return arr
	}
	/**
	 * 計算阴曆日期顯示
	 */
	getlunar(year, month, date) {
		return CALENDAR.solar2lunar(year, month, date)
	}
	/**
	 * 設置打点
	 */
	setSelectInfo(data, value) {
		this.selected = value
		this._getWeek(data)
	}

	/**
	 *  獲取多选状态
	 */
	setMultiple(fullDate) {
		let {
			before,
			after
		} = this.multipleStatus

		if (!this.range) return
		if (before && after) {
			this.multipleStatus.before = ''
			this.multipleStatus.after = ''
			this.multipleStatus.data = []
		} else {
			if (!before) {
				this.multipleStatus.before = fullDate
			} else {
				this.multipleStatus.after = fullDate
				if (this.dateCompare(this.multipleStatus.before, this.multipleStatus.after)) {
					this.multipleStatus.data = this.geDateAll(this.multipleStatus.before, this.multipleStatus.after);
				} else {
					this.multipleStatus.data = this.geDateAll(this.multipleStatus.after, this.multipleStatus.before);
				}
			}
		}
		this._getWeek(fullDate)
	}

	/**
	 * 獲取每周數據
	 * @param {Object} dateData
	 */
	_getWeek(dateData) {
		const {
			fullDate,
			year,
			month,
			date,
			day
		} = this.getDate(dateData)
		let firstDay = new Date(year, month - 1, 1).getDay()
		let currentDay = new Date(year, month, 0).getDate()
		let dates = {
			lastMonthDays: this._getLastMonthDays(firstDay, this.getDate(dateData)), // 上個月末尾几天
			currentMonthDys: this._currentMonthDys(currentDay, this.getDate(dateData)), // 本月天數
			nextMonthDays: [], // 下個月開始几天
			weeks: []
		}
		let canlender = []
		const surplus = 42 - (dates.lastMonthDays.length + dates.currentMonthDys.length)
		dates.nextMonthDays = this._getNextMonthDays(surplus, this.getDate(dateData))
		canlender = canlender.concat(dates.lastMonthDays, dates.currentMonthDys, dates.nextMonthDays)
		let weeks = {}
		// 拼接數組  上個月開始几天 + 本月天數+ 下個月開始几天
		for (let i = 0; i < canlender.length; i++) {
			if (i % 7 === 0) {
				weeks[parseInt(i / 7)] = new Array(7)
			}
			weeks[parseInt(i / 7)][i % 7] = canlender[i]
		}
		this.canlender = canlender
		this.weeks = weeks
	}

	//静态方法
	// static init(date) {
	// 	if (!this.instance) {
	// 		this.instance = new Calendar(date);
	// 	}
	// 	return this.instance;
	// }
}


export default Calendar
