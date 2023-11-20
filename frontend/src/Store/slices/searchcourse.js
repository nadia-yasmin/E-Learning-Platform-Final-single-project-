import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courseData: [],
  loading: false,
  error: null,
};

const searchcourseSlice = createSlice({
  name: "searchcourse",
  initialState,
  reducers: {
    setSearchData: (state, action) => {
      state.courseData = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setSearchData, setLoading, setError } =
  searchcourseSlice.actions;

export default searchcourseSlice.reducer;