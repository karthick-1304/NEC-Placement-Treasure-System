// src/store/slices/programSlice.js
import { createSlice } from '@reduxjs/toolkit';

const programSlice = createSlice({
  name: 'program',
  initialState: {
    currentProgram:   null,
    langTemplates:    [],
    publicTestCases:  [],
    selectedLang:     '',
    code:             '',
    isSolved:         false,
    isRunning:        false,
    isSubmitting:     false,
    runResults:       null,
    submitResults:    null,
    error:            null,
  },
  reducers: {
    setCurrentProgram:  (state, action) => {
      state.currentProgram  = action.payload.program;
      state.langTemplates   = action.payload.lang_templates;
      state.publicTestCases = action.payload.public_test_cases;
      state.isSolved        = action.payload.is_solved;
      state.runResults      = null;
      state.submitResults   = null;
      state.error           = null;
      // Set initial lang + template
      if (action.payload.lang_templates?.length) {
        state.selectedLang = action.payload.lang_templates[0].lang_slug;
        state.code         = action.payload.lang_templates[0].template;
      }
    },
    setSelectedLang: (state, action) => { state.selectedLang = action.payload; },
    setCode:         (state, action) => { state.code         = action.payload; },
    setTemplate:     (state, action) => { state.code         = action.payload; },
    setIsRunning:    (state, action) => { state.isRunning    = action.payload; },
    setIsSubmitting: (state, action) => { state.isSubmitting = action.payload; },
    setRunResults:   (state, action) => { state.runResults   = action.payload; },
    setSubmitResults:(state, action) => {
      state.submitResults = action.payload;
      if (action.payload?.data?.verdict === 'ACCEPTED') state.isSolved = true;
    },
    setProgramError: (state, action) => { state.error = action.payload; },
    clearResults:    (state) => { state.runResults = null; state.submitResults = null; },
  },
});

export const {
  setCurrentProgram, setSelectedLang, setCode, setTemplate,
  setIsRunning, setIsSubmitting, setRunResults, setSubmitResults,
  setProgramError, clearResults,
} = programSlice.actions;

export default programSlice.reducer;