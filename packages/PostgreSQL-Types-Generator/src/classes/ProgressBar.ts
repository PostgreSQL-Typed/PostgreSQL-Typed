/* eslint-disable no-undefined */
import type chalk from "chalk";

import { ETA } from "../classes/ETA";
import { getConsoleHeader } from "../util/functions/getters/getConsoleHeader";
import { isDebugEnabled } from "../util/functions/isDebugEnabled";

interface WaiterOptions {
	line1: string;
	line2: string;
	line3: string;
	doubleBackslash?: boolean;
	interval?: number;
	spinnerColor?: chalk.Chalk;
}

interface ProgressOptions {
	totalSteps: number;
	line1: string;
	spinnerColor?: chalk.Chalk;
	steps: string[];
}

interface ProgressBarOptions {
	waiter: WaiterOptions;
	progress: ProgressOptions;
}

export class ProgressBar {
	private stream = process.stderr;
	private interval: number;
	private waiterFrames: string[] | undefined = undefined;
	private progressDotFrames: string[] | undefined = undefined;
	private waiterId: NodeJS.Timeout | undefined = undefined;
	private progressId: NodeJS.Timeout | undefined = undefined;
	private linesToClear = 0;
	private lineCount = 0;
	private waiterFrameIndex = 0;
	private progressFrameIndex = 0;
	private total = 0;
	private eta = new ETA(0, 0);
	private value = 0;
	private startTime = 0;
	private lastProgressString = "";
	private step = "";
	private stepIndex = -1;
	private steps: string[] = [];
	private progressLine1 = "";
	private progressSpinnerColor: chalk.Chalk | undefined;

	constructor(options: ProgressBarOptions) {
		const {
			progress: { totalSteps, steps, line1: progressLine1, spinnerColor: progressSpinnerColor },
			waiter: { line1, line2, line3, doubleBackslash, interval, spinnerColor },
		} = options;

		this.total = totalSteps;
		this.step = steps[0];
		this.stepIndex = 0;
		this.steps = steps;
		this.interval = interval ?? 250;
		this.progressSpinnerColor = progressSpinnerColor;
		this.progressLine1 = progressLine1;

		const waiterSpinner = this.getSpinners(spinnerColor);

		this.waiterFrames = [
			getConsoleHeader(line1 + waiterSpinner[0], line2, doubleBackslash ?? false, line3),
			getConsoleHeader(line1 + waiterSpinner[1], line2, doubleBackslash ?? false, line3),
			getConsoleHeader(line1 + waiterSpinner[2], line2, doubleBackslash ?? false, line3),
			getConsoleHeader(line1 + waiterSpinner[3], line2, doubleBackslash ?? false, line3),
		];

		this.setProgressDots();
	}

	private getSpinners(spinnerColor?: chalk.Chalk) {
		return [
			spinnerColor ? spinnerColor(".  ") : ".  ",
			spinnerColor ? spinnerColor(".. ") : ".. ",
			spinnerColor ? spinnerColor("...") : "...",
			spinnerColor ? spinnerColor("   ") : "   ",
		];
	}

	public startWaiter() {
		if (!this.waiterFrames || this.waiterId) return this;

		this.renderWaiter();
		this.waiterId = setInterval(this.renderWaiter.bind(this), this.interval);

		return this;
	}

	private frameWaiter() {
		if (!this.waiterFrames) return "";
		const frames = this.waiterFrames,
			frame = frames[this.waiterFrameIndex];

		this.waiterFrameIndex = ++this.waiterFrameIndex % frames.length;
		this.lineCount = frame.split("\n").length;

		return frame;
	}

	private renderWaiter() {
		if (!this.stream.isTTY) return this;
		if (isDebugEnabled()) return this;

		this.clear();
		this.stream.write(this.frameWaiter());
		this.linesToClear = this.lineCount;

		return this;
	}

	public startProgress() {
		if (this.progressId) return this;
		if (this.waiterId) this.stopWaiter();

		this.startTime = Date.now();
		this.lastProgressString = "";
		this.eta = new ETA(this.startTime, this.value);

		this.renderProgress();
		this.progressId = setInterval(this.renderProgress.bind(this), this.interval);

		return this;
	}

