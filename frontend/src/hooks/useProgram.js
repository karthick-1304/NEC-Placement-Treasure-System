// src/hooks/useProgram.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProgramAPI, getLangTemplateAPI, runProgramAPI, submitProgramAPI } from '../api/programAPI.js';
import { updateStudentProfile } from '../store/slices/authSlice.js';
import {
  setCurrentProgram, setSelectedLang, setCode, setTemplate,
  setIsRunning, setIsSubmitting, setRunResults, setSubmitResults, setProgramError,
} from '../store/slices/programSlice.js';

const useProgram = (progId) => {
  const dispatch = useDispatch();
  const { currentProgram, langTemplates, publicTestCases, selectedLang,
          code, isSolved, isRunning, isSubmitting, runResults, submitResults, error } =
    useSelector((state) => state.program);

  useEffect(() => {
    if (!progId) return;
    const fetch = async () => {
      try {
        const data = await getProgramAPI(progId);
        dispatch(setCurrentProgram(data.data));
      } catch (err) {
        dispatch(setProgramError(err.message));
      }
    };
    fetch();
  }, [progId, dispatch]);

  const handleLangChange = async (lang) => {
    dispatch(setSelectedLang(lang));
    try {
      const data = await getLangTemplateAPI({ progId, lang });
      dispatch(setTemplate(data.data.lang_template.template));
    } catch (err) {
      dispatch(setProgramError(err.message));
    }
  };

  const handleRun = async () => {
    dispatch(setIsRunning(true));
    try {
      const data = await runProgramAPI({ progId, lang: selectedLang, code });
      dispatch(setRunResults(data));
    } catch (err) {
      dispatch(setProgramError(err.message));
    } finally {
      dispatch(setIsRunning(false));
    }
  };

  const handleSubmit = async () => {
    dispatch(setIsSubmitting(true));
    try {
      const data = await submitProgramAPI({ progId, lang: selectedLang, code });
      dispatch(setSubmitResults(data));
      if (data.data?.updated_profile) {
        dispatch(updateStudentProfile(data.data.updated_profile));
      }
    } catch (err) {
      dispatch(setProgramError(err.message));
    } finally {
      dispatch(setIsSubmitting(false));
    }
  };

  return {
    currentProgram, langTemplates, publicTestCases, selectedLang,
    code, isSolved, isRunning, isSubmitting, runResults, submitResults, error,
    handleLangChange, handleRun, handleSubmit,
    setCode: (val) => dispatch(setCode(val)),
  };
};

export default useProgram;