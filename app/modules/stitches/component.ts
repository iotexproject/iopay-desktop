import { colors } from "../../constants/colors";
import { styled } from "./";

export const CommonMarginComponent = styled('div', {
  margin: '16px',
});

export const WalletTitleComponent = styled('h2', {
  fontWeight: 'bold',
});

export const StyleLinkComponent = styled('span', {
  color: colors.primary,
});

export const FormLabelComponent = styled('label', {
  fontWeight: 'bold',
});

export const InputErrorComponent = styled('div', {
  color: colors.error,
  height: '16px',
  lineHeight: '16px',
});

export const SimpleFlexComponent = styled('div', {
  height: '40px',
  width: '100%',
  display: "flex",
  "-webkit-box-flex": 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  "-webkit-justify-content": 'sapce-between',
  boxSizing: 'border-box',
  flexWrap: 'wrap',
  alignContent: 'space-between',
  alignItems: 'center',
});