	public incrementProgress(value = 1) {
		this.value += value;

		this.eta.update(Date.now(), this.value, this.total);
	}

	private renderProgress() {
		const frameString = this.frameProgress();

		if (!this.stream.isTTY) return this;

		if (this.lastProgressString !== frameString) {
			this.updateETA();
			if (this.lastProgressString !== "") this.clear();
			this.stream.write(frameString);
			this.linesToClear = this.lineCount;
			this.lastProgressString = frameString;
		}

		return this;
	}

	private frameProgress() {
		const frame = getConsoleHeader(
			this.dotsProgressWaiter(),
			`${this.getProgressString()} ${this.getProgressPercentageString()} | ETA: ${this.getETAString()}`,
			false,
			`Step: ${this.value}/${this.total} (${this.step})`
		);

		this.lineCount = frame.split("\n").length;
		return frame;
	}

	private dotsProgressWaiter() {
		if (!this.progressDotFrames) return "";
		const frames = this.progressDotFrames,
			dots = frames[this.progressFrameIndex];

		this.progressFrameIndex = ++this.progressFrameIndex % frames.length;

		return dots;
	}

	private getETAString() {
		const t = this.eta.getTime();

		function round(input: number) {
			return 5 * Math.round(input / 5);
		}

		if (typeof t === "string") return t;

		// > 1h ?
		if (t > 3600) return `${this.autopadding(Math.floor(t / 3600), 2)}h${this.autopadding(round((t % 3600) / 60), 2)}m`;
		// > 60s ?
		else if (t > 60) return `${this.autopadding(Math.floor(t / 60), 2)}m${this.autopadding(round(t % 60), 2)}s`;
		// > 10s ?
		else if (t > 10) return `${this.autopadding(round(t), 2)}s`;
		// default: don't apply round to multiple
		else return `${this.autopadding(t, 2)}s`;
	}

	private autopadding(v: number, length: number) {
		return `${v}`.slice(-length);
	}

	private getProgressPercentageString() {
		const percentage = Math.floor(this.getProgress() * 100);
		return `${this.autopadding(percentage, 3)}%`;
	}

	private getProgressString() {
		const barWidth = 41,
			completeString = new Array(barWidth).join("\u2588"),
			incompleteString = new Array(barWidth).join("\u2591"),
			completeSize = Math.round(this.getProgress() * barWidth),
			incompleteSize = barWidth - completeSize;

		return completeString.substring(0, completeSize) + incompleteString.substring(0, incompleteSize);
	}

	private getProgress() {
		let progress = this.value / this.total;
		if (isNaN(progress)) progress = 1.0;

		progress = Math.min(Math.max(progress, 0.0), 1.0);

		return progress;
	}

	private clear() {
		if (!this.stream.isTTY) return this;

		this.stream.cursorTo(0);

		for (let index = 0; index < this.linesToClear; index++) {
			if (index > 0) this.stream.moveCursor(0, -1);

			this.stream.clearLine(1);
		}

		return this;
	}

	public stop() {
		this.stopWaiter();
		this.stopProgress();
		return this;
	}

	private stopWaiter() {
		if (!this.waiterId) return this;

		clearInterval(this.waiterId);
		this.waiterId = undefined;
		this.waiterFrameIndex = 0;
		this.clear();

		return this;
	}

	private stopProgress() {
		if (!this.progressId) return this;

		clearInterval(this.progressId);
		this.progressId = undefined;
		this.clear();

		return this;
	}

	public updateETA() {
		this.eta.update(Date.now(), this.value, this.total);
	}

	public setStep(step: number) {
		if (step <= this.stepIndex || !this.steps[step]) return this;
		this.stepIndex = step;
		this.step = this.steps[step];
		this.updateETA();
		return this;
	}

	public setProgressLine1(line: string) {
		this.progressLine1 = line;
		this.setProgressDots();
		return this;
	}

	private setProgressDots() {
		const progressDot = this.getSpinners(this.progressSpinnerColor);

		this.progressDotFrames = [
			this.progressLine1 + progressDot[0],
			this.progressLine1 + progressDot[1],
			this.progressLine1 + progressDot[2],
			this.progressLine1 + progressDot[3],
		];
	}
}
