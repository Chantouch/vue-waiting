import { isMatch } from './lib/matcher';

function uniqArray(array) {
  return array.filter((el, index, arr) => index === arr.indexOf(el));
}

export function is(waitFor, waiter) {
  if (typeof waiter === 'string' && waiter.match(/[\*\!]/)) {
    return waitFor.filter(w => isMatch(w, waiter)).length > 0;
  }
  return Array.isArray(waiter)
    ? waiter.some(w => is(waitFor, w))
    : waitFor.includes(waiter);
}

export function any(waitFor) {
  return waitFor.length > 0;
}

export function start(waitFor, waiter) {
  return uniqArray([...waitFor, waiter]);
}

export function end(waitFor, waiter) {
  return uniqArray(waitFor).filter(l => l !== waiter);
}

export function progress(progresses, waiter, current, total = 100) {
  if (current > total) {
    return endProgress(progresses, waiter);
  }

  return {
    ...progresses,
    [waiter]: {
      current,
      total,
      percent: (100 * current) / total
    }
  };
}

export function endProgress(progresses, waiter) {
  const { [waiter]: omit, ...omittedProgresses } = progresses;
  return omittedProgresses;
}

export function percent(progresses, waiter) {
  const progress = progresses[waiter];
  if (!progress) return 0;

  return progress.percent;
}

export function nodeIsDebug() {
  return process.env.NODE_ENV !== 'production';
}
