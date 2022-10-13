import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import Grid from '../Grid.vue';

describe('Grid', () => {
  it('renders correctly with the default size = 4', () => {
    const wrapper = mount(Grid);
    const cells = wrapper.findAll('.grid-cell');
    expect(cells.length).toBe(4 * 4);
  });

  it('renders correctly with size = 8', () => {
    const wrapper = mount(Grid, { props: { size: 8 } });
    const cells = wrapper.findAll('.grid-cell');
    expect(cells.length).toBe(8 * 8);
  });
});
