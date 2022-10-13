import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import type { Tile } from '../../types';
import TileComponent from '../Tile.vue';

describe('Tile', () => {
  it("doesn't renders properly", () => {
    const data: Tile = { id: 'id', value: 0, x: 0, y: 0 };
    const wrapper = mount(TileComponent, { props: { data } });
    expect(wrapper.text()).not.toContain(0);
  });

  it('renders properly', () => {
    const data: Tile = { id: 'id', value: 2, x: 0, y: 0 };
    const wrapper = mount(TileComponent, { props: { data } });
    expect(wrapper.text()).toContain(2);
  });
});
