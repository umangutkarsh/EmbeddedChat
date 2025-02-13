import React, { useEffect, useMemo, useState } from 'react';
import { css, useTheme } from '@emotion/react';
import { Box } from '../Box';
import { ActionButton } from '../ActionButton';
import MenuItem from './MenuItem';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { appendClassNames } from '../../lib/appendClassNames';
import { Tooltip } from '../Tooltip';
import { MenuStyles as styles } from './Menu.styles';

const Menu = ({
  options = [],
  className = '',
  style = {},
  anchor = 'right bottom',
  isToolTip = true,
}) => {
  const theme = useTheme();

  const { classNames, styleOverrides } = useComponentOverrides(
    'Menu',
    className,
    style
  );
  const anchorStyle = useMemo(() => {
    const positions = anchor.split(/\s+/);
    const styleAnchor = {};
    positions.forEach((pos) => {
      styleAnchor[pos] = 0;
    });
    return styleAnchor;
  }, [anchor]);

  const finalStyle = useMemo(
    () => ({ ...styleOverrides, ...anchorStyle }),
    [anchorStyle, styleOverrides]
  );

  const { classNames: wrapperClasses, styleOverrides: wrapperStyles } =
    useComponentOverrides('MenuWrapper');

  const [isOpen, setOpen] = useState(false);

  const onClick = (action, disabled) => () => {
    if (!disabled) {
      action();
      setOpen(!isOpen);
    }
  };

  useEffect(() => {
    const onBodyClick = (e) => {
      if (isOpen && !e.target.classList.contains('ec-menu-wrapper')) {
        setOpen(false);
      }
    };
    document.body.addEventListener('click', onBodyClick);

    return () => document.body.removeEventListener('click', onBodyClick);
  }, [isOpen]);

  return (
    <Box
      css={styles.wrapper}
      className={appendClassNames('ec-menu-wrapper', wrapperClasses)}
      style={wrapperStyles}
    >
      {isToolTip ? (
        <Tooltip text="Options" position="bottom">
          {' '}
          <ActionButton ghost icon="kebab" onClick={() => setOpen(!isOpen)} />
        </Tooltip>
      ) : (
        <ActionButton ghost icon="kebab" onClick={() => setOpen(!isOpen)} />
      )}
      {isOpen ? (
        <Box
          css={[
            styles.container,
            css`
              box-shadow: ${theme.shadows[2]};
            `,
          ]}
          className={appendClassNames('ec-menu', classNames)}
          style={finalStyle}
        >
          {options.map((option, idx) => (
            <MenuItem
              {...option}
              key={option.id || idx}
              action={onClick(option.action, option.disabled)}
            />
          ))}
        </Box>
      ) : null}
    </Box>
  );
};

export default Menu;
