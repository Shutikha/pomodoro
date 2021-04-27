import React from 'react';
import styles from './text.module.css';
import classNames from 'classnames';
type TSizes= 10|14|16|18|20|28
export enum EColors {
  black = 'black',
  orange = 'orange',
  green = 'green',
  white = 'white',
  greyF4 = 'greyF4',
  greyF3 = 'greyF3',
  greyD9 = 'greyD9',
  greyC4 = 'greyC4',
  grey99 = 'grey99',
  grey66 = 'grey66',
}
interface ITextProps{
  As?: 'div'|'span'|'p'|'h1'|'h2'|'h3'|'h4',
  children?: React.ReactNode,
  size: TSizes,
  mobileSize?: TSizes,
  tabletSize?: TSizes,
  desktopSize?: TSizes,
  color?:EColors,
  bold?: boolean
}
export function Text(props: ITextProps):JSX.Element {
  const {As = 'span',bold=false,children, size, mobileSize, tabletSize, desktopSize, color= EColors.black} = props;
  const classes = classNames(
    styles[`s${size}`],
    styles[color],
    { [styles.bold] : bold},
    { [styles[`m${mobileSize}`]]:mobileSize },
    { [styles[`d${desktopSize}`]]:desktopSize },
    { [styles[`t${tabletSize}`]]:tabletSize },
  );
  return (
    <As className={classes}>
      {children}
    </As>
  );
}
