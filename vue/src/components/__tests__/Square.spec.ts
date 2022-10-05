import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import Square from '../Square.vue';

describe('Square', () => {
  it('renders properly', () => {
    const wrapper = mount(Square, { props: { value: 0 } });
    expect(wrapper.text()).not.toContain(0);
  });

  it('renders properly', () => {
    const wrapper = mount(Square, { props: { value: 2 } });
    expect(wrapper.text()).toContain(2);
  });
});
