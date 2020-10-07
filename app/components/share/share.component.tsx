import { styled } from 'onefx/lib/styletron-react';
import { colors } from '../../constants/colors';

export const CommonMargin = styled('div', () => ({
  margin: '16px',
}));

export const WalletTitle = styled('p', {
  fontSize: '24px',
  fontWeight: 'bold',
});

export const StyleLink = styled('span', {
  color: colors.primary,
});
