export const chunkButtons = (buttons: string[], columns = 2) => {
  const chunkedButtons: string[][] = [];

  for (let i = 0; i < buttons.length; i += columns) {
    chunkedButtons.push(buttons.slice(i, i + columns));
  }

  return chunkedButtons;
};
