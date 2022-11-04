import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';
import { useHttp } from '../../hooks/http.hook';

const heroAdapter = createEntityAdapter();
const initialState = heroAdapter.getInitialState({
  heroesLoadingStatus: 'idle',
});
export const fetchHeroes = createAsyncThunk('heroes/fetchHeroes', async () => {
  const { request } = useHttp();
  return await request('https://63657bce046eddf1baeeaba4.mockapi.io/heroes');
});
const heroesSlice = createSlice({
  name: 'heroes',
  initialState,
  reducers: {
    heroesAdding: (state, action) => {
      heroAdapter.addOne(state, action.payload);
    },
    heroesDeleting: (state, action) => {
      heroAdapter.removeOne(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeroes.pending, (state) => {
        state.heroesLoadingStatus = 'loading';
      })
      .addCase(fetchHeroes.fulfilled, (state, action) => {
        state.heroesLoadingStatus = 'idle';
        heroAdapter.setAll(state, action.payload);
      })
      .addCase(fetchHeroes.rejected, (state) => {
        state.heroesLoadingStatus = 'error';
      })
      .addDefaultCase(() => {});
  },
});

const { actions, reducer } = heroesSlice;
export default reducer;
export const { selectAll } = heroAdapter.getSelectors((state) => state.heroes);
export const heroesSelector = createSelector(
  selectAll,
  (state) => state.filters.activeFilter,
  (heroes, filter) => {
    if (filter === 'all') {
      return heroes;
    } else {
      return heroes.filter((item) => item.element === filter);
    }
  }
);
export const { heroesFetching, heroesFetched, heroesFetchingError, heroesAdding, heroesDeleting } =
  actions;
