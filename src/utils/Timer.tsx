let RDTSTimer: NodeJS.Timeout | null;

const removeRDTSTimer = () => {
  if (RDTSTimer) {
    clearTimeout(RDTSTimer);
    RDTSTimer = null;
  }
};

const addRDTSTimer = (callback: () => void) => {
  removeRDTSTimer();
  RDTSTimer = setTimeout(() => {
    callback();
  }, 20000);
};

export { removeRDTSTimer, addRDTSTimer };
