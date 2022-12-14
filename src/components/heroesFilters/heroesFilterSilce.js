import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useHttp } from '../../hooks/http.hook';
const initialState = {
  filters: [],
  filtersLoadingStatus: 'idle',
  activeFilter: 'all',
};
export const fetchFilters = createAsyncThunk('filters/fetchFilters', async () => {
  const { request } = useHttp();
  return await request('https://63657bce046eddf1baeeaba4.mockapi.io/filters');
});
const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    changeHeroFilter: (state, action) => {
      state.activeFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilters.pending, (state) => {
        state.filtersLoadingStatus = 'loading';
      })
      .addCase(fetchFilters.fulfilled, (state, action) => {
        state.filtersLoadingStatus = 'idle';
        state.filters = action.payload;
      })
      .addCase(fetchFilters.rejected, (state) => {
        state.filtersLoadingStatus = 'error';
      })
      .addDefaultCase(() => {});
  },
});

const { actions, reducer } = filtersSlice;
export default reducer;
export const { filtersFetching, filtersFetched, filtersFetchingError, changeHeroFilter } = actions;
