import { css } from '@emotion/react';
import React, { memo, useMemo } from 'react';
import useComponentOverrides from '../../../theme/useComponentOverrides';
import { Box } from '../../../components/Box';

import Item from './ContextBlockItem';

const ContextBlock = ({ className, block, surfaceRenderer }) => {
  const { classNames, styleOverrides } = useComponentOverrides('ContextBlock');

  const itemElements = useMemo(
    () =>
      block.elements.map((element) => ({
        ...element,
        appId: block.appId,
        blockId: block.blockId,
      })),
    [block.appId, block.blockId, block.elements]
  );

  return (
    <Box
      css={css`
        display: flex;
        align-items: center;
        margin: -0.25rem;
      `}
      className={`ec-context-block ${className} ${classNames}`}
      style={styleOverrides}
    >
      {itemElements.map((element, i) => (
        <Item
          style={{ color: '#ccc' }}
          key={i}
          block={element}
          surfaceRenderer={surfaceRenderer}
          index={i}
        />
      ))}
    </Box>
  );
};

export default memo(ContextBlock);
