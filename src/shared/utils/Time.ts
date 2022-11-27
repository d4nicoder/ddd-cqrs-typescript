import dayjs from "dayjs";

export class Time {
	private _value: Date;

	constructor(date?: Date) {
		if (!date) {
			this._value = new Date();
		} else {
			this._value = date;
		}
	}

	addSeconds(seconds: number): Time {
		this._value = dayjs(this._value).add(seconds, "seconds").toDate();
		return this;
	}

	addMinutes(minutes: number): Time {
		this._value = dayjs(this._value).add(minutes, "minutes").toDate();
		return this;
	}

	addHours(hours: number): Time {
		this._value = dayjs(this._value).add(hours, "hours").toDate();
		return this;
	}

	addDays(days: number): Time {
		this._value = dayjs(this._value).add(days, "days").toDate();
		return this;
	}

	addWeeks(weeks: number): Time {
		this._value = dayjs(this._value).add(weeks, "weeks").toDate();
		return this;
	}

	addMonths(months: number): Time {
		this._value = dayjs(this._value).add(months, "months").toDate();
		return this;
	}

	addYears(years: number): Time {
		this._value = dayjs(this._value).add(years, "years").toDate();
		return this;
	}

	subtractSeconds(seconds: number): Time {
		this._value = dayjs(this._value).subtract(seconds, "seconds").toDate();
		return this;
	}

	subtractMinutes(minutes: number): Time {
		this._value = dayjs(this._value).subtract(minutes, "minutes").toDate();
		return this;
	}

	subtractHours(hours: number): Time {
		this._value = dayjs(this._value).subtract(hours, "hours").toDate();
		return this;
	}

	subtractDays(days: number): Time {
		this._value = dayjs(this._value).subtract(days, "days").toDate();
		return this;
	}

	subtractWeeks(weeks: number): Time {
		this._value = dayjs(this._value).subtract(weeks, "weeks").toDate();
		return this;
	}

	subtractMonths(months: number): Time {
		this._value = dayjs(this._value).subtract(months, "months").toDate();
		return this;
	}

	subtractYears(years: number): Time {
		this._value = dayjs(this._value).subtract(years, "years").toDate();
		return this;
	}

	toDate(): Date {
		return this._value;
	}
}
