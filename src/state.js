export const state = {
  jataka: {},
  panchangPlace: {},
  birthPlace: {},
  panchang: {},
  grahas: null,
  lagna: null,
  settings: {
    theme: "light",
    panchangMode: "local",
  },
};

export function syncState() {
  window.kundaliState = {
    ...state,
    jataka: { ...state.jataka },
    panchangPlace: { ...state.panchangPlace },
    birthPlace: { ...state.birthPlace },
    panchang: { ...state.panchang },
    grahas: state.grahas,
    lagna: state.lagna,
    settings: { ...state.settings },
  };
}
