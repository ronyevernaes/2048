import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import Tile from '../Tile.vue';

describe('Tile', () => {
  it("doesn't renders properly", () => {
    const wrapper = mount(Tile, { props: { value: 0 } });
    expect(wrapper.text()).not.toContain(0);
  });

  it('renders properly', () => {
    const wrapper = mount(Tile, { props: { value: 2 } });
    expect(wrapper.text()).toContain(2);
  });
});
