import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import { GameStatus } from '../../types';
import Modal from '../Modal.vue';

const config = {
  global: {
    plugins: [Antd],
    stubs: {
      transition: false,
      'transition-group': false,
    },
  },
};

describe('Modal', () => {
  it.skip('renders properly with won status', async () => {
    const wrapper = mount(Modal, config);
    const status: GameStatus = GameStatus.Won;
    await wrapper.setProps({ status });
    expect(wrapper.text()).toContain('You have won!');
  });

  it.skip('renders properly with lost status', async () => {
    const wrapper = mount(Modal, config);
    const status: GameStatus = GameStatus.Lost;
    await wrapper.setProps({ status });
    expect(wrapper.text()).toContain('You have lost!');
  });
});
