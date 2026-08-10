import { describe, expect, it } from 'vitest';
import { shouldPromoteMeasuredWrap } from './visual-gate';

describe('visual gate helpers', () => {
  it('promotes measured wrap when the diff budget is exceeded', () => {
    expect(shouldPromoteMeasuredWrap(0.01)).toBe(false);
    expect(shouldPromoteMeasuredWrap(0.05)).toBe(true);
  });
});
