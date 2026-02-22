import memoize from 'memoize';

// Kill switch to disable memoization if I encounter weird issues with it,
// due to me forgetting to include a parameter in the cache key
const DISABLE_MEMOIZE = false;

const mem: typeof memoize = (fn, options) => {
  if (DISABLE_MEMOIZE) {
    return fn;
  }

  return memoize(fn, options);
};

export default mem;
