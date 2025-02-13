import { css } from '@emotion/react';

const rowCentreAlign = css`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const styles = {
  clearSpacing: css`
    margin: 0;
    padding: 0;
  `,

  chatHeaderChild: css`
    ${rowCentreAlign}
    justify-content: space-between;
    width: 100%;
  `,
  chatHeaderParent: css`
    width: 100%;
    z-index: 100;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
    border: 1px solid rgba(0, 0, 0, 0.5);
  `,

  channelDescription: css`
    ${rowCentreAlign}
    gap: 0.5rem;
  `,

  chatHeaderIconRow: css`
    ${rowCentreAlign}
    gap:0.125em
  `,
};

export default styles;
