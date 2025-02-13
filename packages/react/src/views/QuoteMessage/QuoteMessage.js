import React, { useContext } from 'react';
import { format } from 'date-fns';
import { Box } from '../../components/Box';
import useComponentOverrides from '../../theme/useComponentOverrides';
import RCContext from '../../context/RCInstance';
import { Avatar } from '../../components/Avatar';
import { ActionButton } from '../../components/ActionButton';
import { Icon } from '../../components/Icon';
import { useMessageStore } from '../../store';
import styles from './QuoteMessage.styles';

const QuoteMessage = ({ className = '', style = {}, message }) => {
  const { RCInstance } = useContext(RCContext);
  const getUserAvatarUrl = (username) => {
    const host = RCInstance.getHost();
    const URL = `${host}/avatar/${username}`;
    return URL;
  };
  const setQuoteMessage = useMessageStore((state) => state.setQuoteMessage);

  const { classNames, styleOverrides } = useComponentOverrides('QuoteMessage');
  return (
    <Box
      className={`ec-quote-msg ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      css={styles.messageContainer}
    >
      <Box css={styles.actionBtn}>
        <ActionButton ghost onClick={() => setQuoteMessage({})} size="small">
          <Icon name="cross" size="0.75rem" />
        </ActionButton>
      </Box>
      <Box css={styles.avatarContainer}>
        <Avatar
          url={getUserAvatarUrl(message?.u.username)}
          alt="avatar"
          size="1.5em"
        />
        <Box>{message?.u.username}</Box>
        <Box>{format(new Date(message.ts), 'h:mm a')}</Box>
      </Box>
      <Box css={styles.message}>
        {message.msg
          ? message.msg
          : `${message.file?.name} (${
              message.file?.size ? (message.file.size / 1024).toFixed(2) : 0
            } kB)`}
      </Box>
    </Box>
  );
};

export default QuoteMessage;
