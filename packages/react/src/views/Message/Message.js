import React, { memo, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Attachments } from '../AttachmentHandler';
import { Markdown } from '../Markdown';
import MessageHeader from './MessageHeader';
import { useMessageStore, useUserStore } from '../../store';
import RCContext from '../../context/RCInstance';
import { Box } from '../../components/Box';
import { UiKitComponent, kitContext, UiKitMessage } from '../uiKit';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { appendClassNames } from '../../lib/appendClassNames';
import { MessageBody } from './MessageBody';
import { MessageReactions } from './MessageReactions';
import { MessageMetrics } from './MessageMetrics';
import { MessageToolbox } from './MessageToolbox';
import { MessageDivider } from './MessageDivider';
import { useToastBarDispatch } from '../../hooks/useToastBarDispatch';
import MessageAvatarContainer from './MessageAvatarContainer';
import MessageBodyContainer from './MessageBodyContainer';
import { LinkPreview } from '../LinkPreview';
import { MessageStyles as styles } from './Message.styles';

const Message = ({
  message,
  variant = 'default',
  sequential = false,
  newDay = false,
  showAvatar = false,
  className = '',
  style = {},
  showToolbox = true,
  showRoles = true,
}) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'Message',
    [message.messageParentBox, className],
    style
  );
  const { RCInstance } = useContext(RCContext);
  const authenticatedUserId = useUserStore((state) => state.userId);
  const authenticatedUserUsername = useUserStore((state) => state.username);
  const [setMessageToReport, toggletoggleShowReportMessage] = useMessageStore(
    (state) => [state.setMessageToReport, state.toggleShowReportMessage]
  );
  const dispatchToastMessage = useToastBarDispatch();
  const { editMessage, setEditMessage } = useMessageStore((state) => ({
    editMessage: state.editMessage,
    setEditMessage: state.setEditMessage,
  }));

  const setQuoteMessage = useMessageStore((state) => state.setQuoteMessage);

  const openThread = useMessageStore((state) => state.openThread);

  const handleStarMessage = async (msg) => {
    const isStarred =
      msg.starred && msg.starred.find((u) => u._id === authenticatedUserId);
    if (!isStarred) {
      await RCInstance.starMessage(msg._id);
      dispatchToastMessage({
        type: 'success',
        message: 'Message starred',
      });
    } else {
      await RCInstance.unstarMessage(msg._id);
      dispatchToastMessage({
        type: 'success',
        message: 'Message unstarred',
      });
    }
  };

  const handlePinMessage = async (msg) => {
    const isPinned = msg.pinned;
    const pinOrUnpin = isPinned
      ? await RCInstance.unpinMessage(msg._id)
      : await RCInstance.pinMessage(msg._id);
    if (pinOrUnpin.error) {
      dispatchToastMessage({
        type: 'error',
        message: 'Error pinning message',
      });
    } else {
      dispatchToastMessage({
        type: 'success',
        message: isPinned ? 'Message unpinned' : 'Message pinned',
      });
    }
  };

  const handleDeleteMessage = async (msg) => {
    const res = await RCInstance.deleteMessage(msg._id);

    if (res.success) {
      dispatchToastMessage({
        type: 'success',
        message: 'Message deleted successfully',
      });
    } else {
      dispatchToastMessage({
        type: 'error',
        message: 'Error in deleting message',
      });
    }
  };

  const handleEmojiClick = async (e, msg, canReact) => {
    const emoji = (e.names?.[0] || e.name).replace(/\s/g, '_');
    await RCInstance.reactToMessage(emoji, msg._id, canReact);
  };

  const handleOpenThread = (msg) => async () => {
    openThread(msg);
  };

  const context = useMemo(
    () => ({
      action: async ({ actionId, value, blockId, appId }) => {
        await RCInstance?.triggerBlockAction({
          blockId,
          actionId,
          value,
          mid: message._id,
          rid: RCInstance.rid,
          appId,
          container: {
            type: 'message',
            id: message._id,
          },
        });
      },
      appId: message.blocks && message.blocks[0] && message.blocks[0].appId,
      rid: RCInstance.rid,
    }),
    [RCInstance, message._id, message.blocks]
  );

  const isStarred = message.starred?.find((u) => u._id === authenticatedUserId);
  const isPinned = message.pinned;
  const shouldShowHeader = !sequential || (!showAvatar && isStarred);
  return (
    <>
      <Box
        className={appendClassNames('ec-message', classNames)}
        css={[
          styles.message,
          editMessage._id === message._id && styles.messageEditing,
        ]}
        style={styleOverrides}
      >
        {showAvatar && (
          <MessageAvatarContainer
            message={message}
            sequential={sequential}
            isStarred={isStarred}
            isPinned={isPinned}
          />
        )}
        <MessageBodyContainer>
          {shouldShowHeader && (
            <MessageHeader message={message} isRoles={showRoles} />
          )}
          {!message.t ? (
            <>
              <MessageBody css={message.isPending && styles.pendingMessageBody}>
                {message.attachments && message.attachments.length > 0 ? (
                  <>
                    <Markdown body={message} isReaction={false} />
                    <Attachments attachments={message.attachments} />
                  </>
                ) : (
                  <Markdown body={message} isReaction={false} />
                )}

                {message.urls &&
                  message.urls.map(
                    (url, index) =>
                      url.meta && (
                        <LinkPreview
                          key={index}
                          url={url.url}
                          meta={url.meta}
                        />
                      )
                  )}

                {message.blocks && (
                  <kitContext.Provider value={context} mid={message.mid}>
                    <UiKitComponent
                      render={UiKitMessage}
                      blocks={message.blocks}
                    />
                  </kitContext.Provider>
                )}
              </MessageBody>

              <MessageReactions
                authenticatedUserUsername={authenticatedUserUsername}
                message={message}
                handleEmojiClick={handleEmojiClick}
              />
            </>
          ) : (
            <>
              {message.attachments && (
                <Attachments attachments={message.attachments} />
              )}
            </>
          )}
          {message.tcount && variant !== 'thread' ? (
            <MessageMetrics
              message={message}
              handleOpenThread={handleOpenThread}
            />
          ) : null}
          {!message.t && showToolbox ? (
            <MessageToolbox
              message={message}
              isEditing={editMessage._id === message._id}
              authenticatedUserId={authenticatedUserId}
              handleOpenThread={handleOpenThread}
              handleDeleteMessage={handleDeleteMessage}
              handleStarMessage={handleStarMessage}
              handlePinMessage={handlePinMessage}
              handleEditMessage={() => {
                if (editMessage._id === message._id) {
                  setEditMessage({});
                } else {
                  setEditMessage(message);
                }
              }}
              handleQuoteMessage={() => setQuoteMessage(message)}
              handleEmojiClick={handleEmojiClick}
              handlerReportMessage={() => {
                setMessageToReport(message._id);
                toggletoggleShowReportMessage();
              }}
              isThreadMessage={variant === 'thread'}
            />
          ) : (
            <></>
          )}
        </MessageBodyContainer>
      </Box>
      {newDay ? (
        <MessageDivider>
          {format(new Date(message.ts), 'MMMM d, yyyy')}
        </MessageDivider>
      ) : null}
    </>
  );
};

Message.propTypes = {
  message: PropTypes.any,
  sequential: PropTypes.bool,
  newDay: PropTypes.bool,
  variant: PropTypes.oneOf(['thread', 'default']),
  showAvatar: PropTypes.bool,
};

export default memo(Message);
