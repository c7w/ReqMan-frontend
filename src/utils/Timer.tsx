let RDTSTimer: NodeJS.Timeout | null;

const removeRDTSTimer = () => {
  if (RDTSTimer) {
    console.debug("Removing timer...");
    clearInterval(RDTSTimer);
    RDTSTimer = null;
  }
};

const addRDTSTimer = (callback: () => void) => {
  removeRDTSTimer();
  console.debug("Adding timer...");
  RDTSTimer = setInterval(() => {
    callback();
  }, 20000);
};

export { removeRDTSTimer, addRDTSTimer };
