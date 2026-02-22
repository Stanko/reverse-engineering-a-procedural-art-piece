import { Ctrls } from '@stanko/ctrls';
// import { Ctrls } from '../../ctrls/src/ctrls/index';
import { config } from './options-config';

// Initialize options controls
export const controls = new Ctrls(config, {
  title: 'Creative Coding Amsterdam',
});
