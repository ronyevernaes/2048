import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import { GameStatus } from '../../types';

import Modal from '../Modal.vue';

describe('Modal', () => {
  it('renders properly with won status', async () => {
    const wrapper = mount(Modal);
    await wrapper.setProps({ status: GameStatus.Won });
    expect(wrapper.text()).toContain('You have won!');
  });

  it('renders properly with lost status', async () => {
    const wrapper = mount(Modal);
    await wrapper.setProps({ status: GameStatus.Lost });
    expect(wrapper.text()).toContain('You have lost!');
  });
});
