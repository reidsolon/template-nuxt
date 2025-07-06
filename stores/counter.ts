import { defineStore } from 'pinia';

interface CounterState {
  count: number;
}

const initialState: CounterState = {
  count: 0,
};

export const useCounterStore = defineStore('counter', () => {
  // State
  const state = ref<CounterState>(initialState);

  // Getters
  const doubleCount = computed(() => state.value.count * 2);

  // Actions
  const increment = (): void => {
    state.value.count++;
  };

  const decrement = (): void => {
    state.value.count--;
  };

  const reset = (): void => {
    state.value.count = 0;
  };

  return {
    // State
    state: readonly(state),
    // Getters
    doubleCount,
    // Actions
    increment,
    decrement,
    reset,
  };
});
