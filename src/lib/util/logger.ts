import { default as pinoCtor } from 'pino';

import { BOT_TYPE } from '../constants';

const today = new Date();
const year = today.getFullYear();
const month = (today.getMonth() + 1).toString().padStart(2, '0');
const day = today.getDate().toString().padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;

const pino = pinoCtor(
	{
		level: 'debug',
		base: {
			time: undefined,
			level: undefined
		},
		mixin: () => ({
			rt: new Date().toISOString(),
			t: Date.now()
		}),
		timestamp: false
	},
	pinoCtor.destination({
		dest: `./logs/${formattedDate}-${today.getHours()}-${today.getMinutes()}-${BOT_TYPE}-debug-logs.log`,
		mkdir: true,
		sync: true
	})
);

interface LogContext {
	type?: string;
	[key: string]: unknown;
}

function _debugLog(str: string, context: LogContext = {}) {
	if (process.env.TEST) return;
	pino.debug({ ...context, message: str });
}
declare global {
	const debugLog: typeof _debugLog;
}
declare global {
	namespace NodeJS {
		interface Global {
			debugLog: typeof _debugLog;
		}
	}
}

global.debugLog = _debugLog;
