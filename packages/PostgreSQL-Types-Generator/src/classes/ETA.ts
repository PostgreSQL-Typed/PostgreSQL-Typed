/* eslint-disable unicorn/filename-case */
export class ETA {
	private etaBufferLength: number;
	private valueBuffer: number[];
	private timeBuffer: number[];
	private eta: string | number;

	constructor(initTime: number, initValue: number) {
		// size of eta buffer
		this.etaBufferLength = 100;

		// eta buffer with initial values
		this.valueBuffer = [initValue];
		this.timeBuffer = [initTime];

		// eta time value
		this.eta = "0";
	}

	// add new values to calculation buffer
	update(time: number, value: number, total: number) {
		this.valueBuffer.push(value);
		this.timeBuffer.push(time);

		// trigger recalculation
		this.calculate(total - value);
	}

	// fetch estimated time
	getTime() {
		return this.eta;
	}

	// eta calculation - request number of remaining events
	calculate(remaining: number) {
		// get number of samples in eta buffer
		const currentBufferSize = this.valueBuffer.length,
			buffer = Math.min(this.etaBufferLength, currentBufferSize),
			vDiff = this.valueBuffer[currentBufferSize - 1] - this.valueBuffer[currentBufferSize - buffer],
			tDiff = this.timeBuffer[currentBufferSize - 1] - this.timeBuffer[currentBufferSize - buffer],
			// get progress per ms
			vtRate = vDiff / tDiff;

		// strip past elements
		this.valueBuffer = this.valueBuffer.slice(-this.etaBufferLength);
		this.timeBuffer = this.timeBuffer.slice(-this.etaBufferLength);

		// eq: vt_rate *x = total
		const eta = Math.ceil(remaining / vtRate / 1000);

		// check values
		if (Number.isNaN(eta)) this.eta = "NULL";
		// +/- Infinity --- NaN already handled
		else if (!Number.isFinite(eta)) this.eta = "∞";
		// > 10M s ? - set upper display limit ~115days (1e7/60/60/24)
		else if (eta > 1e7) this.eta = "∞";
		// negative ?
		else if (eta < 0) this.eta = 0;
		else {
			// assign
			this.eta = eta;
		}
	}
}
